"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from './TextReveal.module.scss';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  threshold?: number;
}

export default function TextReveal({ 
  children, 
  className = "", 
  delay = 0,
  duration = 1,
  stagger = 0.02,
  threshold = 0.2
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const words = containerRef.current?.querySelectorAll(".word");
      
      if (words) {
        gsap.fromTo(words, 
          { 
            y: 50, 
            opacity: 0,
            rotationX: 45
          },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: duration,
            stagger: stagger,
            ease: "power3.out",
            delay: delay,
            scrollTrigger: {
              trigger: containerRef.current,
              start: `top ${100 - (threshold * 100)}%`,
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [delay, duration, stagger, threshold]);

  // Split text into words
  const words = children.split(" ");

  return (
    <div ref={containerRef} className={`${s.container} ${className}`}>
      <div className={s.wordWrapper}>
        {words.map((word, i) => (
          <span key={i} className={`${s.word} word`}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
