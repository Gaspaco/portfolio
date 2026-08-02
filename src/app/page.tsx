"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import IntroStatement from "@/components/sections/IntroStatement";
import CraftBuild from "@/components/sections/CraftBuild";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import LoadingAnimations from "@/components/ui/LoadingAnimations";
import { useCallback, useLayoutEffect, useState } from "react";
import s from './page.module.scss';

const LOADER_SESSION_KEY = "niko-loader-seen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    if (window.sessionStorage.getItem(LOADER_SESSION_KEY) === "true") {
      setIsLoading(false);
    }
  }, []);

  const handleLoadComplete = useCallback(() => {
    window.sessionStorage.setItem(LOADER_SESSION_KEY, "true");
    document.documentElement.classList.add("loader-seen");
    setIsLoading(false);
  }, []);

  return (
    <main id="top" className={s.main}>
      {isLoading && <LoadingAnimations onComplete={handleLoadComplete} />}

      <Navbar />
      <Hero />
      <IntroStatement />
      <CraftBuild />
      <About />
      <Projects />
      <Contact />
    </main>
  );
}
