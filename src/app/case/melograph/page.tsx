"use client";

import CaseStudy from "@/components/features/CaseStudy";
import { projects } from "@/lib/projects";

export default function MelographCase() {
  const project = projects.find((p) => p.slug === "melograph")!;
  const next = projects.find((p) => p.slug === "dimabouw")!;
  return <CaseStudy project={project} nextProject={next} />;
}
