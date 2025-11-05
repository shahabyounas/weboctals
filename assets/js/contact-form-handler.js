/**
 * Contact Form to Google Sheets Handler
 * Captures form data with location and device information
 */

// ===========================================
// Configuration
// ===========================================

const CONFIG = {
  // IMPORTANT: Replace with your Google Apps Script Web App URL
  GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbynlX-iN65qG57Ti1UrCVCZ1LIRye5YJRGfzdDl8_Ar6guAp5v3lFSgE7_-QZ7Dvv6P9g/exec',
  
  // IP Geolocation API (free tier - 1000 requests/day)
  GEOLOCATION_API: 'https://ipapi.co/json/',
  
  // Timeout for API calls (ms)
  API_TIMEOUT: 5000
};

// ===========================================
// Device & Browser Detection
// ===========================================

function detectDevice() {
  const ua = navigator.userAgent;
  
  // Device Type
  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /(iPad|Android(?!.*Mobile)|Tablet)/i.test(ua);
  
  let deviceType = 'Desktop';
  if (isTablet) deviceType = 'Tablet';
  else if (isMobile) deviceType = 'Mobile';
  
  return deviceType;
}

function detectBrowser() {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  
  if (ua.includes('Firefox/')) {
    browser = 'Firefox ' + ua.match(/Firefox\/(\d+)/)[1];
  } else if (ua.includes('Edg/')) {
    browser = 'Edge ' + ua.match(/Edg\/(\d+)/)[1];
  } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    browser = 'Chrome ' + ua.match(/Chrome\/(\d+)/)[1];
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    browser = 'Safari ' + ua.match(/Version\/(\d+)/)[1];
  } else if (ua.includes('MSIE') || ua.includes('Trident/')) {
    browser = 'Internet Explorer';
  }
  
  return browser;
}

function detectOS() {
  const ua = navigator.userAgent;
  let os = 'Unknown';
  
  if (ua.includes('Windows NT 10.0')) os = 'Windows 10';
  else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
  else if (ua.includes('Windows NT 6.2')) os = 'Windows 8';
  else if (ua.includes('Windows NT 6.1')) os = 'Windows 7';
  else if (ua.includes('Mac OS X')) {
    const match = ua.match(/Mac OS X (\d+[._]\d+)/);
    os = match ? 'macOS ' + match[1].replace('_', '.') : 'macOS';
  }
  else if (ua.includes('Android')) {
    const match = ua.match(/Android (\d+(\.\d+)?)/);
    os = match ? 'Android ' + match[1] : 'Android';
  }
  else if (ua.includes('iOS') || ua.includes('iPhone OS')) {
    const match = ua.match(/OS (\d+)_(\d+)/);
    os = match ? 'iOS ' + match[1] + '.' + match[2] : 'iOS';
  }
  else if (ua.includes('Linux')) os = 'Linux';
  
  return os;
}

function getScreenSize() {
  return `${window.screen.width}x${window.screen.height}`;
}

// ===========================================
// Location Detection
// ===========================================

async function getLocationData() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);
    
    const response = await fetch(CONFIG.GEOLOCATION_API, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error('Geolocation API failed');
    }
    
    const data = await response.json();
    
    return {
      ipAddress: data.ip || 'Unknown',
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown'
    };
  } catch (error) {
    console.warn('Failed to fetch location data:', error);
    return {
      ipAddress: 'Unknown',
      country: 'Unknown',
      city: 'Unknown'
    };
  }
}

// ===========================================
// Form Data Collection
// ===========================================

function collectFormData(formElement) {
  const formData = new FormData(formElement);
  
  return {
    // Form fields
    name: formData.get('name') || '',
    email: formData.get('email') || '',
    company: formData.get('company') || '',
    phone: formData.get('phone') || '',
    service: formData.get('service') || '',
    budget: formData.get('budget') || '',
    message: formData.get('message') || '',
    newsletter: formData.get('newsletter') === 'on',
    
    // Device information
    deviceType: detectDevice(),
    browser: detectBrowser(),
    os: detectOS(),
    screenSize: getScreenSize(),
    
    // Page information
    referrer: document.referrer || 'Direct',
    userAgent: navigator.userAgent
  };
}

// ===========================================
// Submit to Google Sheets
// ===========================================

async function submitToGoogleSheets(formData, locationData) {
  // Merge form data with location data
  const completeData = {
    ...formData,
    ...locationData
  };
  
  try {
    // Use FormData to avoid CORS preflight
    const formDataToSend = new FormData();
    formDataToSend.append('data', JSON.stringify(completeData));
    
    const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formDataToSend
    });
    
    // Google Apps Script will redirect, so we check if fetch succeeded
    if (response.ok || response.redirected) {
      return { success: true };
    } else {
      throw new Error('Failed to submit form');
    }
    
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    throw error;
  }
}

