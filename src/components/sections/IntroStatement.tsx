"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import s from "./IntroStatement.module.scss";

type Particle = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
};

export default function IntroStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mobileTypeState, setMobileTypeState] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    // The particle letterforms lose legibility once compressed to a phone.
    // Mobile uses the real text treatment rendered alongside the canvas.
    if (window.matchMedia("(max-width: 700px)").matches) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -1000, y: -1000, active: false };
    let particles: Particle[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let activated = reducedMotion;
    let visible = false;
    let lastFrame = 0;
    const frameInterval = 1000 / 30;

    const stopRendering = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const startRendering = () => {
      if (frame || !visible || document.hidden) return;
      frame = requestAnimationFrame(render);
    };

    const buildParticles = () => {
      const rect = section.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const sample = document.createElement("canvas");
      sample.width = Math.max(1, Math.round(width));
      sample.height = Math.max(1, Math.round(height));
      const sampleContext = sample.getContext("2d", { willReadFrequently: true });
      if (!sampleContext) return;

      const caveat = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-caveat")
        .trim() || "cursive";
      const lines = ["I turn curious ideas", "into playful", "digital experiences", "that feel alive."];
      let fontSize = Math.min(width * 0.17, height * 0.185, 180);

      sampleContext.clearRect(0, 0, width, height);
      sampleContext.fillStyle = "#111";
      sampleContext.font = `600 ${fontSize}px ${caveat}, cursive`;
      sampleContext.textAlign = "center";
      sampleContext.textBaseline = "middle";

      while (
        fontSize > 42
        && Math.max(...lines.map((line) => sampleContext.measureText(line).width)) > width * 0.88
      ) {
        fontSize -= 2;
        sampleContext.font = `600 ${fontSize}px ${caveat}, cursive`;
      }

      const lineHeight = fontSize * 1.02;

      const firstY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, index) => {
        sampleContext.fillText(line, width / 2, firstY + index * lineHeight);
      });

      const image = sampleContext.getImageData(0, 0, sample.width, sample.height);
      const gap = width < 900 ? 8 : 9;
      const next: Particle[] = [];

      for (let y = 0; y < sample.height; y += gap) {
        for (let x = 0; x < sample.width; x += gap) {
          if (image.data[(y * sample.width + x) * 4 + 3] > 110) {
            const previous = particles[next.length];
            next.push({
              x: previous?.x ?? (Math.random() < 0.5 ? -30 : width + 30),
              y: previous?.y ?? Math.random() * height,
              tx: x,
              ty: y,
              vx: 0,
              vy: 0,
              size: 1.45 + Math.random() * 1.2,
            });
          }
        }
      }

      particles = next;
    };

    const render = (time = 0) => {
      if (!visible || document.hidden || time - lastFrame < frameInterval) {
        if (visible && !document.hidden) frame = requestAnimationFrame(render);
        else frame = 0;
        return;
      }
      lastFrame = time;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#111";
      context.globalAlpha = 0.94;
      context.beginPath();

      for (const particle of particles) {
        if (!reducedMotion && activated) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distanceSquared = dx * dx + dy * dy;
          const radius = 145;

          if (pointer.active && distanceSquared < radius * radius && distanceSquared > 0.1) {
            const distance = Math.sqrt(distanceSquared);
            const force = (1 - distance / radius) * 2.8;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }

          particle.vx += (particle.tx - particle.x) * 0.075;
          particle.vy += (particle.ty - particle.y) * 0.075;
          particle.vx *= 0.8;
          particle.vy *= 0.8;
          particle.x += particle.vx;
          particle.y += particle.vy;
        } else {
          particle.x = particle.tx;
          particle.y = particle.ty;
        }

        context.moveTo(particle.x + particle.size, particle.y);
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      }

      context.fill();
      context.globalAlpha = 1;
      frame = requestAnimationFrame(render);
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const releasePointer = () => {
      pointer.active = false;
    };

    const burst = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const bx = event.clientX - rect.left;
      const by = event.clientY - rect.top;

      for (const particle of particles) {
        const dx = particle.x - bx;
        const dy = particle.y - by;
        const distance = Math.max(Math.hypot(dx, dy), 1);
        if (distance < 360) {
          const force = (1 - distance / 360) * 18;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }
      }
    };

    const prepare = async () => {
      await document.fonts.ready;
      buildParticles();
      startRendering();
    };

    const entrance = gsap.fromTo(
      canvas,
      { opacity: 0, scale: 0.9, filter: "blur(10px)" },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.45,
        ease: "power3.out",
        paused: true,
      },
    );

    if (reducedMotion) {
      entrance.progress(1);
    }

    /*
      Keep particle construction independent from the entrance timeline so a
      resize never restarts the reveal.
    */
    const activateIfAlreadyPast = () => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.78) {
          activated = true;
      }
    };

    prepare();
    activateIfAlreadyPast();
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (entry.isIntersecting) {
          activated = true;
          entrance.play();
          startRendering();
        } else if (entry.boundingClientRect.top > 0) {
          stopRendering();
          activated = false;
          entrance.reverse();
          particles.forEach((particle) => {
            particle.x = Math.random() < 0.5 ? -40 : width + 40;
            particle.y = Math.random() * height;
            particle.vx = 0;
            particle.vy = 0;
          });
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(section);
    const handleVisibilityChange = () => {
      if (document.hidden) stopRendering();
      else startRendering();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    let resizeFrame = 0;
    const handleResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(buildParticles);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    canvas.addEventListener("pointermove", updatePointer);
    canvas.addEventListener("pointerleave", releasePointer);
    canvas.addEventListener("pointerdown", burst);

    return () => {
      stopRendering();
      cancelAnimationFrame(resizeFrame);
      entrance.kill();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointermove", updatePointer);
      canvas.removeEventListener("pointerleave", releasePointer);
      canvas.removeEventListener("pointerdown", burst);
    };
  }, []);

  return (
    <section ref={sectionRef} className={s.section} aria-label="Interactive particle typography">
      <canvas ref={canvasRef} className={s.canvas} />
      <p className={s.fallback}>
        I turn curious ideas into playful digital experiences that feel alive.
      </p>
      <button
        type="button"
        className={s.mobileStatement}
        data-state={mobileTypeState}
        onClick={() => setMobileTypeState((state) => (state + 1) % 3)}
        aria-label="Rearrange the statement"
        data-sound="click"
      >
        <span>I turn</span>
        <span>curious ideas</span>
        <span>into playful</span>
        <span>digital experiences</span>
        <span>that feel alive.</span>
        <small>Tap to stir the type</small>
      </button>
    </section>
  );
}
