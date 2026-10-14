import { applyPageMeta, projectMetaState, workMetaState } from '../core/page-meta.js';
import { startSmoothScroll, stopSmoothScroll } from '../core/smooth-scroll.js';
import { getProjectBySlug as lookupProject } from '../data/projects.js';
import { GALLERY_SIZES } from '../data/image-layout.js';
import { applyResponsiveImage, sizedImage } from '../utils/images.js';

const WORK = '/public/images/work';

let modalRoot = null;
let activeProject = null;
let previousFocus = null;
let getProjectBySlug = lookupProject;
let historyBound = false;
let opToken = 0;
let closeTimer = 0;
let closeHandler = null;
let closeSettled = true;
let enhancedDirectEntry = false;

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function normalizeSlug(raw) {
    if (!raw) return '';
    let value = raw;
    try {
        value = decodeURIComponent(raw);
    } catch {
        return '';
    }
    value = value.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(value)) return '';
    return value;
}

function normalizedPathname() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path;
}

function cardFor(slug) {
    if (!slug || !window.CSS?.escape) {
        return document.querySelector(`a.portfolio-tile[data-project-slug="${slug}"]`);
    }
    return document.querySelector(`a.portfolio-tile[data-project-slug="${CSS.escape(slug)}"]`);
}

function sameDocumentUrl(url) {
    const next = new URL(url, window.location.origin);
    const current = new URL(window.location.href);
    const norm = (pathname) => pathname.replace(/\/+$/, '') || '/';
    return norm(next.pathname) === norm(current.pathname)
        && next.search === current.search
        && next.hash === current.hash;
}

function writeProjectUrl(slug, { replace = false } = {}) {
    const path = slug ? `/work/${slug}/` : '/work/';
    const url = `${path}${window.location.search}`;
    if (sameDocumentUrl(url)) return;
    const state = { portfolioSlug: slug || null };
    if (replace) history.replaceState(state, '', url);
    else history.pushState(state, '', url);
}

