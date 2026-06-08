export interface Project {
  slug: string;
  title: string;
  category: string;
  year: string;
  src: string;
  images: string[];
  liveUrl: string;
  description: string;
  longDescription: string;
  role: string;
  duration: string;
  technologies: string[];
  challenge: string;
  solution: string;
  process: { step: string; detail: string }[];
  results: string[];
  quote: string;
}

export const projects: Project[] = [
  {
    slug: "aria",
    title: "Aria",
    category: "Fitness App",
    year: "2025",
    src: "/aria.png",
    images: ["/aria.png", "/pexels-agk42-2816903.jpg"],
    liveUrl: "https://aria-health.netlify.app/",
    description: "A revolutionary approach to personal fitness tracking.",
    longDescription:
      "Aria redefines how people interact with their fitness data. Instead of overwhelming dashboards and endless metrics, Aria focuses on what matters — building habits that stick. The app provides a clean, distraction-free experience that adapts to each user's pace and goals.",
    role: "Full-Stack Developer",
    duration: "3 Months",
    technologies: ["React Native", "Supabase", "Reanimated", "Expo"],
    challenge:
      "Most fitness apps overload users with data they never act on. The challenge was creating an interface that feels personal and motivating rather than clinical. Performance on lower-end Android devices was another constraint — animations had to stay buttery at 60fps on hardware with limited GPU.",
    solution:
      "I built a gesture-driven interface with React Native Reanimated, where every interaction gives tactile feedback. The backend runs on Supabase with row-level security for user data. A custom animation system batches UI updates to maintain frame rates across devices, and the onboarding flow adapts based on user responses.",
    process: [
      { step: "Research", detail: "Interviewed 12 users who had abandoned fitness apps within 30 days. The common thread: too many numbers, not enough guidance." },
      { step: "Design", detail: "Stripped the UI to a single daily action. Every screen answers one question: what should I do right now?" },
      { step: "Build", detail: "Reanimated 3 for gesture physics, Supabase realtime for live sync across devices, Expo for zero-friction deployment." },
      { step: "Optimise", detail: "Profiled on a 2019 Android device. Batched state updates and moved animations off the JS thread entirely." },
    ],
    results: [
      "Smooth 60fps animations across iOS and Android",
      "Sub-200ms API response times with Supabase edge functions",
      "Adaptive onboarding flow that reduces drop-off",
    ],
    quote: "It's not about tracking everything. It's about doing the one thing that matters today.",
  },
  {
    slug: "melograph",
    title: "Melograph",
    category: "Creative Studio",
    year: "2026",
    src: "/image copy 2.png",
    images: ["/image copy 2.png", "/image copy.png"],
    liveUrl: "https://melographstudio.online/",
    description: "High-performance digital experiences and motion design.",
    longDescription:
      "Melograph Studio needed a web presence that matched the energy of their creative output. The site serves as both a portfolio and a statement piece — every scroll, every transition, every hover is intentional. It had to load fast, feel premium, and leave an impression.",
    role: "Frontend Developer & Designer",
    duration: "2 Months",
    technologies: ["Next.js", "GSAP", "Sass", "Neon"],
    challenge:
      "The studio wanted a site that felt like a reel — cinematic and fluid — but also functioned as a practical portfolio clients could browse. Balancing heavy motion design with performance and SEO was the core tension. The site also needed a CMS-backed project feed that non-technical team members could update.",
    solution:
      "I used Next.js for SSR and SEO, with GSAP ScrollTrigger for scroll-driven animations that only activate in viewport. A Neon serverless Postgres database powers the project feed. Critical CSS is inlined, fonts are subset, and images use blur-up placeholders. Every animation is GPU-composited — no layout thrashing.",
    process: [
      { step: "Direction", detail: "Set the visual language: dark, editorial, motion-forward. Every interaction references film — cuts, reveals, dissolves." },
      { step: "Architecture", detail: "Next.js App Router with SSR for SEO. Project data lives in Neon — editable without touching code." },
      { step: "Motion", detail: "GSAP timeline for page-load choreography. ScrollTrigger scrubs each section in viewport only — no wasted frames." },
      { step: "Polish", detail: "Lighthouse audits after every major change. Subset fonts, defer non-critical JS, preload hero image." },
    ],
    results: [
      "90+ Lighthouse performance score",
      "Scroll-driven cinematic transitions at 60fps",
      "Self-service project management via Neon backend",
    ],
    quote: "A studio's website is its handshake. It has to say everything before a single word is read.",
  },
  {
    slug: "museum",
    title: "Museum",
    category: "Web Design",
    year: "2025",
    src: "/museum.png",
    images: ["/museum.png", "/precission.jpg"],
    liveUrl: "https://museuum.netlify.app/",
    description: "A digital archive of modern art and culture.",
    longDescription:
      "Museum is an experimental web experience that reimagines how art collections are browsed online. Instead of static grids, artworks are presented through spatial navigation — scroll, drag, and explore pieces in a virtual gallery. The design draws from brutalist architecture and editorial print layouts.",
    role: "Creative Developer",
    duration: "6 Weeks",
    technologies: ["React", "GSAP", "Locomotive Scroll", "WebGL"],
    challenge:
      "Traditional gallery websites treat art as thumbnails in a grid. The goal was to create a sense of physical space and discovery, where each artwork feels like a deliberate encounter rather than an item in a list. WebGL integration needed to feel seamless, not gimmicky, and the experience had to degrade gracefully on mobile.",
    solution:
      "Locomotive Scroll provides the smooth, inertia-based scrolling that gives the site its physical weight. GSAP handles parallax and reveal animations tied to scroll position. A lightweight WebGL layer adds depth to featured pieces without blocking the main thread. On mobile, the experience simplifies to a curated vertical flow that preserves the editorial feel.",
    process: [
      { step: "Concept", detail: "Treated the browser as a gallery room. Scrolling is walking. Each artwork deserves space, not a thumbnail." },
      { step: "Spatial Layout", detail: "Abandoned the grid. Artworks are offset, overlapping, breathing — arranged like a physical curation." },
      { step: "WebGL", detail: "A subtle distortion shader on featured pieces. Mouse movement warps the image slightly — like light on canvas." },
      { step: "Mobile", detail: "Removed WebGL and Locomotive on touch devices. Clean vertical scroll, full-bleed images, editorial typography." },
    ],
    results: [
      "Spatial navigation with Locomotive Scroll inertia",
      "WebGL distortion effects on featured artworks",
      "Graceful mobile fallback with curated vertical layout",
    ],
    quote: "Art deserves more than a grid. It deserves space, weight, and a reason to stop.",
  },
];
