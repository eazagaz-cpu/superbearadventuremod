#!/usr/bin/env node
// Finds empty/generic alt text and missing image frontmatter in blog posts.
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const CONTENT = join(process.cwd(), 'src', 'content', 'blog');
const PUBLIC = join(process.cwd(), 'public');

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
const IMAGE_FM_RE = /^image:\s*["']?(.+?)["']?\s*$/m;
// Markdown image: ![alt](src)
const MD_IMG_RE = /!\[([^\]]*)\]\(([^)]+)\)/g;

const GENERIC_ALTS = new Set(['image', 'img', 'photo', 'picture', 'screenshot', 'icon', 'logo', '']);

let failures = 0;
let checked = 0;

console.log('\nAudit: image alt text\n');

const files = readdirSync(CONTENT).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

for (const file of files) {
  const raw = readFileSync(join(CONTENT, file), 'utf8');
  const m = FRONTMATTER_RE.exec(raw);
  if (!m) continue;

  const [, fm, body] = m;

  // Check frontmatter image field exists
  const imgFm = IMAGE_FM_RE.exec(fm);
  checked++;
  if (!imgFm) {
    console.error(`  FAIL  ${file.padEnd(60)} missing image: frontmatter`);
    failures++;
  } else {
    const imgPath = join(PUBLIC, imgFm[1].replace(/^\//, ''));
    if (!existsSync(imgPath)) {
      console.error(`  FAIL  ${file.padEnd(60)} image file not found: ${imgFm[1]}`);
      failures++;
    } else {
      console.log(`  PASS  ${file.padEnd(60)} frontmatter image ok`);
    }
  }

  // Check inline markdown images
  let match;
  MD_IMG_RE.lastIndex = 0;
  while ((match = MD_IMG_RE.exec(body)) !== null) {
    const alt = match[1].trim().toLowerCase();
    checked++;
    if (GENERIC_ALTS.has(alt)) {
      console.error(`  FAIL  ${file.padEnd(60)} generic/empty alt: ![${match[1]}](${match[2]})`);
      failures++;
    }
  }
}

console.log(`\n${checked} checks — ${failures} issue(s)\n`);
process.exit(failures > 0 ? 1 : 0);
