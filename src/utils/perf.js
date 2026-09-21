export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** @deprecated Prefer prefersReducedMotion — kept for callers that only need reduce-motion. */
export function shouldAutoplayMotion() {
  return !prefersReducedMotion();
}
