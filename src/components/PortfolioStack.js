import { initPortfolioModal, showPortfolioProject } from './PortfolioModal.js';

const WORK = '/public/images/work';

const PROJECTS = [
    {
        title: 'Pixlz',
        meta: 'Branding · Design Systems · Packaging · Art Direction · Retail · Merchandise',
        description: "Pixlz launched to reach a customer segment Grön's other lines weren't serving.",
        details: 'Visual identity, packaging across three SKUs, and a retro-arcade concept and world for the brand to live in. Art direction carried across print and digital, in-store displays, launch events, and merchandise. Product color and flavor development. UI direction for the brand\'s website. Pixlz now operates as a fully independent brand, with its own site and its own retail presence.',
        cover: `${WORK}/pixlz-cover.webp`,
        gallery: [
            `${WORK}/pixlz-cover.webp`,
            `${WORK}/pixlz-party-flood.webp`,
            `${WORK}/pixlz-event-ambassador.webp`,
            `${WORK}/pixlz-event-table.webp`,
        ],
    },
    {
        title: 'Grön Halloween — Bite Club / Grön Arcana',
        meta: 'Packaging · Design Systems · Campaign Direction · Illustration · UI Direction · Interaction Design · Merchandise',
        description: "Two years of Grön's Halloween limited-time offer — Bite Club in 2025, Grön Arcana in 2026.",
        details: 'Packaging, design systems, and creative direction for both campaigns, each built as its own world rather than a refresh of the last. Bite Club introduced a vampire secret society, with packaging, merchandise, and microsite UI direction built around it. Grön Arcana followed with a tarot ritual concept, built around a custom digital tarot reading experience — its own microsite, its own mechanic. Pitch decks and creative presentations for both campaigns shipped across Grön\'s multi-state retail footprint.',
        cover: `${WORK}/gron-halloween-cover.jpg`,
        gallery: [
            `${WORK}/gron-halloween-cover.jpg`,
            `${WORK}/gron-halloween-lips.jpg`,
            `${WORK}/gron-halloween-coffin-hand.jpg`,
            `${WORK}/gron-halloween-pearls-flood.jpg`,
            `${WORK}/gron-halloween-arcana-tarot.webp`,
        ],
    },
    {
        title: 'PR Kits & Corporate Gifts',
        meta: 'Concept · Product Design · Fabrication · Display Design · Packaging · Client Direction',
        description: 'Custom PR kits, corporate gifts, products, and displays for clients including Nike, Coca-Cola, and the NFL.',
        details: 'Concept through finished product for a wide range of client industries — national sports teams, liquor and food and beverage brands, banks, and automotive companies among them. Custom promotional products, PR and influencer kits, corporate gifts and awards, and retail displays, each built from a client brief through fabrication and final approval.',
        cover: `${WORK}/pr-kits-cover.jpg`,
        gallery: [
            `${WORK}/pr-kits-cover.jpg`,
            `${WORK}/pr-kits-american-metal.jpg`,
            `${WORK}/pr-kits-wyoming-whiskey.jpg`,
            `${WORK}/pr-kits-td-desk.jpg`,
        ],
    },
    {
        title: 'Structural Packaging & Fabrication',
        meta: 'Structural Design · Dieline Engineering · CNC/Laser Cutting · Materials · Prototyping',
        description: 'Structural packaging and fabrication work spanning wood, foam, and custom dielines.',
        details: 'Custom dielines and structural packaging, engineered to fit products and kit components precisely into foam inserts and custom boxes. Materials sourced and tested against durability, aesthetics, and cost. Production files prepared for CNC and laser cutting, prototypes refined, and final builds approved before going to production. This process work traces back to hands-on fabrication — running shop machinery, cutting, finishing, and assembling by hand before ever preparing a file for a machine to do it.',
        cover: `${WORK}/structural-cover.jpg`,
        gallery: [
            `${WORK}/structural-cover.jpg`,
            `${WORK}/structural-zippo-open.jpg`,
            `${WORK}/structural-wood-box.jpg`,
            `${WORK}/structural-awards.jpg`,
        ],
    },
    {
        title: 'Grön — Core Brand & Marketing',
        meta: 'Packaging · Design Systems · Print Production · Digital Marketing · Regulatory Compliance',
        description: "Ongoing packaging, print, and marketing design across Grön's four core product lines.",
        details: 'Packaging design and updates across Pearls, MEGA, Pips, and Chocolate, prepared as final artwork and proofed for print. Digital and retail marketing assets across email, social media, web banners, and point-of-purchase materials, adapted for each placement and market. Every piece built to meet multi-state cannabis packaging requirements.',
        cover: `${WORK}/gron-core-cover.jpg`,
        gallery: [
            `${WORK}/gron-core-cover.jpg`,
            `${WORK}/gron-core-curaleaf.jpg`,
            `${WORK}/gron-core-vinyl-wrap.jpg`,
            `${WORK}/gron-core-sticker-pack.jpg`,
        ],
    },
    {
        title: 'Design Toolbox',
        meta: 'Automation · Figma Plugins · Development',
        description: 'Custom scripts, Figma plugins, and small applications built to streamline my own design process.',
        details: 'Adobe ExtendScript automation for repetitive production tasks, including a script that builds sized artboards for retail display panels. Custom Figma plugins built for my own workflow. Small applications built and deployed with Cursor, GitHub, Supabase, and Vercel. The goal isn\'t more output. It\'s time returned — clearing the repetitive work so there\'s more room for the parts of the process that still require a person: taste, composition, and direction.',
        cover: '/public/images/placeholders/nature-6.jpg',
        gallery: ['/public/images/placeholders/nature-6.jpg'],
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

    details.append(title, description, meta);
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

    PROJECTS.forEach((project) => {
        const tile = buildTile(project, project.cover);
        tile.addEventListener('click', () => {
            showPortfolioProject(project, tile);
        });
        grid.appendChild(tile);
    });
}
