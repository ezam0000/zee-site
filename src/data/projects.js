/** Editorial project records. Image files are resolved separately. */

export const SITE_ORIGIN = 'https://zee-studio.com';

export const WORK_PAGE = {
    title: 'Work — Zee Pauli',
    description: 'Selected work in branding, packaging, and art direction.',
    path: '/work/',
    ogImage: '/public/og-image.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: 'Zee Pauli — Packaging & Brand Design',
    ogImageType: 'image/jpeg',
};

export const PROJECTS = [
    {
        slug: 'gron-core',
        title: 'Grön — Core Brand & Marketing',
        meta: 'Packaging · Design Systems · Print Production · Digital Marketing · Regulatory Compliance',
        description: "Ongoing packaging, print, and marketing design across Grön's four core product lines.",
        details: 'Packaging design and updates across Pearls, MEGA, Pips, and Chocolate, prepared as final artwork and proofed for print. Digital and retail marketing assets across email, social media, web banners, and point-of-purchase materials, adapted for each placement and market. Every piece built to meet multi-state cannabis packaging requirements.',
        cover: 'gron-core-project-card',
        gallery: [
            'gron-core-detail-landscape-1',
            'gron-core-detail-landscape-2',
            'gron-core-detail-landscape-3',
            'gron-core-detail-landscape-4',
            'gron-core-detail-landscape-5',
            'gron-core-detail-landscape-6',
            'gron-core-detail-landscape-7',
        ],
    },
    {
        slug: 'pixlz',
        title: 'Pixlz',
        meta: 'Branding · Design Systems · Packaging · Art Direction · Retail · Merchandise',
        description: "Pixlz launched to reach a customer segment Grön's other lines weren't serving.",
        details: 'Visual identity, packaging across three SKUs, and a retro-arcade concept and world for the brand to live in. Art direction carried across print and digital, in-store displays, launch events, and merchandise. Product color and flavor development. UI direction for the brand\'s website. Pixlz now operates as a fully independent brand, with its own site and its own retail presence.',
        cover: 'pixlz-project-card',
        gallery: [
            'pixlz-detail-landscape-1',
            'pixlz-detail-landscape-2',
            'pixlz-detail-landscape-3',
            'pixlz-detail-landscape-4',
            'pixlz-detail-landscape-5',
            'pixlz-detail-portrait-6',
            'pixlz-detail-portrait-7',
        ],
    },
    {
        slug: 'gron-halloween',
        title: 'Grön Halloween',
        meta: 'Packaging · Design Systems · Campaign Direction · Illustration · UI Direction · Interaction Design · Merchandise',
        description: "Two years of Grön's Halloween limited-time offer — Bite Club in 2025, Grön Arcana in 2026.",
        details: 'Packaging, design systems, and creative direction for both campaigns, each built as its own world rather than a refresh of the last. Bite Club introduced a vampire secret society, with packaging, merchandise, and microsite UI direction built around it. Grön Arcana followed with a tarot ritual concept, built around a custom digital tarot reading experience — its own microsite, its own mechanic. Pitch decks and creative presentations for both campaigns shipped across Grön\'s multi-state retail footprint.',
        cover: 'gron-halloween-project-card',
        gallery: [
            'gron-halloween-detail-landscape-1',
            'gron-halloween-detail-landscape-2',
            'gron-halloween-detail-landscape-3',
            'gron-halloween-detail-landscape-4',
            'gron-halloween-detail-landscape-5',
            'gron-halloween-detail-landscape-6',
            'gron-halloween-detail-landscape-7',
        ],
    },
    {
        slug: 'pr-kits',
        title: 'PR Kits & Corporate Gifts',
        meta: 'Concept · Product Design · Fabrication · Display Design · Packaging · Client Direction',
        description: 'Custom PR kits, corporate gifts, products, and displays for clients including Nike, Coca-Cola, and the NFL.',
        details: 'Concept through finished product for a wide range of client industries — national sports teams, liquor and food and beverage brands, banks, and automotive companies among them. Custom promotional products, PR and influencer kits, corporate gifts and awards, and retail displays, each built from a client brief through fabrication and final approval.',
        cover: 'pr-kits-project-card',
        gallery: [
            'pr-kits-detail-landscape-1',
            'pr-kits-detail-landscape-2',
            'pr-kits-detail-landscape-3',
            'pr-kits-detail-landscape-4',
            'pr-kits-detail-landscape-5',
            'pr-kits-detail-landscape-6',
        ],
    },
    {
        slug: 'structural-packaging',
        title: 'Structural Packaging & Fabrication',
        meta: 'Structural Design · Dieline Engineering · CNC/Laser Cutting · Materials · Prototyping',
        description: 'Structural packaging and fabrication work spanning wood, foam, and custom dielines.',
        details: 'Custom dielines and structural packaging, engineered to fit products and kit components precisely into foam inserts and custom boxes. Materials sourced and tested against durability, aesthetics, and cost. Production files prepared for CNC and laser cutting, prototypes refined, and final builds approved before going to production. This process work traces back to hands-on fabrication — running shop machinery, cutting, finishing, and assembling by hand before ever preparing a file for a machine to do it.',
        cover: 'structural-project-card',
        gallery: [
            'structural-detail-landscape-1',
            'structural-detail-landscape-2',
            'structural-detail-landscape-3',
            'structural-detail-landscape-4',
            'structural-detail-landscape-5',
            'structural-detail-landscape-6',
            'structural-detail-portrait-7',
        ],
    },
    {
        slug: 'design-toolbox',
        title: 'Design Toolbox',
        meta: 'Automation · Figma Plugins · Development',
        description: 'Custom scripts, Figma plugins, and small applications built to streamline her own design process.',
        details: 'Adobe ExtendScript automation for repetitive production tasks, including a script that builds sized artboards for retail display panels. Custom Figma plugins built for my own workflow. Small applications built and deployed with Cursor, GitHub, Supabase, and Vercel. The goal isn\'t more output. It\'s time returned — clearing the repetitive work so there\'s more room for the parts of the process that still require a person: taste, composition, and direction.',
        cover: 'design-toolbox-project-card',
        gallery: [
            'design-toolbox-detail-landscape-1',
        ],
    },
];

export function getProjectBySlug(slug) {
    if (!slug) return null;
    return PROJECTS.find((project) => project.slug === slug) ?? null;
}
