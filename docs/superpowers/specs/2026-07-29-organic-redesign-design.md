# WebOctals Organic Redesign

## Context

WebOctals (this repo) is a static, multi-page marketing site built with Parcel and vanilla JS/CSS — no framework, no HTML templating/includes. It currently uses a blue/purple "AI" palette (`--primary-color: #2563eb` etc., Inter + JetBrains Mono) defined in `assets/css/styles.css` (~136KB) and duplicated header/footer markup across ~20 HTML files.

The user has a Claude Design project, "Complete website rebuild and redesign" (`https://claude.ai/design/p/b97ec6e0-fa49-4eb9-8996-0feac168ab7c`), built against the **Organic** design system (`https://claude.ai/design/p/ae21bdda-9705-4c97-9d04-211082a40941`). That project contains one file, `WebOctals Landing.dc.html` — a homepage mockup in Claude Design's proprietary interactive component format (`x-dc` custom elements, `{{ }}` bindings, a React-based `DCLogic` component class, `support.js` runtime). That format is not deployable as-is; this spec translates its visual design (structure, layout, copy patterns, motion) into plain HTML/CSS/vanilla JS matching the site's actual stack.

Organic, per its design-system readme: warm cream ground (`--color-bg` #f5ead8), near-black text (#201e1d), terracotta accent (`--color-accent` #c67139) and sage second accent (`--color-accent-2` #7a8a5e), each with a generated 100–900 tonal ramp. Caprasimo for display headings over Figtree for body. 16px base radius growing to pill buttons (999px) and 28px containers. Left-aligned asymmetric layouts, over-rounded soft shapes, washed/desaturated photography, Lucide icons at `stroke-width: 2.75`. Interactive states themed from the accent ramp; `:focus-visible` gets a 2px accent ring, never the browser default.

## Scope

Full site redesign in one effort, adopting Organic as the site's new visual foundation. In scope:

- `index.html` — full rebuild to match the mockup's section structure
- `about.html`, `contact.html`, `services.html`, `team.html` — re-skin, same content/structure
- `ai-agents.html`, `digital-products.html`, `product-development.html`, `automation.html`, `web-development.html`, `seo.html` — re-skin
- `on-page-seo.html`, `technical-seo.html`, `machine-learning.html` — re-skin
- `blog/index.html` + the 4 blog post pages — re-skin, including `blog/blog-styles.css`
- `assets/css/styles.css`, `assets/js/main.js` (styling hooks only, not behavior), `assets/js/contact-form-handler.js` (styling hooks only)

Explicitly out of scope (left as-is): `services-old.html`, `performance-template.html`, `analytics-template.html` — deprecated/dev-scaffolding files, not live customer-facing pages.

Not building: a header/footer templating or include mechanism. Header/footer markup stays duplicated by hand across every HTML file, matching the site's existing pattern — this redesign is a visual pass, not a build-system change.

## Foundation: tokens, fonts, icons

Replace the `:root` token block in `assets/css/styles.css` (and the equivalent block `blog/blog-styles.css` reads from) with Organic's tokens verbatim: the bg/text/accent/accent-2 values, the neutral/accent/accent-2 100–900 ramps (generated in OKLCH per the source `styles.css` in the Claude Design project), `--font-heading`/`--font-body`, the `--space-*` scale, `--radius-sm/md/lg`, and `--shadow-sm/md/lg`.

Every hardcoded hex color and one-off px value in the current stylesheet gets rewritten to reference these variables — this is the actual "adopt the design system" work, not a copy-paste of new colors on top of old rules. `--theme-color` in each page's `<meta name="theme-color">` tag updates to `--color-accent` (#c67139).

Fonts: replace the Inter/JetBrains Mono Google Fonts `<link>` (and its `<noscript>` fallback) in every page's `<head>` with Caprasimo + Figtree, same async-load pattern (`media="print" onload="this.media='all'"` + noscript fallback) already in use.

Icons: redraw the ~9 inline SVG icons in Lucide's style at `stroke-width: 2.75` (rounder, heavier), matching the mockup's icon treatment. No icon library dependency — inline SVG, same as today.

Component classes: add Organic's `.btn`/`.btn-primary`/`.btn-secondary`/`.btn-ghost`/`.btn-icon`, `.tag`/`.tag-accent`/`.tag-accent-2`/`.tag-neutral`/`.tag-outline`, `.card`/`.card-kicker`/`.card-title`/`.card-body`/`.card-meta` + `.elev-sm/md/lg`, `.field`/`.input`/`.radio`/`.seg`, `.nav`/`.nav-brand`, `.table`, `.dialog-backdrop`/`.dialog`, and `.washed` (image wrapper) to `styles.css`. Every page uses these classes instead of ad-hoc per-page styling.

## Shared components

**Header/nav** (every page): sticky, `backdrop-filter: blur` cream background matching the mockup. Logo redrawn as the mockup's circular node-graph mark in accent colors, `WebOctals` in Caprasimo beside it. A hover/click **mega-menu** under "Services": two featured services (icon + title + one-line description) plus four plain links to the rest, opening below the "Services" nav item. Other nav links (`Work`, `Clients`, `FAQ` on the homepage; adapted per-page elsewhere) as plain links. A pill-shaped `.btn-primary` CTA on the right ("Start a project"). Mobile: existing hamburger-toggle pattern (`#hamburger` / nav-menu class toggle already in `main.js`) restyled, mega-menu collapses to a flat link list.

**Footer** (every page): WebOctals mark + one-line tagline, then three link columns (Services, Company, Get in touch) in a responsive grid, copyright line below. Matches the mockup's structure exactly.

**Buttons/tags/cards/forms**: swapped to the shared classes above everywhere they appear.

**FAQ accordion**: native `<details>`/`<summary>`, styled per the mockup (no JS).

**Chatbot widget**: existing logic in `assets/js/main.js` (rule-based response chatbot) keeps its current behavior; only its UI (bubble, panel, input) gets restyled to the Organic look (rounded, `--color-accent` accents, `--font-heading` for its title).

**Contact forms**: two instances, both bound by the same unchanged `contact-form-modern` class/handler (`assets/js/contact-form-handler.js`) and analytics wiring (`assets/js/contact-analytics.js`) — no JS changes, fields/button restyled to `.field`/`.input`/`.btn-primary`, pill-shaped text inputs matching the mockup.

- **Homepage quick contact form** (new, in the Quick Contact section below): 4 fields only — Name, Email, Phone, Message — professional B2B tone, no company/service/budget/newsletter fields. `collectFormData` in the handler already defaults absent fields to empty strings, so the shorter field set submits cleanly to the existing Google Sheets endpoint.
- **`contact.html` form**: unchanged, full 7-field version (name, email, company, phone, service, budget, message, newsletter) for visitors who land there directly wanting to give full project detail.

## Homepage (`index.html`)

Rebuilt section-by-section to match `WebOctals Landing.dc.html`'s structure, translated to plain HTML/CSS/vanilla JS:

1. **Hero** — eyebrow tag ("Senior engineers · UK based · shipping since 2019" or the real current equivalent), large Caprasimo headline, subhead, two CTA buttons, a row of checkmark trust bullets, and decorative art on the right (concentric dashed/solid rotating rings via CSS `@keyframes`, a floating accent-colored "8" mark, 2-3 floating stat/status chips) — hidden below 860px per the mockup's own responsive rule.
2. **Quick Contact** (new) — placed immediately after the hero. Two columns on desktop (short pitch copy + trust bullets on the left, the 4-field quick contact form on the right in a `.card`/`.elev-md`), stacking to one column below 860px. This is the primary top-of-funnel conversion point for the page; see the quick contact form spec under Shared components above.
3. **Stats bar** — dark sage (`--color-accent-2-800`) rounded panel, 4 stats with count-up-on-scroll animation (`IntersectionObserver` + `requestAnimationFrame`, matching the mockup's counter logic) — using WebOctals' real numbers (sourced from current site copy/analytics, not the mockup's placeholder figures).
4. **"What does WebOctals do?"** — two-column intro pulled from the current site's `llms.txt`/about copy.
5. **Services grid** — 6 cards (one per service page), icon + title + description + "Explore →" link, alternating accent/accent-2 icon tinting per the mockup.
6. **Work / case studies** — card grid using the site's real projects (sourced from current site content) in the mockup's card style (washed image slot, tag, title, description, 2 metric callouts) — real metrics where available, otherwise omitted rather than inventing numbers.
7. **Testimonials + trusted-by** — real quotes/client info from the current site, mockup's card layout; real client logos in the trusted-by grid.
8. **FAQ** — reuse the current site's FAQ content (already schema-marked per `llms.txt`) in the accordion.
9. **Final CTA** — dark sage panel, headline + copy + two buttons (primary → `contact.html` for visitors wanting the full detailed form, secondary → services). No form here — the homepage's only form is the Quick Contact section near the top, avoiding duplication.
10. **Footer** — as specified above.

## Interior pages

**About / Contact / Services / Team**: current content and page structure preserved; header/footer replaced with the shared versions; section headings switched to Caprasimo; any card/list content switched to `.card`; hero areas adopt the warm-cream background with accent-colored highlight text, matching the homepage's visual voice without copying its specific hero layout.

**6 service pages + 2 SEO subpages + machine-learning.html**: same re-skin treatment; each service's icon/accent tinting stays consistent with its card on the homepage services grid (so a user recognizes AI Agents as "accent" and Automation as "accent-2" etc. across pages).

**Blog**: `blog/index.html` listing and the 4 post pages get the shared header/footer and Organic typography (Figtree body, Caprasimo headings) in `blog/blog-styles.css`; post content structure unchanged.

## Rollout phasing

1. Foundation — tokens, fonts, icons, shared component classes in `assets/css/styles.css` and `blog/blog-styles.css`.
2. Shared header/footer/mega-menu markup drafted once, then placed into every page.
3. Homepage full rebuild.
4. About / Contact / Services / Team.
5. 6 service pages + 2 SEO subpages + `machine-learning.html`.
6. Blog (`blog/index.html` + 4 posts).

## QA

Per phase: `npm run dev` (Parcel dev server), manually check each touched page — nav + mega-menu (desktop and the 860px mobile breakpoint), FAQ accordion, chatbot widget, contact form submission, count-up stats, hero decorative animation, `prefers-reduced-motion` fallback (the mockup already disables all animation under that media query — carry that rule over). After the final phase, `npm run build` to confirm the production Parcel build still compiles without errors across all page entry points in `package.json`'s `build`/`build:all` scripts.

## Out of scope / explicitly not doing

- No header/footer include/templating system — markup duplication stays as-is.
- No redesign of `services-old.html`, `performance-template.html`, `analytics-template.html`.
- No new placeholder content — every number/quote/case-study either comes from the current live site or is omitted.
- No change to chatbot logic, contact-form submit logic, or analytics wiring — styling only.

## Execution checklist

> Driven by /shahab-plan-executioner — do not hand-edit task IDs.

- [x] **T1** — Foundation: tokens, fonts, icons, shared component classes *(ai · effort l)*
- [x] **T2** — Draft shared header/footer/mega-menu markup *(ai · effort m · depends: T1)*
- [x] **T3** — Homepage: Hero + new Quick Contact section *(ai · effort l · depends: T2)*
- [x] **T4** — Homepage: stats/intro/services/work/testimonials/FAQ/final CTA/footer *(ai · effort l · depends: T3)*
- [x] **T5** — Interior pages re-skin: About / Contact / Services / Team *(ai · effort l · depends: T2)*
- [x] **T6** — Service pages + SEO subpages + machine-learning.html re-skin *(ai · effort l · depends: T2, T4)*
- [x] **T7** — Blog re-skin *(ai · effort m · depends: T2)*
- [x] **T8** — Final production build check *(ai · script: `npm run build:all` · effort s · depends: T3, T4, T5, T6, T7)*