// ===========================================
// UI Feedback
// ===========================================

function showLoadingState(button) {
  button.disabled = true;
  button.innerHTML = `
    <span>Sending...</span>
    <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  `;
  button.classList.add('loading');
}

function showSuccessState(button) {
  button.innerHTML = `
    <span>✓ Message Sent!</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;
  button.classList.remove('loading');
  button.classList.add('success');
}

function showErrorState(button, originalContent) {
  button.innerHTML = `
    <span>✗ Failed - Try Again</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  `;
  button.classList.remove('loading');
  button.classList.add('error');
  
  // Reset after 3 seconds
  setTimeout(() => {
    button.innerHTML = originalContent;
    button.classList.remove('error');
    button.disabled = false;
  }, 3000);
}

function showNotification(message, type = 'success') {
  // Remove existing notifications
  const existing = document.querySelector('.form-notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = `form-notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      ${type === 'success' 
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
      }
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// ===========================================
// Main Form Handler
// ===========================================

async function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonContent = submitButton.innerHTML;
  
  // Validate Google Script URL is configured
  if (CONFIG.GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    showNotification('Form is not yet configured. Please set up Google Sheets integration.', 'error');
    console.error('Google Apps Script URL not configured!');
    return;
  }
  
  try {
    // Show loading state
    showLoadingState(submitButton);
    
    // Collect form data
    const formData = collectFormData(form);
    
    // Track form submission start
    if (typeof trackFormSubmissionStart === 'function') {
      trackFormSubmissionStart(formData);
    }
    
    // Get location data (async)
    const locationData = await getLocationData();
    
    // Submit to Google Sheets
    await submitToGoogleSheets(formData, locationData);
    
    // Show success state
    showSuccessState(submitButton);
    showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
    
    // Track successful submission
    if (typeof trackFormSubmissionSuccess === 'function') {
      trackFormSubmissionSuccess(formData);
    }
    
    // Reset form after 2 seconds
    setTimeout(() => {
      form.reset();
      submitButton.innerHTML = originalButtonContent;
      submitButton.classList.remove('success');
      submitButton.disabled = false;
    }, 2000);
    
  } catch (error) {
    console.error('Form submission error:', error);
    
    // Show error state
    showErrorState(submitButton, originalButtonContent);
    showNotification('Oops! Something went wrong. Please try again or email us directly at contact@weboctals.uk.co', 'error');
    
    // Track failed submission
    if (typeof trackFormSubmissionError === 'function') {
      trackFormSubmissionError(error.message);
    }
  }
}

// ===========================================
// Initialize Form Handler
// ===========================================

function initContactForm() {
  const contactForm = document.querySelector('.contact-form-modern');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
    console.log('✅ Contact form handler initialized');
    
    // Add custom CSS for notifications and animations
    addFormStyles();
  } else {
    console.warn('Contact form not found on this page');
  }
}

// ===========================================
// Custom Styles
// ===========================================

function addFormStyles() {
  if (document.getElementById('contact-form-styles')) return;
  
  const styles = document.createElement('style');
  styles.id = 'contact-form-styles';
  styles.textContent = `
    .btn-primary.loading {
      pointer-events: none;
      opacity: 0.8;
    }
    
    .btn-primary .spinner {
      animation: spin 1s linear infinite;
      width: 20px;
      height: 20px;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .btn-primary.success {
      background: linear-gradient(135deg, #00ff87 0%, #00d9ff 100%);
    }
    
    .btn-primary.error {
      background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
    }
    
    .form-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(20, 20, 40, 0.95);
      border: 1px solid #00f5ff;
      border-radius: 12px;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 10000;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 245, 255, 0.3);
      transform: translateX(400px);
      transition: transform 0.3s ease;
    }
    
    .form-notification.show {
      transform: translateX(0);
    }
    
    .form-notification.error {
      border-color: #ff4757;
      box-shadow: 0 8px 32px rgba(255, 71, 87, 0.3);
    }
    
    .form-notification svg {
      width: 24px;
      height: 24px;
      stroke: #00f5ff;
      flex-shrink: 0;
    }
    
    .form-notification.error svg {
      stroke: #ff4757;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .notification-content span {
      color: #fff;
      font-size: 14px;
      line-height: 1.5;
    }
    
    @media (max-width: 768px) {
      .form-notification {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: calc(100% - 20px);
      }
    }
  `;
  
  document.head.appendChild(styles);
}

// ===========================================
// Auto-initialize on DOM ready
// ===========================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}

// Export for external use
window.ContactFormHandler = {
  init: initContactForm,
  detectDevice,
  detectBrowser,
  detectOS,
  getLocationData
};
