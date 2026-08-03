# AI-Native Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage hero (`index.html` `#home .hero`) with a full-bleed, animated, AI-native visual (CSS aurora background + a vanilla-JS neural-constellation canvas) and new AI-native headline copy, per `docs/superpowers/specs/2026-08-03-hero-redesign-design.md`.

**Architecture:** Two new visual layers stack behind centered hero copy inside `#home .hero`: (1) a CSS-only "aurora" layer of blurred, drifting gradient blobs using existing brand tokens, and (2) an HTML5 `<canvas>` painted by a new vanilla-JS module (`assets/js/hero-animation.js`) that draws drifting, connected "neural" nodes with one fixed, glowing center node standing in for the brand's "8" mark. No new npm dependency. Verification uses Playwright (already a devDependency) driving Parcel's local dev server (`npm run dev`, default port 1234) to make real, automated assertions instead of manual-only checks.

**Tech Stack:** Vanilla HTML/CSS/JS, Canvas 2D API, Parcel dev server, Playwright (verification only, not a new runtime dependency).

## Global Constraints

- No new npm dependency, no animation/canvas library — Canvas 2D + vanilla JS only.
- Reserved CTA color (`--color-cta-500/600/700`, `--text-on-cta`) must NOT be used decoratively — only `.btn-primary` and form-focus styling may use it. The one exception already approved in the spec is a single small, low-opacity (`0.22`) aurora blob using `--color-cta-400` as a "rare accent glow," not a large fill.
- Every animated element must respect `prefers-reduced-motion: reduce`. The two existing `@media (prefers-reduced-motion: reduce)` blocks in `assets/css/styles.css` (around line 3616 and line 7070) already force `animation-duration: 0.01ms !important` on `*`/`*::before`/`*::after` sitewide — this already neutralizes any new CSS `@keyframes` (including the aurora drift animations) with zero new CSS needed. Canvas rendering is not reachable by CSS, so `hero-animation.js` must do its own `window.matchMedia('(prefers-reduced-motion: reduce)')` check and never start its animation loop when it matches.
- `home.html` is an orphaned, unlinked file (confirmed: not referenced by any nav, any other HTML file, or any `package.json` build script) that happens to share several hero class names (`.hero`, `.hero-container`, `.hero-content`, `.hero-title`, `.hero-subtitle`, `.hero-buttons`, `.hero-trust-bullets`, `.hero-visual`, `title-line`, `title-ai`) with `index.html`'s current hero. To guarantee zero visual change to `home.html`: never edit those shared base rules directly; add only new rules scoped with the `#home` ID selector (unique to `index.html`'s hero `<section id="home" class="hero">` — `home.html`'s hero `<section>` has no `id`), and only delete CSS/markup confirmed exclusive to `index.html` (verified: `.hero-rings`, `.hero-ring`, `.hero-ring-dashed`, `.hero-ring-solid`, `.hero-mark-8`, `@keyframes hero-ring-spin`, `@keyframes hero-mark-float`, `.hero-chip*` are all exclusive to `index.html`).
- All new decorative colors must come from existing custom properties (`--color-accent-*`, `--color-accent-2-*`, `--color-cta-400` only as noted above) — no new hard-coded brand hues.
- CTA link hrefs, button labels, and trust-bullet copy stay exactly as they are today — only the headline/eyebrow/subtitle and the surrounding visual change.

---

### Task 1: Hero markup, copy, and full-bleed aurora layout

**Files:**
- Modify: `index.html:203-262` (the entire `<!-- Hero Section -->` ... `</section>` block)
- Modify: `assets/css/styles.css:564-571` (the `.hero` rule)
- Modify: `assets/css/styles.css:7518-7628` (the "Hero — eyebrow, trust bullets, decorative rings/mark/chips" section — full replacement)

