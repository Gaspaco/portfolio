"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/lib/projects";
import s from "./CaseStudy.module.scss";

const projectsIndex = (slug: string) => ["aria", "melograph", "museum"].indexOf(slug);

export default function CaseStudy({ project, nextProject }: { project: Project; nextProject: Project }) {
  const root = useRef<HTMLElement>(null);
  const hero = useRef<HTMLElement>(null);
  const router = useRouter();

  const openNextProject = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    const href = `/case/${nextProject.slug}`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    window.dispatchEvent(new CustomEvent("pixel-transition-start"));
    window.dispatchEvent(new CustomEvent("sound-play", { detail: { sound: "longclick" } }));
    window.setTimeout(() => router.push(href), 850);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .from(`.${s.heroMedia}`, { clipPath: "inset(0 0 0 100%)", duration: 1.45 }, 0.12)
        .from(`.${s.heroImage}`, { scale: 1.12, duration: 1.8 }, 0.18)
        .from(`.${s.heroTitle} span`, { yPercent: 110, duration: 1.1, stagger: 0.08 }, 0.45)
        .from(`.${s.heroBridge}`, { scale: 0.72, rotate: -8, opacity: 0, duration: 0.85 }, 0.88);

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-image]").forEach((element) => {
        gsap.from(element, {
          clipPath: "inset(8% 0 8% 0)",
          scale: 0.96,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: element, start: "top 82%", once: true },
        });
      });

      gsap.from(`.${s.deviceLaptop}`, {
        y: 110,
        scale: 0.82,
        rotateX: 13,
        duration: 1.35,
        ease: "power4.out",
        scrollTrigger: { trigger: `.${s.deviceStage}`, start: "top 78%", once: true },
      });

      gsap.fromTo(
        `.${s.statementWord}`,
        { opacity: 0.14, y: "0.45em", filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.035,
          ease: "none",
          scrollTrigger: {
            trigger: `.${s.statement}`,
            start: "top 78%",
            end: "bottom 58%",
            scrub: 0.65,
          },
        },
      );

    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className={s.main}>
      <section ref={hero} className={s.hero}>
        <div className={s.heroMedia}>
          <Image
            src={project.caseHero ?? project.src}
            alt={`${project.title} project cover`}
            fill
            className={`${s.heroImage} ${project.caseHero ? s.heroMockup : ""}`}
            priority
          />
          <div className={s.heroShade} />
          <span className={s.frameIndex}>{project.year}</span>
        </div>
        <div className={s.heroRail}>
          <Link href="/archive" className={s.back}>
            <svg className={s.backArrow} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 11v2H4v-2zM8 13v2H6v-2zm2 2v2H8v-2zm2 2v2h-2v-2zm-4-6V9H6v2z" />
              <path d="M10 15V7H8v8zm2 2V5h-2v12z" />
            </svg>
            <span>All projects</span>
          </Link>
          <h1 className={s.heroTitle} aria-label={project.title}>
            {Array.from(project.title).map((character, index) => (
              <span key={`${character}-${index}`} aria-hidden="true">{character === " " ? "\u00A0" : character}</span>
            ))}
          </h1>
          <p className={s.heroSummary}>{project.description}</p>
        </div>
        <div className={s.heroBridge} aria-hidden="true">
          <span>Selected work</span>
          <strong>{String(projectsIndex(project.slug) + 1).padStart(2, "0")}</strong>
        </div>
        <a className={s.scrollCue} href="#project-intro">
          <span>Explore the case</span><i aria-hidden="true">↓</i>
        </a>
      </section>

      <section id="project-intro" className={s.intro}>
        <p className={s.index}>Selected work / {project.year}</p>
        <div className={s.introMain} data-reveal>
          <h2>{project.description}</h2>
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className={s.liveLink}>
            Visit live project <span>↗</span>
          </a>
        </div>
        <dl className={s.meta} data-reveal>
          <div><dt>Role</dt><dd>{project.role}</dd></div>
          <div><dt>Timeline</dt><dd>{project.duration}</dd></div>
          <div><dt>Services</dt><dd>{project.technologies.join(", ")}</dd></div>
        </dl>
      </section>

      <section className={s.statement}>
        <p aria-label={project.longDescription}>
          {project.longDescription.split(/\s+/).map((word, index) => (
            <span className={s.statementWord} aria-hidden="true" key={`${word}-${index}`}>
              {word}
            </span>
          ))}
        </p>
      </section>

      <section className={s.deviceStage} aria-label={`${project.title} desktop presentation`}>
        <div className={s.deviceCaption}><span>DESKTOP EXPERIENCE</span><span>01 / RESPONSIVE BUILD</span></div>
        <div className={s.deviceIntro} data-reveal>
          <span>Desktop experience</span>
          <p>The interface in motion,<br />shown where it was built to live.</p>
        </div>
        <div className={s.deviceLaptop}>
          <div className={s.laptopScreen}>
            <Image src={project.images[0]} alt={`${project.title} website preview`} fill sizes="(max-width: 768px) 94vw, 78vw" className={s.laptopPoster} />
            <video src={`/case-${project.slug}.webm`} poster={project.images[0]} aria-label={`${project.title} website interaction preview`} autoPlay muted loop playsInline preload="metadata" />
          </div>
          <Image src="/macbook-pro-16-modern.avif" alt="" fill sizes="(max-width: 768px) 110vw, 92vw" className={s.laptopFrame} aria-hidden="true" />
        </div>
      </section>

      <section className={s.story}>
        <div className={s.storyBlock} data-reveal>
          <p className={s.storyLabel}>The challenge</p>
          <h2>Making the experience feel inevitable.</h2>
          <p>{project.challenge}</p>
        </div>
        <div className={`${s.storyBlock} ${s.storyBlockRight}`} data-reveal>
          <p className={s.storyLabel}>The response</p>
          <h2>One clear system, built around the content.</h2>
          <p>{project.solution}</p>
        </div>
      </section>

      <section className={s.process}>
        <header data-reveal>
          <p>From direction to delivery</p>
          <h2>The work behind<br />the final frame.</h2>
        </header>
        <ol>
          {project.process.map((item, index) => (
            <li key={item.step} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.step}</h3>
              <p>{item.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.visualPair}>
        <figure className={s.visualTall} data-image>
          <Image src={project.images[1] ?? project.src} alt={`${project.title} detail view`} fill sizes="(max-width: 768px) 100vw, 58vw" />
        </figure>
        <blockquote data-reveal>
          <span>“</span>
          <p>{project.quote}</p>
        </blockquote>
      </section>

      <section className={s.outcomes}>
        <p className={s.outcomeLabel}>What shipped</p>
        {project.results.map((result, index) => (
          <div className={s.outcome} key={result} data-reveal>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{result}</p>
          </div>
        ))}
      </section>

      <section className={s.next} aria-label={`Next project: ${nextProject.title}`}>
        <div className={s.nextTicker} aria-hidden="true">
          {[0, 1, 2].map((row) => (
            <div className={s.nextTickerRow} key={row}>
              <div className={s.nextTickerTrack}>
                <span>{nextProject.title} · {nextProject.title} · {nextProject.title} ·</span>
                <span>{nextProject.title} · {nextProject.title} · {nextProject.title} ·</span>
              </div>
            </div>
          ))}
        </div>
        <div className={s.nextCopy}>
          <span className={s.nextLabel}>Next project · {nextProject.year}</span>
          <h2>{nextProject.title}</h2>
          <p>{nextProject.category}</p>
        </div>
        <Link href={`/case/${nextProject.slug}`} className={s.nextAction} onClick={openNextProject}>
          <span>View case study</span>
          <svg className={s.nextArrow} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4 11v2h16v-2zm12 2v2h2v-2zm-2 2v2h2v-2zm-2 2v2h2v-2zm4-6V9h2v2z" />
            <path d="M14 15V7h2v8zm-2 2V5h2v12z" />
          </svg>
        </Link>
      </section>

      <footer className={s.footer}>
        <span>Niko © {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
