/**
 * Generates the social share card used by every page's og:image / twitter:image.
 *
 * This is the picture chat apps (WhatsApp, Slack, iMessage, LinkedIn, Discord)
 * show when someone pastes a weboctals.com link. It is deliberately 1200x630 —
 * the 1.91:1 ratio every major platform crops to for a "large" card.
 *
 * Run after changing the logo, brand colours or the strapline:
 *   node scripts/generate-og-card.js
 *
 * Output: assets/images/og-card.png (committed, so the site never depends on
 * this script at build or deploy time).
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets/images/og-card.png');
const LOGO = path.join(ROOT, 'assets/images/icons/logo-mark.png');

// Brand tokens, mirrored from assets/css/system.css. Kept literal so the card
// renders identically without pulling the whole stylesheet in.
const GROUND = '#0d2724';
const RECESS = '#08201d';
const MINT = '#8afc96';
const INK = '#c9f9d7';
const DIM = 'rgb(201 249 215 / 0.62)';
const LINE = 'rgb(201 249 215 / 0.16)';

const logoDataUri = `data:image/png;base64,${fs.readFileSync(LOGO).toString('base64')}`;

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;800&display=swap">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: ${GROUND};
    font-family: 'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: ${INK};
    display: flex; flex-direction: column; justify-content: center;
    padding: 92px 96px;
    position: relative; overflow: hidden;
  }
  /* Soft mint bloom, echoing the site's dark-on-dark depth. */
  body::before {
    content: ''; position: absolute; top: -280px; right: -220px;
    width: 820px; height: 820px; border-radius: 50%;
    background: radial-gradient(circle, rgb(138 252 150 / 0.16) 0%, rgb(138 252 150 / 0) 68%);
  }
  body::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(180deg, rgb(13 39 36 / 0) 55%, ${RECESS} 100%);
  }
  .inner { position: relative; z-index: 1; }
  .lockup { display: flex; align-items: center; gap: 28px; margin-bottom: 44px; }
  .lockup img { width: 104px; height: 104px; }
  .wordmark { font-size: 78px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
  .wordmark .accent { color: ${MINT}; }
  /* Width tuned so the strapline breaks after "automation" — two balanced
     lines, no orphaned word on a third. */
  .strapline {
    font-size: 42px; font-weight: 600; line-height: 1.28;
    letter-spacing: -0.015em; max-width: 720px;
  }
  .strapline .accent { color: ${MINT}; }
  .foot {
    position: absolute; z-index: 1; left: 96px; right: 96px; bottom: 64px;
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 30px; border-top: 1px solid ${LINE};
    font-size: 25px; color: ${DIM};
  }
  /* Domain and email carry the readable ink; the "UK studio" qualifier stays
     dimmed so both contact routes stand out at thumbnail size. */
  .foot .domain, .foot .email { font-weight: 600; color: ${INK}; }
</style>
</head>
<body>
  <div class="inner">
    <div class="lockup">
      <img src="${logoDataUri}" alt="">
      <span class="wordmark">Web<span class="accent">Octals</span></span>
    </div>
    <div class="strapline">Websites, agents and automation <span class="accent">that hold up in use</span></div>
  </div>
  <div class="foot">
    <span class="domain">weboctals.com</span>
    <span>UK studio &middot; <span class="email">contact@weboctals.co.uk</span></span>
  </div>
</body>
</html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: 'networkidle' });
  // Don't screenshot before the webfont swaps in, or the card ships in the
  // fallback face.
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: OUT, type: 'png' });
  await browser.close();

  const { size } = fs.statSync(OUT);
  console.log(`Wrote ${path.relative(ROOT, OUT)} — 1200x630, ${(size / 1024).toFixed(0)} KB`);
})();
