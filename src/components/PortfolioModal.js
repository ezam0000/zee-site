let modalRoot = null;
let activeProject = null;
let activeImageIndex = 0;
let previousFocus = null;

const ARROW_ICON = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
`;

function getGalleryImages(project) {
    return project.gallery ?? [project.cover];
}

function renderGalleryImage() {
    if (!modalRoot || !activeProject) return;

    const images = getGalleryImages(activeProject);
    const image = modalRoot.querySelector('.portfolio-modal__image');
    const counter = modalRoot.querySelector('.portfolio-modal__counter');
    const prevButton = modalRoot.querySelector('.portfolio-modal__nav--prev');
    const nextButton = modalRoot.querySelector('.portfolio-modal__nav--next');

    activeImageIndex = Math.min(activeImageIndex, images.length - 1);
    image.src = images[activeImageIndex];
    image.alt = `${activeProject.title} — image ${activeImageIndex + 1} of ${images.length}`;
    counter.textContent = `${activeImageIndex + 1} / ${images.length}`;

    prevButton.disabled = activeImageIndex === 0;
    nextButton.disabled = activeImageIndex === images.length - 1;
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
    activeImageIndex = 0;

    if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
        previousFocus = null;
    }
}

function openModal(project, trigger) {
    if (!modalRoot) return;

    activeProject = project;
    activeImageIndex = 0;
    previousFocus = trigger ?? document.activeElement;

    renderProjectDetails();
    renderGalleryImage();

    modalRoot.classList.add('is-open');
    modalRoot.setAttribute('aria-hidden', 'false');
    document.body.classList.add('portfolio-modal-open');

    modalRoot.querySelector('.portfolio-modal__close').focus();
}

function shiftImage(delta) {
    if (!activeProject) return;

    const images = getGalleryImages(activeProject);
    const nextIndex = activeImageIndex + delta;
    if (nextIndex < 0 || nextIndex >= images.length) return;

    activeImageIndex = nextIndex;
    renderGalleryImage();
}

function onKeyDown(event) {
    if (!modalRoot?.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        shiftImage(-1);
        return;
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault();
        shiftImage(1);
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
                <div class="portfolio-modal__gallery">
                    <div class="portfolio-modal__stage">
                        <button type="button" class="portfolio-modal__nav portfolio-modal__nav--prev" aria-label="Previous image">
                            ${ARROW_ICON}
                        </button>
                        <figure class="portfolio-modal__figure">
                            <div class="portfolio-modal__media">
                                <img class="portfolio-modal__image" src="" alt="">
                            </div>
                        </figure>
                        <button type="button" class="portfolio-modal__nav portfolio-modal__nav--next" aria-label="Next image">
                            ${ARROW_ICON}
                        </button>
                    </div>
                    <div class="portfolio-modal__gallery-footer">
                        <span class="portfolio-modal__counter"></span>
                    </div>
                </div>
                <div class="portfolio-modal__content">
                    <span class="portfolio-modal__meta"></span>
                    <h2 class="portfolio-modal__title" id="portfolio-modal-title"></h2>
                    <p class="portfolio-modal__description"></p>
                    <p class="portfolio-modal__body"></p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalRoot);

    modalRoot.querySelector('.portfolio-modal__close').addEventListener('click', closeModal);
    modalRoot.querySelector('[data-modal-close]').addEventListener('click', closeModal);
    modalRoot.querySelector('.portfolio-modal__nav--prev').addEventListener('click', () => shiftImage(-1));
    modalRoot.querySelector('.portfolio-modal__nav--next').addEventListener('click', () => shiftImage(1));
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
