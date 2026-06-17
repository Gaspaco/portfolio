"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const images: string[] = [];

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<{x: number, y: number}[]>([]);

  useEffect(() => {
    // Generate stable random positions on mount
    const newPositions = images.map(() => ({
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 80
    }));
    setPositions(newPositions);
  }, []);

  useEffect(() => {
    if (positions.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          scrub: true,
          pin: true,
        }
      });

      // Zoom Effect
      tl.to(centerRef.current, {
        scale: 3,
        opacity: 0,
        duration: 1,
        ease: "power1.inOut",
      })
      .to(".gallery-item", {
        scale: 1,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
        ease: "power1.inOut",
      }, "<");

    }, containerRef);

    return () => ctx.revert();
  }, [positions]);

  return (
    <section ref={containerRef} className="h-screen w-full overflow-hidden relative flex items-center justify-center">
      
      {/* Center Image (Zoom Target) */}
      <div ref={centerRef} className="absolute w-[60vw] md:w-[30vw] aspect-video z-20 bg-neutral-200" />

      {/* Surrounding Images */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
        {positions.map((pos, i) => (
            <div 
                key={i} 
                className="gallery-item absolute w-[20vw] aspect-video opacity-0 scale-50"
                style={{ 
                    transform: `translate(${pos.x}vw, ${pos.y}vh)`,
                    zIndex: 10
                }}
            >
                <Image 
                  src={images[i]} 
                  alt="Gallery" 
                  fill 
                  sizes="20vw"
                  loading="lazy"
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                />
            </div>
        ))}
      </div>

      <div className="absolute bottom-10 left-10 text-white/50 text-sm uppercase tracking-widest z-30">
        Visual Exploration
      </div>

    </section>
  );
}
