"use client";

import { useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import s from "./Contact.module.scss";

const EMAIL = "nikodima2007@gmail.com";
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("Portfolio project enquiry")}`;

function PixelArrow() {
  return (
    <svg className={s.pixelArrow} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 11h11V7h2v2h2v2h2v2h-2v2h-2v2h-2v-4H4z" />
    </svg>
  );
}

function PixelUpArrow() {
  return (
    <svg className={s.backToTopArrow} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 11h11V7h2v2h2v2h2v2h-2v2h-2v2h-2v-4H4z" />
    </svg>
  );
}

function PixelExternalArrow() {
  return (
    <svg className={s.socialArrow} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 11h11V7h2v2h2v2h2v2h-2v2h-2v2h-2v-4H4z" />
    </svg>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer: IntersectionObserver | undefined;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ paused: true });

      timeline
        .fromTo(`.${s.topline} > *`, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" })
        .fromTo(`.${s.atSymbol}`, { opacity: 0, scale: 0.68, rotate: 12 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.15, ease: "power4.out" }, 0.06)
        .fromTo(`.${s.heading}`, { clipPath: "inset(0 0 100% 0)", y: 36 }, { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.85, ease: "power4.out" }, 0.12)
        .fromTo(`.${s.emailRow}`, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.38)
        .fromTo(`.${s.bottom} > *`, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" }, 0.58);
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        timeline.play();
        observer?.disconnect();
      }, { threshold: 0.2 });
      observer.observe(section);
    }, section);

    return () => {
      observer?.disconnect();
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="contact" className={s.section}>
      <a
        href={MAILTO}
        className={s.atSymbol}
        aria-label={`Let's talk — email ${EMAIL}`}
        title={`Email ${EMAIL}`}
        data-sound="longclick"
      >
        <svg className={s.atOrbit} viewBox="0 0 200 200">
          <defs>
            <path id="contact-circle-path" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
          </defs>
          <text textLength="515" lengthAdjust="spacing">
            <textPath href="#contact-circle-path" startOffset="1%">
              LET&apos;S TALK · LET&apos;S TALK · LET&apos;S TALK · LET&apos;S TALK · LET&apos;S TALK · LET&apos;S TALK ·
            </textPath>
          </text>
        </svg>
        <span>@</span>
      </a>
      <div className={s.topline}>
        <span>Available for selected projects</span>
        <span>The Netherlands / Remote</span>
      </div>
      <div className={s.main}>
        <div className={s.pitch}>
          <h2 className={s.heading}>Have something fun in mind?</h2>
          <p>Tell me what you are building, what feels stuck, or what you want people to remember.</p>
        </div>
        <div className={s.emailRow}>
          <a
            href={MAILTO}
            className={s.emailLink}
            aria-label={`Email ${EMAIL}`}
            title={`Email ${EMAIL}`}
            data-sound="longclick"
          >
            <span className={s.emailText} aria-label={EMAIL}>
              {Array.from(EMAIL).map((character, index) => (
                <span
                  key={`${character}-${index}`}
                  className={`${s.emailCharacter} ${character === "." ? s.emailDot : ""}`}
                  style={{ "--character-index": index } as CSSProperties}
                  aria-hidden="true"
                >
                  {character}
                </span>
              ))}
            </span>
            <PixelArrow />
          </a>
          <a href="#top" className={s.copyButton}>
            <span>Back to top</span>
            <PixelUpArrow />
          </a>
        </div>
      </div>
      <div className={s.bottom}>
        <span>Niko Dima © 2026</span>
        <nav className={s.socials} aria-label="Social links">
          <a href="https://www.instagram.com/nik0d_/" target="_blank" rel="noreferrer"><span>Instagram</span><PixelExternalArrow /></a>
          <a href="https://www.linkedin.com/in/niko-dima-64246b33a/" target="_blank" rel="noreferrer"><span>LinkedIn</span><PixelExternalArrow /></a>
        </nav>
        <span aria-hidden="true" />
      </div>
    </section>
  );
}
