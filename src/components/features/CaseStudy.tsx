"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/lib/projects";
import Navbar from "../layout/Navbar";
import s from "./CaseStudy.module.scss";

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
    <main ref={containerRef} className={s.main}>
      {/* Page transition curtains */}
      <div ref={curtainRef} className={s.curtain1} />
      <div ref={curtain2Ref} className={s.curtain2} />

      <Navbar />

      {/* ── HERO ── */}
      <section ref={heroRef} className={s.hero}>
        <Image src={project.src} alt={project.title} fill className={`${s.heroImg} hero-img`} priority />
        <div className={s.heroGradient} />

        {/* Back */}
        <button onClick={() => router.back()} className={s.backBtn}>
          <svg className={s.backArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Back
        </button>

        <div className={s.heroBottom}>
          <div ref={heroMetaRef} className={s.heroMeta}>
            <span className={s.pulseDot} />
            <span className={s.metaCategory}>{project.category}</span>
            <span className={s.metaDivider}>&middot;</span>
            <span className={s.metaYear}>{project.year}</span>
          </div>
          <h1 ref={titleRef} className={s.heroTitle}>
            {project.title}
          </h1>
        </div>
      </section>

      {/* ── INTRO STRIP ── */}
      <section className={s.introStrip}>
        <div className={s.introFlex}>
          <p className={`${s.introText} cr`}>
            {project.description}
          </p>
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            className={`${s.ctaLink} cr`}>
            <div className={s.ctaFill} />
            <span className={s.ctaText}>
              Visit Live Site ↗
            </span>
          </a>
        </div>
      </section>

      {/* ── META ROW ── */}
      <section className={s.metaSection}>
        <div className={`${s.metaGrid} cr`}>
          {[
            { label: "Role", value: project.role },
            { label: "Duration", value: project.duration },
            { label: "Year", value: project.year },
          ].map(({ label, value }) => (
            <div key={label}>
              <span className={s.metaLabel}>{label}</span>
              <span className={s.metaValue}>{value}</span>
            </div>
          ))}
          <div>
            <span className={s.metaLabel}>Stack</span>
            <div className={s.techTags}>
              {project.technologies.map((tech) => (
                <span key={tech} className={s.techTag}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className={s.overviewSection}>
        <div className={s.overviewInner}>
          <div className={`${s.overviewLabel} cr-clip`}>
            <span className={s.overviewLabelText}>Overview</span>
          </div>
          <p className={`${s.overviewText} cr`}>
            {project.longDescription}
          </p>
        </div>
      </section>

      {/* ── CHALLENGE / SOLUTION ── */}
      <section className={s.splitSection}>
        <div className={s.splitGrid}>
          <div className={s.splitLeft}>
            <div className={`${s.splitHeader} cr`}>
              <span className={s.splitNumber}>01</span>
              <span className={s.splitLabel}>Challenge</span>
            </div>
            <p className={`${s.splitText} cr`}>{project.challenge}</p>
          </div>
          <div className={s.splitRight}>
            <div className={`${s.splitHeader} cr`}>
              <span className={s.splitNumber}>02</span>
              <span className={s.splitLabel}>Solution</span>
            </div>
            <p className={`${s.splitText} cr`}>{project.solution}</p>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className={`${s.processSection} process-section`}>
        <div className={s.processHeader}>
          <span className={s.processLabel}>Process</span>
          <div className={`${s.lineDraw} line-draw`} />
        </div>
        <div className={s.processGrid}>
          {project.process.map((item, i) => (
            <div key={i} className={`${s.processStep} process-step`}>
              <div className={s.stepHeader}>
                <span className={s.stepNum}>0{i + 1}</span>
                <span className={s.stepTitle}>{item.step}</span>
              </div>
              <p className={s.stepDetail}>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTE HIGHLIGHT ── */}
      <section className={s.quoteSection}>
        <div className={s.quoteGrain}
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />
        <p className={`${s.quoteText} quote-text`}>
          {project.quote}
        </p>
        <div className={s.quoteAttribution}>
          <div className={s.quoteLine} />
          <span className={s.quoteSource}>{project.title} — {project.year}</span>
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section className={`${s.resultsSection} results-section`}>
        <div className={`${s.resultsHeader} cr`}>
          <span className={s.resultsLabel}>Results</span>
          <div className={`${s.lineDraw} line-draw`} />
        </div>

        {project.results.map((result, i) => (
          <div
            key={i}
            className={`${i % 2 === 1 ? s.resultCardAlt : s.resultCard} result-card`}
          >
            {/* Sliding bg on hover */}
            <div className={s.resultHoverBg} />

            <div className={i % 2 === 1 ? s.resultContentAlt : s.resultContent}>
              <span className={s.resultNum}>
                0{i + 1}
              </span>
              <p className={s.resultText}>
                {result}
              </p>
              {/* Underline draws on hover */}
              <div className={i % 2 === 1 ? s.resultUnderlineAlt : s.resultUnderline} />
            </div>
          </div>
        ))}
      </section>

      {/* ── NEXT PROJECT ── */}
      <Link href={`/case/${nextProject.slug}`} className={s.nextProject}>
        {/* Grain */}
        <div className={s.nextGrain}
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />

        {/* Gold fill wipe */}
        <div className={s.nextGoldWipe} />

        {/* Label */}
        <span className={s.nextLabel}>
          Next Case
        </span>

        {/* Big title */}
        <div className={s.nextTitleWrap}>
          <h2 className={s.nextTitle}>
            {nextProject.title}
          </h2>
        </div>

        {/* Category + arrow */}
        <div className={s.nextMeta}>
          <span className={s.nextCategory}>
            {nextProject.category}
          </span>
          <div className={s.nextArrowWrap}>
            <svg className={s.nextArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className={s.footer}>
        <span className={s.footerText}>Niko — {new Date().getFullYear()}</span>
        <a href="mailto:nikodima2007@gmail.com" className={s.footerLink}>
          nikodima2007@gmail.com
        </a>
      </div>
    </main>
  );
}
