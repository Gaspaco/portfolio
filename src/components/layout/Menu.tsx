"use client";

import { useEffect, useRef, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import gsap from "gsap";
import s from "./Menu.module.scss";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "works", href: "/archive" },
  { label: "project", href: "/#projects" },
  { label: "about", href: "/#about" },
  { label: "contact", href: "mailto:nikodima2007@gmail.com" },
];

const MENU_DURATION_MS = 1350;
const iconStyle = { width: 18, height: 18 };

const socials = [
  {
    label: "Ig",
    href: "https://www.instagram.com/nik0d_/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Li",
    href: "https://www.linkedin.com/in/niko-dima-64246b33a/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" style={iconStyle}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 11-.001-4.128 2.064 2.064 0 010 4.128zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

function getPanelClipOrigin(panelMarginPx: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const panelWidth = Math.min(36 * 16, vw - panelMarginPx * 2);
  const panelHeight = vh - panelMarginPx * 2;
  const panelLeft = vw - panelMarginPx - panelWidth;
  const panelTop = panelMarginPx;

  const trigger = document.querySelector(".menu-trigger-btn");
  let originX = panelWidth * 0.92;
  let originY = panelHeight * 0.06;

  if (trigger) {
    const r = trigger.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    originX = cx - panelLeft;
    originY = cy - panelTop;
  }

  const corners = [
    [0, 0],
    [panelWidth, 0],
    [0, panelHeight],
    [panelWidth, panelHeight],
  ];
  const radius = Math.max(
    ...corners.map(([x, y]) => Math.hypot(x - originX, y - originY))
  );

  return { originX, originY, radius };
}

function MenuContent({ isOpen, onClose }: MenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const closeButton = panel.querySelector(".menu-close");
    const linkText = panel.querySelectorAll(".menu-link-text");
    const bottomItems = panel.querySelectorAll(".menu-bottom");

    const { originX, originY } = getPanelClipOrigin(8);
    gsap.set(panel, {
      clipPath: `circle(0px at ${originX}px ${originY}px)`,
    });
    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(closeButton, { y: -10, opacity: 0 });
    gsap.set(linkText, { y: "118%", skewY: 7, opacity: 0 });
    gsap.set(bottomItems, { y: 18, opacity: 0 });

    tl.current = gsap.timeline({ paused: true });

    tl.current
      .to(overlayRef.current, {
        opacity: 0.58,
        duration: 0.6,
        ease: "power2.out",
      })
      .to(
        panel,
        {
          clipPath: () => {
            const { originX, originY, radius } = getPanelClipOrigin(8);
            return `circle(${radius}px at ${originX}px ${originY}px)`;
          },
          duration: 1.15,
          ease: "power3.inOut",
        },
        0
      )
      .to(
        closeButton,
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        0.32
      )
      .to(
        linkText,
        {
          y: "0%",
          skewY: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.1,
          ease: "expo.out",
        },
        0.45
      )
      .to(
        bottomItems,
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power3.out" },
        0.75
      );

    return () => { tl.current?.kill(); };
  }, []);

  useEffect(() => {
    const grain = document.querySelector(".grain-overlay") as HTMLElement | null;
    if (isOpen) {
      if (grain) grain.style.display = "none";
      document.body.style.overflow = "hidden";
    } else {
      if (grain) grain.style.display = "";
      document.body.style.overflow = "";
    }

    if (tl.current && isOpen) {
      tl.current.invalidate();
    }

    if (tl.current) {
      if (isOpen) tl.current.play();
      else tl.current.reverse();
    }

    return () => {
      if (grain) grain.style.display = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className={s.overlayWrap}>
      {/* Backdrop */}
      <div ref={overlayRef} onClick={onClose} className={s.backdrop} data-sound="close" />

      {/* Panel */}
      <div ref={panelRef} className={s.panel}>
        {/* Close button */}
        <div className={s.closeRow}>
          <button className={`menu-close ${s.closeButton}`} onClick={onClose} data-sound="close">
            <span className={s.closeLabel}>close</span>
            <span className={s.closeCircle}>
              <span className={s.closeCross} />
              <span className={s.closeCross} />
            </span>
          </button>
        </div>

        {/* Links */}
        <div className={s.linksWrap}>
          {menuItems.map((item) => (
            <div key={item.label} className={s.linkRow}>
              <Link
                href={item.href}
                onClick={onClose}
                className={s.linkAnchor}
                data-sound={
                  item.label === "works"
                    ? "homelink"
                    : item.label === "about"
                      ? "aboutlink"
                      : item.label === "project"
                        ? "longclick"
                        : "click"
                }
              >
                <span className={s.linkDot} />
                <span className={`menu-link-text ${s.linkText}`}>{item.label}</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className={s.bottomRow}>
          <a href="mailto:nikodima2007@gmail.com" className={`menu-bottom ${s.emailLink}`} data-sound="click">
            nikodima2007@gmail.com
          </a>

          <div className={s.socialsWrap}>
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`menu-bottom ${s.socialLink}`}
                data-sound="tick"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Menu({ isOpen, onClose }: MenuProps) {
  const [mounted, setMounted] = useState(false);
  const [renderMenu, setRenderMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) setRenderMenu(true);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && renderMenu) {
      const timer = window.setTimeout(() => setRenderMenu(false), MENU_DURATION_MS);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, renderMenu]);

  if (!mounted || !renderMenu) return null;

  return createPortal(
    <MenuContent isOpen={isOpen} onClose={onClose} />,
    document.body
  );
}
