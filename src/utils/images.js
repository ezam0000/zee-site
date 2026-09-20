export function sizedImage(dir, stem) {
    const src = `${dir}/${stem}-720.webp`;
    const srcLarge = `${dir}/${stem}-1400.webp`;
    return {
        src,
        srcLarge,
        srcset: `${src} 720w, ${srcLarge} 1400w`,
    };
}

export function revealImage(img) {
    img.classList.add('img-reveal');
    const show = () => img.classList.add('is-loaded');
    if (img.complete && img.naturalWidth > 0) {
        show();
        return;
    }
    img.addEventListener('load', show, { once: true });
    img.addEventListener('error', show, { once: true });
}

function isPublicAssetUrl(url) {
    return typeof url === 'string'
        && url.startsWith('/public/')
        && !url.includes('..')
        && !url.includes('\\')
        && !url.includes(':');
}

function assertPublicAssetUrl(url) {
    if (!isPublicAssetUrl(url)) {
        throw new Error('Blocked non-public image URL');
    }
}

function assertPublicSrcset(srcset) {
    String(srcset).split(',').forEach((entry) => {
        assertPublicAssetUrl(entry.trim().split(/\s+/, 1)[0]);
    });
}

export function applyResponsiveImage(img, asset, {
    sizes,
    eager = false,
    preferLarge = false,
} = {}) {
    const src = preferLarge ? asset.srcLarge : asset.src;
    assertPublicAssetUrl(src);
    assertPublicSrcset(asset.srcset);
    img.src = src;
    img.srcset = asset.srcset;
    if (sizes) img.sizes = sizes;
    img.decoding = 'async';
    img.loading = eager ? 'eager' : 'lazy';
    if (eager) img.fetchPriority = 'high';
    revealImage(img);
}
