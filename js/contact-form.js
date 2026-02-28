/* ========================================
   CONTACT-FORM.JS - Form Validation & Submission
   Author: Joel George Kaudzu Portfolio
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initNewsletterForm();
    initFormAnalytics();
    initReCaptcha();
    initFormAutosave();
});

/* ===== MAIN CONTACT FORM ===== */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const fullContactForm = document.getElementById('fullContactForm');

    if (contactForm) {
        setupForm(contactForm);
    }

    if (fullContactForm) {
        setupForm(fullContactForm);
    }
}

function setupForm(form) {
    // Add validation on blur
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Real-time validation for certain fields
            if (this.type === 'email' || this.id === 'phone') {
                validateField(this);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (validateForm(this)) {
            await submitForm(this);
        }
    });

    // Load saved draft if exists
    loadFormDraft(form);
}

/* ===== FIELD VALIDATION ===== */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';

    // Required field check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation (if present)
    if (field.id === 'phone' && value) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Minimum length check
    if (field.hasAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'))) {
        isValid = false;
        errorMessage = `Must be at least ${field.getAttribute('minlength')} characters`;
    }

    // Update UI
    updateFieldStatus(field, isValid, errorMessage);

    return isValid;
}

function updateFieldStatus(field, isValid, errorMessage) {
    const wrapper = field.closest('.form-group') || field.parentNode;
    const existingError = wrapper.querySelector('.field-error');

    // Remove existing error
    if (existingError) {
        existingError.remove();
    }

    // Update field styling
    field.style.borderColor = isValid ? 'var(--cyan-highlight)' : '#ef4444';

    // Add error message if invalid
    if (!isValid && errorMessage) {
        const error = document.createElement('span');
        error.className = 'field-error';
        error.textContent = errorMessage;
        error.style.cssText = `
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 0.3rem;
            display: block;
        `;
        wrapper.appendChild(error);
    }
}

function validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;

    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

/* ===== FORM SUBMISSION ===== */
async function submitForm(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Add metadata
    data.timestamp = new Date().toISOString();
    data.url = window.location.href;
    data.userAgent = navigator.userAgent;

    try {
        // Simulate API call - Replace with actual endpoint
        const response = await fakeApiCall(data);

        if (response.success) {
            showFormFeedback(form, 'success', 'Message sent successfully! I\'ll respond within 24-48 hours.');
            form.reset();
            clearFormDraft(form);

            // Track conversion
            trackFormConversion('contact');
        } else {
            throw new Error('Submission failed');
        }

    } catch (error) {
        console.error('Form submission error:', error);
        showFormFeedback(form, 'error', 'Something went wrong. Please try again or email me directly.');

        // Fallback to mailto
        fallbackToMailto(data);

    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

/* ===== FAKE API CALL (Replace with actual) ===== */
function fakeApiCall(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form data:', data);
            resolve({ success: true });
        }, 1500);
    });
}

/* ===== FORM FEEDBACK ===== */
function showFormFeedback(form, type, message) {
    // Remove existing feedback
    const existingFeedback = form.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `form-feedback alert alert-${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 8px;
        animation: fadeInUp 0.3s ease;
    `;

    form.appendChild(feedback);

    // Auto remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            feedback.remove();
        }, 5000);
    }
}

/* ===== FALLBACK TO MAILTO ===== */
function fallbackToMailto(data) {
    const mailtoLink = `mailto:joel.kaudzu@kuhes.ac.mw?subject=${encodeURIComponent(data.subject || 'Contact Form')}&body=${encodeURIComponent(
        `Name: ${data.name || data['first-name'] || ''} ${data['last-name'] || ''}\n` +
        `Email: ${data.email}\n` +
        `Message: ${data.message}\n\n` +
        `---\nSent from joelkaudzu.github.io`
    )}`;

    window.location.href = mailtoLink;
}

/* ===== NEWSLETTER FORM ===== */
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            if (!emailInput || !validateField(emailInput)) return;

            const submitBtn = this.querySelector('[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            try {
                // Simulate API call
                await fakeApiCall({ email: emailInput.value, type: 'newsletter' });

                showFormFeedback(this, 'success', 'Thanks for subscribing! Check your email for confirmation.');
                emailInput.value = '';

                // Track conversion
                trackFormConversion('newsletter');

            } catch (error) {
                showFormFeedback(this, 'error', 'Subscription failed. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    });
}

/* ===== FORM AUTO-SAVE DRAFT ===== */
function initFormAutosave() {
    const forms = document.querySelectorAll('form[data-autosave="true"]');

    forms.forEach(form => {
        const formId = form.id || 'draft';

        // Autosave on input
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', debounce(() => {
                saveFormDraft(form, formId);
            }, 1000));
        });
    });
}

function saveFormDraft(form, formId) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    localStorage.setItem(`formDraft_${formId}`, JSON.stringify(data));
}

