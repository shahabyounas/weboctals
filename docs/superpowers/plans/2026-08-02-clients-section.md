# Clients Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "Clients" section (nav item + `clients/index.html` hero slider/list + 7 PAR case-study landing pages) that showcases the 7 clients with real photos in `assets/images/`, without touching the existing "Projects" section.

**Architecture:** Static HTML/CSS/vanilla-JS site (Parcel build, no framework, no test runner). A new `clients/` directory mirrors the structure of the existing `projects/` directory. A scripted find/insert adds the "Clients" nav+footer link to the 28 existing pages that need it. New CSS/JS is appended to the existing shared `assets/css/styles.css` / `assets/js/main.js` files, following those files' existing conventions exactly (same CSS custom properties, same guarded-`initialize*` JS pattern).

**Tech Stack:** Plain HTML5, CSS (custom properties defined in `assets/css/styles.css`), vanilla JS (`assets/js/main.js`), Parcel 2 for bundling. No test framework exists in this repo — verification for each task uses `grep`/`python3` structural checks (title/canonical/JSON-LD/required-class presence, `json.loads` on JSON-LD, `test -f` on referenced image paths) plus a manual `npm run dev` browser check at the end. **Do not use the system `tidy` binary as a verification gate** — it's HTML Tidy 2006 (pre-HTML5) and reports false-positive errors on every `<svg>`/`<nav>` element already shipped on this site; it was checked against the live `projects/colindale-driving-school.html` page and produces dozens of spurious errors on code that is already in production.

## Global Constraints

