"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrambleText from "../ui/ScrambleText";
import { siReact, siTypescript, siThreedotjs, siNodedotjs, siFigma, siGreensock } from "simple-icons";
import s from './SkillsList.module.scss';

const SKILLS = [
  { name: "React / Next.js", category: "Frontend", icon: siReact,      bg: "#20232a" },
  { name: "TypeScript",      category: "Language",  icon: siTypescript, bg: "#3178c6" },
  { name: "WebGL / Three.js",category: "Creative",  icon: siThreedotjs, bg: "#1a1a1a" },
  { name: "Node.js / Backend",category: "Server",   icon: siNodedotjs,  bg: "#1a1a1a" },
  { name: "UI / UX Design",  category: "Design",    icon: siFigma,      bg: "#1e1e1e" },
  { name: "Motion / GSAP",   category: "Animation", icon: siGreensock,  bg: "#0ae448" },
];

export default function SkillsList() {
  const [activeSkill, setActiveSkill] = useState<number | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Entrance Animation
    const ctx = gsap.context(() => {

        // Trigger Header Scramble
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 80%",
            onEnter: () => setHeaderVisible(true)
        });

        // Header title masked reveal
        gsap.fromTo(".skills-title-word",
          { y: "110%" },
          { y: "0%", duration: 1, ease: "power4.out",
            scrollTrigger: { trigger: containerRef.current, start: "top 80%" }
          }
        );

        // Header border draws in
        gsap.fromTo(".skills-header-line",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power4.inOut", transformOrigin: "left",
            scrollTrigger: { trigger: containerRef.current, start: "top 80%" }
          }
        );

        // Row borders draw in per element
        gsap.utils.toArray<HTMLElement>(".skill-border").forEach((el) => {
          gsap.fromTo(el,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: "power4.inOut", transformOrigin: "left",
              scrollTrigger: { trigger: el, start: "top 92%" }
            }
          );
        });

        // Skill names: masked slide up
        gsap.utils.toArray<HTMLElement>(".skill-name").forEach((el) => {
          gsap.fromTo(el,
            { y: "100%" },
            { y: "0%", duration: 0.9, ease: "power4.out",
              scrollTrigger: { trigger: el, start: "top 94%" }
            }
          );
        });

        // Category labels: fade in from right
        gsap.utils.toArray<HTMLElement>(".skill-cat").forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, x: 15 },
            { opacity: 1, x: 0, duration: 0.6, ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 92%" }
            }
          );
        });
    }, containerRef);

    return () => {
        ctx.revert();
    };
  }, []);

  // Text Glitch Effect
  const triggerGlitch = (e: React.MouseEvent<HTMLElement>) => {
      const target = e.currentTarget.querySelector("h3");
      if (!target) return;

      const originalText = target.dataset.text || target.innerText;
      if (!target.dataset.text) target.dataset.text = originalText;

      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";

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
            target.innerText = originalText;
        }
        iterations += 1 / 2;
      }, 30);
  };

  return (
    <section ref={containerRef} className={s.section}>
      <div className={s.content}>
        <div className={s.headerWrap}>
          <span className={s.headerLabel}>
            <ScrambleText text="[ Technical Arsenal ]" trigger={headerVisible} className="inline-block" />
          </span>
          <div className={s.titleMask}>
            <h2 className={`${s.title} skills-title-word`}>
              Skills
            </h2>
          </div>
          <div className={`${s.headerLine} skills-header-line`} />
        </div>

        <div className={s.list}>
            {SKILLS.map((skill, i) => (
                <div key={i}>
                    <div className={`${s.border} skill-border`} />
                    <div
                        className={`${s.skillItem} skill-item`}
                        onMouseEnter={(e) => {
                            setActiveSkill(i);
                            triggerGlitch(e);
                        }}
                        onMouseLeave={() => setActiveSkill(null)}
                        onClick={() => setActiveSkill(activeSkill === i ? null : i)}
                    >
                        <div className={s.nameMask}>
                          <h3 className={`${s.skillName} ${activeSkill === i ? s.skillNameActive : ''} skill-name`}>
                              {skill.name}
                          </h3>
                        </div>
                        <span className={`${s.skillCat} ${activeSkill === i ? s.skillCatActive : ''} skill-cat`}>
                            {skill.category}
                        </span>
                    </div>
                </div>
            ))}
            <div className={`${s.border} skill-border`} />
        </div>
      </div>
    </section>
  );
}
