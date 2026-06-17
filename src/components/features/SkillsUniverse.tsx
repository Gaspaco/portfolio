"use client";

import { useEffect, useRef, useState } from "react";

const SKILLS = [
  "React", "Next.js", "TypeScript", "Node.js", "WebGL", 
  "Three.js", "GSAP", "Tailwind", "AWS", "Docker", 
  "Figma", "Python", "Rust", "GraphQL", "PostgreSQL",
  "Redis", "CI/CD", "Git", "Linux", "Netlify"
];

export default function SkillsUniverse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tags: { x: number; y: number; z: number; element: HTMLDivElement }[] = [];
    const radius = 300; // Sphere radius
    
    // Create tags and place them on a sphere
    SKILLS.forEach((skill, i) => {
      const el = document.createElement("div");
      el.innerText = skill;
      el.className = "absolute text-white font-bold text-xl md:text-2xl whitespace-nowrap pointer-events-none mix-blend-difference";
      el.style.willChange = "transform, opacity";
      container.appendChild(el);

      // Fibonacci Sphere Algorithm
      const phi = Math.acos(-1 + (2 * i) / SKILLS.length);
      const theta = Math.sqrt(SKILLS.length * Math.PI) * phi;

      tags.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        element: el
      });
    });

    let angleX = 0;
    let angleY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2) * 0.0005;
      mouseY = (e.clientY - rect.top - rect.height / 2) * 0.0005;
    };

    const animate = () => {
      // Rotate sphere
      angleX += (mouseY - angleX) * 0.05;
      angleY += (mouseX - angleY) * 0.05;

      // Auto rotation if not hovered
      if (!isHovered) {
          angleY += 0.002;
      }

      const cx = Math.cos(angleX);
      const sx = Math.sin(angleX);
      const cy = Math.cos(angleY);
      const sy = Math.sin(angleY);

      tags.forEach((tag) => {
        // 3D Rotation Matrix
        let x = tag.x;
        let y = tag.y;
        let z = tag.z;

        // Rotate X
        const y1 = y * cx - z * sx;
        const z1 = z * cx + y * sx;
        y = y1;
        z = z1;

        // Rotate Y
        const x1 = x * cy - z * sy;
        const z2 = z * cy + x * sy;
        x = x1;
        z = z2;

        // Projection
        const scale = 400 / (400 - z);
        const alpha = (z + radius) / (2 * radius);
        
        tag.element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        tag.element.style.opacity = `${alpha + 0.2}`;
        tag.element.style.zIndex = `${Math.floor(z)}`;
        tag.element.style.filter = `blur(${(1 - alpha) * 4}px)`;
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      tags.forEach(t => t.element.remove());
    };
  }, [isHovered]);

  return (
    <div 
        className="relative w-full h-[800px] flex items-center justify-center overflow-hidden bg-neutral-950"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-neutral-950 to-neutral-950" />
        
        <div className="absolute top-10 left-10 z-10">
            <h2 className="text-xs font-mono text-red-500 uppercase tracking-widest">
                {'//'} Neural Network
            </h2>
        </div>

        <div ref={containerRef} className="relative flex items-center justify-center w-full h-full perspective-[1000px]" />
    </div>
  );
}
