import { initHotjar } from './analytics/hotjar.js';
import { config } from './app/config.js';
import { initSmoothScroll } from './core/smooth-scroll.js';
import { initPageTransitions } from './core/transitions.js';
import {
    init as initHeroLiquid,
    setBackgroundImage as setHeroLiquidBackground,
} from './effects/heroLiquid.js';
import { initFloatingLeaf } from './effects/floatingLeaf.js';
import { initHeroHeadlines } from './effects/heroHeadlines.js';
import { prefersReducedMotion } from './utils/perf.js';

function getPageBackgroundColor() {
    if (!document.body.classList.contains('dark-mode')) {
        return '#FFFFFF';
    }
    return getComputedStyle(document.body).getPropertyValue('--c-bg').trim();
}

function getHeroLiquidImageUrl() {
    const { heroLiquidBackgrounds } = config;
    return document.body.classList.contains('dark-mode')
        ? heroLiquidBackgrounds.dark
        : heroLiquidBackgrounds.light;
}

function applyHeroLiquidFallback(imageUrl) {
    if (!heroLiquidContainer) return;
    heroLiquidContainer.style.backgroundImage = `url("${imageUrl}")`;
    heroLiquidContainer.style.backgroundSize = 'cover';
    heroLiquidContainer.style.backgroundPosition = 'center';
    heroLiquidContainer.style.backgroundRepeat = 'no-repeat';
}

function syncHeroLiquidBackground() {
    const imageUrl = getHeroLiquidImageUrl();
    applyHeroLiquidFallback(imageUrl);
    setHeroLiquidBackground(imageUrl, getPageBackgroundColor());
}

// Light by default. Dark preference is ignored while the theme toggle is hidden.
const themeToggle = document.querySelector('#theme-toggle');
const themeToggleVisible = Boolean(
    themeToggle && !themeToggle.closest('[hidden], .theme-switch-container[hidden]')
);
const savedDarkMode = themeToggleVisible && localStorage.getItem('darkMode') === 'true';
document.body.classList.toggle('dark-mode', savedDarkMode);

let heroLiquidActive = false;
const heroLiquidContainer = document.querySelector('#hero-liquid');
function bootHeroLiquid() {
    if (!heroLiquidContainer) return;

    const imageUrl = getHeroLiquidImageUrl();
    applyHeroLiquidFallback(imageUrl);

    // Still show the photo on mobile; only skip the WebGL water for Reduce Motion.
    if (prefersReducedMotion()) {
        console.info('HeroLiquid: motion off (Reduce Motion is enabled in system settings)');
        return;
    }
    heroLiquidActive = initHeroLiquid(heroLiquidContainer, imageUrl);
}
requestAnimationFrame(() => requestAnimationFrame(bootHeroLiquid));

// Initialize theme switch (kept for when the control is shown again)
if (themeToggle) {
    themeToggle.checked = !savedDarkMode;
    themeToggle.addEventListener('change', () => {
        const isDarkMode = !themeToggle.checked;
        document.body.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem('darkMode', isDarkMode);
        if (heroLiquidActive) {
            syncHeroLiquidBackground();
        }
    });
}

// Initialize Analytics
initHotjar();
initPageTransitions();

function bootScrollEffects() {
    initHeroHeadlines();
    initSmoothScroll({ desktopOnly: true }).then((lenis) => {
        initFloatingLeaf(lenis);
    });
}

bootScrollEffects();
