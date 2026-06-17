"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import s from "./Marquee.module.scss";

export default function Marquee() {
  const textRef = useRef<SVGTextPathElement>(null);

  useEffect(() => {
    gsap.to(textRef.current, {
      attr: { startOffset: "-100%" },
      duration: 30,
      repeat: -1,
      ease: "none",
    });
  }, []);

  return (
    <div className={s.container}>
      <svg className={s.svg} viewBox="0 0 1000 200" preserveAspectRatio="none">
        <path
          id="curve"
          d="M 0 100 Q 250 20 500 100 T 1000 100 T 1500 100 T 2000 100 T 2500 100 T 3000 100"
          fill="transparent"
        />
        <text width="100%" className={s.svgText} style={{ fontSize: "60px" }}>
          <textPath ref={textRef} href="#curve" startOffset="0%">
             • Design • Develop • Deploy • Design • Develop • Deploy • Design • Develop • Deploy • Design • Develop • Deploy • Design • Develop • Deploy • Design • Develop • Deploy
          </textPath>
        </text>
      </svg>

      <div className={s.gradientOverlay} />
    </div>
  );
}
