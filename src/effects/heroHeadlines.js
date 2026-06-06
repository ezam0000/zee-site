import { prefersReducedMotion } from '../utils/perf.js';

function easeInOutQuart(value) {
    return value < 0.5
        ? 8 * value * value * value * value
        : 1 - Math.pow(-2 * value + 2, 4) / 2;
}

const BASE_HOLD_MS = 3800;
const BASE_FADE_MS = 1800;
const MIN_HOLD_MS = 220;
const MIN_FADE_MS = 120;
const SCROLL_VELOCITY_MAX = 14;

export function initHeroHeadlines(lenis) {
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
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let rafId = null;

    const getSpeedBoost = () => 1 + scrollVelocity;

    const getTimings = () => {
        const speedBoost = getSpeedBoost();
        return {
            holdMs: Math.max(MIN_HOLD_MS, BASE_HOLD_MS / speedBoost),
            fadeMs: Math.max(MIN_FADE_MS, BASE_FADE_MS / speedBoost),
        };
    };

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

    const registerScrollActivity = (delta) => {
        if (delta <= 0) return;
        scrollVelocity = Math.min(
            SCROLL_VELOCITY_MAX,
            scrollVelocity + delta * 0.02
        );
    };

    const onScroll = () => {
        const nextScrollY = window.scrollY;
        registerScrollActivity(Math.abs(nextScrollY - lastScrollY));
        lastScrollY = nextScrollY;
    };

    const onWheel = (event) => {
        registerScrollActivity(Math.abs(event.deltaY));
    };

    const tick = (timestamp) => {
        if (!tick.lastTimestamp) {
            tick.lastTimestamp = timestamp;
        }

        const delta = Math.min(timestamp - tick.lastTimestamp, 48);
        tick.lastTimestamp = timestamp;

        scrollVelocity = Math.max(0, scrollVelocity - delta * 0.0045);

        const { holdMs, fadeMs } = getTimings();
        phaseElapsed += delta;

        if (phase === 'hold') {
            showHeadline(activeIndex);

            if (phaseElapsed >= holdMs) {
                phase = 'fade';
                phaseElapsed = 0;
            }
        } else {
            const nextIndex = (activeIndex + 1) % headlines.length;
            const blend = Math.min(phaseElapsed / fadeMs, 1);

            applyOpacities(activeIndex, nextIndex, blend);

            if (blend >= 1) {
                activeIndex = nextIndex;
                phase = 'hold';
                phaseElapsed = 0;
            }
        }

        rafId = requestAnimationFrame(tick);
    };

    if (lenis) {
        lenis.on('scroll', onScroll);
    } else {
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });

    showHeadline(activeIndex);
    rafId = requestAnimationFrame(tick);

    return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('touchmove', onScroll);
        if (!lenis) window.removeEventListener('scroll', onScroll);
    };
}
