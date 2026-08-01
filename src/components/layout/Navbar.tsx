"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import Magnetic from "../ui/Magnetic";
import Menu from "../layout/Menu";
import s from "./Navbar.module.scss";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setIsMuted(window.localStorage.getItem("sound-muted") === "1");

    const handleMutedChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ muted: boolean }>;
      setIsMuted(customEvent.detail.muted);
    };

    window.addEventListener("sound-muted-change", handleMutedChange);
    return () => window.removeEventListener("sound-muted-change", handleMutedChange);
  }, []);

  const toggleSound = () => {
    window.dispatchEvent(new CustomEvent("sound-toggle"));
  };

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

  const skipFirstRef = useRef(true);

  useEffect(() => {
    if (!line1Ref.current || !line2Ref.current) return;
    gsap.set(line1Ref.current, { y: -3, rotate: 0 });
    gsap.set(line2Ref.current, { y: 3, rotate: 0 });
  }, []);

  useEffect(() => {
    if (skipFirstRef.current) {
      skipFirstRef.current = false;
      return;
    }

    const circle = circleRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    if (!circle || !line1 || !line2) return;

    const tl = gsap.timeline();

    tl.to(circle, {
      rotate: isMenuOpen ? 135 : 0,
      scale: 1.14,
      duration: 0.4,
      ease: "back.out(2)",
    })
      .to(circle, { scale: 1, duration: 0.25, ease: "power2.out" }, "-=0.15")
      .to(
        line1,
        {
          y: isMenuOpen ? 0 : -3,
          rotate: isMenuOpen ? 45 : 0,
          duration: 0.45,
          ease: "power3.inOut",
        },
        0
      )
      .to(
        line2,
        {
          y: isMenuOpen ? 0 : 3,
          rotate: isMenuOpen ? -45 : 0,
          duration: 0.45,
          ease: "power3.inOut",
        },
        0
      );

    if (rippleRef.current) {
      gsap.fromTo(
        rippleRef.current,
        { scale: 0.4, opacity: 0.45 },
        { scale: 1.9, opacity: 0, duration: 0.55, ease: "power2.out" }
      );
    }

    return () => { tl.kill(); };
  }, [isMenuOpen]);

  return (
    <>
      <motion.nav
        ref={navRef}
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 },
        }}
        animate="visible"
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
                    color: "#111",
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
            <div className={s.controlDock} data-open={isMenuOpen}>
              <Magnetic>
                <button
                  type="button"
                  className={s.soundButton}
                  onClick={toggleSound}
                  aria-pressed={!isMuted}
                  aria-label={isMuted ? "Turn sound on" : "Mute sound"}
                  data-sound={isMuted ? "switch" : "close"}
                >
                  <span className={s.soundBars} aria-hidden="true">
                    <span className={isMuted ? s.barMuted : undefined} />
                    <span className={isMuted ? s.barMuted : undefined} />
                    <span className={isMuted ? s.barMuted : undefined} />
                  </span>
                  <span className={s.soundText}>{isMuted ? "off" : "on"}</span>
                </button>
              </Magnetic>

              <Magnetic>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`${s.menuButton} menu-trigger-btn`}
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMenuOpen}
                  data-sound={isMenuOpen ? "close" : "switch"}
                >
                  <span className={s.menuLabel}>
                    <span className={s.menuLabelText}>
                      {isMenuOpen ? "close" : "menu"}
                    </span>
                    <span className={s.menuLabelClone}>
                      {isMenuOpen ? "close" : "menu"}
                    </span>
                  </span>

                  <span className={s.circle} ref={circleRef}>
                    <span className={s.ripple} ref={rippleRef} />
                    <span className={s.hamburgerWrap}>
                      <span className={s.hamburgerLine} ref={line1Ref} />
                      <span className={s.hamburgerLine} ref={line2Ref} />
                    </span>
                  </span>
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </motion.nav>

      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
