"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import IntroStatement from "@/components/sections/IntroStatement";
import CraftBuild from "@/components/sections/CraftBuild";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import LoadingAnimations from "@/components/ui/LoadingAnimations";
import { useCallback, useState } from "react";
import s from './page.module.scss';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = useCallback(() => {
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
