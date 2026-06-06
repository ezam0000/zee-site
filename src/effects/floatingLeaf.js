import { prefersReducedMotion } from '../utils/perf.js';

export function initFloatingLeaf(lenis) {
    const leaf = document.querySelector('.floating-leaf');
    if (!leaf || prefersReducedMotion()) return;

    let scrollY = lenis?.scroll ?? window.scrollY ?? 0;
    let frameId = null;

    const update = () => {
        const driftX = Math.sin(scrollY * 0.0018) * 14 + Math.cos(scrollY * 0.0009) * 7;
        const driftY = scrollY * 0.06 + Math.sin(scrollY * 0.0012) * 8;
        const rotate = -18 + Math.sin(scrollY * 0.0015) * 5 + scrollY * 0.008;

        leaf.style.transform = `translate3d(${driftX}px, ${driftY}px, 0) rotate(${rotate}deg)`;
        frameId = null;
    };

    const scheduleUpdate = () => {
        if (frameId !== null) return;
        frameId = requestAnimationFrame(update);
    };

    if (lenis) {
        lenis.on('scroll', ({ scroll }) => {
            scrollY = scroll;
            scheduleUpdate();
        });
    } else {
        window.addEventListener(
            'scroll',
            () => {
                scrollY = window.scrollY;
                scheduleUpdate();
            },
            { passive: true }
        );
    }

    scheduleUpdate();
}
