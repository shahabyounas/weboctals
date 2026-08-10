# Terms & Conditions / Privacy Policy — Design

Status: Approved
Date: 2026-08-10

## Purpose

WebOctals collects visitor and enquiry data (contact form, IP-based geolocation,
device info, Google Analytics/GTM) but has no Terms & Conditions or Privacy
Policy on the site, and no cookie consent mechanism despite loading GA/GTM on
some pages. This adds both legal pages, links them from the footer sitewide,
and closes the cookie-consent gap so the Privacy Policy's claims are true in
practice, not just on paper.

## Controller facts (verbatim, for both documents)

- Legal entity: **WEBOCTALS LTD**
- Company number: **16730955**
- Registered office: 54 Dorset Terrace, Leeds, England, LS8 3QR
- Contact: contact@weboctals.co.uk · +44 7442 410345
- Governing law: England & Wales (with non-waivable US/EU consumer-rights
  savings clause — see Terms outline below)
- Effective date for both documents: 10 August 2026

## Verified data-collection facts (source of truth for the Privacy Policy)

From `assets/js/contact-form-handler.js`:
- Form fields captured: name, email, company, phone, service, budget,
  message, newsletter opt-in.
- Auto-collected on submit: device type, browser, OS, screen size, referrer,
  full user agent string.
- IP-based lookup via `ipapi.co` (free tier): IP address, country, city.
- All of the above is POSTed to a Google Apps Script web app endpoint, which
  writes it into a Google Sheet. Google (Sheets/Apps Script) and ipapi.co are
  therefore data processors.

From page `<head>`/script includes (`index.html`, `contact.html`,
`assets/js/analytics.js`, `assets/js/gtm.js`):
- Google Analytics 4, measurement ID `G-SM3W8072KB`.
- Google Tag Manager, container ID `GTM-N8MKVN7N`.
- Currently loaded unconditionally (no consent gate) on: `index.html`,
  `contact.html`, `blog/index.html`,
  `blog/we-live-in-an-ai-first-world.html`,
  `blog/harnessing-ai-in-seo-game-changer-for-digital-agencies.html`. Not
  present on other pages today, but the consent banner is added sitewide so
  the gate holds if/when tracking is extended.

Outbound link, not data collection: WhatsApp click-to-chat (`wa.me` links) —
visitor leaves to WhatsApp/Meta, governed by WhatsApp's own privacy policy.
No sale or third-party marketing sharing of personal data occurs anywhere on
the site — sharing is limited to the processors above.

## Deliverables

### 1. `terms.html` and `privacy.html` (new, root-level)

Same template as `about.html`: nav, particle background, footer, fonts,
`assets/css/styles.css`, standard meta/OG/canonical tags, added to
`package.json` (`build`, `build:main` script entries).

Each page opens with a short **plain-English summary box** (startup-style
"the gist" callout) before the full legal text — this is the "keep it simple
and accessible" requirement.

**`privacy.html` sections:** who we are · what we collect (form fields +
auto-collected device/location data + analytics cookies) · why we collect it
(UK/EU GDPR Art. 6 legal bases: consent, contract/pre-contract steps,
legitimate interest) · who we share it with (named processors: Google
Analytics, Google Tag Manager, Google Sheets/Apps Script, ipapi.co — no sale,
no third-party marketing sharing) · international transfers (Google's
infrastructure may be outside the UK/EEA; standard contractual clauses) ·
cookies (table: strictly necessary vs. analytics, plus "manage your
preferences" reopening the consent banner) · retention (enquiry data kept
only as long as needed to respond and for reasonable business records;
analytics data follows Google Analytics' standard 14-month default unless
we've changed that setting) · your rights (UK/EU GDPR: access, rectification,
erasure, restriction, objection, portability, withdraw consent, complain to
the ICO; US: general disclosure, no sale/sharing of personal information so
no opt-out mechanism is needed) · children's privacy (not directed at under-16s)
· security · changes to this policy · contact us.

