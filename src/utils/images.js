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

export function applyResponsiveImage(img, asset, {
    sizes,
    eager = false,
    preferLarge = false,
} = {}) {
    img.src = preferLarge ? asset.srcLarge : asset.src;
    img.srcset = asset.srcset;
    if (sizes) img.sizes = sizes;
    img.decoding = 'async';
    img.loading = eager ? 'eager' : 'lazy';
    if (eager) img.fetchPriority = 'high';
    revealImage(img);
}