- Only these 7 businesses get a Clients page (they're the only ones with a `client_*`/`quick_fit_move` photo in `assets/images/`): Colindale Driving School, The Driving Spot, Fisherman's Chips, Wazer Taxis, Hair We Cut, A.R Worldwide, Quick Fit Shelving Ltd. Ariana Kitchens & Bedrooms and Lumenlux are **not** added (no photo).
- The existing "Projects" nav item and all 9-10 files under `projects/` are **not modified** in content — only a new sibling "Clients" `<li>` is inserted next to the existing "Projects" `<li>` in nav/footer.
- No fabricated metrics. "Results" copy is qualitative and honest — never invented percentages/numbers presented as fact.
- All facts (business name, location, industry) must stay consistent with what's already published on `projects/index.html` and the matching `projects/<slug>.html` page for that business — see the per-task copy below, which was written from those existing pages.
- File path convention (already established by `projects/`): pages inside `clients/` link to root pages with a `../` prefix (e.g. `../about.html`, `../contact.html`, `../assets/css/styles.css`) and to each other with a bare filename (e.g. `index.html`, `colindale-driving-school.html`).
- Canonical URLs use the `https://weboctals.com/clients/<file>` pattern, matching the existing `https://weboctals.com/projects/<file>` pattern.
- New CSS/JS must reuse existing design tokens (`--color-accent`, `--color-accent-2`, `--color-neutral-*`, `--space-*`, `--radius-*`, `--transition-fast`) — no new colors or spacing values invented.

---

## Shared Fragments

These four blocks are **byte-identical across all 8 new `clients/*.html` files** (the index page and all 7 landing pages) — every one of those pages shows "Clients" as the active nav item and never shows "Projects" as active. Each file-creation task below tells you exactly where to splice these in; copy them verbatim.

### Fragment: NAV_BLOCK

```html
    <!-- Navigation -->
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="../index.html">
                    <svg class="logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                        <circle cx="16" cy="16" r="13" stroke="var(--color-accent)" stroke-width="1.5" stroke-dasharray="2.5 3.5"/>
                        <line x1="16" y1="7" x2="10" y2="21" stroke="var(--color-accent-2)" stroke-width="1.5"/>
                        <line x1="16" y1="7" x2="22" y2="21" stroke="var(--color-accent-2)" stroke-width="1.5"/>
                        <line x1="10" y1="21" x2="22" y2="21" stroke="var(--color-accent-2)" stroke-width="1.5"/>
                        <circle cx="16" cy="7" r="3" fill="var(--color-accent)"/>
                        <circle cx="10" cy="21" r="3" fill="var(--color-accent-2)"/>
                        <circle cx="22" cy="21" r="3" fill="var(--color-accent)"/>
                    </svg>
                    <span class="logo-text">Web<span class="logo-accent">Octals</span></span>
                </a>
            </div>
            <ul class="nav-menu" id="nav-menu">
                <li class="nav-item">
                    <a href="../index.html" class="nav-link">Home</a>
                </li>
                <li class="nav-item nav-item-dropdown">
                    <a href="../services.html" class="nav-link">
                        Services
                        <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </a>
                    <div class="dropdown-menu">
                        <div class="dropdown-featured">
                            <a href="../ai-agents.html" class="dropdown-item dropdown-item-featured">
                                <div class="dropdown-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
                                    </svg>
                                </div>
                                <div class="dropdown-content">
                                    <span class="dropdown-title">AI Agents</span>
                                    <span class="dropdown-desc">Virtual Assistants</span>
                                </div>
                            </a>
                            <a href="../automation.html" class="dropdown-item dropdown-item-featured">
                                <div class="dropdown-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
                                    </svg>
                                </div>
                                <div class="dropdown-content">
                                    <span class="dropdown-title">Automation</span>
                                    <span class="dropdown-desc">Process Automation</span>
                                </div>
                            </a>
                        </div>
                        <div class="dropdown-links">
                            <a href="../product-development.html" class="dropdown-link">Product Development</a>
                            <a href="../web-development.html" class="dropdown-link">Web Development</a>
                            <a href="../digital-products.html" class="dropdown-link">Digital Products</a>
                            <a href="../machine-learning.html" class="dropdown-link">Machine Learning</a>
                        </div>
                    </div>
                </li>
                <li class="nav-item">
                    <a href="../projects/index.html" class="nav-link">Projects</a>
                </li>
                <li class="nav-item">
                    <a href="index.html" class="nav-link active">Clients</a>
                </li>
                <li class="nav-item">
                    <a href="../about.html" class="nav-link">About</a>
                </li>
                <li class="nav-item">
                    <a href="../blog/index.html" class="nav-link">Blog</a>
                </li>
                <li class="nav-item">
                    <a href="../contact.html" class="nav-link">Contact</a>
                </li>
            </ul>
            <a href="../contact.html" class="btn btn-primary nav-cta">
                <span>Start a project</span>
            </a>
            <div class="hamburger" id="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>
```

### Fragment: FOOTER_BLOCK

```html
    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <svg class="logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                        <circle cx="16" cy="16" r="13" stroke="var(--color-accent)" stroke-width="1.5" stroke-dasharray="2.5 3.5"/>
                        <line x1="16" y1="7" x2="10" y2="21" stroke="var(--color-accent-2)" stroke-width="1.5"/>
                        <line x1="16" y1="7" x2="22" y2="21" stroke="var(--color-accent-2)" stroke-width="1.5"/>
                        <line x1="10" y1="21" x2="22" y2="21" stroke="var(--color-accent-2)" stroke-width="1.5"/>
                        <circle cx="16" cy="7" r="3" fill="var(--color-accent)"/>
                        <circle cx="10" cy="21" r="3" fill="var(--color-accent-2)"/>
                        <circle cx="22" cy="21" r="3" fill="var(--color-accent)"/>
                    </svg>
                        <span class="logo-text">Web<span class="logo-accent">Octals</span></span>
                    </div>
                    <p>Transforming businesses through intelligent AI solutions and cutting-edge digital products.</p>
                    <div class="social-links">
                        <a href="https://www.linkedin.com/company/weboctals/" aria-label="LinkedIn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a href="https://github.com/shahabyounas/" aria-label="GitHub">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <div class="footer-links">
                    <div class="link-group">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="../ai-agents.html">AI Agent Development</a></li>
                            <li><a href="../digital-products.html">Digital Products</a></li>
                            <li><a href="../automation.html">Automation</a></li>
                            <li><a href="../machine-learning.html">ML Solutions</a></li>
                        </ul>
                    </div>

                    <div class="link-group">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="../about.html">About Us</a></li>
                            <li><a href="../projects/index.html">Projects</a></li>
                            <li><a href="index.html">Clients</a></li>
                            <li><a href="../blog/index.html">Blog</a></li>
                            <li><a href="../contact.html">Contact</a></li>
                        </ul>
                    </div>

                    <div class="link-group">
                        <h4>Get in touch</h4>
                        <ul>
                            <li><a href="mailto:info@weboctals.com">info@weboctals.com</a></li>
                            <li><a href="tel:+447442410345">+44 7442 410345</a></li>
                            <li><a href="../contact.html">Start a project</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2026 WebOctals. All rights reserved. | Pioneering the future of AI-powered digital solutions.</p>
            </div>
        </div>
    </footer>
```

### Fragment: CHAT_AND_SCRIPTS_BLOCK

```html
    <!-- AI Chat Widget -->
    <div id="ai-chat-widget" class="chat-widget">
        <div class="chat-toggle" id="chat-toggle">
            <div class="chat-icon">
                <div class="ai-pulse"></div>
                🤖
            </div>
        </div>
        <div class="chat-window" id="chat-window">
            <div class="chat-header">
                <h4>WebOctals AI Assistant</h4>
                <button class="chat-close" id="chat-close">×</button>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message bot-message">
                    <div class="message-content">
                        Hello! I'd be happy to tell you more about WebOctals' mission, values, and approach to AI development. What would you like to know?
                    </div>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" id="chat-input" placeholder="Ask about our company...">
                <button id="chat-send">Send</button>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="../assets/js/main.js"></script>
</body>
</html>
```

### Fragment: HEAD_STATIC_TAIL

Goes immediately after the page-specific `<!-- Canonical URL -->` `<link>` tag, and immediately before the page-specific JSON-LD `<script>` block, in every new `clients/*.html` file:

```html

    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#c67139">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">

    <!-- Performance Optimization: Google Fonts Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Performance Optimization: Async Font Loading -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caprasimo&family=Figtree:wght@300;400;500;600;700;800&display=swap" media="print" onload="this.media='all'">
    <noscript>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caprasimo&family=Figtree:wght@300;400;500;600;700;800&display=swap">
    </noscript>

    <link rel="stylesheet" href="../assets/css/styles.css">
```

### Full page skeleton (how the fragments + per-page content combine)

Every new `clients/*.html` file has this exact shape:

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{PAGE_DESCRIPTION}">
    <meta name="author" content="WebOctals">
    <meta name="robots" content="index, follow">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{CANONICAL_URL}">
    <meta property="og:title" content="{PAGE_TITLE}">
    <meta property="og:description" content="{PAGE_DESCRIPTION}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{CANONICAL_URL}">
    <meta property="twitter:title" content="{PAGE_TITLE}">
    <meta property="twitter:description" content="{PAGE_DESCRIPTION}">

    <!-- Canonical URL -->
    <link rel="canonical" href="{CANONICAL_URL}">
{HEAD_STATIC_TAIL}
    <script type="application/ld+json">
    {PAGE_JSON_LD}
    </script>

    <title>{PAGE_TITLE}</title>
</head>
<body>
    <!-- Particle Background -->
    <div id="particles-js"></div>

{NAV_BLOCK}
{PAGE_MAIN_CONTENT}
{FOOTER_BLOCK}
{CHAT_AND_SCRIPTS_BLOCK}
```

Each task below gives you `{PAGE_DESCRIPTION}`, `{PAGE_TITLE}`, `{CANONICAL_URL}`, `{PAGE_JSON_LD}` and `{PAGE_MAIN_CONTENT}` in full — assemble the file exactly as shown above, splicing in `NAV_BLOCK`, `FOOTER_BLOCK`, `CHAT_AND_SCRIPTS_BLOCK` and `HEAD_STATIC_TAIL` verbatim from the Shared Fragments section.

---

### Task 1: Add "Clients" nav + footer link across existing pages

**Files:**
- Modify: 13 root pages — `about.html`, `ai-agents.html`, `automation.html`, `contact.html`, `digital-products.html`, `index.html`, `machine-learning.html`, `on-page-seo.html`, `product-development.html`, `seo.html`, `services.html`, `technical-seo.html`, `web-development.html`
- Modify: 5 blog pages — `blog/ai-agents-future-business-automation.html`, `blog/harnessing-ai-in-seo-game-changer-for-digital-agencies.html`, `blog/index.html`, `blog/we-live-in-an-ai-first-world.html`, `blog/website-redesign-signs.html`
- Modify: 10 projects pages — `projects/index.html`, `projects/ariana-kitchens-bedrooms.html`, `projects/ar-worldwide.html`, `projects/colindale-driving-school.html`, `projects/fishermans-chips.html`, `projects/hair-we-cut.html`, `projects/lumenlux.html`, `projects/quick-fit-shelving.html`, `projects/the-driving-spot.html`, `projects/wazer-taxis.html`
- Create (temporary, scratch): `/private/tmp/claude-502/-Users-Work-Desktop-myprojects-weboctals/9159a191-9eaa-4ac3-8bce-566364840ebe/scratchpad/add_clients_nav.py` — one-off script, not committed

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: every existing page in the site now has a `<li class="nav-item"><a href="..." class="nav-link">Clients</a></li>` immediately after the "Projects" nav `<li>`, and a matching `<li><a href="...">Clients</a></li>` immediately after the "Projects" footer link. This is what Task 4–11's `NAV_BLOCK`/`FOOTER_BLOCK` fragments are the mirror-image of (those fragments mark Clients `active` and Projects not-active; this task's insertions mark neither active, since these pages are neither).

This has already been verified against the live repo: the nav pattern `<li class="nav-item">\n<a href="..." class="nav-link( active)?">Projects</a>\n</li>` and the footer pattern `<li><a href="...">Projects</a></li>` each match **exactly once** in all 28 files listed above (checked with the exact regex used below, before writing this plan).

- [ ] **Step 1: Write the insertion script**

Create `/private/tmp/claude-502/-Users-Work-Desktop-myprojects-weboctals/9159a191-9eaa-4ac3-8bce-566364840ebe/scratchpad/add_clients_nav.py`:

```python
import re
import pathlib
import sys

ROOT_FILES = [
    "about.html", "ai-agents.html", "automation.html", "contact.html",
    "digital-products.html", "index.html", "machine-learning.html",
    "on-page-seo.html", "product-development.html", "seo.html",
    "services.html", "technical-seo.html", "web-development.html",
]

BLOG_FILES = [
    "blog/ai-agents-future-business-automation.html",
    "blog/harnessing-ai-in-seo-game-changer-for-digital-agencies.html",
    "blog/index.html",
    "blog/we-live-in-an-ai-first-world.html",
    "blog/website-redesign-signs.html",
]

PROJECTS_FILES = [
    "projects/index.html",
    "projects/ariana-kitchens-bedrooms.html",
    "projects/ar-worldwide.html",
    "projects/colindale-driving-school.html",
    "projects/fishermans-chips.html",
    "projects/hair-we-cut.html",
    "projects/lumenlux.html",
    "projects/quick-fit-shelving.html",
    "projects/the-driving-spot.html",
    "projects/wazer-taxis.html",
]

NAV_RE = re.compile(
    r'( {16}<li class="nav-item">\n'
    r' {20}<a href="[^"]*" class="nav-link( active)?">Projects</a>\n'
    r' {16}</li>\n)'
)

FOOTER_RE = re.compile(
    r'( {28}<li><a href="[^"]*">Projects</a></li>\n)'
)


def process(repo_root: pathlib.Path, rel_path: str, clients_href: str) -> None:
    path = repo_root / rel_path
    text = path.read_text()

    if "Clients</a>" in text:
        print(f"SKIP (already has Clients link): {rel_path}")
        return

    nav_insert = (
        '                <li class="nav-item">\n'
        f'                    <a href="{clients_href}" class="nav-link">Clients</a>\n'
        '                </li>\n'
    )
    new_text, nav_count = NAV_RE.subn(lambda m: m.group(1) + nav_insert, text, count=1)
    if nav_count != 1:
        raise SystemExit(f"ERROR: nav Projects pattern not found exactly once in {rel_path}")

    footer_insert = f'                            <li><a href="{clients_href}">Clients</a></li>\n'
    new_text, footer_count = FOOTER_RE.subn(lambda m: m.group(1) + footer_insert, new_text, count=1)
    if footer_count != 1:
        raise SystemExit(f"ERROR: footer Projects pattern not found exactly once in {rel_path}")

    path.write_text(new_text)
    print(f"OK: {rel_path}")


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: add_clients_nav.py <repo-root>")
    repo_root = pathlib.Path(sys.argv[1]).resolve()

    for f in ROOT_FILES:
        process(repo_root, f, "clients/index.html")

    for f in BLOG_FILES:
        process(repo_root, f, "../clients/index.html")

    for f in PROJECTS_FILES:
        process(repo_root, f, "../clients/index.html")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Dry-run count check before mutating anything**

Run (from the repo root):

```bash
python3 - <<'EOF'
import re
files = ["about.html","ai-agents.html","automation.html","contact.html","digital-products.html","index.html","machine-learning.html","on-page-seo.html","product-development.html","seo.html","services.html","technical-seo.html","web-development.html","blog/ai-agents-future-business-automation.html","blog/harnessing-ai-in-seo-game-changer-for-digital-agencies.html","blog/index.html","blog/we-live-in-an-ai-first-world.html","blog/website-redesign-signs.html","projects/index.html","projects/ariana-kitchens-bedrooms.html","projects/ar-worldwide.html","projects/colindale-driving-school.html","projects/fishermans-chips.html","projects/hair-we-cut.html","projects/lumenlux.html","projects/quick-fit-shelving.html","projects/the-driving-spot.html","projects/wazer-taxis.html"]
NAV_RE = re.compile(r'( {16}<li class="nav-item">\n {20}<a href="[^"]*" class="nav-link( active)?">Projects</a>\n {16}</li>\n)')
FOOTER_RE = re.compile(r'( {28}<li><a href="[^"]*">Projects</a></li>\n)')
bad = []
for f in files:
    text = open(f).read()
    if len(NAV_RE.findall(text)) != 1 or len(FOOTER_RE.findall(text)) != 1:
        bad.append(f)
print("files checked:", len(files), "bad:", bad or "none")
EOF
```

Expected: `files checked: 28 bad: none`. If any file is bad, stop and inspect it manually — do not proceed to Step 3 until this prints `none`.

- [ ] **Step 3: Run the script**

```bash
python3 /private/tmp/claude-502/-Users-Work-Desktop-myprojects-weboctals/9159a191-9eaa-4ac3-8bce-566364840ebe/scratchpad/add_clients_nav.py "$(pwd)"
```

Expected: 28 lines of `OK: <path>`, no `SKIP` and no `ERROR`/traceback.

- [ ] **Step 4: Verify the result**

```bash
grep -rlc 'class="nav-link">Clients</a>' --include="*.html" . | grep -v node_modules | wc -l
```

Expected: `28` (every one of the 28 files now has exactly one non-active Clients nav link — none of these 28 pages are Clients pages themselves, so none should show `active`).

```bash
grep -c '<a href="[^"]*">Clients</a></li>' about.html projects/lumenlux.html blog/index.html
```

Expected: `1` for each of the three sample files (footer link present).

Spot-check hrefs are correct for each directory depth:

```bash
grep -A1 'class="nav-item">$' about.html | grep Clients
grep -A1 'class="nav-item">$' blog/index.html | grep Clients
grep -A1 'class="nav-item">$' projects/lumenlux.html | grep Clients
```

Expected respectively: `href="clients/index.html"`, `href="../clients/index.html"`, `href="../clients/index.html"`.

- [ ] **Step 5: Commit**

```bash
git add about.html ai-agents.html automation.html contact.html digital-products.html index.html machine-learning.html on-page-seo.html product-development.html seo.html services.html technical-seo.html web-development.html blog/ai-agents-future-business-automation.html blog/harnessing-ai-in-seo-game-changer-for-digital-agencies.html blog/index.html blog/we-live-in-an-ai-first-world.html blog/website-redesign-signs.html projects/index.html projects/ariana-kitchens-bedrooms.html projects/ar-worldwide.html projects/colindale-driving-school.html projects/fishermans-chips.html projects/hair-we-cut.html projects/lumenlux.html projects/quick-fit-shelving.html projects/the-driving-spot.html projects/wazer-taxis.html
git commit -m "Add Clients nav and footer link across existing pages"
```

---

### Task 2: Add Clients section CSS

**Files:**
- Modify: `assets/css/styles.css` (append to end of file, after line 7953)

**Interfaces:**
- Consumes: existing design tokens only (`--color-accent`, `--color-accent-2`, `--color-accent-100/300/700`, `--color-neutral-100/300/700`, `--space-xs/sm/md/lg/xl/2xl/3xl`, `--radius-md/lg/pill`, `--transition-fast`), all already defined at the top of `styles.css`.
- Produces these class names, consumed by Task 4 (index page) and Tasks 5–11 (landing pages): `.clients-slider-section`, `.clients-hero-slider`, `.clients-slider-track`, `.client-slide`, `.client-slide-photo`, `.client-slide-content`, `.client-slide-hook`, `.client-slider-controls`, `.client-slider-arrow`, `.client-slider-dots`, `.client-slider-dot`, `.client-slider-dot.is-active`, `.clients-grid-section`, `.clients-grid`, `.client-card`, `.client-card-photo`, `.client-card-problem`, `.client-landing-hero`, `.client-landing-photo`, `.client-back-link`, `.client-par-grid`, `.client-par-card`, `.client-par-label`, `.client-landing-cta`. Also produces the transform contract Task 3's JS relies on: sliding is done by setting `transform: translateX(-N * 100%)` on `.clients-slider-track`, where each `.client-slide` is `flex: 0 0 100%`. Note: `.client-slider-arrow--prev` and `.client-slider-arrow--next` (used in Task 4's markup and queried by Task 3's JS) are intentionally **not** styled here — Task 4's HTML applies them together with the base `.client-slider-arrow` class (e.g. `class="client-slider-arrow client-slider-arrow--prev"`), which supplies all the styling; the modifiers are pure selector hooks with no visual difference of their own (the prev/next icons differ only in inline SVG markup, not CSS), so no dedicated rule is needed or should be added.

- [ ] **Step 1: Append the CSS**

Append this block to the end of `assets/css/styles.css`:

```css

/* ===== Clients section ===== */

/* Hero slider (clients/index.html) */
.clients-slider-section {
    padding: 20px 0 40px;
}

.clients-hero-slider {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-lg);
    background: var(--color-neutral-100);
}

.clients-slider-track {
    display: flex;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.client-slide {
    flex: 0 0 100%;
    min-width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
    align-items: center;
    padding: var(--space-2xl);
    text-decoration: none;
    color: inherit;
}

.client-slide-photo {
    aspect-ratio: 5 / 4;
    width: 100%;
    border-radius: var(--radius-md);
    overflow: hidden;
}

.client-slide-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.client-slide-content .client-slide-hook {
    color: var(--color-neutral-700);
    line-height: 1.6;
    margin: var(--space-sm) 0 var(--space-md);
}

.client-slider-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
    padding: 0 0 var(--space-lg);
}

.client-slider-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-pill);
    background: var(--color-bg);
    color: var(--color-accent-700);
    border: 1.5px solid var(--color-neutral-300);
    cursor: pointer;
    transition: var(--transition-fast);
}

.client-slider-arrow:hover {
    background: var(--color-accent-100);
    border-color: var(--color-accent-300);
}

.client-slider-arrow svg {
    width: 20px;
    height: 20px;
}

.client-slider-dots {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
}

.client-slider-dot {
    width: 9px;
    height: 9px;
    border-radius: var(--radius-pill);
    background: var(--color-neutral-300);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: var(--transition-fast);
}

.client-slider-dot.is-active {
    background: var(--color-accent);
    width: 22px;
}

@media (max-width: 768px) {
    .client-slide {
        grid-template-columns: 1fr;
        padding: var(--space-lg);
    }
}

/* Client list (clients/index.html) */
.clients-grid-section {
    padding: 50px 0 90px;
}

.clients-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-lg);
    margin-top: var(--space-xl);
}

.client-card {
    text-decoration: none;
    color: inherit;
    display: block;
}

.client-card-photo {
    aspect-ratio: 5 / 4;
    width: 100%;
    border-radius: var(--radius-md);
    overflow: hidden;
    margin-bottom: var(--space-md);
}

.client-card-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.client-card-problem {
    color: var(--color-neutral-700);
    line-height: 1.6;
    margin: var(--space-sm) 0;
}

@media (max-width: 1024px) {
    .clients-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .clients-grid {
        grid-template-columns: 1fr;
    }
}

/* Client landing page (clients/<slug>.html) */
.client-landing-hero {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: var(--space-xl);
    align-items: center;
    padding: var(--space-2xl) 0;
}

.client-landing-photo {
    aspect-ratio: 5 / 4;
    width: 100%;
    border-radius: var(--radius-lg);
    overflow: hidden;
}

.client-landing-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.client-back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    color: var(--color-accent-700);
    margin-bottom: var(--space-lg);
}

.client-par-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-lg);
    margin: var(--space-lg) 0 var(--space-2xl);
}

.client-par-card p {
    color: var(--color-neutral-700);
    line-height: 1.7;
}

.client-par-label {
    display: block;
    font-size: 0.8125rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-accent-700);
    margin-bottom: var(--space-sm);
}

.client-landing-cta {
    padding-bottom: var(--space-3xl);
}

@media (max-width: 768px) {
    .client-landing-hero {
        grid-template-columns: 1fr;
        text-align: left;
    }

    .client-landing-photo {
        max-width: 100%;
    }

    .client-par-grid {
        grid-template-columns: 1fr;
    }
}
```

- [ ] **Step 2: Verify**

```bash
grep -c "^\.clients-hero-slider {" assets/css/styles.css
grep -c "^\.client-par-grid {" assets/css/styles.css
```

Expected: `1` for each. Then check the file still parses as valid CSS by running the Parcel dev build for a page that includes it (done in Task 13); for now just confirm no stray unclosed braces:

```bash
python3 -c "
text = open('assets/css/styles.css').read()
print('braces balanced:', text.count('{') == text.count('}'))
"
```

Expected: `braces balanced: True`.

- [ ] **Step 3: Commit**

```bash
git add assets/css/styles.css
git commit -m "Add Clients section CSS (slider, grid, landing page)"
```

---

### Task 3: Add the client slider JS

**Files:**
- Modify: `assets/js/main.js` — add the `initializeClientSlider` function (near `initializeFAQAccordion`, both are page-conditional, small, guarded init functions) and register the call in the top `DOMContentLoaded` listener at the top of the file (currently lines 4-9).

**Interfaces:**
- Consumes: the CSS class contract from Task 2 — `.clients-hero-slider` as the root (returns early if absent, so this is a no-op on every page except `clients/index.html`), `.clients-slider-track` as the transform target, `.client-slide` elements as children, `.client-slider-arrow--prev` / `.client-slider-arrow--next` as controls, `.client-slider-dots` as the container to populate with generated `.client-slider-dot` buttons.
- Produces: nothing consumed by later tasks — Task 4's HTML just needs to contain the elements above with those exact class names for this function to find and drive them.

- [ ] **Step 1: Add the function**

Insert this function into `assets/js/main.js`, directly after the closing brace of `initializeFAQAccordion` (search for `function initializeFAQAccordion` — insert after that function's closing `}`):

```javascript
// Client case-study hero slider (clients/index.html only — no-op on every other page)
function initializeClientSlider() {
    const slider = document.querySelector('.clients-hero-slider');

    if (!slider) {
        return; // Not on the Clients index page
    }

    const track = slider.querySelector('.clients-slider-track');
    const slides = Array.from(slider.querySelectorAll('.client-slide'));
    const prevBtn = slider.querySelector('.client-slider-arrow--prev');
    const nextBtn = slider.querySelector('.client-slider-arrow--next');
    const dotsContainer = slider.querySelector('.client-slider-dots');

    if (!track || slides.length === 0 || !dotsContainer) {
        return;
    }

    const AUTOPLAY_MS = 6000;
    const SWIPE_THRESHOLD = 40;

    let currentIndex = 0;
    let autoplayTimer = null;
    let touchStartX = 0;

    const dots = slides.map((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'client-slider-dot';
        dot.setAttribute('aria-label', `Go to client ${index + 1} of ${slides.length}`);
        dot.addEventListener('click', () => {
            goToSlide(index);
            startAutoplay();
        });
        dotsContainer.appendChild(dot);
        return dot;
    });

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('is-active', index === currentIndex);
        });
        slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index === currentIndex ? 'false' : 'true');
        });
    }

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        updateSlider();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoplay();
        });
    }

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', stopAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const delta = touchEndX - touchStartX;

        if (delta > SWIPE_THRESHOLD) {
            prevSlide();
        } else if (delta < -SWIPE_THRESHOLD) {
            nextSlide();
        }

        startAutoplay();
    }, { passive: true });

    updateSlider();
    startAutoplay();
}
```

- [ ] **Step 2: Register the call**

In `assets/js/main.js`, change the top `DOMContentLoaded` listener from:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    initializeSimpleNavigation();
    initializeBasicFeatures();
    // initializeGTMTracking(); // Disabled - using lazy-loaded Google Analytics instead
    initializeFAQAccordion();
});
```

to:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    initializeSimpleNavigation();
    initializeBasicFeatures();
    // initializeGTMTracking(); // Disabled - using lazy-loaded Google Analytics instead
    initializeFAQAccordion();
    initializeClientSlider();
});
```

