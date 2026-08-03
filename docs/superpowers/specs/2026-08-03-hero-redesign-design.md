# Hero section redesign: AI-native, surreal, animated

Date: 2026-08-03
Status: Approved for planning

## Context

The homepage hero (`index.html`, `#home .hero`) currently uses a two-column layout: left column has the headline/subtitle/CTAs/trust bullets, right column has a static decorative visual (two rotating dashed/solid rings, a floating "8" brand mark in the center, and three floating pill-shaped chips: "AI-Powered", "Enterprise-grade", "Always-on support"). The background is the sitewide fixed `#particles-js` layer (opacity 0.3) plus a `.hero-gradient-bg` overlay.

The site uses a warm-editorial brand system (`assets/css/styles.css`): terracotta (`--color-accent-*`), sage (`--color-accent-2-*`), cream background, all in OKLCH. A reserved coral-red CTA color (`--color-cta-500`/`600`) exists exclusively for `.btn-primary` and form focus states — established by a prior Conversion-Centered Design pass — and must not be reused decoratively. The site is single-theme (no dark mode) and already has two `prefers-reduced-motion: reduce` media query blocks in `styles.css` that this work must extend, not duplicate. `npm run dev` runs a local Parcel dev server for visual verification.

Goal: replace the static hero visual with a genuinely animated, "AI-native" / surreal full-bleed backdrop, and rewrite the hero copy to lead with an AI-native positioning statement — while staying inside the existing brand palette and conversion-color rules, and without introducing a new animation library/dependency.

## Decisions made during brainstorming

- **Animation tech**: two layers, both built with what the project already has (vanilla CSS + vanilla JS via a new `assets/js/hero-animation.js`, loaded the same `<script defer>` way as the site's other scripts) — no new npm dependency, no canvas/animation library.
  1. **Aurora base layer (CSS-only)**: 3–4 large, heavily-blurred gradient blobs (`--color-accent-400/600`, `--color-accent-2-400`, with `--color-cta-400` used sparingly as a rare glow accent, never as a large fill) that slowly drift/morph via `@keyframes` and `filter: blur()`.
  2. **Neural constellation canvas**: a `<canvas>` layer drawing glowing nodes that drift slowly and connect with thin lines when near each other, colored from the same accent tokens. One node is fixed, larger, and permanently lit at the visual center, standing in for the current standalone "8" brand mark — the rings/8-mark DOM elements are removed as separate markup and folded into this canvas concept instead. Nodes parallax slightly toward the cursor on desktop (pointer devices only).
- **Layout**: full-bleed immersive hero. `.hero` becomes single-column and centered; the aurora + canvas fill the section edge-to-edge (`position: absolute; inset: 0`); content sits centered on top (`max-width: ~760px`, centered text) with a soft radial scrim behind the text block so copy stays readable regardless of where nodes drift underneath.
- **Chips**: the three existing floating chips ("AI-Powered", "Enterprise-grade", "Always-on support") are kept, restyled as glass-morphic badges, repositioned toward the edges of the hero so they don't compete with the centered text block. They keep their existing float animation.
- **CTAs**: unchanged structure and copy — `Start Your AI Journey` (primary, reserved CTA color) and `Explore Services` (secondary) — restyled only as needed to sit on the new background. No analytics/tracking impact since hrefs and structure stay the same.
- **Trust bullets**: unchanged copy (certified AI development agency / award-winning solutions / 24/7 support & monitoring), restyled to sit centered under the CTAs on the new background.
- **Scroll indicator**: unchanged.
- **Content direction**: "AI-native transformation" — positions WebOctals as building AI-native from day one, distinct from agencies that add AI as an afterthought.
  - Eyebrow: `AI-Native Digital Studio`
  - Headline: **"We don't add AI. We build with it."**
  - Subtitle: "WebOctals designs and ships digital products, agents, and automation that are AI-native from the first line of code — not legacy systems with a chatbot bolted on."

## Performance & accessibility guardrails

- Extend the existing `prefers-reduced-motion: reduce` blocks in `styles.css` (currently at two locations) to also cover the new aurora `@keyframes` (set to `animation: none`) and to tell `hero-animation.js` to skip its `requestAnimationFrame` loop, drawing one static frame instead.
- `IntersectionObserver` on the hero canvas pauses the rAF loop when the section scrolls out of view (mirrors the pattern already used for `initializeStatsCountUp` in `main.js`).
- Node count for the canvas scales down on narrow viewports (roughly 40% of desktop count) to protect frame rate on mobile.
- Canvas element is `aria-hidden="true"` and purely decorative; no impact on screen reader content, which continues to come from the real heading/paragraph/link markup.
- Mouse-parallax is gated behind a pointer-type check so it doesn't misbehave on touch devices.

## Implementation plan (high level)

- **`index.html`**: restructure the `.hero` markup — single centered content column (eyebrow, headline, subtitle, CTAs, trust bullets) plus a `<canvas id="hero-canvas" aria-hidden="true">` and an aurora blob container, replacing the current `.hero-container` two-column grid and the `.hero-rings`/`.hero-mark-8` markup. Chips markup stays but repositioned via CSS. New headline/subtitle copy per above.
- **`assets/css/styles.css`**: replace/rework the `.hero`, `.hero-container`, `.hero-content`, `.hero-visual`, `.hero-rings`, `.hero-mark-8` rules with the new full-bleed centered layout, aurora `@keyframes`, canvas positioning, scrim, and repositioned chip placement; extend both existing `prefers-reduced-motion` blocks.
- **`assets/js/hero-animation.js`** (new file): canvas node/line rendering loop, `IntersectionObserver` pause, reduced-motion check, pointer-parallax (desktop only), mobile node-count scaling. Wired up with its own `DOMContentLoaded` listener, following the existing pattern in `main.js`, and guarded to no-op if `#hero-canvas` isn't present on the page.
- **`index.html` script tags**: add `<script defer src="assets/js/hero-animation.js">` alongside the existing deferred scripts.

## Explicitly out of scope

- No changes to any other page's hero (`services.html`, `contact.html`, service sub-pages, blog) — this pass is the homepage hero only.
- No new npm dependency / animation library.
- No change to the reserved CTA color's scope of use (still buttons/form-focus only).
- No change to CTA hrefs, tracking attributes, or the quick-contact section below the hero.

## Verification plan

- `npm run dev` and visually check the hero at desktop and mobile widths.
- Toggle OS-level "reduce motion" and confirm the aurora stops animating and the canvas renders a static frame.
- Scroll the hero out of view and confirm (via a quick console check or perf tab) that the animation loop pauses.
- Confirm headline/CTA text is readable against the animated background at both narrow and wide viewports.
- Click through both hero CTAs to confirm hrefs/behavior are unchanged.
