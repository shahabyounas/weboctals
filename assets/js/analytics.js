/**
 * WebOctals - Comprehensive Google Analytics 4 Tracking
 * Track all user interactions, form submissions, navigation, and engagement
 */

// Initialize Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-SM3W8072KB', {
    'send_page_view': true,
    'cookie_flags': 'SameSite=None;Secure'
});

// Analytics Helper Functions
const WebOctalsAnalytics = {
    // Track page views
    trackPageView: function(pagePath, pageTitle) {
        gtag('event', 'page_view', {
            page_path: pagePath || window.location.pathname,
            page_title: pageTitle || document.title,
            page_location: window.location.href
        });
        console.log('📊 Page View Tracked:', pageTitle || document.title);
    },

    // Track form submissions
    trackFormSubmission: function(formName, formData = {}) {
        gtag('event', 'form_submit', {
            event_category: 'Form',
            event_label: formName,
            form_name: formName,
            form_destination: formData.destination || 'Unknown',
            service_selected: formData.service || 'Not specified',
            budget_range: formData.budget || 'Not specified',
            value: 1
        });
        console.log('📝 Form Submission Tracked:', formName);
    },

    // Track form field interactions
    trackFormFieldFocus: function(formName, fieldName) {
        gtag('event', 'form_field_focus', {
            event_category: 'Form Engagement',
            event_label: `${formName} - ${fieldName}`,
            form_name: formName,
            field_name: fieldName
        });
    },

    // Track button clicks
    trackButtonClick: function(buttonName, buttonLocation, destination = '') {
        gtag('event', 'button_click', {
            event_category: 'Engagement',
            event_label: buttonName,
            button_name: buttonName,
            button_location: buttonLocation,
            button_destination: destination
        });
        console.log('🔘 Button Click Tracked:', buttonName);
    },

    // Track CTA clicks
    trackCTAClick: function(ctaName, ctaType, ctaLocation) {
        gtag('event', 'cta_click', {
            event_category: 'CTA',
            event_label: ctaName,
            cta_name: ctaName,
            cta_type: ctaType,
            cta_location: ctaLocation
        });
        console.log('🎯 CTA Click Tracked:', ctaName);
    },

    // Track navigation
    trackNavigation: function(linkText, destination, navigationType = 'main_nav') {
        gtag('event', 'navigation_click', {
            event_category: 'Navigation',
            event_label: linkText,
            link_text: linkText,
            link_destination: destination,
            navigation_type: navigationType
        });
        console.log('🧭 Navigation Tracked:', linkText);
    },

    // Track service selection
    trackServiceView: function(serviceName, serviceType) {
        gtag('event', 'view_item', {
            event_category: 'Service',
            event_label: serviceName,
            items: [{
                item_id: serviceName.toLowerCase().replace(/\s+/g, '-'),
                item_name: serviceName,
                item_category: serviceType
            }]
        });
        console.log('🔍 Service View Tracked:', serviceName);
    },

    // Track service card clicks
    trackServiceCardClick: function(serviceName, cardLocation) {
        gtag('event', 'select_item', {
            event_category: 'Service Selection',
            event_label: serviceName,
            items: [{
                item_id: serviceName.toLowerCase().replace(/\s+/g, '-'),
                item_name: serviceName,
                item_location: cardLocation
            }]
        });
        console.log('💳 Service Card Click Tracked:', serviceName);
    },

    // Track pricing card interactions
    trackPricingInteraction: function(planName, action, price = '') {
        gtag('event', 'pricing_interaction', {
            event_category: 'Pricing',
            event_label: `${planName} - ${action}`,
            plan_name: planName,
            action: action,
            price: price
        });
        console.log('💰 Pricing Interaction Tracked:', planName, action);
    },

    // Track email/phone clicks
    trackContactClick: function(contactType, contactValue) {
        gtag('event', 'contact_click', {
            event_category: 'Contact',
            event_label: contactType,
            contact_type: contactType,
            contact_method: contactValue
        });
        console.log('📞 Contact Click Tracked:', contactType);
    },

    // Track social media clicks
    trackSocialClick: function(platform, location) {
        gtag('event', 'social_click', {
            event_category: 'Social Media',
            event_label: platform,
            social_platform: platform,
            click_location: location
        });
        console.log('📱 Social Click Tracked:', platform);
    },

    // Track downloads
    trackDownload: function(fileName, fileType) {
        gtag('event', 'file_download', {
            event_category: 'Download',
            event_label: fileName,
            file_name: fileName,
            file_type: fileType
        });
        console.log('⬇️ Download Tracked:', fileName);
    },

    // Track video plays
    trackVideoPlay: function(videoName, videoLocation) {
        gtag('event', 'video_start', {
            event_category: 'Video',
            event_label: videoName,
            video_name: videoName,
            video_location: videoLocation
        });
        console.log('▶️ Video Play Tracked:', videoName);
    },

    // Track chat interactions
    trackChatInteraction: function(action, message = '') {
        gtag('event', 'chat_interaction', {
            event_category: 'Chat',
            event_label: action,
            chat_action: action,
            message_preview: message.substring(0, 50)
        });
        console.log('💬 Chat Interaction Tracked:', action);
    },

    // Track FAQ interactions
    trackFAQInteraction: function(question, action = 'open') {
        gtag('event', 'faq_interaction', {
            event_category: 'FAQ',
            event_label: question,
            question: question,
            action: action
        });
        console.log('❓ FAQ Interaction Tracked:', question);
    },

    // Track scroll depth
    trackScrollDepth: function(percentage) {
        gtag('event', 'scroll_depth', {
            event_category: 'Engagement',
            event_label: `${percentage}% Scrolled`,
            scroll_percentage: percentage,
            page: window.location.pathname
        });
        console.log('📜 Scroll Depth Tracked:', percentage + '%');
    },

    // Track time on page
    trackTimeOnPage: function(seconds) {
        gtag('event', 'time_on_page', {
            event_category: 'Engagement',
            event_label: window.location.pathname,
            time_seconds: seconds,
            time_minutes: Math.round(seconds / 60)
        });
        console.log('⏱️ Time on Page Tracked:', seconds + 's');
    },

    // Track errors
    trackError: function(errorType, errorMessage, errorLocation) {
        gtag('event', 'exception', {
            description: errorMessage,
            fatal: false,
            error_type: errorType,
            error_location: errorLocation
        });
        console.log('❌ Error Tracked:', errorType);
    },

    // Track search
    trackSearch: function(searchTerm, searchLocation) {
        gtag('event', 'search', {
            search_term: searchTerm,
            search_location: searchLocation
        });
        console.log('🔎 Search Tracked:', searchTerm);
    },

    // Track outbound links
    trackOutboundLink: function(url, linkText) {
        gtag('event', 'click', {
            event_category: 'Outbound Link',
            event_label: url,
            link_url: url,
            link_text: linkText,
            transport_type: 'beacon'
        });
        console.log('🔗 Outbound Link Tracked:', url);
    },

    // Track user engagement
    trackEngagement: function(engagementType, engagementValue) {
        gtag('event', 'user_engagement', {
            event_category: 'Engagement',
            event_label: engagementType,
            engagement_type: engagementType,
            engagement_value: engagementValue
        });
        console.log('👤 User Engagement Tracked:', engagementType);
    },

    // Track newsletter signup
    trackNewsletterSignup: function(location) {
        gtag('event', 'generate_lead', {
            event_category: 'Lead Generation',
            event_label: 'Newsletter Signup',
            lead_type: 'Newsletter',
            signup_location: location,
            value: 5
        });
        console.log('📧 Newsletter Signup Tracked:', location);
    },

    // Track consultation request
    trackConsultationRequest: function(serviceType, budget) {
        gtag('event', 'generate_lead', {
            event_category: 'Lead Generation',
            event_label: 'Consultation Request',
            lead_type: 'Consultation',
            service_type: serviceType,
            budget_range: budget,
            value: 10
        });
        console.log('🎯 Consultation Request Tracked:', serviceType);
    }
};

