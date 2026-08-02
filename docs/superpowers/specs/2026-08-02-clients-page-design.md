# Clients Section — Design Spec

Date: 2026-08-02

## Goal

Add a new "Clients" section to the site, separate from the existing "Projects" section, that showcases real client photography with Problem/Action/Results (PAR) case-study copy, SEO-optimised, reached via a new top-level nav item next to "Projects".

## Scope

- New nav item: "Clients", placed immediately after "Projects" in the main nav and in the footer's "Company" column, on every existing page and on the new pages themselves.
- New `clients/` directory (sibling of `projects/`):
  - `clients/index.html` — hero slider (all 7 clients) + a list/grid of client case-study cards below it.
  - One landing page per client: `clients/<slug>.html`.
- The existing "Projects" nav item and its 9 pages are **not modified**.

## Client → image → slug mapping

Only the 7 businesses that have a `client_*` photo in `assets/images/` are included. Ariana Kitchens & Bedrooms and Lumenlux (no photo) are Projects-only for now.

| Image | Business | Slug | Industry tag (from existing Projects copy) |
|---|---|---|---|
| `client_colindale_driving.jpeg` | Colindale Driving School | `colindale-driving-school` | Driving School — Colindale, London |
| `client_driving_spot.jpeg` | The Driving Spot | `the-driving-spot` | Driving School — Bedford & Peterborough |
| `client_fisher_chips.jpeg` | Fisherman's Chips | `fishermans-chips` | Food & Beverage — Bedford |
| `client_go_wazer.jpeg` | Wazer Taxis | `wazer-taxis` | Taxi & Transportation — Southampton |
| `client_hair_we_cut.jpeg` | Hair We Cut | `hair-we-cut` | Barber & Salon |
| `client_worldwide_exchange.jpeg` | A.R Worldwide | `ar-worldwide` | Financial Services (Currency Exchange) — Harrow |
| `quick_fit_move.jpeg` | Quick Fit Shelving Ltd | `quick-fit-shelving` | Trade Services — Wednesbury |

Facts (location, industry) must stay consistent with what's already published on `projects/index.html` and the individual `projects/*.html` pages, so the site never contradicts itself about the same client.

## `clients/index.html`

**Hero slider** (top of page, all 7 clients):
- Two-column slide layout (photo one side, content the other), reusing the visual language of the existing `.project-detail-hero` pattern.
- Each slide: client photo (`object-fit: cover`, 5:4 source images), business name, industry tag, one-sentence problem/result hook, "Read case study →" link. The whole slide links to that client's landing page.
- Auto-advances every 6s; pauses on hover/focus; prev/next arrow controls; dot indicators; basic touch swipe support.
- Implementation: new `initializeClientSlider()` function added to `assets/js/main.js` (guarded by element-existence check, following the file's existing `initialize*` pattern), no external carousel library. New CSS added to `assets/css/styles.css` using existing design tokens (`--color-accent`, `--color-accent-2`, `--space-*`, `--radius-md`, etc.).

**Client list** below the slider:
- Grid of 7 cards, extending the existing `.card` / `.project-card` styling conventions already used on `projects/index.html`.
- Each card: photo thumbnail, business name, industry tag, a one-sentence Problem teaser, "Read case study →" link to the landing page.

**SEO**: unique title/meta description/OG/Twitter tags, canonical `https://weboctals.com/clients/index.html`, `ItemList` JSON-LD listing all 7 clients (same pattern as `projects/index.html`).

## `clients/<slug>.html` (×7)

Same page skeleton as `projects/*.html`: nav (with "Clients" marked `active`), footer, AI chat widget, standard meta/OG/Twitter/canonical/PWA/favicon head block.

**Hero**: full client photo, business name, industry tag, location.

**Problem** (~150–250 words): the specific, plausible challenge for that business type/location before the new site — grounded in facts already established elsewhere on the site. No invented statistics.

**Action** (~150–250 words): what WebOctals built for them specifically (e.g. booking flow, online ordering, local-search-optimised structure, mobile-first design) — consistent with that business's existing Projects description.

**Results** (~150–250 words): qualitative, honest outcomes only. No fabricated metrics/percentages presented as fact (e.g. "a fast, mobile-first booking flow now live for Colindale-area searches" — not "+40% bookings").

**CTA**: "Start your project" button → `/contact.html`. Back-link → `clients/index.html`.

**SEO**: unique title/meta description/OG/Twitter tags, canonical URL, JSON-LD `@graph` containing:
- `BreadcrumbList` (Home → Clients → this client)
- An `Article`-style case-study entry (headline, description, `about` referencing the business, `author`/`publisher` → WebOctals Organization) — richer than the `CreativeWork` block used on `projects/*.html`, appropriate for case-study content.

## Site-wide rollout

- Add a "Clients" `<li class="nav-item">` immediately after the existing "Projects" `<li>` in the nav, across:
  - 18 existing root/`blog/*.html` pages (href `clients/index.html`, no `active` class)
  - 9 existing `projects/*.html` pages (href `../clients/index.html`)
  - The 8 new `clients/*.html` pages themselves (href `index.html` on the index page, `../clients/index.html` style within, `active` class applied on Clients pages)
- Add a "Clients" link immediately after "Projects" in the footer's "Company" link group, same file set.
- Because the existing nav/footer markup for "Projects" is consistent across files, this is done with a scripted find/insert (not manual per-file edits) to guarantee consistency and correct relative-path prefixing per directory.
- Add all 8 new URLs to `sitemap.xml`.

## Out of scope

- No changes to the existing Projects section (nav item, `projects/index.html`, or any `projects/*.html` page).
- No real performance metrics/testimonials (none supplied) — Results sections stay qualitative.
- Ariana Kitchens & Bedrooms and Lumenlux are not added to Clients (no photo available).
