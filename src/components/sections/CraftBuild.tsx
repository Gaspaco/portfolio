"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { BatteryFull, Signal, Volume2 } from "pixelarticons/react";
import { siFigma, siGithub, siGreensock, siHtml5, siJavascript, siNextdotjs, siNodedotjs, siPhp, siReact, siThreedotjs, siTypescript, siVuedotjs, type SimpleIcon } from "simple-icons";
import s from "./CraftBuild.module.scss";

type Panel = "languages" | "tools" | "stack";
type WindowMode = "open" | "minimized" | "maximized" | "closed";
type DesktopDialog = "computer" | "projects" | "cv" | null;

const screens: Record<Panel, {
  index: string;
  label: string;
  title: string;
  note: string;
  items: Array<{ name: string; tag: string; detail: string; icon: SimpleIcon }>;
}> = {
  languages: {
    index: "01",
    label: "LANGUAGES",
    title: "Things I speak\nto browsers.",
    note: "The vocabulary behind the interface.",
    items: [
      { name: "TypeScript", tag: "STRONG", detail: "Typed applications", icon: siTypescript },
      { name: "JavaScript", tag: "STRONG", detail: "Interaction logic", icon: siJavascript },
      { name: "HTML / CSS", tag: "STRONG", detail: "Structure + styling", icon: siHtml5 },
      { name: "PHP", tag: "WORKING", detail: "Backend foundations", icon: siPhp },
    ],
  },
  tools: {
    index: "02",
    label: "TOOLBOX",
    title: "Things usually\nleft open.",
    note: "From first frame to final polish.",
    items: [
      { name: "Figma", tag: "DESIGN", detail: "Flows + systems", icon: siFigma },
      { name: "GSAP", tag: "MOTION", detail: "Purposeful movement", icon: siGreensock },
      { name: "Three.js", tag: "3D", detail: "Web experiments", icon: siThreedotjs },
      { name: "Git / GitHub", tag: "TEAM", detail: "Versions + reviews", icon: siGithub },
    ],
  },
  stack: {
    index: "03",
    label: "STACK",
    title: "Things holding\nit together.",
    note: "Fast, responsive, and made to last.",
    items: [
      { name: "React / Next.js", tag: "MAIN", detail: "Component applications", icon: siNextdotjs },
      { name: "Node.js", tag: "SERVER", detail: "Backend development", icon: siNodedotjs },
      { name: "Vue", tag: "UI", detail: "Frontend applications", icon: siVuedotjs },
      { name: "React Native", tag: "MOBILE", detail: "Mobile interfaces", icon: siReact },
    ],
  },
};

