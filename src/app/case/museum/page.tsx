"use client";

import CaseStudy from "@/components/CaseStudy";
import { projects } from "@/lib/projects";

export default function MuseumCase() {
  const project = projects.find((p) => p.slug === "museum")!;
  const next = projects.find((p) => p.slug === "aria")!;
  return <CaseStudy project={project} nextProject={next} />;
}
