export const projects = [
    {
        category: 'branding',
        opener: 'PIXLZ',
        bridge: 'a reprogrammed gummy line and visual world for Grön.',
        brand: 'Grön — PIXLZ',
        image: '/public/images/work/gron-pixlz-blue-razzberry.webp',
        fit: 'contain',
    },
    {
        category: 'branding',
        opener: 'A 100TH ANNIVERSARY BOX',
        bridge: 'for Coca-Cola \u00D7 Ohio State.',
        brand: 'Coca-Cola \u00D7 Ohio State',
        image: '/public/images/work/coca-cola.png',
        fit: 'contain',
    },
    {
        category: 'packaging',
        opener: 'A LIMITED EDITION BOX SET',
        bridge: 'for the world\u2019s oldest tequila house.',
        brand: 'Jose Cuervo',
        image: '/public/images/work/jose_cuervo.png',
        fit: 'contain',
    },
    {
        category: 'packaging',
        opener: 'A COLLECTOR\u2019S BOX SET',
        bridge: 'that turns whiskey into a tactile object.',
        brand: 'American Metal Whiskey',
        image: '/public/images/work/american_metal.png',
        fit: 'contain',
    },
    {
        category: 'packaging',
        opener: 'A JUNMAI GINJO BOX SET',
        bridge: 'for WE SAKE.',
        brand: 'WE SAKE',
        image: '/public/images/work/we_sake.png',
        fit: 'contain',
    },
    {
        category: 'experience',
        opener: 'ZIPPO LIGHTERS',
        bridge: 'skinned for football and baseball teams.',
        brand: 'Zippo \u2014 NFL \u00B7 MLB',
        image: '/public/images/work/nfl_mlb_lighers.png',
        fit: 'contain',
    },
    {
        category: 'experience',
        opener: 'CUSTOM STADIUM WALL ART',
        bridge: 'for SoFi.',
        brand: 'SoFi',
        image: '/public/images/work/sofi.png',
        fit: 'contain',
    },
];

export function initSelectedWork() {
    const grid = document.getElementById('work-grid');
    if (!grid) return;

    projects.forEach((project) => {
        const tile = document.createElement('article');
        tile.className = 'featured-tile';
        const fitClass = project.fit === 'contain' ? ' featured-image--contain' : '';
        tile.innerHTML = `
            <div class="featured-image${fitClass}">
                <img src="${project.image}" alt="${project.brand} \u2014 ${project.opener.toLowerCase()}" loading="lazy" decoding="async">
            </div>
            <h3 class="featured-lede">
                <em class="lede-opener">${project.opener}</em> ${project.bridge}
            </h3>
            <span class="featured-brand">${project.brand}</span>
        `;
        grid.appendChild(tile);
    });
}