**Interfaces:**
- Produces: `<section id="home" class="hero">` containing `.hero-aurora` (with 4 `.hero-aurora-blob` children), an empty `<canvas id="hero-canvas" class="hero-canvas" aria-hidden="true">` (Task 2 will paint it), `.hero-content` (with `.hero-eyebrow`, `.hero-title` + `.hero-title-highlight` span, `.hero-subtitle`, `.hero-buttons`, `.hero-trust-bullets`), three `.hero-chip` elements positioned at the hero's edges, and the unchanged `.scroll-indicator`.
- Consumes: existing tokens `--color-accent-400/600`, `--color-accent-2-400`, `--color-cta-400`, `--gradient-primary`, `--radius-pill`, `--radius-lg`, `--shadow-organic-md`, `--space-lg`, `--space-md`, and the existing `@keyframes glow` (defined at `styles.css:3357`).

- [ ] **Step 1: Replace the hero HTML markup and copy**

In `index.html`, replace the entire block from `<!-- Hero Section -->` through the `</section>` that immediately precedes `<!-- Quick Contact Section -->` (currently lines 203-262):

```html
    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="hero-aurora" aria-hidden="true">
            <span class="hero-aurora-blob hero-aurora-blob-1"></span>
            <span class="hero-aurora-blob hero-aurora-blob-2"></span>
            <span class="hero-aurora-blob hero-aurora-blob-3"></span>
            <span class="hero-aurora-blob hero-aurora-blob-4"></span>
        </div>
        <canvas id="hero-canvas" class="hero-canvas" aria-hidden="true"></canvas>
        <div class="hero-content">
            <span class="hero-eyebrow">AI-Native Digital Studio</span>
            <h1 class="hero-title">We don&rsquo;t add AI.<br>We build <span class="hero-title-highlight">with it.</span></h1>
            <p class="hero-subtitle">
                WebOctals designs and ships digital products, agents, and automation that are AI-native from the first line of code &mdash; not legacy systems with a chatbot bolted on.
            </p>
            <div class="hero-buttons">
                <a href="contact.html" class="btn btn-primary">
                    <span>Start Your AI Journey</span>
                    <div class="btn-glow"></div>
                </a>
                <a href="services.html" class="btn btn-secondary">
                    <span>Explore Services</span>
                </a>
            </div>
            <ul class="hero-trust-bullets">
                <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Certified AI development agency
                </li>
                <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Award-winning solutions
                </li>
                <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    24/7 support &amp; monitoring
                </li>
            </ul>
        </div>
        <div class="hero-chip hero-chip-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/></svg>
            <span>AI-Powered</span>
        </div>
        <div class="hero-chip hero-chip-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4.5 8-11V5l-8-3-8 3v6c0 6.5 8 11 8 11Z"/></svg>
            <span>Enterprise-grade</span>
        </div>
        <div class="hero-chip hero-chip-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Always-on support</span>
        </div>
        <div class="scroll-indicator">
            <div class="scroll-arrow"></div>
        </div>
    </section>
```

- [ ] **Step 2: Add `justify-content: center` to `.hero`**

In `assets/css/styles.css`, change:

```css
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding: 120px 0 80px;
}
```

to:

```css
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 120px 0 80px;
}
```

- [ ] **Step 3: Replace the hero decorative CSS section**

In `assets/css/styles.css`, replace the entire section starting at the comment `/* Hero — eyebrow, trust bullets, decorative rings/mark/chips */` through the end of the `@keyframes hero-chip-float` block that follows it (this is the section that currently defines `.hero-eyebrow`, `.hero-trust-bullets`, `.hero-rings`/`.hero-ring`/`.hero-ring-dashed`/`.hero-ring-solid`/`@keyframes hero-ring-spin`, `.hero-mark-8`/`@keyframes hero-mark-float`, and `.hero-chip*`/`@keyframes hero-chip-float`) with:

