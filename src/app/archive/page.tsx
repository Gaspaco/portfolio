"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import { projects } from "@/lib/projects";

export default function Archive() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const floatWrapRef = useRef<HTMLDivElement>(null);
  const floatBounceRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const curtain2Ref = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [hideCursor, setHideCursor] = useState(false);
  const prevIndex = useRef<number | null>(null);
  const isHovering = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Curtain entrance
      gsap.timeline()
        .set([curtainRef.current, curtain2Ref.current], { yPercent: 0 })
        .to(curtainRef.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" })
        .to(curtain2Ref.current, { yPercent: -100, duration: 0.7, ease: "power3.inOut" }, "-=0.5");

      // Header
      gsap.fromTo(".archive-title",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.5 }
      );
      gsap.fromTo(".archive-meta",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.9 }
      );

      // Divider line draw
      gsap.fromTo(".header-line",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power3.inOut", transformOrigin: "left", delay: 0.7 }
      );

      // Rows stagger in
      gsap.fromTo(".project-row",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out", delay: 0.8 }
      );

      // Title masked reveal per row
      gsap.utils.toArray<HTMLElement>(".archive-row-title").forEach((el) => {
        gsap.fromTo(el,
          { y: "110%" },
          {
            y: "0%",
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Start all slides off-screen
      if (floatBounceRef.current) {
        gsap.set(floatBounceRef.current.querySelectorAll(".archive-slide"), { yPercent: 100 });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Spring cursor follow with bounce rotation
  useEffect(() => {
    const wrap = floatWrapRef.current;
    const bounce = floatBounceRef.current;
    if (!wrap || !bounce) return;

    const xTo = gsap.quickTo(wrap, "left", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(wrap, "top", { duration: 0.4, ease: "power3.out" });
    const rotTo = gsap.quickTo(bounce, "rotate", { duration: 0.5, ease: "elastic.out(1, 0.5)" });

    let prevX = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (!isHovering.current) return;
      const dx = e.clientX - prevX;
      prevX = e.clientX;
      xTo(e.clientX - 240);
      yTo(e.clientY - 150);
      rotTo(dx * 0.15);
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const handleEnter = useCallback((i: number) => {
    const prev = prevIndex.current;
    prevIndex.current = i;
    setActiveProject(i);
    setHideCursor(true);
    isHovering.current = true;
    gsap.to(floatWrapRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });

    const slides = floatBounceRef.current?.querySelectorAll(".archive-slide");
    if (!slides) return;

    const direction = prev !== null && i > prev ? 1 : -1;

    slides.forEach((slide, idx) => {
      if (idx === i) {
        gsap.fromTo(slide, { yPercent: direction * 100 }, { yPercent: 0, duration: 0.5, ease: "power3.out" });
      } else if (idx === prev) {
        gsap.to(slide, { yPercent: direction * -100, duration: 0.5, ease: "power3.out" });
      }
    });
  }, []);

  const handleLeave = useCallback(() => {
    setActiveProject(null);
    setHideCursor(false);
    isHovering.current = false;
    gsap.to(floatWrapRef.current, { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in" });
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen w-full flex flex-col bg-[#8c1921] text-white cursor-none">
      {/* Curtains */}
      <div ref={curtainRef} className="fixed inset-0 z-[9999] bg-[#050505] pointer-events-none" />
      <div ref={curtain2Ref} className="fixed inset-0 z-[9998] bg-[#8c1921] pointer-events-none" />

      {/* Grain */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      <div style={{ opacity: hideCursor ? 0 : 1, transition: 'opacity 0.15s ease-out', pointerEvents: 'none' }}>
        <CustomCursor />
      </div>
      <Navbar />

      {/* Floating image — spring cursor follow with directional slide */}
      <div
        ref={floatWrapRef}
        className="hidden md:block fixed w-[480px] h-[300px] pointer-events-none z-[60] overflow-hidden"
        style={{ opacity: 0, scale: 0.9, top: 0, left: 0 }}
      >
        <div ref={floatBounceRef} className="w-full h-full relative rounded-sm overflow-hidden" style={{ transformOrigin: "center center" }}>
          {projects.map((p, i) => (
            <div key={i} className="archive-slide absolute inset-0 w-full h-full">
              <Image src={p.src} alt={p.title} fill className="object-cover" sizes="480px" />
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <section className="relative z-10 px-6 md:px-12 pt-36 pb-0">
        <div className="archive-meta flex items-center gap-3 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse" />
          <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-[#fbbf24]">Selected Work</span>
          <span className="text-[9px] font-mono text-white/30 ml-auto">0{projects.length} Cases</span>
        </div>

        <div className="overflow-hidden">
          <h1 className="archive-title text-[14vw] md:text-[10vw] font-black uppercase tracking-tighter leading-[0.82] text-white">
            All Projects
          </h1>
        </div>

        <div className="header-line h-[1px] bg-[#fbbf24]/40 mt-10 origin-left -mx-6 md:-mx-12" />
      </section>

      {/* Project rows */}
      <section className="relative z-10 flex flex-col flex-1">
        {projects.map((project, i) => (
          <Link
            key={i}
            href={`/case/${project.slug}`}
            className="project-row group relative flex items-center px-6 md:px-12 pt-3 pb-8 md:pt-4 md:pb-11 min-h-[18vw] md:min-h-[11vw] overflow-hidden cursor-none border-b border-[#fbbf24]/20"
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
          >
            {/* Gold fill wipe on hover */}
            <div className="absolute inset-x-0 -top-1 -bottom-1 bg-[#fbbf24] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

            {/* Index */}
            <span className="relative hidden md:block w-16 shrink-0 font-mono text-sm text-[#fbbf24] group-hover:text-black transition-colors duration-300 tabular-nums self-end pb-1">
              0{i + 1}
            </span>

            {/* Title — masked reveal like Featured Cases */}
            <div className="relative flex-1 py-2 md:py-3">
              {/* Outline layer */}
              <div className="overflow-hidden">
                <h2
                  className="archive-row-title block text-[10vw] md:text-[7vw] font-black uppercase tracking-tighter leading-none text-transparent transition-transform duration-700 ease-out group-hover:scale-105 origin-left"
                  style={{ WebkitTextStroke: "2px rgba(255,255,255,0.25)" }}
                >
                  {project.title}
                </h2>
              </div>
              {/* Solid layer */}
              <div className="absolute inset-0 py-2 md:py-3 overflow-hidden">
                <h2 className="archive-row-title block text-[10vw] md:text-[7vw] font-black uppercase tracking-tighter leading-none text-white group-hover:text-black transition-[color,transform] duration-700 ease-out group-hover:scale-105 origin-left opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                  {project.title}
                </h2>
              </div>
            </div>

            {/* Category */}
            <div className="relative hidden md:flex flex-col items-end gap-1 shrink-0 ml-8 self-end pb-1">
              <span className="font-mono text-xs uppercase tracking-widest text-white/60 group-hover:text-black/60 transition-colors duration-300">
                {project.category}
              </span>
              <span className="font-mono text-xs text-[#fbbf24] group-hover:text-black/50 transition-colors duration-300">
                {project.year}
              </span>
            </div>

            {/* Arrow */}
            <div className="relative ml-6 md:ml-10 shrink-0 self-end pb-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              <svg className="w-6 h-6 -rotate-45 text-[#fbbf24] group-hover:text-black transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        ))}
      </section>

      {/* Footer */}
      <div className="relative z-10 px-6 md:px-12 py-10 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/60 hover:text-[#fbbf24] transition-colors duration-300 cursor-pointer"
        >
          <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Back
        </button>
        <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">Niko — 2026</span>
      </div>
    </main>
  );
}
