"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./IntroStatement.module.scss";

gsap.registerPlugin(ScrollTrigger);

const WORDS = "I craft digital experiences where design and code become one.".split(" ");

export default function IntroStatement() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const words = sec.querySelectorAll(`.${s.word}`);
    words.forEach((word, i) => {
      gsap.fromTo(word,
        { opacity: 0.12 },
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sec,
            start: `top+=${i * 30} 65%`,
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section ref={sectionRef} className={s.section}>
      <p className={s.statement}>
        {WORDS.map((word, i) => (
          <span key={i} className={s.word}>{word} </span>
        ))}
      </p>
    </section>
  );
}