```css
/* Hero — AI-native full-bleed redesign: aurora background, neural
   constellation canvas, eyebrow, centered content, edge chips */
.hero-eyebrow {
    display: inline-flex;
    align-items: center;
    margin-bottom: var(--space-lg);
    padding: 6px 18px;
    border: 1px solid var(--color-accent-2-300);
    border-radius: var(--radius-pill);
    background: oklch(97% 0.012 65 / 0.6);
    color: var(--color-accent-2-700);
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.hero-title-highlight {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    animation: glow 3s ease-in-out infinite alternate;
}

#home .hero-content {
    position: relative;
    z-index: 2;
    max-width: 760px;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#home .hero-content::before {
    content: '';
    position: absolute;
    inset: -40px -60px;
    z-index: -1;
    background: radial-gradient(circle, oklch(97% 0.012 65 / 0.65) 0%, oklch(97% 0.012 65 / 0) 72%);
    border-radius: var(--radius-lg);
    pointer-events: none;
}

#home .hero-buttons {
    justify-content: center;
}

#home .hero-trust-bullets {
    justify-content: center;
}

#home .scroll-indicator {
    z-index: 2;
}

.hero-trust-bullets {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-lg);
    margin: var(--space-md) 0 0;
    padding: 0;
}

.hero-trust-bullets li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9375rem;
    color: var(--color-neutral-700);
}

.hero-trust-bullets svg {
    width: 18px;
    height: 18px;
    color: var(--color-accent-2-700);
    flex-shrink: 0;
}

.hero-aurora {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
}

.hero-aurora-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    opacity: 0.55;
    will-change: transform;
}

.hero-aurora-blob-1 {
    width: 480px;
    height: 480px;
    top: -10%;
    left: -8%;
    background: var(--color-accent-400);
    animation: hero-aurora-drift-1 22s ease-in-out infinite;
}

.hero-aurora-blob-2 {
    width: 420px;
    height: 420px;
    top: 20%;
    right: -12%;
    background: var(--color-accent-2-400);
    animation: hero-aurora-drift-2 26s ease-in-out infinite;
}

.hero-aurora-blob-3 {
    width: 360px;
    height: 360px;
    bottom: -12%;
    left: 15%;
    background: var(--color-accent-600);
    animation: hero-aurora-drift-3 30s ease-in-out infinite;
}

.hero-aurora-blob-4 {
    width: 260px;
    height: 260px;
    bottom: 5%;
    right: 10%;
    background: var(--color-cta-400);
    opacity: 0.22;
    animation: hero-aurora-drift-1 34s ease-in-out infinite reverse;
}

@keyframes hero-aurora-drift-1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(6%, 8%) scale(1.12); }
}

@keyframes hero-aurora-drift-2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-8%, 6%) scale(0.94); }
}

@keyframes hero-aurora-drift-3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(5%, -10%) scale(1.08); }
}

.hero-canvas {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.hero-chip {
    position: absolute;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: oklch(97% 0.012 65 / 0.55);
    backdrop-filter: blur(12px);
    border: 1px solid oklch(100% 0 0 / 0.4);
    border-radius: var(--radius-pill);
    box-shadow: var(--shadow-organic-md);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-text);
    animation: hero-chip-float 6s ease-in-out infinite;
}

.hero-chip svg {
    width: 16px;
    height: 16px;
    color: var(--color-accent);
}

.hero-chip-1 { top: 12%; left: 4%; animation-delay: 0s; }
.hero-chip-2 { bottom: 16%; left: 6%; animation-delay: 1.5s; }
.hero-chip-2 svg { color: var(--color-accent-2-700); }
.hero-chip-3 { bottom: 14%; right: 5%; animation-delay: 3s; }

@keyframes hero-chip-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
```

- [ ] **Step 4: Verify with Playwright against the Parcel dev server**

Run:

