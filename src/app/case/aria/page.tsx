"use client";

import CaseStudy from "@/components/CaseStudy";
import { projects } from "@/lib/projects";

export default function AriaCase() {
  const project = projects.find((p) => p.slug === "aria")!;
  const next = projects.find((p) => p.slug === "melograph")!;
  return <CaseStudy project={project} nextProject={next} />;
}
