"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import s from "./LoadingAnimations.module.scss";

declare global {
  interface Window { lenis?: { start: () => void; stop: () => void }; }
}

const SIZE = 10;
const CELLS = Array.from({ length: SIZE * SIZE }, (_, index) => index);
const at = (row: number, column: number) => row * SIZE + column;
const CURSOR = new Set([
  at(1,1), at(2,1),at(2,2), at(3,1),at(3,2),at(3,3), at(4,1),at(4,2),at(4,3),at(4,4),
  at(5,1),at(5,2),at(5,3),at(5,4),at(5,5), at(6,1),at(6,2),at(6,5), at(7,1),at(7,6), at(8,6),
]);
const SPARK = new Set([
  at(0,5),at(1,5),at(2,5),at(3,4),at(3,5),at(3,6),at(4,3),at(4,4),at(4,5),at(4,6),at(4,7),
  at(5,0),at(5,1),at(5,2),at(5,3),at(5,4),at(5,5),at(5,6),at(5,7),at(5,8),at(5,9),
  at(6,3),at(6,4),at(6,5),at(6,6),at(6,7),at(7,4),at(7,5),at(7,6),at(8,5),at(9,5),
]);
const FRAME = new Set([
  at(1,1),at(1,2),at(1,3),at(1,4),at(1,5),at(1,6),at(1,7),at(1,8),
  at(2,1),at(2,8),at(3,1),at(3,8),at(4,1),at(4,8),at(5,1),at(5,8),
  at(6,1),at(6,8),at(7,1),at(7,8),
  at(8,1),at(8,2),at(8,3),at(8,4),at(8,5),at(8,6),at(8,7),at(8,8),
]);
const EYE = new Set([
  at(3,2),at(3,3),at(3,4),at(3,5),at(3,6),at(3,7),
  at(4,1),at(4,4),at(4,5),at(4,8),
  at(5,1),at(5,4),at(5,5),at(5,8),
  at(6,2),at(6,3),at(6,4),at(6,5),at(6,6),at(6,7),
]);
const CODE = new Set([
  at(2,2),at(3,1),at(4,0),at(5,1),at(6,2),
  at(2,7),at(3,8),at(4,9),at(5,8),at(6,7),
  at(2,6),at(3,6),at(4,5),at(5,4),at(6,4),at(7,3),
]);
const ARROW = new Set([
  at(2,6),at(3,6),at(3,7),at(4,6),at(4,7),at(4,8),
  at(5,1),at(5,2),at(5,3),at(5,4),at(5,5),at(5,6),at(5,7),at(5,8),at(5,9),
  at(6,6),at(6,7),at(6,8),at(7,6),at(7,7),at(8,6),
]);

export default function LoadingAnimations({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const grid = gridRef.current;
    if (!root || !grid) return;
    const cells = Array.from(grid.children);
    const unlock = () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.lenis?.start();
    };
    const state = (pattern: Set<number>, duration = 0.36) => ({
      backgroundColor: (index: number) => pattern.has(index) ? "#b6ff00" : "rgba(17,17,17,.12)",
      duration,
      stagger: { amount: 0.22, from: "random" as const },
      ease: "power3.inOut",
    });

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.lenis?.stop();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => { unlock(); onComplete(); }, 80);
      return () => { window.clearTimeout(timer); unlock(); };
    }

    const context = gsap.context(() => {
      const progress = { value: 0 };
      gsap.timeline({ onComplete: () => { unlock(); onComplete(); } })
        .to(`.${s.meta}`, { opacity: 1, duration: 0.28 })
        .to(cells, state(CURSOR, 0.52), 0.08)
        .to(cells, state(FRAME, 0.52), 0.8)
        .to(cells, state(SPARK, 0.52), 1.52)
        .to(cells, state(EYE, 0.52), 2.24)
        .to(cells, state(CODE, 0.52), 2.96)
        .to(cells, state(ARROW, 0.56), 3.68)
        .to(progress, {
          value: 100,
          duration: 4.3,
          ease: "none",
          onUpdate: () => {
            if (countRef.current) countRef.current.textContent = `${String(Math.round(progress.value)).padStart(3, "0")}%`;
          },
        }, 0.02)
        .to(`.${s.interface}`, { opacity: 0, duration: 0.2 }, "+=0.12")
        .to(root, { clipPath: "inset(0 0 0 100%)", duration: 0.75, ease: "expo.inOut" });
    }, root);

    return () => { context.revert(); unlock(); };
  }, [onComplete]);

  return (
    <div ref={rootRef} className={s.root} role="status" aria-label="Loading portfolio">
      <div className={s.interface}>
        <header className={`${s.meta} ${s.header}`}><span>Loading</span><span ref={countRef}>000%</span></header>
        <main className={s.stage}>
          <div ref={gridRef} className={s.grid} aria-hidden="true">
            {CELLS.map((cell) => <i key={cell} />)}
          </div>
        </main>
      </div>
    </div>
  );
}
