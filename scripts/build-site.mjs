#!/usr/bin/env node
/**
 * Deterministic site generator.
 * Owns work/index.html, work/{slug}/index.html, sitemap.xml,
 * src/data/image-manifest.js, hashed delivery/share derivatives,
 * and the marked headshot region in about/index.html.
 * Does not read files outside this repository.
 */
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { GALLERY_SIZES, HEADSHOT_SIZES, TILE_SIZES } from '../src/data/image-layout.js';
import { PROJECTS, SITE_ORIGIN, WORK_PAGE, getProjectBySlug } from '../src/data/projects.js';
import { projectPageGraph, workPageGraph } from '../src/data/structured-data.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const failures = [];

const WORK_DIR = '/public/images/work';
const SOURCE_EDGES = [720, 1400];
const VARIANT_WIDTHS = [540, 360];
const ASPECT_TOLERANCE = 0.02;

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

function escapeXml(value) {
    return escapeHtml(value);
}

function jsonForHtml(value) {
    return JSON.stringify(value, null, 2).replaceAll('<', '\\u003c');
}

function hash12(buffer, label) {
    return createHash('sha256').update(buffer).update(label).digest('hex').slice(0, 12);
}

function aspectOf(width, height) {
    return width / height;
}

async function exists(file) {
    try {
        await access(file);
        return true;
    } catch {
        return false;
    }
}

async function writeOwned(relativePath, data) {
    const file = path.join(root, relativePath);
    const next = Buffer.isBuffer(data) ? data : Buffer.from(data);
    let current = null;
    try {
        current = await readFile(file);
    } catch {
        current = null;
    }
    if (current && current.equals(next)) return;
    if (checkOnly) {
        failures.push(relativePath);
        return;
    }
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, next);
}

function requireFields(project) {
    for (const field of ['slug', 'title', 'meta', 'description', 'details', 'cover']) {
        if (!project[field] || typeof project[field] !== 'string') {
            throw new Error(`Project is missing ${field}`);
        }
    }
    if (!Array.isArray(project.gallery) || project.gallery.length === 0) {
        throw new Error(`Project ${project.slug} is missing gallery images`);
    }
}

function validateProjects() {
    const slugs = new Set();
    for (const project of PROJECTS) {
        requireFields(project);
        if (!/^[a-z0-9-]+$/.test(project.slug)) {
            throw new Error(`Unsafe project slug: ${project.slug}`);
        }
        if (slugs.has(project.slug)) throw new Error(`Duplicate slug: ${project.slug}`);
        slugs.add(project.slug);
        if (getProjectBySlug(project.slug) !== project) {
            throw new Error(`Slug lookup failed for ${project.slug}`);
        }
    }
}

async function measureImage(relativePath) {
    const abs = path.join(root, relativePath);
    if (!(await exists(abs))) return null;
    const buf = await readFile(abs);
    const meta = await sharp(buf, { failOn: 'none' }).rotate().metadata();
    if (!meta.width || !meta.height) {
        throw new Error(`Could not read dimensions for ${relativePath}`);
    }
    return {
        src: `/${relativePath.replaceAll(path.sep, '/')}`,
        abs,
        width: meta.width,
        height: meta.height,
        bytes: buf.length,
        buf,
    };
}

function dedupeWidths(candidates) {
    const byWidth = new Map();
    for (const candidate of candidates) {
        const previous = byWidth.get(candidate.width);
        if (!previous || candidate.bytes < previous.bytes) byWidth.set(candidate.width, candidate);
    }
    return [...byWidth.values()].sort((a, b) => a.width - b.width);
}

function assertFamilyAspect(candidates, label) {
    const basis = candidates[candidates.length - 1];
    const base = aspectOf(basis.width, basis.height);
    const kept = [];
    for (const candidate of candidates) {
        const delta = Math.abs(aspectOf(candidate.width, candidate.height) - base) / base;
        if (delta > ASPECT_TOLERANCE) {
            console.warn(`Excluded ${candidate.src} from ${label}: aspect differs from the source family`);
            continue;
        }
        kept.push(candidate);
    }
    if (!kept.length) throw new Error(`No usable candidates for ${label}`);
    return kept;
}

