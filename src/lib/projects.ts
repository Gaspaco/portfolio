export interface Project {
  slug: string;
  title: string;
  category: string;
  year: string;
  src: string;
  caseHero?: string;
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
    src: "/screenshots/aria-screenshot.png",
    images: ["/screenshots/aria-screenshot.png", "/pexels-agk42-2816903.jpg"],
    liveUrl: "https://health-app-xi-five.vercel.app/",
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
    src: "/project-melograph-red.png",
    caseHero: "/case-melograph-hero.png",
    images: ["/project-melograph-red.png", "/project-melograph-live.png"],
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
    slug: "dimabouw",
    title: "Dima Bouw",
    category: "Construction",
    year: "2026",
    src: "/dima-bouw.png",
    images: ["/dima-bouw.png"],
    liveUrl: "https://www.dimabouw.site/",
    description: "A professional web presence for a construction company.",
    longDescription:
      "Dima Bouw needed a clean, trustworthy website that showcases their construction projects and services. The site balances visual impact with practical information — visitors can browse completed projects, understand service offerings, and get in touch quickly. Built for speed and clarity on every device.",
    role: "Frontend Developer",
    duration: "1 Month",
    technologies: ["Next.js", "Tailwind CSS", "GSAP"],
    challenge:
      "Construction company websites often feel dated or generic. The challenge was creating something modern and visually compelling while keeping the content accessible and the navigation straightforward for clients who just want to see past work and make contact.",
    solution:
      "A streamlined Next.js site with Tailwind CSS for rapid, consistent styling. GSAP adds subtle motion that elevates the experience without slowing it down. The layout prioritizes project imagery and clear calls to action, with responsive design that works seamlessly on mobile devices used on job sites.",
    process: [
      { step: "Discovery", detail: "Understood the company's services, target clients, and the impression they wanted to make online." },
      { step: "Design", detail: "Clean layout with strong project photography, clear typography, and a professional color palette." },
      { step: "Build", detail: "Next.js for fast loading and SEO. Tailwind for consistent spacing and responsive breakpoints." },
      { step: "Launch", detail: "Optimised images, tested across devices, and deployed with a focus on Core Web Vitals." },
    ],
    results: [
      "Professional online presence for the construction company",
      "Fast load times with optimised imagery",
      "Responsive design that works on mobile devices at job sites",
    ],
    quote: "A builder's website should feel as solid as what they build.",
  },
  {
    slug: "melostudio",
    title: "MeloStudio",
    category: "Creative Platform",
    year: "2026",
    src: "/melostudio.png",
    images: ["/melostudio.png"],
    liveUrl: "https://melostudio.nl/",
    description: "A creative platform for music production and collaboration.",
    longDescription:
      "MeloStudio is a platform built for music creators who want a seamless space to produce, share, and collaborate. The interface is designed to stay out of the way — dark, focused, and responsive. Every interaction is tuned for creative flow, from project navigation to real-time collaboration features.",
    role: "Full-Stack Developer",
    duration: "2 Months",
    technologies: ["Next.js", "Tailwind CSS", "Supabase", "GSAP"],
    challenge:
      "Creative tools often sacrifice usability for feature density. The challenge was building a platform that feels minimal and focused while still offering the depth creators need — project management, sharing, and collaboration without the clutter.",
    solution:
      "A Next.js frontend with Tailwind CSS for a clean, dark-themed interface. Supabase handles authentication and real-time data sync. GSAP powers smooth transitions between views, keeping the experience fluid. The architecture is modular so new creative tools can be added without disrupting the core workflow.",
    process: [
      { step: "Research", detail: "Studied how producers actually work — late nights, flow states, minimal tolerance for friction." },
      { step: "Design", detail: "Dark-first UI with high contrast accents. Every screen serves one purpose. No sidebars, no clutter." },
      { step: "Build", detail: "Next.js App Router with Supabase realtime. Tailwind for rapid iteration on the design system." },
      { step: "Ship", detail: "Deployed with edge functions for low-latency access. Tested with real creators for feedback loops." },
    ],
    results: [
      "Clean dark-themed interface optimised for creative flow",
      "Real-time collaboration powered by Supabase",
      "Modular architecture ready for new creative tools",
    ],
    quote: "The best creative tool is the one you forget you're using.",
  },
];
