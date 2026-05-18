import { prefersReducedMotion } from "../utils/perf.js";

export function initSmoothScroll() {
  if (prefersReducedMotion()) {
    return null;
  }

  // Lazy load Lenis to avoid blocking
  import("@studio-freight/lenis").then((module) => {
    const Lenis = module.default || module.Lenis || module;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }).catch(() => {
    console.warn("Lenis not available");
  });

  return null;
}