- [ ] **Step 3: Verify syntax**

```bash
node --check assets/js/main.js
```

Expected: no output, exit code 0 (Node's `--check` parses the file for syntax errors without executing it — there's no test runner in this repo, so this is the available automated check; full behavioral verification of the slider happens in Task 13's manual browser check).

- [ ] **Step 4: Commit**

```bash
git add assets/js/main.js
git commit -m "Add client case-study hero slider JS"
```

---

### Task 4: Create `clients/index.html` (slider + list)

**Files:**
- Create: `clients/index.html`

**Interfaces:**
- Consumes: `NAV_BLOCK`, `FOOTER_BLOCK`, `CHAT_AND_SCRIPTS_BLOCK`, `HEAD_STATIC_TAIL` from Shared Fragments; `.clients-hero-slider` / `.client-slide` / etc. CSS from Task 2; `initializeClientSlider()` behavior from Task 3.
- Produces: the 7 landing-page URLs this page links to (`colindale-driving-school.html`, `the-driving-spot.html`, `fishermans-chips.html`, `wazer-taxis.html`, `hair-we-cut.html`, `ar-worldwide.html`, `quick-fit-shelving.html`) — Tasks 5–11 must create files at exactly those paths.

- [ ] **Step 1: Write the file**

`{PAGE_DESCRIPTION}` = `Real local businesses WebOctals has partnered with. See the problem each one faced, what we built, and the result — from driving schools to takeaways to trade services.`

`{PAGE_TITLE}` = `Our Clients | Real Business Websites Built by WebOctals`

`{CANONICAL_URL}` = `https://weboctals.com/clients/index.html`

`{PAGE_JSON_LD}`:

```json
{"@context":"https://schema.org","@type":"ItemList","name":"WebOctals Clients","itemListElement":[{"@type":"ListItem","position":1,"name":"Colindale Driving School","url":"https://weboctals.com/clients/colindale-driving-school.html"},{"@type":"ListItem","position":2,"name":"The Driving Spot","url":"https://weboctals.com/clients/the-driving-spot.html"},{"@type":"ListItem","position":3,"name":"Fisherman&rsquo;s Chips","url":"https://weboctals.com/clients/fishermans-chips.html"},{"@type":"ListItem","position":4,"name":"Wazer Taxis","url":"https://weboctals.com/clients/wazer-taxis.html"},{"@type":"ListItem","position":5,"name":"Hair We Cut","url":"https://weboctals.com/clients/hair-we-cut.html"},{"@type":"ListItem","position":6,"name":"A.R Worldwide","url":"https://weboctals.com/clients/ar-worldwide.html"},{"@type":"ListItem","position":7,"name":"Quick Fit Shelving Ltd","url":"https://weboctals.com/clients/quick-fit-shelving.html"}]}
```

`{PAGE_MAIN_CONTENT}`:

```html
    <!-- Clients Hero -->
    <section class="page-hero">
        <div class="container">
            <h1>Our Clients</h1>
            <p class="section-subtitle">Real local businesses we&rsquo;ve partnered with &mdash; the problem they faced, what we built, and the result.</p>
        </div>
    </section>

    <!-- Client Slider -->
    <section class="clients-slider-section">
        <div class="container">
            <div class="clients-hero-slider" aria-roledescription="carousel" aria-label="Client case studies">
                <div class="clients-slider-track">
                    <a href="colindale-driving-school.html" class="client-slide">
                        <div class="client-slide-photo">
                            <img src="../assets/images/client_colindale_driving.jpeg" alt="Colindale Driving School website built by WebOctals" loading="eager" width="1402" height="1122">
                        </div>
                        <div class="client-slide-content">
                            <span class="project-card-type">Driving School &mdash; Colindale, London</span>
                            <h2 class="card-title">Colindale Driving School</h2>
                            <p class="client-slide-hook">A generic web presence was costing this North London driving school local bookings. Here&rsquo;s how we fixed it.</p>
                            <span class="service-grid-link">Read case study &rarr;</span>
                        </div>
                    </a>
                    <a href="the-driving-spot.html" class="client-slide">
                        <div class="client-slide-photo">
                            <img src="../assets/images/client_driving_spot.jpeg" alt="The Driving Spot website built by WebOctals" loading="lazy" width="1402" height="1122">
                        </div>
                        <div class="client-slide-content">
                            <span class="project-card-type">Driving School &mdash; Bedford &amp; Peterborough</span>
                            <h2 class="card-title">The Driving Spot</h2>
                            <p class="client-slide-hook">One homepage couldn&rsquo;t rank across every town this school teaches in. We rebuilt it around each area.</p>
                            <span class="service-grid-link">Read case study &rarr;</span>
                        </div>
                    </a>
                    <a href="fishermans-chips.html" class="client-slide">
                        <div class="client-slide-photo">
                            <img src="../assets/images/client_fisher_chips.jpeg" alt="Fisherman&rsquo;s Chips website built by WebOctals" loading="lazy" width="1402" height="1122">
                        </div>
                        <div class="client-slide-content">
                            <span class="project-card-type">Food &amp; Beverage &mdash; Bedford</span>
                            <h2 class="card-title">Fisherman&rsquo;s Chips</h2>
                            <p class="client-slide-hook">Phone orders were pulling staff off the fryer. We built a menu-first ordering site instead.</p>
                            <span class="service-grid-link">Read case study &rarr;</span>
                        </div>
                    </a>
                    <a href="wazer-taxis.html" class="client-slide">
                        <div class="client-slide-photo">
                            <img src="../assets/images/client_go_wazer.jpeg" alt="Wazer Taxis website built by WebOctals" loading="lazy" width="1402" height="1122">
                        </div>
                        <div class="client-slide-content">
                            <span class="project-card-type">Taxi &amp; Transportation &mdash; Southampton</span>
                            <h2 class="card-title">Wazer Taxis</h2>
                            <p class="client-slide-hook">National apps were winning searches this local taxi firm should have owned. We built for local search instead.</p>
                            <span class="service-grid-link">Read case study &rarr;</span>
                        </div>
                    </a>
                    <a href="hair-we-cut.html" class="client-slide">
                        <div class="client-slide-photo">
                            <img src="../assets/images/client_hair_we_cut.jpeg" alt="Hair We Cut website built by WebOctals" loading="lazy" width="1402" height="1122">
                        </div>
                        <div class="client-slide-content">
                            <span class="project-card-type">Barber &amp; Salon</span>
                            <h2 class="card-title">Hair We Cut</h2>
                            <p class="client-slide-hook">A slow, generic site was losing in-the-moment searches to faster competitors. We built for speed and style.</p>
                            <span class="service-grid-link">Read case study &rarr;</span>
                        </div>
                    </a>
                    <a href="ar-worldwide.html" class="client-slide">
                        <div class="client-slide-photo">
                            <img src="../assets/images/client_worldwide_exchange.jpeg" alt="A.R Worldwide website built by WebOctals" loading="lazy" width="1402" height="1122">
                        </div>
                        <div class="client-slide-content">
                            <span class="project-card-type">Financial Services &mdash; Harrow</span>
                            <h2 class="card-title">A.R Worldwide</h2>
                            <p class="client-slide-hook">A cluttered site was undermining trust in a currency exchange business. We rebuilt it around credibility.</p>
                            <span class="service-grid-link">Read case study &rarr;</span>
                        </div>
                    </a>
                    <a href="quick-fit-shelving.html" class="client-slide">
                        <div class="client-slide-photo">
                            <img src="../assets/images/quick_fit_move.jpeg" alt="Quick Fit Shelving Ltd website built by WebOctals" loading="lazy" width="1402" height="1122">
                        </div>
                        <div class="client-slide-content">
                            <span class="project-card-type">Trade Services &mdash; Wednesbury</span>
                            <h2 class="card-title">Quick Fit Shelving Ltd</h2>
                            <p class="client-slide-hook">A hobby-site look was costing this trade supplier fast-moving enquiries. We built it to look the part.</p>
                            <span class="service-grid-link">Read case study &rarr;</span>
                        </div>
                    </a>
                </div>
                <div class="client-slider-controls">
                    <button type="button" class="client-slider-arrow client-slider-arrow--prev" aria-label="Previous client">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <div class="client-slider-dots"></div>
                    <button type="button" class="client-slider-arrow client-slider-arrow--next" aria-label="Next client">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Client List -->
    <section class="clients-grid-section">
        <div class="container">
            <div class="clients-grid">
                <a href="colindale-driving-school.html" class="card elev-sm client-card">
                    <div class="client-card-photo">
                        <img src="../assets/images/client_colindale_driving.jpeg" alt="Colindale Driving School website" loading="lazy" width="1402" height="1122">
                    </div>
                    <span class="project-card-type">Driving School &mdash; Colindale, London</span>
                    <h3 class="card-title">Colindale Driving School</h3>
                    <p class="client-card-problem"><strong>Problem:</strong> a generic site was losing local bookings to competitors.</p>
                    <span class="service-grid-link">Read case study &rarr;</span>
                </a>
                <a href="the-driving-spot.html" class="card elev-sm client-card">
                    <div class="client-card-photo">
                        <img src="../assets/images/client_driving_spot.jpeg" alt="The Driving Spot website" loading="lazy" width="1402" height="1122">
                    </div>
                    <span class="project-card-type">Driving School &mdash; Bedford &amp; Peterborough</span>
                    <h3 class="card-title">The Driving Spot</h3>
                    <p class="client-card-problem"><strong>Problem:</strong> one homepage couldn&rsquo;t rank across every town the school teaches in.</p>
                    <span class="service-grid-link">Read case study &rarr;</span>
                </a>
                <a href="fishermans-chips.html" class="card elev-sm client-card">
                    <div class="client-card-photo">
                        <img src="../assets/images/client_fisher_chips.jpeg" alt="Fisherman&rsquo;s Chips website" loading="lazy" width="1402" height="1122">
                    </div>
                    <span class="project-card-type">Food &amp; Beverage &mdash; Bedford</span>
                    <h3 class="card-title">Fisherman&rsquo;s Chips</h3>
                    <p class="client-card-problem"><strong>Problem:</strong> phone orders were pulling staff off the fryer during rushes.</p>
                    <span class="service-grid-link">Read case study &rarr;</span>
                </a>
                <a href="wazer-taxis.html" class="card elev-sm client-card">
                    <div class="client-card-photo">
                        <img src="../assets/images/client_go_wazer.jpeg" alt="Wazer Taxis website" loading="lazy" width="1402" height="1122">
                    </div>
                    <span class="project-card-type">Taxi &amp; Transportation &mdash; Southampton</span>
                    <h3 class="card-title">Wazer Taxis</h3>
                    <p class="client-card-problem"><strong>Problem:</strong> national booking apps were winning searches this local firm should own.</p>
                    <span class="service-grid-link">Read case study &rarr;</span>
                </a>
                <a href="hair-we-cut.html" class="card elev-sm client-card">
                    <div class="client-card-photo">
                        <img src="../assets/images/client_hair_we_cut.jpeg" alt="Hair We Cut website" loading="lazy" width="1402" height="1122">
                    </div>
                    <span class="project-card-type">Barber &amp; Salon</span>
                    <h3 class="card-title">Hair We Cut</h3>
                    <p class="client-card-problem"><strong>Problem:</strong> a slow, generic site was losing in-the-moment searches.</p>
                    <span class="service-grid-link">Read case study &rarr;</span>
                </a>
                <a href="ar-worldwide.html" class="card elev-sm client-card">
                    <div class="client-card-photo">
                        <img src="../assets/images/client_worldwide_exchange.jpeg" alt="A.R Worldwide website" loading="lazy" width="1402" height="1122">
                    </div>
                    <span class="project-card-type">Financial Services &mdash; Harrow</span>
                    <h3 class="card-title">A.R Worldwide</h3>
                    <p class="client-card-problem"><strong>Problem:</strong> a cluttered site was undermining trust in a currency exchange.</p>
                    <span class="service-grid-link">Read case study &rarr;</span>
                </a>
                <a href="quick-fit-shelving.html" class="card elev-sm client-card">
                    <div class="client-card-photo">
                        <img src="../assets/images/quick_fit_move.jpeg" alt="Quick Fit Shelving Ltd website" loading="lazy" width="1402" height="1122">
                    </div>
                    <span class="project-card-type">Trade Services &mdash; Wednesbury</span>
                    <h3 class="card-title">Quick Fit Shelving Ltd</h3>
                    <p class="client-card-problem"><strong>Problem:</strong> a hobby-site look was costing fast-moving trade enquiries.</p>
                    <span class="service-grid-link">Read case study &rarr;</span>
                </a>
            </div>
        </div>
    </section>
```

Assemble the full file per the "Full page skeleton" in Shared Fragments and write it to `clients/index.html`.

- [ ] **Step 2: Verify referenced images exist**

```bash
for f in client_colindale_driving client_driving_spot client_fisher_chips client_go_wazer client_hair_we_cut client_worldwide_exchange; do test -f "assets/images/${f}.jpeg" && echo "OK: $f" || echo "MISSING: $f"; done
test -f assets/images/quick_fit_move.jpeg && echo "OK: quick_fit_move" || echo "MISSING: quick_fit_move"
```

Expected: 7 `OK:` lines, no `MISSING:`.

- [ ] **Step 3: Verify structure**

```bash
grep -c '<h1>Our Clients</h1>' clients/index.html
grep -c 'class="nav-link active">Clients</a>' clients/index.html
grep -c 'class="client-slide"' clients/index.html
grep -c 'class="card elev-sm client-card"' clients/index.html
python3 -c "
import re
text = open('clients/index.html').read()
m = re.search(r'<script type=\"application/ld\+json\">(.*?)</script>', text, re.S)
import json
json.loads(m.group(1))
print('JSON-LD valid')
"
```

Expected: `1`, `1`, `7`, `7`, `JSON-LD valid`.

- [ ] **Step 4: Commit**

```bash
git add clients/index.html
git commit -m "Add clients/index.html with hero slider and client list"
```

---

### Task 5: Create `clients/colindale-driving-school.html`

**Files:**
- Create: `clients/colindale-driving-school.html`

**Interfaces:**
- Consumes: Shared Fragments (Task 1-3 groundwork); links back to `index.html` (Task 4) and forward to `../contact.html`.
- Produces: nothing consumed by other tasks.

- [ ] **Step 1: Write the file**

`{PAGE_DESCRIPTION}` = `How WebOctals built a booking-focused driving school website for Colindale Driving School in North London, turning local searches into lesson bookings.`

`{PAGE_TITLE}` = `Colindale Driving School — Driving School Website Case Study | WebOctals Clients`

`{CANONICAL_URL}` = `https://weboctals.com/clients/colindale-driving-school.html`

`{PAGE_JSON_LD}`:

```json
{"@context":"https://schema.org","@graph":[
    {"@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":"https://weboctals.com/"},
        {"@type":"ListItem","position":2,"name":"Clients","item":"https://weboctals.com/clients/index.html"},
        {"@type":"ListItem","position":3,"name":"Colindale Driving School","item":"https://weboctals.com/clients/colindale-driving-school.html"}
    ]},
    {"@type":"Article","headline":"Colindale Driving School — Driving School Website Case Study","description":"How WebOctals built a booking-focused driving school website for Colindale Driving School in North London, turning local searches into lesson bookings.","about":{"@type":"LocalBusiness","name":"Colindale Driving School","address":{"@type":"PostalAddress","addressLocality":"Colindale, London"}},"author":{"@type":"Organization","name":"WebOctals","url":"https://weboctals.com/"},"publisher":{"@type":"Organization","name":"WebOctals","url":"https://weboctals.com/"},"image":"https://weboctals.com/assets/images/client_colindale_driving.jpeg"}
]}
```

`{PAGE_MAIN_CONTENT}`:

```html
    <!-- Client Case Study -->
    <section class="page-section">
        <div class="container">
            <a href="index.html" class="client-back-link">&larr; All clients</a>

            <div class="client-landing-hero">
                <div class="client-landing-photo">
                    <img src="../assets/images/client_colindale_driving.jpeg" alt="Colindale Driving School website built by WebOctals" loading="eager" width="1402" height="1122">
                </div>
                <div>
                    <span class="project-card-type">Driving School &mdash; Colindale, London</span>
                    <h1>Colindale Driving School</h1>
                    <div class="project-tags">
                        <span class="tag tag-accent">Driving School</span>
                        <span class="tag tag-accent-2">Booking</span>
                        <span class="tag tag-neutral">Local Business</span>
                    </div>
                </div>
            </div>

            <div class="client-par-grid">
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Problem</span>
                    <p>Colindale Driving School teaches learner drivers across Colindale and the wider North London area, competing for attention against national instructor-matching platforms that dominate generic &ldquo;driving lessons near me&rdquo; searches. Their previous online presence didn&rsquo;t reflect the quality of instruction on offer: pricing was hard to find, there was no clear way to see instructor availability, and enquiries were arriving as one-line messages with no context, meaning the school spent time on back-and-forth before a lesson could even be booked. For a business that depends entirely on local trust &mdash; parents and new drivers choosing a school by reputation and convenience &mdash; a vague, generic website was actively costing them enquiries to competitors with clearer sites. They needed a site that read as a genuine local specialist in Colindale, not one of dozens of interchangeable driving school templates, and that made the actual booking decision easy on a phone, since most learners search and enquire on mobile.</p>
                </div>
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Action</span>
                    <p>We built Colindale Driving School a straightforward, trustworthy site structured around the one thing that matters most to a learner driver: booking a first lesson without friction. Lesson types, pricing and instructor information sit right at the top of the page, with a clear, single call to action repeated at every scroll depth so visitors are never more than a tap away from getting in touch. Every page is written and structured around Colindale and the surrounding North London postcodes the school actually covers, with location-specific headings, copy and metadata, so local search engines can match the site to the exact area searches it should be winning &mdash; rather than competing for generic national terms it was never going to rank for. The site loads fast on mobile data, keeps forms short, and uses clear calls to action instead of the long-winded copy generic template sites tend to use. We also structured the contact form to capture the details the school actually needs upfront &mdash; preferred day, transmission type, experience level &mdash; cutting down the back-and-forth before a lesson can be confirmed.</p>
                </div>
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Results</span>
                    <p>Colindale Driving School now has a live, mobile-first website that presents lesson options, pricing and instructor information clearly from the first screen, with booking enquiries just one tap away throughout. The site&rsquo;s structure and content are built specifically around Colindale and North London search terms, giving the school a genuine local presence instead of competing head-on with national platforms for generic keywords. Enquiries now arrive with the context the school needs &mdash; lesson type, availability, experience level &mdash; so less time is spent on back-and-forth before a lesson is actually booked. As a fast, focused, locally-optimised site, it gives Colindale Driving School a stronger footing in local search results and a page that reflects the quality of the instruction on offer, rather than undermining it.</p>
                </div>
            </div>

            <div class="client-landing-cta">
                <a href="../contact.html" class="btn btn-primary">
                    <span>Start your project</span>
                    <div class="btn-glow"></div>
                </a>
            </div>
        </div>
    </section>
```

Assemble the full file per the "Full page skeleton" and write it to `clients/colindale-driving-school.html`.

- [ ] **Step 2: Verify**

```bash
grep -c '<h1>Colindale Driving School</h1>' clients/colindale-driving-school.html
grep -c 'client-par-label">Problem<' clients/colindale-driving-school.html
grep -c 'client-par-label">Action<' clients/colindale-driving-school.html
grep -c 'client-par-label">Results<' clients/colindale-driving-school.html
grep -c 'href="../contact.html" class="btn btn-primary"' clients/colindale-driving-school.html
python3 -c "
import re, json
text = open('clients/colindale-driving-school.html').read()
m = re.search(r'<script type=\"application/ld\+json\">(.*?)</script>', text, re.S)
json.loads(m.group(1))
print('JSON-LD valid')
"
```

Expected: `1`, `1`, `1`, `1`, `1`, `JSON-LD valid`.

- [ ] **Step 3: Commit**

```bash
git add clients/colindale-driving-school.html
git commit -m "Add Colindale Driving School client case study page"
```

---

### Task 6: Create `clients/the-driving-spot.html`

**Files:**
- Create: `clients/the-driving-spot.html`

**Interfaces:** same pattern as Task 5.

- [ ] **Step 1: Write the file**

`{PAGE_DESCRIPTION}` = `How WebOctals built a booking-first driving school website for The Driving Spot, ranking across Bedford, Peterborough and every area the school covers.`

`{PAGE_TITLE}` = `The Driving Spot — Driving School Website Case Study | WebOctals Clients`

`{CANONICAL_URL}` = `https://weboctals.com/clients/the-driving-spot.html`

`{PAGE_JSON_LD}`:

```json
{"@context":"https://schema.org","@graph":[
    {"@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":"https://weboctals.com/"},
        {"@type":"ListItem","position":2,"name":"Clients","item":"https://weboctals.com/clients/index.html"},
        {"@type":"ListItem","position":3,"name":"The Driving Spot","item":"https://weboctals.com/clients/the-driving-spot.html"}
    ]},
    {"@type":"Article","headline":"The Driving Spot — Driving School Website Case Study","description":"How WebOctals built a booking-first driving school website for The Driving Spot, ranking across Bedford, Peterborough and every area the school covers.","about":{"@type":"LocalBusiness","name":"The Driving Spot","address":{"@type":"PostalAddress","addressLocality":"Bedford"}},"author":{"@type":"Organization","name":"WebOctals","url":"https://weboctals.com/"},"publisher":{"@type":"Organization","name":"WebOctals","url":"https://weboctals.com/"},"image":"https://weboctals.com/assets/images/client_driving_spot.jpeg"}
]}
```

`{PAGE_MAIN_CONTENT}`:

```html
    <!-- Client Case Study -->
    <section class="page-section">
        <div class="container">
            <a href="index.html" class="client-back-link">&larr; All clients</a>

            <div class="client-landing-hero">
                <div class="client-landing-photo">
                    <img src="../assets/images/client_driving_spot.jpeg" alt="The Driving Spot website built by WebOctals" loading="eager" width="1402" height="1122">
                </div>
                <div>
                    <span class="project-card-type">Driving School &mdash; Bedford &amp; Peterborough</span>
                    <h1>The Driving Spot</h1>
                    <div class="project-tags">
                        <span class="tag tag-accent">Driving School</span>
                        <span class="tag tag-accent-2">Booking</span>
                        <span class="tag tag-neutral">Local Business</span>
                    </div>
                </div>
            </div>

            <div class="client-par-grid">
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Problem</span>
                    <p>The Driving Spot runs driving lessons across Bedford, Peterborough and several surrounding towns &mdash; a wider coverage area than most local driving schools, which created a specific problem: a single generic homepage couldn&rsquo;t rank for, or even clearly communicate, every area the school actually served. Prospective learners searching for lessons in one specific town had no way to quickly confirm the school covered their area, and often bounced to a competitor whose site named their town explicitly. Instructor and pricing information wasn&rsquo;t easy to find, and there was no consistent, clear path from &ldquo;interested visitor&rdquo; to &ldquo;booked lesson&rdquo; &mdash; enquiries relied on visitors working out how to get in touch themselves rather than being guided toward it. For a driving school competing across multiple towns simultaneously, being invisible in local search for even one of those areas meant losing bookings to schools with narrower but better-optimised sites.</p>
                </div>
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Action</span>
                    <p>We built The Driving Spot a site structured specifically to earn visibility across every town it serves, not just its home base. Content, headings and metadata are built around each area &mdash; Bedford, Peterborough and the surrounding towns &mdash; so the site can compete in local search results area by area rather than relying on one generic set of keywords to do all the work. Instructor information and transparent pricing sit prominently on the page, removing the guesswork that sends hesitant learners elsewhere, and a clear, consistent call to action runs through the site so every page gives visitors an obvious next step towards booking a lesson. We kept the design clean and fast-loading, prioritising the practical information &mdash; coverage area, pricing, how to book &mdash; that a learner actually needs to make a decision, rather than filling the page with generic stock imagery and vague copy.</p>
                </div>
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Results</span>
                    <p>The Driving Spot now has a website built to be found by name in every area it covers, with dedicated local search structure across Bedford, Peterborough and the surrounding towns instead of a single catch-all homepage. Instructor and pricing information is upfront and easy to find, and every page carries a clear path toward booking a lesson, so interested visitors are guided toward getting in touch rather than left to figure it out themselves. The result is a site that matches the real shape of the business &mdash; a driving school genuinely operating across a wide catchment area &mdash; and gives it a fair shot at ranking in local search everywhere it teaches, not just its home town.</p>
                </div>
            </div>

            <div class="client-landing-cta">
                <a href="../contact.html" class="btn btn-primary">
                    <span>Start your project</span>
                    <div class="btn-glow"></div>
                </a>
            </div>
        </div>
    </section>
```

Assemble and write to `clients/the-driving-spot.html`.

- [ ] **Step 2: Verify**

```bash
grep -c '<h1>The Driving Spot</h1>' clients/the-driving-spot.html
grep -c 'client-par-label">Problem<' clients/the-driving-spot.html
grep -c 'client-par-label">Action<' clients/the-driving-spot.html
grep -c 'client-par-label">Results<' clients/the-driving-spot.html
python3 -c "
import re, json
text = open('clients/the-driving-spot.html').read()
m = re.search(r'<script type=\"application/ld\+json\">(.*?)</script>', text, re.S)
json.loads(m.group(1))
print('JSON-LD valid')
"
```

Expected: `1`, `1`, `1`, `1`, `JSON-LD valid`.

- [ ] **Step 3: Commit**

```bash
git add clients/the-driving-spot.html
git commit -m "Add The Driving Spot client case study page"
```

---

### Task 7: Create `clients/fishermans-chips.html`

**Files:**
- Create: `clients/fishermans-chips.html`

**Interfaces:** same pattern as Task 5.

- [ ] **Step 1: Write the file**

`{PAGE_DESCRIPTION}` = `How WebOctals built a menu-first online ordering website for Fisherman&rsquo;s Chips, a Bedford fish and chip shop, to cut queues and phone orders.`

`{PAGE_TITLE}` = `Fisherman&rsquo;s Chips — Fish & Chip Shop Website Case Study | WebOctals Clients`

`{CANONICAL_URL}` = `https://weboctals.com/clients/fishermans-chips.html`

`{PAGE_JSON_LD}`:

```json
{"@context":"https://schema.org","@graph":[
    {"@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":"https://weboctals.com/"},
        {"@type":"ListItem","position":2,"name":"Clients","item":"https://weboctals.com/clients/index.html"},
        {"@type":"ListItem","position":3,"name":"Fisherman&rsquo;s Chips","item":"https://weboctals.com/clients/fishermans-chips.html"}
    ]},
    {"@type":"Article","headline":"Fisherman&rsquo;s Chips — Fish & Chip Shop Website Case Study","description":"How WebOctals built a menu-first online ordering website for Fisherman&rsquo;s Chips, a Bedford fish and chip shop, to cut queues and phone orders.","about":{"@type":"LocalBusiness","name":"Fisherman&rsquo;s Chips","address":{"@type":"PostalAddress","addressLocality":"Bedford"}},"author":{"@type":"Organization","name":"WebOctals","url":"https://weboctals.com/"},"publisher":{"@type":"Organization","name":"WebOctals","url":"https://weboctals.com/"},"image":"https://weboctals.com/assets/images/client_fisher_chips.jpeg"}
]}
```

`{PAGE_MAIN_CONTENT}`:

```html
    <!-- Client Case Study -->
    <section class="page-section">
        <div class="container">
            <a href="index.html" class="client-back-link">&larr; All clients</a>

            <div class="client-landing-hero">
                <div class="client-landing-photo">
                    <img src="../assets/images/client_fisher_chips.jpeg" alt="Fisherman&rsquo;s Chips website built by WebOctals" loading="eager" width="1402" height="1122">
                </div>
                <div>
                    <span class="project-card-type">Food &amp; Beverage &mdash; Bedford</span>
                    <h1>Fisherman&rsquo;s Chips</h1>
                    <div class="project-tags">
                        <span class="tag tag-accent">Food &amp; Beverage</span>
                        <span class="tag tag-accent-2">Online Ordering</span>
                        <span class="tag tag-neutral">Local Business</span>
                    </div>
                </div>
            </div>

            <div class="client-par-grid">
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Problem</span>
                    <p>Fisherman&rsquo;s Chips serves the Bedford area with fresh fish and chips, and like most independent takeaways, most of its trade happens in a narrow window around lunch and dinner. Every order taken by phone meant a staff member pulled away from the fryer to answer calls, and every walk-in queue meant customers who didn&rsquo;t want to wait simply went elsewhere. Without any way to order online, the shop was leaving orders on the table from the growing number of customers who expect to browse a menu and order from their phone, especially during the busiest, most time-pressured periods. There was also no real web presence to speak of, so people searching for fish and chips in Bedford had little reason to find or choose Fisherman&rsquo;s Chips over any of the other local takeaways with a more visible online presence, regardless of food quality.</p>
                </div>
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Action</span>
                    <p>We built Fisherman&rsquo;s Chips a menu-first website with online ordering placed front and centre, so a customer can land on the site, see the full menu, and place an order in a few taps without needing to call or queue. The whole experience is optimised for mobile, since that&rsquo;s where the overwhelming majority of takeaway orders start, with a fast-loading menu, clear pricing, and a straightforward checkout flow built for speed during busy periods. We structured the site so search engines can clearly tell it&rsquo;s a genuine local takeaway &mdash; not a generic template &mdash; with content and metadata built around &ldquo;fish and chips Bedford&rdquo; and related local searches, so the shop shows up for the exact customers most likely to order. The design keeps the focus on the menu and the order button at every scroll depth, rather than burying ordering behind extra clicks.</p>
                </div>
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Results</span>
                    <p>Fisherman&rsquo;s Chips now has a fast, mobile-first website that lets customers browse the full menu and place an order directly, without tying up the phone line or queuing in person. The site is structured and optimised specifically around local &ldquo;fish and chips Bedford&rdquo; search terms, giving the shop a genuine, findable presence for the customers most likely to order from it. During busy service periods, online ordering gives the kitchen a calmer, more predictable stream of orders instead of a phone ringing constantly on top of walk-in trade. The result is a site that matches how people actually want to order takeaway today &mdash; quickly, from their phone &mdash; while reinforcing that Fisherman&rsquo;s Chips is a real, established local business worth choosing over a less visible competitor.</p>
                </div>
            </div>

            <div class="client-landing-cta">
                <a href="../contact.html" class="btn btn-primary">
                    <span>Start your project</span>
                    <div class="btn-glow"></div>
                </a>
            </div>
        </div>
    </section>
```

Assemble and write to `clients/fishermans-chips.html`.

- [ ] **Step 2: Verify**

```bash
grep -c 'Fisherman&rsquo;s Chips</h1>' clients/fishermans-chips.html
grep -c 'client-par-label">Problem<' clients/fishermans-chips.html
grep -c 'client-par-label">Action<' clients/fishermans-chips.html
grep -c 'client-par-label">Results<' clients/fishermans-chips.html
python3 -c "
import re, json
text = open('clients/fishermans-chips.html').read()
m = re.search(r'<script type=\"application/ld\+json\">(.*?)</script>', text, re.S)
json.loads(m.group(1))
print('JSON-LD valid')
"
```

Expected: `1`, `1`, `1`, `1`, `JSON-LD valid`.

- [ ] **Step 3: Commit**

```bash
git add clients/fishermans-chips.html
git commit -m "Add Fisherman's Chips client case study page"
```

---

### Task 8: Create `clients/wazer-taxis.html`

**Files:**
- Create: `clients/wazer-taxis.html`

**Interfaces:** same pattern as Task 5.

- [ ] **Step 1: Write the file**

`{PAGE_DESCRIPTION}` = `How WebOctals built a fast local booking website for Wazer Taxis in Southampton, helping the firm compete with national ride-booking apps.`

`{PAGE_TITLE}` = `Wazer Taxis — Taxi & Transport Website Case Study | WebOctals Clients`

`{CANONICAL_URL}` = `https://weboctals.com/clients/wazer-taxis.html`

`{PAGE_JSON_LD}`:

```json
{"@context":"https://schema.org","@graph":[
    {"@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":"https://weboctals.com/"},
        {"@type":"ListItem","position":2,"name":"Clients","item":"https://weboctals.com/clients/index.html"},
        {"@type":"ListItem","position":3,"name":"Wazer Taxis","item":"https://weboctals.com/clients/wazer-taxis.html"}
    ]},
    {"@type":"Article","headline":"Wazer Taxis — Taxi & Transport Website Case Study","description":"How WebOctals built a fast local booking website for Wazer Taxis in Southampton, helping the firm compete with national ride-booking apps.","about":{"@type":"LocalBusiness","name":"Wazer Taxis","address":{"@type":"PostalAddress","addressLocality":"Southampton"}},"author":{"@type":"Organization","name":"WebOctals","url":"https://weboctals.com/"},"publisher":{"@type":"Organization","name":"WebOctals","url":"https://weboctals.com/"},"image":"https://weboctals.com/assets/images/client_go_wazer.jpeg"}
]}
```

`{PAGE_MAIN_CONTENT}`:

```html
    <!-- Client Case Study -->
    <section class="page-section">
        <div class="container">
            <a href="index.html" class="client-back-link">&larr; All clients</a>

            <div class="client-landing-hero">
                <div class="client-landing-photo">
                    <img src="../assets/images/client_go_wazer.jpeg" alt="Wazer Taxis website built by WebOctals" loading="eager" width="1402" height="1122">
                </div>
                <div>
                    <span class="project-card-type">Taxi &amp; Transportation &mdash; Southampton</span>
                    <h1>Wazer Taxis</h1>
                    <div class="project-tags">
                        <span class="tag tag-accent">Transportation</span>
                        <span class="tag tag-accent-2">Booking</span>
                        <span class="tag tag-neutral">Local Business</span>
                    </div>
                </div>
            </div>

            <div class="client-par-grid">
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Problem</span>
                    <p>Wazer Taxis provides local taxi and transport services in and around Southampton, competing directly against national ride-booking apps that dominate app-store searches and paid advertising. Without a clear, fast website of its own, the firm was almost entirely reliant on repeat customers who already had a phone number saved, with no real way to capture the passenger who searches &ldquo;taxi Southampton&rdquo; online and expects to find a bookable option in seconds. Any existing web presence didn&rsquo;t make it obvious how to actually book a ride &mdash; no clear phone number front and centre, no simple explanation of the services on offer (local journeys, airport runs, pre-booked trips), and nothing that reassured a first-time passenger they were dealing with a real, established local operator rather than an unlicensed alternative. Every visitor who couldn&rsquo;t immediately see how to book moved on to an app instead.</p>
                </div>
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Action</span>
                    <p>We built Wazer Taxis a site designed to make booking a ride as fast as calling one. Contact options &mdash; phone number, booking request &mdash; are placed prominently on every page, with service information (local journeys, airport transfers, advance bookings) laid out clearly so passengers know exactly what&rsquo;s on offer before they get in touch. The whole site is structured around local search, with content and metadata built specifically for &ldquo;taxi Southampton&rdquo; and related searches, so people looking for a taxi in the area find Wazer directly rather than defaulting to a national booking app out of convenience. We kept the design fast-loading and mobile-first, since most taxi bookings happen on the move, often at short notice, and stripped out anything that stood between a visitor and picking up the phone or sending a booking request.</p>
                </div>
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Results</span>
                    <p>Wazer Taxis now has a website that makes getting a ride as quick as it should be &mdash; service information and a clear way to book are visible immediately, with no hunting for a phone number or wondering what&rsquo;s actually on offer. Because the site is structured and optimised specifically around local Southampton search terms, it gives Wazer a genuine chance of being found by passengers searching for a taxi in the area, rather than losing that search entirely to national apps. The site also gives first-time passengers the reassurance of a real, established local operator with a proper web presence, rather than just a phone number passed along by word of mouth. Overall, it turns Wazer&rsquo;s website from an afterthought into an active source of local bookings.</p>
                </div>
            </div>

            <div class="client-landing-cta">
                <a href="../contact.html" class="btn btn-primary">
                    <span>Start your project</span>
                    <div class="btn-glow"></div>
                </a>
            </div>
        </div>
    </section>
```

Assemble and write to `clients/wazer-taxis.html`.

- [ ] **Step 2: Verify**

```bash
grep -c '<h1>Wazer Taxis</h1>' clients/wazer-taxis.html
grep -c 'client-par-label">Problem<' clients/wazer-taxis.html
grep -c 'client-par-label">Action<' clients/wazer-taxis.html
grep -c 'client-par-label">Results<' clients/wazer-taxis.html
python3 -c "
import re, json
text = open('clients/wazer-taxis.html').read()
m = re.search(r'<script type=\"application/ld\+json\">(.*?)</script>', text, re.S)
json.loads(m.group(1))
print('JSON-LD valid')
"
```

Expected: `1`, `1`, `1`, `1`, `JSON-LD valid`.

- [ ] **Step 3: Commit**

```bash
git add clients/wazer-taxis.html
git commit -m "Add Wazer Taxis client case study page"
```

---

### Task 9: Create `clients/hair-we-cut.html`

**Files:**
- Create: `clients/hair-we-cut.html`

**Interfaces:** same pattern as Task 5.

- [ ] **Step 1: Write the file**

`{PAGE_DESCRIPTION}` = `How WebOctals built a fast, booking-ready barber shop website for Hair We Cut, designed to convert walk-in interest into booked appointments.`

`{PAGE_TITLE}` = `Hair We Cut — Barber Shop Website Case Study | WebOctals Clients`

`{CANONICAL_URL}` = `https://weboctals.com/clients/hair-we-cut.html`

`{PAGE_JSON_LD}`:

```json
{"@context":"https://schema.org","@graph":[
    {"@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":"https://weboctals.com/"},
        {"@type":"ListItem","position":2,"name":"Clients","item":"https://weboctals.com/clients/index.html"},
        {"@type":"ListItem","position":3,"name":"Hair We Cut","item":"https://weboctals.com/clients/hair-we-cut.html"}
    ]},
    {"@type":"Article","headline":"Hair We Cut — Barber Shop Website Case Study","description":"How WebOctals built a fast, booking-ready barber shop website for Hair We Cut, designed to convert walk-in interest into booked appointments.","about":{"@type":"LocalBusiness","name":"Hair We Cut"},"author":{"@type":"Organization","name":"WebOctals","url":"https://weboctals.com/"},"publisher":{"@type":"Organization","name":"WebOctals","url":"https://weboctals.com/"},"image":"https://weboctals.com/assets/images/client_hair_we_cut.jpeg"}
]}
```

`{PAGE_MAIN_CONTENT}`:

```html
    <!-- Client Case Study -->
    <section class="page-section">
        <div class="container">
            <a href="index.html" class="client-back-link">&larr; All clients</a>

            <div class="client-landing-hero">
                <div class="client-landing-photo">
                    <img src="../assets/images/client_hair_we_cut.jpeg" alt="Hair We Cut website built by WebOctals" loading="eager" width="1402" height="1122">
                </div>
                <div>
                    <span class="project-card-type">Barber &amp; Salon</span>
                    <h1>Hair We Cut</h1>
                    <div class="project-tags">
                        <span class="tag tag-accent">Barber &amp; Salon</span>
                        <span class="tag tag-accent-2">Booking</span>
                        <span class="tag tag-neutral">Local Business</span>
                    </div>
                </div>
            </div>

            <div class="client-par-grid">
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Problem</span>
                    <p>Hair We Cut is a barber shop built around a distinct, sharp style, but its online presence didn&rsquo;t reflect that &mdash; or make it easy for someone to actually book a cut. Most barber shop decisions happen in the moment: someone&rsquo;s out, decides they need a haircut, and searches on their phone for somewhere nearby with availability. Without a fast, mobile-friendly site showing services, pricing and an obvious way to book, that moment of intent was being lost to competitors whose sites loaded faster or made booking more obvious. Pricing wasn&rsquo;t clearly listed anywhere, which meant potential customers had to call and ask before they could even decide whether to come in, and the shop&rsquo;s actual visual identity &mdash; the sharp, simple style that sets it apart &mdash; wasn&rsquo;t coming through in a generic, unremarkable web presence.</p>
                </div>
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Action</span>
                    <p>We built Hair We Cut a lightweight, fast-loading site that matches the shop&rsquo;s own style: sharp, simple, and built for someone deciding where to get a cut while they&rsquo;re already out and about. Services and pricing are laid out clearly and immediately, removing the need to call and ask before deciding to visit, and the whole design is optimised to load quickly on mobile data, since that&rsquo;s where the overwhelming majority of barber shop searches and bookings happen. The visual design itself was built to reflect the shop&rsquo;s actual identity &mdash; clean, confident, distinctive &mdash; rather than defaulting to a generic barber template, so the site reinforces the same style customers experience once they&rsquo;re in the chair. Every page keeps a clear, low-friction path toward getting in touch or booking, rather than burying it behind extra navigation.</p>
                </div>
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Results</span>
                    <p>Hair We Cut now has a fast, mobile-first website that shows services and pricing clearly upfront, so potential customers can decide to visit without needing to call and ask first. The site&rsquo;s speed and simplicity are built specifically for the moment-of-intent searches that drive most barber shop bookings &mdash; someone deciding right now where to get a cut &mdash; rather than a slow, generic site that loses that visitor to a faster-loading competitor. The design reflects the shop&rsquo;s own sharp, simple visual identity, giving Hair We Cut a web presence that actually looks like the business, rather than an off-the-shelf template. The result is a site built to turn casual, in-the-moment searches into real walk-in and booked trade.</p>
                </div>
            </div>

            <div class="client-landing-cta">
                <a href="../contact.html" class="btn btn-primary">
                    <span>Start your project</span>
                    <div class="btn-glow"></div>
                </a>
            </div>
        </div>
    </section>
```

Assemble and write to `clients/hair-we-cut.html`.

- [ ] **Step 2: Verify**

```bash
grep -c '<h1>Hair We Cut</h1>' clients/hair-we-cut.html
grep -c 'client-par-label">Problem<' clients/hair-we-cut.html
grep -c 'client-par-label">Action<' clients/hair-we-cut.html
grep -c 'client-par-label">Results<' clients/hair-we-cut.html
python3 -c "
import re, json
text = open('clients/hair-we-cut.html').read()
m = re.search(r'<script type=\"application/ld\+json\">(.*?)</script>', text, re.S)
json.loads(m.group(1))
print('JSON-LD valid')
"
```

Expected: `1`, `1`, `1`, `1`, `JSON-LD valid`.

- [ ] **Step 3: Commit**

```bash
git add clients/hair-we-cut.html
git commit -m "Add Hair We Cut client case study page"
```

---

### Task 10: Create `clients/ar-worldwide.html`

**Files:**
- Create: `clients/ar-worldwide.html`

**Interfaces:** same pattern as Task 5.

- [ ] **Step 1: Write the file**

`{PAGE_DESCRIPTION}` = `How WebOctals built a trust-first website for A.R Worldwide, a Harrow currency exchange business, to make transactions feel credible and secure.`

`{PAGE_TITLE}` = `A.R Worldwide — Currency Exchange Website Case Study | WebOctals Clients`

`{CANONICAL_URL}` = `https://weboctals.com/clients/ar-worldwide.html`

`{PAGE_JSON_LD}`:

```json
{"@context":"https://schema.org","@graph":[
    {"@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":"https://weboctals.com/"},
        {"@type":"ListItem","position":2,"name":"Clients","item":"https://weboctals.com/clients/index.html"},
        {"@type":"ListItem","position":3,"name":"A.R Worldwide","item":"https://weboctals.com/clients/ar-worldwide.html"}
    ]},
    {"@type":"Article","headline":"A.R Worldwide — Currency Exchange Website Case Study","description":"How WebOctals built a trust-first website for A.R Worldwide, a Harrow currency exchange business, to make transactions feel credible and secure.","about":{"@type":"LocalBusiness","name":"A.R Worldwide","address":{"@type":"PostalAddress","addressLocality":"Harrow"}},"author":{"@type":"Organization","name":"WebOctals","url":"https://weboctals.com/"},"publisher":{"@type":"Organization","name":"WebOctals","url":"https://weboctals.com/"},"image":"https://weboctals.com/assets/images/client_worldwide_exchange.jpeg"}
]}
```

`{PAGE_MAIN_CONTENT}`:

```html
    <!-- Client Case Study -->
    <section class="page-section">
        <div class="container">
            <a href="index.html" class="client-back-link">&larr; All clients</a>

            <div class="client-landing-hero">
                <div class="client-landing-photo">
                    <img src="../assets/images/client_worldwide_exchange.jpeg" alt="A.R Worldwide website built by WebOctals" loading="eager" width="1402" height="1122">
                </div>
                <div>
                    <span class="project-card-type">Financial Services &mdash; Harrow</span>
                    <h1>A.R Worldwide</h1>
                    <div class="project-tags">
                        <span class="tag tag-accent">Financial Services</span>
                        <span class="tag tag-accent-2">Local Business</span>
                    </div>
                </div>
            </div>

            <div class="client-par-grid">
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Problem</span>
                    <p>A.R Worldwide provides currency exchange services from Harrow, Middlesex &mdash; a business where trust is the entire product. Customers exchanging money need to feel confident before they&rsquo;ll hand it over, and any hint of an unpolished, cluttered or unclear website raises exactly the wrong kind of doubt for a financial services business. The company&rsquo;s existing web presence didn&rsquo;t give that immediate sense of credibility: information about services and rates was hard to locate, the location and contact details weren&rsquo;t obvious, and the overall design didn&rsquo;t communicate the seriousness and security that a currency exchange business depends on to win first-time customers. For a business competing against established high-street exchange bureaus and banks, a website that looked anything less than fully professional was a real barrier to earning new trade, regardless of the rates or service actually on offer.</p>
                </div>
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Action</span>
                    <p>We built A.R Worldwide a clean, uncluttered site specifically designed to feel credible and secure at a glance &mdash; because for a business that handles people&rsquo;s money, first impressions carry real weight. Services and location information are placed clearly and immediately, with a direct, obvious path to getting in touch about a transaction, so a visitor never has to hunt for the basics before deciding to trust the business with an exchange. We deliberately avoided the cluttered, sales-heavy design common to smaller financial services sites, opting instead for a calm, professional layout that signals the business is established and serious. The site is structured around Harrow and the surrounding area, so local search visibility matches the business&rsquo;s actual trading footprint rather than competing generically.</p>
                </div>
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Results</span>
                    <p>A.R Worldwide now has a website that gives first-time visitors the immediate sense of credibility a financial services business needs to earn trust. Services and location information are easy to find, with a clear, direct path to getting in touch about a transaction, removing friction at exactly the point where trust and clarity matter most. The clean, professional design positions A.R Worldwide alongside &mdash; rather than beneath &mdash; larger, more established exchange bureaus, and the site&rsquo;s local structure gives it genuine visibility for Harrow-area searches. The result is a web presence that reflects the seriousness of the service on offer, rather than undermining it with a cluttered or generic-feeling site.</p>
                </div>
            </div>

            <div class="client-landing-cta">
                <a href="../contact.html" class="btn btn-primary">
                    <span>Start your project</span>
                    <div class="btn-glow"></div>
                </a>
            </div>
        </div>
    </section>
```

Assemble and write to `clients/ar-worldwide.html`.

- [ ] **Step 2: Verify**

```bash
grep -c '<h1>A.R Worldwide</h1>' clients/ar-worldwide.html
grep -c 'client-par-label">Problem<' clients/ar-worldwide.html
grep -c 'client-par-label">Action<' clients/ar-worldwide.html
grep -c 'client-par-label">Results<' clients/ar-worldwide.html
python3 -c "
import re, json
text = open('clients/ar-worldwide.html').read()
m = re.search(r'<script type=\"application/ld\+json\">(.*?)</script>', text, re.S)
json.loads(m.group(1))
print('JSON-LD valid')
"
```

Expected: `1`, `1`, `1`, `1`, `JSON-LD valid`.

- [ ] **Step 3: Commit**

```bash
git add clients/ar-worldwide.html
git commit -m "Add A.R Worldwide client case study page"
```

---

### Task 11: Create `clients/quick-fit-shelving.html`

**Files:**
- Create: `clients/quick-fit-shelving.html`

**Interfaces:** same pattern as Task 5.

- [ ] **Step 1: Write the file**

`{PAGE_DESCRIPTION}` = `How WebOctals built an information-first trade website for Quick Fit Shelving Ltd, a Wednesbury shelving supplier, built for fast practical searches.`

`{PAGE_TITLE}` = `Quick Fit Shelving Ltd — Trade Services Website Case Study | WebOctals Clients`

`{CANONICAL_URL}` = `https://weboctals.com/clients/quick-fit-shelving.html`

`{PAGE_JSON_LD}`:

```json
{"@context":"https://schema.org","@graph":[
    {"@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":"https://weboctals.com/"},
        {"@type":"ListItem","position":2,"name":"Clients","item":"https://weboctals.com/clients/index.html"},
        {"@type":"ListItem","position":3,"name":"Quick Fit Shelving Ltd","item":"https://weboctals.com/clients/quick-fit-shelving.html"}
    ]},
    {"@type":"Article","headline":"Quick Fit Shelving Ltd — Trade Services Website Case Study","description":"How WebOctals built an information-first trade website for Quick Fit Shelving Ltd, a Wednesbury shelving supplier, built for fast practical searches.","about":{"@type":"LocalBusiness","name":"Quick Fit Shelving Ltd","address":{"@type":"PostalAddress","addressLocality":"Wednesbury"}},"author":{"@type":"Organization","name":"WebOctals","url":"https://weboctals.com/"},"publisher":{"@type":"Organization","name":"WebOctals","url":"https://weboctals.com/"},"image":"https://weboctals.com/assets/images/quick_fit_move.jpeg"}
]}
```

`{PAGE_MAIN_CONTENT}`:

```html
    <!-- Client Case Study -->
    <section class="page-section">
        <div class="container">
            <a href="index.html" class="client-back-link">&larr; All clients</a>

            <div class="client-landing-hero">
                <div class="client-landing-photo">
                    <img src="../assets/images/quick_fit_move.jpeg" alt="Quick Fit Shelving Ltd website built by WebOctals" loading="eager" width="1402" height="1122">
                </div>
                <div>
                    <span class="project-card-type">Trade Services &mdash; Wednesbury</span>
                    <h1>Quick Fit Shelving Ltd</h1>
                    <div class="project-tags">
                        <span class="tag tag-accent">Trade Services</span>
                        <span class="tag tag-accent-2">Local Business</span>
                    </div>
                </div>
            </div>

            <div class="client-par-grid">
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Problem</span>
                    <p>Quick Fit Shelving Ltd supplies and fits shelving for commercial and retail spaces across the West Midlands, working with trade customers who search and decide quickly &mdash; they know roughly what they need and want to confirm a supplier can deliver it, fast. The company&rsquo;s previous web presence read more like a hobby site than a serious trade supplier: services weren&rsquo;t clearly listed, the coverage area wasn&rsquo;t obvious, and there was no quick, practical way to get in touch about a job. For trade customers comparing suppliers under time pressure, a site that didn&rsquo;t immediately look professional and capable was a reason to move on to a competitor, regardless of the actual quality of Quick Fit Shelving&rsquo;s work. The business needed a site that matched the seriousness of the trade it operates in, not a generic template that undersold it.</p>
                </div>
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Action</span>
                    <p>We built Quick Fit Shelving Ltd a clean, information-first site designed to read as a serious trade supplier from the first screen. Services, coverage area and contact details are placed front and centre, built specifically for the kind of quick, practical searches trade customers actually make &mdash; what do you supply and fit, do you cover my area, how do I get a quote. We stripped out anything that slowed the site down or got in the way of that core information, prioritising clarity and speed over decorative design, since trade customers are looking to confirm capability quickly, not browse. The site&rsquo;s structure and content are built around the West Midlands and Wednesbury area the business actually serves, so local search visibility matches its real coverage and customer base.</p>
                </div>
                <div class="card elev-sm client-par-card">
                    <span class="client-par-label">Results</span>
                    <p>Quick Fit Shelving Ltd now has a website that reads as a genuine, capable trade supplier rather than an afterthought, with services, coverage area and contact details all immediately visible. The site is built specifically for the fast, practical decision-making of trade customers, giving them the information they need to confirm capability and get in touch without delay. Its local structure around the West Midlands and Wednesbury gives the business real visibility for the searches its actual customers make, rather than competing generically. The result is a site that matches the seriousness of a commercial and retail shelving supplier, supporting the business&rsquo;s reputation rather than undercutting it.</p>
                </div>
            </div>

            <div class="client-landing-cta">
                <a href="../contact.html" class="btn btn-primary">
                    <span>Start your project</span>
                    <div class="btn-glow"></div>
                </a>
            </div>
        </div>
    </section>
```

Assemble and write to `clients/quick-fit-shelving.html`.

- [ ] **Step 2: Verify**

```bash
grep -c '<h1>Quick Fit Shelving Ltd</h1>' clients/quick-fit-shelving.html
grep -c 'client-par-label">Problem<' clients/quick-fit-shelving.html
grep -c 'client-par-label">Action<' clients/quick-fit-shelving.html
grep -c 'client-par-label">Results<' clients/quick-fit-shelving.html
python3 -c "
import re, json
text = open('clients/quick-fit-shelving.html').read()
m = re.search(r'<script type=\"application/ld\+json\">(.*?)</script>', text, re.S)
json.loads(m.group(1))
print('JSON-LD valid')
"
```

Expected: `1`, `1`, `1`, `1`, `JSON-LD valid`.

- [ ] **Step 3: Commit**

```bash
git add clients/quick-fit-shelving.html
git commit -m "Add Quick Fit Shelving Ltd client case study page"
```

---

### Task 12: Wire Clients pages into the build and sitemap

**Files:**
- Modify: `package.json`
- Modify: `sitemap.xml`

**Interfaces:**
- Consumes: the 8 files created in Tasks 4–11.
- Produces: nothing consumed by later tasks (this is the last content-wiring task before final verification).

- [ ] **Step 1: Update `package.json` build scripts**

In `package.json`, change:

```json
    "build": "parcel build index.html contact.html services.html about.html seo.html on-page-seo.html technical-seo.html product-development.html web-development.html ai-agents.html digital-products.html automation.html machine-learning.html projects/*.html --public-url ./",
    "build:all": "parcel build *.html blog/*.html projects/*.html --public-url ./",
```

to:

```json
    "build": "parcel build index.html contact.html services.html about.html seo.html on-page-seo.html technical-seo.html product-development.html web-development.html ai-agents.html digital-products.html automation.html machine-learning.html projects/*.html clients/*.html --public-url ./",
    "build:all": "parcel build *.html blog/*.html projects/*.html clients/*.html --public-url ./",
```

And add a new script immediately after `"build:projects"`:

```json
    "build:projects": "parcel build projects/*.html --public-url ../",
    "build:clients": "parcel build clients/*.html --public-url ../",
```

- [ ] **Step 2: Verify `package.json` is valid JSON**

```bash
python3 -c "import json; json.load(open('package.json')); print('valid JSON')"
```

Expected: `valid JSON`.

- [ ] **Step 3: Add Clients URLs to `sitemap.xml`**

In `sitemap.xml`, insert this block immediately before the `<!-- Resource Pages -->` comment (currently the line right after the "Additional Service Pages" section, before `<url><loc>https://weboctals.com/case-studies</loc>...`):

```xml
    <!-- Client Case Studies -->
    <url>
        <loc>https://weboctals.com/clients/index.html</loc>
        <lastmod>2026-08-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>

    <url>
        <loc>https://weboctals.com/clients/colindale-driving-school.html</loc>
        <lastmod>2026-08-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>

    <url>
        <loc>https://weboctals.com/clients/the-driving-spot.html</loc>
        <lastmod>2026-08-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>

    <url>
        <loc>https://weboctals.com/clients/fishermans-chips.html</loc>
        <lastmod>2026-08-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>

    <url>
        <loc>https://weboctals.com/clients/wazer-taxis.html</loc>
        <lastmod>2026-08-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>

    <url>
        <loc>https://weboctals.com/clients/hair-we-cut.html</loc>
        <lastmod>2026-08-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>

    <url>
        <loc>https://weboctals.com/clients/ar-worldwide.html</loc>
        <lastmod>2026-08-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>

    <url>
        <loc>https://weboctals.com/clients/quick-fit-shelving.html</loc>
        <lastmod>2026-08-02</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>

    <!-- Resource Pages -->
```

(Replace the existing bare `<!-- Resource Pages -->` line with everything above, which ends in that same comment line — i.e. the new block is inserted directly above it.)

- [ ] **Step 4: Verify `sitemap.xml` is well-formed XML**

```bash
python3 -c "import xml.etree.ElementTree as ET; ET.parse('sitemap.xml'); print('valid XML')"
grep -c "weboctals.com/clients/" sitemap.xml
```

Expected: `valid XML`, then `8`.

- [ ] **Step 5: Commit**

```bash
git add package.json sitemap.xml
git commit -m "Wire Clients pages into build scripts and sitemap"
```

---

### Task 13: Full-site verification

**Files:** none created/modified — this task only runs checks.

**Interfaces:**
- Consumes: everything from Tasks 1–12.
- Produces: a pass/fail confirmation that the whole feature works end-to-end.

- [ ] **Step 1: Sitewide nav/footer consistency check**

```bash
grep -rl 'Clients</a>' --include="*.html" . | grep -v node_modules | wc -l
```

Expected: `36` (28 existing pages from Task 1 + 8 new `clients/*.html` pages from Tasks 4-11, each containing at least one "Clients" link in nav and/or footer).

```bash
grep -rl 'class="nav-link active">Clients</a>' --include="*.html" clients/ | wc -l
```

Expected: `8` (Clients shows as the active nav item on all 8 pages inside `clients/`, and nowhere else).

- [ ] **Step 2: Every clients page has required SEO elements**

```bash
for f in clients/*.html; do
  title=$(grep -c '<title>' "$f")
  canonical=$(grep -c 'rel="canonical"' "$f")
  ogtitle=$(grep -c 'property="og:title"' "$f")
  jsonld=$(grep -c 'application/ld+json' "$f")
  echo "$f title=$title canonical=$canonical ogtitle=$ogtitle jsonld=$jsonld"
done
```

Expected: every line shows `title=1 canonical=1 ogtitle=1 jsonld=1`.

- [ ] **Step 3: All internal links resolve to real files**

```bash
python3 - <<'EOF'
import re, pathlib

for f in sorted(pathlib.Path('clients').glob('*.html')):
    text = f.read_text()
    for href in re.findall(r'href="([^"]+)"', text):
        if href.startswith(('http', 'mailto:', 'tel:', '#', '/')):
            continue
        target = (f.parent / href).resolve()
        if not target.exists():
            print(f"BROKEN LINK in {f}: {href}")
    for src in re.findall(r'src="([^"]+)"', text):
        if src.startswith('http'):
            continue
        target = (f.parent / src).resolve()
        if not target.exists():
            print(f"BROKEN SRC in {f}: {src}")
print("link check complete")
EOF
```

Expected: only `link check complete` printed, no `BROKEN` lines.

- [ ] **Step 4: JS syntax check**

```bash
node --check assets/js/main.js && echo "main.js syntax OK"
```

Expected: `main.js syntax OK`.

- [ ] **Step 5: Manual browser check**

```bash
npm run dev
```

With the Parcel dev server running, open these URLs and confirm by eye:

1. `http://localhost:1234/clients/index.html` — hero slider shows all 7 clients, auto-advances after ~6s, prev/next arrows and dot indicators work, hovering the slider pauses autoplay, and the 7-card grid below renders with photos and "Problem:" teasers.
2. Click through to at least 2 of the 7 landing pages (e.g. `clients/colindale-driving-school.html` and `clients/fishermans-chips.html`) — confirm the photo hero, three Problem/Action/Results cards, and "Start your project" CTA all render correctly, and the "Clients" nav item shows as active.
3. From any existing page (e.g. `http://localhost:1234/about.html`), confirm "Clients" now appears in the nav between "Projects" and "About", and clicking it lands on `clients/index.html`.
4. Resize the browser to a mobile width (~375px) on both `clients/index.html` and a landing page, and confirm the slider collapses to a single column and the PAR cards stack vertically.

Stop the dev server (Ctrl+C) once confirmed.

- [ ] **Step 6: Final commit (if Step 5 required any fixes)**

If Step 5 surfaced any visual issues, fix them in the relevant file(s), re-run the affected task's Step 2 verification, then:

```bash
git add -A
git commit -m "Fix visual issues found in Clients section browser check"
```

If no fixes were needed, this task is complete with no additional commit.
