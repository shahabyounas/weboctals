// WebOctals - Simple Navigation with Horizontal View Transitions

// Initialize only essential features
document.addEventListener('DOMContentLoaded', function() {
    initializeSimpleNavigation();
    initializeBasicFeatures();
    initializeFAQAccordion();
    initializeClientSlider();
    initializeContactPopup();
});

// Contact Popup
function initializeContactPopup() {
    const widget = document.getElementById('contact-widget');
    const chatToggle = document.getElementById('chat-toggle');
    const chatPopup = document.getElementById('chat-popup');
    const chatClose = document.getElementById('chat-close');

    if (!widget || !chatToggle || !chatPopup || !chatClose) return;

    function openPopup() {
        chatPopup.classList.add('active');
        chatToggle.setAttribute('aria-expanded', 'true');
    }

    function closePopup() {
        chatPopup.classList.remove('active');
        chatToggle.setAttribute('aria-expanded', 'false');
    }

    chatToggle.addEventListener('click', () => {
        if (chatPopup.classList.contains('active')) {
            closePopup();
        } else {
            openPopup();
        }
    });

    chatClose.addEventListener('click', closePopup);

    document.addEventListener('click', (e) => {
        if (chatPopup.classList.contains('active') && !widget.contains(e.target)) {
            closePopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatPopup.classList.contains('active')) {
            closePopup();
        }
    });

    const emailBtn = chatPopup.querySelector('a[href^="mailto:"]');
    if (emailBtn) {
        const contactLink = document.querySelector('a[href$="contact.html"]:not([href^="mailto:"])');
        const contactUrl = (contactLink ? contactLink.getAttribute('href') : 'contact.html') + '#contact-form';

        emailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const mailtoUrl = emailBtn.href;
            let mailClientOpened = false;

            const onBlur = () => { mailClientOpened = true; };
            window.addEventListener('blur', onBlur, { once: true });

            window.location.href = mailtoUrl;

            setTimeout(() => {
                window.removeEventListener('blur', onBlur);
                if (!mailClientOpened && !document.hidden) {
                    window.location.href = contactUrl;
                }
            }, 500);
        });
    }
}

// Simple horizontal view transitions
function initializeSimpleNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .footer-links a, .btn[href], .nav-logo a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Handle internal .html navigation with horizontal transition
            if (href && (href.endsWith('.html') || href.includes('blog/')) && !href.startsWith('http')) {
                
                // Compare full paths, not just filenames
                const currentPath = window.location.pathname;
                const targetPath = href.startsWith('/') ? href : '/' + href;
                
                // Normalize paths for comparison
                const normalizedCurrent = currentPath.replace(/\/$/, '') || '/index.html';
                const normalizedTarget = targetPath.replace(/\/$/, '');
                
                // Skip transition if already on target page
                if (normalizedCurrent === normalizedTarget || 
                    normalizedCurrent.endsWith(normalizedTarget) ||
                    normalizedTarget.endsWith(normalizedCurrent.split('/').pop())) {
                    // Only prevent if it's truly the same page (check full path)
                    const currentFull = currentPath.replace(/^\//, '');
                    const targetFull = href;
                    if (currentFull === targetFull) {
                        e.preventDefault();
                        return;
                    }
                }
                
                e.preventDefault();
                
                // Use View Transition API if supported
                if ('startViewTransition' in document) {
                    document.startViewTransition(() => {
                        window.location.href = href;
                    });
                } else {
                    // Simple fallback without transition
                    window.location.href = href;
                }
            }
        });
    });
}

// Only essential features - no heavy animations
function initializeBasicFeatures() {
    // Mobile menu toggle only
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Mobile dropdown menu toggle
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        if (link && window.innerWidth <= 768) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                item.classList.toggle('mobile-active');
            });
        }
    });

    // Reinitialize dropdown on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            dropdownItems.forEach(item => {
                item.classList.remove('mobile-active');
            });
        }
    });
    
    // Initialize services tabs with delay to ensure DOM is ready
    setTimeout(() => {
        initializeServicesTabs();
    }, 100);
}

// Services Tabs Functionality
function initializeServicesTabs() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeServicesTabs);
        return;
    }
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    console.log('Initializing tabs...');
    console.log('Tab buttons found:', tabButtons.length);
    console.log('Tab panels found:', tabPanels.length);
    
    if (tabButtons.length === 0) {
        console.log('No tab buttons found, exiting...');
        return;
    }
    
    // Add click event to each tab button
    tabButtons.forEach((button, index) => {
        console.log('Adding listener to button', index, button.getAttribute('data-tab'));
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetTab = this.getAttribute('data-tab');
            console.log('Tab clicked:', targetTab);
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            console.log('Button activated:', targetTab);
            
            // Add active class to corresponding panel
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
                console.log('Panel activated:', targetTab, targetPanel);
                console.log('Panel classes:', targetPanel.className);
                console.log('Panel computed style display:', window.getComputedStyle(targetPanel).display);
            } else {
                console.log('Panel not found:', targetTab);
                console.log('Available panels:', Array.from(tabPanels).map(p => p.id));
            }
        });
    });
    
    console.log('Tab initialization complete');
}





