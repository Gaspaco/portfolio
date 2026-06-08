"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Home", href: "/", id: "01" },
  { label: "Work", href: "#work", id: "02" },
  { label: "About", href: "#about", id: "03" },
  { label: "Contact", href: "#contact", id: "04" },
];

export default function Menu({ isOpen, onClose }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true });

      tl.current
        // 1. Overlay expands (clip path)
        .to(menuRef.current, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.8,
          ease: "power4.inOut",
        })
        // 2. Grid lines expand
        .from(".menu-divider", {
          scaleX: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.inOut",
          transformOrigin: "left"
        }, "-=0.4")
        // 3. Text reveals (Small text)
        .fromTo(".menu-text", 
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power3.out",
          }, 
          "-=0.6"
        )
        // 4. Main Links Skew Reveal
        .fromTo(".menu-link-text",
          { y: "150%", skewY: 10 },
          {
            y: "0%",
            skewY: 0,
            duration: 1.2,
            stagger: 0.08,
            ease: "expo.out",
            clearProps: "transform" // Allow CSS hover to take over
          },
          "-=0.8"
        );

    }, menuRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (tl.current) {
      if (isOpen) {
        tl.current.play();
      } else {
        tl.current.reverse();
      }
    }
  }, [isOpen]);

  return (
    <div 
        ref={menuRef} 
        className="fixed inset-0 z-50 w-full h-screen bg-[#8c1921] text-white flex flex-col"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
    >
        {/* Header Row */}
        <div className="w-full h-20 border-b border-white/20 flex items-center px-6 md:px-12 justify-between menu-divider origin-left">
            <span className="font-mono text-xs uppercase tracking-widest text-white/50 menu-text">Navigation</span>
            <button onClick={onClose} className="font-mono text-xs uppercase tracking-widest text-white hover:text-[#fbbf24] transition-colors menu-text">
                [ Close ]
            </button>
        </div>

        {/* Main Links Area */}
        <div className="flex-1 flex flex-col">
            {menuItems.map((item, i) => (
                <div key={i} className="relative flex-1 border-b border-white/20 group overflow-hidden menu-divider origin-left">
                    <Link 
                        href={item.href} 
                        onClick={onClose}
                        className="absolute inset-0 flex items-center justify-between px-6 md:px-12 md:hover:bg-black/20 transition-colors duration-500"
                    >
                        <div className="relative overflow-hidden h-[1.2em] text-5xl md:text-7xl">
                            {/* Original Text */}
                            <span className="block font-black uppercase tracking-tighter leading-none text-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[125%] menu-link-text">
                                {item.label}
                            </span>
                            {/* Hover Text (Gold) */}
                            <span className="absolute top-0 left-0 block font-black uppercase tracking-tighter leading-none text-[#fbbf24] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-[125%] group-hover:translate-y-0">
                                {item.label}
                            </span>
                        </div>
                        <span className="font-mono text-sm text-white/60 group-hover:text-white transition-colors duration-300 menu-text">
                            {item.id}
                        </span>
                    </Link>
                </div>
            ))}
        </div>

        {/* Footer Row */}
        <div className="w-full h-auto md:h-32 border-t border-white/20 flex flex-col md:flex-row menu-divider origin-left">
            <div className="flex-1 border-r border-white/20 p-6 md:p-8 flex flex-col justify-between hover:bg-black/20 transition-colors">
                <span className="font-mono text-xs text-white/50 uppercase tracking-widest menu-text">Socials</span>
                <div className="flex gap-4 mt-4 menu-text">
                    <a href="https://www.instagram.com/nik0d_/" target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:text-[#fbbf24] transition-colors">Instagram</a>
                    <a href="#" className="text-lg font-bold hover:text-[#fbbf24] transition-colors">Twitter</a>
                    <a href="https://www.linkedin.com/in/niko-dima-64246b33a/" target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:text-[#fbbf24] transition-colors">LinkedIn</a>
                </div>
            </div>
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between hover:bg-black/20 transition-colors">
                <span className="font-mono text-xs text-white/50 uppercase tracking-widest menu-text">Contact</span>
                <a href="mailto:nikodima2007@gmail.com" className="text-lg md:text-2xl font-bold mt-4 hover:text-[#fbbf24] transition-colors menu-text">
                    nikodima2007@gmail.com
                </a>
            </div>
        </div>
    </div>
  );
}