function consumeLegacyHash() {
    if (normalizedPathname() !== '/work') return null;
    if (!window.location.hash || window.location.hash === '#') return null;
    const slug = normalizeSlug(window.location.hash.replace(/^#/, ''));
    const project = slug ? getProjectBySlug(slug) : null;
    if (!project) return null;
    writeProjectUrl(project.slug, { replace: true });
    return project;
}

function projectFromLocation() {
    const legacy = consumeLegacyHash();
    if (legacy) return legacy;
    const path = normalizedPathname();
    const match = path.match(/^\/work\/([^/]+)$/);
    if (match) return getProjectBySlug(normalizeSlug(match[1]));
    if (path === '/work') {
        const slug = normalizeSlug(window.location.hash.replace(/^#/, ''));
        return slug ? getProjectBySlug(slug) : null;
    }
    return null;
}

function resetGalleryScroll() {
    if (!modalRoot) return;
    const nodes = [
        modalRoot,
        modalRoot.querySelector('.portfolio-modal__dialog'),
        modalRoot.querySelector('.portfolio-modal__scroller'),
        modalRoot.querySelector('.portfolio-modal__content'),
    ];
    nodes.forEach((node) => {
        if (node) node.scrollTop = 0;
    });
}

function focusClose() {
    modalRoot?.querySelector('.portfolio-modal__close')?.focus({ preventScroll: true });
}

function cancelClose() {
    if (closeTimer) window.clearTimeout(closeTimer);
    closeTimer = 0;
    if (closeHandler && modalRoot) modalRoot.removeEventListener('transitionend', closeHandler);
    closeHandler = null;
}

function renderGallery(project) {
    const images = (project.gallery?.length ? project.gallery : [project.cover]).filter(Boolean);
    const scroller = modalRoot.querySelector('.portfolio-modal__scroller')
        || document.createElement('div');
    if (!scroller.isConnected) {
        scroller.className = 'portfolio-modal__scroller';
        scroller.setAttribute('data-lenis-prevent', '');
        scroller.setAttribute('data-lenis-prevent-wheel', '');
        scroller.setAttribute('data-lenis-prevent-touch', '');
        scroller.setAttribute('aria-label', 'Project images');
    }
    scroller.replaceChildren();
    images.forEach((stem, index) => {
        const figure = document.createElement('figure');
        figure.className = 'portfolio-modal__figure';
        const media = document.createElement('div');
        media.className = 'portfolio-modal__media';
        const img = document.createElement('img');
        img.className = 'portfolio-modal__image';
        img.alt = `${project.title} — image ${index + 1} of ${images.length}`;
        applyResponsiveImage(img, sizedImage(WORK, stem), {
            sizes: GALLERY_SIZES,
            eager: index === 0,
            priority: index === 0,
            preferLarge: true,
        });
        media.appendChild(img);
        figure.appendChild(media);
        scroller.appendChild(figure);
    });
    return scroller;
}

function renderDetails(project) {
    const content = document.createElement('aside');
    content.className = 'portfolio-modal__content';

    const title = document.createElement('h2');
    title.className = 'portfolio-modal__title';
    title.id = 'portfolio-modal-title';
    title.textContent = project.title;

    const description = document.createElement('p');
    description.className = 'portfolio-modal__description';
    description.textContent = project.description;

    const body = document.createElement('p');
    body.className = 'portfolio-modal__body';
    body.textContent = project.details;

    const meta = document.createElement('span');
    meta.className = 'portfolio-modal__meta';
    meta.textContent = project.meta;

    content.append(title, description, body, meta);
    return content;
}

function mountProject(project) {
    const panel = modalRoot.querySelector('#portfolio-modal-panel');
    const closeButton = panel.querySelector('.portfolio-modal__close');
    const existingTitle = document.getElementById('portfolio-modal-title');
    if (existingTitle && !panel.contains(existingTitle)) existingTitle.removeAttribute('id');

    const layout = document.createElement('div');
    layout.className = 'portfolio-modal__layout';
    layout.dataset.projectSlug = project.slug;
    layout.append(renderGallery(project), renderDetails(project));

    panel.replaceChildren(closeButton, layout);
    modalRoot.dataset.activeSlug = project.slug;
}

function adoptStaticProject(project) {
    const layout = document.getElementById('project-layout');
    if (!layout || layout.dataset.projectSlug !== project.slug) return false;
    const title = layout.querySelector('.portfolio-modal__title');
    if (title?.tagName === 'H1') {
        const heading = document.createElement('h2');
        heading.className = title.className;
        heading.id = 'portfolio-modal-title';
        heading.textContent = title.textContent;
        title.replaceWith(heading);
    }
    const panel = modalRoot.querySelector('#portfolio-modal-panel');
    const closeButton = panel.querySelector('.portfolio-modal__close');
    panel.replaceChildren(closeButton, layout);
    document.getElementById('project-fallback')?.remove();
    modalRoot.dataset.activeSlug = project.slug;
    return true;
}

function ensureProjectContent(project) {
    if (modalRoot.dataset.activeSlug === project.slug && modalRoot.querySelector('.portfolio-modal__layout')) {
        return;
    }
    if (!adoptStaticProject(project)) mountProject(project);
}

function revealWorkShell() {
    const shell = document.getElementById('work-shell');
    if (shell) shell.hidden = false;
    document.body.classList.add('is-portfolio-enhanced');
}

function restoreFocus(slug) {
    const saved = previousFocus instanceof HTMLElement && previousFocus.isConnected
        ? previousFocus
        : cardFor(slug);
    previousFocus = null;
    saved?.focus({ preventScroll: true });
}

function finishClose(token, { fromHistory }) {
    if (token !== opToken || closeSettled) return;
    closeSettled = true;
    cancelClose();
    const slug = activeProject?.slug || modalRoot?.dataset.activeSlug || '';
    if (modalRoot?.open) modalRoot.close();
    modalRoot?.classList.remove('is-open');
    document.body.classList.remove('portfolio-modal-open');
    activeProject = null;
    startSmoothScroll();
    if (!fromHistory) writeProjectUrl('');
    applyPageMeta(workMetaState());
    restoreFocus(slug);
}

function closeModal({ fromHistory = false } = {}) {
    if (!modalRoot || (!modalRoot.open && !activeProject)) return;
    const token = ++opToken;
    closeSettled = false;
    cancelClose();
    modalRoot.classList.remove('is-open');

    const finish = () => finishClose(token, { fromHistory });
    if (prefersReducedMotion()) {
        finish();
        return;
    }
    closeHandler = (event) => {
        if (event.target !== modalRoot || event.propertyName !== 'opacity') return;
        finish();
    };
    modalRoot.addEventListener('transitionend', closeHandler);
    closeTimer = window.setTimeout(finish, 280);
}

function openModal(project, trigger, { fromHistory = false, immediate = false } = {}) {
    if (!modalRoot || !project) return;
    const token = ++opToken;
    closeSettled = true;
    cancelClose();

    activeProject = project;
    if (trigger instanceof HTMLElement) previousFocus = trigger;
    else if (!(previousFocus instanceof HTMLElement) || !previousFocus.isConnected) {
        previousFocus = cardFor(project.slug);
    }

    ensureProjectContent(project);
    resetGalleryScroll();
    applyPageMeta(projectMetaState(project));
    document.body.classList.add('portfolio-modal-open');
    stopSmoothScroll();
    if (!fromHistory) writeProjectUrl(project.slug);

    if (!modalRoot.open) {
        if (immediate) modalRoot.classList.add('is-open');
        else modalRoot.classList.remove('is-open');
        modalRoot.showModal();
        revealWorkShell();
        if (immediate) {
            focusClose();
            return;
        }
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (token !== opToken || activeProject !== project) return;
                modalRoot.classList.add('is-open');
                focusClose();
            });
        });
        return;
    }

    modalRoot.classList.add('is-open');
    revealWorkShell();
    focusClose();
}

