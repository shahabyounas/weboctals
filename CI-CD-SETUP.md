# 🚀 CI/CD Configuration - GitHub Pages

## Overview

Your site automatically builds and deploys to GitHub Pages whenever you push to the `main` branch.

---

## How It Works

1. **Push code to `main` branch**
   ```bash
   git add .
   git commit -m "Update site"
   git push origin main
   ```

2. **GitHub Actions runs automatically:**
   - ✅ Checks out code
   - ✅ Installs Node.js 18
   - ✅ Installs dependencies (`npm ci`)
   - ✅ Builds with Parcel (`npm run build:all`)
   - ✅ Deploys `dist/` folder to GitHub Pages

3. **Site goes live!**
   - Your site is available at: `https://yourusername.github.io/weboctals`
   - Or your custom domain if configured

---

## Workflow File

**Location:** `.github/workflows/static.yml`

**Triggers:**
- Push to `main` branch
- Manual trigger from Actions tab

**What it does:**
```yaml
1. Build job:
   - Setup Node.js 18
   - Install dependencies
   - Run: npm run build:all
   - Upload dist/ folder

2. Deploy job:
   - Deploy to GitHub Pages
```

---

## Deployment URL

After first deployment, enable GitHub Pages:

1. Go to: **Settings → Pages**
2. Source: **GitHub Actions**
3. Your site will be at: `https://yourusername.github.io/weboctals`

---

## Manual Deployment

Run workflow manually:
1. Go to **Actions** tab
2. Click **Build and Deploy to Pages**
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow**

---

## Monitoring Deployments

- **Actions tab:** See all deployment runs
- **Environments:** Check deployment history
- **GitHub Pages settings:** View live URL

---

## Build Time

Typical deployment: **~3-4 minutes**
- Install dependencies: ~30s
- Build with Parcel: ~4s
- Upload & deploy: ~30s

---

## What Gets Deployed

Only the **`dist/` folder** (minified production build):
- ✅ Minified HTML (20 pages)
- ✅ Minified CSS (91KB)
- ✅ Minified JavaScript (12KB)
- ✅ Optimized images
- ✅ Blog posts (5 posts)
- ❌ Source files (not deployed)
- ❌ node_modules (not deployed)

---

## Status Badge

Add to README.md:
```markdown
![Deploy Status](https://github.com/yourusername/weboctals/actions/workflows/static.yml/badge.svg)
```

---

That's it! Simple and automatic. 🎉
