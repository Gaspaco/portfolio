"use client";

import { useRef, useEffect } from "react";
import Magnetic from "../ui/Magnetic";
import TextReveal from "../ui/TextReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./Footer.module.scss";

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fixedFooterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
        // Animate the fixed footer text letters
        const letters = fixedFooterRef.current?.querySelectorAll(".footer-letter");
        if (letters) {
            gsap.fromTo(letters,
                { y: -200, opacity: 0, filter: "blur(20px)" },
                {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    stagger: 0.05,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "bottom bottom",
                        end: "+=100%",
                        scrub: true
                    }
                }
            );
        }

        gsap.from(".footer-element", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 60%",
            }
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={s.wrapper}>

        {/* 1. Main Footer Content (Scrolls Up) */}
        <div ref={containerRef} className={s.main}>

            {/* Background Texture */}
            <div className={s.grain}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className={s.centerContent}>
                <div className={s.titleWrap}>
                    <div className={s.title}>
                        <TextReveal>Let&apos;s Talk</TextReveal>
                    </div>
                </div>

                <Magnetic>
                    <a href="mailto:nikodima2007@gmail.com" className={`${s.cta} footer-element`}>
                        <div className={s.ctaFill} />
                        <span className={s.ctaText}>Get in Touch</span>
                    </a>
                </Magnetic>
            </div>

            <div className={`${s.bottomBar} footer-element`}>
                <div className={s.socials}>
                    <span className={s.socialsLabel}>Socials</span>
                    <div className={s.socialsLinks}>
                        <Magnetic>
                            <a href="https://www.instagram.com/nik0d_/" target="_blank" rel="noreferrer" className={s.socialLink}>Instagram</a>
                        </Magnetic>
                        <Magnetic>
                            <a href="https://www.linkedin.com/in/niko-dima-64246b33a/" target="_blank" rel="noreferrer" className={s.socialLink}>LinkedIn</a>
                        </Magnetic>
                    </div>
                </div>

                <div className={s.version}>
                    <span className={s.versionLabel}>Version</span>
                    <span>2025 Edition</span>
                </div>
            </div>
        </div>

        {/* 2. Fixed Reveal Layer (NIKO Text) */}
        <div ref={fixedFooterRef} className={s.fixedReveal}>
             {/* Darker Overlay for depth */}
             <div className={s.darkOverlay} />

             <div className={s.nikoWrap}>
                {"NIKO".split("").map((char, i) => (
                    <span key={i} className={`${s.nikoLetter} footer-letter`}>
                        {char}
                    </span>
                ))}
             </div>
        </div>

    </div>
  );
}
