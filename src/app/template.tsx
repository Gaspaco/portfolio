"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect } from "react";
import s from "./template.module.scss";

const COLUMNS = 20;
const ROWS = 12;
const PIXELS = Array.from({ length: COLUMNS * ROWS }, (_, index) => {
  const row = Math.floor(index / COLUMNS);
  const column = index % COLUMNS;
  const distanceFromCenter = Math.hypot(
    column - (COLUMNS - 1) / 2,
    row - (ROWS - 1) / 2,
  );
  return {
    index,
    delay: Math.round(distanceFromCenter * 48 + ((row * 7 + column * 11) % 4) * 10),
  };
});

let hasRenderedInitialRoute = false;

export default function Template({ children }: { children: ReactNode }) {
  const shouldAnimate = hasRenderedInitialRoute;

  useEffect(() => {
    hasRenderedInitialRoute = true;
  }, []);

  return (
    <>
      {shouldAnimate && (
        <div className={s.pixelTransition} aria-hidden="true">
          {PIXELS.map(({ index, delay }) => (
            <span
              key={index}
              style={{ "--pixel-delay": `${delay}ms` } as CSSProperties}
            />
          ))}
        </div>
      )}
      {children}
    </>
  );
}
