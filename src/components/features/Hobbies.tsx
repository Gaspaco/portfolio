"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

const HOBBIES = [
  { name: "Photography", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop" },
  { name: "Music", img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000&auto=format&fit=crop" },
  { name: "Travel", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop" },
  { name: "Gaming", img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1000&auto=format&fit=crop" },
  { name: "Reading", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop" },
  { name: "Cinema", img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000&auto=format&fit=crop" },
  { name: "Coding", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop" },
  { name: "Art", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop" },
  { name: "Design", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop" }
];

export default function Hobbies() {
  const containerRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Parallax Columns
      gsap.to(col1Ref.current, {
        y: -150,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(col2Ref.current, {
        y: 150,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(col3Ref.current, {
        y: -150,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#8c1921] py-20 overflow-hidden">
        <div className="absolute top-10 left-10 z-10 mix-blend-difference">
            <h2 className="text-6xl font-black text-white uppercase tracking-tighter">
                The Archive
            </h2>
            <p className="text-sm text-white/60 uppercase tracking-widest mt-2">
                Selected Interests & Obsessions
            </p>
        </div>

        <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-[120vw] -ml-[10vw] h-[120vh] rotate-[-5deg] scale-110 opacity-80 hover:opacity-100 transition-opacity duration-700">
            {/* Column 1 */}
            <div ref={col1Ref} className="flex flex-col gap-8 mt-[-20vh]">
                {HOBBIES.slice(0, 3).map((hobby, i) => (
                    <div key={i} className="relative w-full aspect-[3/4] bg-black/20 grayscale hover:grayscale-0 transition-all duration-500">
                        <Image 
                            src={hobby.img} 
                            alt={hobby.name} 
                            fill 
                            sizes="(max-width: 768px) 33vw, 20vw"
                            loading="lazy"
                            className="object-cover" 
                        />
                    </div>
                ))}
            </div>

            {/* Column 2 */}
            <div ref={col2Ref} className="flex flex-col gap-8 mt-[10vh]">
                {HOBBIES.slice(3, 6).map((hobby, i) => (
                    <div key={i} className="relative w-full aspect-[3/4] bg-black/20 grayscale hover:grayscale-0 transition-all duration-500">
                        <Image 
                            src={hobby.img} 
                            alt={hobby.name} 
                            fill 
                            sizes="(max-width: 768px) 33vw, 20vw"
                            loading="lazy"
                            className="object-cover" 
                        />
                    </div>
                ))}
            </div>

            {/* Column 3 */}
            <div ref={col3Ref} className="flex flex-col gap-8 mt-[-10vh]">
                {HOBBIES.slice(6, 9).map((hobby, i) => (
                    <div key={i} className="relative w-full aspect-[3/4] bg-black/20 grayscale hover:grayscale-0 transition-all duration-500">
                        <Image 
                            src={hobby.img} 
                            alt={hobby.name} 
                            fill 
                            sizes="(max-width: 768px) 33vw, 20vw"
                            loading="lazy"
                            className="object-cover" 
                        />
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
