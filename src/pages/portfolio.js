import { initPortfolioStack } from '../components/PortfolioStack.js';
import { initHotjar } from '../analytics/hotjar.js';
import { initSmoothScroll } from '../core/smooth-scroll.js';

export default function initPortfolio() {
    initPortfolioStack();
    initHotjar();
    initSmoothScroll({ desktopOnly: true });
}

initPortfolio();
