#!/usr/bin/env node
// Inserts Privacy Policy / Terms & Conditions links into the footer-bottom
// block of every live, deployed HTML page. Excludes home.html and
// services-old.html (orphaned, undeployed) and privacy.html/terms.html
// (already hand-authored with the links).

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

const OLD_BLOCK = `<div class="footer-bottom">
                <p>&copy; 2026 WebOctals. All rights reserved.</p>
            </div>`;

let changed = 0;
let skipped = [];

for (const rel of TARGET_FILES) {
  const filePath = path.join(ROOT, rel);
  const depth = rel.split('/').length - 1; // 0 for root, 1 for blog/projects/clients
  const prefix = '../'.repeat(depth);

  const newBlock = `<div class="footer-bottom">
                <p>&copy; 2026 WebOctals. All rights reserved.
                    <span class="footer-legal">
                        <a href="${prefix}privacy.html">Privacy Policy</a>
                        <span aria-hidden="true">&middot;</span>
                        <a href="${prefix}terms.html">Terms &amp; Conditions</a>
                    </span>
                </p>
            </div>`;

  const contents = fs.readFileSync(filePath, 'utf8');
  if (contents.includes('footer-legal')) {
    skipped.push(rel + ' (already has footer-legal)');
    continue;
  }
  if (!contents.includes(OLD_BLOCK)) {
    skipped.push(rel + ' (footer-bottom block did not match expected pattern)');
    continue;
  }
  const updated = contents.replace(OLD_BLOCK, newBlock);
  fs.writeFileSync(filePath, updated, 'utf8');
  changed++;
}

console.log(`Updated ${changed} of ${TARGET_FILES.length} files.`);
if (skipped.length) {
  console.log('Skipped:');
  skipped.forEach((s) => console.log('  - ' + s));
}