async function addWidthVariants(candidates, source, stem, publicDir) {
    let current = candidates.slice();
    for (const targetWidth of VARIANT_WIDTHS) {
        if (source.width <= targetWidth) continue;
        const output = await sharp(source.buf, { failOn: 'none' })
            .rotate()
            .resize({ width: targetWidth, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
        const meta = await sharp(output).metadata();
        if (!meta.width || !meta.height || meta.width >= source.width) continue;
        const nextLarger = current
            .filter((candidate) => candidate.width > meta.width)
            .sort((a, b) => a.width - b.width)[0];
        if (!nextLarger || output.length >= nextLarger.bytes * 0.8) continue;
        const base = aspectOf(source.width, source.height);
        const delta = Math.abs(aspectOf(meta.width, meta.height) - base) / base;
        if (delta > ASPECT_TOLERANCE) {
            console.warn(`Rejected ${stem} at ${targetWidth}px: unexpected aspect ratio`);
            continue;
        }
        const fileHash = hash12(source.buf, `|w${targetWidth}|q80`);
        const filename = `${stem}-w${meta.width}-${fileHash}.webp`;
        const relative = `${publicDir.slice(1)}/${filename}`;
        current.push({
            src: `${publicDir}/${filename}`,
            relative,
            width: meta.width,
            height: meta.height,
            bytes: output.length,
            body: output,
            generated: true,
        });
        current = dedupeWidths(current);
    }
    return current;
}

function toManifestEntry(candidates) {
    const ordered = dedupeWidths(candidates);
    const widest = ordered[ordered.length - 1];
    const fallback = ordered.reduce((best, candidate) => {
        return Math.abs(candidate.width - 720) < Math.abs(best.width - 720) ? candidate : best;
    }, ordered[0]);
    return {
        width: widest.width,
        height: widest.height,
        src: fallback.src,
        srcLarge: widest.src,
        srcset: ordered.map((candidate) => `${candidate.src} ${candidate.width}w`).join(', '),
        candidates: ordered.map((candidate) => ({
            src: candidate.src,
            width: candidate.width,
            height: candidate.height,
            bytes: candidate.bytes,
        })),
    };
}

async function buildFamily(stem, publicDir, extraSourceRelative = null) {
    const measured = [];
    for (const edge of SOURCE_EDGES) {
        const relative = `${publicDir.slice(1)}/${stem}-${edge}.webp`;
        const image = await measureImage(relative);
        if (!image) throw new Error(`Missing required asset ${relative}`);
        measured.push(image);
    }
    let source = measured.reduce((best, image) => {
        return image.width * image.height > best.width * best.height ? image : best;
    });
    if (extraSourceRelative) {
        const extra = await measureImage(extraSourceRelative);
        if (extra && extra.width * extra.height > source.width * source.height) source = extra;
    }
    const withVariants = await addWidthVariants(measured, source, stem, publicDir);
    const usable = assertFamilyAspect(withVariants, stem);
    return {
        entry: toManifestEntry(usable),
        payloads: usable.filter((candidate) => candidate.generated && candidate.body),
    };
}

function imgTag(entry, { alt, sizes, eager = false, priority = false, className = '' }) {
    const loading = eager ? 'eager' : 'lazy';
    const priorityAttr = priority ? '\n                        fetchpriority="high"' : '';
    const classAttr = className ? ` class="${className}"` : '';
    return `<img${classAttr}
                        alt="${escapeHtml(alt)}"
                        width="${entry.width}"
                        height="${entry.height}"
                        sizes="${escapeHtml(sizes)}"
                        srcset="${escapeHtml(entry.srcset)}"
                        src="${escapeHtml(entry.src)}"
                        decoding="async"
                        loading="${loading}"${priorityAttr}
                    >`;
}

function detailsHtml(project, heading, modifier = '') {
    const classes = modifier ? `portfolio-tile__details ${modifier}` : 'portfolio-tile__details';
    return `<div class="${classes}">
                            <${heading} class="portfolio-tile__title">${escapeHtml(project.title)}</${heading}>
                            <p class="portfolio-tile__description">${escapeHtml(project.description)}</p>
                            <span class="portfolio-tile__meta">${escapeHtml(project.meta)}</span>
                        </div>`;
}

function cardHtml(project, entry, { eager, priority }) {
    const image = imgTag(entry, {
        alt: project.title,
        sizes: TILE_SIZES,
        eager,
        priority,
    });
    return `                    <a class="portfolio-tile" href="/work/${project.slug}/" data-project-slug="${project.slug}">
                        <div class="portfolio-tile__frame">
                            <div class="portfolio-tile__media">
                                ${image}
                                <div class="portfolio-tile__overlay">
                                    ${detailsHtml(project, 'h2')}
                                </div>
                            </div>
                        </div>
                        ${detailsHtml(project, 'h2', 'portfolio-tile__details--mobile')}
                        <span class="portfolio-tile__label">${escapeHtml(project.title)}</span>
                    </a>`;
}

function galleryFigure(project, entry, index, total, { eager, priority }) {
    const alt = `${project.title} — image ${index + 1} of ${total}`;
    return `                    <figure class="portfolio-modal__figure">
                        <div class="portfolio-modal__media">
                            ${imgTag(entry, { alt, sizes: GALLERY_SIZES, eager, priority, className: 'portfolio-modal__image' })}
                        </div>
                    </figure>`;
}

function headHtml(meta) {
    return `<title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="${escapeHtml(meta.canonical)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${escapeHtml(meta.canonical)}">
    <meta property="og:title" content="${escapeHtml(meta.title)}">
    <meta property="og:description" content="${escapeHtml(meta.description)}">
    <meta property="og:image" content="${escapeHtml(meta.image)}">
    <meta property="og:image:type" content="${escapeHtml(meta.imageType)}">
    <meta property="og:image:width" content="${meta.imageWidth}">
    <meta property="og:image:height" content="${meta.imageHeight}">
    <meta property="og:image:alt" content="${escapeHtml(meta.imageAlt)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${escapeHtml(meta.canonical)}">
    <meta name="twitter:title" content="${escapeHtml(meta.title)}">
    <meta name="twitter:description" content="${escapeHtml(meta.description)}">
    <meta name="twitter:image" content="${escapeHtml(meta.image)}">
    <meta name="twitter:image:alt" content="${escapeHtml(meta.imageAlt)}">`;
}

function fallbackHtml(project, manifest) {
    const images = project.gallery.map((stem) => manifest[`${WORK_DIR}/${stem}`]);
    const figures = images.map((entry, index) => galleryFigure(project, entry, index, images.length, {
        eager: index === 0,
        priority: index === 0,
    })).join('\n');
    return `        <div id="project-fallback" class="portfolio-fallback">
            <div class="portfolio-modal__backdrop"></div>
            <div class="portfolio-modal__dialog">
                <a class="portfolio-fallback__work" href="/work/">Work</a>
                <div class="portfolio-modal__layout" id="project-layout" data-project-slug="${project.slug}">
                    <div class="portfolio-modal__scroller" data-lenis-prevent data-lenis-prevent-wheel data-lenis-prevent-touch aria-label="Project images">
${figures}
                    </div>
                    <aside class="portfolio-modal__content">
                        <h1 class="portfolio-modal__title" id="portfolio-modal-title">${escapeHtml(project.title)}</h1>
                        <p class="portfolio-modal__description">${escapeHtml(project.description)}</p>
                        <p class="portfolio-modal__body">${escapeHtml(project.details)}</p>
                        <span class="portfolio-modal__meta">${escapeHtml(project.meta)}</span>
                    </aside>
                </div>
            </div>
        </div>`;
}

function renderPage({ meta, jsonLd, bodyAttrs, workShellAttrs, cards, fallback }) {
    const template = globalThis.__WORK_TEMPLATE__;
    const html = template
        .replace('__HEAD__', headHtml(meta))
        .replace('__JSONLD__', `<script type="application/ld+json" id="page-jsonld">\n${jsonForHtml(jsonLd)}\n    </script>`)
        .replace('__BODY_ATTRS__', bodyAttrs)
        .replace('__WORK_SHELL_ATTRS__', workShellAttrs)
        .replace('__CARDS__', cards)
        .replace('__FALLBACK__', fallback);
    return `<!-- Generated by scripts/build-site.mjs from templates/work.html and src/data/projects.js. Do not edit. -->\n${html.endsWith('\n') ? html : `${html}\n`}`;
}

function sitemapXml() {
    const locs = [
        `${SITE_ORIGIN}/`,
        `${SITE_ORIGIN}/work/`,
        `${SITE_ORIGIN}/about/`,
        ...PROJECTS.map((project) => `${SITE_ORIGIN}/work/${project.slug}/`),
    ];
    const body = locs.map((loc) => `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function manifestModule(manifest, shares) {
    return `// Generated by scripts/build-site.mjs. Do not edit.\nexport const IMAGE_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n\nexport const SHARE_IMAGES = ${JSON.stringify(shares, null, 2)};\n`;
}

async function shareFromCover(project, entry) {
    const largest = entry.candidates[entry.candidates.length - 1];
    const relative = largest.src.replace(/^\//, '');
    const source = await readFile(path.join(root, relative));
    const jpeg = await sharp(source, { failOn: 'none' })
        .rotate()
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 90 })
        .toBuffer();
    const meta = await sharp(jpeg).metadata();
    const fileHash = hash12(source, '|share|q90|w1200');
    const filename = `${project.slug}-${fileHash}.jpg`;
    const src = `/public/images/share/${filename}`;
    await writeOwned(`public/images/share/${filename}`, jpeg);
    return {
        src,
        width: meta.width,
        height: meta.height,
        bytes: jpeg.length,
        type: 'image/jpeg',
        alt: project.title,
    };
}

function headshotTag(entry) {
    return `                                <img
                                    alt="Zee Pauli"
                                    width="${entry.width}"
                                    height="${entry.height}"
                                    sizes="${HEADSHOT_SIZES}"
                                    srcset="${entry.srcset}"
                                    src="${entry.src}"
                                    decoding="async"
                                    loading="eager"
                                    fetchpriority="high"
                                >`;
}

async function updateHeadshotRegion(entry) {
    const relative = 'about/index.html';
    const file = path.join(root, relative);
    const source = await readFile(file, 'utf8');
    const start = '<!-- generated-headshot:start -->';
    const end = '<!-- generated-headshot:end -->';
    if (!source.includes(start) || !source.includes(end)) {
        throw new Error('about/index.html is missing headshot generation markers');
    }
    const next = source.replace(
        new RegExp(`${start}[\\s\\S]*?${end}`),
        `${start}\n${headshotTag(entry)}\n                                ${end}`,
    );
    await writeOwned(relative, next);
}

async function listRasterFiles(directory) {
    const abs = path.join(root, directory);
    const entries = await readdir(abs, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const relative = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...await listRasterFiles(relative));
        } else if (/\.(webp|png|jpe?g|gif|avif)$/i.test(entry.name)) {
            files.push(relative.replaceAll(path.sep, '/'));
        }
    }
    return files;
}