export default function CraftBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const windowDragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number; minDx: number; maxDx: number; minDy: number; maxDy: number } | null>(null);
  const windowResizeRef = useRef<{ pointerId: number; startX: number; startY: number; startWidth: number; startHeight: number; maxWidth: number; maxHeight: number; direction: "right" | "bottom" | "corner" } | null>(null);
  const [panel, setPanel] = useState<Panel>("languages");
  const [windowMode, setWindowMode] = useState<WindowMode>("open");
  const [isPowered, setIsPowered] = useState(true);
  const [isBooting, setIsBooting] = useState(false);
  const [desktopDialog, setDesktopDialog] = useState<DesktopDialog>(null);

  const togglePower = () => {
    if (isPowered) {
      setIsPowered(false);
      setIsBooting(false);
      return;
    }
    setIsPowered(true);
    setIsBooting(true);
  };

  useEffect(() => {
    if (!isBooting) return;
    const timer = window.setTimeout(() => setIsBooting(false), 1350);
    return () => window.clearTimeout(timer);
  }, [isBooting]);

  const selectPanel = (next: Panel) => {
    setPanel(next);
    setWindowMode((current) => current === "closed" || current === "minimized" ? "open" : current);
    window.dispatchEvent(new CustomEvent("sound-play", { detail: { sound: "click" } }));
  };

  const startWindowDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (windowMode !== "open" || (event.target as HTMLElement).closest("button")) return;
    const element = windowRef.current;
    const desktop = screenRef.current;
    if (!element || !desktop) return;
    event.preventDefault();
    const windowBox = element.getBoundingClientRect();
    const desktopBox = desktop.getBoundingClientRect();
    const edge = 10;
    element.setPointerCapture(event.pointerId);
    windowDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: Number(element.dataset.x || 0),
      originY: Number(element.dataset.y || 0),
      minDx: desktopBox.left + edge - windowBox.left,
      maxDx: desktopBox.right - edge - windowBox.right,
      minDy: desktopBox.top + edge - windowBox.top,
      maxDy: desktopBox.bottom - 52 - windowBox.bottom,
    };
    element.classList.add(s.windowDragging);
  };

  const moveWindow = (event: PointerEvent<HTMLDivElement>) => {
    const drag = windowDragRef.current;
    const element = windowRef.current;
    if (!drag || !element || drag.pointerId !== event.pointerId) return;
    const dx = Math.max(drag.minDx, Math.min(drag.maxDx, event.clientX - drag.startX));
    const dy = Math.max(drag.minDy, Math.min(drag.maxDy, event.clientY - drag.startY));
    const x = drag.originX + dx;
    const y = drag.originY + dy;
    element.dataset.x = String(x);
    element.dataset.y = String(y);
    element.style.setProperty("--window-x", `${x}px`);
    element.style.setProperty("--window-y", `${y}px`);
  };

  const endWindowDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = windowDragRef.current;
    const element = windowRef.current;
    if (!drag || !element || drag.pointerId !== event.pointerId) return;
    element.releasePointerCapture(event.pointerId);
    element.classList.remove(s.windowDragging);
    windowDragRef.current = null;
  };

  const startWindowResize = (direction: "right" | "bottom" | "corner") => (event: PointerEvent<HTMLSpanElement>) => {
    if (windowMode !== "open") return;
    const element = windowRef.current;
    const desktop = screenRef.current;
    if (!element || !desktop) return;
    event.preventDefault();
    event.stopPropagation();
    const windowBox = element.getBoundingClientRect();
    const desktopBox = desktop.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    windowResizeRef.current = {
      pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
      startWidth: windowBox.width, startHeight: windowBox.height,
      maxWidth: desktopBox.right - windowBox.left - 10,
      maxHeight: desktopBox.bottom - windowBox.top - 52,
      direction,
    };
    element.classList.add(s.windowResizing);
  };

  const resizeWindow = (event: PointerEvent<HTMLSpanElement>) => {
    const resize = windowResizeRef.current;
    const element = windowRef.current;
    if (!resize || !element || resize.pointerId !== event.pointerId) return;
    if (resize.direction !== "bottom") {
      element.style.width = `${Math.max(360, Math.min(resize.maxWidth, resize.startWidth + event.clientX - resize.startX))}px`;
      element.style.right = "auto";
    }
    if (resize.direction !== "right") {
      element.style.height = `${Math.max(300, Math.min(resize.maxHeight, resize.startHeight + event.clientY - resize.startY))}px`;
      element.style.bottom = "auto";
    }
  };

  const endWindowResize = (event: PointerEvent<HTMLSpanElement>) => {
    const resize = windowResizeRef.current;
    const element = windowRef.current;
    if (!resize || !element || resize.pointerId !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    element.classList.remove(s.windowResizing);
    windowResizeRef.current = null;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(section.querySelectorAll("[data-reveal]"),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: .85, stagger: .1, ease: "power3.out" });
    }, { threshold: .18 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const screen = screens[panel];

  return (
    <section ref={sectionRef} className={s.section} aria-labelledby="system-title">
      <div className={s.intro} data-reveal>
        <h2 id="system-title">A look<br /><i>inside.</i></h2>
        <p>The languages, tools, and technology I use to turn an interface into something real.</p>
      </div>

      <div className={s.computer} data-reveal>
        <div className={s.monitorLabel}><span>NIKO PERSONAL COMPUTER</span><span>MODEL ND-07</span></div>

        <div ref={screenRef} className={s.screen} data-powered={isPowered}>

          <nav className={s.desktopIcons} aria-label="Desktop applications">
            {(["languages", "tools", "stack"] as Panel[]).map((item) => (
              <button key={item} type="button" className={panel === item ? s.selected : ""} onClick={() => selectPanel(item)}>
                <span className={s.desktopIcon}><i /><i /><i /><i /></span>
                <strong>{screens[item].label}</strong>
              </button>
            ))}
          </nav>

          <div className={s.systemShortcuts}>
            <button type="button" onClick={() => setDesktopDialog("computer")}><span className={`${s.systemIcon} ${s.pcIcon}`}><i /><i /></span><strong>My Computer</strong></button>
            <button type="button" onClick={() => setDesktopDialog("projects")}><span className={`${s.systemIcon} ${s.folderIcon}`}><i /></span><strong>Projects</strong></button>
            <button type="button" onClick={() => setDesktopDialog("cv")}><span className={`${s.systemIcon} ${s.cvIcon}`}><i /></span><strong>My CV</strong></button>
          </div>

          {desktopDialog && (
            <div className={s.desktopDialog} role="dialog" aria-label={desktopDialog === "computer" ? "My Computer" : desktopDialog === "projects" ? "Projects" : "Niko's CV"}>
              <div><span>{desktopDialog === "computer" ? "my-computer.exe" : desktopDialog === "projects" ? "projects.dir" : "niko-dima-cv.pdf"}</span><button type="button" aria-label="Close window" onClick={() => setDesktopDialog(null)}>×</button></div>
              {desktopDialog === "computer" && <p><b>LOCAL DISK (N:)</b><span>Creative development · UI/UX · Motion</span></p>}
              {desktopDialog === "projects" && <p><b>SELECTED WORK</b><span>Melograph · Aria · More experiments</span><a href="#projects">Open projects</a></p>}
              {desktopDialog === "cv" && <p><b>NIKO DIMA · CV</b><span>Experience, skills, education, and contact details.</span><span className={s.cvActions}><a href="/Niko-Dima-CV.pdf" target="_blank" rel="noreferrer">Open CV</a><a href="/Niko-Dima-CV.pdf" download="Niko-Dima-CV.pdf">Download CV</a></span></p>}
            </div>
          )}

          <div ref={windowRef} className={s.appWindow} key={panel} data-mode={windowMode}>
            <div className={s.windowBar} onPointerDown={startWindowDrag} onPointerMove={moveWindow} onPointerUp={endWindowDrag} onPointerCancel={endWindowDrag}>
              <span><i /> {screen.label.toLowerCase()}.app</span>
              <div className={s.windowActions}>
                <button type="button" aria-label="Minimize window" onClick={() => setWindowMode("minimized")}>−</button>
                <button type="button" aria-label={windowMode === "maximized" ? "Restore window" : "Maximize window"} onClick={() => setWindowMode(windowMode === "maximized" ? "open" : "maximized")}>{windowMode === "maximized" ? "❐" : "□"}</button>
                <button type="button" aria-label="Close window" onClick={() => setWindowMode("closed")}>×</button>
              </div>
            </div>
            <div className={s.windowBody}>
              <aside className={s.explorerSide}>
                <strong>QUICK ACCESS</strong><span>⌂ Desktop</span><span>☆ Favorites</span><span>▣ Projects</span>
                <strong>THIS COMPUTER</strong><span className={s.sideActive}>▸ {screen.label}</span><span>▱ Experiments</span>
              </aside>
              <div className={s.explorerMain}>
                <div className={s.screenTitle}>
                  <div><span>{screen.index} / DIRECTORY</span><h3>{screen.label}</h3></div>
                  <p>{screen.note}</p>
                </div>
                <div className={s.itemGrid}>
                  {screen.items.map((item, index) => (
                    <article key={item.name}>
                      <span className={s.fileIcon} aria-hidden="true"><svg viewBox="0 0 24 24"><path d={item.icon.path} /></svg></span>
                      <div className={s.fileCopy}><strong>{item.name}</strong><p>{item.detail}</p></div>
                      <b>{item.tag}</b><small>{String(index + 1).padStart(2, "0")}</small>
                    </article>
                  ))}
                </div>
              </div>
            </div>
            <span className={`${s.resizeHandle} ${s.resizeRight}`} onPointerDown={startWindowResize("right")} onPointerMove={resizeWindow} onPointerUp={endWindowResize} onPointerCancel={endWindowResize} />
            <span className={`${s.resizeHandle} ${s.resizeBottom}`} onPointerDown={startWindowResize("bottom")} onPointerMove={resizeWindow} onPointerUp={endWindowResize} onPointerCancel={endWindowResize} />
            <span className={`${s.resizeHandle} ${s.resizeCorner}`} onPointerDown={startWindowResize("corner")} onPointerMove={resizeWindow} onPointerUp={endWindowResize} onPointerCancel={endWindowResize} />
          </div>

          <div className={s.taskbar}>
            <button type="button" className={s.startButton}><i /><span>start</span></button>
            <button type="button" className={s.openApp} onClick={() => setWindowMode("open")}>{screen.label}.APP</button>
            <div className={s.systemTray}><span className={s.trayIcons} aria-hidden="true"><Signal /><Volume2 /><BatteryFull /></span><span>ONLINE</span><time>02:07</time></div>
          </div>
          {isBooting && <div className={s.bootScreen} role="status"><strong>NIKO OS</strong><span>Loading desktop</span><i /></div>}
        </div>

        <div className={s.monitorControls}>
          <button type="button" className={s.powerButton} aria-label={isPowered ? "Turn computer off" : "Turn computer on"} aria-pressed={isPowered} onClick={togglePower}>
            <span aria-hidden="true" /><b>{isPowered ? "ON" : "OFF"}</b>
          </button>
          <div className={s.driveSlot}><span>{screen.label} DISK LOADED</span></div>
        </div>
      </div>

      <footer className={s.footer} data-reveal>
        <span>NO MYSTERY</span><strong>Just good tools used with intention.</strong>
      </footer>
    </section>
  );
}
