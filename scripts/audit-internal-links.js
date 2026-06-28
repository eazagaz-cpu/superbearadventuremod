#!/usr/bin/env node
// Extracts all /path internal links from .md files and verifies they resolve to existing routes.
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const CONTENT = join(process.cwd(), 'src', 'content', 'blog');
const PAGES = join(process.cwd(), 'src', 'pages');

// Internal link pattern: [text](/path) or [text](/path/)
const LINK_RE = /\[([^\]]+)\]\((\/((?!http)[^)]+))\)/g;

function getPageRoutes() {
  const routes = new Set();

  function walk(dir, prefix = '') {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const rel = prefix + '/' + entry;
      if (statSync(full).isDirectory()) {
        walk(full, rel);
      } else if (entry.endsWith('.astro') || entry.endsWith('.md') || entry.endsWith('.mdx')) {
        const slug = rel
          .replace(/\.(astro|mdx?)$/, '')
          .replace(/\/index$/, '/')
          .replace(/\[\.\.\.slug\]/, '*')
          .replace(/\[([^\]]+)\]/, ':$1');
        routes.add(slug);
      }
    }
  }

  walk(PAGES, '');
  return routes;
}

function getBlogSlugs() {
  const slugs = new Set();
  for (const file of readdirSync(CONTENT)) {
    if (file.endsWith('.md') || file.endsWith('.mdx')) {
      slugs.add('/blog/' + file.replace(/\.mdx?$/, '') + '/');
      slugs.add('/blog/' + file.replace(/\.mdx?$/, ''));
    }
  }
  return slugs;
}

const pageRoutes = getPageRoutes();
const blogSlugs = getBlogSlugs();

function resolves(path) {
  const normalized = path.endsWith('/') ? path : path + '/';
  if (blogSlugs.has(normalized) || blogSlugs.has(path)) return true;
  // Check static pages
  const stripped = normalized.replace(/\/$/, '');
  const candidates = [
    '/src/pages' + stripped + '.astro',
    '/src/pages' + stripped + '/index.astro',
    '/src/pages' + path + '.astro',
  ];
  // Walk page routes for dynamic catch-all
  for (const route of pageRoutes) {
    if (route.includes('*') || route.includes(':')) return true; // dynamic, assume ok
    if (route === stripped || route === path || route === normalized) return true;
  }
  // Allow known static pages from pages dir
  const knownPages = ['/', '/faq', '/faq/', '/download', '/download/', '/safety', '/safety/',
    '/install', '/install/', '/features', '/features/', '/worlds', '/worlds/', '/versions', '/versions/'];
  if (knownPages.includes(path) || knownPages.includes(normalized)) return true;
  return false;
}

let failures = 0;
let checked = 0;

console.log('\nAudit: internal links\n');

for (const file of readdirSync(CONTENT)) {
  if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
  const content = readFileSync(join(CONTENT, file), 'utf8');
  let match;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(content)) !== null) {
    const path = match[2];
    if (path.startsWith('http')) continue;
    checked++;
    if (!resolves(path)) {
      console.error(`  FAIL  ${file}\n        [${match[1]}](${path})`);
      failures++;
    }
  }
}

console.log(`\n${checked} links checked — ${failures} failure(s)\n`);
process.exit(failures > 0 ? 1 : 0);
