"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  siReact,
  siTypescript,
  siThreedotjs,
  siNodedotjs,
  siFigma,
  siGreensock,
} from "simple-icons";
import s from "./CraftBuild.module.scss";

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  { name: "React",      tag: "frontend", icon: siReact,      accent: "#61DAFB" },
  { name: "TypeScript",  tag: "language",  icon: siTypescript, accent: "#3178C6" },
  { name: "Three.js",    tag: "creative",  icon: siThreedotjs, accent: "#aaa" },
  { name: "Node.js",     tag: "backend",   icon: siNodedotjs,  accent: "#5FA04E" },
  { name: "Figma",       tag: "design",    icon: siFigma,      accent: "#F24E1E" },
  { name: "GSAP",        tag: "motion",    icon: siGreensock,  accent: "#88CE02" },
];

const STACK_SHOW = 3;

export default function CraftBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const ord = useRef(SKILLS.map((_, i) => i));
  const drag = useRef({ on: false, x0: 0, dx: 0 });
  const busy = useRef(false);

  const layStack = useCallback(() => {
    const deck = deckRef.current;
    if (!deck) return;
    ord.current.forEach((si, pos) => {
      const el = deck.children[si] as HTMLElement;
      if (!el) return;
      const vis = pos < STACK_SHOW;
      gsap.set(el, {
        zIndex: SKILLS.length - pos,
        scale: vis ? 1 - pos * 0.045 : 0.84,
        y: vis ? pos * 14 : 42,
        rotateX: vis ? pos * -1.5 : -4,
        opacity: vis ? 1 - pos * 0.2 : 0,
        pointerEvents: pos === 0 ? "auto" : "none",
      });
    });
  }, []);

  const syncCount = useCallback(() => {
    if (countRef.current) {
      const n = ord.current[0] + 1;
      countRef.current.textContent = `${String(n).padStart(2, "0")} / ${String(SKILLS.length).padStart(2, "0")}`;
    }
  }, []);

  const fling = useCallback((dir: number) => {
    if (busy.current) return;
    busy.current = true;
    const deck = deckRef.current;
    if (!deck) return;
    const o = ord.current;
    const top = deck.children[o[0]] as HTMLElement;

    gsap.to(top, {
      x: dir * 600, y: -70, rotation: dir * 30, rotateY: dir * 60,
      opacity: 0, duration: 0.5, ease: "power3.in",
    });

    for (let i = 1; i < Math.min(STACK_SHOW + 1, o.length); i++) {
      const c = deck.children[o[i]] as HTMLElement;
      const np = i - 1;
      const vis = np < STACK_SHOW;
      gsap.to(c, {
        zIndex: SKILLS.length - np,
        scale: vis ? 1 - np * 0.045 : 0.84,
        y: vis ? np * 14 : 42,
        rotateX: vis ? np * -1.5 : -4,
        opacity: vis ? 1 - np * 0.2 : 0,
        pointerEvents: np === 0 ? "auto" : "none",
        duration: 0.5, ease: "back.out(1.7)", delay: 0.08,
      });
    }

    gsap.delayedCall(0.55, () => {
      ord.current = [...o.slice(1), o[0]];
      gsap.set(top, { x: 0, y: 0, rotation: 0, rotateY: 0, zIndex: 0, scale: 0.84, opacity: 0, pointerEvents: "none" });
      syncCount();
      busy.current = false;
    });
  }, [syncCount]);

  const onDown = useCallback((e: React.PointerEvent) => {
    if (busy.current) return;
    drag.current = { on: true, x0: e.clientX, dx: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.on) return;
    drag.current.dx = e.clientX - drag.current.x0;
    const deck = deckRef.current;
    if (deck) {
      const top = deck.children[ord.current[0]] as HTMLElement;
      const dx = drag.current.dx;
      gsap.set(top, { x: dx, rotation: dx * 0.05, rotateY: dx * 0.08 });
    }
  }, []);

  const onUp = useCallback(() => {
    if (!drag.current.on) return;
    drag.current.on = false;
    const { dx } = drag.current;
    const deck = deckRef.current;
    if (!deck) return;
    const top = deck.children[ord.current[0]] as HTMLElement;

    if (Math.abs(dx) < 5) {
      fling(Math.random() > 0.5 ? 1 : -1);
    } else if (Math.abs(dx) > 80) {
      fling(dx > 0 ? 1 : -1);
    } else {
      gsap.to(top, { x: 0, rotation: 0, rotateY: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    }
  }, [fling]);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      layStack();
      syncCount();
      return;
    }

    layStack();
    syncCount();

    const cards = deckRef.current?.children;
    if (cards) {
      ord.current.forEach((si, pos) => {
        if (pos >= STACK_SHOW) return;
        const el = cards[si] as HTMLElement;
        gsap.fromTo(el,
          { y: 120 + pos * 40, opacity: 0, scale: 0.7, rotateX: -12 },
          {
            y: pos * 14, opacity: 1 - pos * 0.2, scale: 1 - pos * 0.045, rotateX: pos * -1.5,
            duration: 1, ease: "expo.out", delay: pos * 0.12,
            scrollTrigger: { trigger: sec, start: "top 65%" },
          },
        );
      });
    }

    gsap.fromTo(`.${s.deckCount}`,
      { opacity: 0, y: 10 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: sec, start: "top 50%" },
      },
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [layStack, syncCount]);

  return (
    <section ref={sectionRef} className={s.section} aria-label="Skills">
      <div className={s.stage}>
        <div ref={deckRef} className={s.deck} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}>
          {SKILLS.map((sk) => (
            <div
              key={sk.name}
              className={s.card}
              style={{ "--accent": sk.accent } as React.CSSProperties}
              role="group"
              aria-label={`${sk.name} — ${sk.tag}`}
            >
              <svg className={s.cardIcon} viewBox="0 0 24 24" aria-hidden="true">
                <path d={sk.icon.path} fill="currentColor" />
              </svg>
              <span className={s.cardName}>{sk.name}</span>
              <span className={s.cardTag}>{sk.tag}</span>
            </div>
          ))}
        </div>
        <span ref={countRef} className={s.deckCount} aria-hidden="true" />
      </div>
    </section>
  );
}