```bash
npm run dev > /tmp/parcel-dev.log 2>&1 &
echo $! > /tmp/parcel-dev.pid
for i in $(seq 1 30); do
  curl -sf http://localhost:1234 > /dev/null && break
  sleep 1
done
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:1234', { waitUntil: 'networkidle' });

  const heading = await page.textContent('#home .hero-title');
  if (!heading.includes('We don')) throw new Error('Headline text not found, got: ' + heading);

  const auroraCount = await page.locator('.hero-aurora-blob').count();
  if (auroraCount !== 4) throw new Error('Expected 4 aurora blobs, got ' + auroraCount);

  const oldRings = await page.locator('.hero-rings, .hero-mark-8').count();
  if (oldRings !== 0) throw new Error('Old .hero-rings/.hero-mark-8 markup still present');

  const chipCount = await page.locator('#home .hero-chip').count();
  if (chipCount !== 3) throw new Error('Expected 3 hero chips, got ' + chipCount);

  const canvasBox = await page.locator('#hero-canvas').boundingBox();
  if (!canvasBox || canvasBox.width < 200) throw new Error('hero-canvas is missing or too small');

  console.log('PASS: Task 1 hero markup/layout verified');
  await browser.close();
})().catch((err) => { console.error('FAIL:', err.message); process.exit(1); });
"
kill "$(cat /tmp/parcel-dev.pid)" 2>/dev/null
```

Expected: `PASS: Task 1 hero markup/layout verified` printed, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/styles.css
git commit -m "$(cat <<'EOF'
Redesign homepage hero: AI-native copy, full-bleed aurora layout

Replaces the two-column hero with a centered, full-bleed layout and
new AI-native headline. Adds the CSS aurora background layer and an
empty canvas element (painted by hero-animation.js in the next task).
Removes the now-unused .hero-rings/.hero-mark-8 markup, which was
exclusive to this hero.
EOF
)"
```

---

### Task 2: Neural constellation canvas (base render)

**Files:**
- Create: `assets/js/hero-animation.js`
- Modify: `index.html` (add one `<script defer>` tag)

**Interfaces:**
- Consumes: `#hero-canvas` element and `#home` section produced by Task 1; CSS custom properties `--color-accent-600`, `--color-accent-2-500`, `--color-cta-500`.
- Produces: a self-initializing `initializeHeroAnimation()` function (not exported — file follows the same `document.addEventListener('DOMContentLoaded', ...)` self-init pattern already used throughout `assets/js/main.js`) that paints and animates `#hero-canvas`. Task 3 will modify this same file to add guardrails.

- [ ] **Step 1: Create `assets/js/hero-animation.js`**

```javascript
// WebOctals - Hero neural constellation canvas
// Decorative animated background for the homepage hero (#hero-canvas).
// No-ops entirely if the canvas element isn't present on the page.

document.addEventListener('DOMContentLoaded', initializeHeroAnimation);

function initializeHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    const hero = document.getElementById('home');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    const styles = getComputedStyle(document.documentElement);
    const nodeColor = styles.getPropertyValue('--color-accent-600').trim();
    const lineColor = styles.getPropertyValue('--color-accent-2-500').trim();
    const markColor = styles.getPropertyValue('--color-cta-500').trim();

    const MAX_DIST = 150;
    let width = 0;
    let height = 0;
    let nodes = [];
    let markNode = null;
    let rafId = null;

    function nodeCountForWidth() {
        return window.innerWidth <= 768 ? 20 : 50;
    }

    function resize() {
        width = hero.clientWidth;
        height = hero.clientHeight;
        canvas.width = width;
        canvas.height = height;
        buildNodes();
    }

    function buildNodes() {
        const count = nodeCountForWidth();
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            radius: 1.5 + Math.random() * 1.5
        }));
        markNode = { x: width / 2, y: height / 2, radius: 14 };
    }

    function step() {
        nodes.forEach((node) => {
            node.x += node.vx;
            node.y += node.vy;
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;
        });

        ctx.clearRect(0, 0, width, height);

        const allNodes = nodes.concat([markNode]);
        for (let i = 0; i < allNodes.length; i++) {
            for (let j = i + 1; j < allNodes.length; j++) {
                const a = allNodes[i];
                const b = allNodes[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < MAX_DIST) {
                    ctx.strokeStyle = lineColor;
                    ctx.globalAlpha = (1 - dist / MAX_DIST) * 0.35;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = nodeColor;
        nodes.forEach((node) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 1;
        ctx.fillStyle = markColor;
        ctx.shadowColor = markColor;
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.arc(markNode.x, markNode.y, markNode.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        rafId = requestAnimationFrame(step);
    }

    window.addEventListener('resize', resize);
    resize();
    rafId = requestAnimationFrame(step);
}
```