function loadFormDraft(form) {
    const formId = form.id || 'draft';
    const saved = localStorage.getItem(`formDraft_${formId}`);

    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"], #${key}`);
                if (input) {
                    input.value = data[key];
                }
            });

            // Show restore notification
            showRestoreNotification(form);
        } catch (e) {
            console.error('Failed to load draft:', e);
        }
    }
}

function showRestoreNotification(form) {
    const notification = document.createElement('div');
    notification.className = 'draft-notification';
    notification.innerHTML = `
        <p><i class="fas fa-save"></i> Draft restored</p>
        <button class="clear-draft">Clear</button>
    `;
    notification.style.cssText = `
        background: rgba(212, 175, 55, 0.1);
        border: 1px solid var(--gold-accent);
        border-radius: 8px;
        padding: 0.5rem 1rem;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation: slideInDown 0.3s ease;
    `;

    form.insertBefore(notification, form.firstChild);

    notification.querySelector('.clear-draft').addEventListener('click', function() {
        clearFormDraft(form);
        notification.remove();
    });
}

function clearFormDraft(form) {
    const formId = form.id || 'draft';
    localStorage.removeItem(`formDraft_${formId}`);
}

/* ===== GOOGLE RECAPTCHA INTEGRATION ===== */
function initReCaptcha() {
    // Load reCAPTCHA script if site key exists
    const siteKey = 'YOUR_RECAPTCHA_SITE_KEY'; // Replace with actual key

    if (siteKey && siteKey !== 'YOUR_RECAPTCHA_SITE_KEY') {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        document.head.appendChild(script);

        // Add reCAPTCHA to forms
        document.querySelectorAll('form[data-recaptcha="true"]').forEach(form => {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = 'recaptcha_token';
            form.appendChild(tokenInput);

            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                grecaptcha.ready(async () => {
                    const token = await grecaptcha.execute(siteKey, { action: 'submit' });
                    tokenInput.value = token;
                    this.submit();
                });
            });
        });
    }
}

/* ===== FORM ANALYTICS ===== */
function initFormAnalytics() {
    document.querySelectorAll('form').forEach(form => {
        // Track form starts
        form.addEventListener('focusin', function() {
            trackFormInteraction('start', this.id || 'unknown');
        });

        // Track field interactions
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                trackFormInteraction('field_focus', this.name || this.id);
            });
        });
    });
}

function trackFormInteraction(action, label) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_interaction', {
            'event_category': 'Form',
            'event_action': action,
            'event_label': label
        });
    }

    // Console log in development
    if (window.location.hostname === 'localhost') {
        console.log('Form interaction:', { action, label });
    }
}

function trackFormConversion(type) {
    // Google Analytics conversion tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'send_to': 'YOUR_CONVERSION_ID',
            'event_category': 'Form',
            'event_label': type
        });
    }
}

/* ===== RATE LIMITING ===== */
const formSubmissions = new Map();

function checkRateLimit(formId, limit = 3, timeWindow = 3600000) { // 3 per hour default
    const now = Date.now();
    const submissions = formSubmissions.get(formId) || [];

    // Clean old submissions
    const recent = submissions.filter(time => now - time < timeWindow);

    if (recent.length >= limit) {
        return false;
    }

    recent.push(now);
    formSubmissions.set(formId, recent);
    return true;
}

/* ===== CUSTOM VALIDATION RULES ===== */
const customValidators = {
    malawiPhone: (value) => {
        const malawiRegex = /^(?:\+265|0)[1-9][0-9]{7,8}$/;
        return malawiRegex.test(value);
    },

    studentEmail: (value) => {
        return value.endsWith('.ac.mw') || value.endsWith('.edu');
    },

    noSpecialChars: (value) => {
        return /^[a-zA-Z0-9\s]+$/.test(value);
    }
};

/* ===== FILE UPLOAD HANDLING ===== */
function initFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');

    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            const maxSize = parseInt(this.getAttribute('data-max-size') || '5242880'); // 5MB default
            const allowedTypes = (this.getAttribute('data-allowed-types') || 'image/*,.pdf').split(',');

            if (file) {
                // Check file size
                if (file.size > maxSize) {
                    showFieldError(this, `File too large. Max size: ${maxSize / 1048576}MB`);
                    this.value = '';
                    return;
                }

                // Check file type
                const fileType = file.type;
                const fileExtension = '.' + file.name.split('.').pop();

                const typeAllowed = allowedTypes.some(type => {
                    if (type.includes('/*')) {
                        const category = type.split('/')[0];
                        return fileType.startsWith(category);
                    }
                    return type === fileExtension || type === fileType;
                });

                if (!typeAllowed) {
                    showFieldError(this, 'File type not allowed');
                    this.value = '';
                    return;
                }

                // Show file name
                const fileNameDisplay = this.parentNode.querySelector('.file-name');
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = file.name;
                }
            }
        });
    });
}

/* ===== EXPORT FUNCTIONS ===== */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initContactForm,
        initNewsletterForm,
        initFormAutosave,
        initReCaptcha,
        initFileUploads,
        validateField,
        validateForm,
        customValidators
    };
}