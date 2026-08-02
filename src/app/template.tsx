"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
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

const TRANSITION_KEY = "niko-route-transition";

export default function Template({ children }: { children: ReactNode }) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isCovering, setIsCovering] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(TRANSITION_KEY) === "pending") {
      window.sessionStorage.removeItem(TRANSITION_KEY);
      setShouldAnimate(true);
    }

    const startCover = () => {
      window.sessionStorage.setItem(TRANSITION_KEY, "pending");
      setIsCovering(true);
    };
    window.addEventListener("pixel-transition-start", startCover);
    return () => window.removeEventListener("pixel-transition-start", startCover);
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
      {isCovering && (
        <div className={s.pixelCover} aria-hidden="true">
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
