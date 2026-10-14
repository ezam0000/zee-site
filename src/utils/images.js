import { IMAGE_MANIFEST } from '../data/image-manifest.js';

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

export function sizedImage(dir, stem) {
    const entry = IMAGE_MANIFEST[`${dir}/${stem}`];
    if (!entry) throw new Error(`Missing image manifest entry: ${dir}/${stem}`);
    return {
        src: entry.src,
        srcLarge: entry.srcLarge,
        srcset: entry.srcset,
        width: entry.width,
        height: entry.height,
    };
}

export function revealImage(img) {
    const done = img.complete && img.naturalWidth > 0;
    if (done) img.classList.add('is-loaded');
    img.classList.add('img-reveal');
    if (done) return;
    const show = () => img.classList.add('is-loaded');
    img.addEventListener('load', show, { once: true });
    img.addEventListener('error', show, { once: true });
}

export function applyResponsiveImage(img, asset, {
    sizes,
    eager = false,
    priority = false,
    preferLarge = false,
} = {}) {
    const src = preferLarge && asset.srcLarge ? asset.srcLarge : asset.src;
    assertPublicAssetUrl(src);
    assertPublicSrcset(asset.srcset);
    if (asset.width) img.width = asset.width;
    if (asset.height) img.height = asset.height;
    if (sizes) img.sizes = sizes;
    img.srcset = asset.srcset;
    img.src = src;
    img.decoding = 'async';
    img.loading = eager ? 'eager' : 'lazy';
    if (priority) img.fetchPriority = 'high';
    revealImage(img);
}
