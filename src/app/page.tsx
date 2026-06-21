"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import CraftBuild from "@/components/sections/CraftBuild";
import Projects from "@/components/sections/Projects";
import LoadingAnimations from "@/components/ui/LoadingAnimations";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { useEffect, useState } from "react";
import s from './page.module.scss';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("hasLoaded");
    if (!hasLoaded) {
      setIsLoading(true);
    }
  }, []);

  const handleLoadComplete = () => {
    sessionStorage.setItem("hasLoaded", "1");
    setIsLoading(false);
  };

  return (
    <SmoothScroll>
      <main className={s.main}>
        {isLoading && <LoadingAnimations onComplete={handleLoadComplete} />}

        <Navbar />
        <Hero />
        <CraftBuild />
        <Projects />
      </main>
    </SmoothScroll>
  );
}
