// Client Data - Using Local Logos
const clients = [
    { name: 'Apple', cat: 'Apple Inc.', logo: '/public/logos/clients/apple.png' },
    { name: 'Nike', cat: 'Nike, Inc.', logo: '/public/logos/clients/nike.png' },
    { name: 'Y Combinator', cat: 'Y Combinator', logo: '/public/logos/clients/ycombinator.png' },
    { name: 'Coca-Cola', cat: 'The Coca-Cola Company', logo: '/public/logos/clients/coca-cola.png' },
    { name: 'National Basketball Association', cat: 'National Basketball Association', logo: '/public/logos/clients/nba.png' },
    { name: 'Ultimate Fighting Championship', cat: 'Ultimate Fighting Championship', logo: '/public/logos/clients/ufc.png' },
    { name: 'Major League Baseball', cat: 'Major League Baseball', logo: '/public/logos/clients/mlb.png' },
    { name: 'National Hockey League', cat: 'National Hockey League', logo: '/public/logos/clients/nhl.png' },

    { name: 'Jack Daniel\'s', cat: 'Jack Daniel Distillery', logo: '/public/logos/clients/jack-daniels.png' },
    { name: 'Jim Beam', cat: 'Jim Beam Brands', logo: '/public/logos/clients/jim-beam.png' },
    { name: 'Jameson Irish Whiskey', cat: 'Jameson Irish Whiskey', logo: '/public/logos/clients/jameson.png' },

    { name: 'Michigan Stadium', cat: 'University of Michigan Athletics', logo: '/public/logos/clients/michigan.png' },
    { name: 'Beaver Stadium', cat: 'Penn State Athletics', logo: '/public/logos/clients/penn-state.png' },

    { name: 'Dallas Cowboys', cat: 'Dallas Cowboys Football Club', logo: '/public/logos/clients/cowboys.png' },
    { name: 'New England Patriots', cat: 'New England Patriots', logo: '/public/logos/clients/patriots.png' },
    { name: 'Pittsburgh Steelers', cat: 'Pittsburgh Steelers', logo: '/public/logos/clients/steelers.png' },

    { name: 'Amazon', cat: 'Amazon.com, Inc.', logo: '/public/logos/clients/amazon.png' },
    { name: 'Spotify', cat: 'Spotify AB', logo: '/public/logos/clients/spotify.png' },
    { name: 'Google', cat: 'Google LLC', logo: '/public/logos/clients/google.png' },
    { name: 'Meta', cat: 'Meta Platforms, Inc.', logo: '/public/logos/clients/meta.png' },
    
    { name: 'Chicago Bulls', cat: 'Chicago Bulls', logo: '/public/logos/clients/bulls.png' },
    { name: 'SoFi Stadium', cat: 'SoFi Stadium', logo: '/public/logos/clients/sofistadium.png' },
    { name: 'Allegiant Stadium', cat: 'Allegiant Stadium', logo: '/public/logos/clients/allegiantstadium.png' },
    { name: 'Inter Miami', cat: 'Inter Miami CF', logo: '/public/logos/clients/intermiami.png' }
];

export function initClientGrid() {
    const grid = document.getElementById('client-grid');
    if (!grid) return;

    clients.forEach(client => {
        const cell = document.createElement('div');
        cell.className = 'client-cell';
        
        // Logic to show Logo OR Styled Text if no logo
        let content = '';
        if (client.logo) {
            content = `<img src="${client.logo}" alt="${client.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                       <div class="fallback-text" style="display:none; font-family:var(--font-serif); font-size:1.5rem; font-weight:700;">${client.name}</div>`;
        } else {
            content = `<div style="font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; text-transform: uppercase;">${client.name}</div>`;
        }

        cell.innerHTML = `
            <div class="logo-container">
                ${content}
            </div>
            <span class="client-cat">${client.cat}</span>
        `;
        grid.appendChild(cell);
    });
}

