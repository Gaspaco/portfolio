"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import s from './LoadingAnimations.module.scss';

export default function LoadingAnimations({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const mainPanelRef = useRef<HTMLDivElement>(null);
  const subPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden"; // Also lock html
    
    // Stop Lenis scrolling if it exists
    // @ts-ignore
    if (window.lenis) window.lenis.stop();
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
            document.body.style.overflow = ""; // Restore scrolling
            document.documentElement.style.overflow = "";
            // Resume Lenis scrolling
            // @ts-ignore
            if (window.lenis) window.lenis.start();
            onComplete();
        }
      });

      const progressObj = { value: 0 };

      // 1. Counter appears
      tl.to(counterRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out"
      })
      
      // 2. Counter counts up (Slower)
      .to(progressObj, {
        value: 100,
        duration: 2.0,
        ease: "expo.inOut",
        onUpdate: () => {
            if (counterRef.current) {
                counterRef.current.textContent = Math.round(progressObj.value).toString();
            }
        }
      })
      .to(".loading-bar", {
        scaleX: 1,
        duration: 2.0,
        ease: "expo.inOut"
      }, "<")

      // 3. Counter fades out
      .to([counterRef.current, ".loading-bar", ".loading-text"], {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in"
      })

      // 4. Main Curtain Reveal (Red)
      .to(mainPanelRef.current, {
        yPercent: -100,
        duration: 0.8, // Faster reveal
        ease: "expo.inOut"
      }, "-=0.1")

      // 5. Secondary Curtain Reveal (Dark) - Parallax effect
      .to(subPanelRef.current, {
        yPercent: -100,
        duration: 0.8, // Faster reveal
        ease: "expo.inOut"
      }, "-=0.6");

    }, containerRef);

    return () => {
        document.body.style.overflow = ""; // Ensure scroll is restored on unmount
        document.documentElement.style.overflow = "";
        // @ts-ignore
        if (window.lenis) window.lenis.start();
        ctx.revert();
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className={s.container}>

        {/* Secondary Panel (Darker Red) - Background Layer */}
        <div ref={subPanelRef} className={s.subPanel} />

        {/* Main Panel (Brand Red) - Foreground Layer */}
        <div ref={mainPanelRef} className={s.mainPanel}>
             {/* Counter */}
             <div className={s.counterWrapper}>
                <span ref={counterRef} className={s.counter}>0</span>

                {/* Progress Bar */}
                <div className={`${s.progressBar} loading-bar`}>
                    <div className={`${s.progressFill} loading-bar`} />
                </div>

                {/* Loading Text */}
                <span className={`${s.loadingText} loading-text`}>
                    Initializing System...
                </span>
             </div>
        </div>

    </div>
  );
}
