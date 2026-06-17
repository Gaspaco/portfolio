"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

const SKILLS = [
  { name: "React / Next.js", category: "Frontend", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop" },
  { name: "WebGL / Three.js", category: "Creative", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" },
  { name: "TypeScript", category: "Language", img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000&auto=format&fit=crop" },
  { name: "Node.js / AWS", category: "Backend", img: "https://images.unsplash.com/photo-1623282033815-40b05d96c903?q=80&w=1000&auto=format&fit=crop" },
  { name: "UI / UX Design", category: "Design", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop" }
];

export default function KineticSkills() {
  const [activeImage, setActiveImage] = useState(SKILLS[0].img);
  const cursorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out"
      });
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  const handleMouseEnter = (img: string) => {
    setActiveImage(img);
    gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
  };

  const handleMouseLeave = () => {
    gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3 });
  };

  return (
    <section ref={containerRef} className="relative w-full py-20 bg-[#8c1921] text-white overflow-hidden cursor-none">
      
      {/* Floating Image Reveal (Follows Cursor) */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-[300px] h-[400px] pointer-events-none z-50 mix-blend-difference hidden md:block"
        style={{ transform: "translate(-50%, -50%) scale(0)", opacity: 0 }}
      >
        <div className="relative w-full h-full overflow-hidden rounded-lg">
            <Image 
                src={activeImage} 
                alt="Skill Preview" 
                fill 
                sizes="300px"
                loading="lazy"
                className="object-cover grayscale contrast-125"
            />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 border-b border-neutral-800 pb-4">
            <h2 className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                {'//'} Technical Arsenal
            </h2>
        </div>

        <div className="flex flex-col" onMouseLeave={handleMouseLeave}>
            {SKILLS.map((skill, i) => (
                <div 
                    key={i}
                    className="group relative flex items-center justify-between py-12 border-b border-white/20 transition-all duration-300 hover:px-8 hover:bg-black/20"
                    onMouseEnter={() => handleMouseEnter(skill.img)}
                >
                    <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white/60 group-hover:text-white transition-colors duration-300 z-10">
                        {skill.name}
                    </h3>
                    <span className="text-sm font-mono text-white/60 group-hover:text-accent-secondary transition-colors duration-300 z-10">
                        [{skill.category}]
                    </span>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
