import { prefersReducedMotion } from "../utils/perf.js";

const DEFAULT_OPTIONS = {
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
  lerp: 0.08,
};

let lenisInstance = null;
let lenisPromise = null;

/**
 * Lazy-load Lenis and start its RAF loop.
 * @param {{ desktopOnly?: boolean }} [options]
 * @returns {Promise<object | null>} Lenis instance, or null when skipped/unavailable
 */
export function initSmoothScroll({ desktopOnly = false } = {}) {
  if (prefersReducedMotion()) {
    return Promise.resolve(null);
  }

  if (desktopOnly && window.matchMedia("(max-width: 768px)").matches) {
    return Promise.resolve(null);
  }

  if (lenisPromise) {
    return lenisPromise;
  }

  lenisPromise = import("lenis")
    .then((module) => {
      const Lenis = module.default || module.Lenis || module;
      const lenis = new Lenis({ ...DEFAULT_OPTIONS });
      lenisInstance = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      return lenis;
    })
    .catch(() => {
      console.warn("Lenis not available");
      lenisPromise = null;
      return null;
    });

  return lenisPromise;
}

export function stopSmoothScroll() {
  lenisInstance?.stop();
}

export function startSmoothScroll() {
  lenisInstance?.start();
}
