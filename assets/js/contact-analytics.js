/**
 * Contact & enquiry analytics
 *
 * Loaded on the home page and /contact/ — the two pages carrying an enquiry form.
 *
 * Everything here goes through GTM (assets/js/gtm.js), which only pushes to the
 * dataLayer once cookie consent has been accepted. There is no direct gtag.js on
 * the site; the GA4 tag lives in the GTM container.
 *
 * Submission is tracked via the trackFormSubmission* hooks at the bottom of this
 * file. contact-form-handler.js owns the submit event (it calls preventDefault and
 * posts via fetch) and calls those hooks itself, so we get a real success/error
 * split instead of firing on every attempt. Do NOT add a submit listener here —
 * it would double-count and risk fighting the handler that sends the enquiry.
 */

(function () {
    'use strict';

    // GTM drops events until consent is accepted, which is the behaviour we want.
    // Guarded because gtm.js may not have parsed yet when an early click lands.
    function woTrack(eventName, params) {
        if (typeof window.WebOctalsGTM === 'undefined') {
            return;
        }
        window.WebOctalsGTM.trackEvent(eventName, params || {});
    }

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
                woTrack('form_field_focus', {
                    form_name: formName,
                    field_name: field.id
                });
            });

            field.addEventListener('blur', function () {
                if (field.value) {
                    woTrack('form_field_complete', {
                        form_name: formName,
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
                woTrack('faq_interaction', {
                    question: question,
                    action: item.open ? 'open' : 'close',
                    page: window.location.pathname
                });
            });
        });

        // Every email and phone link on the page, not just the first.
        document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
            link.addEventListener('click', function () {
                woTrack('contact_click', { contact_method: 'Email', link_url: link.href });
            });
        });

        // The phone number links straight into WhatsApp rather than dialling,
        // so track it as WhatsApp. tel: is kept in case one is added back.
        document.querySelectorAll('a[href^="tel:"], a[href*="wa.me/"]').forEach(function (link) {
            link.addEventListener('click', function () {
                woTrack('contact_click', {
                    contact_method: link.href.indexOf('tel:') === 0 ? 'Phone' : 'WhatsApp',
                    link_url: link.href
                });
            });
        });

        document.querySelectorAll('.social-links a').forEach(function (link) {
            link.addEventListener('click', function () {
                woTrack('social_click', {
                    platform: link.getAttribute('aria-label') || 'Unknown Platform',
                    form_name: formName
                });
            });
        });

        // Form start / abandonment.
        let formStarted = false;
        let formCompleted = false;

        formFields.forEach(function (field) {
            field.addEventListener('input', function () {
                if (!formStarted) {
                    formStarted = true;
                    woTrack('form_start', { form_name: formName });
                }
            });
        });

        window.addEventListener('beforeunload', function () {
            if (formStarted && !formCompleted) {
                woTrack('form_abandonment', { form_name: formName });
            }
        });

        // contact-form-handler.js calls these by bare name behind a
        // `typeof … === 'function'` guard, so they have to be true globals.
        // They were never defined anywhere before this, which is why form
        // submissions went untracked.
        // collectFormData() returns the enquiry itself (name, email, phone,
        // message). None of that goes to analytics — only the non-identifying
        // shape of the submission.
        function submissionMeta(formData) {
            return {
                form_name: formName,
                form_type: formData && formData.newsletter ? 'newsletter' : 'enquiry',
                service: (formData && formData.service) || 'Not specified'
            };
        }

        window.trackFormSubmissionStart = function (formData) {
            woTrack('form_submit_start', submissionMeta(formData));
        };

        window.trackFormSubmissionSuccess = function (formData) {
            formCompleted = true;
            woTrack('form_submit_success', submissionMeta(formData));
        };

        window.trackFormSubmissionError = function (message) {
            woTrack('form_submit_error', {
                form_name: formName,
                error_message: message || 'Unknown error'
            });
        };
    });
})();
