# WhatsApp Button: Universal Link Design

## Problem

The WhatsApp button in the site's chat popup (`chat-popup-btn-whatsapp`) links to:

```
https://web.whatsapp.com/send?phone=447442410345&text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20WebOctals
```

This URL targets WhatsApp Web specifically. On mobile browsers it tries to load the WhatsApp Web interface instead of opening the native WhatsApp app, which is a poor experience since WhatsApp Web isn't usable/intended for phones.

## Goal

Clicking the WhatsApp button should:
- On mobile (web browser or in-app browser): open the WhatsApp app directly.
- On desktop: open WhatsApp Web (`web.whatsapp.com`), as today.

## Approach

Replace the `href` on every WhatsApp button with the universal `wa.me` link:

```
https://wa.me/447442410345?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20WebOctals
```

`wa.me` is WhatsApp's own universal link service — it natively detects platform and routes to the app on mobile or `web.whatsapp.com` on desktop, without any user-agent sniffing or JavaScript. Same phone number, same pre-filled message text (URL-encoded identically to today).

No markup, styling, or JS changes are needed — this is a single attribute swap.

## Scope

23 HTML files currently contain the `web.whatsapp.com/send?phone=447442410345...` href, all with an identical pattern (button markup duplicated per page, no shared include):

- `home.html`, `index.html`, `contact.html`, `about.html`, `services-old.html`
- `clients/*.html` (7 files)
- `projects/*.html` (9 files, excluding `index.html` already counted... see file list below)

Full list to update (grep-verified):
```
home.html, index.html, contact.html, about.html, services-old.html,
clients/ar-worldwide.html, clients/colindale-driving-school.html, clients/fishermans-chips.html,
clients/index.html, clients/hair-we-cut.html, clients/wazer-taxis.html, clients/quick-fit-shelving.html,
projects/ar-worldwide.html, clients/the-driving-spot.html, projects/colindale-driving-school.html,
projects/ariana-kitchens-bedrooms.html, projects/index.html, projects/fishermans-chips.html,
projects/hair-we-cut.html, projects/lumenlux.html, projects/wazer-taxis.html,
projects/quick-fit-shelving.html, projects/the-driving-spot.html
```

Out of scope: `blog/we-live-in-an-ai-first-world.html` contains the string "whatsapp" only in article body text, not a button — no change there.

## Verification

- `grep -rn "web.whatsapp.com" *.html clients/*.html projects/*.html` returns zero matches.
- `grep -rln "wa.me/447442410345" *.html clients/*.html projects/*.html` returns exactly 23 files.
- Spot-check `about.html` in a browser: popup opens, WhatsApp button click navigates to `wa.me` link correctly.
