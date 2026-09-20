import { initPortfolioStack } from '../components/PortfolioStack.js';
import { initHotjar } from '../analytics/hotjar.js';
import { initSmoothScroll } from '../core/smooth-scroll.js';
import { initPageTransitions } from '../core/transitions.js';

export default function initPortfolio() {
    initPageTransitions();
    initPortfolioStack();
    initHotjar();
    initSmoothScroll({ desktopOnly: true });
}

initPortfolio();