async function main() {
    validateProjects();
    globalThis.__WORK_TEMPLATE__ = await readFile(path.join(root, 'templates/work.html'), 'utf8');

    const manifest = {};
    const pendingWrites = [];

    const stems = [...new Set(PROJECTS.flatMap((project) => [project.cover, ...project.gallery]))];
    for (const stem of stems) {
        const family = await buildFamily(stem, WORK_DIR);
        manifest[`${WORK_DIR}/${stem}`] = family.entry;
        pendingWrites.push(...family.payloads);
    }

    const headshotFamily = await buildFamily('zee-headshot', '/public/images', 'public/images/zee-headshot.jpg');
    const headshot = headshotFamily.entry;
    manifest['/public/images/zee-headshot'] = headshot;
    pendingWrites.push(...headshotFamily.payloads);

    for (const relative of [
        'public/images/floating-leaf.png',
        'public/images/backgrounds/tree_light.webp',
        'public/images/backgrounds/tree_dark.webp',
        'public/og-image.jpg',
    ]) {
        const image = await measureImage(relative);
        if (!image) throw new Error(`Missing required asset ${relative}`);
        const key = `/${relative.replace(/\.(webp|png|jpe?g)$/i, '')}`;
        manifest[key] = toManifestEntry([image]);
    }

    const shares = {};
    const shareBySlug = {};
    for (const project of PROJECTS) {
        const cover = manifest[`${WORK_DIR}/${project.cover}`];
        const share = await shareFromCover(project, cover);
        shares[project.slug] = share;
        shareBySlug[project.slug] = share.src;
    }

    for (const file of pendingWrites) {
        await writeOwned(file.relative, file.body);
    }

    const manifestForDisk = {};
    for (const [key, entry] of Object.entries(manifest)) {
        manifestForDisk[key] = {
            width: entry.width,
            height: entry.height,
            src: entry.src,
            srcLarge: entry.srcLarge,
            srcset: entry.srcset,
            candidates: entry.candidates,
        };
    }

    await writeOwned('src/data/image-manifest.js', manifestModule(manifestForDisk, shares));

    const cards = PROJECTS.map((project, index) => cardHtml(
        project,
        manifest[`${WORK_DIR}/${project.cover}`],
        { eager: index < 3, priority: index === 0 },
    )).join('\n');

    const workJson = workPageGraph(shareBySlug);
    const workPage = renderPage({
        meta: {
            title: WORK_PAGE.title,
            description: WORK_PAGE.description,
            canonical: `${SITE_ORIGIN}/work/`,
            image: `${SITE_ORIGIN}${WORK_PAGE.ogImage}`,
            imageType: WORK_PAGE.ogImageType,
            imageWidth: WORK_PAGE.ogImageWidth,
            imageHeight: WORK_PAGE.ogImageHeight,
            imageAlt: WORK_PAGE.ogImageAlt,
        },
        jsonLd: workJson,
        bodyAttrs: 'data-portfolio-entry="work"',
        workShellAttrs: '',
        cards,
        fallback: '',
    });
    await writeOwned('work/index.html', workPage);

    for (const project of PROJECTS) {
        const share = shares[project.slug];
        const galleryImages = project.gallery.map((stem) => {
            const entry = manifest[`${WORK_DIR}/${stem}`];
            return entry.srcLarge;
        });
        const page = renderPage({
            meta: {
                title: project.title,
                description: project.description,
                canonical: `${SITE_ORIGIN}/work/${project.slug}/`,
                image: `${SITE_ORIGIN}${share.src}`,
                imageType: share.type,
                imageWidth: share.width,
                imageHeight: share.height,
                imageAlt: project.title,
            },
            jsonLd: projectPageGraph(project, { share, galleryImages }),
            bodyAttrs: `data-portfolio-entry="project" data-project-slug="${project.slug}"`,
            workShellAttrs: 'hidden',
            cards: PROJECTS.map((item) => cardHtml(
                item,
                manifest[`${WORK_DIR}/${item.cover}`],
                { eager: false, priority: false },
            )).join('\n'),
            fallback: `\n${fallbackHtml(project, manifest)}\n`,
        });
        await writeOwned(`work/${project.slug}/index.html`, page);
    }

    await writeOwned('sitemap.xml', sitemapXml());
    await updateHeadshotRegion(headshot);

    const referenced = new Set();
    for (const entry of Object.values(manifestForDisk)) {
        for (const candidate of entry.candidates) referenced.add(candidate.src.replace(/^\//, ''));
    }
    for (const share of Object.values(shares)) referenced.add(share.src.replace(/^\//, ''));
    const rasters = await listRasterFiles('public');
    const dormant = rasters.filter((file) => !referenced.has(file)).sort();
    if (!checkOnly) {
        await mkdir(path.join(root, 'test-results/optimization'), { recursive: true });
        await writeFile(
            path.join(root, 'test-results/optimization/dormant-images.json'),
            `${JSON.stringify(dormant, null, 2)}\n`,
        );
    }

    if (failures.length) {
        console.error(`Generated output drifted (${failures.length} files):`);
        for (const file of failures) console.error(`  ${file}`);
        process.exit(1);
    }
    console.log(checkOnly ? 'build:check passed' : `Generated ${PROJECTS.length} project pages`);
    console.log(`Dormant rasters left untouched: ${dormant.length}`);
}

await main();
