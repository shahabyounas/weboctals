# Deployment

Two GitHub Actions workflows run on every push to `main`. Both build from
source with `npm run build:all` — `dist/` is gitignored and never committed.

| Workflow | File | Target |
|---|---|---|
| Deploy to Namecheap | `.github/workflows/deploy-namecheap.yml` | `weboctals.com` (cPanel shared hosting, over FTPS) |
| Build and Deploy to Pages | `.github/workflows/static.yml` | GitHub Pages |

Namecheap is the live site. The Pages workflow is a secondary/preview target;
delete `static.yml` if you don't want it running.

`amplify.yml` and `customHttp.yml` configure AWS Amplify, which builds from its
own console-side trigger rather than from Actions.

---

## Namecheap: one-time setup

The server has no usable Node toolchain, so CI builds the site and uploads the
finished `dist/` over FTPS.

### 1. Create the FTP credentials in cPanel

cPanel → **Files → FTP Accounts**. Either use the main account or add a
dedicated one. Note the **username** exactly as cPanel shows it — on shared
hosting it is usually `user@weboctals.com`, not just `user`.

### 2. Add the secrets in GitHub

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
|---|---|
| `FTP_SERVER` | `ftp.weboctals.com` — host only, no `ftp://` |
| `FTP_USERNAME` | the FTP account username from step 1 |
| `FTP_PASSWORD` | that account's password |

### 3. Set the web root, if it isn't the default

The workflow uploads to `public_html/` by default, which is right for the main
cPanel account. A dedicated FTP account scoped to `public_html` is already
rooted there, so it would need `public_html/public_html/` — avoid that by
adding a repository **variable** (not a secret) named `FTP_SERVER_DIR` with the
value `./`.

### 4. Deploy

Push to `main`, or run **Actions → Deploy to Namecheap → Run workflow**.

---

## How the sync behaves

The upload action keeps a manifest on the server of what it has published, and
removes only files listed there. Two consequences:

- Parcel's stale fingerprinted bundles (`weboctals.a1b2c3d4.js`) are cleaned up
  between deploys.
- Files cPanel owns — `.htaccess`, `.well-known/` (ACME/SSL renewal),
  `cgi-bin/` — are never touched, because CI never uploaded them.

The build runs with `--public-url /`, and every page is emitted both as
`/about.html` and `/about/index.html`, so the site needs no rewrite rules — but
it must be served from the domain root.

---

## Troubleshooting

**`ECONNREFUSED` or a TLS error on connect** — Namecheap requires explicit
FTPS on port 21. If the host has plain FTP only, change `protocol: ftps` to
`ftp` in the workflow; prefer fixing the host's TLS instead, since plain FTP
sends the password in the clear.

**Files land in the wrong directory** — see step 3; the FTP account's home is
not always `/home/user`.

**Deploy succeeds but the site is unchanged** — the manifest and the server may
have drifted apart (e.g. files deleted by hand). Delete
`.ftp-deploy-sync-state.json` from the web root and re-run the workflow to force
a full re-upload.

**`npm ci` errors** — the workflows use `npm install` deliberately;
`package-lock.json` is gitignored in this repo.
