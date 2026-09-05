"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    lenis?: { start: () => void; stop: () => void };
  }
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Check if device is touch-enabled
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // If touch device, don't initialize Lenis (use native scroll)
    if (isTouch) {
        return;
    }
    
    const lenis = new Lenis({
      duration: 0.72,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      autoRaf: true,
    });

    window.lenis = lenis;

    return () => {
      lenis.destroy();
      window.lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
