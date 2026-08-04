# Logo mark redesign

## Context

The WebOctals site logo is a lockup of an inline SVG icon (`.logo-mark`) plus a text wordmark (`.logo-text`: "Web" + accent-colored "Octals"). It appears in the nav and footer of every page, and a matching shape is used as `favicon.svg`.

Current mark: a thin dashed circle (r=13, `stroke-dasharray="2.5 3.5"`) with three lines forming a triangle between three node-dots. It doesn't tie to "Octals" (base-8) conceptually, and the thin dashed stroke is hard to read at favicon size (16–32px).

## Goal

Redesign the icon mark only (wordmark untouched) to be:
- Legible at tiny sizes (favicon/tab icon) — the primary versatility requirement
- Conceptually tied to "8" (Octals = octal = base-8)
- An evolution of the current motif (keep the node-dot vocabulary and two-tone accent palette), not a wholesale departure

Three concepts were sketched and compared side by side (large + 16px favicon size) via the brainstorming visual companion: a figure-8 nodes mark, an 8-segment ring, and an octagon constellation. **Figure-8 nodes** was selected — it reads clearly as "8," uses bold strokes that hold up at tiny sizes, and reuses the existing node-dot idea.

## Design

New mark, same `32×32` viewBox and `logo-mark` CSS class (no CSS/layout changes required):

```html
<svg class="logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="10" r="7" stroke="var(--color-accent-2)" stroke-width="2.2"/>
    <circle cx="16" cy="22" r="7" stroke="var(--color-accent)" stroke-width="2.2"/>
    <circle cx="16" cy="3" r="2.4" fill="var(--color-accent-2)"/>
    <circle cx="16" cy="16" r="2.4" fill="var(--color-accent)"/>
    <circle cx="16" cy="29" r="2.4" fill="var(--color-accent)"/>
</svg>
```

- Top ring: sage (`--color-accent-2`, `#7a8a5e`)
- Bottom ring: terracotta (`--color-accent`, `#c67139`)
- Three node-dots at apex, waist (ring overlap), and base — carries over the "node" vocabulary from the current mark
- No dashing, no thin (<2px) strokes — degrades gracefully to two solid rings at favicon size

`favicon.svg` gets the same shape (with literal hex colors instead of CSS vars, since it's used standalone outside the page's CSS context).

## Scope

**In scope:**
- `favicon.svg` — replace with the new mark (hex colors)
- 37 live, linked source HTML files — replace both occurrences (`nav-logo` and `footer-logo`) of the `<svg class="logo-mark">...</svg>` block, which is byte-identical across all of them today
- Files: `index.html`, `about.html`, `contact.html`, `services.html`, `seo.html`, `on-page-seo.html`, `technical-seo.html`, `product-development.html`, `web-development.html`, `ai-agents.html`, `digital-products.html`, `automation.html`, `machine-learning.html`, all of `blog/*.html`, `projects/*.html`, `clients/*.html`

**Out of scope:**
- Wordmark styling (`.logo-text`, `.logo-accent`, fonts) — unchanged
- `dist/` — build output from `npm run build:all` (Parcel), not hand-edited; regenerated after source changes
- `home.html`, `services-old.html` — orphaned legacy pages, not linked from navigation or sitemap, left untouched
- `manifest.json` — already references `assets/favicon.svg` by path, no change needed there
- `assets/images/icons/favicon.svg` — an unrelated, unreferenced legacy "AI neural gradient" icon (different design entirely, not linked from any HTML/manifest); left as dead asset, not part of this change

### Favicon file resolution (verified during research)

There are two copies of the live favicon: repo-root `favicon.svg` and `assets/favicon.svg` — currently byte-identical. `index.html`'s `<link rel="icon" href="/assets/favicon.svg">` and `manifest.json` both serve `assets/favicon.svg`, making it the actually-live file. The root-level `favicon.svg` is an unreferenced duplicate, but browsers/crawlers can still probe `/favicon.svg` by convention, so **update both copies identically** to avoid a stale duplicate resurfacing later.

## Verification

- Replace mark in all 37 files + the live favicon file(s)
- Run `npm run build:all`
- Spot check in browser via dev server (`npm run dev` or `npm run serve` after build): index/home nav, a client page, a blog page, and the browser tab favicon
