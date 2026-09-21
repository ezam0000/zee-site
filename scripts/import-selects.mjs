#!/usr/bin/env node
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_ROOT =
  '/Users/zeepauli/Desktop/Portfolio Content/Portfolio Images/Project Images';
const OUT_DIR = path.join(root, 'public/images/work');

const PROJECT_MAP = [
  { folder: 'Pixlz', slug: 'pixlz' },
  { folder: 'Grön Halloween', slug: 'gron-halloween' },
  { folder: 'PR Kits & Corporate Gifts', slug: 'pr-kits' },
  { folder: 'Structural Packaging & Fabrication', slug: 'structural' },
  { folder: 'Grön — Core Brand & Marketing', slug: 'gron-core' },
  { folder: 'Design Toolbox', slug: 'design-toolbox' },
];

const SIZES = [
  { suffix: 720, quality: 78 },
  { suffix: 1400, quality: 80 },
];

function cleanStem(filename) {
  let stem = path.parse(filename).name;
  stem = stem.replace(/^\d+[-_]/, '');
  stem = stem
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return stem;
}

function normalizeKey(name) {
  return name
    .normalize('NFC')
    .replace(/Grön|Grön/g, 'Gron')
    .replace(/—/g, '-')
    .toLowerCase();
}

function resizeForLongEdge(width, height, max) {
  const longEdge = Math.max(width, height);
  if (longEdge <= max) return null;
  if (width >= height) return { width: max, withoutEnlargement: true };
  return { height: max, withoutEnlargement: true };
}

async function findSelectsDir(projectDir) {
  for (const name of ['00_Selects', 'Selects', '00_selects', 'selects']) {
    const p = path.join(projectDir, name);
    try {
      const s = await stat(p);
      if (s.isDirectory()) return p;
    } catch {
      // continue
    }
  }
  return null;
}

async function listImages(dir) {
  const entries = await readdir(dir);
  const files = [];
  for (const name of entries) {
    if (name.startsWith('.')) continue;
    const full = path.join(dir, name);
    const s = await stat(full);
    if (!s.isFile()) continue;
    if (!/\.(jpe?g|png|webp|avif|gif|tif{1,2})$/i.test(name)) continue;
    files.push(full);
  }
  files.sort((a, b) =>
    path
      .basename(a)
      .localeCompare(path.basename(b), undefined, {
        numeric: true,
        sensitivity: 'base',
      })
  );
  return files;
}

async function processImage(input, stem) {
  const meta = await sharp(input).rotate().metadata();
  for (const { suffix, quality } of SIZES) {
    const out = path.join(OUT_DIR, `${stem}-${suffix}.webp`);
    let pipeline = sharp(input).rotate();
    const resize = resizeForLongEdge(meta.width, meta.height, suffix);
    if (resize) pipeline = pipeline.resize(resize);
    await pipeline.webp({ quality }).toFile(out);
    const info = await stat(out);
    console.log(`  ${stem}-${suffix}.webp  ${(info.size / 1024).toFixed(0)}KB`);
  }
}

await mkdir(OUT_DIR, { recursive: true });

const rootEntries = await readdir(SRC_ROOT, { withFileTypes: true });
const manifest = {};

for (const { folder, slug } of PROJECT_MAP) {
  const match = rootEntries.find(
    (e) => e.isDirectory() && normalizeKey(e.name) === normalizeKey(folder)
  );
  if (!match) {
    console.warn(`Missing project folder: ${folder}`);
    continue;
  }

  const projectDir = path.join(SRC_ROOT, match.name);
  const selects = await findSelectsDir(projectDir);
  console.log(`\n=== ${match.name} ===`);
  if (!selects) {
    console.log('  (no Selects — skip)');
    manifest[slug] = [];
    continue;
  }

  console.log(`  from ${path.relative(SRC_ROOT, selects)}`);
  const images = await listImages(selects);
  if (!images.length) {
    console.log('  (empty Selects)');
    manifest[slug] = [];
    continue;
  }

  const stems = [];
  const used = new Set();
  for (const img of images) {
    let stem = cleanStem(path.basename(img));
    if (!stem) stem = `${slug}-image`;
    let unique = stem;
    let i = 2;
    while (used.has(unique)) unique = `${stem}-${i++}`;
    used.add(unique);
    await processImage(img, unique);
    stems.push(unique);
  }
  manifest[slug] = stems;
}

const manifestPath = path.join(root, 'scripts/selects-manifest.json');
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\nWrote ${path.relative(root, manifestPath)}`);
console.log(JSON.stringify(manifest, null, 2));
