"use client";

import Image from "next/image";
import { useRef } from "react";
import s from "./About.module.scss";

export default function About() {
  const portraitRef = useRef<HTMLElement>(null);

  return (
    <section id="about" className={s.section}>
      <div className={s.topline}>
        <span>A little about me</span>
        <span>Niko, creative developer</span>
      </div>

      <div className={s.composition}>
        <div className={s.titleBlock}>
          <h2>Half designer.<br />Half developer.<br /><span>Fully curious.</span></h2>
          <p className={s.location}>Based in The Netherlands</p>
        </div>

        <figure ref={portraitRef} className={s.portrait}>
          <Image
            src="/Niko-pixel-user.png"
            alt="Pixelated portrait of Niko Dima, creative developer"
            fill
            sizes="(max-width: 760px) 84vw, 34vw"
            className={s.portraitImage}
          />
          <Image
            src="/Niko-pixel-real.png"
            alt=""
            fill
            sizes="(max-width: 760px) 84vw, 34vw"
            className={s.portraitMedium}
            aria-hidden="true"
          />
          <Image
            src="/Niko.png"
            alt=""
            fill
            sizes="(max-width: 760px) 84vw, 34vw"
            className={s.portraitReal}
            aria-hidden="true"
          />
        </figure>

        <label className={s.resolutionControl}>
          <span>Pixel</span>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="0"
            aria-label="Portrait resolution"
            onInput={(event) => {
              const value = Number(event.currentTarget.value) / 100;
              portraitRef.current?.style.setProperty("--resolution", String(value));
            }}
          />
          <span>Real</span>
        </label>

        <div className={s.story}>
          <p className={s.lead}>I turn rough ideas into digital experiences people want to explore.</p>
          <p>My favorite work lives between interface, motion, and code. I care about the strange little details, but never at the cost of making something clear and useful.</p>
          <div className={s.disciplines} aria-label="Main disciplines">
            <span>Interface</span>
            <span>Motion</span>
            <span>Front-end</span>
          </div>
        </div>
      </div>

      <div className={s.marquee} aria-hidden="true">
        <svg className={s.uMarquee} viewBox="0 0 1600 300" preserveAspectRatio="none">
          <defs>
            <path id="about-u-path" pathLength="100" d="M-120 82 C110 82 115 218 410 218 L1190 218 C1485 218 1490 82 1720 82" />
          </defs>
          <use href="#about-u-path" className={s.uBand} />
          <text className={s.uText} dy="0.33em">
            <textPath href="#about-u-path" startOffset="-100%" textLength="1840" lengthAdjust="spacing">
              Interface ◆ <tspan className={s.uAccent}>Motion</tspan> ◆ Code ◆ <tspan className={s.uAccent}>Interaction</tspan> ◆ Experiments ◆
              <animate attributeName="startOffset" from="-100%" to="0%" dur="11s" repeatCount="indefinite" />
            </textPath>
          </text>
          <text className={s.uText} dy="0.33em">
            <textPath href="#about-u-path" startOffset="0%" textLength="1840" lengthAdjust="spacing">
              Interface ◆ <tspan className={s.uAccent}>Motion</tspan> ◆ Code ◆ <tspan className={s.uAccent}>Interaction</tspan> ◆ Experiments ◆
              <animate attributeName="startOffset" from="0%" to="100%" dur="11s" repeatCount="indefinite" />
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  );
}
