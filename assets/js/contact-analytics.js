/**
 * Contact Page - Enhanced Analytics Tracking
 * Tracks all contact form interactions, field engagements, and user behavior
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Track form field focus/blur events
    const formFields = document.querySelectorAll('#name, #email, #company, #phone, #service, #budget, #message');
    formFields.forEach(function(field) {
        field.addEventListener('focus', function() {
            WebOctalsAnalytics.trackFormFieldFocus('Contact Form', field.id || field.name);
        });
        
        field.addEventListener('blur', function() {
            if (field.value) {
                gtag('event', 'form_field_complete', {
                    event_category: 'Form Engagement',
                    event_label: `Contact Form - ${field.id}`,
                    field_name: field.id
                });
            }
        });
    });

    // Track service selection dropdown
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            WebOctalsAnalytics.trackServiceView(this.value, 'Contact Form Selection');
            gtag('event', 'service_selected', {
                event_category: 'Form',
                event_label: this.value,
                service_type: this.value
            });
        });
    }

    // Track budget selection
    const budgetSelect = document.getElementById('budget');
    if (budgetSelect) {
        budgetSelect.addEventListener('change', function() {
            gtag('event', 'budget_selected', {
                event_category: 'Form',
                event_label: this.value,
                budget_range: this.value
            });
        });
    }

    // Track newsletter checkbox
    const newsletterCheckbox = document.getElementById('newsletter');
    if (newsletterCheckbox) {
        newsletterCheckbox.addEventListener('change', function() {
            if (this.checked) {
                WebOctalsAnalytics.trackNewsletterSignup('Contact Form');
            }
        });
    }

    // Track form submission with detailed data
    const contactForm = document.querySelector('.contact-form-modern');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                service: serviceSelect?.value || 'Not specified',
                budget: budgetSelect?.value || 'Not specified',
                newsletter: newsletterCheckbox?.checked || false,
                hasCompany: !!document.getElementById('company')?.value,
                hasPhone: !!document.getElementById('phone')?.value
            };
            
            // Track consultation request
            WebOctalsAnalytics.trackConsultationRequest(formData.service, formData.budget);
            
            // Track detailed form submission
            gtag('event', 'contact_form_submit', {
                event_category: 'Lead Generation',
                event_label: 'Contact Form',
                service_selected: formData.service,
                budget_range: formData.budget,
                newsletter_opted_in: formData.newsletter,
                has_company_info: formData.hasCompany,
                has_phone: formData.hasPhone,
                value: 15 // High value event
            });
            
            console.log('📬 Contact Form Submission Tracked with full details');
            
            // You can submit the form here
            // contactForm.submit();
        });
    }

    // Track quick contact card clicks
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        emailLink.addEventListener('click', function() {
            WebOctalsAnalytics.trackContactClick('Email', this.href);
        });
    }

    const phoneLink = document.querySelector('a[href^="tel:"]');
    if (phoneLink) {
        phoneLink.addEventListener('click', function() {
            WebOctalsAnalytics.trackContactClick('Phone', this.href);
        });
    }

    // Track chat trigger button
    const chatTrigger = document.querySelector('.chat-trigger-btn');
    if (chatTrigger) {
        chatTrigger.addEventListener('click', function() {
            WebOctalsAnalytics.trackChatInteraction('Open Chat', 'Contact Page');
        });
    }

    // Track FAQ accordion clicks
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            const questionText = this.querySelector('h3')?.textContent || 'Unknown Question';
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const action = isExpanded ? 'close' : 'open';
            
            WebOctalsAnalytics.trackFAQInteraction(questionText, action);
        });
    });

    // Track social media clicks
    const socialLinks = document.querySelectorAll('.social-btn, .social-links a');
    socialLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            const platform = this.classList.contains('linkedin') ? 'LinkedIn' :
                           this.classList.contains('github') ? 'GitHub' :
                           this.getAttribute('aria-label') || 'Unknown Platform';
            
            WebOctalsAnalytics.trackSocialClick(platform, 'Contact Page Sidebar');
        });
    });

    // Track hero stats engagement
    const heroStats = document.querySelectorAll('.hero-stat');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const statLabel = entry.target.querySelector('.stat-label')?.textContent || 'Unknown Stat';
                gtag('event', 'stat_view', {
                    event_category: 'Engagement',
                    event_label: statLabel,
                    stat_type: statLabel
                });
            }
        });
    }, { threshold: 0.5 });

    heroStats.forEach(function(stat) {
        observer.observe(stat);
    });

    // Track form abandonment
    let formStarted = false;
    let formCompleted = false;

    formFields.forEach(function(field) {
        field.addEventListener('input', function() {
            if (!formStarted) {
                formStarted = true;
                gtag('event', 'form_start', {
                    event_category: 'Form',
                    event_label: 'Contact Form',
                    form_name: 'Contact Form'
                });
            }
        });
    });

    window.addEventListener('beforeunload', function() {
        if (formStarted && !formCompleted) {
            gtag('event', 'form_abandonment', {
                event_category: 'Form',
                event_label: 'Contact Form',
                form_name: 'Contact Form',
                transport_type: 'beacon'
            });
        }
    });

    contactForm?.addEventListener('submit', function() {
        formCompleted = true;
    });

    console.log('✅ Contact Page Analytics - Enhanced tracking active');
});
