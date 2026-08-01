"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";
import s from "./Archive.module.scss";

gsap.registerPlugin(ScrollTrigger);

const previews = [
  "/project-aria-new.jpg",
  "/project-melograph-red.png",
  "/museum.png",
];

const palettes = [s.aria, s.melograph, s.museum];

export default function Archive() {
  const pageRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const load = gsap.timeline({ defaults: { ease: "power4.out" } });
      load
        .fromTo(`.${s.archiveTitle}`, { yPercent: 115, rotate: 3 }, {
          yPercent: 0,
          rotate: 0,
          duration: 1,
        })
        .fromTo(`.${s.introCopy} > *`, { y: 24, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
        }, "-=0.55")
        .fromTo(`.${s.scrollCue}`, { opacity: 0, y: 12 }, {
          opacity: 1,
          y: 0,
          duration: 0.5,
        }, "-=0.3");

      gsap.utils.toArray<HTMLElement>(`.${s.project}`).forEach((project) => {
        const visual = project.querySelector(`.${s.visual}`);
        const copy = project.querySelectorAll(`.${s.projectCopy} > *`);
        const index = project.querySelector(`.${s.index}`);

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: project,
            start: "top 72%",
            once: true,
          },
        });

        timeline
          .fromTo(index, { opacity: 0, y: 28 }, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          })
          .fromTo(visual, { clipPath: "inset(0 0 100% 0)" }, {
            clipPath: "inset(0 0 0% 0)",
            duration: 1,
            ease: "power4.inOut",
          }, 0.05)
          .fromTo(copy, { opacity: 0, y: 30 }, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: "power3.out",
          }, 0.42);
      });
    }, page);

    return () => context.revert();
  }, []);

  return (
    <main ref={pageRef} className={s.page}>
      <header className={s.hero}>
        <Link href="/" className={s.backLink}>
          <svg className={s.backTopArrow} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 11v2H4v-2zM8 13v2H6v-2zm2 2v2H8v-2zm2 2v2h-2v-2zm-4-6V9H6v2z" />
            <path d="M10 15V7H8v8zm2 2V5h-2v12z" />
          </svg>
          <span>Back home</span>
        </Link>

        <div className={s.titleMask}>
          <h1 className={s.archiveTitle}>Archive</h1>
        </div>

        <div className={s.introCopy}>
          <p>Three projects shaped through interface, motion, and code.</p>
          <div className={s.archiveMeta}>
            <span>03 selected</span>
            <span>2025—2026</span>
          </div>
        </div>

        <span className={s.scrollCue}>Scroll through the work ↓</span>
      </header>

      <section className={s.projectStack} aria-label="All projects">
        {projects.map((project, index) => (
          <article
            key={project.slug}
            className={`${s.project} ${palettes[index]}`}
          >
            <span className={s.index}>0{index + 1}</span>

            <Link href={`/case/${project.slug}`} className={s.visual}>
              <Image
                src={previews[index]}
                alt={`${project.title} project preview`}
                fill
                className={s.image}
                sizes="(max-width: 800px) 92vw, 62vw"
                priority={index === 0}
              />
            </Link>

            <div className={s.projectCopy}>
              <div className={s.projectMeta}>
                <span>{project.category}</span>
                <span>{project.year}</span>
              </div>

              <h2>{project.title}</h2>
              <p>{project.description}</p>

              <div className={s.technologyList} aria-label="Technologies">
                {project.technologies.slice(0, 3).map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>

              <Link href={`/case/${project.slug}`} className={s.viewLink}>
                <span>View project</span>
                <span className={s.viewArrow} aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        ))}
      </section>

      <footer className={s.footer}>
        <Link href="/">
          <span>Return home</span>
          <span className={s.returnArrowWindow} aria-hidden="true">
            <svg
              className={s.returnArrow}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20 11v2H4v-2zM8 13v2H6v-2zm2 2v2H8v-2zm2 2v2h-2v-2zm-4-6V9H6v2z" />
              <path d="M10 15V7H8v8zm2 2V5h-2v12z" />
            </svg>
          </span>
        </Link>
        <span>Niko, creative developer</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
