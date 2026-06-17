"use client";

import { useState } from "react";
import Image from "next/image";

const HOBBIES = [
  { name: "Photography", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop" },
  { name: "Music", img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop" },
  { name: "Travel", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop" },
  { name: "Gaming", img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop" },
  { name: "Reading", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop" },
  { name: "Cinema", img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop" },
];

export default function FocusGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full py-20 bg-[#8c1921] overflow-hidden">
        <div className="px-6 md:px-20 mb-12 flex items-end justify-between border-b border-white/20 pb-6">
            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                The <br/> <span className="text-[#fbbf24]">Archive</span>
            </h2>
            <p className="text-xs font-mono text-white/50 uppercase tracking-widest mb-2">
                [ Select Data Point ]
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 px-4 md:px-20 h-[80vh]">
            {HOBBIES.map((hobby, i) => (
                <div 
                    key={i}
                    className="relative w-full h-full overflow-hidden group transition-all duration-500 ease-out"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                        opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.3 : 1,
                        filter: hoveredIndex !== null && hoveredIndex !== i ? "blur(4px) grayscale(100%)" : "none",
                        transform: hoveredIndex !== null && hoveredIndex !== i ? "scale(0.95)" : "scale(1)"
                    }}
                >
                    <Image 
                        src={hobby.img} 
                        alt={hobby.name} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-gradient-to-t from-black/90 to-transparent">
                        <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">
                            {hobby.name}
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    </section>
  );
}
