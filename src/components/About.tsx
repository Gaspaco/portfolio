"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import GrainOverlay from "./GrainOverlay";
import SkillsList from "./SkillsList";
import ScrambleText from "./ScrambleText";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const glitchIntervals = useRef<Map<HTMLElement, ReturnType<typeof setInterval>>>(new Map());

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      

      // 1. HERO: ELASTIC EXPLOSION
      const words = gsap.utils.toArray(".hero-word", containerRef.current);
      gsap.fromTo(words, 
        { 
            y: 300, 
            x: () => gsap.utils.random(-100, 100), 
            rotation: () => gsap.utils.random(-45, 45),
            opacity: 0,
            scale: 0 
        },
        {
            y: 0,
            x: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: 1.8,
            stagger: 0.05,
            ease: "elastic.out(1, 0.4)",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 60%",
            }
        }
      );

      // 2. PHILOSOPHY: HORIZONTAL SCROLL (PINNED)
      const sections = gsap.utils.toArray(".philosophy-item");
      const track = document.querySelector(".philosophy-track");
      
      if (track && sections.length > 0) {
          gsap.to(sections, {
              xPercent: -100 * (sections.length - 1),
              ease: "none",
              scrollTrigger: {
                  trigger: ".philosophy-wrapper",
                  pin: true,
                  scrub: 1,
                  snap: 1 / (sections.length - 1),
                  end: "+=3000", // Adjust scroll length
              }
          });
      }

      // 3. PERSONA: SHATTER REVEAL
      ScrollTrigger.create({
        trigger: ".persona-section",
        start: "top 60%",
        onEnter: () => setStatsVisible(true),
      });

      gsap.fromTo(".persona-title", 
        { y: 100, opacity: 0, skewY: 10 },
        { 
            y: 0, 
            opacity: 1, 
            skewY: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
                trigger: ".persona-section",
                start: "top 70%"
            }
        }
      );

      // Persona image reveal
      gsap.fromTo(".persona-img-container",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".persona-section", start: "top 70%" }
        }
      );


      // 4. PERSONA TEXT: STAGGERED FADE UP (REMOVED)
      /*
      gsap.fromTo(".persona-text-p",
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".persona-section",
                start: "top 60%"
            }
        }
      );
      */

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Glitch Effect Function
  const triggerGlitch = (e: React.MouseEvent<HTMLElement>) => {
      const target = e.target as HTMLElement;
      const originalText = target.dataset.text || target.innerText;
      target.dataset.text = originalText;

      const existing = glitchIntervals.current.get(target);
      if (existing) {
          clearInterval(existing);
          target.innerText = originalText;
      }

      const chars = "!<>-_\/[]{}—=+*^?#________";

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
            glitchIntervals.current.delete(target);
            target.innerText = originalText;
        }
        iterations += 1 / 2;
      }, 30);

      glitchIntervals.current.set(target, interval);
  };

  return (
    <section ref={containerRef} className="relative w-full bg-[#8c1921] text-white selection:bg-[#fbbf24] selection:text-[#8c1921]">
      
      {/* Background Wrapper - Handles Overflow for Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GrainOverlay />
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#ff4d4d]/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#fbbf24]/5 rounded-full blur-[80px]" />
      </div>
      
      {/* --- PART 1: THE MANIFESTO --- */}
      <div className="min-h-screen flex flex-col justify-center px-4 md:px-20 py-20 relative z-10" style={{ perspective: "1000px" }}>
        <div className="max-w-[95vw]">
            <h2 className="text-xs md:text-sm font-mono text-accent-secondary mb-8 tracking-[0.5em] uppercase opacity-80">
                {'//'} The Manifesto
            </h2>
            
            {/* Line 1 */}
            <div className="leading-[0.85] flex flex-wrap gap-x-4 md:gap-x-8">
                {"BUILDING".split(" ").map((word, i) => (
                    <span 
                        key={i} 
                        className="hero-word inline-block text-[10vw] font-black tracking-tighter text-white hover:text-[#fbbf24] transition-colors duration-300 cursor-none"
                        onMouseEnter={triggerGlitch}
                    >
                        {word}
                    </span>
                ))}
            </div>
            
            {/* Line 2 */}
            <div className="leading-[0.85] flex flex-wrap gap-x-4 md:gap-x-8">
                {"DIGITAL".split(" ").map((word, i) => (
                    <span 
                        key={i} 
                        className="hero-word inline-block text-[10vw] font-black tracking-tighter text-white hover:text-[#fbbf24] transition-colors duration-300 cursor-none"
                        onMouseEnter={triggerGlitch}
                    >
                        {word}
                    </span>
                ))}
            </div>

            {/* Line 3 (Hollow) */}
            <div className="leading-[0.85] mt-4 flex flex-wrap gap-x-4 md:gap-x-8">
                {"LEGACIES".split(" ").map((word, i) => (
                    <span 
                        key={i} 
                        className="hero-word inline-block text-[10vw] font-black tracking-tighter text-[#fbbf24] hover:text-white transition-colors duration-500"
                        onMouseEnter={triggerGlitch}
                    >
                        {word}
                    </span>
                ))}
            </div>

             {/* Line 4 */}
             <div className="leading-[0.85] flex flex-wrap gap-x-4 md:gap-x-8">
                {"THAT LAST".split(" ").map((word, i) => (
                    <span 
                        key={i} 
                        className="hero-word inline-block text-[10vw] font-black tracking-tighter text-neutral-100"
                        onMouseEnter={triggerGlitch}
                    >
                        {word}
                    </span>
                ))}
            </div>
        </div>
        
        <div className="mt-20 max-w-xl ml-auto border-l border-neutral-800 pl-8">
            <p className="text-xl md:text-2xl font-light leading-relaxed text-neutral-400">
                I am a passionate developer driven by a single goal: to create applications and websites that are <span className="text-white font-bold">remembered</span>. 
                It's not just about code; it's about crafting experiences that leave a lasting mark.
            </p>
        </div>
      </div>

      {/* --- PART 2: THE PHILOSOPHY (Horizontal Scroll) --- */}
      <div className="philosophy-wrapper min-h-screen w-full overflow-hidden bg-[#8c1921] text-white relative z-20">
        <div className="philosophy-track flex flex-row w-[300vw] h-full">
            
            {/* Item 1 */}
            <div className="philosophy-item w-screen h-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-20 px-4 md:px-20 py-20 md:py-0 border-none border-white/10">
                <div className="flex flex-col gap-4 text-center md:text-left">
                    <h2 className="text-[12vw] md:text-[8vw] font-black tracking-tighter leading-none">OBSESSION</h2>
                    <span className="font-mono text-sm tracking-widest uppercase border-b border-white pb-2 w-max mx-auto md:mx-0">01 Focus</span>
                </div>
                <div className="w-[70vw] md:w-[30vw] aspect-[3/4] relative overflow-hidden group">
                    <Image 
                        src="/image.png" 
                        alt="Focus" 
                        fill
                        sizes="(max-width: 768px) 70vw, 30vw"
                        loading="lazy"
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                </div>
            </div>

            {/* Item 2 */}
            <div className="philosophy-item w-screen h-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-20 px-4 md:px-20 py-20 md:py-0 border-none border-white/10">
                <div className="flex flex-col gap-4 text-center md:text-left">
                    <h2 className="text-[12vw] md:text-[8vw] font-black tracking-tighter leading-none text-[#fbbf24] hover:text-white transition-colors duration-500">PRECISION</h2>
                    <span className="font-mono text-sm tracking-widest uppercase border-b border-white pb-2 w-max mx-auto md:mx-0">02 Code</span>
                </div>
                <div className="w-[80vw] md:w-[40vw] aspect-video relative overflow-hidden group">
                    <Image
                        src="/precission.jpg"
                        alt="Precision"
                        fill
                        sizes="(max-width: 768px) 80vw, 40vw"
                        loading="lazy"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </div>
            </div>

            {/* Item 3 */}
            <div className="philosophy-item w-screen h-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-20 px-4 md:px-20 py-20 md:py-0">
                <div className="flex flex-col gap-4 text-center md:text-left">
                    <h2 className="text-[12vw] md:text-[8vw] font-black tracking-tighter leading-none">IMPACT</h2>
                    <span className="font-mono text-sm tracking-widest uppercase border-b border-white pb-2 w-max mx-auto md:mx-0">03 Result</span>
                </div>
                <div className="w-[70vw] md:w-[30vw] aspect-[3/4] relative overflow-hidden group impact-img-container">
                    <Image 
                        src="/impact.png" 
                        alt="Impact" 
                        fill
                        sizes="(max-width: 768px) 70vw, 30vw"
                        loading="lazy"
                        className="impact-img object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                </div>
            </div>

        </div>
      </div>

      {/* --- PART 3: THE PERSONA --- */}
      <div className="persona-section py-24 md:py-32 px-4 md:px-20 flex flex-col md:flex-row gap-20 items-start bg-[#8c1921] relative z-10">
        
        {/* Image */}
        <div className="w-full md:w-1/2 relative">
            <div className="persona-img-container group relative w-full aspect-[3/4] overflow-hidden">
                <Image
                    src="/Niko.png"
                    alt="Portrait"
                    fill
                    className="persona-img object-cover object-top contrast-110 scale-110 transition-transform duration-700 group-hover:scale-100"
                />
                {/* Red duotone overlay — fades on hover */}
                <div className="absolute inset-0 bg-[#8c1921]/40 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-700" />
                {/* Grain */}
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
                />
                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {/* Decorative circle */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border border-neutral-800 rounded-full animate-spin-slow flex items-center justify-center">
                <div className="w-2 h-2 bg-[#ff4d4d] rounded-full" />
            </div>
        </div>

        {/* Content & Stats */}
        <div className="w-full md:w-1/2 flex flex-col gap-12">
            <div>
                <h3 className="persona-title text-5xl md:text-8xl font-bold uppercase leading-[0.9] mb-6">
                    The <br/> <span className="text-[#fbbf24]">Developer</span>
                </h3>
                <div className="space-y-6 text-lg md:text-xl text-white/80 leading-relaxed max-w-lg">
                    <p className="persona-text-p">
                        I am a passionate student and developer based in The Netherlands, driven by a curiosity to build things that matter.
                    </p>
                    <p className="persona-text-p">
                        For me, development is more than just writing code. It's about crafting experiences. I love the challenge of turning complex problems into simple, beautiful solutions.
                    </p>
                    <p className="persona-text-p">
                        Whether it's a sleek website or a robust application, I bring energy and precision to every project. I'm always learning, always evolving, and always looking for the next big challenge.
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-y-10 mt-4 border-t border-white/20 pt-10">

                {/* ROW 1: STATS */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="group">
                        <h4 className="text-xs font-mono text-white/60 uppercase tracking-widest mb-2 group-hover:text-[#fbbf24] transition-colors">
                            [ Coordinates ]
                        </h4>
                        <p className="text-xl md:text-2xl font-bold">
                            <ScrambleText text="The Netherlands" trigger={statsVisible} />
                        </p>
                    </div>
                    <div className="group">
                        <h4 className="text-xs font-mono text-white/60 uppercase tracking-widest mb-2 group-hover:text-[#fbbf24] transition-colors">
                            [ Directive ]
                        </h4>
                        <p className="text-xl md:text-2xl font-bold text-white">
                            <ScrambleText text="Make an Impact" trigger={statsVisible} />
                        </p>
                    </div>
                </div>

                {/* ROW 2 */}
                <div className="grid grid-cols-2 gap-8 border-t border-white/20 pt-10">
                    <div className="group">
                        <h4 className="text-xs font-mono text-white/60 uppercase tracking-widest mb-2 group-hover:text-[#fbbf24] transition-colors">
                            [ Focus ]
                        </h4>
                        <p className="text-xl md:text-2xl font-bold text-white">
                            <ScrambleText text="Web & Motion" trigger={statsVisible} />
                        </p>
                    </div>
                    <div className="group">
                        <h4 className="text-xs font-mono text-white/60 uppercase tracking-widest mb-2 group-hover:text-[#fbbf24] transition-colors">
                            [ Status ]
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
                            <p className="text-xl md:text-2xl font-bold text-white">
                                <ScrambleText text="Available" trigger={statsVisible} />
                            </p>
                        </div>
                    </div>
                </div>

                {/* ROW 3 — services */}
                <div className="border-t border-white/20 pt-10">
                    <h4 className="text-xs font-mono text-white/60 uppercase tracking-widest mb-6">
                        [ What I Do ]
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Frontend Dev", num: "01" },
                            { label: "UI / UX Design", num: "02" },
                            { label: "Motion & Animation", num: "03" },
                            { label: "Mobile Apps", num: "04" },
                        ].map((service) => (
                            <div key={service.num} className="group flex items-center gap-3 py-2">
                                <span className="text-[9px] font-mono text-[#fbbf24]">{service.num}</span>
                                <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-white/70 group-hover:text-white transition-colors duration-300">{service.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- PART 4: THE ARSENAL (SKILLS) --- */}
      <SkillsList />



    </section>
  );
}
