"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/lib/projects";
import Navbar from "./Navbar";
import CustomCursor from "./CustomCursor";

export default function CaseStudy({ project, nextProject }: { project: Project; nextProject: Project }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const heroMetaRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const curtain2Ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      // Curtain wipe on enter — two panels slide up sequentially
      const curtainTl = gsap.timeline();
      curtainTl
        .set([curtainRef.current, curtain2Ref.current], { yPercent: 0 })
        .to(curtainRef.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" })
        .to(curtain2Ref.current, { yPercent: -100, duration: 0.7, ease: "power3.inOut" }, "-=0.5");

      // Hero entrance — starts after curtain opens
      const heroTl = gsap.timeline({ delay: 0.4 });
      heroTl
        .fromTo(".hero-img",
          { scale: 1.15 },
          { scale: 1.0, duration: 1.8, ease: "power2.out" }
        )
        .fromTo(heroMetaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=1"
        )
        .fromTo(titleRef.current,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power4.out" },
          "-=0.6"
        );

      // Hero parallax on scroll
      gsap.to(".hero-img", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
      });

      // Clip-path reveal for sections
      gsap.utils.toArray<HTMLElement>(".cr-clip").forEach((el) => {
        gsap.fromTo(el,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });

      // Fade + slide up for text blocks
      gsap.utils.toArray<HTMLElement>(".cr").forEach((el) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });

      // Stagger for process steps
      gsap.fromTo(".process-step",
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".process-section", start: "top 80%", toggleActions: "play none none none" },
        }
      );

      // Result cards stagger
      gsap.fromTo(".result-card",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: ".results-section", start: "top 80%", toggleActions: "play none none none" },
        }
      );

      // Quote word-by-word reveal
      const quoteEl = document.querySelector(".quote-text");
      if (quoteEl) {
        const words = quoteEl.textContent?.split(" ") ?? [];
        quoteEl.innerHTML = words.map(w => `<span class="inline-block overflow-hidden"><span class="inline-block quote-word">${w}</span></span>`).join(" ");
        gsap.fromTo(".quote-word",
          { y: "100%" },
          {
            y: "0%", duration: 0.8, stagger: 0.04, ease: "power3.out",
            scrollTrigger: { trigger: quoteEl, start: "top 80%", toggleActions: "play none none none" },
          }
        );
      }

      // Horizontal line draw
      gsap.utils.toArray<HTMLElement>(".line-draw").forEach((el) => {
        gsap.fromTo(el,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 1.2, ease: "power3.inOut", transformOrigin: "left",
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="w-full flex flex-col cursor-none bg-[#050505] text-white">
      {/* Page transition curtains */}
      <div ref={curtainRef} className="fixed inset-0 z-[9999] bg-[#050505] pointer-events-none" />
      <div ref={curtain2Ref} className="fixed inset-0 z-[9998] bg-[#8c1921] pointer-events-none" />

      <CustomCursor />
      <Navbar />

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative w-full h-screen overflow-hidden">
        <Image src={project.src} alt={project.title} fill className="hero-img object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-[#050505]" />

        {/* Back */}
        <button onClick={() => router.back()} className="absolute top-24 left-6 md:left-12 z-20 flex items-center gap-2 text-white hover:text-[#fbbf24] text-sm font-mono uppercase tracking-widest transition-colors duration-300 cursor-pointer">
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Back
        </button>

        <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-16 z-10">
          <div ref={heroMetaRef} className="flex items-center gap-3 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse" />
            <span className="text-[#fbbf24] font-mono text-[10px] uppercase tracking-[0.3em]">{project.category}</span>
            <span className="text-white/30">·</span>
            <span className="text-white/50 font-mono text-[10px] uppercase tracking-widest">{project.year}</span>
          </div>
          <h1 ref={titleRef} className="text-[15vw] md:text-[11vw] font-black uppercase tracking-tighter leading-[0.82] text-white">
            {project.title}
          </h1>
        </div>
      </section>

      {/* ── INTRO STRIP ── */}
      <section className="w-full px-6 md:px-12 py-12 md:py-16 border-b border-white/10 bg-[#8c1921]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="cr text-lg md:text-2xl font-light text-white max-w-2xl leading-relaxed">
            {project.description}
          </p>
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            className="cr group relative overflow-hidden border border-white/30 px-8 py-4 shrink-0 hover:border-[#fbbf24] transition-colors duration-300">
            <div className="absolute inset-0 bg-[#fbbf24] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 font-mono text-sm uppercase tracking-widest text-white group-hover:text-black transition-colors duration-300">
              Visit Live Site ↗
            </span>
          </a>
        </div>
      </section>

      {/* ── META ROW ── */}
      <section className="w-full px-6 md:px-12 py-10 border-b border-white/10">
        <div className="cr grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Role", value: project.role },
            { label: "Duration", value: project.duration },
            { label: "Year", value: project.year },
          ].map(({ label, value }) => (
            <div key={label}>
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 block mb-2">{label}</span>
              <span className="text-sm text-white">{value}</span>
            </div>
          ))}
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 block mb-2">Stack</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-white/70 border border-white/20">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="w-full px-6 md:px-12 py-20 md:py-32 border-b border-white/10">
        <div className="max-w-4xl">
          <div className="cr-clip overflow-hidden mb-8">
            <span className="block text-[9px] font-mono uppercase tracking-[0.4em] text-white/50">Overview</span>
          </div>
          <p className="cr text-2xl md:text-4xl font-light text-white leading-relaxed">
            {project.longDescription}
          </p>
        </div>
      </section>

      {/* ── CHALLENGE / SOLUTION ── */}
      <section className="w-full border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="px-6 md:px-12 py-16 md:py-24 border-b md:border-b-0 md:border-r border-white/10">
            <div className="cr flex items-center gap-4 mb-10">
              <span className="text-3xl md:text-5xl font-black text-[#fbbf24]">01</span>
              <span className="text-xs font-mono uppercase tracking-widest text-[#fbbf24]">Challenge</span>
            </div>
            <p className="cr text-base md:text-lg text-white/80 leading-relaxed">{project.challenge}</p>
          </div>
          <div className="px-6 md:px-12 py-16 md:py-24">
            <div className="cr flex items-center gap-4 mb-10">
              <span className="text-3xl md:text-5xl font-black text-[#fbbf24]">02</span>
              <span className="text-xs font-mono uppercase tracking-widest text-[#fbbf24]">Solution</span>
            </div>
            <p className="cr text-base md:text-lg text-white/80 leading-relaxed">{project.solution}</p>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="process-section w-full px-6 md:px-12 py-20 md:py-32 border-b border-white/10">
        <div className="flex items-center gap-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-white/50">Process</span>
          <div className="line-draw flex-1 h-[1px] bg-white/10 origin-left" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {project.process.map((item, i) => (
            <div key={i} className="process-step border-t border-white/10 p-8 md:p-10 hover:bg-white/[0.02] transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[9px] font-mono text-[#fbbf24] uppercase tracking-widest">0{i + 1}</span>
                <span className="text-sm font-bold uppercase tracking-widest text-white">{item.step}</span>
              </div>
              <p className="text-sm md:text-base text-white/60 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTE HIGHLIGHT ── */}
      <section className="w-full px-6 md:px-12 py-20 md:py-32 bg-[#8c1921] overflow-hidden relative border-b border-white/10">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />
        <p className="quote-text relative text-[5vw] md:text-[3vw] font-black uppercase tracking-tighter leading-tight text-white max-w-5xl">
          {project.quote}
        </p>
        <div className="relative flex items-center gap-4 mt-10">
          <div className="w-10 h-[2px] bg-[#fbbf24]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#fbbf24]">{project.title} — {project.year}</span>
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section className="results-section w-full border-b border-white/10">
        <div className="cr px-6 md:px-12 pt-16 md:pt-24 pb-12 flex items-center gap-4">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-white/40">Results</span>
          <div className="line-draw flex-1 h-[1px] bg-white/10 origin-left" />
        </div>

        {project.results.map((result, i) => (
          <div
            key={i}
            className={`result-card group relative px-6 md:px-12 py-12 md:py-16 border-t border-white/10 overflow-hidden ${i % 2 === 1 ? 'md:text-right' : ''}`}
          >
            {/* Sliding bg on hover */}
            <div className="absolute inset-0 bg-white/[0.02] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />

            <div className={`relative flex flex-col gap-4 ${i % 2 === 1 ? 'md:items-end' : ''}`}>
              <span className="text-[9px] font-mono text-[#fbbf24] uppercase tracking-widest">
                0{i + 1}
              </span>
              <p className="text-2xl md:text-4xl lg:text-5xl font-light text-white leading-tight max-w-3xl">
                {result}
              </p>
              {/* Underline draws on hover */}
              <div className={`h-[1px] w-0 group-hover:w-full bg-[#fbbf24] transition-all duration-700 ease-out ${i % 2 === 1 ? 'md:ml-auto' : ''}`} />
            </div>
          </div>
        ))}
      </section>

      {/* ── NEXT PROJECT ── */}
      <Link href={`/case/${nextProject.slug}`}
        className="group relative w-full h-[70vh] md:h-screen bg-[#8c1921] overflow-hidden flex flex-col items-center justify-center"
      >
        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />

        {/* Gold fill wipe */}
        <div className="absolute inset-0 bg-[#fbbf24] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]" />

        {/* Label */}
        <span className="relative z-10 text-[9px] font-mono uppercase tracking-[0.4em] text-[#fbbf24] group-hover:text-black transition-colors duration-500 mb-8 block">
          Next Case
        </span>

        {/* Big title */}
        <div className="relative z-10 overflow-hidden px-6 text-center">
          <h2 className="text-[16vw] md:text-[12vw] font-black uppercase tracking-tighter leading-[0.82] text-white group-hover:text-black transition-colors duration-500">
            {nextProject.title}
          </h2>
        </div>

        {/* Category + arrow */}
        <div className="relative z-10 flex items-center gap-4 mt-8">
          <span className="font-mono text-xs uppercase tracking-widest text-white/50 group-hover:text-black/60 transition-colors duration-500">
            {nextProject.category}
          </span>
          <div className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
            <svg className="w-4 h-4 -rotate-45 text-[#fbbf24] group-hover:text-black transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="w-full px-6 md:px-12 py-10 flex items-center justify-between border-t border-white/10">
        <span className="text-xs font-mono uppercase tracking-widest text-white/60">Niko — {new Date().getFullYear()}</span>
        <a href="mailto:nikodima2007@gmail.com" className="text-xs font-mono uppercase tracking-widest text-white/60 hover:text-white transition-colors duration-300">
          nikodima2007@gmail.com
        </a>
      </div>
    </main>
  );
}