- [ ] **Step 2: Wire the script into `index.html`**

Change:

```html
    <script defer src="assets/js/main.js"></script>
</body>
```

to:

```html
    <script defer src="assets/js/main.js"></script>
    <script defer src="assets/js/hero-animation.js"></script>
</body>
```

- [ ] **Step 3: Verify the canvas actually paints non-blank pixels**

```bash
npm run dev > /tmp/parcel-dev.log 2>&1 &
echo $! > /tmp/parcel-dev.pid
for i in $(seq 1 30); do
  curl -sf http://localhost:1234 > /dev/null && break
  sleep 1
done
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:1234', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  const nonBlankPixels = await page.evaluate(() => {
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let count = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) count++;
    }
    return count;
  });
  if (nonBlankPixels < 100) throw new Error('Canvas appears blank, non-transparent pixel count: ' + nonBlankPixels);

  console.log('PASS: Task 2 canvas renders, non-blank pixel count =', nonBlankPixels);
  await browser.close();
})().catch((err) => { console.error('FAIL:', err.message); process.exit(1); });
"
kill "$(cat /tmp/parcel-dev.pid)" 2>/dev/null
```

Expected: `PASS: Task 2 canvas renders, non-blank pixel count = <N>` with N well above 100, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add assets/js/hero-animation.js index.html
git commit -m "Add neural constellation canvas animation to homepage hero"
```

---

### Task 3: Accessibility and performance guardrails

**Files:**
- Modify: `assets/js/hero-animation.js` (full-file replacement of `initializeHeroAnimation`)

**Interfaces:**
- Consumes: same `#hero-canvas`/`#home` elements as Task 2.
- Produces: the same self-initializing behavior, now additionally gated by `prefers-reduced-motion`, paused via `IntersectionObserver` when the hero scrolls out of view, and offering a small pointer-parallax effect on `pointer: fine` devices.

- [ ] **Step 1: Replace the entire contents of `assets/js/hero-animation.js`**

