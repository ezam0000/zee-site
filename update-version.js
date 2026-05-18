#!/usr/bin/env node

/**
 * Cache Busting Version Updater
 * 
 * Usage:
 *   node update-version.js              # Uses timestamp
 *   node update-version.js 1.0.1       # Uses specific version
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get version from command line or use timestamp
const newVersion = process.argv[2] || Date.now().toString();

// Recursively find all HTML files
function findHTMLFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, test-results, .git
      if (!['node_modules', 'test-results', '.git'].includes(file)) {
        findHTMLFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Find all HTML files
const htmlFiles = findHTMLFiles(__dirname);

console.log(`Updating cache busting version to: ${newVersion}`);
console.log(`Found ${htmlFiles.length} HTML files\n`);

let updatedCount = 0;

htmlFiles.forEach(file => {
  try {
    let content = readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Update version in stylesheet links
    content = content.replace(
      /href="([^"]*\.css[^"]*)\?v=[^"]*"/g,
      `href="$1?v=${newVersion}"`
    );
    
    // Update version in script tags
    content = content.replace(
      /src="([^"]*\.js[^"]*)\?v=[^"]*"/g,
      `src="$1?v=${newVersion}"`
    );
    
    // If content changed, write it back
    if (content !== originalContent) {
      writeFileSync(file, content, 'utf8');
      const relativePath = file.replace(__dirname + '/', '');
      console.log(`✓ Updated: ${relativePath}`);
      updatedCount++;
    }
  } catch (error) {
    console.error(`✗ Error updating ${file}:`, error.message);
  }
});

console.log(`\n✓ Updated ${updatedCount} files with version ${newVersion}`);

