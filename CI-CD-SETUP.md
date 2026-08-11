# Deployment

The site is hosted on **AWS Amplify**. Amplify watches the connected branch,
runs the Parcel build itself, and publishes `dist/`. There are no GitHub Actions
workflows and no build output in the repo — `dist/` is gitignored.

| File | Role |
|---|---|
| `amplify.yml` | Build settings: install, `npm run build:all`, publish `dist/` |
| `customHttp.yml` | Response headers: cache policy per asset type, plus baseline security headers |

Both are read from the repo root automatically.

---

## How a deploy happens

1. Push to the branch connected in the Amplify console (`main`).
2. Amplify runs `amplify.yml`:
   - `npm ci` if a lockfile exists, else `npm install` — `package-lock.json` is
     gitignored here, so in practice it's `npm install`.
   - `npm run build:all` — cleans `dist/`, builds every page, inlines critical
     CSS, then copies `robots.txt` / `sitemap.xml` / `llms.txt` and any
     absolutely-referenced assets (og:image, JSON-LD logo) into `dist/`.
3. Amplify publishes `dist/` and invalidates its CloudFront distribution.

The build runs with `--public-url /`, and every page is emitted both as
`/about.html` and `/about/index.html`, so the site needs no rewrite rules — but
it must be served from the domain root.

---

## Two console settings that silently override this repo

Amplify lets the console shadow both files. If a change here has no effect,
check these first:

- **Build settings** — an inline buildspec saved in **App settings → Build
  settings** wins over `amplify.yml`. Remove the inline copy so the repo file is
  used.
- **Custom headers** — a header set defined in **App settings → Custom headers**
  wins over `customHttp.yml`. Same fix: clear it in the console.

---

## Caching

Amplify's default is `public, max-age=0, s-maxage=31536000` — CloudFront caches
for a year and is invalidated on deploy, while browsers revalidate every load.
That's right for HTML but wasteful for Parcel's fingerprinted assets, so
`customHttp.yml` overrides it:

| Pattern | Cache-Control |
|---|---|
| Fingerprinted `js`/`css`/images/fonts | `max-age=31536000, immutable` |
| `/assets/**` (unhashed originals) | `max-age=86400` |
| `*.xml`, `*.txt` (sitemap, robots, llms) | `max-age=3600` |
| everything else (HTML) | Amplify default |

It also applies baseline security headers to every response
(`X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`,
`Permissions-Policy`) but deliberately no `Content-Security-Policy`: the pages
carry inline critical CSS and inline JSON-LD, so a policy would need nonces or
hashes wired through the build.

---

## Troubleshooting

**Site serves unminified source** — Amplify is publishing the repo root instead
of `dist/`. Confirm `amplify.yml` is at the root and that no inline buildspec is
saved in the console.

**A new og:image or JSON-LD logo 404s** — those are referenced by absolute URL,
which Parcel leaves alone. `scripts/copy-absolute-assets.js` scans the built
HTML and copies exactly those files; a reference with no source file fails the
build on purpose.

**`npm ci` errors in the build log** — expected and handled;
`package-lock.json` is gitignored, so `amplify.yml` falls back to `npm install`.

---

## Local build

```bash
npm run build:all   # produces dist/
npm run serve       # serves dist/ on :3000
```
