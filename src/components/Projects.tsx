"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Cursor follower with spring/bounce physics
  useEffect(() => {
    const wrap = floatWrapRef.current;
    const bounce = floatBounceRef.current;
    if (!wrap || !bounce) return;

    // Start all slides off-screen
    gsap.set(bounce.querySelectorAll(".project-slide"), { yPercent: 100 });

    // Position follows cursor directly
    const xTo = gsap.quickTo(wrap, "left", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(wrap, "top", { duration: 0.4, ease: "power3.out" });

    // Bounce layer adds spring offset based on velocity
    let prevX = 0;
    let prevY = 0;
    const rotTo = gsap.quickTo(bounce, "rotate", { duration: 0.5, ease: "elastic.out(1, 0.5)" });

    const onMouseMove = (e: MouseEvent) => {
      if (!isHovering.current) return;
      const dx = e.clientX - prevX;
      prevX = e.clientX;
      prevY = e.clientY;

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
    setActiveIndex(i);
    isHovering.current = true;
    gsap.to(floatWrapRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });

    // Slide animation between images
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
    <section ref={containerRef} className="bg-black relative z-30 py-28 md:py-40">

      {/* Floating image — follows cursor with bounce rotation */}
      <div
        ref={floatWrapRef}
        className="hidden md:block fixed w-[480px] h-[300px] pointer-events-none z-[60] overflow-hidden"
        style={{ opacity: 0, scale: 0.9, top: 0, left: 0 }}
      >
        <div ref={floatBounceRef} className="w-full h-full relative rounded-sm overflow-hidden" style={{ transformOrigin: "center center" }}>
          {projects.map((project, i) => (
            <div
              key={i}
              className="project-slide absolute inset-0 w-full h-full"
            >
              <Image
                src={project.src}
                alt={project.title}
                fill
                className="object-cover"
                sizes="480px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="projects-header-inner px-6 md:px-12 mb-20 md:mb-28">
        <div className="flex items-end justify-between">
          <div>
            <span className="header-label text-[#fbbf24] font-mono text-xs uppercase tracking-[0.4em] mb-4 block">
              [ Selected Works ]
            </span>
            <h2 className="text-5xl md:text-[8vw] font-black text-white uppercase tracking-tighter leading-none pt-2">
              <div className="overflow-hidden"><span className="header-word inline-block">Recent</span></div>
              <div className="overflow-hidden"><span className="header-word inline-block">Work</span></div>
            </h2>
          </div>
          <Link href="/archive" className="more-work-link hidden md:flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/30 hover:text-[#fbbf24] transition-colors duration-300 pb-2">
            <span>More work</span>
            <svg className="w-3 h-3 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Project List */}
      <div className="project-list px-6 md:px-12">
        {projects.map((project, i) => (
          <div key={i}>
            {/* Stripe line */}
            <div className="row-stripe w-full h-[1px] bg-white/20" />

            {/* Row */}
            <Link
              href={project.link}
              className="group flex items-center justify-between py-10 md:py-14 md:cursor-none relative"
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
            >
              <div className="overflow-hidden">
                <h3 className="row-title text-4xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none group-hover:translate-y-[-3px] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]">
                  {project.title}
                </h3>
              </div>

              <div className="row-meta flex items-center gap-6 md:gap-10">
                <span className="hidden md:block text-sm font-light text-white/40 group-hover:text-white/70 transition-colors duration-300">
                  {project.category}
                </span>
                <span className="hidden md:block text-sm text-white/20 group-hover:text-white/40 transition-colors duration-300">
                  {project.year}
                </span>
              </div>
            </Link>
          </div>
        ))}
        {/* Final stripe */}
        <div className="row-stripe w-full h-[1px] bg-white/20" />
      </div>

      {/* View All */}
      <div className="px-6 md:px-12 mt-16 md:mt-24 flex justify-center">
        <Link href="/archive" className="group relative inline-flex items-center gap-4 px-12 py-6 border border-white/20 hover:border-[#fbbf24] transition-colors duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-[#fbbf24] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 text-white text-lg font-mono uppercase tracking-widest group-hover:text-black transition-colors duration-300">View All Projects</span>
          <svg className="relative z-10 w-4 h-4 -rotate-45 text-[#fbbf24] group-hover:text-black transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
