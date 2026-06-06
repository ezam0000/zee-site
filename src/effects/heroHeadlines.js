import { prefersReducedMotion } from '../utils/perf.js';

function easeInOutQuart(value) {
    return value < 0.5
        ? 8 * value * value * value * value
        : 1 - Math.pow(-2 * value + 2, 4) / 2;
}

const HOLD_MS = 3800;
const FADE_MS = 1800;

export function initHeroHeadlines() {
    const headlines = [...document.querySelectorAll('.hero-headlines .headline__word')];
    if (!headlines.length) return;

    if (prefersReducedMotion()) {
        headlines.forEach((headline, index) => {
            headline.style.opacity = index === 0 ? '1' : '0';
            headline.style.pointerEvents = index === 0 ? 'auto' : 'none';
            headline.classList.toggle('is-settled', index === 0);
        });
        return;
    }

    let activeIndex = 0;
    let phase = 'hold';
    let phaseElapsed = 0;
    let rafId = null;

    const applyOpacities = (fromIndex, toIndex, blend) => {
        const eased = easeInOutQuart(blend);

        headlines.forEach((headline, index) => {
            let opacity = 0;

            if (index === fromIndex) {
                opacity = 1 - eased;
            } else if (index === toIndex) {
                opacity = eased;
            }

            headline.style.opacity = String(opacity);
            headline.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
            headline.classList.remove('is-settled');
        });
    };

    const showHeadline = (index) => {
        headlines.forEach((headline, i) => {
            const visible = i === index;
            headline.style.opacity = visible ? '1' : '0';
            headline.style.pointerEvents = visible ? 'auto' : 'none';
            headline.classList.toggle('is-settled', visible);
        });
    };

    const tick = (timestamp) => {
        if (!tick.lastTimestamp) {
            tick.lastTimestamp = timestamp;
        }

        const delta = Math.min(timestamp - tick.lastTimestamp, 48);
        tick.lastTimestamp = timestamp;
        phaseElapsed += delta;

        if (phase === 'hold') {
            showHeadline(activeIndex);

            if (phaseElapsed >= HOLD_MS) {
                phase = 'fade';
                phaseElapsed = 0;
            }
        } else {
            const nextIndex = (activeIndex + 1) % headlines.length;
            const blend = Math.min(phaseElapsed / FADE_MS, 1);

            applyOpacities(activeIndex, nextIndex, blend);

            if (blend >= 1) {
                activeIndex = nextIndex;
                phase = 'hold';
                phaseElapsed = 0;
            }
        }

        rafId = requestAnimationFrame(tick);
    };

    showHeadline(activeIndex);
    rafId = requestAnimationFrame(tick);

    return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
    };
}