function syncFromLocation() {
    const project = projectFromLocation();
    if (project) {
        const direct = document.body.dataset.portfolioEntry === 'project'
            && document.body.dataset.projectSlug === project.slug
            && !enhancedDirectEntry;
        if (direct) enhancedDirectEntry = true;
        if (activeProject?.slug !== project.slug || !modalRoot.open) {
            openModal(project, null, { fromHistory: true, immediate: direct });
        }
        return;
    }
    if (modalRoot?.open || activeProject) closeModal({ fromHistory: true });
}

function onWheel(event) {
    if (!modalRoot?.open) return;
    if (window.matchMedia('(max-width: 900px)').matches) return;
    if (event.ctrlKey) return;
    const scroller = modalRoot.querySelector('.portfolio-modal__scroller');
    const content = modalRoot.querySelector('.portfolio-modal__content');
    if (!scroller) return;
    if (content?.contains(event.target) && content.scrollHeight > content.clientHeight + 1) {
        const atTop = content.scrollTop <= 0;
        const atBottom = content.scrollTop + content.clientHeight >= content.scrollHeight - 1;
        if ((event.deltaY < 0 && !atTop) || (event.deltaY > 0 && !atBottom)) return;
    }
    if (scroller.contains(event.target)) return;
    event.preventDefault();
    scroller.scrollTop += event.deltaY;
}

function ensureModal() {
    if (modalRoot) return modalRoot;
    modalRoot = document.getElementById('portfolio-modal');
    if (!modalRoot) {
        modalRoot = document.createElement('dialog');
        modalRoot.id = 'portfolio-modal';
        modalRoot.className = 'portfolio-modal';
        modalRoot.setAttribute('aria-labelledby', 'portfolio-modal-title');
        modalRoot.innerHTML = `
            <div class="portfolio-modal__backdrop" data-modal-close></div>
            <div class="portfolio-modal__dialog" id="portfolio-modal-panel">
                <button type="button" class="portfolio-modal__close" aria-label="Close project gallery">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
        document.body.appendChild(modalRoot);
    }

    modalRoot.addEventListener('cancel', (event) => {
        event.preventDefault();
        if (!closeSettled) return;
        closeModal();
    });
    modalRoot.querySelector('.portfolio-modal__close')?.addEventListener('click', () => {
        if (!closeSettled) return;
        closeModal();
    });
    modalRoot.querySelector('[data-modal-close]')?.addEventListener('click', () => {
        if (!closeSettled) return;
        closeModal();
    });
    modalRoot.querySelector('.portfolio-modal__dialog')?.addEventListener('wheel', onWheel, { passive: false });
    return modalRoot;
}

export function initPortfolioModal(options = {}) {
    getProjectBySlug = options.getProjectBySlug ?? lookupProject;
    ensureModal();
    if (!historyBound) {
        historyBound = true;
        window.addEventListener('popstate', syncFromLocation);
        window.addEventListener('hashchange', syncFromLocation);
    }
    syncFromLocation();
}

export function showPortfolioProject(project, trigger) {
    ensureModal();
    openModal(project, trigger);
}
