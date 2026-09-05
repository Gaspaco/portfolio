"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";
import s from "./Projects.module.scss";

gsap.registerPlugin(ScrollTrigger);

const PREVIEWS: Partial<Record<string, string>> = {
  aria: "/project-aria-new.jpg",
  melograph: "/project-melograph-preview.jpg",
};
const FOOTER_TEXT = "More experiments are always in progress.";

function PixelArrowUpRight({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 11v2h16v-2zm12 2v2h2v-2zm-2 2v2h2v-2zm-2 2v2h2v-2zm4-6V9h2v2z" />
      <path d="M14 15V7h2v8zm-2 2V5h2v12z" />
    </svg>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        `.${s.heading} > *`,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.${s.heading}`,
            start: "top 84%",
            once: true,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>(`.${s.project}`).forEach((project) => {
        const top = project.querySelector(`.${s.projectTop}`);
        const image = project.querySelector(`.${s.image}`);
        const mediaTitle = project.querySelector(`.${s.mediaTitle}`);
        const bottom = project.querySelector(`.${s.projectBottom}`);
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: project,
            start: "top 82%",
            once: true,
          },
        });

        timeline
          .fromTo(top, { opacity: 0, y: 28 }, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
          })
          .fromTo(image, { clipPath: "inset(0 0 100% 0)" }, {
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
            ease: "power4.inOut",
          }, 0.08)
          .fromTo(mediaTitle, {
            clipPath: "inset(0 100% 0 0)",
            x: -12,
          }, {
            clipPath: "inset(0 0% 0 0)",
            x: 0,
            duration: 0.85,
            ease: "power3.out",
          }, 0.58)
          .fromTo(bottom, { opacity: 0, y: 20 }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          }, 0.48);
      });

      const footerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: `.${s.footer}`,
          start: "top 78%",
          once: true,
        },
      });

      footerTimeline
        .fromTo(
          `.${s.footerChar}`,
          { opacity: 0, y: 12, rotate: 5 },
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            duration: 0.22,
            stagger: 0.032,
            ease: "power2.out",
          },
        )
        .fromTo(
          `.${s.footer} a`,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
          "-=0.18",
        );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className={s.section}>
      <header className={s.heading}>
        <h2>Projects</h2>
        <div className={s.headingMeta}>
          <span>{projects.length} selected projects</span>
          <Link href="/archive" className={s.moreProjectsLink}>
            <span>More projects</span>
            <PixelArrowUpRight className={s.moreProjectsArrow} />
          </Link>
        </div>
      </header>

      <div className={s.projectList}>
        {projects.map((project, index) => (
          <Link
            href={`/case/${project.slug}`}
            key={project.slug}
            className={s.project}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("sound-play", { detail: { sound: "longclick" } }),
              )
            }
          >
            <div className={s.projectTop}>
              <div className={s.identity}>
                <h3>{project.title}</h3>
                <span>{project.category}</span>
              </div>
              <span className={s.jump}>Jump to project</span>
            </div>

            <div className={s.media}>
              <Image
                src={PREVIEWS[project.slug] ?? project.src}
                alt={`${project.title} website preview`}
                fill
                className={s.image}
                sizes="(max-width: 800px) 100vw, 94vw"
                priority={index === 0}
              />
              <span className={s.mediaTitle} aria-hidden="true">
                {project.title}
              </span>
            </div>

            <div className={s.projectBottom}>
              <span className={s.arrow}>↗</span>
              <div className={s.data}>
                <div>
                  <span>Project time</span>
                  <strong>{project.duration}</strong>
                </div>
                <div>
                  <span>Project field</span>
                  <strong>{project.category}</strong>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <footer className={s.footer}>
        <div className={s.footerMarquee} aria-hidden="true">
          <svg className={s.uMarquee} viewBox="0 0 1600 600" preserveAspectRatio="none">
            <defs>
              <path id="projects-u-path" pathLength="100" d="M-140 62 C85 62 150 174 420 174 L790 174 C970 174 1008 350 1072 492 C1128 584 1160 642 1160 720" />
            </defs>
            <use href="#projects-u-path" className={s.uBand} />
            <path
              className={s.uBandLeg}
              d="M790 174 C970 174 1008 350 1072 492 C1128 584 1160 642 1160 720"
            />
            <text className={s.uText} dy="0.33em">
              <textPath href="#projects-u-path" startOffset="-100%" textLength="1400" lengthAdjust="spacing">
                  Selected work ◆ <tspan className={s.uAccent}>Side quests</tspan> ◆ Experiments ◆ <tspan className={s.uAccent}>Digital playground</tspan> ◆
                <animate attributeName="startOffset" from="-100%" to="0%" dur="11s" repeatCount="indefinite" />
              </textPath>
            </text>
            <text className={s.uText} dy="0.33em">
              <textPath href="#projects-u-path" startOffset="0%" textLength="1400" lengthAdjust="spacing">
                  Selected work ◆ <tspan className={s.uAccent}>Side quests</tspan> ◆ Experiments ◆ <tspan className={s.uAccent}>Digital playground</tspan> ◆
                <animate attributeName="startOffset" from="0%" to="100%" dur="11s" repeatCount="indefinite" />
              </textPath>
            </text>
          </svg>
        </div>
        <p aria-label={FOOTER_TEXT}>
          {FOOTER_TEXT.split(" ").map((word, wordIndex) => (
            <span key={`${word}-${wordIndex}`} className={s.footerWord} aria-hidden="true">
              {Array.from(word).map((character, characterIndex) => (
                <span key={`${character}-${characterIndex}`} className={s.footerChar}>
                  {character}
                </span>
              ))}
            </span>
          ))}
        </p>
        <Link href="/archive" className={s.archiveLink}>
          <span>Explore the archive</span>
          <PixelArrowUpRight className={s.archiveArrow} />
        </Link>
      </footer>
    </section>
  );
}
