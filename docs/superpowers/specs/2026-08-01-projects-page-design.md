# Projects Page

## Context

The site (Parcel-built, Organic design system) currently has a homepage "Work" section with 5 static, non-clickable case-study cards using placeholder-ish client names (Auto Trader, Stream, Order Fresh, Vapor Heaven, Vape Masters). The user provided a real list of 9 client businesses WebOctals has built sites for, with name/contact/location/type, and wants a dedicated Projects section: an index page listing all projects as small cards, and one detail page per project.

## Scope

- New `projects/index.html` — grid of project cards (SVG icon, name, type, 2-3 tags, one-line blurb), each linking to its detail page. Mirrors the `blog/` directory pattern already in use.
- New `projects/<slug>.html` per project (9 pages) — larger SVG, name, type, tags, a short "what we built" paragraph. No phone number or address displayed anywhere (user's explicit choice — privacy over local-SEO NAP display), though location is used only inside `areaServed` schema, not rendered as visible text.
- Add "Projects" to the main nav on every page, positioned: Home → Services → **Projects** → About → Team → Blog → Contact.
- Replace the homepage's existing "Work" section 5 static cards with all 9 real entries from this list (short enough to show in full without curating), each card now a real link to its detail page, plus a "View all projects" CTA to `/projects/` for future growth.

## Content (corrected)

| Slug | Name | Type | Tags |
|---|---|---|---|
| ariana-kitchens-bedrooms | Ariana Kitchens & Bedrooms | Kitchen & Bedroom Design | Home Improvement, Booking, Local Business |
| lumenlux | Lumenlux | Lighting Design | Lighting, Retail, Local Business |
| fishermans-chips | Fisherman's Chips | Fish & Chip Shop | Food & Beverage, Online Ordering, Local Business |
| the-driving-spot | The Driving Spot | Driving School | Driving School, Booking, Local Business |
| colindale-driving-school | Colindale Driving School | Driving School | Driving School, Booking, Local Business |
| hair-we-cut | Hair We Cut | Barber Services | Barber & Salon, Booking, Local Business |
| wazer-taxis | Wazer Taxis | Taxi & Transportation | Transportation, Booking, Local Business |
| quick-fit-shelving | Quick Fit Shelving Ltd | Shelving Supply & Fitting | Trade Services, Local Business |
| ar-worldwide | A.R Worldwide | Currency Exchange | Financial Services, Local Business |

Spelling/wording fixes from the source list: "Barbar Sevices" → "Barber Services"; "shelf provide and fitting service" → "Shelving Supply & Fitting".

## Visual design

- Each project gets a distinct abstract SVG icon, hand-drawn in the Organic system's Lucide-adjacent stroke style (`stroke-width: 2.75`, `--color-accent`/`--color-accent-2`), matched to its business: cabinet/kitchen (Ariana), pendant lamp (Lumenlux), chip-box (Fisherman's Chips), steering wheel (both driving schools, differentiated by accent color pairing), scissors (Hair We Cut), car (Wazer Taxis), shelf unit (Quick Fit Shelving), currency/exchange coins (A.R Worldwide).
- Cards/tags reuse existing component classes only: `.card`, `.tag-accent`/`.tag-accent-2`/`.tag-neutral` — no new CSS components, consistent with every other page built this session.

## SEO

- Each detail page: unique `<title>`/meta description, canonical URL, `BreadcrumbList` schema, and a `LocalBusiness`-shaped schema block (name, business type, `areaServed` from the given location) — schema only, not rendered as visible page text.
- `projects/index.html`: `ItemList` schema referencing all 9 project detail pages.

## Out of scope

- No client phone numbers or addresses rendered as visible text anywhere.
- No new CSS components — reuses existing Organic classes exclusively.
- Homepage keeps a curated subset, not all 9, to avoid an overlong page.
