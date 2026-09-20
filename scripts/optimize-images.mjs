#!/usr/bin/env node
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const SOURCES = [
    'public/images/work/pixlz-cover.webp',
    'public/images/work/pixlz-party-flood.webp',
    'public/images/work/pixlz-event-ambassador.webp',
    'public/images/work/pixlz-event-table.webp',
    'public/images/work/gron-halloween-cover.jpg',
    'public/images/work/gron-halloween-lips.jpg',
    'public/images/work/gron-halloween-coffin-hand.jpg',
    'public/images/work/gron-halloween-pearls-flood.jpg',
    'public/images/work/gron-halloween-arcana-tarot.webp',
    'public/images/work/pr-kits-cover.jpg',
    'public/images/work/pr-kits-american-metal.jpg',
    'public/images/work/pr-kits-wyoming-whiskey.jpg',
    'public/images/work/pr-kits-td-desk.jpg',
    'public/images/work/structural-cover.jpg',
    'public/images/work/structural-zippo-open.jpg',
    'public/images/work/structural-wood-box.jpg',
    'public/images/work/structural-awards.jpg',
    'public/images/work/gron-core-cover.jpg',
    'public/images/work/gron-core-curaleaf.jpg',
    'public/images/work/gron-core-vinyl-wrap.jpg',
    'public/images/work/gron-core-sticker-pack.jpg',
    'public/images/placeholders/nature-6.jpg',
    'public/images/zee-headshot.jpg',
];

const SIZES = [
    { suffix: 720, quality: 78 },
    { suffix: 1400, quality: 80 },
];

function resizeForLongEdge(width, height, max) {
    const longEdge = Math.max(width, height);
    if (longEdge <= max) return null;
    if (width >= height) return { width: max, withoutEnlargement: true };
    return { height: max, withoutEnlargement: true };
}

async function optimize(rel) {
    const input = path.join(root, rel);
    const parsed = path.parse(input);
    const { width, height } = await sharp(input).rotate().metadata();

    for (const { suffix, quality } of SIZES) {
        const out = path.join(parsed.dir, `${parsed.name}-${suffix}.webp`);
        let pipeline = sharp(input).rotate();
        const resize = resizeForLongEdge(width, height, suffix);
        if (resize) pipeline = pipeline.resize(resize);
        await pipeline.webp({ quality }).toFile(out);
        const info = await stat(out);
        console.log(`${path.relative(root, out)}  ${(info.size / 1024).toFixed(0)}KB`);
    }
}

for (const src of SOURCES) {
    await optimize(src);
}
