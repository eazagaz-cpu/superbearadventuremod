#!/usr/bin/env node
// Flags posts below category minimum word counts.
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const CONTENT = join(process.cwd(), 'src', 'content', 'blog');

const MINIMUMS = {
  Download: 1400,
  Technical: 1600,
  Guide: 2000,
  Tips: 1500,
  Walkthrough: 2000,
  Lore: 1500,
  Archive: 800,
  default: 1000,
};

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
const CATEGORY_RE = /^category:\s*["']?(.+?)["']?\s*$/m;

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

let failures = 0;
let checked = 0;

console.log('\nAudit: word count\n');
console.log('  ' + 'File'.padEnd(60) + 'Category'.padEnd(14) + 'Words'.padEnd(8) + 'Min'.padEnd(8) + 'Status');
console.log('  ' + '-'.repeat(95));

const files = readdirSync(CONTENT).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

for (const file of files) {
  const raw = readFileSync(join(CONTENT, file), 'utf8');
  const m = FRONTMATTER_RE.exec(raw);
  if (!m) continue;

  const [, fm, body] = m;
  const catMatch = CATEGORY_RE.exec(fm);
  const category = catMatch ? catMatch[1] : 'default';
  const min = MINIMUMS[category] ?? MINIMUMS.default;
  const words = countWords(body);
  checked++;

  const pass = words >= min;
  if (!pass) failures++;

  const status = pass ? 'PASS' : 'FAIL';
  const line = `  ${file.padEnd(60)}${category.padEnd(14)}${String(words).padEnd(8)}${String(min).padEnd(8)}${status}`;
  if (!pass) console.error(line);
  else console.log(line);
}

console.log(`\n${checked} posts checked — ${failures} below minimum\n`);
process.exit(failures > 0 ? 1 : 0);
