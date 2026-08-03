# Conversion-Centered Design pass: color system + Home/Services structure

Date: 2026-08-03
Status: Approved for planning

## Context

WebOctals' color system (`assets/css/styles.css`) is shared across all ~17 pages via CSS custom properties, so a token-level change cascades everywhere automatically. The current palette (`--color-bg` cream, `--color-accent` terracotta, `--color-accent-2` sage) is applied uniformly to icons, tags, decorative SVG art, links, and buttons alike via `--primary-color` / `--gradient-primary`, which are referenced 60+ times in the stylesheet.

Evaluated against the Conversion-Centered Design (CCD) framework (Oli Gardner / Unbounce — 7 principles: Focus, Structure, Consistency, Show Benefits, Draw Attention, Design for Trust, Reduce Friction), three concrete gaps were identified:

1. **Principle 5 (Draw Attention) violated by signal dilution**: the same accent color means "icon," "tag," "link," and "button" simultaneously, so it stops signaling "click me." Primary-button text (`1rem`) is also the same size as body copy.
2. **Principle 6 (Design for Trust) is weak**: no client testimonials exist anywhere in the codebase (verified — none in `projects/*.html` or `clients/*.html`), and the one social-proof element on the homepage ("Trusted by" — plain text company names) sits after a 10-card project grid, buried low in the hierarchy.
3. **Principle 1/7 (Focus / Reduce Friction) — `contact.html` has no lead form.** It only offers `mailto:`/`tel:` links and social icons, meaning the dedicated conversion page has *more* friction than the homepage's embedded quick-contact form. **Explicitly out of scope for this pass** — `contact.html` will not be modified. `services.html`'s CTAs currently point at this form-less page and will be repointed to the homepage's working form instead.

## Decisions made during brainstorming

- Palette direction: **"Warm Editorial, Evolved"** — keep the terracotta/sage/cream brand identity for decorative use (it differentiates from generic blue/purple AI-agency palettes); add one new reserved color used exclusively for conversion elements.
- Rollout scope: global color-system change (ships to all pages via `styles.css`) now; deep CCD structural work on **Home and Services only** for this pass. `contact.html` is untouched.
- No fabricated testimonials — CCD Principle 6 explicitly warns that fake-looking testimonials erode trust, and none exist in the codebase. Social-proof additions will use truthful "results snapshot" copy sourced from existing project case studies (business name, what was built, outcome), not invented first-person quotes.

## 1. Color system — reserved CTA token

Add a new OKLCH scale, verified for contrast (script-checked against WCAG, see below), hue 29 (a vivid coral-red — same warm family as terracotta but far more saturated/darker, so it reads as "the brand's action color," not a fourth unrelated hue):

```css
--color-cta-100: oklch(94.0% 0.035 29);   /* #ffe3de — tint, focus rings / light highlight bg */
--color-cta-400: oklch(65.0% 0.185 29);   /* #ea5748 — lighter state, subtle highlights */
--color-cta-500: oklch(55.0% 0.205 29);   /* #ce241b — PRIMARY CTA background */
--color-cta-600: oklch(47.0% 0.195 29);   /* #ae0000 — hover */
--color-cta-700: oklch(39.0% 0.175 29);   /* #8b0000 — active/pressed */
--text-on-cta: #fff8f0;                    /* near-white, for text on cta-500/600/700 */
```

Verified contrast (WCAG 2.1 relative luminance, computed via OKLCH→sRGB):
- `cta-500` vs cream bg (`#f5ead8`): **4.53:1** (passes AA for large text / UI components)
- `text-on-cta` (`#fff8f0`) on `cta-500`: **5.39:1** (passes AA for normal text)
- `cta-500` vs the existing `--color-error` (`#b3492f`): distinct in both luminance and saturation — cta-500 is far more saturated/vivid, error stays muted/rust — so they won't read as the same signal despite both being in the red family.

**Scope of use — deliberately narrow.** These tokens are wired into conversion elements only:
- `.btn-primary` (background → `--color-cta-500`, hover → `--color-cta-600`, text → `--text-on-cta`) — this affects every `.btn-primary` instance sitewide (hero, quick-contact submit, nav-cta, final-cta, service-hero-cta, services-cta-section), which is intended: every "primary action" button on every page becomes the reserved color, automatically, via the shared stylesheet.
- Form `input:focus` / `textarea:focus` ring color.
- The quick-contact form card's accent border/highlight.

**Explicitly NOT changed:** `--primary-color`, `--gradient-primary`, `--color-accent`, `--color-accent-2`, and every decorative usage currently wired to them (icons, tags, project-card SVG art, section dividers, text-shadows, glows, underlines, `.btn-outline`/`.btn-secondary` styling). These keep the existing terracotta/sage system untouched — this is what makes the reserved color meaningful (Principle 3: stay consistent, don't introduce a 4th+ unrelated hue; Principle 5: reserve the boldest color for CTAs only).

## 2. Button system (Principle 5)

- `.btn-primary` font-size increases from `1rem` to `1.125rem` with the existing `700` weight on the inner `span` kept, plus a stronger `box-shadow` using the new cta color — enough to read as clearly the loudest interactive element per section without becoming disproportionate (a literal 2x-body-copy button would look oversized for something like `.nav-cta`).
- `.btn-secondary` / `.btn-outline` get slightly reduced visual weight (thinner border or muted color) relative to `.btn-primary` so each section reads as having one obvious primary action, with the secondary link available but visually quieter.

## 3. Homepage (`index.html`) — Principles 2 & 6

- Add a condensed proof strip directly under/near the `quick-contact` section (client names + one strong aggregate stat, e.g. years of experience / projects delivered), so trust signals appear at the point of highest intent instead of only after the 10-card project grid.
- Add 3 "results snapshot" cards using real, truthful copy adapted from existing case studies (e.g. Quick Fit Shelving's "clean, information-first site... built for the kind of quick, practical searches trade customers actually make") — framed as outcome highlights, not first-person quotes attributed to a named client.
- `final-cta` section: keep `.btn-primary` as the sole reserved-color element; keep `.btn-outline` visually recessive so there's no competition at the page's last conversion moment.

## 4. Services page (`services.html`) — Principles 1 & 5

- Both CTAs in `.services-cta-section` (currently `.btn-primary` → `contact.html` and `.btn-outline` "Schedule a Call" → `contact.html`) get repointed to `index.html#quick-contact`, since that's the only page with a working lead form. This is a same-scope, low-risk fix that avoids sending traffic to a dead-end without touching `contact.html` itself.
- Same reserved-CTA-color styling applies automatically via the shared `.btn-primary` class.
- Add a lightweight stat/trust strip (reusing the homepage's stats-bar pattern) since the page currently has zero social proof before its CTA.

## Explicitly out of scope

- `contact.html` — no changes (user decision).
- No new photography or real client testimonials — none exist in the codebase; fabricating them would violate CCD Principle 6 and is not something to do regardless of framework guidance.
- No changes to the other ~13 pages (service sub-pages, about, blog, projects, clients) in this pass — the color-token change reaches them for free via `styles.css`, but no structural CCD work is planned for them here.

## Verification plan

- Re-run the OKLCH/contrast check script against the final CSS values as implemented.
- Visual check in a browser (light and dark OS theme not applicable — site is single-theme) at desktop and mobile widths for Home and Services.
- Confirm `.btn-outline`/`.btn-secondary` still meet 3:1 non-text contrast against their backgrounds after weight reduction.
- Click through every `.btn-primary` on Home and Services to confirm none silently broke (nav-cta, hero CTAs, quick-contact submit, services grid links, final CTA).
