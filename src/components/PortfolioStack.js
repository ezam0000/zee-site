const PLACEHOLDER_IMAGES = [
    '/public/images/placeholders/nature-1.jpg',
    '/public/images/placeholders/nature-2.jpg',
    '/public/images/placeholders/nature-3.jpg',
    '/public/images/placeholders/nature-4.jpg',
    '/public/images/placeholders/nature-5.jpg',
    '/public/images/placeholders/nature-6.jpg',
];
const PLACEHOLDER_TILE_COUNT = PLACEHOLDER_IMAGES.length;
const PLACEHOLDER_PROJECTS = [
    {
        title: 'Project Title One',
        meta: 'Brand Identity · 2024',
        description: 'A full visual system, packaging line, and launch campaign for a wellness brand.',
    },
    {
        title: 'Project Title Two',
        meta: 'Packaging · 2023',
        description: 'Limited edition box set design for a heritage spirits house.',
    },
    {
        title: 'Project Title Three',
        meta: 'Brand Strategy · 2024',
        description: 'Naming, identity, and retail experience for an emerging lifestyle label.',
    },
    {
        title: 'Project Title Four',
        meta: 'Visual Identity · 2022',
        description: 'Logo suite, typography, and collateral for a cultural institution.',
    },
    {
        title: 'Project Title Five',
        meta: 'Product Design · 2023',
        description: 'Physical product form, materials, and unboxing for a direct-to-consumer launch.',
    },
    {
        title: 'Project Title Six',
        meta: 'Experience · 2024',
        description: 'Environmental graphics and touchpoints for a flagship retail space.',
    },
];

export function initPortfolioStack() {
    const grid = document.getElementById('portfolio-stack');
    if (!grid) return;

    grid.className = 'portfolio-grid';
    grid.replaceChildren();

    for (let index = 0; index < PLACEHOLDER_TILE_COUNT; index += 1) {
        const project = PLACEHOLDER_PROJECTS[index] ?? {
            title: `Project Title ${index + 1}`,
            meta: 'Category · Year',
            description: 'Placeholder project description for portfolio tile.',
        };
        const image = PLACEHOLDER_IMAGES[index] ?? PLACEHOLDER_IMAGES[0];
        const tile = document.createElement('article');
        tile.className = 'portfolio-tile';
        tile.innerHTML = `
            <div class="portfolio-tile__frame">
                <div class="portfolio-tile__media">
                    <img src="${image}" alt="${project.title}" loading="lazy" decoding="async">
                    <div class="portfolio-tile__overlay">
                        <div class="portfolio-tile__details">
                            <span class="portfolio-tile__meta">${project.meta}</span>
                            <h3 class="portfolio-tile__title">${project.title}</h3>
                            <p class="portfolio-tile__description">${project.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            <span class="portfolio-tile__label">${project.title}</span>
        `;
        grid.appendChild(tile);
    }
}
