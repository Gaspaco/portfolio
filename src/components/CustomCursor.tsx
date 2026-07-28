"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // Only run on devices with fine pointer (mouse)
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    // Center the elements initially
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    // Use quickTo for high performance mouse following
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });

    // Slower follower for fluid feel (lerp)
    const xToFollower = gsap.quickTo(follower, "x", { duration: 0.6, ease: "power3" });
    const yToFollower = gsap.quickTo(follower, "y", { duration: 0.6, ease: "power3" });

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        data-custom-cursor
        className="hidden [@media(pointer:fine)]:block fixed top-0 left-0 w-3 h-3 bg-accent-primary rounded-full pointer-events-none z-[9999] transition-opacity duration-200"
      />
      <div
        ref={followerRef}
        data-custom-cursor
        className="hidden [@media(pointer:fine)]:flex fixed top-0 left-0 w-12 h-12 bg-white rounded-full pointer-events-none z-[9998] items-center justify-center mix-blend-difference transition-transform duration-300 ease-out transition-opacity duration-200"
      />

    </>
  );
}
