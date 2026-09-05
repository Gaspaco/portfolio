import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import IntroStatement from "@/components/sections/IntroStatement";
import CraftBuild from "@/components/sections/CraftBuild";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import LoadingGate from "./LoadingGate";
import s from './page.module.scss';

export default function Home() {
  return (
    <main id="top" className={s.main}>
      <LoadingGate />

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
