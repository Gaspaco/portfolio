"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import Magnetic from "../ui/Magnetic";
import Menu from "../layout/Menu";
import s from "./Navbar.module.scss";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    if (!navRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".nav-enter",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)", delay: 0.5 }
      );
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <motion.nav
        ref={navRef}
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 },
        }}
        animate={isMenuOpen ? "visible" : hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={s.nav}
      >
        <div className={s.inner}>

          {/* Logo */}
          <div className={`${s.logoWrap} nav-enter`} style={{ opacity: 0 }}>
            <Magnetic>
              <Link href="/" className={s.logoLink}>
                <span
                  className={s.logoText}
                  style={{
                    fontFamily: "var(--font-caveat), cursive",
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    lineHeight: 1,
                    color: isMenuOpen ? "#111" : "#111",
                  }}
                >
                  Niko Dima
                </span>
                <span
                  className={s.logoTextClone}
                  style={{
                    fontFamily: "var(--font-caveat), cursive",
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    lineHeight: 1,
                    color: "#111",
                  }}
                >
                  Niko Dima
                </span>
              </Link>
            </Magnetic>
          </div>

          {/* Menu trigger */}
          <div className={`${s.menuTriggerWrap} nav-enter`} style={{ opacity: 0 }}>
            <Magnetic>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={s.menuButton}
              >
                <span className={s.menuLabel}>
                  <span
                    className={s.menuLabelText}
                    style={{
                      fontFamily: "var(--font-instrument-serif), Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "1rem",
                      fontWeight: 400,
                      lineHeight: 1.2,
                    }}
                  >
                    {isMenuOpen ? "close" : "menu"}
                  </span>
                  <span
                    className={s.menuLabelClone}
                    style={{
                      fontFamily: "var(--font-instrument-serif), Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "1rem",
                      fontWeight: 400,
                      lineHeight: 1.2,
                    }}
                  >
                    {isMenuOpen ? "close" : "menu"}
                  </span>
                </span>

                {/* Circle icon */}
                <span className={s.circle}>
                  {/* Hamburger / X morphing */}
                  <span className={s.hamburgerWrap}>
                    <span
                      className={s.hamburgerLine}
                      style={{
                        transform: isMenuOpen ? "rotate(45deg)" : "translateY(-3px)",
                      }}
                    />
                    <span
                      className={s.hamburgerLine}
                      style={{
                        transform: isMenuOpen ? "rotate(-45deg)" : "translateY(3px)",
                      }}
                    />
                  </span>
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </motion.nav>

      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
