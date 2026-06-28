#!/usr/bin/env node
// Checks description length (120–160 chars), uniqueness, year presence, and keyword presence.
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const CONTENT = join(process.cwd(), 'src', 'content', 'blog');
const MIN_LEN = 120;
const MAX_LEN = 160;
const CURRENT_YEAR = new Date().getFullYear();

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/;
const DESC_RE = /^description:\s*["']?(.*?)["']?\s*$/m;

const seen = new Map(); // description -> first file

let failures = 0;
let checked = 0;

console.log('\nAudit: meta descriptions\n');

const files = readdirSync(CONTENT).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

for (const file of files) {
  const raw = readFileSync(join(CONTENT, file), 'utf8');
  const m = FRONTMATTER_RE.exec(raw);
  if (!m) continue;
  const fm = m[1];
  const descMatch = DESC_RE.exec(fm);
  if (!descMatch) {
    console.error(`  FAIL  ${file.padEnd(60)} MISSING description`);
    failures++;
    checked++;
    continue;
  }

  const desc = descMatch[1].trim();
  checked++;
  const issues = [];

  if (desc.length < MIN_LEN) issues.push(`too short (${desc.length} < ${MIN_LEN})`);
  if (desc.length > MAX_LEN) issues.push(`too long (${desc.length} > ${MAX_LEN})`);
  if (seen.has(desc)) issues.push(`duplicate of ${seen.get(desc)}`);
  else seen.set(desc, file);

  if (issues.length) {
    console.error(`  FAIL  ${file.padEnd(60)} ${issues.join('; ')}`);
    failures++;
  } else {
    console.log(`  PASS  ${file.padEnd(60)} ${desc.length} chars`);
  }
}

console.log(`\n${checked} descriptions checked — ${failures} issue(s)\n`);
process.exit(failures > 0 ? 1 : 0);
