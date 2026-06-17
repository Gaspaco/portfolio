"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const SKILLS = [
  "TypeScript", "React", "Next.js", "GSAP", "WebGL", 
  "Node.js", "Tailwind", "Three.js", "Design", "UI/UX",
  "Python", "AWS", "Docker", "Figma", "Shaders"
];

export default function GravitySkills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Move the spotlight gradient
      gsap.to(overlay, {
        background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 40%)`,
        duration: 0.4,
        ease: "power2.out"
      });

      // Magnetic effect on text
      const items = container.querySelectorAll(".skill-item");
      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemX = itemRect.left + itemRect.width / 2 - rect.left;
        const itemY = itemRect.top + itemRect.height / 2 - rect.top;
        
        const dist = Math.hypot(x - itemX, y - itemY);
        const maxDist = 300;

        if (dist < maxDist) {
          const power = (1 - dist / maxDist) * 30;
          const angle = Math.atan2(y - itemY, x - itemX);
          gsap.to(item, {
            x: Math.cos(angle) * power,
            y: Math.sin(angle) * power,
            scale: 1 + (1 - dist / maxDist) * 0.2,
            color: "#fff",
            duration: 0.4,
            overwrite: "auto"
          });
        } else {
          gsap.to(item, {
            x: 0,
            y: 0,
            scale: 1,
            color: "#444",
            duration: 0.4,
            overwrite: "auto"
          });
        }
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full py-20 bg-[#8c1921] overflow-hidden cursor-none">
      {/* Spotlight Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500"
        style={{ background: "radial-gradient(600px circle at 50% 50%, rgba(255,255,255,0.1), transparent 40%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 text-center">
          {SKILLS.map((skill, i) => (
            <div 
              key={i} 
              className="skill-item text-4xl md:text-6xl font-black uppercase tracking-tighter text-black/40 transition-colors duration-300 select-none"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
