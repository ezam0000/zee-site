import { startSmoothScroll, stopSmoothScroll } from '../core/smooth-scroll.js';

let modalRoot = null;
let activeProject = null;
let previousFocus = null;

function getGalleryImages(project) {
    return project.gallery ?? [project.cover];
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
        img.src = src;
        img.alt = `${activeProject.title} — image ${index + 1} of ${images.length}`;
        img.loading = index === 0 ? 'eager' : 'lazy';
        img.decoding = 'async';

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

function closeModal() {
    if (!modalRoot) return;

    modalRoot.classList.remove('is-open');
    modalRoot.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('portfolio-modal-open');
    activeProject = null;
    startSmoothScroll();

    if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
        previousFocus = null;
    }
}

function openModal(project, trigger) {
    if (!modalRoot) return;

    activeProject = project;
    previousFocus = trigger ?? document.activeElement;

    renderProjectDetails();
    renderGallery();

    stopSmoothScroll();
    modalRoot.classList.add('is-open');
    modalRoot.setAttribute('aria-hidden', 'false');
    document.body.classList.add('portfolio-modal-open');

    modalRoot.querySelector('.portfolio-modal__close').focus();
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

    modalRoot.querySelector('.portfolio-modal__close').addEventListener('click', closeModal);
    modalRoot.querySelector('[data-modal-close]').addEventListener('click', closeModal);
    document.addEventListener('keydown', onKeyDown);

    return modalRoot;
}

export function initPortfolioModal() {
    ensureModal();
}

export function showPortfolioProject(project, trigger) {
    ensureModal();
    openModal(project, trigger);
}
