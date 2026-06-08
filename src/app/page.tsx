"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Footer from "@/components/Footer";
import LoadingAnimations from "@/components/LoadingAnimations";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Marquee from "@/components/Marquee";
import { useEffect, useState } from "react";

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
      <main className="min-h-screen w-full flex flex-col cursor-none">
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