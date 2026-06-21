"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./CraftBuild.module.scss";

gsap.registerPlugin(ScrollTrigger);


const MOUTHS: Record<string, string> = {
  smile: "M 33 64 Q 50 70 67 64",
  surprised: "M 43 60 A 7 8 0 1 0 57 60 A 7 8 0 1 0 43 60",
  grin: "M 27 63 Q 50 72 73 63",
  smirk: "M 38 64 Q 54 69 72 62",
  flat: "M 34 64 Q 50 66 66 64",
  frown: "M 33 66 Q 50 62 67 66",
  bored: "M 36 65 Q 50 63 64 65",
};

const GESTURES = [
  { e1: { rx: 9, ry: 9 }, e2: { rx: 9, ry: 9 }, mouth: "smile" },
  { e1: { rx: 9.5, ry: 4 }, e2: { rx: 9, ry: 9 }, mouth: "smirk" },
  { e1: { rx: 9.5, ry: 5 }, e2: { rx: 9.5, ry: 5 }, mouth: "grin" },
  { e1: { rx: 7.5, ry: 7.5 }, e2: { rx: 7.5, ry: 7.5 }, mouth: "flat" },
  { e1: { rx: 8, ry: 6 }, e2: { rx: 8, ry: 6 }, mouth: "frown" },
];

const IDLE_MOODS = [
  { e1: { rx: 9, ry: 9 }, e2: { rx: 9, ry: 9 }, mouth: "smile" },
  { e1: { rx: 9, ry: 5 }, e2: { rx: 9, ry: 5 }, mouth: "bored" },
  { e1: { rx: 9, ry: 9 }, e2: { rx: 9, ry: 9 }, mouth: "flat" },
  { e1: { rx: 9.5, ry: 5 }, e2: { rx: 9.5, ry: 5 }, mouth: "grin" },
  { e1: { rx: 8.5, ry: 8.5 }, e2: { rx: 8.5, ry: 8.5 }, mouth: "smirk" },
  { e1: { rx: 8, ry: 7 }, e2: { rx: 8, ry: 7 }, mouth: "bored" },
];

