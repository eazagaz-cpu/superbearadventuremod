#!/usr/bin/env node
// Verifies expected FAQPage/HowTo/SoftwareApp schema presence per slug against a predefined map.
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const CONTENT = join(process.cwd(), 'src', 'content', 'blog');

// Slugs that must have each schema type
const REQUIRED_FAQ = new Set([
  'super-bear-adventure-mod-apk-download',
  'troubleshooting-common-errors',
  'super-bear-adventure-ios-mod-iphone',
  'super-bear-adventure-for-pc-guide',
  'lag-fix-optimization',
  'multiplayer-guide',
  'redeem-codes-list',
  'update-super-bear-adventure-mod',
  'super-bear-adventure-mod-apk-old-versions',
  'how-to-play-beginner-guide',
  'super-bear-adventure-apk-safe-download',
  'super-bear-adventure-mod-apk-free',
  'super-bear-adventure-hack-mod-features',
  'super-bear-adventure-cheats',
  'super-bear-adventure-mod-apk-latest-version',
  'super-bear-adventure-unlimited-gems',
  'super-bear-adventure-download-apkpure-alternative',
  'super-bear-adventure-mod-apk-2024',
  'super-bear-adventure-mod-apk-android-14',
  'super-bear-adventure-apk-samsung',
  'super-bear-adventure-apk-xiaomi',
  'super-bear-adventure-mod-apk-no-root',
  'install-apk-without-uninstalling-original',
  'super-bear-adventure-save-data-backup',
  'super-bear-adventure-mod-apk-bluestacks',
  'super-bear-adventure-mod-apk-ldplayer',
  'super-bear-adventure-mod-apk-offline',
  'speedrunning-super-bear-adventure',
  'super-bear-adventure-100-percent-completion',
  'super-bear-adventure-daily-challenges-guide',
  'super-bear-adventure-super-bear-fighters',
]);

const REQUIRED_HOWTO = new Set([
  'super-bear-adventure-mod-apk-download',
  'super-bear-adventure-for-pc-guide',
  'update-super-bear-adventure-mod',
  'lag-fix-optimization',
  'turtletown-walkthrough',
  'mole-mines-walkthrough',
  'the-hive-walkthrough',
  'giant-house-walkthrough',
  'snow-valley-secrets',
  'beemothep-desert-puzzle',
  'super-bear-adventure-apk-safe-download',
  'super-bear-adventure-cheats',
  'super-bear-adventure-unlimited-gems',
  'super-bear-adventure-mod-apk-android-14',
  'super-bear-adventure-apk-samsung',
  'super-bear-adventure-apk-xiaomi',
  'super-bear-adventure-mod-apk-no-root',
  'install-apk-without-uninstalling-original',
  'super-bear-adventure-save-data-backup',
  'super-bear-adventure-mod-apk-bluestacks',
  'super-bear-adventure-mod-apk-ldplayer',
  'speedrunning-super-bear-adventure',
  'super-bear-adventure-100-percent-completion',
  'super-bear-adventure-daily-challenges-guide',
  'super-bear-adventure-vehicles-guide',
  'super-bear-adventure-all-emotes',
]);

const REQUIRED_SOFTWARE = new Set([
  'super-bear-adventure-mod-apk-download',
  'super-bear-adventure-mod-menu',
  'super-bear-adventure-unlimited-money',
  'super-bear-adventure-apk-safe-download',
  'super-bear-adventure-mod-apk-free',
  'super-bear-adventure-mod-apk-latest-version',
  'super-bear-adventure-mod-apk-v12',
]);

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/;

function hasFrontmatterKey(fm, key) {
  return new RegExp(`^${key}:`, 'm').test(fm);
}

let failures = 0;
let checked = 0;

console.log('\nAudit: schema coverage\n');

const files = readdirSync(CONTENT).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

for (const file of files) {
  const slug = file.replace(/\.mdx?$/, '');
  const raw = readFileSync(join(CONTENT, file), 'utf8');
  const m = FRONTMATTER_RE.exec(raw);
  const fm = m ? m[1] : '';

  const checks = [];

  if (REQUIRED_FAQ.has(slug)) {
    checked++;
    const has = hasFrontmatterKey(fm, 'faq');
    checks.push({ type: 'FAQPage', pass: has });
    if (!has) failures++;
  }
  if (REQUIRED_HOWTO.has(slug)) {
    checked++;
    const has = hasFrontmatterKey(fm, 'howto');
    checks.push({ type: 'HowTo', pass: has });
    if (!has) failures++;
  }
  if (REQUIRED_SOFTWARE.has(slug)) {
    checked++;
    const has = hasFrontmatterKey(fm, 'addSoftwareSchema');
    checks.push({ type: 'SoftwareApp', pass: has });
    if (!has) failures++;
  }

  for (const { type, pass } of checks) {
    const line = `  ${pass ? 'PASS' : 'FAIL'}  ${slug.padEnd(55)} ${type}`;
    if (!pass) console.error(line);
    else console.log(line);
  }
}

console.log(`\n${checked} schema checks — ${failures} missing\n`);
process.exit(failures > 0 ? 1 : 0);