// FAQ Accordion Functionality
function initializeFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) {
        return; // No FAQ items found on this page
    }
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        // Some pages (blog posts) reuse .faq-item for static Q&A with no
        // button to wire up. Skip those rather than throwing on null.
        if (!question) {
            return;
        }

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherButton = otherItem.querySelector('.faq-question');
                    if (otherButton) {
                        otherButton.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                
                // Track FAQ interaction with GTM if available
                if (typeof window.WebOctalsGTM !== 'undefined') {
                    const heading = item.querySelector('h3');
                    const questionText = heading ? heading.textContent : '';
                    window.WebOctalsGTM.trackEvent('faq_interaction', {
                        question: questionText,
                        page: window.location.pathname
                    });
                }
            }
        });
        
        // Add keyboard support for accessibility
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
    
    console.log('FAQ accordion initialized with', faqItems.length, 'items');
}

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

// Add background brand logos to client cards
function initializeClientBrandLogos() {
    const brandMap = {
        'Auto Trader': 'AUTO TRADER',
        'Stream': 'STREAM',
        'Order Fresh': 'ORDER FRESH',
        'Vapor Heaven': 'VAPOR HEAVEN',
        'Vape Masters': 'VAPE MASTERS'
    };
    
    const clientCards = document.querySelectorAll('.client-card-inner');
    clientCards.forEach(card => {
        const logoElement = card.querySelector('.client-logo-large');
        if (logoElement) {
            const brandName = logoElement.textContent.trim();
            if (brandMap[brandName]) {
                card.setAttribute('data-brand', brandMap[brandName]);
            }
        }
    });
}

// Initialize client brand logos on page load
document.addEventListener('DOMContentLoaded', initializeClientBrandLogos);

// Inject Specialist CTA Button and Popup into all pages

// Specialist Consultation Popup Functionality
function initializeSpecialistPopup() {
    const specialistBtn = document.getElementById('specialist-cta-btn');
    const popupOverlay = document.getElementById('specialist-popup-overlay');
    const popupClose = document.getElementById('popup-close');
    const specialistForm = document.getElementById('specialist-form');
    const specialistPopup = document.querySelector('.specialist-popup');

    if (!specialistBtn || !popupOverlay) return;

    // Store scroll position
    let scrollPosition = 0;

    // Open popup
    specialistBtn.addEventListener('click', () => {
        // Store current scroll position
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add active class to show popup
        popupOverlay.classList.add('active');
        
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = '100%';
    });

    // Close popup
    const closePopup = () => {
        popupOverlay.classList.remove('active');
        
        // Restore background scrolling
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollPosition);
    };

    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }

    // Prevent scroll propagation from popup to overlay
    if (specialistPopup) {
        specialistPopup.addEventListener('wheel', (e) => {
            e.stopPropagation();
        });
    }

    // Close on overlay click (outside popup)
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
            closePopup();
        }
    });

    // Handle form submission
    if (specialistForm) {
        specialistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('specialist-name').value,
                email: document.getElementById('specialist-email').value,
                phone: document.getElementById('specialist-phone').value,
                message: document.getElementById('specialist-message').value
            };

            console.log('Specialist consultation request:', formData);
            
            // Show success message
            alert('Thank you! Our specialist consultant will contact you shortly.');
            
            // Reset form and close popup
            specialistForm.reset();
            closePopup();
            
            // Here you would typically send the data to your backend
            // Example: fetch('/api/specialist-request', { method: 'POST', body: JSON.stringify(formData) })
        });
    }
}

// Initialize specialist popup on page load
document.addEventListener('DOMContentLoaded', initializeSpecialistPopup);

// Stats bar count-up on scroll into view
function initializeStatsCountUp() {
    const statBlocks = document.querySelectorAll('[data-count-to]');
    if (!statBlocks.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-count-to'), 10);
        const suffix = el.getAttribute('data-suffix') || '';

        if (prefersReducedMotion) {
            el.textContent = target + suffix;
            return;
        }

        const duration = 1500;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }
        requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statBlocks.forEach((el) => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initializeStatsCountUp);
