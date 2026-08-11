const CONFIG={GOOGLE_SCRIPT_URL:"https://script.google.com/macros/s/AKfycbynlX-iN65qG57Ti1UrCVCZ1LIRye5YJRGfzdDl8_Ar6guAp5v3lFSgE7_-QZ7Dvv6P9g/exec",GEOLOCATION_API:"https://ipapi.co/json/",API_TIMEOUT:5e3};function detectDevice(){let e=navigator.userAgent,t=/iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(e),o=/(iPad|Android(?!.*Mobile)|Tablet)/i.test(e),n="Desktop";return o?n="Tablet":t&&(n="Mobile"),n}function detectBrowser(){let e=navigator.userAgent,t="Unknown";return e.includes("Firefox/")?t="Firefox "+e.match(/Firefox\/(\d+)/)[1]:e.includes("Edg/")?t="Edge "+e.match(/Edg\/(\d+)/)[1]:e.includes("Chrome/")&&!e.includes("Edg/")?t="Chrome "+e.match(/Chrome\/(\d+)/)[1]:e.includes("Safari/")&&!e.includes("Chrome")?t="Safari "+e.match(/Version\/(\d+)/)[1]:(e.includes("MSIE")||e.includes("Trident/"))&&(t="Internet Explorer"),t}function detectOS(){let e=navigator.userAgent,t="Unknown";if(e.includes("Windows NT 10.0"))t="Windows 10";else if(e.includes("Windows NT 6.3"))t="Windows 8.1";else if(e.includes("Windows NT 6.2"))t="Windows 8";else if(e.includes("Windows NT 6.1"))t="Windows 7";else if(e.includes("Mac OS X")){let o=e.match(/Mac OS X (\d+[._]\d+)/);t=o?"macOS "+o[1].replace("_","."):"macOS"}else if(e.includes("Android")){let o=e.match(/Android (\d+(\.\d+)?)/);t=o?"Android "+o[1]:"Android"}else if(e.includes("iOS")||e.includes("iPhone OS")){let o=e.match(/OS (\d+)_(\d+)/);t=o?"iOS "+o[1]+"."+o[2]:"iOS"}else e.includes("Linux")&&(t="Linux");return t}function getScreenSize(){return`${window.screen.width}x${window.screen.height}`}async function getLocationData(){try{let e=new AbortController,t=setTimeout(()=>e.abort(),CONFIG.API_TIMEOUT),o=await fetch(CONFIG.GEOLOCATION_API,{signal:e.signal});if(clearTimeout(t),!o.ok)throw Error("Geolocation API failed");let n=await o.json();return{ipAddress:n.ip||"Unknown",country:n.country_name||"Unknown",city:n.city||"Unknown"}}catch(e){return console.warn("Failed to fetch location data:",e),{ipAddress:"Unknown",country:"Unknown",city:"Unknown"}}}function collectFormData(e){let t=new FormData(e),o=e.classList.contains("newsletter-form");return{name:t.get("name")||"",email:t.get("email")||"",company:t.get("company")||"",phone:t.get("phone")||"",service:t.get("service")||"",budget:t.get("budget")||"",message:t.get("message")||(o?"Newsletter signup":""),newsletter:!!o||"on"===t.get("newsletter"),deviceType:detectDevice(),browser:detectBrowser(),os:detectOS(),screenSize:getScreenSize(),referrer:document.referrer||"Direct",userAgent:navigator.userAgent}}async function submitToGoogleSheets(e,t){let o={...e,...t};try{let e=new FormData;e.append("data",JSON.stringify(o));let t=await fetch(CONFIG.GOOGLE_SCRIPT_URL,{method:"POST",body:e});if(t.ok||t.redirected)return{success:!0};throw Error("Failed to submit form")}catch(e){throw console.error("Error submitting to Google Sheets:",e),e}}function showLoadingState(e){e.disabled=!0,e.innerHTML=`
    <span>Sending...</span>
    <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  `,e.classList.add("loading")}function showSuccessState(e){e.innerHTML=`
    <span>\u{2713} Message Sent!</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `,e.classList.remove("loading"),e.classList.add("success")}function showErrorState(e,t){e.innerHTML=`
    <span>\u{2717} Failed - Try Again</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  `,e.classList.remove("loading"),e.classList.add("error"),setTimeout(()=>{e.innerHTML=t,e.classList.remove("error"),e.disabled=!1},3e3)}function showNotification(e,t="success"){let o=document.querySelector(".form-notification");o&&o.remove();let n=document.createElement("div");n.className=`form-notification ${t}`,n.innerHTML=`
    <div class="notification-content">
      ${"success"===t?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'}
      <span>${e}</span>
    </div>
  `,document.body.appendChild(n),setTimeout(()=>n.classList.add("show"),100),setTimeout(()=>{n.classList.remove("show"),setTimeout(()=>n.remove(),300)},5e3)}async function handleFormSubmit(e){e.preventDefault();let t=e.target,o=t.classList.contains("newsletter-form"),n=t.querySelector('button[type="submit"]'),i=n.innerHTML,r=null;if(e.agentInvoked&&"function"==typeof e.respondWith&&e.respondWith(new Promise(e=>{r=e})),"YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"===CONFIG.GOOGLE_SCRIPT_URL){showNotification("Form is not yet configured. Please set up Google Sheets integration.","error"),console.error("Google Apps Script URL not configured!"),r&&r({success:!1,error:"Form is not yet configured."});return}try{showLoadingState(n);let e=collectFormData(t);"function"==typeof trackFormSubmissionStart&&trackFormSubmissionStart(e);let s=await getLocationData();await submitToGoogleSheets(e,s),showSuccessState(n);let a=o?`Subscribed ${e.email} to the WebOctals newsletter.`:"Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.";showNotification(a,"success"),r&&r({success:!0,message:a}),"function"==typeof trackFormSubmissionSuccess&&trackFormSubmissionSuccess(e),setTimeout(()=>{t.reset(),n.innerHTML=i,n.classList.remove("success"),n.disabled=!1},2e3)}catch(e){console.error("Form submission error:",e),showErrorState(n,i),showNotification("Oops! Something went wrong. Please try again or email us directly at contact@weboctals.co.uk","error"),r&&r({success:!1,error:e.message}),"function"==typeof trackFormSubmissionError&&trackFormSubmissionError(e.message)}}function initContactForm(){let e=document.querySelectorAll(".contact-form-modern, .newsletter-form");e.length?(e.forEach(e=>e.addEventListener("submit",handleFormSubmit)),console.log(`\u{2705} Form handler initialized for ${e.length} form(s)`),addFormStyles()):console.warn("No contact or newsletter form found on this page")}function addFormStyles(){if(document.getElementById("contact-form-styles"))return;let e=document.createElement("style");e.id="contact-form-styles",e.textContent=`
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
  `,document.head.appendChild(e)}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",initContactForm):initContactForm(),window.ContactFormHandler={init:initContactForm,detectDevice,detectBrowser,detectOS,getLocationData};
//# sourceMappingURL=weboctals.837b4809.js.map