// Auto-track page views on load
document.addEventListener('DOMContentLoaded', function() {
    WebOctalsAnalytics.trackPageView();
});

// Track all form submissions
document.addEventListener('submit', function(e) {
    const form = e.target;
    const formName = form.id || form.className || 'Unnamed Form';
    
    const formData = {
        destination: form.action || 'Unknown',
        service: form.querySelector('[name="service"]')?.value || 'Not specified',
        budget: form.querySelector('[name="budget"]')?.value || 'Not specified'
    };
    
    WebOctalsAnalytics.trackFormSubmission(formName, formData);
});

// Track all button clicks
document.addEventListener('click', function(e) {
    const button = e.target.closest('button, .btn, [role="button"]');
    if (button) {
        const buttonText = button.textContent.trim() || button.getAttribute('aria-label') || 'Unknown Button';
        const buttonLocation = button.closest('section')?.className || 'Unknown Location';
        const destination = button.getAttribute('href') || button.getAttribute('data-target') || '';
        
        WebOctalsAnalytics.trackButtonClick(buttonText, buttonLocation, destination);
    }
});

// Track all link clicks
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href) {
        const linkText = link.textContent.trim() || link.getAttribute('aria-label') || 'Unknown Link';
        const isExternal = link.hostname !== window.location.hostname;
        
        if (isExternal) {
            WebOctalsAnalytics.trackOutboundLink(link.href, linkText);
        } else {
            const navigationType = link.closest('nav') ? 'main_nav' : 
                                 link.closest('footer') ? 'footer' : 
                                 link.closest('.dropdown-menu') ? 'dropdown' : 'content';
            WebOctalsAnalytics.trackNavigation(linkText, link.href, navigationType);
        }
    }
});

// Track scroll depth
let scrollDepthTracked = {
    25: false,
    50: false,
    75: false,
    100: false
};

window.addEventListener('scroll', function() {
    const scrollPercentage = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
    
    for (let depth in scrollDepthTracked) {
        if (scrollPercentage >= depth && !scrollDepthTracked[depth]) {
            scrollDepthTracked[depth] = true;
            WebOctalsAnalytics.trackScrollDepth(depth);
        }
    }
});

// Track time on page
let timeOnPage = 0;
const timeInterval = setInterval(function() {
    timeOnPage += 30;
    if (timeOnPage % 60 === 0) { // Track every minute
        WebOctalsAnalytics.trackTimeOnPage(timeOnPage);
    }
}, 30000); // Every 30 seconds

// Track when user leaves
window.addEventListener('beforeunload', function() {
    WebOctalsAnalytics.trackTimeOnPage(timeOnPage);
    clearInterval(timeInterval);
});

// Track errors
window.addEventListener('error', function(e) {
    WebOctalsAnalytics.trackError(
        'JavaScript Error',
        e.message,
        e.filename + ':' + e.lineno
    );
});

// Export for global use
window.WebOctalsAnalytics = WebOctalsAnalytics;

console.log('✅ WebOctals Analytics Initialized - Tracking active on all pages');
