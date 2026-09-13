import { initHotjar } from './analytics/hotjar.js';
import { config } from './app/config.js';
import { initSmoothScroll } from './core/smooth-scroll.js';
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

function syncHeroLiquidBackground() {
    setHeroLiquidBackground(getHeroLiquidImageUrl(), getPageBackgroundColor());
}

const savedDarkMode = localStorage.getItem('darkMode') !== 'false';
document.body.classList.toggle('dark-mode', savedDarkMode);

let heroLiquidActive = false;
const heroLiquidContainer = document.querySelector('#hero-liquid');
function bootHeroLiquid() {
    if (!heroLiquidContainer) return;
    if (prefersReducedMotion()) {
        console.info('HeroLiquid: off (Reduce Motion is enabled in system settings)');
        return;
    }
    heroLiquidActive = initHeroLiquid(
        heroLiquidContainer,
        getHeroLiquidImageUrl()
    );
}
requestAnimationFrame(() => requestAnimationFrame(bootHeroLiquid));

// Initialize theme switch
const themeToggle = document.querySelector('#theme-toggle');
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

function bootScrollEffects() {
    initHeroHeadlines();
    initSmoothScroll({ desktopOnly: true }).then((lenis) => {
        initFloatingLeaf(lenis);
    });
}

bootScrollEffects();
