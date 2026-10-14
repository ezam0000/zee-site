import { IMAGE_MANIFEST, SHARE_IMAGES } from '../data/image-manifest.js';
import { PROJECTS, SITE_ORIGIN, WORK_PAGE } from '../data/projects.js';
import { projectPageGraph, workPageGraph } from '../data/structured-data.js';

function setMeta(attr, name, content) {
    let el = document.head.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function setCanonical(href) {
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!el) {
        el = document.createElement('link');
        el.rel = 'canonical';
        document.head.appendChild(el);
    }
    el.href = href;
}

function sharePaths() {
    return Object.fromEntries(PROJECTS.map((project) => [
        project.slug,
        SHARE_IMAGES[project.slug]?.src,
    ]));
}

function galleryPaths(project) {
    return project.gallery.map((stem) => IMAGE_MANIFEST[`/public/images/work/${stem}`]?.srcLarge).filter(Boolean);
}

export function workMetaState() {
    return {
        title: WORK_PAGE.title,
        description: WORK_PAGE.description,
        url: `${SITE_ORIGIN}${WORK_PAGE.path}`,
        image: `${SITE_ORIGIN}${WORK_PAGE.ogImage}`,
        imageWidth: WORK_PAGE.ogImageWidth,
        imageHeight: WORK_PAGE.ogImageHeight,
        imageAlt: WORK_PAGE.ogImageAlt,
        imageType: WORK_PAGE.ogImageType,
        jsonLd: workPageGraph(sharePaths()),
    };
}

export function projectMetaState(project) {
    const share = SHARE_IMAGES[project.slug];
    return {
        title: project.title,
        description: project.description,
        url: `${SITE_ORIGIN}/work/${project.slug}/`,
        image: `${SITE_ORIGIN}${share.src}`,
        imageWidth: share.width,
        imageHeight: share.height,
        imageAlt: project.title,
        imageType: share.type,
        jsonLd: projectPageGraph(project, {
            share,
            galleryImages: galleryPaths(project),
        }),
    };
}

export function applyPageMeta(state) {
    document.title = state.title;
    setMeta('name', 'description', state.description);
    setCanonical(state.url);
    setMeta('property', 'og:url', state.url);
    setMeta('property', 'og:title', state.title);
    setMeta('property', 'og:description', state.description);
    setMeta('property', 'og:image', state.image);
    setMeta('property', 'og:image:type', state.imageType);
    setMeta('property', 'og:image:width', String(state.imageWidth));
    setMeta('property', 'og:image:height', String(state.imageHeight));
    setMeta('property', 'og:image:alt', state.imageAlt);
    setMeta('name', 'twitter:url', state.url);
    setMeta('name', 'twitter:title', state.title);
    setMeta('name', 'twitter:description', state.description);
    setMeta('name', 'twitter:image', state.image);
    setMeta('name', 'twitter:image:alt', state.imageAlt);
    const script = document.getElementById('page-jsonld');
    if (script) script.textContent = JSON.stringify(state.jsonLd);
}
