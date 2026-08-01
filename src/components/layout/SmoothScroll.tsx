"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

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

    // Expose lenis instance to window for global access if needed
    // @ts-ignore
    window.lenis = lenis;

    return () => {
      lenis.destroy();
      // @ts-ignore
      window.lenis = null;
    };
  }, []);

  return <>{children}</>;
}
