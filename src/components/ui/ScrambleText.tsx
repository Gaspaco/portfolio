"use client";

import { useEffect, useRef } from "react";

interface ScrambleTextProps {
  text: string;
  trigger?: boolean;
  className?: string;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";

export default function ScrambleText({ text, trigger = true, className = "" }: ScrambleTextProps) {
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!trigger || !elementRef.current) return;

    let iteration = 0;
    const interval = setInterval(() => {
      if (!elementRef.current) return;
      
      elementRef.current.innerText = text
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return text[index];
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [trigger, text]);

  return (
    <span ref={elementRef} className={className}>
      {text}
    </span>
  );
}
