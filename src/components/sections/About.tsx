"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import GrainOverlay from "../ui/GrainOverlay";
import SkillsList from "../features/SkillsList";
import ScrambleText from "../ui/ScrambleText";
import s from './About.module.scss';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const glitchIntervals = useRef<Map<HTMLElement, ReturnType<typeof setInterval>>>(new Map());

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {


      // 1. HERO: ELASTIC EXPLOSION
      const words = gsap.utils.toArray(".hero-word", containerRef.current);
      gsap.fromTo(words,
        {
            y: 300,
            x: () => gsap.utils.random(-100, 100),
            rotation: () => gsap.utils.random(-45, 45),
            opacity: 0,
            scale: 0
        },
        {
            y: 0,
            x: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: 1.8,
            stagger: 0.05,
            ease: "elastic.out(1, 0.4)",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 60%",
            }
        }
      );

      // 2. PHILOSOPHY: HORIZONTAL SCROLL (PINNED)
      const sections = gsap.utils.toArray(".philosophy-item");
      const track = document.querySelector(".philosophy-track");

      if (track && sections.length > 0) {
          gsap.to(sections, {
              xPercent: -100 * (sections.length - 1),
              ease: "none",
              scrollTrigger: {
                  trigger: ".philosophy-wrapper",
                  pin: true,
                  scrub: 1,
                  snap: 1 / (sections.length - 1),
                  end: "+=3000", // Adjust scroll length
              }
          });
      }

      // 3. PERSONA: SHATTER REVEAL
      ScrollTrigger.create({
        trigger: ".persona-section",
        start: "top 60%",
        onEnter: () => setStatsVisible(true),
      });

      gsap.fromTo(".persona-title",
        { y: 100, opacity: 0, skewY: 10 },
        {
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
                trigger: ".persona-section",
                start: "top 70%"
            }
        }
      );

      // Persona image reveal
      gsap.fromTo(".persona-img-container",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".persona-section", start: "top 70%" }
        }
      );


      // 4. PERSONA TEXT: STAGGERED FADE UP (REMOVED)
      /*
      gsap.fromTo(".persona-text-p",
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".persona-section",
                start: "top 60%"
            }
        }
      );
      */

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Glitch Effect Function
  const triggerGlitch = (e: React.MouseEvent<HTMLElement>) => {
      const target = e.target as HTMLElement;
      const originalText = target.dataset.text || target.innerText;
      target.dataset.text = originalText;

      const existing = glitchIntervals.current.get(target);
      if (existing) {
          clearInterval(existing);
          target.innerText = originalText;
      }

      const chars = "!<>-_\/[]{}—=+*^?#________";

      let iterations = 0;
      const interval = setInterval(() => {
        target.innerText = originalText
          .split("")
          .map((letter: string, index: number) => {
            if (index < iterations) return originalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");

        if (iterations >= originalText.length) {
            clearInterval(interval);
            glitchIntervals.current.delete(target);
            target.innerText = originalText;
        }
        iterations += 1 / 2;
      }, 30);

      glitchIntervals.current.set(target, interval);
  };

  return (
    <section ref={containerRef} className={s.section}>

      {/* Background Wrapper - Handles Overflow for Blobs */}
      <div className={s.bgWrapper}>
          <GrainOverlay />
          <div className={s.blob1} />
          <div className={s.blob2} />
      </div>

      {/* --- PART 1: THE MANIFESTO --- */}
      <div className={s.manifesto} style={{ perspective: "1000px" }}>
        <div className={s.manifestoInner}>
            <h2 className={s.sectionLabel}>
                {'//'} The Manifesto
            </h2>

            {/* Line 1 */}
            <div className={s.lineContainer}>
                {"BUILDING".split(" ").map((word, i) => (
                    <span
                        key={i}
                        className={`${s.heroWord} hero-word`}
                        onMouseEnter={triggerGlitch}
                    >
                        {word}
                    </span>
                ))}
            </div>

            {/* Line 2 */}
            <div className={s.lineContainer}>
                {"DIGITAL".split(" ").map((word, i) => (
                    <span
                        key={i}
                        className={`${s.heroWord} hero-word`}
                        onMouseEnter={triggerGlitch}
                    >
                        {word}
                    </span>
                ))}
            </div>

            {/* Line 3 (Hollow) */}
            <div className={s.lineContainerSpaced}>
                {"LEGACIES".split(" ").map((word, i) => (
                    <span
                        key={i}
                        className={`${s.heroWordAccent} hero-word`}
                        onMouseEnter={triggerGlitch}
                    >
                        {word}
                    </span>
                ))}
            </div>

             {/* Line 4 */}
             <div className={s.lineContainer}>
                {"THAT LAST".split(" ").map((word, i) => (
                    <span
                        key={i}
                        className={`${s.heroWordMuted} hero-word`}
                        onMouseEnter={triggerGlitch}
                    >
                        {word}
                    </span>
                ))}
            </div>
        </div>

        <div className={s.descriptionBlock}>
            <p className={s.descriptionText}>
                I am a passionate developer driven by a single goal: to create applications and websites that are <span className={s.remembered}>remembered</span>.
                It's not just about code; it's about crafting experiences that leave a lasting mark.
            </p>
        </div>
      </div>

      {/* --- PART 2: THE PHILOSOPHY (Horizontal Scroll) --- */}
      <div className={`${s.philosophyWrapper} philosophy-wrapper`}>
        <div className={`${s.philosophyTrack} philosophy-track`}>

            {/* Item 1 */}
            <div className={`${s.philosophyItem} philosophy-item`}>
                <div className={s.philosophyTextBlock}>
                    <h2 className={s.philosophyHeading}>OBSESSION</h2>
                    <span className={s.philosophyLabel}>01 Focus</span>
                </div>
                <div className={s.philosophyImgWrap}>
                    <Image
                        src="/image.png"
                        alt="Focus"
                        fill
                        sizes="(max-width: 768px) 70vw, 30vw"
                        loading="lazy"
                        className={s.philosophyImg}
                    />
                </div>
            </div>

            {/* Item 2 */}
            <div className={`${s.philosophyItem} philosophy-item`}>
                <div className={s.philosophyTextBlock}>
                    <h2 className={s.philosophyHeadingAccent}>PRECISION</h2>
                    <span className={s.philosophyLabel}>02 Code</span>
                </div>
                <div className={s.philosophyImgWrapWide}>
                    <Image
                        src="/precission.jpg"
                        alt="Precision"
                        fill
                        sizes="(max-width: 768px) 80vw, 40vw"
                        loading="lazy"
                        className={s.philosophyImg}
                    />
                </div>
            </div>

            {/* Item 3 */}
            <div className={`${s.philosophyItem} philosophy-item`}>
                <div className={s.philosophyTextBlock}>
                    <h2 className={s.philosophyHeading}>IMPACT</h2>
                    <span className={s.philosophyLabel}>03 Result</span>
                </div>
                <div className={`${s.philosophyImgWrap} impact-img-container`}>
                    <Image
                        src="/impact.png"
                        alt="Impact"
                        fill
                        sizes="(max-width: 768px) 70vw, 30vw"
                        loading="lazy"
                        className={`${s.philosophyImg} impact-img`}
                    />
                </div>
            </div>

        </div>
      </div>

      {/* --- PART 3: THE PERSONA --- */}
      <div className={`${s.persona} persona-section`}>

        {/* Image */}
        <div className={s.personaImageSide}>
            <div className={`${s.personaImgContainer} persona-img-container`}>
                <Image
                    src="/Niko.png"
                    alt="Portrait"
                    fill
                    className={`${s.personaImg} persona-img`}
                />
                {/* Red duotone overlay — fades on hover */}
                <div className={s.redOverlay} />
                {/* Grain */}
                <div className={s.grainInside}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
                />
                {/* Bottom gradient */}
                <div className={s.bottomGradient} />
            </div>
            {/* Decorative circle */}
            <div className={s.decorativeCircle}>
                <div className={s.dot} />
            </div>
        </div>

        {/* Content & Stats */}
        <div className={s.personaContent}>
            <div>
                <h3 className={`${s.personaTitle} persona-title`}>
                    The <br/> <span className={s.goldText}>Developer</span>
                </h3>
                <div className={s.bodyTextWrap}>
                    <p className="persona-text-p">
                        I am a passionate student and developer based in The Netherlands, driven by a curiosity to build things that matter.
                    </p>
                    <p className="persona-text-p">
                        For me, development is more than just writing code. It's about crafting experiences. I love the challenge of turning complex problems into simple, beautiful solutions.
                    </p>
                    <p className="persona-text-p">
                        Whether it's a sleek website or a robust application, I bring energy and precision to every project. I'm always learning, always evolving, and always looking for the next big challenge.
                    </p>
                </div>
            </div>

            <div className={s.statsGrid}>

                {/* ROW 1: STATS */}
                <div className={s.statsRow}>
                    <div className={s.statGroup}>
                        <h4 className={s.statHeader}>
                            [ Coordinates ]
                        </h4>
                        <p className={s.statValue}>
                            <ScrambleText text="The Netherlands" trigger={statsVisible} />
                        </p>
                    </div>
                    <div className={s.statGroup}>
                        <h4 className={s.statHeader}>
                            [ Directive ]
                        </h4>
                        <p className={s.statValue}>
                            <ScrambleText text="Make an Impact" trigger={statsVisible} />
                        </p>
                    </div>
                </div>

                {/* ROW 2 */}
                <div className={s.statsRowBordered}>
                    <div className={s.statGroup}>
                        <h4 className={s.statHeader}>
                            [ Focus ]
                        </h4>
                        <p className={s.statValue}>
                            <ScrambleText text="Web & Motion" trigger={statsVisible} />
                        </p>
                    </div>
                    <div className={s.statGroup}>
                        <h4 className={s.statHeader}>
                            [ Status ]
                        </h4>
                        <div className={s.statusRow}>
                            <span className={s.statusDot} />
                            <p className={s.statValue}>
                                <ScrambleText text="Available" trigger={statsVisible} />
                            </p>
                        </div>
                    </div>
                </div>

                {/* ROW 3 — services */}
                <div className={s.servicesBlock}>
                    <h4 className={s.servicesHeader}>
                        [ What I Do ]
                    </h4>
                    <div className={s.servicesGrid}>
                        {[
                            { label: "Frontend Dev", num: "01" },
                            { label: "UI / UX Design", num: "02" },
                            { label: "Motion & Animation", num: "03" },
                            { label: "Mobile Apps", num: "04" },
                        ].map((service) => (
                            <div key={service.num} className={s.serviceItem}>
                                <span className={s.serviceNum}>{service.num}</span>
                                <span className={s.serviceLabel}>{service.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- PART 4: THE ARSENAL (SKILLS) --- */}
      <SkillsList />



    </section>
  );
}
