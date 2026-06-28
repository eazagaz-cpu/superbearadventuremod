#!/usr/bin/env node
// Scans dist/**/*.html for canonical/OG/Twitter URLs not starting with https://superbearadventuremod.io
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DIST = join(process.cwd(), 'dist');
const EXPECTED_ORIGIN = 'https://superbearadventuremod.io';
const BAD_PATTERN = /workers\.dev/;

const urlAttrs = [
  /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/gi,
  /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/gi,
  /<meta[^>]+name=["']twitter:url["'][^>]+content=["']([^"']+)["']/gi,
];

function walkDir(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkDir(full, files);
    else if (entry.endsWith('.html')) files.push(full);
  }
  return files;
}

let failures = 0;
let checked = 0;

try {
  const htmlFiles = walkDir(DIST);
  console.log(`\nAudit: canonical URLs — scanning ${htmlFiles.length} HTML files\n`);

  for (const file of htmlFiles) {
    const content = readFileSync(file, 'utf8');
    const rel = file.replace(DIST, '').replace(/\\/g, '/');

    for (const pattern of urlAttrs) {
      let match;
      pattern.lastIndex = 0;
      while ((match = pattern.exec(content)) !== null) {
        checked++;
        const url = match[1];
        if (!url.startsWith(EXPECTED_ORIGIN) || BAD_PATTERN.test(url)) {
          console.error(`  FAIL  ${rel}\n        ${url}`);
          failures++;
        }
      }
    }
  }

  console.log(`\n${checked} URL attributes checked — ${failures} failure(s)\n`);
  process.exit(failures > 0 ? 1 : 0);
} catch (e) {
  if (e.code === 'ENOENT') {
    console.error('dist/ directory not found. Run npm run build first.');
    process.exit(1);
  }
  throw e;
}