const MOUTH_SOUNDS: Record<string, "click" | "tick" | "switch" | "longclick" | "close"> = {
  smile: "switch",
  surprised: "click",
  grin: "longclick",
  smirk: "switch",
  flat: "tick",
  frown: "close",
  bored: "tick",
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function CraftBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const orbInnerRef = useRef<HTMLDivElement>(null);
  const eye1Ref = useRef<SVGGElement>(null);
  const eye2Ref = useRef<SVGGElement>(null);
  const saccade1Ref = useRef<SVGGElement>(null);
  const saccade2Ref = useRef<SVGGElement>(null);
  const eye1ShapeRef = useRef<SVGEllipseElement>(null);
  const eye2ShapeRef = useRef<SVGEllipseElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  const leftArmRef = useRef<SVGGElement>(null);
  const rightArmRef = useRef<SVGGElement>(null);
  const leftLegRef = useRef<SVGGElement>(null);
  const rightLegRef = useRef<SVGGElement>(null);
  const leftArmPathRef = useRef<SVGPathElement>(null);
  const rightArmPathRef = useRef<SVGPathElement>(null);
  const leftLegPathRef = useRef<SVGPathElement>(null);
  const rightLegPathRef = useRef<SVGPathElement>(null);
  const leftHandRef = useRef<SVGCircleElement>(null);
  const rightHandRef = useRef<SVGCircleElement>(null);
  const leftFootRef = useRef<SVGCircleElement>(null);
  const rightFootRef = useRef<SVGCircleElement>(null);
  const blinkTimer = useRef<gsap.core.Tween | null>(null);
  const blinkTl = useRef<gsap.core.Timeline | null>(null);
  const glanceTimer = useRef<gsap.core.Tween | null>(null);
  const saccadeTimer = useRef<gsap.core.Tween | null>(null);
  const moodTimer = useRef<gsap.core.Tween | null>(null);
  const handTimer = useRef<gsap.core.Tween | null>(null);
  const handTl = useRef<gsap.core.Timeline | null>(null);
  const carryTimer = useRef<gsap.core.Tween | null>(null);
  const carryTl = useRef<gsap.core.Timeline | null>(null);
  const walkTimer = useRef<gsap.core.Tween | null>(null);
  const returnHomeTimer = useRef<gsap.core.Tween | null>(null);
  const introPlayed = useRef(false);
  const introPlaying = useRef(false);
  const copyOnRight = useRef(false);
  const gestureIdx = useRef(0);
  const targetRy = useRef({ e1: 9, e2: 9 });
  const hovering = useRef(false);
  const nearFace = useRef(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const orbFloatRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const dragPos = useRef({ x: 0, y: 0 });
  const dragVel = useRef({ x: 0, y: 0 });
  const dragPrev = useRef({ x: 0, y: 0, t: 0 });
  const dragGrab = useRef<"body" | "leftArm" | "rightArm" | "leftLeg" | "rightLeg">("body");
  const dragSettleTimer = useRef<gsap.core.Tween | null>(null);
  const didDrag = useRef(false);
  const lastWallHitAt = useRef(0);
  const wallRelaxTimer = useRef<gsap.core.Tween | null>(null);
  const lastMouthSoundAt = useRef(0);
  const playBlobSound = useCallback((sound: "click" | "tick" | "switch" | "longclick" | "close") => {
    window.dispatchEvent(new CustomEvent("sound-play", { detail: { sound } }));
  }, []);

  const playMouthSound = useCallback((mouthKey: string) => {
    const now = performance.now();
    if (now - lastMouthSoundAt.current < 180) return;
    lastMouthSoundAt.current = now;
    playBlobSound(MOUTH_SOUNDS[mouthKey] || "tick");
  }, [playBlobSound]);

  const animateLimbPull = useCallback((vx: number, vy: number, strength = 1, dx = 0, dy = 0) => {
    const pullX = clamp(vx * 0.44 + dx * 0.035, -13, 13);
    const pullY = clamp(vy * 0.38 + dy * 0.03, -11, 11);
    const lean = clamp(vx * 0.44 + dx * 0.018, -7.5, 7.5);
    const lift = clamp(vy * 0.3 + dy * 0.018, -6.5, 6.5);
    const waveX = clamp(vx * 0.46 + dx * 0.032, -12, 12);
    const waveY = clamp(vy * 0.34 + dy * 0.024, -9, 9);
    const grabbed = dragGrab.current;
    const leftHand = { x: -18 - waveX * 0.78, y: 70 - waveY * 0.58 };
    const rightHand = { x: 118 - waveX * 0.78, y: 70 - waveY * 0.58 };
    const leftFoot = { x: 22 - waveX * 0.46, y: 132 - waveY * 0.52 };
    const rightFoot = { x: 78 - waveX * 0.46, y: 132 - waveY * 0.52 };

    gsap.to(orbInnerRef.current, {
      scaleX: 1 + Math.min(Math.abs(pullX) * 0.0024, 0.022),
      scaleY: 1 - Math.min(Math.abs(pullY) * 0.0024, 0.019),
      duration: 0.28,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(leftArmRef.current, {
      x: grabbed === "leftArm" ? pullX * 0.9 : -pullX * 0.18,
      y: grabbed === "leftArm" ? pullY * 0.68 : lift * 0.18,
      rotation: grabbed === "leftArm" ? lean - 5 * strength : -lean * 0.28,
      transformOrigin: "4px 60px",
      duration: 0.26,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(leftArmPathRef.current, {
      attr: { d: `M 2 60 Q ${-10 - waveX * 0.95} ${68 - waveY * 0.72} ${leftHand.x} ${leftHand.y}` },
      duration: 0.22,
      ease: "sine.out",
      overwrite: "auto",
    });
    gsap.to(leftHandRef.current, {
      attr: { cx: leftHand.x, cy: leftHand.y },
      duration: 0.22,
      ease: "sine.out",
      overwrite: "auto",
    });

    gsap.to(rightArmRef.current, {
      x: grabbed === "rightArm" ? pullX * 0.9 : -pullX * 0.18,
      y: grabbed === "rightArm" ? pullY * 0.68 : lift * 0.18,
      rotation: grabbed === "rightArm" ? lean + 5 * strength : -lean * 0.28,
      transformOrigin: "96px 60px",
      duration: 0.26,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(rightArmPathRef.current, {
      attr: { d: `M 98 60 Q ${110 - waveX * 0.95} ${68 - waveY * 0.72} ${rightHand.x} ${rightHand.y}` },
      duration: 0.22,
      ease: "sine.out",
      overwrite: "auto",
    });
    gsap.to(rightHandRef.current, {
      attr: { cx: rightHand.x, cy: rightHand.y },
      duration: 0.22,
      ease: "sine.out",
      overwrite: "auto",
    });

    gsap.to(leftLegRef.current, {
      x: grabbed === "leftLeg" ? pullX * 0.48 : -pullX * 0.22,
      y: grabbed === "leftLeg" ? pullY * 0.5 : clamp(pullY, -7, 7) * 0.2,
      rotation: grabbed === "leftLeg" ? lean * 0.55 - 3 : -lean * 0.18,
      transformOrigin: "36px 98px",
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(leftLegPathRef.current, {
      attr: { d: `M 36 98 Q ${28 - waveX * 0.62} ${118 - waveY * 0.66} ${leftFoot.x} ${leftFoot.y}` },
      duration: 0.25,
      ease: "sine.out",
      overwrite: "auto",
    });
    gsap.to(leftFootRef.current, {
      attr: { cx: leftFoot.x, cy: leftFoot.y },
      duration: 0.25,
      ease: "sine.out",
      overwrite: "auto",
    });

    gsap.to(rightLegRef.current, {
      x: grabbed === "rightLeg" ? pullX * 0.48 : -pullX * 0.22,
      y: grabbed === "rightLeg" ? pullY * 0.5 : clamp(pullY, -7, 7) * 0.2,
      rotation: grabbed === "rightLeg" ? lean * 0.55 + 3 : -lean * 0.18,
      transformOrigin: "64px 98px",
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(rightLegPathRef.current, {
      attr: { d: `M 64 98 Q ${72 - waveX * 0.62} ${118 - waveY * 0.66} ${rightFoot.x} ${rightFoot.y}` },
      duration: 0.25,
      ease: "sine.out",
      overwrite: "auto",
    });
    gsap.to(rightFootRef.current, {
      attr: { cx: rightFoot.x, cy: rightFoot.y },
      duration: 0.25,
      ease: "sine.out",
      overwrite: "auto",
    });
  }, []);

  const releaseLimbPull = useCallback(() => {
    gsap.to([leftArmRef.current, rightArmRef.current, leftLegRef.current, rightLegRef.current], {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 0.58,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(leftArmPathRef.current, {
      attr: { d: "M 2 60 Q -10 68 -18 70" },
      duration: 0.58,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(leftHandRef.current, {
      attr: { cx: -18, cy: 70 },
      duration: 0.58,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(rightArmPathRef.current, {
      attr: { d: "M 98 60 Q 110 68 118 70" },
      duration: 0.58,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(rightHandRef.current, {
      attr: { cx: 118, cy: 70 },
      duration: 0.58,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(leftLegPathRef.current, {
      attr: { d: "M 36 98 Q 28 118 22 132" },
      duration: 0.58,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(leftFootRef.current, {
      attr: { cx: 22, cy: 132 },
      duration: 0.58,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(rightLegPathRef.current, {
      attr: { d: "M 64 98 Q 72 118 78 132" },
      duration: 0.58,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(rightFootRef.current, {
      attr: { cx: 78, cy: 132 },
      duration: 0.58,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(orbInnerRef.current, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, []);

  const scheduleHandFidget = useCallback(() => {
    handTimer.current = gsap.delayedCall(2.2 + Math.random() * 4.5, () => {
      if (dragging.current || introPlaying.current) {
        scheduleHandFidget();
        return;
      }

      const leftArm = leftArmRef.current;
      const rightArm = rightArmRef.current;
      if (!leftArm || !rightArm) return;

      const useLeft = Math.random() > 0.5;
      const activeArm = useLeft ? leftArm : rightArm;
      const passiveArm = useLeft ? rightArm : leftArm;
      const origin = useLeft ? "4px 60px" : "96px 60px";
      const direction = useLeft ? -1 : 1;
      const isHello = Math.random() > 0.64;

      handTl.current = gsap.timeline({ onComplete: () => scheduleHandFidget() });
      const tl = handTl.current;

      if (isHello) {
        const activePath = useLeft ? leftArmPathRef.current : rightArmPathRef.current;
        const activeHand = useLeft ? leftHandRef.current : rightHandRef.current;
        const raisedPath = useLeft
          ? "M 2 60 Q -7 42 -14 34"
          : "M 98 60 Q 107 42 114 34";
        const raisedHand = useLeft ? { cx: -14, cy: 34 } : { cx: 114, cy: 34 };
        const wavePath = useLeft
          ? "M 2 60 Q -10 42 -19 34"
          : "M 98 60 Q 110 42 119 34";
        const waveHand = useLeft ? { cx: -19, cy: 34 } : { cx: 119, cy: 34 };
        const neutralPath = useLeft
          ? "M 2 60 Q -10 68 -18 70"
          : "M 98 60 Q 110 68 118 70";
        const neutralHand = useLeft ? { cx: -18, cy: 70 } : { cx: 118, cy: 70 };

        playBlobSound("switch");
        tl.to(activePath, {
          attr: { d: raisedPath },
          duration: 0.38,
          ease: "power3.out",
        }, 0);
        tl.to(activeHand, {
          attr: raisedHand,
          x: 0,
          duration: 0.38,
          ease: "power3.out",
        }, 0);
        tl.to(activePath, {
          attr: { d: wavePath },
          duration: 0.18,
          ease: "sine.inOut",
          repeat: 5,
          yoyo: true,
        });
        tl.to(activeHand, {
          attr: waveHand,
          x: 0,
          duration: 0.18,
          ease: "sine.inOut",
          repeat: 5,
          yoyo: true,
        }, "<");
        tl.to(activePath, {
          attr: { d: neutralPath },
          duration: 0.42,
          ease: "power3.out",
        });
        tl.to(activeHand, {
          attr: neutralHand,
          x: 0,
          duration: 0.42,
          ease: "power3.out",
        }, "<");
      } else {
        tl.to(activeArm, {
          x: direction * 1.8,
          y: 1.8,
          rotation: direction * 2.5,
          transformOrigin: origin,
          duration: 0.22,
          ease: "power2.out",
        });
        tl.to(passiveArm, {
          x: -direction * 0.8,
          y: 0.7,
          rotation: -direction * 1,
          transformOrigin: useLeft ? "96px 60px" : "4px 60px",
          duration: 0.22,
          ease: "power2.out",
        }, 0.04);
        tl.to([activeArm, passiveArm], {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.36,
          ease: "power3.out",
        }, "+=0.12");
      }
    });
  }, []);

  const resetBlob = useCallback(() => {
    const blob = orbFloatRef.current;
    const copy = copyRef.current;

    carryTimer.current?.kill();
    carryTl.current?.kill();
    walkTimer.current?.kill();
    handTimer.current?.kill();
    handTl.current?.kill();
    dragSettleTimer.current?.kill();
    wallRelaxTimer.current?.kill();

    introPlaying.current = false;
    copyOnRight.current = false;
    returnHomeTimer.current?.kill();
    dragging.current = false;
    dragPos.current = { x: 0, y: 0 };
    dragVel.current = { x: 0, y: 0 };
    lastWallHitAt.current = 0;

    if (blob) {
      gsap.to(blob, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.75,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    if (copy) {
      gsap.to(copy, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.65,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    releaseLimbPull();
    playBlobSound("switch");
    scheduleHandFidget();
  }, [playBlobSound, releaseLimbPull, scheduleHandFidget]);

  const swapMouth = useCallback((tl: gsap.core.Timeline, mouthKey: string, pos: number | string = 0) => {
    const m = mouthRef.current;
    if (!m) return;

    tl.to(m, { opacity: 0, duration: 0.08, ease: "sine.in" }, pos);
    tl.call(() => {
      gsap.set(m, { attr: { d: MOUTHS[mouthKey] } });
      playMouthSound(mouthKey);
    });
    tl.to(m, { opacity: 1, duration: 0.18, ease: "power2.out" });
  }, [playMouthSound]);

  const scheduleSaccade = useCallback(() => {
    saccadeTimer.current = gsap.delayedCall(0.12 + Math.random() * 0.45, () => {
      const g1 = saccade1Ref.current;
      const g2 = saccade2Ref.current;
      if (!g1 || !g2) return;

      const sx = (Math.random() - 0.5) * 0.7;
      const sy = (Math.random() - 0.5) * 0.45;

      gsap.to([g1, g2], {
        x: sx, y: sy,
        duration: 0.04, ease: "power2.out", overwrite: true,
      });

      scheduleSaccade();
    });
  }, []);

  const scheduleBlink = useCallback(() => {
    blinkTimer.current = gsap.delayedCall(3.5 + Math.random() * 4, () => {
      const s1 = eye1ShapeRef.current;
      const s2 = eye2ShapeRef.current;
      if (!s1 || !s2) return;

      const t = targetRy.current;
      const doDouble = Math.random() < 0.08;
      const isSlow = Math.random() < 0.1;
      const closeSpeed = isSlow ? 0.14 : 0.09;
      const openSpeed = isSlow ? 0.28 : 0.18;
      const stagger = Math.random() < 0.25 ? 0.015 : 0;

      blinkTl.current = gsap.timeline({ onComplete: () => scheduleBlink() });

      blinkTl.current.to(s1, { attr: { ry: t.e1 + 0.6 }, duration: 0.04, ease: "sine.out" }, 0);
      blinkTl.current.to(s2, { attr: { ry: t.e2 + 0.6 }, duration: 0.04, ease: "sine.out" }, stagger);

      blinkTl.current.to(s1, { attr: { ry: 0.5 }, duration: closeSpeed, ease: "sine.in" }, 0.04);
      blinkTl.current.to(s2, { attr: { ry: 0.5 }, duration: closeSpeed, ease: "sine.in" }, 0.04 + stagger);

      blinkTl.current.to(s1, { attr: { ry: t.e1 }, duration: openSpeed, ease: "sine.out" });
      blinkTl.current.to(s2, { attr: { ry: t.e2 }, duration: openSpeed, ease: "sine.out" }, `<+${stagger}`);

      if (doDouble) {
        const d = blinkTl.current.duration();
        blinkTl.current.to([s1, s2], { attr: { ry: 0.5 }, duration: 0.06, ease: "sine.in" }, d + 0.08);
        blinkTl.current.to(s1, { attr: { ry: t.e1 }, duration: 0.14, ease: "sine.out" });
        blinkTl.current.to(s2, { attr: { ry: t.e2 }, duration: 0.14, ease: "sine.out" }, "<");
      }
    });
  }, []);

  const scheduleGlance = useCallback(() => {
    glanceTimer.current = gsap.delayedCall(2.5 + Math.random() * 4, () => {
      if (hovering.current) { scheduleGlance(); return; }

      const e1 = eye1Ref.current;
      const e2 = eye2Ref.current;
      const s1 = eye1ShapeRef.current;
      const s2 = eye2ShapeRef.current;
      if (!e1 || !e2) return;

      const gx = (Math.random() - 0.5) * 6;
      const gy = (Math.random() - 0.5) * 3;

      const tl = gsap.timeline({ onComplete: () => scheduleGlance() });

      if (Math.random() < 0.45 && s1 && s2) {
        const t = targetRy.current;
        tl.to(s1, { attr: { ry: 0.5 }, duration: 0.06, ease: "sine.in" }, 0);
        tl.to(s2, { attr: { ry: 0.5 }, duration: 0.06, ease: "sine.in" }, 0.012);
        tl.to(s1, { attr: { ry: t.e1 }, duration: 0.13, ease: "sine.out" });
        tl.to(s2, { attr: { ry: t.e2 }, duration: 0.13, ease: "sine.out" }, "<+0.012");
      }

      tl.to([e1, e2], {
        x: gx * 1.25, y: gy * 1.25,
        duration: 0.14, ease: "power3.out",
      }, 0.02);
      tl.to([e1, e2], {
        x: gx, y: gy,
        duration: 0.1, ease: "power2.inOut",
      });
      tl.to([e1, e2], {
        x: 0, y: 0,
        duration: 0.3, ease: "power2.inOut",
      }, "+=0.45");
    });
  }, []);

  const scheduleMood = useCallback(() => {
    moodTimer.current = gsap.delayedCall(5 + Math.random() * 6, () => {
      if (hovering.current || nearFace.current) { scheduleMood(); return; }

      const s1 = eye1ShapeRef.current;
      const s2 = eye2ShapeRef.current;
      if (!s1 || !s2) return;

      const mood = IDLE_MOODS[Math.floor(Math.random() * IDLE_MOODS.length)];
      targetRy.current = { e1: mood.e1.ry, e2: mood.e2.ry };

      const tl = gsap.timeline({ onComplete: () => scheduleMood() });
      tl.to([s1, s2], { attr: { ry: 0.5 }, duration: 0.06, ease: "sine.in" });
      swapMouth(tl, mood.mouth, 0);
      tl.call(() => {
        gsap.set(s1, { attr: { rx: mood.e1.rx } });
        gsap.set(s2, { attr: { rx: mood.e2.rx } });
      }, undefined, 0.08);
      tl.to(s1, { attr: { ry: mood.e1.ry }, duration: 0.2, ease: "power2.out" }, 0.09);
      tl.to(s2, { attr: { ry: mood.e2.ry }, duration: 0.2, ease: "power2.out" }, 0.1);
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const scheduleRandomWalk = () => {
      walkTimer.current?.kill();
      walkTimer.current = gsap.delayedCall(5 + Math.random() * 8, () => {
        const blob = orbFloatRef.current;
        if (!blob || dragging.current || introPlaying.current || window.innerWidth < 900) {
          scheduleRandomWalk();
          return;
        }

        const sectionRect = section.getBoundingClientRect();
        const maxX = Math.min(220, sectionRect.width * 0.22);
        const maxY = Math.min(110, sectionRect.height * 0.14);
        const currentX = gsap.getProperty(blob, "x") as number;
        const currentY = gsap.getProperty(blob, "y") as number;
        const targetX = Math.round((Math.random() - 0.5) * maxX * 2);
        const targetY = Math.round((Math.random() - 0.5) * maxY * 2);
        const distance = Math.hypot(targetX - currentX, targetY - currentY);

        if (distance < 42) {
          scheduleRandomWalk();
          return;
        }

        introPlaying.current = true;
        handTimer.current?.kill();
        handTl.current?.kill();
        releaseLimbPull();

        const steps = Math.max(3, Math.min(7, Math.round(distance / 58)));
        const duration = Math.max(0.9, Math.min(1.8, distance / 150));
        const tl = gsap.timeline({
          onComplete: () => {
            introPlaying.current = false;
            dragPos.current = { x: targetX, y: targetY };
            releaseLimbPull();
            scheduleHandFidget();
            scheduleRandomWalk();
          },
        });

        tl.call(() => playBlobSound("tick"));
        tl.to(blob, {
          x: targetX,
          y: targetY,
          rotation: clamp((targetX - currentX) * 0.025, -5, 5),
          duration,
          ease: "power2.inOut",
        }, 0);
        tl.to(orbInnerRef.current, {
          keyframes: [
            { scaleX: 1.045, scaleY: 0.955, y: 4, duration: 0.13 },
            { scaleX: 0.99, scaleY: 1.025, y: -2, duration: 0.14 },
            { scaleX: 1, scaleY: 1, y: 0, duration: 0.12 },
          ],
          repeat: steps,
          ease: "sine.inOut",
        }, 0.02);
        tl.to(leftLegRef.current, {
          rotation: -8,
          y: -3,
          transformOrigin: "36px 98px",
          duration: 0.15,
          repeat: steps * 2,
          yoyo: true,
          ease: "sine.inOut",
        }, 0);
        tl.to(rightLegRef.current, {
          rotation: 8,
          y: -3,
          transformOrigin: "64px 98px",
          duration: 0.15,
          repeat: steps * 2,
          yoyo: true,
          ease: "sine.inOut",
        }, 0.075);
        tl.to([leftArmRef.current, rightArmRef.current], {
          rotation: (index) => index === 0 ? 3 : -3,
          duration: 0.18,
          repeat: steps * 2,
          yoyo: true,
          ease: "sine.inOut",
        }, 0.04);
        tl.to(blob, {
          rotation: 0,
          duration: 0.28,
          ease: "power3.out",
        }, duration - 0.12);
      });
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(stageRef.current,
        { opacity: 0, y: 64, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: section, start: "top 62%" } },
      );

      gsap.to(eye1ShapeRef.current, {
        attr: { cy: 39.2 }, duration: 2.8,
        repeat: -1, yoyo: true, ease: "sine.inOut",
      });
      gsap.to(eye2ShapeRef.current, {
        attr: { cy: 39.4 }, duration: 3.2,
        repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5,
      });

      gsap.to(mouthRef.current, {
        y: -0.4, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut",
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top 30%",
        once: true,
        onEnter: () => {
          const blob = orbFloatRef.current;
          const copy = copyRef.current;
          if (!blob || !copy || introPlayed.current || window.innerWidth < 900) return;

          introPlayed.current = true;
          const scheduleNextCarry = () => {
            carryTimer.current?.kill();
            carryTimer.current = gsap.delayedCall(22 + Math.random() * 18, () => {
              if (dragging.current || introPlaying.current || window.innerWidth < 900) {
                scheduleNextCarry();
                return;
              }

              carryCopy(!copyOnRight.current, 0);
            });
          };

          const carryCopy = (toRight: boolean, delay = 0) => {
            const sectionRect = section.getBoundingClientRect();
            const blobRect = blob.getBoundingClientRect();
            const copyRect = copy.getBoundingClientRect();
            const currentBlobX = gsap.getProperty(blob, "x") as number;
            const currentBlobY = gsap.getProperty(blob, "y") as number;
            const currentCopyX = gsap.getProperty(copy, "x") as number;
            const copyBaseLeft = copyRect.left - currentCopyX;
            const blobBaseCenterX = blobRect.left - currentBlobX + blobRect.width / 2;
            const blobBaseCenterY = blobRect.top - currentBlobY + blobRect.height / 2;
            const copyGrabX = copyRect.left + copyRect.width * 0.55;
            const copyGrabY = copyRect.top + copyRect.height * 0.18;
            const rightPad = Math.max(48, sectionRect.width * 0.045);
            const targetCopyX = toRight
              ? sectionRect.right - rightPad - copyRect.width - copyBaseLeft
              : 0;
            const targetCopyY = -Math.min(24, sectionRect.height * 0.02);
            const walkX = copyGrabX - blobBaseCenterX;
            const walkY = copyGrabY - blobBaseCenterY;
            const carryBlobX = currentBlobX + (targetCopyX - currentCopyX) * 0.54;
            const carryBlobY = Math.max(-80, Math.min(44, targetCopyY + 8));

            introPlaying.current = true;
            handTimer.current?.kill();
            handTl.current?.kill();

            carryTl.current = gsap.timeline({
              delay,
              onComplete: () => {
                copyOnRight.current = toRight;
                introPlaying.current = false;
                dragPos.current = { x: 0, y: 0 };
                carryTl.current = null;
                releaseLimbPull();
                scheduleHandFidget();
                scheduleNextCarry();
              },
            });
            const tl = carryTl.current;

            tl.call(() => playBlobSound("tick"));
            tl.to(blob, { x: walkX, y: walkY, duration: 1.65, ease: "power2.inOut" }, 0);
            tl.to(orbInnerRef.current, {
              keyframes: [
                { scaleX: 1.06, scaleY: 0.94, y: 5, duration: 0.14 },
                { scaleX: 0.98, scaleY: 1.04, y: -3, duration: 0.16 },
                { scaleX: 1, scaleY: 1, y: 0, duration: 0.12 },
              ],
              repeat: 4,
              ease: "sine.inOut",
            }, 0.02);
            tl.to(leftLegRef.current, {
              rotation: -7,
              y: -3,
              transformOrigin: "36px 98px",
              duration: 0.16,
              repeat: 5,
              yoyo: true,
              ease: "sine.inOut",
            }, 0);
            tl.to(rightLegRef.current, {
              rotation: 7,
              y: -3,
              transformOrigin: "64px 98px",
              duration: 0.16,
              repeat: 5,
              yoyo: true,
              ease: "sine.inOut",
            }, 0.08);
            tl.to([leftArmRef.current, rightArmRef.current], {
              y: -8,
              rotation: (index) => index === 0 ? -8 : 8,
              duration: 0.28,
              ease: "power3.out",
            }, 1.16);
            tl.to(copy, {
              y: targetCopyY - 18,
              scale: 0.96,
              rotation: toRight ? -1.5 : 1.5,
              transformOrigin: "50% 70%",
              duration: 0.36,
              ease: "power3.out",
            }, 1.42);
            tl.call(() => playBlobSound("switch"), undefined, 1.52);
            tl.to(blob, { x: carryBlobX, y: carryBlobY, duration: 1.9, ease: "power2.inOut" }, 1.76);
            tl.to(copy, {
              x: targetCopyX,
              y: targetCopyY - 14,
              rotation: toRight ? 1 : -1,
              duration: 1.9,
              ease: "power2.inOut",
            }, 1.76);
            tl.to(orbInnerRef.current, {
              keyframes: [
                { scaleX: 1.04, scaleY: 0.96, y: 4, duration: 0.16 },
                { scaleX: 0.99, scaleY: 1.03, y: -2, duration: 0.16 },
                { scaleX: 1, scaleY: 1, y: 0, duration: 0.14 },
              ],
              repeat: 4,
              ease: "sine.inOut",
            }, 1.78);
            tl.to(copy, {
              y: targetCopyY,
              scale: 1,
              rotation: 0,
              duration: 0.58,
              ease: "back.out(1.4)",
            }, 3.58);
            tl.call(() => playBlobSound("click"), undefined, 3.62);
            tl.to(blob, { x: 0, y: 0, rotation: 0, duration: 1.25, ease: "power2.inOut" }, 3.92);
            tl.to([leftArmRef.current, rightArmRef.current, leftLegRef.current, rightLegRef.current], {
              x: 0,
              y: 0,
              rotation: 0,
              duration: 0.4,
              ease: "power3.out",
            }, 3.82);
          };

          carryTimer.current = gsap.delayedCall(7.5, () => carryCopy(true, 0));
        },
      });
    }, section);

    scheduleBlink();
    scheduleGlance();
    scheduleSaccade();
    scheduleMood();
    scheduleHandFidget();
    scheduleRandomWalk();

    return () => {
      ctx.revert();
      blinkTimer.current?.kill();
      blinkTl.current?.kill();
      glanceTimer.current?.kill();
      saccadeTimer.current?.kill();
      moodTimer.current?.kill();
      handTimer.current?.kill();
      handTl.current?.kill();
      carryTimer.current?.kill();
      carryTl.current?.kill();
      walkTimer.current?.kill();
      returnHomeTimer.current?.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const orb = orbRef.current;
    if (!orb) return;

    const orbRect = orb.getBoundingClientRect();
    const orbCx = orbRect.left + orbRect.width / 2;
    const orbCy = orbRect.top + orbRect.height / 2;
    const orbR = orbRect.width / 2;

    const dx = event.clientX - orbCx;
    const dy = event.clientY - orbCy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const x = Math.max(-1, Math.min(1, dx / (orbR * 1.8)));
    const y = Math.max(-1, Math.min(1, dy / (orbR * 1.8)));

    orb.style.setProperty("--tilt-x", `${-y * 5}deg`);
    orb.style.setProperty("--tilt-y", `${x * 7}deg`);
    orb.style.setProperty("--shine-x", `${44 + x * 7}%`);
    orb.style.setProperty("--shine-y", `${26 + y * 6}%`);

    if (eye1Ref.current && eye2Ref.current) {
      gsap.to(eye1Ref.current, {
        x: x * 5, y: y * 3.5,
        duration: 0.35, ease: "expo.out", overwrite: "auto",
      });
      gsap.to(eye2Ref.current, {
        x: x * 5, y: y * 3.5,
        duration: 0.4, ease: "expo.out", overwrite: "auto",
      });
    }

    const close = dist < orbR * 0.75;

    if (close && !nearFace.current) {
      nearFace.current = true;
      playBlobSound("click");
      const surprised = { e1: { rx: 10.5, ry: 10.5 }, e2: { rx: 10.5, ry: 10.5 }, mouth: "surprised" };
      targetRy.current = { e1: surprised.e1.ry, e2: surprised.e2.ry };

      const tl = gsap.timeline();
      tl.to([eye1ShapeRef.current, eye2ShapeRef.current], { attr: { ry: 0.5 }, duration: 0.06, ease: "sine.in" });
      swapMouth(tl, surprised.mouth, 0);
      tl.to(eye1ShapeRef.current, { attr: { rx: surprised.e1.rx, ry: surprised.e1.ry }, duration: 0.2, ease: "back.out(1.4)" }, 0.09);
      tl.to(eye2ShapeRef.current, { attr: { rx: surprised.e2.rx, ry: surprised.e2.ry }, duration: 0.2, ease: "back.out(1.4)" }, 0.1);
    } else if (!close && nearFace.current) {
      nearFace.current = false;
      const g = GESTURES[gestureIdx.current];
      targetRy.current = { e1: g.e1.ry, e2: g.e2.ry };

      const tl = gsap.timeline();
      tl.to([eye1ShapeRef.current, eye2ShapeRef.current], { attr: { ry: 0.5 }, duration: 0.06, ease: "sine.in" });
      swapMouth(tl, g.mouth, 0);
      tl.call(() => {
        gsap.set(eye1ShapeRef.current, { attr: { rx: g.e1.rx } });
        gsap.set(eye2ShapeRef.current, { attr: { rx: g.e2.rx } });
      }, undefined, 0.08);
      tl.to(eye1ShapeRef.current, { attr: { rx: g.e1.rx, ry: g.e1.ry }, duration: 0.2, ease: "power2.out" }, 0.09);
      tl.to(eye2ShapeRef.current, { attr: { rx: g.e2.rx, ry: g.e2.ry }, duration: 0.2, ease: "power2.out" }, 0.1);
    }

    hovering.current = true;
  };

  const handleClick = useCallback(() => {
    if (didDrag.current) return;
    playBlobSound("longclick");
    blinkTimer.current?.kill();
    blinkTl.current?.kill();

    const s1 = eye1ShapeRef.current;
    const s2 = eye2ShapeRef.current;
    if (!s1 || !s2) return;

    gestureIdx.current = (gestureIdx.current + 1) % GESTURES.length;
    const g = GESTURES[gestureIdx.current];
    targetRy.current = { e1: g.e1.ry, e2: g.e2.ry };

    gsap.timeline()
      .to(orbInnerRef.current, { scaleY: 0.88, scaleX: 1.08, duration: 0.1, ease: "power2.in" })
      .to(orbInnerRef.current, { scaleY: 1, scaleX: 1, duration: 0.55, ease: "elastic.out(1, 0.3)" });

    const tl = gsap.timeline({ onComplete: () => scheduleBlink() });

    tl.to(s1, { attr: { ry: 0.5 }, duration: 0.07, ease: "sine.in" }, 0);
    tl.to(s2, { attr: { ry: 0.5 }, duration: 0.07, ease: "sine.in" }, 0.012);

    swapMouth(tl, g.mouth, 0);

    tl.call(() => {
      gsap.set(s1, { attr: { rx: g.e1.rx } });
      gsap.set(s2, { attr: { rx: g.e2.rx } });
    }, undefined, 0.08);

    tl.to(s1, { attr: { ry: g.e1.ry }, duration: 0.22, ease: "back.out(1.7)" }, 0.09);
    tl.to(s2, { attr: { ry: g.e2.ry }, duration: 0.22, ease: "back.out(1.7)" }, 0.1);
  }, [playBlobSound, scheduleBlink, swapMouth]);

  const handlePointerEnter = () => {
    playBlobSound("switch");
  };

  const handlePointerLeave = () => {
    const orb = orbRef.current;
    if (!orb) return;

    orb.style.setProperty("--tilt-x", "0deg");
    orb.style.setProperty("--tilt-y", "0deg");
    orb.style.setProperty("--shine-x", "44%");
    orb.style.setProperty("--shine-y", "26%");

    gsap.to([eye1Ref.current, eye2Ref.current], {
      x: 0, y: 0, duration: 0.85, ease: "expo.out", overwrite: "auto",
    });

    if (nearFace.current) {
      nearFace.current = false;
      const g = GESTURES[gestureIdx.current];
      targetRy.current = { e1: g.e1.ry, e2: g.e2.ry };

      const tl = gsap.timeline();
      tl.to([eye1ShapeRef.current, eye2ShapeRef.current], { attr: { ry: 0.5 }, duration: 0.06, ease: "sine.in" });
      swapMouth(tl, g.mouth, 0);
      tl.call(() => {
        gsap.set(eye1ShapeRef.current, { attr: { rx: g.e1.rx } });
        gsap.set(eye2ShapeRef.current, { attr: { rx: g.e2.rx } });
      }, undefined, 0.08);
      tl.to(eye1ShapeRef.current, { attr: { rx: g.e1.rx, ry: g.e1.ry }, duration: 0.2, ease: "power2.out" }, 0.09);
      tl.to(eye2ShapeRef.current, { attr: { rx: g.e2.rx, ry: g.e2.ry }, duration: 0.2, ease: "power2.out" }, 0.1);
    }

    hovering.current = false;
    playBlobSound("close");
  };

  useEffect(() => {
    const el = orbFloatRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;

    const clampDrag = (x: number, y: number) => {
      const sectionRect = section.getBoundingClientRect();
      const currentX = dragPos.current.x;
      const currentY = dragPos.current.y;
      const elRect = el.getBoundingClientRect();
      const baseLeft = elRect.left - currentX;
      const baseTop = elRect.top - currentY;
      const padding = Math.min(28, sectionRect.width * 0.04);

      const minX = sectionRect.left + padding - baseLeft;
      const maxX = sectionRect.right - padding - baseLeft - elRect.width;
      const minY = sectionRect.top + padding - baseTop;
      const maxY = sectionRect.bottom - padding - baseTop - elRect.height;

      return {
        x: Math.min(Math.max(x, minX), maxX),
        y: Math.min(Math.max(y, minY), maxY),
      };
    };

    const restoreNormalFace = () => {
      const s1 = eye1ShapeRef.current;
      const s2 = eye2ShapeRef.current;
      if (!s1 || !s2) return;

      const g = GESTURES[gestureIdx.current];
      targetRy.current = { e1: g.e1.ry, e2: g.e2.ry };

      const tl = gsap.timeline();
      tl.to([s1, s2], { attr: { ry: 0.5 }, duration: 0.06, ease: "sine.in" });
      swapMouth(tl, g.mouth, 0);
      tl.call(() => {
        gsap.set(s1, { attr: { rx: g.e1.rx } });
        gsap.set(s2, { attr: { rx: g.e2.rx } });
      }, undefined, 0.08);
      tl.to(s1, { attr: { ry: g.e1.ry }, duration: 0.2, ease: "power2.out" }, 0.09);
      tl.to(s2, { attr: { ry: g.e2.ry }, duration: 0.2, ease: "power2.out" }, 0.1);
    };

    const scheduleWallRelax = () => {
      wallRelaxTimer.current?.kill();
      wallRelaxTimer.current = gsap.delayedCall(0.8, () => {
        if (performance.now() - lastWallHitAt.current < 760) return;
        restoreNormalFace();
      });
    };

    const showAnnoyed = (force = false) => {
      const now = performance.now();
      if (!force && now - lastWallHitAt.current < 520) return;
      lastWallHitAt.current = now;
      scheduleWallRelax();
      playBlobSound("close");

      const s1 = eye1ShapeRef.current;
      const s2 = eye2ShapeRef.current;
      if (!s1 || !s2) return;

      const annoyed = { e1: { rx: 9.2, ry: 5.8 }, e2: { rx: 9.2, ry: 5.8 } };
      targetRy.current = { e1: annoyed.e1.ry, e2: annoyed.e2.ry };

      const tl = gsap.timeline();
      tl.to([s1, s2], { attr: { ry: 0.5 }, duration: 0.06, ease: "sine.in" });
      swapMouth(tl, "bored", 0);
      tl.call(() => {
        gsap.set(s1, { attr: { rx: annoyed.e1.rx } });
        gsap.set(s2, { attr: { rx: annoyed.e2.rx } });
      }, undefined, 0.08);
      tl.to(s1, { attr: { ry: annoyed.e1.ry }, duration: 0.18, ease: "power2.out" }, 0.09);
      tl.to(s2, { attr: { ry: annoyed.e2.ry }, duration: 0.18, ease: "power2.out" }, 0.1);

      gsap.timeline()
        .to(orbInnerRef.current, { x: 4, scaleX: 1.035, scaleY: 0.975, duration: 0.05, ease: "power2.out" })
        .to(orbInnerRef.current, { x: -3, duration: 0.06, ease: "power2.inOut" })
        .to(orbInnerRef.current, { x: 0, scaleX: 1, scaleY: 1, duration: 0.18, ease: "power3.out" });
    };

    const setDragPosition = (x: number, y: number) => {
      const next = clampDrag(x, y);
      const wallPushX = x - next.x;
      const wallPushY = y - next.y;
      const wallPressure = Math.hypot(wallPushX, wallPushY);
      const velocityIntoWall =
        Math.abs(wallPushX) * Math.abs(dragVel.current.x) +
        Math.abs(wallPushY) * Math.abs(dragVel.current.y);
      const wasHit = wallPressure > 1.2 && (wallPressure > 7 || velocityIntoWall > 5);
      if (wasHit) showAnnoyed();

      dragPos.current = next;
      gsap.to(el, {
        x: next.x,
        y: next.y,
        rotation: clamp(dragVel.current.x * 0.65, -8, 8),
        duration: 0.09,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const getGrabZone = (e: PointerEvent) => {
      const orb = orbRef.current;
      if (!orb) return "body";

      const rect = orb.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      if (x < 20 && y > 45 && y < 86) return "leftArm";
      if (x > 80 && y > 45 && y < 86) return "rightArm";
      if (x < 47 && y > 78) return "leftLeg";
      if (x > 53 && y > 78) return "rightLeg";
      return "body";
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      dragging.current = true;
      didDrag.current = false;
      lastWallHitAt.current = 0;
      wallRelaxTimer.current?.kill();
      dragStart.current = { x: e.clientX, y: e.clientY, ox: dragPos.current.x, oy: dragPos.current.y };
      dragPrev.current = { x: e.clientX, y: e.clientY, t: performance.now() };
      dragVel.current = { x: 0, y: 0 };
      dragGrab.current = getGrabZone(e);
      returnHomeTimer.current?.kill();
      carryTimer.current?.kill();
      carryTl.current?.kill();
      walkTimer.current?.kill();
      handTimer.current?.kill();
      handTl.current?.kill();
      releaseLimbPull();
      playBlobSound("click");
      gsap.killTweensOf(el);
      gsap.to(orbInnerRef.current, { scale: 0.965, duration: 0.18, ease: "power2.out", overwrite: true });
      animateLimbPull(0, 0, 1.15, 0, 0);
      el.classList.add(s.dragging);
      el.setPointerCapture?.(e.pointerId);
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
      document.addEventListener("pointercancel", onUp);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const now = performance.now();
      const dt = Math.max(1, now - dragPrev.current.t);

      const movedX = e.clientX - dragStart.current.x;
      const movedY = e.clientY - dragStart.current.y;
      if (!didDrag.current && Math.hypot(movedX, movedY) > 10) didDrag.current = true;

      const nx = dragStart.current.ox + movedX;
      const ny = dragStart.current.oy + movedY;

      dragVel.current.x = 0.7 * dragVel.current.x + 0.3 * ((e.clientX - dragPrev.current.x) / dt * 16);
      dragVel.current.y = 0.7 * dragVel.current.y + 0.3 * ((e.clientY - dragPrev.current.y) / dt * 16);
      dragPrev.current = { x: e.clientX, y: e.clientY, t: now };

      setDragPosition(nx, ny);
      animateLimbPull(dragVel.current.x, dragVel.current.y, 1, movedX, movedY);
      dragSettleTimer.current?.kill();
      dragSettleTimer.current = gsap.delayedCall(0.11, () => {
        if (!dragging.current) return;
        animateLimbPull(dragVel.current.x * 0.18, dragVel.current.y * 0.18, 0.5, movedX * 0.18, movedY * 0.18);
      });
    };

    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      dragSettleTimer.current?.kill();
      el.classList.remove(s.dragging);

      if (!didDrag.current) {
        handleClick();
        releaseLimbPull();
        gsap.to(el, { rotation: 0, duration: 0.35, ease: "power3.out", overwrite: "auto" });
        scheduleHandFidget();
        return;
      }

      const vx = dragVel.current.x;
      const vy = dragVel.current.y;
      const rawX = dragPos.current.x + vx * 5.5;
      const rawY = dragPos.current.y + vy * 5.5;
      const throwPos = clampDrag(rawX, rawY);
      const thrownIntoWall = Math.abs(throwPos.x - rawX) > 8 || Math.abs(throwPos.y - rawY) > 8;
      if (thrownIntoWall) showAnnoyed(true);

      const scheduleReturnHome = () => {
        returnHomeTimer.current?.kill();
        returnHomeTimer.current = gsap.delayedCall(1.4, () => {
          if (dragging.current || introPlaying.current) return;

          const currentX = dragPos.current.x;
          const currentY = dragPos.current.y;
          const distance = Math.hypot(currentX, currentY);
          if (distance < 18) {
            scheduleHandFidget();
            return;
          }

          introPlaying.current = true;
          handTimer.current?.kill();
          handTl.current?.kill();
          playBlobSound("tick");

          const steps = Math.max(3, Math.min(7, Math.round(distance / 60)));
          const duration = Math.max(0.85, Math.min(1.7, distance / 155));
          const tl = gsap.timeline({
            onComplete: () => {
              introPlaying.current = false;
              dragPos.current = { x: 0, y: 0 };
              releaseLimbPull();
              scheduleHandFidget();
            },
          });

          tl.to(el, {
            x: 0,
            y: 0,
            rotation: clamp(-currentX * 0.018, -5, 5),
            duration,
            ease: "power2.inOut",
          }, 0);
          tl.to(orbInnerRef.current, {
            keyframes: [
              { scaleX: 1.045, scaleY: 0.955, y: 4, duration: 0.13 },
              { scaleX: 0.99, scaleY: 1.025, y: -2, duration: 0.14 },
              { scaleX: 1, scaleY: 1, y: 0, duration: 0.12 },
            ],
            repeat: steps,
            ease: "sine.inOut",
          }, 0.02);
          tl.to(leftLegRef.current, {
            rotation: -8,
            y: -3,
            transformOrigin: "36px 98px",
            duration: 0.15,
            repeat: steps * 2,
            yoyo: true,
            ease: "sine.inOut",
          }, 0);
          tl.to(rightLegRef.current, {
            rotation: 8,
            y: -3,
            transformOrigin: "64px 98px",
            duration: 0.15,
            repeat: steps * 2,
            yoyo: true,
            ease: "sine.inOut",
          }, 0.075);
          tl.to([leftArmRef.current, rightArmRef.current], {
            rotation: (index) => index === 0 ? 3 : -3,
            duration: 0.18,
            repeat: steps * 2,
            yoyo: true,
            ease: "sine.inOut",
          }, 0.04);
          tl.to(el, {
            rotation: 0,
            duration: 0.28,
            ease: "power3.out",
          }, duration - 0.12);
        });
      };

      gsap.to(el, {
        x: throwPos.x, y: throwPos.y,
        rotation: 0,
        duration: 0.72, ease: "expo.out",
        onUpdate() {
          dragPos.current.x = gsap.getProperty(el, "x") as number;
          dragPos.current.y = gsap.getProperty(el, "y") as number;
        },
        onComplete() {
          dragPos.current = throwPos;
          scheduleReturnHome();
        },
      });

      gsap.timeline()
        .to(orbInnerRef.current, { scaleY: 0.9, scaleX: 1.06, duration: 0.1, ease: "power2.in" })
        .to(orbInnerRef.current, { scaleY: 1, scaleX: 1, duration: 0.72, ease: "elastic.out(0.95, 0.32)" });
      releaseLimbPull();
    };

    el.addEventListener("pointerdown", onDown);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      dragSettleTimer.current?.kill();
      wallRelaxTimer.current?.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={sectionRef} className={s.section} aria-labelledby="blob-title">
      <div
        ref={stageRef}
        className={s.stage}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className={s.grid} aria-hidden="true" />

        <button
          className={s.resetButton}
          type="button"
          onClick={resetBlob}
          data-sound="off"
        >
          <span className={s.resetLabelWrap}>
            <span className={s.resetLabel}>reset</span>
            <span className={s.resetLabelClone}>reset</span>
          </span>
          <span className={s.resetCircle}>
            <span className={s.resetIcon}>↺</span>
          </span>
        </button>

        <div ref={orbFloatRef} className={s.orbFloat}>
          <div
            ref={orbRef}
            className={s.orbWrap}
            onPointerEnter={handlePointerEnter}
            data-sound="off"
          >
            <span ref={tooltipRef} className={s.tooltip}>click me!!</span>
            <svg className={s.limbs} viewBox="0 0 100 100" aria-hidden="true">
              <g ref={leftArmRef} className={s.limb}>
                <path ref={leftArmPathRef} d="M 2 60 Q -10 68 -18 70" />
                <circle ref={leftHandRef} cx="-18" cy="70" r="3.2" />
              </g>
              <g ref={rightArmRef} className={s.limb}>
                <path ref={rightArmPathRef} d="M 98 60 Q 110 68 118 70" />
                <circle ref={rightHandRef} cx="118" cy="70" r="3.2" />
              </g>
              <g ref={leftLegRef} className={s.limb}>
                <path ref={leftLegPathRef} d="M 36 98 Q 28 118 22 132" />
                <circle ref={leftFootRef} cx="22" cy="132" r="3.2" />
              </g>
              <g ref={rightLegRef} className={s.limb}>
                <path ref={rightLegPathRef} d="M 64 98 Q 72 118 78 132" />
                <circle ref={rightFootRef} cx="78" cy="132" r="3.2" />
              </g>
            </svg>
            <div ref={orbInnerRef} className={s.orb}>
              <svg className={s.face} viewBox="0 0 100 100" aria-hidden="true">
                <defs>
                  <radialGradient id="eye-grad" cx="38%" cy="30%" r="62%">
                    <stop offset="0%" stopColor="white" stopOpacity="1" />
                    <stop offset="20%" stopColor="white" stopOpacity="1" />
                    <stop offset="46%" stopColor="#f6fff3" stopOpacity="0.92" />
                    <stop offset="100%" stopColor="#cbffdb" stopOpacity="0.62" />
                  </radialGradient>
                </defs>

                <g>
                  <g ref={eye1Ref}>
                    <g ref={saccade1Ref}>
                      <ellipse ref={eye1ShapeRef} cx="34" cy="40" rx="9" ry="9" fill="url(#eye-grad)" />
                    </g>
                  </g>

                  <g ref={eye2Ref}>
                    <g ref={saccade2Ref}>
                      <ellipse ref={eye2ShapeRef} cx="66" cy="40" rx="9" ry="9" fill="url(#eye-grad)" />
                    </g>
                  </g>

                  <path
                    ref={mouthRef}
                    d="M 37 64 Q 50 69 63 64"
                    stroke="#04160c"
                    strokeWidth="2.8"
                    fill="none"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div ref={copyRef} className={s.copy}>
          <h2 id="blob-title" className={s.title}>Meet Blob.</h2>
          <p className={s.body}>
            A small digital friend with a quiet personality. It watches, reacts, blinks, and reminds you that interfaces can feel human without trying too hard.
          </p>
        </div>
      </div>
    </section>
  );
}
