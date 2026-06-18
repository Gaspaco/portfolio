"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from './Projects.module.scss';

const projects = [
  {
    title: "Aria",
    category: "Fitness App",
    year: "2025",
    src: "/aria.png",
    link: "/case/aria",
    bg: "#4a90d9",
  },
  {
    title: "Melograph",
    category: "Creative Studio",
    year: "2026",
    src: "/image copy 2.png",
    link: "/case/melograph",
    bg: "#8c1921",
  },
  {
    title: "Museum",
    category: "Web Design",
    year: "2025",
    src: "/museum.png",
    link: "/case/museum",
    bg: "#c9a84c",
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const floatWrapRef = useRef<HTMLDivElement>(null);
  const floatBounceRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prevIndex = useRef<number | null>(null);
  const isHovering = useRef(false);

  const forceHide = useCallback(() => {
    isHovering.current = false;
    setActiveIndex(null);
    prevIndex.current = null;
    if (floatWrapRef.current) {
      gsap.set(floatWrapRef.current, { opacity: 0, scale: 0.9 });
    }
    if (floatBounceRef.current) {
      gsap.set(floatBounceRef.current.querySelectorAll(".project-slide"), { yPercent: 100 });
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header label
      gsap.fromTo(".header-label",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: ".projects-header-inner", start: "top 85%" }
        }
      );

      // Header title — each word masked reveal
      gsap.fromTo(".header-word",
        { y: "110%" },
        { y: "0%", duration: 1, stagger: 0.1, ease: "power4.out",
          scrollTrigger: { trigger: ".projects-header-inner", start: "top 85%" }
        }
      );

      // More work link
      gsap.fromTo(".more-work-link",
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".projects-header-inner", start: "top 80%" }
        }
      );

      // Row stripes draw in one by one
      gsap.utils.toArray<HTMLElement>(".row-stripe").forEach((stripe, i) => {
        gsap.fromTo(stripe,
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power4.inOut", transformOrigin: "left",
            scrollTrigger: { trigger: stripe, start: "top 90%" }
          }
        );
      });

      // Row titles — masked slide up
      gsap.utils.toArray<HTMLElement>(".row-title").forEach((title) => {
        gsap.fromTo(title,
          { y: "100%" },
          { y: "0%", duration: 0.9, ease: "power4.out",
            scrollTrigger: { trigger: title, start: "top 92%" }
          }
        );
      });

      // Row meta — fade in
      gsap.utils.toArray<HTMLElement>(".row-meta").forEach((meta) => {
        gsap.fromTo(meta,
          { opacity: 0, x: 10 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: meta, start: "top 90%" }
          }
        );
      });

      if (floatBounceRef.current) {
        gsap.set(floatBounceRef.current.querySelectorAll(".project-slide"), { yPercent: 100 });
      }

      // Force-hide floating image when section leaves viewport
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onLeave: () => forceHide(),
        onLeaveBack: () => forceHide(),
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Cursor follower with spring/bounce physics
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

    const onScroll = () => {
      if (!isHovering.current) return;
      const listEl = containerRef.current?.querySelector(".project-list");
      if (!listEl) return;
      const rect = listEl.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        forceHide();
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [forceHide]);

  const handleEnter = useCallback((i: number) => {
    const prev = prevIndex.current;
    prevIndex.current = i;
    setActiveIndex(i);
    isHovering.current = true;
    gsap.to(floatWrapRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });

    const images = floatBounceRef.current?.querySelectorAll(".project-slide");
    if (!images) return;

    const direction = prev !== null && i > prev ? 1 : -1;

    images.forEach((img, idx) => {
      if (idx === i) {
        gsap.fromTo(img, { yPercent: direction * 100 }, { yPercent: 0, duration: 0.5, ease: "power3.out" });
      } else if (idx === prev) {
        gsap.to(img, { yPercent: direction * -100, duration: 0.5, ease: "power3.out" });
      }
    });
  }, []);

  const handleLeave = useCallback(() => {
    setActiveIndex(null);
    isHovering.current = false;
    gsap.to(floatWrapRef.current, { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in" });
  }, []);

  return (
    <section id="projects" ref={containerRef} className={s.section} style={{ clipPath: "inset(0)" }} onMouseLeave={forceHide}>

      {/* Floating image — follows cursor with bounce rotation */}
      <div
        ref={floatWrapRef}
        className={s.floatWrap}
        style={{ opacity: 0, scale: 0.9, top: 0, left: 0 }}
      >
        <div ref={floatBounceRef} className={s.floatBounce} style={{ transformOrigin: "center center" }}>
          {projects.map((project, i) => (
            <div
              key={i}
              className={`${s.projectSlide} project-slide`}
            >
              <Image
                src={project.src}
                alt={project.title}
                fill
                className={s.slideImage}
                sizes="480px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className={`${s.header} projects-header-inner`}>
        <div className={s.headerFlex}>
          <div>
            <span className={`${s.headerLabel} header-label`}>
              [ Selected Works ]
            </span>
            <h2 className={s.headerTitle}>
              <div className={s.wordMask}><span className={`${s.headerWord} header-word`}>Recent</span></div>
              <div className={s.wordMask}><span className={`${s.headerWord} header-word`}>Work</span></div>
            </h2>
          </div>
          <Link href="/archive" className={`${s.moreWorkLink} more-work-link`}>
            <span>More work</span>
            <svg className={s.arrowIconSmall} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Project List */}
      <div className={`${s.projectList} project-list`}>
        {projects.map((project, i) => (
          <div key={i}>
            {/* Stripe line */}
            <div className={`${s.rowStripe} row-stripe`} />

            {/* Row */}
            <Link
              href={project.link}
              className={s.rowLink}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
            >
              <div className={s.titleMask}>
                <h3 className={`${s.rowTitle} row-title`}>
                  {project.title}
                </h3>
              </div>

              <div className={`${s.rowMeta} row-meta`}>
                <span className={s.category}>
                  {project.category}
                </span>
                <span className={s.year}>
                  {project.year}
                </span>
              </div>
            </Link>
          </div>
        ))}
        {/* Final stripe */}
        <div className={`${s.rowStripe} row-stripe`} />
      </div>

      {/* View All */}
      <div className={s.viewAllWrap}>
        <Link href="/archive" className={s.viewAllLink}>
          <div className={s.fillBg} />
          <span className={s.viewAllText}>View All Projects</span>
          <svg className={s.viewAllArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
