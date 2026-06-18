"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/layout/Navbar";
import { projects } from "@/lib/projects";
import s from "./Archive.module.scss";

export default function Archive() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const floatWrapRef = useRef<HTMLDivElement>(null);
  const floatBounceRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const curtain2Ref = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<number | null>(null);
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
    isHovering.current = false;
    gsap.to(floatWrapRef.current, { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in" });
  }, []);

  return (
    <main ref={containerRef} className={s.container}>
      {/* Curtains */}
      <div ref={curtainRef} className={s.curtain1} />
      <div ref={curtain2Ref} className={s.curtain2} />

      {/* Grain */}
      <div className={s.grain}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      <Navbar />

      {/* Floating image — spring cursor follow with directional slide */}
      <div
        ref={floatWrapRef}
        className={s.floatWrap}
        style={{ opacity: 0, scale: 0.9, top: 0, left: 0 }}
      >
        <div ref={floatBounceRef} className={s.floatBounce} style={{ transformOrigin: "center center" }}>
          {projects.map((p, i) => (
            <div key={i} className="archive-slide">
              <Image src={p.src} alt={p.title} fill className="object-cover" sizes="480px" />
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <section className={s.headerSection}>
        <div className="archive-meta">
          <span className={s.dot} />
          <span className={s.label}>Selected Work</span>
          <span className={s.count}>0{projects.length} Cases</span>
        </div>

        <div className={s.titleOverflow}>
          <h1 className="archive-title">
            All Projects
          </h1>
        </div>

        <div className="header-line" />
      </section>

      {/* Project rows */}
      <section className={s.projectList}>
        {projects.map((project, i) => (
          <Link
            key={i}
            href={`/case/${project.slug}`}
            className="project-row"
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
          >
            {/* Gold fill wipe on hover */}
            <div className={s.goldFill} />

            {/* Index */}
            <span className={s.index}>
              0{i + 1}
            </span>

            {/* Title — masked reveal like Featured Cases */}
            <div className={s.titleWrapper}>
              {/* Outline layer */}
              <div className={s.outlineWrap}>
                <h2
                  className={`archive-row-title ${s.outlineTitle}`}
                  style={{ WebkitTextStroke: "2px rgba(255,255,255,0.25)" }}
                >
                  {project.title}
                </h2>
              </div>
              {/* Solid layer */}
              <div className={s.solidOverlay}>
                <h2 className={`archive-row-title ${s.solidTitle}`}>
                  {project.title}
                </h2>
              </div>
            </div>

            {/* Category */}
            <div className={s.categoryWrapper}>
              <span className={s.category}>
                {project.category}
              </span>
              <span className={s.year}>
                {project.year}
              </span>
            </div>

            {/* Arrow */}
            <div className={s.arrowWrapper}>
              <svg className={s.arrowSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        ))}
      </section>

      {/* Footer */}
      <div className={s.footer}>
        <button
          onClick={() => router.back()}
          className={s.backButton}
        >
          <svg className={s.backArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Back
        </button>
        <span className={s.footerText}>Niko — 2026</span>
      </div>
    </main>
  );
}
