"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrambleText from "./ScrambleText";
import { siReact, siTypescript, siThreedotjs, siNodedotjs, siFigma, siGreensock } from "simple-icons";

const SKILLS = [
  { name: "React / Next.js", category: "Frontend", icon: siReact,      bg: "#20232a" },
  { name: "TypeScript",      category: "Language",  icon: siTypescript, bg: "#3178c6" },
  { name: "WebGL / Three.js",category: "Creative",  icon: siThreedotjs, bg: "#1a1a1a" },
  { name: "Node.js / Backend",category: "Server",   icon: siNodedotjs,  bg: "#1a1a1a" },
  { name: "UI / UX Design",  category: "Design",    icon: siFigma,      bg: "#1e1e1e" },
  { name: "Motion / GSAP",   category: "Animation", icon: siGreensock,  bg: "#0ae448" },
];

export default function SkillsList() {
  const [activeSkill, setActiveSkill] = useState<number | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      // Only move cursor on desktop
      if (window.matchMedia("(min-width: 768px)").matches) {
          gsap.to(cursorRef.current, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5,
            ease: "power2.out",
          });
      }
    };

    window.addEventListener("mousemove", moveCursor);

    gsap.registerPlugin(ScrollTrigger);

    // Entrance Animation
    const ctx = gsap.context(() => {

        // Trigger Header Scramble
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 80%",
            onEnter: () => setHeaderVisible(true)
        });

        // Header title masked reveal
        gsap.fromTo(".skills-title-word",
          { y: "110%" },
          { y: "0%", duration: 1, ease: "power4.out",
            scrollTrigger: { trigger: containerRef.current, start: "top 80%" }
          }
        );

        // Header border draws in
        gsap.fromTo(".skills-header-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power4.inOut", transformOrigin: "left",
            scrollTrigger: { trigger: containerRef.current, start: "top 80%" }
          }
        );

        // Row borders draw in per element
        gsap.utils.toArray<HTMLElement>(".skill-border").forEach((el) => {
          gsap.fromTo(el,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: "power4.inOut", transformOrigin: "left",
              scrollTrigger: { trigger: el, start: "top 92%" }
            }
          );
        });

        // Skill names — masked slide up
        gsap.utils.toArray<HTMLElement>(".skill-name").forEach((el) => {
          gsap.fromTo(el,
            { y: "100%" },
            { y: "0%", duration: 0.9, ease: "power4.out",
              scrollTrigger: { trigger: el, start: "top 94%" }
            }
          );
        });

        // Category labels — fade in from right
        gsap.utils.toArray<HTMLElement>(".skill-cat").forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, x: 15 },
            { opacity: 1, x: 0, duration: 0.6, ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 92%" }
            }
          );
        });
    }, containerRef);

    return () => {
        window.removeEventListener("mousemove", moveCursor);
        ctx.revert();
    };
  }, []);

  // Text Glitch Effect
  const triggerGlitch = (e: React.MouseEvent<HTMLElement>) => {
      const target = e.currentTarget.querySelector("h3");
      if (!target) return;

      const originalText = target.dataset.text || target.innerText;
      if (!target.dataset.text) target.dataset.text = originalText;

      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";

      let iterations = 0;
      const interval = setInterval(() => {
        target.innerText = originalText
          .split("")
          .map((letter: string, index: number) => {
            if (index < iterations) return originalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");

        if (iterations >= originalText.length) {
            clearInterval(interval);
            target.innerText = originalText;
        }
        iterations += 1 / 2;
      }, 30);
  };

  return (
    <section ref={containerRef} className="relative w-full py-20 md:py-40 text-white overflow-hidden md:cursor-none [&:hover~*_.custom-cursor]:!opacity-0"
      onMouseEnter={() => {
        document.querySelectorAll('[data-custom-cursor]').forEach(el => (el as HTMLElement).style.opacity = '0');
      }}
      onMouseLeave={() => {
        document.querySelectorAll('[data-custom-cursor]').forEach(el => (el as HTMLElement).style.opacity = '');
      }}
    >

      {/* Floating Image Cursor (Custom Design) */}
      <div
        ref={cursorRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-0 md:left-0 h-[180px] pointer-events-none z-[9999] md:-translate-x-1/2 md:-translate-y-1/2 flex items-stretch"
        style={{ opacity: activeSkill !== null ? 1 : 0, transition: "opacity 0.3s ease-out" }}
      >
        {/* Icon Container */}
        <div className="relative w-[250px]">
            {SKILLS.map((skill, i) => (
                <div
                    key={i}
                    className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center"
                    style={{
                        opacity: activeSkill === i ? 1 : 0,
                        zIndex: activeSkill === i ? 10 : 1,
                    }}
                >
                    <svg
                        role="img"
                        viewBox="0 0 24 24"
                        className="w-24 h-24"
                        fill={skill.icon.hex === "000000" ? "#ffffff" : `#${skill.icon.hex}`}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d={skill.icon.path} />
                    </svg>
                </div>
            ))}
        </div>
      </div>

      <div className="px-6 md:px-20">
        <div className="mb-12 pb-6">
          <span className="text-sm md:text-base font-mono text-[#fbbf24] uppercase tracking-widest block mb-4">
            <ScrambleText text="[ Technical Arsenal ]" trigger={headerVisible} className="inline-block" />
          </span>
          <div className="overflow-hidden">
            <h2 className="skills-title-word text-5xl md:text-[7.5vw] font-black text-white uppercase tracking-tighter leading-[0.8]">
              Skills
            </h2>
          </div>
          <div className="skills-header-line w-full h-[1px] bg-white/20 mt-6 origin-left" />
        </div>

        <div className="flex flex-col">
            {SKILLS.map((skill, i) => (
                <div key={i}>
                    <div className="skill-border w-full h-[1px] bg-white/20 origin-left" />
                    <div
                        className="skill-item group relative flex items-center justify-between py-6 md:py-12 px-4 md:px-8 transition-colors duration-300 hover:bg-black z-20 cursor-pointer md:cursor-none"
                        onMouseEnter={(e) => {
                            setActiveSkill(i);
                            triggerGlitch(e);
                        }}
                        onMouseLeave={() => setActiveSkill(null)}
                        onClick={() => setActiveSkill(activeSkill === i ? null : i)}
                    >
                        <div className="overflow-hidden">
                          <h3 className={`skill-name text-2xl md:text-7xl font-black uppercase tracking-tighter transition-colors duration-300 ${activeSkill === i ? 'text-[#fbbf24]' : 'text-white group-hover:text-[#fbbf24]'}`}>
                              {skill.name}
                          </h3>
                        </div>
                        <span className={`skill-cat text-xs md:text-sm font-mono uppercase tracking-widest transition-colors whitespace-nowrap ml-4 ${activeSkill === i ? 'text-[#fbbf24]' : 'text-white/90 md:text-white/60 group-hover:text-[#fbbf24]'}`}>
                            {skill.category}
                        </span>
                    </div>
                </div>
            ))}
            <div className="skill-border w-full h-[1px] bg-white/20 origin-left" />
        </div>
      </div>
    </section>
  );
}
