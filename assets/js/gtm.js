/**
 * Google Tag Manager Integration for WebOctals
 * This module handles GTM initialization and noscript fallback
 */

class GoogleTagManager {
    constructor(gtmId) {
        this.gtmId = gtmId;
        this.isInitialized = false;
    }

    /**
     * Initialize Google Tag Manager
     */
    init() {
        if (this.isInitialized || !this.gtmId) {
            return;
        }

        try {
            // Initialize dataLayer
            window.dataLayer = window.dataLayer || [];
            
            // GTM initialization
            window.dataLayer.push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });

            // Create and inject GTM script
            const firstScript = document.getElementsByTagName('script')[0];
            const gtmScript = document.createElement('script');
            
            gtmScript.async = true;
            gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${this.gtmId}`;
            
            firstScript.parentNode.insertBefore(gtmScript, firstScript);

            // Add noscript fallback
            this.addNoscriptFallback();

            this.isInitialized = true;
            console.log('Google Tag Manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Google Tag Manager:', error);
        }
    }

    /**
     * Add noscript fallback for GTM
     */
    addNoscriptFallback() {
        // Check if noscript already exists
        if (document.querySelector('noscript[data-gtm="true"]')) {
            return;
        }

        const noscript = document.createElement('noscript');
        noscript.setAttribute('data-gtm', 'true');
        
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${this.gtmId}`;
        iframe.height = '0';
        iframe.width = '0';
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        
        noscript.appendChild(iframe);
        
        // Insert right after body tag
        document.body.insertBefore(noscript, document.body.firstChild);
    }

    /**
     * Push custom events to dataLayer
     * @param {Object} eventData - Event data to push
     */
    pushEvent(eventData) {
        if (!this.isInitialized) {
            console.warn('GTM not initialized. Event not pushed:', eventData);
            return;
        }

        try {
            window.dataLayer.push(eventData);
            console.log('GTM event pushed:', eventData);
        } catch (error) {
            console.error('Failed to push GTM event:', error);
        }
    }

    /**
     * Track page views
     * @param {string} pagePath - Page path
     * @param {string} pageTitle - Page title
     */
    trackPageView(pagePath, pageTitle) {
        this.pushEvent({
            event: 'page_view',
            page_path: pagePath,
            page_title: pageTitle,
            page_location: window.location.href
        });
    }

    /**
     * Track custom events
     * @param {string} eventName - Event name
     * @param {Object} parameters - Event parameters
     */
    trackEvent(eventName, parameters = {}) {
        this.pushEvent({
            event: eventName,
            ...parameters
        });
    }

    /**
     * Track contact form submissions
     * @param {string} formType - Type of form (contact, newsletter, etc.)
     */
    trackFormSubmission(formType) {
        this.pushEvent({
            event: 'form_submit',
            form_type: formType,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Track scroll depth
     * @param {number} percentage - Scroll percentage
     */
    trackScrollDepth(percentage) {
        this.pushEvent({
            event: 'scroll_depth',
            scroll_percentage: percentage
        });
    }

    /**
     * Track outbound link clicks
     * @param {string} url - Destination URL
     * @param {string} linkText - Link text
     */
    trackOutboundClick(url, linkText) {
        this.pushEvent({
            event: 'outbound_click',
            link_url: url,
            link_text: linkText
        });
    }

    /**
     * Track blog article engagement
     * @param {string} articleTitle - Article title
     * @param {string} category - Article category
     * @param {number} readTime - Estimated read time
     */
    trackArticleView(articleTitle, category, readTime) {
        this.pushEvent({
            event: 'article_view',
            article_title: articleTitle,
            article_category: category,
            estimated_read_time: readTime
        });
    }
}

// Initialize GTM with WebOctals ID
const gtm = new GoogleTagManager('GTM-N8MKVN7N');

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        gtm.init();
    });
} else {
    gtm.init();
}

// Export for global use
window.WebOctalsGTM = gtm;

// Track initial page view
if (document.readyState === 'complete') {
    gtm.trackPageView(window.location.pathname, document.title);
} else {
    window.addEventListener('load', () => {
        gtm.trackPageView(window.location.pathname, document.title);
    });
}