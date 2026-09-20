import { initHotjar } from '../analytics/hotjar.js';
import { initSmoothScroll } from '../core/smooth-scroll.js';
import { initPageTransitions } from '../core/transitions.js';
import { revealImage } from '../utils/images.js';

export default function initAbout() {
    initPageTransitions();
    initHotjar();
    initSmoothScroll({ desktopOnly: true });
    const headshot = document.querySelector('.about-headshot img');
    if (headshot) revealImage(headshot);
}

initAbout();
