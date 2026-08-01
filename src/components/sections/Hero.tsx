"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import s from "./Hero.module.scss";

const CHARS = "$@B%8&WM#ZO0QCJYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
const CELL_SIZE = 9;
const FRAME_INTERVAL = 1000 / 24;

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraFailed, setCameraFailed] = useState(false);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sample = document.createElement("canvas");
    const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
    if (!sampleCtx) return;

    let raf = 0;
    let stream: MediaStream | null = null;
    let disposed = false;
    let visible = true;
    let lastFrame = 0;
    let sampleCols = 0;
    let sampleRows = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };

    const drawFallback = (message = "allow camera") => {
      const { width, height } = canvas;
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
      ctx.font = `${Math.max(16, width * 0.035)}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(message, width / 2, height / 2);
    };

    const draw = (time = 0) => {
      if (!visible || document.hidden) {
        raf = requestAnimationFrame(draw);
        return;
      }
      if (time - lastFrame < FRAME_INTERVAL) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = time;

      const { width, height } = canvas;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const cols = Math.max(1, Math.floor(width / (CELL_SIZE * dpr)));
      const rows = Math.max(1, Math.floor(height / (CELL_SIZE * dpr)));
      const cellW = width / cols;
      const cellH = height / rows;

      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, width, height);

      if (video.readyState >= 2) {
        if (cols !== sampleCols || rows !== sampleRows) {
          sample.width = cols;
          sample.height = rows;
          sampleCols = cols;
          sampleRows = rows;
        }

        sampleCtx.save();
        sampleCtx.translate(cols, 0);
        sampleCtx.scale(-1, 1);

        const videoRatio = video.videoWidth / video.videoHeight;
        const sampleRatio = cols / rows;
        let sx = 0;
        let sy = 0;
        let sw = video.videoWidth;
        let sh = video.videoHeight;

        if (videoRatio > sampleRatio) {
          sw = video.videoHeight * sampleRatio;
          sx = (video.videoWidth - sw) / 2;
        } else {
          sh = video.videoWidth / sampleRatio;
          sy = (video.videoHeight - sh) / 2;
        }

        sampleCtx.drawImage(video, sx, sy, sw, sh, 0, 0, cols, rows);
        sampleCtx.restore();

        const data = sampleCtx.getImageData(0, 0, cols, rows).data;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${cellH * 1.08}px monospace`;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const index = (row * cols + col) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            const charIndex = Math.floor((1 - brightness) * (CHARS.length - 1));
            const char = CHARS[charIndex];
            const x = col * cellW + cellW / 2;
            const y = row * cellH + cellH / 2;

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillText(char, x, y);
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "100px" },
    );
    observer.observe(canvas);

    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setCameraFailed(true);
      drawFallback("use localhost or https");
      return () => {
        disposed = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        observer.disconnect();
      };
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } })
      .then((mediaStream) => {
        if (disposed) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        stream = mediaStream;
        video.srcObject = mediaStream;
        video.play()
          .then(() => {
            setCameraFailed(false);
            raf = requestAnimationFrame(draw);
          })
          .catch(() => {
            setCameraFailed(true);
            drawFallback("click allow camera");
          });
      })
      .catch(() => {
        setCameraFailed(true);
        drawFallback("click allow camera");
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <section ref={sectionRef} className={s.section}>
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

      <div className={s.mediaShell}>
        <div ref={imageRef} className={s.imageContainer}>
          <div className={s.effectFrame} aria-label={cameraFailed ? "Camera unavailable" : "Live camera ascii effect"}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video ref={videoRef} className={s.hiddenVideo} playsInline muted autoPlay />
            <canvas ref={canvasRef} className={s.effectCanvas} />
            <div className={s.effectGrain} aria-hidden="true" />
          </div>
        </div>

      </div>

      <div className={`${s.nameWrap} hero-name`}>
        {"Niko Dima".split("").map((char, i) => (
          <span
            key={`${char}-${i}`}
            className={`${s.heroChar} hero-char`}
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: "clamp(5rem, 22vw, 22rem)",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>

    </section>
  );
}
