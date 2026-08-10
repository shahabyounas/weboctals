#!/usr/bin/env node
// Adds <script defer src=".../assets/js/cookie-consent.js"> just before
// </body> on every live, deployed HTML page, so the consent banner (and
// the gate it provides) is present sitewide - not just where GA/GTM
// happen to load today. privacy.html/terms.html already include it
// (hand-authored), so they're excluded here.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');

const TARGET_FILES = [
  'about.html', 'ai-agents.html', 'automation.html', 'contact.html',
  'digital-products.html', 'index.html', 'machine-learning.html',
  'on-page-seo.html', 'product-development.html', 'seo.html',
  'services.html', 'technical-seo.html', 'web-development.html',
  'blog/ai-agents-future-business-automation.html',
  'blog/driving-school-online-booking-platform-case-study.html',
  'blog/harnessing-ai-in-seo-game-changer-for-digital-agencies.html',
  'blog/index.html',
  'blog/we-live-in-an-ai-first-world.html',
  'blog/website-redesign-signs.html',
  'clients/ar-worldwide.html', 'clients/colindale-driving-school.html',
  'clients/fishermans-chips.html', 'clients/hair-we-cut.html',
  'clients/index.html', 'clients/quick-fit-shelving.html',
  'clients/the-driving-spot.html', 'clients/wazer-taxis.html',
  'projects/ar-worldwide.html', 'projects/ariana-kitchens-bedrooms.html',
  'projects/colindale-driving-school.html', 'projects/fishermans-chips.html',
  'projects/hair-we-cut.html', 'projects/index.html',
  'projects/lumenlux.html', 'projects/quick-fit-shelving.html',
  'projects/the-driving-spot.html', 'projects/wazer-taxis.html'
];

let changed = 0;
let skipped = [];

for (const rel of TARGET_FILES) {
  const filePath = path.join(ROOT, rel);
  const depth = rel.split('/').length - 1;
  const prefix = '../'.repeat(depth);
  const scriptTag = `    <script defer src="${prefix}assets/js/cookie-consent.js"></script>\n`;

  const contents = fs.readFileSync(filePath, 'utf8');
  if (contents.includes('cookie-consent.js')) {
    skipped.push(rel + ' (already included)');
    continue;
  }
  if (!contents.includes('</body>')) {
    skipped.push(rel + ' (no </body> found)');
    continue;
  }
  const updated = contents.replace('</body>', scriptTag + '</body>');
  fs.writeFileSync(filePath, updated, 'utf8');
  changed++;
}

console.log(`Updated ${changed} of ${TARGET_FILES.length} files.`);
if (skipped.length) {
  console.log('Skipped:');
  skipped.forEach((s) => console.log('  - ' + s));
}
