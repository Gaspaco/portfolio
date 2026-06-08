"use client";

import CaseStudy from "@/components/CaseStudy";
import { projects } from "@/lib/projects";

export default function MelographCase() {
  const project = projects.find((p) => p.slug === "melograph")!;
  const next = projects.find((p) => p.slug === "museum")!;
  return <CaseStudy project={project} nextProject={next} />;
}
