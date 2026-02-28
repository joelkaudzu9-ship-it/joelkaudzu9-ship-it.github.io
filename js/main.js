/* ========================================
   MAIN.JS - Core Functionality
   Author: Joel George Kaudzu Portfolio
======================================== */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initNavigation();
    initThemeToggle();
    initBackToTop();
    initSmoothScroll();
    initCustomCursor();
    initParallax();
    initTypingEffect();
    initCounter();
    initTooltips();
    initModalTriggers();
    initAccordions();
    initTabs();
    initScrollSpy();
    initFormValidation();
    initLazyLoading();
    initPerformanceOptimizations();
});

/* ===== PRELOADER ===== */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
        }, 500);
    });
}

/* ===== NAVIGATION ===== */
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.main-nav');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Active link highlighting
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.includes(linkPath) && linkPath !== '#') {
            link.classList.add('active');
        }
    });
}

/* ===== THEME TOGGLE ===== */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = savedTheme + '-mode';
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.body.classList.remove(currentTheme + '-mode');
        document.body.classList.add(newTheme + '-mode');
        localStorage.setItem('theme', newTheme);

        updateThemeIcon(newTheme);

        // Trigger theme change event for components
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    });
}

function updateThemeIcon(theme) {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    if (theme === 'light') {
        toggle.classList.add('light-mode');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        toggle.classList.remove('light-mode');
        toggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

/* ===== BACK TO TOP ===== */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ===== SMOOTH SCROLL ===== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ===== CUSTOM CURSOR ===== */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    if (!cursor || !follower) return;

    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', function() {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });

    document.addEventListener('mouseup', function() {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Hover effects for interactive elements
    document.querySelectorAll('a, button, .btn, .glass-card').forEach(el => {
        el.addEventListener('mouseenter', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.borderColor = 'var(--cyan-highlight)';
            follower.style.transform = 'translate(-50%, -50%) scale(2)';
            follower.style.background = 'var(--gold-accent)';
        });

        el.addEventListener('mouseleave', function() {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.borderColor = 'var(--gold-accent)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.background = 'var(--cyan-highlight)';
        });
    });
}

/* ===== PARALLAX EFFECT ===== */
function initParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-parallax') || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

/* ===== TYPING EFFECT ===== */
function initTypingEffect() {
    const typingElement = document.querySelector('[data-typing]');
    if (!typingElement) return;

    const words = JSON.parse(typingElement.getAttribute('data-words') || '["Innovator", "Builder", "Founder"]');
    const typeSpeed = parseInt(typingElement.getAttribute('data-speed') || '100');
    const deleteSpeed = parseInt(typingElement.getAttribute('data-delete-speed') || '50');
    const delayBetween = parseInt(typingElement.getAttribute('data-delay') || '2000');

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, delayBetween);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }

        setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
    }

    setTimeout(type, 1000);
}

/* ===== COUNTER ANIMATION ===== */
function initCounter() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = parseInt(counter.innerText);
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };

        // Start counter when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(counter);
    });
}

/* ===== TOOLTIPS ===== */
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');

    tooltips.forEach(el => {
        const text = el.getAttribute('data-tooltip');
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip-text';
        tooltip.textContent = text;

        el.classList.add('tooltip');
        el.appendChild(tooltip);
    });
}

/* ===== MODAL TRIGGERS ===== */
function initModalTriggers() {
    const modalTriggers = document.querySelectorAll('[data-modal]');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);

            if (modal) {
                openModal(modal);
            }
        });
    });

    // Close modal on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
        }
    });
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/* ===== ACCORDIONS ===== */
function initAccordions() {
    const accordions = document.querySelectorAll('.accordion-item');

    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');

        header.addEventListener('click', function() {
            const isActive = accordion.classList.contains('active');

            // Close all other accordions if needed
            if (!accordion.closest('[data-allow-multiple]')) {
                accordions.forEach(item => {
                    item.classList.remove('active');
                });
            }

            if (!isActive) {
                accordion.classList.add('active');
            }
        });
    });
}

/* ===== TABS ===== */
function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs');

    tabContainers.forEach(container => {
        const headers = container.querySelectorAll('.tab-header');
        const panes = container.querySelectorAll('.tab-pane');

        headers.forEach(header => {
            header.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');

                // Deactivate all
                headers.forEach(h => h.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));

                // Activate selected
                this.classList.add('active');
                document.getElementById(tabId)?.classList.add('active');
            });
        });
    });
}

/* ===== SCROLL SPY ===== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').replace('#', '');
            if (href === current) {
                link.classList.add('active');
            }
        });
    });
}

/* ===== FORM VALIDATION ===== */
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    showFieldError(input, 'This field is required');
                } else {
                    clearFieldError(input);
                }

                // Email validation
                if (input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        showFieldError(input, 'Please enter a valid email');
                    }
                }
            });

            if (isValid) {
                showFormSuccess(form);
                // Here you would normally submit the form via AJAX
                console.log('Form is valid, submitting...');
            }
        });
    });
}

function showFieldError(field, message) {
    clearFieldError(field);

    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    error.style.color = '#ef4444';
    error.style.fontSize = '0.8rem';
    error.style.marginTop = '0.3rem';

    field.style.borderColor = '#ef4444';
    field.parentNode.appendChild(error);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const error = field.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
}

function showFormSuccess(form) {
    const success = document.createElement('div');
    success.className = 'alert alert-success';
    success.textContent = 'Message sent successfully!';
    success.style.marginTop = '1rem';

    form.appendChild(success);

    setTimeout(() => {
        success.remove();
        form.reset();
    }, 3000);
}

/* ===== LAZY LOADING ===== */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

/* ===== PERFORMANCE OPTIMIZATIONS ===== */
function initPerformanceOptimizations() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            // Scroll end calculations
        }, 100);
    }, { passive: true });

    // Throttle resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Resize end calculations
        }, 150);
    }, { passive: true });

    // Preload critical resources
    if ('connection' in navigator && navigator.connection.saveData) {
        // Don't preload if data saver is on
        return;
    }

    // Preload next likely pages
    const preloadLinks = document.querySelectorAll('link[rel="prefetch"]');
    preloadLinks.forEach(link => {
        const url = link.getAttribute('href');
        const preload = document.createElement('link');
        preload.rel = 'prefetch';
        preload.href = url;
        document.head.appendChild(preload);
    });
}

/* ===== UTILITY FUNCTIONS ===== */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--gold-accent);
        color: var(--deep-navy);
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        animation: slideInUp 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/* ===== EXPORT FOR MODULE USE ===== */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initPreloader,
        initNavigation,
        initThemeToggle,
        initBackToTop,
        initSmoothScroll,
        initCustomCursor,
        initParallax,
        initTypingEffect,
        initCounter,
        initTooltips,
        initModalTriggers,
        initAccordions,
        initTabs,
        initScrollSpy,
        initFormValidation,
        initLazyLoading,
        initPerformanceOptimizations
    };
}