/**
 * Contact & enquiry analytics
 *
 * Loaded on the home page and /contact/ — the two pages carrying an enquiry form.
 *
 * Every selector here is checked against the live markup. Submission itself is NOT
 * tracked in this file: contact-form-handler.js owns the submit event (it calls
 * preventDefault and posts via fetch), and analytics.js has a global submit
 * listener. A second submit handler here would double-count and risk fighting the
 * handler that actually sends the enquiry.
 */

document.addEventListener('DOMContentLoaded', function () {

    // Both enquiry forms: ct-* on /contact/, qc-* on the home page.
    const formFields = document.querySelectorAll(
        '#ct-name, #ct-email, #ct-phone, #ct-message, ' +
        '#qc-name, #qc-email, #qc-phone, #qc-message'
    );

    const formName = document.querySelector('.quick-contact-form')
        ? 'Home Quick Contact'
        : 'Contact Form';

    formFields.forEach(function (field) {
        field.addEventListener('focus', function () {
            WebOctalsAnalytics.trackFormFieldFocus(formName, field.id);
        });

        field.addEventListener('blur', function () {
            if (field.value) {
                gtag('event', 'form_field_complete', {
                    event_category: 'Form Engagement',
                    event_label: `${formName} - ${field.id}`,
                    field_name: field.id
                });
            }
        });
    });

    // FAQ accordions are <details class="wo-q"><summary>…</summary>, so the
    // toggle event carries open/closed state — no aria-expanded to read.
    document.querySelectorAll('details.wo-q').forEach(function (item) {
        item.addEventListener('toggle', function () {
            const question = item.querySelector('summary')?.textContent.trim() || 'Unknown Question';
            WebOctalsAnalytics.trackFAQInteraction(question, item.open ? 'open' : 'close');
        });
    });

    // Every email and phone link on the page, not just the first.
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
        link.addEventListener('click', function () {
            WebOctalsAnalytics.trackContactClick('Email', link.href);
        });
    });

    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
        link.addEventListener('click', function () {
            WebOctalsAnalytics.trackContactClick('Phone', link.href);
        });
    });

    document.querySelectorAll('.social-links a').forEach(function (link) {
        link.addEventListener('click', function () {
            const platform = link.getAttribute('aria-label') || 'Unknown Platform';
            WebOctalsAnalytics.trackSocialClick(platform, formName);
        });
    });

    // Form start / abandonment.
    let formStarted = false;
    let formCompleted = false;

    formFields.forEach(function (field) {
        field.addEventListener('input', function () {
            if (!formStarted) {
                formStarted = true;
                gtag('event', 'form_start', {
                    event_category: 'Form',
                    event_label: formName,
                    form_name: formName
                });
            }
        });
    });

    // Listen on the form for completion state only — no preventDefault, so the
    // real handler in contact-form-handler.js is untouched.
    document.querySelector('.contact-form-modern')?.addEventListener('submit', function () {
        formCompleted = true;
    });

    window.addEventListener('beforeunload', function () {
        if (formStarted && !formCompleted) {
            gtag('event', 'form_abandonment', {
                event_category: 'Form',
                event_label: formName,
                form_name: formName,
                transport_type: 'beacon'
            });
        }
    });
});
