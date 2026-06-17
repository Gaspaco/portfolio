"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import About from "@/components/sections/About";
import Footer from "@/components/layout/Footer";
import LoadingAnimations from "@/components/ui/LoadingAnimations";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Marquee from "@/components/sections/Marquee";
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
        <CustomCursor />
        {isLoading && <LoadingAnimations onComplete={handleLoadComplete} />}

        <Navbar />
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <Footer />
      </main>
    </SmoothScroll>
  );
}