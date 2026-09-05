"use client";

import { useCallback, useState } from "react";
import LoadingAnimations from "@/components/ui/LoadingAnimations";

const LOADER_SESSION_KEY = "niko-loader-seen";

export default function LoadingGate() {
  const [isLoading, setIsLoading] = useState(
    () => typeof window === "undefined" || window.sessionStorage.getItem(LOADER_SESSION_KEY) !== "true",
  );

  const handleLoadComplete = useCallback(() => {
    window.sessionStorage.setItem(LOADER_SESSION_KEY, "true");
    document.documentElement.classList.add("loader-seen");
    setIsLoading(false);
  }, []);

  return isLoading ? <LoadingAnimations onComplete={handleLoadComplete} /> : null;
}