**`terms.html` sections:** acceptance of terms · use of the website (licence
to browse; no scraping/misuse) · intellectual property ownership · acceptable
use · third-party links (WhatsApp, LinkedIn, GitHub, client sites) ·
disclaimers ("as is", no warranty of uninterrupted service) · limitation of
liability · indemnification · governing law (England & Wales) with a savings
clause preserving statutory consumer rights for US/EU visitors that can't be
contracted away · changes to these terms · contact us.

### 2. Footer links (sitewide)

Add a legal-links line inside the existing `.footer-bottom` block on every
live, deployed HTML page (the ~35 files matched by `footer-bottom`, i.e. all
of them except the orphaned `home.html` and `services-old.html` per prior
site audit):

```html
<div class="footer-bottom">
    <p>&copy; 2026 WebOctals. All rights reserved.
        <span class="footer-legal">
            <a href="privacy.html">Privacy Policy</a>
            <span aria-hidden="true">&middot;</span>
            <a href="terms.html">Terms &amp; Conditions</a>
        </span>
    </p>
</div>
```

Relative paths adjusted per directory depth (`../privacy.html` from `blog/`,
`projects/`, `clients/`). Small CSS addition (`.footer-legal`) for spacing
and mobile wrap — no changes to the 3-column `.footer-links` grid.

### 3. Cookie consent banner

New `assets/js/cookie-consent.js` (+ a few CSS rules in `styles.css`):
- Bottom banner on first visit: short copy, **Accept** / **Reject** buttons,
  link to `privacy.html`.
- Choice stored in `localStorage` (e.g. `wo_cookie_consent: "accepted" |
  "rejected"`); banner does not reappear once a choice is made, but a
  "Manage cookie preferences" link in the footer or privacy page can clear it.
- `assets/js/analytics.js` and `assets/js/gtm.js` are modified to check
  consent before calling `gtag('config', ...)` / `gtm.init()` — if no
  consent yet or consent is "rejected", tracking does not fire.
- The two inline gtag bootstrap snippets in `index.html` and `contact.html`
  get the same consent check wrapped around them.
- `cookie-consent.js` is included on the same ~35 pages as the footer links,
  so the banner (and the gate) is site-wide even where GA/GTM isn't loaded
  today.

## Out of scope

- Rewriting or auditing the existing GA/GTM event taxonomy.
- A full cookie-preferences center (granular per-category toggles) — accept/
  reject-all is sufficient for this pass.
- Per-project client service agreements (those are separate, individually
  negotiated contracts, not covered by the website Terms & Conditions).
- Incorporating these documents into `sitemap.xml`/SEO metadata beyond the
  standard meta tags already used on other pages (can be a fast follow).

## Execution checklist

> Driven by /shahab-plan-executioner — do not hand-edit task IDs.

- [x] **T1** — Write privacy.html *(ai · effort l)*
- [x] **T2** — Write terms.html *(ai · effort l)*
- [x] **T3** — Add both pages to package.json build scripts *(ai · effort s)*
- [x] **T4** — Footer legal links across all live pages *(ai · script: scripts/plan-exec/2026-08-10-legal-pages-design/add-footer-legal-links.js · effort m)*
- [x] **T5** — Build cookie-consent.js + banner CSS *(ai · effort m)*
- [x] **T6** — Wire consent gate into analytics.js/gtm.js/inline snippets *(ai · effort m)*
- [x] **T7** — Include cookie-consent.js + banner markup on all live pages *(ai · script: scripts/plan-exec/2026-08-10-legal-pages-design/add-cookie-consent-include.js · effort m)*

## Risks / open questions carried into implementation

- Exact retention wording for GA (14-month default) should be phrased so it
  doesn't overstate certainty if the GA account's setting is ever changed.
- `package.json` build scripts must be updated in the same change as the new
  HTML files, or `npm run build`/`build:main` won't emit them to `dist/`.