```javascript
// WebOctals - Hero neural constellation canvas
// Decorative animated background for the homepage hero (#hero-canvas).
// No-ops entirely if the canvas element isn't present on the page.

document.addEventListener('DOMContentLoaded', initializeHeroAnimation);

function initializeHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    const hero = document.getElementById('home');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    const styles = getComputedStyle(document.documentElement);
    const nodeColor = styles.getPropertyValue('--color-accent-600').trim();
    const lineColor = styles.getPropertyValue('--color-accent-2-500').trim();
    const markColor = styles.getPropertyValue('--color-cta-500').trim();

    const MAX_DIST = 150;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointerFine = window.matchMedia('(pointer: fine)').matches;

    let width = 0;
    let height = 0;
    let nodes = [];
    let markNode = null;
    let rafId = null;
    let running = false;
    let pointerX = 0;
    let pointerY = 0;
    let pointerTargetX = 0;
    let pointerTargetY = 0;

    function nodeCountForWidth() {
        return window.innerWidth <= 768 ? 20 : 50;
    }

    function resize() {
        width = hero.clientWidth;
        height = hero.clientHeight;
        canvas.width = width;
        canvas.height = height;
        buildNodes();
        drawFrame();
    }

    function buildNodes() {
        const count = nodeCountForWidth();
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            radius: 1.5 + Math.random() * 1.5
        }));
        markNode = { x: width / 2, y: height / 2, radius: 14 };
    }

    function drawFrame() {
        ctx.clearRect(0, 0, width, height);

        const offsetX = pointerX * 12;
        const offsetY = pointerY * 12;

        const allNodes = nodes.concat([markNode]);
        for (let i = 0; i < allNodes.length; i++) {
            for (let j = i + 1; j < allNodes.length; j++) {
                const a = allNodes[i];
                const b = allNodes[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < MAX_DIST) {
                    ctx.strokeStyle = lineColor;
                    ctx.globalAlpha = (1 - dist / MAX_DIST) * 0.35;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x + offsetX, a.y + offsetY);
                    ctx.lineTo(b.x + offsetX, b.y + offsetY);
                    ctx.stroke();
                }
            }
        }

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = nodeColor;
        nodes.forEach((node) => {
            ctx.beginPath();
            ctx.arc(node.x + offsetX, node.y + offsetY, node.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 1;
        ctx.fillStyle = markColor;
        ctx.shadowColor = markColor;
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.arc(markNode.x + offsetX, markNode.y + offsetY, markNode.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    function step() {
        if (!running) return;

        nodes.forEach((node) => {
            node.x += node.vx;
            node.y += node.vy;
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;
        });

        pointerX += (pointerTargetX - pointerX) * 0.05;
        pointerY += (pointerTargetY - pointerY) * 0.05;

        drawFrame();
        rafId = requestAnimationFrame(step);
    }

    function startLoop() {
        if (running || reducedMotion) return;
        running = true;
        rafId = requestAnimationFrame(step);
    }

    function stopLoop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    }

    if (pointerFine) {
        hero.addEventListener('mousemove', (event) => {
            const rect = hero.getBoundingClientRect();
            pointerTargetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            pointerTargetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                startLoop();
            } else {
                stopLoop();
            }
        });
    }, { threshold: 0 });

    window.addEventListener('resize', resize);
    resize();
    observer.observe(hero);

    if (reducedMotion) {
        drawFrame();
    }
}
```

- [ ] **Step 2: Verify reduced-motion produces a static (non-animating) canvas**

```bash
npm run dev > /tmp/parcel-dev.log 2>&1 &
echo $! > /tmp/parcel-dev.pid
for i in $(seq 1 30); do
  curl -sf http://localhost:1234 > /dev/null && break
  sleep 1
done
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:1234', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  async function snapshot() {
    return page.evaluate(() => {
      const canvas = document.getElementById('hero-canvas');
      return Array.from(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data).join(',');
    });
  }

  const first = await snapshot();
  await page.waitForTimeout(400);
  const second = await snapshot();

  if (first !== second) throw new Error('Canvas kept animating under prefers-reduced-motion: reduce');
  if (first.split(',').every((v) => v === '0')) throw new Error('Canvas is fully blank under reduced motion (expected one static frame)');

  console.log('PASS: Task 3 reduced-motion produces a static frame');
  await browser.close();
})().catch((err) => { console.error('FAIL:', err.message); process.exit(1); });
"
kill "$(cat /tmp/parcel-dev.pid)" 2>/dev/null
```

Expected: `PASS: Task 3 reduced-motion produces a static frame`, exit code 0.

- [ ] **Step 3: Verify the animation pauses when the hero scrolls out of view and resumes when it scrolls back**

