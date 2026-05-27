const projects = [
    {
        opener: 'PIXLZ',
        bridge: 'a reprogrammed gummy line and visual world for Grön.',
        brand: 'Grön — PIXLZ',
        image: '/public/images/work/gron-pixlz-blue-razzberry.webp',
        link: 'https://www.eatpixlz.com/',
        fit: 'contain',
    },
    {
        opener: 'A LIMITED EDITION BOX SET',
        bridge: 'for the world\u2019s oldest tequila house.',
        brand: 'Jose Cuervo',
        image: '/public/images/work/jose-cuervo.jpg',
        link: 'https://www.behance.net/gallery/196569875/Jose-Cuervo-Box-Set',
    },
    {
        opener: 'A COLLECTOR\u2019S BOX SET',
        bridge: 'that turns whiskey into a tactile object.',
        brand: 'American Metal Whiskey',
        image: '/public/images/work/american-metal.jpg',
        link: 'https://www.behance.net/gallery/196569815/American-Metal-Whiskey-Box-Set',
    },
];

export function initSelectedWork() {
    const grid = document.getElementById('work-grid');
    if (!grid) return;

    projects.forEach((project) => {
        const tile = document.createElement('a');
        tile.className = 'featured-tile';
        tile.href = project.link;
        tile.target = '_blank';
        tile.rel = 'noopener noreferrer';
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
