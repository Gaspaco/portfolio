"use client";

import CaseStudy from "@/components/CaseStudy";
import { projects } from "@/lib/projects";

export default function DimaBouwCase() {
  const project = projects.find((p) => p.slug === "dimabouw")!;
  const next = projects.find((p) => p.slug === "melostudio")!;
  return <CaseStudy project={project} nextProject={next} />;
}
