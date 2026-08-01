"use client";

import CaseStudy from "@/components/features/CaseStudy";
import { projects } from "@/lib/projects";

export default function MeloStudioCase() {
  const project = projects.find((p) => p.slug === "melostudio")!;
  const next = projects.find((p) => p.slug === "aria")!;
  return <CaseStudy project={project} nextProject={next} />;
}
