import { startSmoothScroll, stopSmoothScroll } from '../core/smooth-scroll.js';
import { applyResponsiveImage } from '../utils/images.js';

const GALLERY_SIZES = '(max-width: 900px) 100vw, 55vw';

let modalRoot = null;
let activeProject = null;
let previousFocus = null;
let getProjectBySlug = () => null;
let defaultTitle = '';
let historyBound = false;

function getGalleryImages(project) {
    const images = project.gallery ?? (project.cover ? [project.cover] : []);
    return images.filter(Boolean);
}

function locationSlug() {
    const raw = window.location.hash.replace(/^#/, '');
    if (!raw) return '';
    try {
        return decodeURIComponent(raw).toLowerCase();
    } catch {
        return raw.toLowerCase();
    }
}

function writeProjectUrl(slug) {
    const nextHash = slug ? `#${slug}` : '';
    const currentHash = window.location.hash === '#' ? '' : window.location.hash;
    if (currentHash === nextHash) return;
    const url = `${window.location.pathname}${window.location.search}${nextHash}`;
    history.pushState({ portfolioSlug: slug || null }, '', url);
}

function syncDocumentTitle(project) {
    document.title = project ? project.title : defaultTitle;
}

function renderGallery() {
    if (!modalRoot || !activeProject) return;

    const images = getGalleryImages(activeProject);
    const scroller = modalRoot.querySelector('.portfolio-modal__scroller');
    scroller.replaceChildren();

    images.forEach((src, index) => {
        const figure = document.createElement('figure');
        figure.className = 'portfolio-modal__figure';

        const media = document.createElement('div');
        media.className = 'portfolio-modal__media';

        const img = document.createElement('img');
        img.className = 'portfolio-modal__image';
        img.alt = `${activeProject.title} — image ${index + 1} of ${images.length}`;
        applyResponsiveImage(img, src, {
            sizes: GALLERY_SIZES,
            eager: index === 0,
            preferLarge: true,
        });

        media.appendChild(img);
        figure.appendChild(media);
        scroller.appendChild(figure);
    });

    scroller.scrollTop = 0;
}

function renderProjectDetails() {
    if (!modalRoot || !activeProject) return;

    modalRoot.querySelector('.portfolio-modal__meta').textContent = activeProject.meta;
    modalRoot.querySelector('.portfolio-modal__title').textContent = activeProject.title;
    modalRoot.querySelector('.portfolio-modal__description').textContent = activeProject.description;
    modalRoot.querySelector('.portfolio-modal__body').textContent = activeProject.details;
}

function closeModal({ fromHistory = false } = {}) {
    if (!modalRoot) return;

    modalRoot.classList.remove('is-open');
    modalRoot.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('portfolio-modal-open');
    activeProject = null;
    startSmoothScroll();

    if (!fromHistory) {
        writeProjectUrl('');
    }
    syncDocumentTitle(null);

    if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
        previousFocus = null;
    }
}

function openModal(project, trigger, { fromHistory = false } = {}) {
    if (!modalRoot) return;

    activeProject = project;
    previousFocus = trigger ?? document.activeElement;

    renderProjectDetails();
    renderGallery();

    stopSmoothScroll();
    modalRoot.setAttribute('aria-hidden', 'false');
    document.body.classList.add('portfolio-modal-open');

    if (!fromHistory) {
        writeProjectUrl(project.slug);
    }
    syncDocumentTitle(project);

    // Double rAF so the closed styles paint before opening — enables the CSS transition.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (!modalRoot || activeProject !== project) return;
            modalRoot.classList.add('is-open');
            modalRoot.querySelector('.portfolio-modal__close')?.focus();
        });
    });
}

function onLocationChange() {
    const slug = locationSlug();
    const project = slug ? getProjectBySlug(slug) : null;

    if (project) {
        if (activeProject?.slug !== project.slug) {
            openModal(project, null, { fromHistory: true });
        }
        return;
    }

    if (activeProject) {
        closeModal({ fromHistory: true });
    }
}

function onKeyDown(event) {
    if (!modalRoot?.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
    }
}

function ensureModal() {
    if (modalRoot) return modalRoot;

    modalRoot = document.createElement('div');
    modalRoot.className = 'portfolio-modal';
    modalRoot.setAttribute('aria-hidden', 'true');
    modalRoot.innerHTML = `
        <div class="portfolio-modal__backdrop" data-modal-close></div>
        <div
            class="portfolio-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-modal-title"
        >
            <button type="button" class="portfolio-modal__close" aria-label="Close project gallery">
                <span aria-hidden="true">&times;</span>
            </button>
            <div class="portfolio-modal__layout">
                <div
                    class="portfolio-modal__scroller"
                    data-lenis-prevent
                    data-lenis-prevent-wheel
                    data-lenis-prevent-touch
                    aria-label="Project images"
                ></div>
                <aside class="portfolio-modal__content">
                    <h2 class="portfolio-modal__title" id="portfolio-modal-title"></h2>
                    <p class="portfolio-modal__description"></p>
                    <p class="portfolio-modal__body"></p>
                    <span class="portfolio-modal__meta"></span>
                </aside>
            </div>
        </div>
    `;

    document.body.appendChild(modalRoot);

    const dialog = modalRoot.querySelector('.portfolio-modal__dialog');
    const scroller = modalRoot.querySelector('.portfolio-modal__scroller');

    // Trackpad/wheel anywhere in the modal scrolls the photo column.
    dialog.addEventListener('wheel', (event) => {
        if (window.matchMedia('(max-width: 900px)').matches) return;
        if (scroller.contains(event.target)) return;

        event.preventDefault();
        scroller.scrollTop += event.deltaY;
    }, { passive: false });

    modalRoot.querySelector('.portfolio-modal__close').addEventListener('click', () => closeModal());
    modalRoot.querySelector('[data-modal-close]').addEventListener('click', () => closeModal());
    document.addEventListener('keydown', onKeyDown);

    return modalRoot;
}

export function initPortfolioModal(options = {}) {
    getProjectBySlug = options.getProjectBySlug ?? (() => null);
    defaultTitle = options.defaultTitle ?? document.title;
    ensureModal();

    if (!historyBound) {
        historyBound = true;
        window.addEventListener('popstate', onLocationChange);
        window.addEventListener('hashchange', onLocationChange);
    }

    onLocationChange();
}

export function showPortfolioProject(project, trigger) {
    ensureModal();
    openModal(project, trigger);
}
