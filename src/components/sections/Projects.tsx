"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import s from "./Projects.module.scss";

const PROJECTS = [
  {
    title: "Aria",
    src: "/aria.png",
    link: "/case/aria",
    role: "Interface",
    year: "2025",
  },
  {
    title: "Melograph",
    src: "/impact.png",
    link: "/case/melograph",
    role: "Studio site",
    year: "2026",
  },
  {
    title: "Museum",
    src: "/museum.png",
    link: "/case/museum",
    role: "Archive",
    year: "2025",
  },
  {
    title: "Precision",
    src: "/precission.jpg",
    link: "/archive",
    role: "Prototype",
    year: "2026",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function Projects() {
  const [current, setCurrent] = useState(0);
  const project = PROJECTS[current];

  const playSound = useCallback((sound: "switch" | "longclick") => {
    window.dispatchEvent(new CustomEvent("sound-play", { detail: { sound } }));
  }, []);

  const selectProject = useCallback((index: number) => {
    setCurrent(index);
    playSound("switch");
  }, [playSound]);

  return (
    <section id="projects" className={s.section}>
      <div className={s.heading}>
        <span>selected work</span>
        <h2>Work</h2>
      </div>

      <div className={s.layout}>
        <nav className={s.list} aria-label="Selected projects">
          {PROJECTS.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={`${s.row}${index === current ? ` ${s.active}` : ""}`}
              onClick={() => selectProject(index)}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse" && index !== current) selectProject(index);
              }}
              data-sound="off"
            >
              <span className={s.index}>{pad(index + 1)}</span>
              <span className={s.title}>{item.title}</span>
              <span className={s.year}>{item.year}</span>
            </button>
          ))}
        </nav>

        <Link
          href={project.link}
          className={s.preview}
          onClick={() => playSound("longclick")}
        >
          <span className={s.corner} aria-hidden="true" />
          <Image
            key={project.src}
            src={project.src}
            alt={`${project.title} project preview`}
            fill
            className={s.image}
            sizes="(max-width: 900px) 92vw, 44vw"
            priority={current === 0}
          />
          <div className={s.caption}>
            <span>{pad(current + 1)} / {pad(PROJECTS.length)}</span>
            <span>{project.role}</span>
          </div>
        </Link>

        <div className={s.note} aria-hidden="true">
          <span>{project.title}</span>
          <span>{project.year}</span>
        </div>
      </div>
    </section>
  );
}
