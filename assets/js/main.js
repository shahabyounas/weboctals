// WebOctals - Simple Navigation with Horizontal View Transitions

// Initialize only essential features
document.addEventListener('DOMContentLoaded', function() {
    initializeSimpleNavigation();
    initializeBasicFeatures();
    // initializeGTMTracking(); // Disabled - using lazy-loaded Google Analytics instead
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

// Particle System Configuration - DISABLED for faster navigation
/* 
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#2563eb', '#7c3aed', '#ec4899']
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00f5ff',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}
*/

// Navigation System - DISABLED, using simple navigation instead
/*
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Handle navigation links (both file-based and anchor-based)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetHref = link.getAttribute('href');
            
            // Check if it's an anchor link (starts with #) for same-page navigation
            if (targetHref.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetHref);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // For file-based navigation (.html files), let the browser handle it naturally
            // No preventDefault() needed - just close mobile menu if open
            
            // Close mobile menu if open
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    });
}

// Animation System with Intersection Observer
function initializeAnimations() {
    // Initialize AOS (Animate On Scroll) if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Custom animations for AI elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animations for specific elements
                if (entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
                if (entry.target.classList.contains('ai-brain')) {
                    startBrainAnimation();
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .team-member, .blog-post, .hero-stats, .ai-brain');
    animatedElements.forEach(el => observer.observe(el));
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number with original suffix
            const originalText = counter.textContent;
            const suffix = originalText.replace(/[\d]/g, '');
            counter.textContent = Math.floor(current) + suffix;
        }, 20);
    });
}

// AI Brain Animation
function startBrainAnimation() {
    const brainCore = document.querySelector('.brain-core');
    const nodes = document.querySelectorAll('.node');
    const connections = document.querySelectorAll('.connection');

    // Enhanced pulsing effect
    setInterval(() => {
        brainCore.style.boxShadow = `0 0 ${Math.random() * 60 + 20}px var(--primary-color)`;
    }, 2000);

    // Random node activation
    setInterval(() => {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        randomNode.style.transform = 'scale(1.5)';
        randomNode.style.boxShadow = '0 0 25px var(--primary-color)';
        
        setTimeout(() => {
            randomNode.style.transform = 'scale(1)';
            randomNode.style.boxShadow = '0 0 15px var(--primary-color)';
        }, 500);
    }, 1500);
}


// Scroll Effects and Parallax
function initializeScrollEffects() {
    let ticking = false;

    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Update progress indicators if any
        const sections = document.querySelectorAll('section');
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrolled / totalHeight) * 100;
        
        // You can use this progress value for progress bars
        document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// Form Handling
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = '<span>Sending...</span>';
            submitButton.disabled = true;
            
            try {
                // Simulate form submission (replace with actual endpoint)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Success state
                submitButton.innerHTML = '<span>Message Sent! ✓</span>';
                submitButton.style.background = 'var(--success-color)';
                
                // Reset form
                contactForm.reset();
                
                // Show success message in chat if open
                const chatMessages = document.getElementById('chat-messages');
                if (document.getElementById('chat-window').classList.contains('active')) {
                    const successMessage = "Thanks for your message! We'll get back to you within 24 hours.";
                    addMessage(successMessage, 'bot');
                }
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                }, 3000);
                
            } catch (error) {
                // Error state
                submitButton.innerHTML = '<span>Error - Try Again</span>';
                submitButton.style.background = 'var(--error-color)';
                
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                }, 3000);
            }
        });
    }

    // Form validation
    const inputs = document.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
    });

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        if (!value) {
            showFieldError(field, 'This field is required');
        } else if (field.type === 'email' && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
        } else {
            clearFieldError(field);
        }
    }

    function clearValidation(e) {
        clearFieldError(e.target);
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.style.borderColor = 'var(--error-color)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--error-color)';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '5px';
        
        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        field.style.borderColor = '';
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Typing Effects
function initializeTypingEffects() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        const speed = parseInt(element.dataset.typingSpeed) || 50;
        element.textContent = '';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeText(element, text, speed);
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    });

    function typeText(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(timer);
                element.classList.add('typing-complete');
            }
        }, speed);
    }
}

// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Track largest contentful paint
        if ('web-vitals' in window) {
            // This would require the web-vitals library
            // getCLS(console.log);
            // getFID(console.log);
            // getLCP(console.log);
        }
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    
    // In production, you might want to send errors to a monitoring service
    // sendErrorToMonitoring(e.error);
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Initialize performance monitoring
initializePerformanceMonitoring();

// Add loading screen functionality
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <span class="logo-text">Web<span class="logo-accent">Octals</span></span>
                <div class="loading-animation">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
            </div>
            <p class="loading-text">Initializing AI Systems...</p>
        </div>
    `;
    
    // Add loading screen styles
    const loadingStyles = `
        #loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--gradient-background);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.5s ease-out;
        }
        
        .loading-content {
            text-align: center;
        }
        
        .loading-logo .logo-text {
            font-family: var(--font-mono);
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-primary);
        }
        
        .loading-logo .logo-accent {
            color: var(--primary-color);
        }
        
        .loading-animation {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin: 20px 0;
        }
        
        .loading-dot {
            width: 12px;
            height: 12px;
            background: var(--primary-color);
            border-radius: 50%;
            animation: loading-pulse 1.4s infinite ease-in-out both;
        }
        
        .loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes loading-pulse {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1.2); opacity: 1; }
        }
        
        .loading-text {
            color: var(--text-secondary);
            font-size: 1rem;
            margin-top: 20px;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = loadingStyles;
    document.head.appendChild(style);
    document.body.prepend(loadingScreen);
    
    // Hide loading screen after page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000);
    });
});
*/

// GTM Tracking Integration
function initializeGTMTracking() {
    // Wait for GTM to be available
    if (typeof window.WebOctalsGTM === 'undefined') {
        console.log('GTM not yet loaded, retrying...');
        setTimeout(initializeGTMTracking, 100);
        return;
    }

    const gtm = window.WebOctalsGTM;

    // Track form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const formType = form.classList.contains('newsletter-form') ? 'newsletter' : 'contact';
            gtm.trackFormSubmission(formType);
        });
    });

    // Track outbound links
    const outboundLinks = document.querySelectorAll('a[href^="http"]:not([href*="weboctals.com"])');
    outboundLinks.forEach(link => {
        link.addEventListener('click', () => {
            gtm.trackOutboundClick(link.href, link.textContent.trim());
        });
    });

    // Track scroll depth
    let scrollDepthTracked = [];
    const trackScrollDepth = throttle(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        [25, 50, 75, 90].forEach(threshold => {
            if (scrollPercent >= threshold && !scrollDepthTracked.includes(threshold)) {
                scrollDepthTracked.push(threshold);
                gtm.trackScrollDepth(threshold);
            }
        });
    }, 500);

    window.addEventListener('scroll', trackScrollDepth);

    // Track blog article views (if on blog page)
    if (window.location.pathname.includes('/blog/') && !window.location.pathname.endsWith('/blog/')) {
        const articleTitle = document.querySelector('h1')?.textContent || document.title;
        const category = document.querySelector('.category')?.textContent || 'Blog';
        const readTimeElement = document.querySelector('.read-time');
        const readTime = readTimeElement ? parseInt(readTimeElement.textContent) : 5;
        
        gtm.trackArticleView(articleTitle, category, readTime);
    }

    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.btn-primary, .cta-button, .read-more-btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            gtm.trackEvent('cta_click', {
                button_text: button.textContent.trim(),
                button_location: window.location.pathname
            });
        });
    });

    // Track service tab interactions (if on services page)
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.textContent.trim();
            gtm.trackEvent('service_tab_click', {
                tab_name: tabName,
                page: 'services'
            });
        });
    });

    console.log('GTM tracking initialized successfully');
}

// Utility function for throttling (if not already defined)
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// FAQ Accordion Functionality
function initializeFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) {
        return; // No FAQ items found on this page
    }
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherButton = otherItem.querySelector('.faq-question');
                    otherButton.setAttribute('aria-expanded', 'false');
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
                    const questionText = item.querySelector('h3').textContent;
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

// Export functions for potential module usage - DISABLED
/*
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeParticles,
        initializeNavigation,
        initializeAnimations,
        debounce,
        throttle
    };
}
*/