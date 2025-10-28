// WebOctals - Simple Navigation with Horizontal View Transitions

// Initialize only essential features
document.addEventListener('DOMContentLoaded', function() {
    initializeSimpleNavigation();
    initializeBasicFeatures();
    initializeGTMTracking();
});

// Simple horizontal view transitions
function initializeSimpleNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .footer-links a, .btn[href], .nav-logo a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Handle internal .html navigation with horizontal transition
            if (href && (href.endsWith('.html') || href.includes('blog/')) && !href.startsWith('http')) {
                
                // Simple check: compare current page filename with target href
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                const targetPage = href.split('/').pop();
                
                // Skip transition if already on target page
                if (currentPage === targetPage) {
                    e.preventDefault(); // Prevent the click but don't navigate
                    return;
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

// Advanced Chatbot System
function initializeChatbot() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    let isTyping = false;

    // Toggle chat window
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Send message functionality
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message && !isTyping) {
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Simulate AI processing
            showTypingIndicator();
            setTimeout(() => {
                const response = generateAIResponse(message);
                hideTypingIndicator();
                addMessage(response, 'bot');
            }, 1500 + Math.random() * 1000);
        }
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
        
        requestAnimationFrame(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });
    }

    // Typing indicator
    function showTypingIndicator() {
        if (document.querySelector('.typing-indicator')) return;
        
        isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add CSS for typing dots animation
        const style = document.createElement('style');
        style.textContent = `
            .typing-dots {
                display: flex;
                gap: 4px;
                align-items: center;
            }
            .typing-dots span {
                width: 6px;
                height: 6px;
                background: var(--primary-color);
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out;
            }
            .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
            @keyframes typing {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
        `;
        if (!document.querySelector('#typing-animation-style')) {
            style.id = 'typing-animation-style';
            document.head.appendChild(style);
        }
    }

    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        isTyping = false;
    }

    // AI Response Generation
    function generateAIResponse(message) {
        const responses = {
            greeting: [
                "Hello! I'm WebOctals' AI assistant. How can I help you explore our AI solutions today?",
                "Hi there! Welcome to WebOctals. I'm here to assist you with questions about our AI services.",
                "Greetings! I'm your AI guide to WebOctals' innovative solutions. What would you like to know?"
            ],
            services: [
                "WebOctals offers cutting-edge AI agent development, digital product creation, intelligent automation, and machine learning solutions. Which service interests you most?",
                "We specialize in four main areas: AI Agent Development, Digital Product Development, Intelligent Automation, and Machine Learning Solutions. Each service is designed to transform your business through AI.",
                "Our services include developing custom AI agents, creating intelligent digital products, implementing smart automation, and deploying ML solutions. Would you like details about any specific service?"
            ],
            aiAgents: [
                "Our AI agents are intelligent systems that can automate complex tasks, make decisions, and integrate with your existing workflows. They feature natural language processing, autonomous decision-making, and continuous learning capabilities.",
                "AI agents from WebOctals are custom-built to handle your specific business needs. They can process natural language, make intelligent decisions, integrate across platforms, and continuously improve their performance.",
                "We develop AI agents that act as intelligent assistants for your business, capable of understanding context, making decisions, and performing complex tasks autonomously."
            ],
            digitalProducts: [
                "We create intelligent digital products that leverage AI for enhanced user experiences. This includes AI-enhanced UX/UI, predictive analytics, smart recommendations, and adaptive interfaces.",
                "Our digital products incorporate AI to provide personalized experiences, predictive insights, and intelligent automation that adapts to user behavior and preferences.",
                "We build digital products that think and learn, featuring AI-driven interfaces, predictive capabilities, and intelligent automation to deliver exceptional user experiences."
            ],
            automation: [
                "Our intelligent automation solutions streamline operations through AI-driven process optimization, workflow automation, intelligent monitoring, and performance analytics.",
                "We implement automation that not only executes tasks but learns and improves over time, optimizing your workflows and reducing manual intervention.",
                "Our automation solutions use AI to optimize processes, monitor performance, and continuously improve operational efficiency."
            ],
            machinelearning: [
                "Our ML solutions include predictive modeling, data analysis, pattern recognition, and real-time insights to help you make data-driven decisions.",
                "We deploy machine learning models that extract valuable insights from your data, enabling predictive analytics and intelligent decision-making.",
                "Our machine learning services transform your data into actionable insights through advanced modeling, analysis, and real-time processing."
            ],
            team: [
                "Our team consists of AI specialists, data scientists, developers, and product managers who are passionate about creating innovative AI solutions.",
                "WebOctals is powered by experts in artificial intelligence, machine learning, and product development who work together to deliver cutting-edge solutions.",
                "We have a diverse team of AI researchers, developers, and strategists dedicated to pushing the boundaries of what's possible with artificial intelligence."
            ],
            contact: [
                "You can reach us at hello@weboctals.com or use our contact form. We'd love to discuss your AI project and explore how we can help transform your business.",
                "Ready to get started? Contact us at hello@weboctals.com or schedule a free consultation. We're excited to discuss your AI needs!",
                "Let's connect! Reach out to hello@weboctals.com or fill out our contact form to begin your AI transformation journey with WebOctals."
            ],
            pricing: [
                "Our pricing varies based on project scope and requirements. Contact us for a personalized quote tailored to your specific AI needs and goals.",
                "We offer flexible pricing models based on your project requirements. Get in touch for a detailed discussion about your needs and a custom proposal.",
                "Pricing depends on the complexity and scale of your AI project. We'd be happy to provide a detailed quote after understanding your specific requirements."
            ],
            technology: [
                "We use cutting-edge AI technologies including natural language processing, machine learning frameworks, computer vision, and advanced neural networks.",
                "Our technology stack includes the latest in AI and ML, featuring frameworks like TensorFlow, PyTorch, and cloud-based AI services for scalable solutions.",
                "We leverage state-of-the-art AI technologies and frameworks to build robust, scalable, and intelligent solutions tailored to your business needs."
            ],
            default: [
                "That's an interesting question! I'd be happy to connect you with our team for a detailed discussion. You can reach us at hello@weboctals.com.",
                "I'd love to help you with that! For specific technical questions, our experts at hello@weboctals.com can provide detailed insights.",
                "Great question! Our team of AI specialists can provide you with comprehensive information. Feel free to contact us at hello@weboctals.com."
            ]
        };

        const messageLower = message.toLowerCase();
        
        // Determine response category
        let category = 'default';
        
        if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
            category = 'greeting';
        } else if (messageLower.includes('service') || messageLower.includes('what do you do')) {
            category = 'services';
        } else if (messageLower.includes('ai agent') || messageLower.includes('agent')) {
            category = 'aiAgents';
        } else if (messageLower.includes('digital product') || messageLower.includes('product')) {
            category = 'digitalProducts';
        } else if (messageLower.includes('automation') || messageLower.includes('automate')) {
            category = 'automation';
        } else if (messageLower.includes('machine learning') || messageLower.includes('ml') || messageLower.includes('model')) {
            category = 'machinelearning';
        } else if (messageLower.includes('team') || messageLower.includes('who are you')) {
            category = 'team';
        } else if (messageLower.includes('contact') || messageLower.includes('reach') || messageLower.includes('email')) {
            category = 'contact';
        } else if (messageLower.includes('price') || messageLower.includes('cost') || messageLower.includes('pricing')) {
            category = 'pricing';
        } else if (messageLower.includes('technology') || messageLower.includes('tech') || messageLower.includes('framework')) {
            category = 'technology';
        }
        
        const categoryResponses = responses[category];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }
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

// Export functions for potential module usage - DISABLED
/*
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeParticles,
        initializeNavigation,
        initializeAnimations,
        initializeChatbot,
        debounce,
        throttle
    };
}
*/