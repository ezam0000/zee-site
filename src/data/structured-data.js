import { PROJECTS, SITE_ORIGIN, WORK_PAGE } from './projects.js';

const PERSON = {
    '@type': 'Person',
    '@id': `${SITE_ORIGIN}/#person`,
    name: 'Zee Pauli',
    url: `${SITE_ORIGIN}/`,
    image: `${SITE_ORIGIN}/public/images/zee-headshot-1400.webp`,
    email: 'mailto:zee.pauli@outlook.com',
    jobTitle: 'Designer',
    description: 'Designer working in branding, packaging, and art direction for cannabis, spirits, and consumer brands. Currently at Wyld. Based in Portland, OR.',
    worksFor: {
        '@type': 'Organization',
        name: 'Wyld',
    },
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Portland',
        addressRegion: 'OR',
        addressCountry: 'US',
    },
    sameAs: [
        'https://www.behance.net/zee-design',
        'https://www.linkedin.com/in/zee-studio',
        'https://www.instagram.com/zee.24',
    ],
    knowsAbout: [
        'Packaging design',
        'Brand systems',
        'Physical product design',
    ],
};

const WEBSITE = {
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    name: 'Zee Pauli',
    url: `${SITE_ORIGIN}/`,
    publisher: { '@id': `${SITE_ORIGIN}/#person` },
};

function absolute(path) {
    if (!path) return path;
    if (path.startsWith('https://')) return path;
    return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

function creativeWork(project, image) {
    return {
        '@type': 'CreativeWork',
        '@id': `${SITE_ORIGIN}/work/${project.slug}/#creative-work`,
        name: project.title,
        description: project.description,
        url: `${SITE_ORIGIN}/work/${project.slug}/`,
        image: absolute(image),
        creator: { '@id': `${SITE_ORIGIN}/#person` },
    };
}

export function workPageGraph(imageBySlug = {}) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            PERSON,
            WEBSITE,
            {
                '@type': ['WebPage', 'CollectionPage'],
                '@id': `${SITE_ORIGIN}/work/`,
                url: `${SITE_ORIGIN}/work/`,
                name: WORK_PAGE.title,
                description: WORK_PAGE.description,
                isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
                about: { '@id': `${SITE_ORIGIN}/#person` },
                breadcrumb: { '@id': `${SITE_ORIGIN}/work/#breadcrumb` },
                mainEntity: { '@id': `${SITE_ORIGIN}/work/#projects` },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${SITE_ORIGIN}/work/#breadcrumb`,
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: `${SITE_ORIGIN}/`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Work',
                        item: `${SITE_ORIGIN}/work/`,
                    },
                ],
            },
            {
                '@type': 'ItemList',
                '@id': `${SITE_ORIGIN}/work/#projects`,
                name: 'Selected work',
                numberOfItems: PROJECTS.length,
                itemListElement: PROJECTS.map((project, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    item: creativeWork(project, imageBySlug[project.slug]),
                })),
            },
        ],
    };
}

export function projectPageGraph(project, { share, galleryImages = [] } = {}) {
    const pageUrl = `${SITE_ORIGIN}/work/${project.slug}/`;
    const images = galleryImages.length ? galleryImages.map(absolute) : [absolute(share)];
    return {
        '@context': 'https://schema.org',
        '@graph': [
            PERSON,
            WEBSITE,
            {
                '@type': 'WebPage',
                '@id': pageUrl,
                url: pageUrl,
                name: project.title,
                description: project.description,
                isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
                about: { '@id': `${SITE_ORIGIN}/#person` },
                breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
                mainEntity: { '@id': `${pageUrl}#creative-work` },
                primaryImageOfPage: share
                    ? {
                        '@type': 'ImageObject',
                        url: absolute(share.src ?? share),
                        width: share.width,
                        height: share.height,
                    }
                    : undefined,
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${pageUrl}#breadcrumb`,
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: `${SITE_ORIGIN}/`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Work',
                        item: `${SITE_ORIGIN}/work/`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: project.title,
                        item: pageUrl,
                    },
                ],
            },
            {
                ...creativeWork(project, images[0]),
                image: images,
            },
        ],
    };
}
