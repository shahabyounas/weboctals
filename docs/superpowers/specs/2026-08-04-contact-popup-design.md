# Contact Popup (replaces AI Chat Widget) — Design

## Context

The site has a right-side fixed "AI Chat Widget" (toggle button + fake chatbot window with canned
scripted replies) duplicated across 22 static HTML files (there is no include/templating system —
Parcel builds raw HTML files directly). Investigation confirmed the chatbot's JS
(`initializeChatbot` in `assets/js/main.js`) is dead code — it is defined but never invoked from the
page's `DOMContentLoaded` handler, so the toggle currently does nothing on the live site.

## Goal

Replace the AI chatbot popup with a simple contact popup. Clicking the toggle opens a small popup
with two buttons:
- **Email us** — opens the visitor's default email client via a `mailto:` link.
- **WhatsApp** — opens WhatsApp (web or mobile) via a `wa.me` link, in a new tab.

Contact details reused from elsewhere on the site: `info@weboctals.com`, `+44 7442 410345`.

## Scope

Applies to all 22 HTML files currently containing `<!-- AI Chat Widget -->` / `#ai-chat-widget`:
`index.html`, `home.html`, `about.html`, `contact.html`, `services-old.html`, all files under
`clients/`, and all files under `projects/`.

## HTML

Replace the entire `<!-- AI Chat Widget --> ... </div>` block (outer `#ai-chat-widget` wrapper) in
each of the 22 files with:

```html
<!-- Contact Popup -->
<div id="contact-widget" class="chat-widget">
    <button class="chat-toggle" id="chat-toggle" aria-label="Contact us" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    </button>
    <div class="chat-popup" id="chat-popup">
        <div class="chat-popup-header">
            <h4>Get in touch</h4>
            <button class="chat-close" id="chat-close" aria-label="Close">×</button>
        </div>
        <p class="chat-popup-subtitle">Choose how you'd like to reach us</p>
        <div class="chat-popup-actions">
            <a class="chat-popup-btn" href="mailto:info@weboctals.com?subject=Website%20Enquiry">
                <span class="chat-popup-btn-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                </span>
                <span>Email us</span>
            </a>
            <a class="chat-popup-btn chat-popup-btn-whatsapp"
               href="https://wa.me/447442410345?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20WebOctals"
               target="_blank" rel="noopener">
                <span class="chat-popup-btn-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </span>
                <span>WhatsApp</span>
            </a>
        </div>
    </div>
</div>
```

Notes:
- `mailto:` opens in the same tab (standard browser handling routes it to the OS mail client).
- `wa.me` link opens in a new tab (`target="_blank" rel="noopener"`) so the visitor doesn't lose the
  site; WhatsApp Web/mobile app decides which surface to use.
- No literal WhatsApp brand logo SVG is used (avoids reproducing brand path data from memory, which
  risks a garbled icon) — brand recognition instead comes from the WhatsApp green button color
  (`#25D366`) plus the "WhatsApp" label.

## CSS (`assets/css/styles.css`, existing block ~3169–3341)

- Keep `.chat-widget` (fixed position, z-index) and `.chat-toggle` (60px circle, gradient
  background, hover scale) — only the icon markup inside changes from emoji+pulse-dot to the inline
  SVG above.
- Remove `.ai-pulse` (was an "AI is active" affordance tied to the chatbot fiction; no longer
  applicable). The shared `pulse` keyframe stays — it's used elsewhere in the stylesheet.
- Rename `.chat-window` → `.chat-popup`: same fixed offset (`bottom: 80px; right: 0`) and
  glass/blur card look, but `height: auto` (compact) instead of a fixed 500px; width ~320px.
- Rename `.chat-header` → `.chat-popup-header` (keep the gradient header bar); add
  `.chat-popup-subtitle` (muted small text, matches existing text-secondary conventions).
- Remove `.chat-messages`, `.message`, `.bot-message`, `.user-message`, `.message-content`,
  `.chat-input`, `.chat-input input`, `.chat-input button` (chat-transcript UI, no longer needed).
- Add `.chat-popup-actions` (flex column, gap) and `.chat-popup-btn` (icon + label pill, full
  width, subtle border, hover lift consistent with the site's existing `.btn` hover pattern).
  `.chat-popup-btn-whatsapp` uses WhatsApp green (`#25D366`) background.
- Update the `max-width: 900px` responsive rule (currently targets `.chat-window`, ~line 3578) to
  target `.chat-popup` instead.
- The `@media print { .chat-widget { display: none } }` rule (~line 3637) needs no change — it
  already targets the class, not the removed IDs.

## JS (`assets/js/main.js`)

- Delete `initializeChatbot` in full (current lines 416–635): the toggle/close wiring, the fake
  typing indicator, and the entire canned-response generator (`generateAIResponse`) — all dead
  code, never invoked.
- Add a small `initializeContactPopup()`:
  - Toggle `.chat-popup`'s `active` class (and `aria-expanded`) on `#chat-toggle` click.
  - Close on `#chat-close` click.
  - Close on click outside `#contact-widget`.
  - Close on `Escape` keydown.
- Call `initializeContactPopup()` from the existing top-of-file `DOMContentLoaded` listener,
  alongside `initializeSimpleNavigation()`, `initializeBasicFeatures()`, etc.
- `initializeFormHandling` (also currently dead/unrelated code, separately never invoked) is left
  untouched — out of scope for this change.

## Rollout

1. Edit `assets/css/styles.css` and `assets/js/main.js` directly (single source each).
2. Write a one-off Node script that, for each of the 22 files, replaces the
   `<!-- AI Chat Widget --> ... </div>` block with the new markup (identical email/WhatsApp links
   in every file). Run it once, then discard the script (not committed as a reusable tool).
3. Verify via `npm run dev`: load `index.html` and `contact.html`, confirm the popup opens/closes
   (click toggle, click close, click outside, Escape), and that the Email/WhatsApp links carry the
   correct `mailto:`/`wa.me` targets and open correctly.

## Out of scope

- No build-time HTML include/templating system (would remove the 22-file duplication going
  forward, but is a separate, larger change not requested here).
- No changes to `initializeFormHandling` or `contact-form-handler.js`.
- No re-enabling of the commented-out "Live Chat" card on `contact.html` — it stays commented out.
