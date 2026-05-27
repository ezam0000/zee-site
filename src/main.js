import { JellySwitch } from './components/JellySwitch.js';
import { initHotjar } from './analytics/hotjar.js';
import { env } from './app/env.js';
import { config } from './app/config.js';
import { handleFormSubmission } from './utils/formHandler.js';
import { initSelectedWork } from './components/SelectedWork.js';
import {
    init as initHeroLiquid,
    setBackgroundImage as setHeroLiquidBackground,
} from './effects/heroLiquid.js';
import { prefersReducedMotion } from './utils/perf.js';

function getPageBackgroundColor() {
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

// Initialize Jelly Switch (WebGPU soft-body toggle) - Dark Mode Controller
const jellySwitchCanvas = document.querySelector('#jelly-switch-canvas');
if (jellySwitchCanvas) {
    new JellySwitch(jellySwitchCanvas, {
        enableAudio: false,
        initialState: savedDarkMode,
        accentColor: [0.91, 0.72, 0.43], // Warm gold for night mode accent
        onToggle: (isDarkMode) => {
            // Toggle dark mode class on body
            document.body.classList.toggle('dark-mode', isDarkMode);
            
            // Save preference to localStorage
            localStorage.setItem('darkMode', isDarkMode);
            if (heroLiquidActive) {
                syncHeroLiquidBackground();
            }
            
            console.log('Dark mode:', isDarkMode ? 'ON' : 'OFF');
        }
    });
}

// Initialize Analytics
initHotjar();

// Initialize Smooth Scroll
import('@studio-freight/lenis').then((module) => {
    const Lenis = module.default || module.Lenis;
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
        lerp: 0.08
    });
    
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
});

// Initialize Selected Work
initSelectedWork();

// Initialize Contact Form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    handleFormSubmission(contactForm);
}
