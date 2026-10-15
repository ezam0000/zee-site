import { PROJECTS, getProjectBySlug } from '../data/projects.js';
import { TILE_SIZES } from '../data/image-layout.js';
import { fillSeparatedMeta } from '../utils/dom.js';
import { applyResponsiveImage, sizedImage } from '../utils/images.js';
import { initPortfolioModal, showPortfolioProject } from './PortfolioModal.js';

const WORK = '/public/images/work';

function detailsElement(project, modifier = '') {
    const details = document.createElement('div');
    details.className = modifier
        ? `portfolio-tile__details ${modifier}`
        : 'portfolio-tile__details';

    const title = document.createElement('h2');
    title.className = 'portfolio-tile__title';
    title.textContent = project.title;

    const description = document.createElement('p');
    description.className = 'portfolio-tile__description';
    description.textContent = project.description;

    const meta = document.createElement('span');
    meta.className = 'portfolio-tile__meta';
    fillSeparatedMeta(meta, project.meta);

    details.append(title, description, meta);
    return details;
}

function buildTile(project, index) {
    const tile = document.createElement('a');
    tile.className = 'portfolio-tile';
    tile.href = `/work/${project.slug}/`;
    tile.dataset.projectSlug = project.slug;

    const frame = document.createElement('div');
    frame.className = 'portfolio-tile__frame';

    const media = document.createElement('div');
    media.className = 'portfolio-tile__media';

    const img = document.createElement('img');
    img.alt = project.title;
    applyResponsiveImage(img, sizedImage(WORK, project.cover), {
        sizes: TILE_SIZES,
        eager: index < 3,
        priority: index === 0,
    });
    media.append(img);

    const overlay = document.createElement('div');
    overlay.className = 'portfolio-tile__overlay';
    overlay.appendChild(detailsElement(project));
    media.appendChild(overlay);
    frame.appendChild(media);

    const label = document.createElement('span');
    label.className = 'portfolio-tile__label';
    label.textContent = project.title;

    tile.append(frame, detailsElement(project, 'portfolio-tile__details--mobile'), label);
    return tile;
}

function onTileClick(event) {
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const project = getProjectBySlug(event.currentTarget.dataset.projectSlug);
    if (!project) return;
    event.preventDefault();
    showPortfolioProject(project, event.currentTarget);
}

let started = false;

export { getProjectBySlug };

export function initPortfolioStack() {
    const grid = document.getElementById('portfolio-stack');
    if (!grid || started) return;
    started = true;

    if (!grid.querySelector('.portfolio-tile')) {
        grid.className = 'portfolio-grid';
        grid.replaceChildren();
        PROJECTS.forEach((project, index) => {
            grid.appendChild(buildTile(project, index));
        });
    }

    grid.querySelectorAll('a.portfolio-tile').forEach((tile) => {
        tile.addEventListener('click', onTileClick);
    });

    initPortfolioModal({ getProjectBySlug });
}
