"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const HOBBIES = [
  { 
    id: "01", 
    name: "Photography", 
    type: "Visual",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    rotation: -6,
    x: -10,
    y: -5
  },
  { 
    id: "02", 
    name: "Music", 
    type: "Audio",
    img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop",
    rotation: 4,
    x: 15,
    y: -10
  },
  { 
    id: "03", 
    name: "Travel", 
    type: "Life",
    img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop",
    rotation: -3,
    x: -20,
    y: 10
  },
  { 
    id: "04", 
    name: "Gaming", 
    type: "Digital",
    img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop",
    rotation: 7,
    x: 20,
    y: 5
  },
  { 
    id: "05", 
    name: "Cinema", 
    type: "Art",
    img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
    rotation: -5,
    x: 0,
    y: 0
  },
];

export default function HobbiesAccordion() {
  const [hovered, setHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full min-h-screen bg-[#050505] overflow-hidden flex flex-col items-center justify-center py-20">
      
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h2 className="text-[20vw] font-bold text-[#111] leading-none tracking-tighter">
          ARCHIVE
        </h2>
      </div>

      {/* Header */}
      <div className="absolute top-10 left-0 w-full px-10 flex justify-between items-start z-20">
        <div>
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest mb-2">
            [ Collection 05 ]
          </p>
          <h3 className="text-white text-2xl font-medium">Personal Interests</h3>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-neutral-600 text-sm max-w-[200px]">
            Drag, hover, and explore the fragments of my digital soul.
          </p>
        </div>
      </div>

      {/* The Scattered Cards */}
      <div ref={containerRef} className="relative w-full max-w-6xl h-[60vh] md:h-[80vh] flex items-center justify-center perspective-1000">
        {HOBBIES.map((hobby, index) => {
          const isHovered = hovered === index;
          const isBlur = hovered !== null && hovered !== index;

          return (
            <motion.div
              key={hobby.id}
              className="absolute w-[280px] md:w-[350px] aspect-[3/4] bg-neutral-900 p-2 shadow-2xl cursor-pointer"
              initial={{ 
                rotate: hobby.rotation, 
                x: hobby.x * 10, 
                y: hobby.y * 5,
                scale: 1
              }}
              animate={{ 
                rotate: isHovered ? 0 : hobby.rotation,
                x: isHovered ? 0 : hobby.x * 10,
                y: isHovered ? 0 : hobby.y * 5,
                scale: isHovered ? 1.2 : isBlur ? 0.9 : 1,
                zIndex: isHovered ? 50 : index,
                filter: isBlur ? "blur(4px) brightness(0.5)" : "blur(0px) brightness(1)",
              }}
              transition={{ duration: 0.4, ease: "backOut" }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ scale: 1.2 }}
              drag
              dragConstraints={containerRef}
              dragElastic={0.1}
            >
              {/* Polaroid-style Image */}
              <div className="relative w-full h-[85%] bg-black overflow-hidden">
                <Image
                  src={hobby.img}
                  alt={hobby.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out"
                  style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
                />
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Label */}
              <div className="h-[15%] flex items-center justify-between px-4 bg-white">
                <span className="text-black font-bold uppercase tracking-tight text-lg">
                  {hobby.name}
                </span>
                <span className="text-neutral-400 font-mono text-xs">
                  {hobby.id}
                </span>
              </div>

              {/* Floating Tag (Visible on Hover) */}
              <motion.div
                className="absolute -top-4 -right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              >
                {hobby.type}
              </motion.div>

            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
