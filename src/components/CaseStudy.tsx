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
  const curtainRef = useRef<HTMLDivElement>(null);
  const curtain2Ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      // Curtain
      gsap.timeline()
        .set([curtainRef.current, curtain2Ref.current], { yPercent: 0 })
        .to(curtainRef.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" })
        .to(curtain2Ref.current, { yPercent: -100, duration: 0.7, ease: "power3.inOut" }, "-=0.5");

      // Top bar
      gsap.fromTo(".cs-topbar", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.6 });

      // Title — each char group slides up
      gsap.fromTo(".cs-title-line",
        { y: "105%" },
        { y: "0%", duration: 1.2, stagger: 0.07, ease: "power4.out", delay: 0.5 }
      );

      // Title index number
      gsap.fromTo(".cs-index", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.9 });

      // Hero image reveal — opacity + slight translate (GPU only)
      gsap.fromTo(".cs-hero-wrap",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.7 }
      );

      // Subtle zoom on hero image
      gsap.fromTo(".cs-hero-img",
        { scale: 1.04 },
        { scale: 1, duration: 1.8, ease: "power2.out", delay: 0.7 }
      );

      // Batch all fade-up reveals — single ScrollTrigger per batch
      ScrollTrigger.batch(".sr", {
        start: "top 90%",
        onEnter: (els) => gsap.fromTo(els,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.06, overwrite: true }
        ),
      });

      // Second image reveal
      gsap.utils.toArray<HTMLElement>(".img-clip").forEach((el) => {
        gsap.fromTo(el,
          { yPercent: 4, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" } }
        );
      });

      // Line draw
      gsap.utils.toArray<HTMLElement>(".line-grow").forEach((el) => {
        gsap.fromTo(el,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "power3.inOut", transformOrigin: "left",
            scrollTrigger: { trigger: el, start: "top 92%" } }
        );
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const img1 = project.images?.[0] ?? project.src;
  const img2 = project.images?.[1] ?? project.src;

  return (
    <main ref={containerRef} className="w-full flex flex-col cursor-none bg-[#0c0c0c] text-white">
      <div ref={curtainRef} className="fixed inset-0 z-[9999] bg-[#0c0c0c] pointer-events-none" />
      <div ref={curtain2Ref} className="fixed inset-0 z-[9998] bg-[#8c1921] pointer-events-none" />
      <CustomCursor />
      <Navbar />

      {/* ━━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="w-full pt-28 md:pt-36 pb-0 px-6 md:px-12">

        {/* Top bar */}
        <div className="cs-topbar flex items-center justify-between mb-12 md:mb-16">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[8px] font-mono uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-6">
            <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/25">{project.category}</span>
            <span className="text-white/10">—</span>
            <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-white/25">{project.year}</span>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-[0.4em] text-[#fbbf24] hover:text-white transition-colors duration-300 ml-4"
            >
              Live
              <svg className="w-2.5 h-2.5 -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Title block */}
        <div className="flex items-start gap-6 md:gap-10">
          {/* Index — superscript style */}
          <span className="cs-index text-[9px] font-mono text-white/20 mt-3 md:mt-5 shrink-0 hidden md:block">
            {String(project.title.charCodeAt(0) % 10 + 1).padStart(2, "0")}
          </span>

          {/* Giant title */}
          <div className="flex-1">
            {project.title.split(" ").map((word, i) => (
              <div key={i} className="overflow-hidden">
                <h1 className="cs-title-line text-[17vw] md:text-[13vw] font-black uppercase tracking-tighter leading-[0.87] text-white">
                  {word}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ HERO IMAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="cs-hero-wrap w-full mt-10 md:mt-14 aspect-[16/9] relative overflow-hidden" style={{ willChange: 'transform, opacity' }}>
        <Image src={img1} alt={project.title} fill className="cs-hero-img object-cover" priority sizes="100vw" />
      </div>

      {/* ━━━ META + DESCRIPTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="w-full px-6 md:px-12 py-16 md:py-24 border-b border-white/[0.07]">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">

          {/* Left — meta */}
          <div className="flex flex-col gap-7 md:w-56 shrink-0">
            <div className="sr">
              <span className="text-[7px] font-mono uppercase tracking-[0.5em] text-white/20 block mb-2">Role</span>
              <span className="text-sm font-light text-white/60">{project.role}</span>
            </div>
            <div className="sr">
              <span className="text-[7px] font-mono uppercase tracking-[0.5em] text-white/20 block mb-2">Duration</span>
              <span className="text-sm font-light text-white/60">{project.duration}</span>
            </div>
            <div className="sr">
              <span className="text-[7px] font-mono uppercase tracking-[0.5em] text-white/20 block mb-2">Stack</span>
              <div className="flex flex-col gap-1">
                {project.technologies.map((t) => (
                  <span key={t} className="text-sm font-light text-white/60">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-[1px] bg-white/[0.07] self-stretch" />

          {/* Right — description */}
          <div className="flex-1">
            <p className="sr text-xl md:text-2xl lg:text-3xl font-light text-white/75 leading-[1.55]">
              {project.longDescription}
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ CHALLENGE / APPROACH ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 border-b border-white/[0.07]">
        <div className="px-6 md:px-12 py-14 md:py-20 md:border-r border-white/[0.07] border-b md:border-b-0">
          <span className="sr text-[7px] font-mono uppercase tracking-[0.5em] text-white/20 block mb-8">Challenge</span>
          <p className="sr text-base md:text-lg font-light text-white/55 leading-[1.85]">{project.challenge}</p>
        </div>
        <div className="px-6 md:px-12 py-14 md:py-20">
          <span className="sr text-[7px] font-mono uppercase tracking-[0.5em] text-white/20 block mb-8">Approach</span>
          <p className="sr text-base md:text-lg font-light text-white/55 leading-[1.85]">{project.solution}</p>
        </div>
      </section>

      {/* ━━━ SECOND IMAGE — asymmetric ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="w-full px-6 md:px-12 py-14 md:py-20 border-b border-white/[0.07]">
        <div className="w-full md:w-[70%]">
          <div className="img-clip w-full aspect-[4/3] relative overflow-hidden">
            <Image src={img2} alt={project.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 70vw" />
          </div>
        </div>
        <div className="sr mt-5 flex items-center gap-3">
          <span className="block w-4 h-[1px] bg-white/20" />
          <span className="text-[7px] font-mono uppercase tracking-[0.5em] text-white/20">{project.title} — {project.year}</span>
        </div>
      </section>

      {/* ━━━ QUOTE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="w-full px-6 md:px-12 py-20 md:py-36 border-b border-white/[0.07]">
        <div className="line-grow w-full h-[1px] bg-white/[0.07] origin-left mb-16 md:mb-24" />
        <blockquote className="sr text-3xl md:text-[2.8rem] lg:text-5xl font-light text-white/70 leading-[1.3] max-w-4xl">
          &ldquo;{project.quote}&rdquo;
        </blockquote>
      </section>

      {/* ━━━ NEXT CASE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Link
        href={"/case/" + nextProject.slug}
        className="group relative w-full overflow-hidden flex flex-col justify-end"
        style={{ minHeight: "60vh" }}
      >
        {/* Actual image always visible, dark */}
        <div className="absolute inset-0">
          <Image src={nextProject.src} alt={nextProject.title} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-[#0c0c0c]/80 group-hover:bg-[#0c0c0c]/50 transition-colors duration-700" />
        </div>

        {/* Gold wipe */}
        <div className="absolute inset-0 bg-[#fbbf24] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]" />

        <div className="relative z-10 px-6 md:px-12 pb-12 md:pb-16 pt-16">
          <span className="text-[7px] font-mono uppercase tracking-[0.5em] text-white/25 group-hover:text-black/40 transition-colors duration-500 block mb-5">
            Next Case
          </span>
          <h2 className="text-[15vw] md:text-[10vw] font-black uppercase tracking-tighter leading-[0.87] text-white group-hover:text-black transition-colors duration-500">
            {nextProject.title}
          </h2>
          <div className="flex items-center gap-3 mt-5">
            <span className="text-[7px] font-mono uppercase tracking-[0.4em] text-white/25 group-hover:text-black/40 transition-colors duration-500">
              {nextProject.category}
            </span>
            <svg className="w-3.5 h-3.5 -rotate-45 text-[#fbbf24] group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </Link>

      {/* ━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="w-full px-6 md:px-12 py-7 flex items-center justify-between border-t border-white/[0.07]">
        <span className="text-[7px] font-mono uppercase tracking-[0.5em] text-white/15">Niko — {new Date().getFullYear()}</span>
        <a href="mailto:nikodima2007@gmail.com" className="text-[7px] font-mono uppercase tracking-[0.4em] text-white/15 hover:text-white/60 transition-colors duration-300">
          nikodima2007@gmail.com
        </a>
      </div>
    </main>
  );
}
