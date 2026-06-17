"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import s from "./Hero.module.scss";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(".hero-word",
        { opacity: 0, y: 30, rotation: 4, transformOrigin: "bottom left" },
        { opacity: 1, y: 0, rotation: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.5)" }
      )
      .fromTo(imageRef.current,
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "expo.inOut" },
        0.3
      )
      .fromTo(".hero-char",
        { opacity: 0, y: 40, rotation: 8, transformOrigin: "bottom left" },
        { opacity: 1, y: 0, rotation: 0, duration: 0.5, stagger: 0.07, ease: "back.out(1.5)" },
        0.9
      );

      if (window.matchMedia("(pointer: fine) and (min-width: 768px)").matches) {
        const moveImg = gsap.quickTo(imageRef.current, "y", { duration: 1, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          moveImg((e.clientY / window.innerHeight - 0.5) * -15);
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={s.section}
    >
      <div className={`${s.headingWrap} hero-heading`}>
        <h1
          className={s.h1}
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(1.5rem, 6.5vw, 7rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.05em",
            textTransform: "capitalize",
          }}
        >
          <div>
            {"A Creative Developer Shaping Distinct".split(" ").map((word, i) => (
              <span key={i} className="hero-word" style={{ display: "inline-block", whiteSpace: "pre" }}>{word} </span>
            ))}
          </div>
          <div>
            {"Brands And Digital Experiences.".split(" ").map((word, i) => (
              <span key={i} className="hero-word" style={{ display: "inline-block", whiteSpace: "pre" }}>{word} </span>
            ))}
          </div>
        </h1>
      </div>

      <div
        ref={imageRef}
        className={s.imageContainer}
      >
        <Image
          src="/Niko.png"
          alt="Niko"
          fill
          className={s.heroImage}
          sizes="(max-width: 768px) 80vw, 42vw"
          priority
        />
      </div>

      <div className={`${s.nameWrap} hero-name`}>
        {"Niko Dima".split("").map((char, i) => (
          <span
            key={i}
            className={`${s.heroChar} hero-char`}
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: "clamp(5rem, 22vw, 22rem)",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </div>
    </section>
  );
}
