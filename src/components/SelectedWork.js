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

        const media = document.createElement('div');
        media.className = project.fit === 'contain'
            ? 'featured-image featured-image--contain'
            : 'featured-image';

        const img = document.createElement('img');
        img.src = project.image;
        img.alt = `${project.brand} \u2014 ${project.opener.toLowerCase()}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        media.appendChild(img);

        const lede = document.createElement('h3');
        lede.className = 'featured-lede';
        const opener = document.createElement('em');
        opener.className = 'lede-opener';
        opener.textContent = project.opener;
        lede.append(opener, ` ${project.bridge}`);

        const brand = document.createElement('span');
        brand.className = 'featured-brand';
        brand.textContent = project.brand;

        tile.append(media, lede, brand);
        grid.appendChild(tile);
    });
}
