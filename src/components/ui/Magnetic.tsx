"use client";

import { useRef, useEffect, ReactElement, cloneElement } from "react";
import gsap from "gsap";

interface MagneticProps {
  children: ReactElement;
}

export default function Magnetic({ children }: MagneticProps) {
  const magnetic = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = magnetic.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, "x", { duration: 0.65, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(element, "y", { duration: 0.65, ease: "elastic.out(1, 0.4)" });
    let bounds = element.getBoundingClientRect();

    const updateBounds = () => {
      bounds = element.getBoundingClientRect();
    };

    const handlePointerMove = (e: PointerEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = bounds;
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const handlePointerLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("pointerenter", updateBounds);
    element.addEventListener("pointermove", handlePointerMove, { passive: true });
    element.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", updateBounds, { passive: true });

    return () => {
      element.removeEventListener("pointerenter", updateBounds);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", updateBounds);
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return cloneElement(children, { ref: magnetic } as any);
}