```bash
npm run dev > /tmp/parcel-dev.log 2>&1 &
echo $! > /tmp/parcel-dev.pid
for i in $(seq 1 30); do
  curl -sf http://localhost:1234 > /dev/null && break
  sleep 1
done
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:1234', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  async function snapshot() {
    return page.evaluate(() => {
      const canvas = document.getElementById('hero-canvas');
      return Array.from(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data).join(',');
    });
  }

  // Scroll the hero out of view.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  const pausedFirst = await snapshot();
  await page.waitForTimeout(400);
  const pausedSecond = await snapshot();
  if (pausedFirst !== pausedSecond) throw new Error('Canvas kept animating while scrolled out of view');

  // Scroll back to the hero and confirm the loop resumes.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const resumedFirst = await snapshot();
  await page.waitForTimeout(400);
  const resumedSecond = await snapshot();
  if (resumedFirst === resumedSecond) throw new Error('Canvas did not resume animating after scrolling back into view');

  console.log('PASS: Task 3 IntersectionObserver pause/resume verified');
  await browser.close();
})().catch((err) => { console.error('FAIL:', err.message); process.exit(1); });
"
kill "$(cat /tmp/parcel-dev.pid)" 2>/dev/null
```

Expected: `PASS: Task 3 IntersectionObserver pause/resume verified`, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add assets/js/hero-animation.js
git commit -m "Add reduced-motion, off-screen pause, and pointer parallax to hero canvas"
```

---

### Task 4: Full regression pass

**Files:** none (verification only — fix-forward in the relevant file from Tasks 1-3 if any check fails)

**Interfaces:**
- Consumes: the complete hero from Tasks 1-3.
- Produces: a verified, shippable hero section.

- [ ] **Step 1: Run a responsive + interaction + console-error regression check**

```bash
npm run dev > /tmp/parcel-dev.log 2>&1 &
echo $! > /tmp/parcel-dev.pid
for i in $(seq 1 30); do
  curl -sf http://localhost:1234 > /dev/null && break
  sleep 1
done
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();

  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

    await page.goto('http://localhost:1234', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const heroBox = await page.locator('#home').boundingBox();
    if (!heroBox || heroBox.height < 300) throw new Error(\`[\${viewport.width}px] hero section missing or too short\`);

    const contentBox = await page.locator('#home .hero-content').boundingBox();
    const heroCenterX = heroBox.x + heroBox.width / 2;
    const contentCenterX = contentBox.x + contentBox.width / 2;
    if (Math.abs(heroCenterX - contentCenterX) > 5) throw new Error(\`[\${viewport.width}px] hero content is not horizontally centered\`);

    if (errors.length > 0) throw new Error(\`[\${viewport.width}px] console errors: \` + errors.join(' | '));

    await page.close();
  }

  // CTA click-through check (desktop viewport).
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:1234', { waitUntil: 'networkidle' });
  await Promise.all([
    page.waitForURL('**/services.html'),
    page.click('#home .hero-buttons a[href=\"services.html\"]')
  ]);

  console.log('PASS: Task 4 full regression check (responsive, no console errors, CTA navigation)');
  await browser.close();
})().catch((err) => { console.error('FAIL:', err.message); process.exit(1); });
"
kill "$(cat /tmp/parcel-dev.pid)" 2>/dev/null
```

Expected: `PASS: Task 4 full regression check (responsive, no console errors, CTA navigation)`, exit code 0. If any check fails, fix the specific issue in the file from the relevant earlier task (Task 1 for layout/centering, Task 2/3 for canvas/console errors) and re-run this step before proceeding.

- [ ] **Step 2: Manual final look**

Run `npm run dev`, open `http://localhost:1234` in a real browser, and confirm subjectively: the aurora drifts smoothly, the neural constellation reads as "alive" without being distracting, the headline is fully legible against the animated background at both desktop and mobile widths, and the three chips don't overlap the centered text column.

- [ ] **Step 3: Commit (only if Step 1 required fixes)**

```bash
git add index.html assets/css/styles.css assets/js/hero-animation.js
git commit -m "Fix hero regression issues found in full verification pass"
```

If no fixes were needed, skip this commit — Tasks 1-3 already captured the shippable state.
