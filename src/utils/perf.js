export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function shouldAutoplayMotion() {
  if (prefersReducedMotion()) return false;
  if (window.matchMedia("(max-width: 768px)").matches) return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  return true;
}
