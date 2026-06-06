import { initHotjar } from '../analytics/hotjar.js';

function initSmoothScroll() {
    import('@studio-freight/lenis').then((module) => {
        const Lenis = module.default || module.Lenis;
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
            lerp: 0.08,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    });
}

export default function initAbout() {
    initHotjar();
    initSmoothScroll();
}

initAbout();
