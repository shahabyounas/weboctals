/**
 * WebOctals - Cookie consent banner
 * Gates analytics (Google Analytics / Google Tag Manager) behind an
 * explicit Accept/Reject choice, stored in localStorage. Other scripts
 * (analytics.js, gtm.js) check window.WebOctalsConsent.hasAccepted() or
 * listen for the 'wo:cookie-consent' event before initializing tracking.
 */
(function () {
    var STORAGE_KEY = 'wo_cookie_consent';

    function getConsent() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function setConsent(value) {
        try {
            localStorage.setItem(STORAGE_KEY, value);
        } catch (e) {
            // localStorage unavailable (private browsing, etc.) - consent
            // just won't persist across page loads.
        }
    }

    function fireConsentEvent(value) {
        document.dispatchEvent(new CustomEvent('wo:cookie-consent', { detail: { consent: value } }));
    }

    function hideBanner(banner) {
        banner.classList.remove('cookie-banner-visible');
        setTimeout(function () {
            banner.remove();
        }, 300);
    }

    function renderBanner() {
        if (document.getElementById('cookie-consent-banner')) return;

        var banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Cookie consent');
        banner.innerHTML =
            '<p class="cookie-banner-text">We use cookies for site analytics (Google Analytics &amp; Tag Manager). ' +
            'We won’t turn them on until you say it’s OK. See our <a href="/privacy.html">Privacy Policy</a>.</p>' +
            '<div class="cookie-banner-actions">' +
            '<button type="button" class="btn btn-outline cookie-banner-reject">Reject</button>' +
            '<button type="button" class="btn btn-primary cookie-banner-accept">Accept</button>' +
            '</div>';

        document.body.appendChild(banner);
        requestAnimationFrame(function () {
            banner.classList.add('cookie-banner-visible');
        });

        banner.querySelector('.cookie-banner-accept').addEventListener('click', function () {
            setConsent('accepted');
            fireConsentEvent('accepted');
            hideBanner(banner);
        });
        banner.querySelector('.cookie-banner-reject').addEventListener('click', function () {
            setConsent('rejected');
            fireConsentEvent('rejected');
            hideBanner(banner);
        });
    }

    window.WebOctalsConsent = {
        get: getConsent,
        hasAccepted: function () {
            return getConsent() === 'accepted';
        },
        // Clears the stored choice and re-shows the banner - hook this up
        // to a "manage cookie preferences" link if one is added later.
        reset: function () {
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (e) {}
            renderBanner();
        }
    };

    var existing = getConsent();
    if (existing === 'accepted' || existing === 'rejected') {
        fireConsentEvent(existing);
    } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderBanner);
    } else {
        renderBanner();
    }
})();
