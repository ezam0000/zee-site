import { initPortfolioModal, showPortfolioProject } from './PortfolioModal.js';

const PLACEHOLDER_IMAGES = [
    '/public/images/placeholders/nature-1.jpg',
    '/public/images/placeholders/nature-2.jpg',
    '/public/images/placeholders/nature-3.jpg',
    '/public/images/placeholders/nature-4.jpg',
    '/public/images/placeholders/nature-5.jpg',
    '/public/images/placeholders/nature-6.jpg',
];

function buildGallery(startIndex) {
    return Array.from({ length: 4 }, (_, offset) => (
        PLACEHOLDER_IMAGES[(startIndex + offset) % PLACEHOLDER_IMAGES.length]
    ));
}

const PLACEHOLDER_PROJECTS = [
    {
        title: 'Project Title One',
        meta: 'Brand Identity · 2024',
        description: 'A full visual system, packaging line, and launch campaign for a wellness brand.',
        details: 'Placeholder case study covering logo suite, color system, typography, packaging architecture, and launch assets developed for a wellness brand entering retail.',
        cover: PLACEHOLDER_IMAGES[0],
        gallery: buildGallery(0),
    },
    {
        title: 'Project Title Two',
        meta: 'Packaging · 2023',
        description: 'Limited edition box set design for a heritage spirits house.',
        details: 'Placeholder case study for a spirits collaboration focused on structural packaging, foil treatments, insert design, and a collector unboxing experience.',
        cover: PLACEHOLDER_IMAGES[1],
        gallery: buildGallery(1),
    },
    {
        title: 'Project Title Three',
        meta: 'Brand Strategy · 2024',
        description: 'Naming, identity, and retail experience for an emerging lifestyle label.',
        details: 'Placeholder case study spanning naming exploration, visual identity, brand voice, and retail touchpoints for a lifestyle label preparing its first store rollout.',
        cover: PLACEHOLDER_IMAGES[2],
        gallery: buildGallery(2),
    },
    {
        title: 'Project Title Four',
        meta: 'Visual Identity · 2022',
        description: 'Logo suite, typography, and collateral for a cultural institution.',
        details: 'Placeholder case study documenting mark development, typographic system, print collateral, signage, and environmental applications for a cultural institution refresh.',
        cover: PLACEHOLDER_IMAGES[3],
        gallery: buildGallery(3),
    },
    {
        title: 'Project Title Five',
        meta: 'Product Design · 2023',
        description: 'Physical product form, materials, and unboxing for a direct-to-consumer launch.',
        details: 'Placeholder case study for a DTC launch including product form language, material palette, packaging prototypes, and the full unboxing sequence.',
        cover: PLACEHOLDER_IMAGES[4],
        gallery: buildGallery(4),
    },
    {
        title: 'Project Title Six',
        meta: 'Experience · 2024',
        description: 'Environmental graphics and touchpoints for a flagship retail space.',
        details: 'Placeholder case study for a flagship environment with wall graphics, display systems, wayfinding, and branded moments across the in-store journey.',
        cover: PLACEHOLDER_IMAGES[5],
        gallery: buildGallery(5),
    },
];

function buildDetails(project) {
    const details = document.createElement('div');
    details.className = 'portfolio-tile__details';

    const meta = document.createElement('span');
    meta.className = 'portfolio-tile__meta';
    meta.textContent = project.meta;

    const title = document.createElement('h3');
    title.className = 'portfolio-tile__title';
    title.textContent = project.title;

    const description = document.createElement('p');
    description.className = 'portfolio-tile__description';
    description.textContent = project.description;

    details.append(meta, title, description);
    return details;
}

function buildTile(project, image) {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'portfolio-tile';
    tile.setAttribute('aria-label', `Open gallery for ${project.title}`);

    const frame = document.createElement('div');
    frame.className = 'portfolio-tile__frame';

    const media = document.createElement('div');
    media.className = 'portfolio-tile__media';

    const img = document.createElement('img');
    img.src = image;
    img.alt = project.title;
    img.loading = 'lazy';
    img.decoding = 'async';

    const overlay = document.createElement('div');
    overlay.className = 'portfolio-tile__overlay';
    overlay.appendChild(buildDetails(project));

    media.append(img, overlay);
    frame.appendChild(media);

    const mobileDetails = buildDetails(project);
    mobileDetails.classList.add('portfolio-tile__details--mobile');

    const label = document.createElement('span');
    label.className = 'portfolio-tile__label';
    label.textContent = project.title;

    tile.append(frame, mobileDetails, label);
    return tile;
}

export function initPortfolioStack() {
    const grid = document.getElementById('portfolio-stack');
    if (!grid) return;

    initPortfolioModal();
    grid.className = 'portfolio-grid';
    grid.replaceChildren();

    PLACEHOLDER_PROJECTS.forEach((project, index) => {
        const image = project.cover ?? PLACEHOLDER_IMAGES[index] ?? PLACEHOLDER_IMAGES[0];
        const tile = buildTile(project, image);
        tile.addEventListener('click', () => {
            showPortfolioProject(project, tile);
        });
        grid.appendChild(tile);
    });
}
