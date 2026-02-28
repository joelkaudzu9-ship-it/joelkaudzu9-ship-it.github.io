/* ========================================
   SKILL-BARS.JS - Animated Skill Progress Bars
   Author: Joel George Kaudzu Portfolio
======================================== */

class SkillBars {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-bar-fill');
        this.percentages = document.querySelectorAll('.skill-percent');
        this.animated = false;

        this.init();
    }

    init() {
        if (!this.skillBars.length) return;

        // Set initial state
        this.skillBars.forEach(bar => {
            bar.style.width = '0%';
        });

        this.percentages.forEach(percent => {
            percent.textContent = '0%';
        });

        // Animate when in view
        this.setupIntersectionObserver();

        // Also animate on scroll (backup)
        this.setupScrollListener();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateBars();
                    this.animated = true;
                }
            });
        }, { threshold: 0.3 });

        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }

    setupScrollListener() {
        let hasAnimated = false;

        window.addEventListener('scroll', () => {
            if (hasAnimated) return;

            const skillsSection = document.querySelector('.skills-section');
            if (!skillsSection) return;

            const rect = skillsSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;

            if (isVisible) {
                this.animateBars();
                hasAnimated = true;
            }
        }, { passive: true });
    }

    animateBars() {
        this.skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width') || '0';

            // Animate the bar
            bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            bar.style.width = width + '%';

            // Find and animate percentage
            const parent = bar.closest('.skill-item');
            if (parent) {
                const percentEl = parent.querySelector('.skill-percent');
                if (percentEl) {
                    this.animatePercentage(percentEl, parseInt(width));
                }
            }
        });

        // Dispatch event
        document.dispatchEvent(new CustomEvent('skillBarsAnimated'));
    }

    animatePercentage(element, target) {
        let current = 0;
        const increment = target / 50; // 50 steps
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '%';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '%';
            }
        }, 30);
    }

    // Method to reset animation
    reset() {
        this.skillBars.forEach(bar => {
            bar.style.width = '0%';
        });

        this.percentages.forEach(percent => {
            percent.textContent = '0%';
        });

        this.animated = false;
    }

    // Method to update skill percentage dynamically
    updateSkill(skillName, newPercentage) {
        const skillItem = Array.from(document.querySelectorAll('.skill-item')).find(item => {
            return item.querySelector('.skill-info span')?.textContent === skillName;
        });

        if (skillItem) {
            const bar = skillItem.querySelector('.skill-bar-fill');
            const percent = skillItem.querySelector('.skill-percent');

            if (bar && percent) {
                bar.setAttribute('data-width', newPercentage);
                bar.style.width = newPercentage + '%';
                percent.textContent = newPercentage + '%';
            }
        }
    }

    // Method to add new skill
    addSkill(category, skillName, percentage) {
        const categoryEl = Array.from(document.querySelectorAll('.skills-category')).find(el => {
            return el.querySelector('h3')?.textContent.includes(category);
        });

        if (categoryEl) {
            const skillHTML = `
                <div class="skill-item">
                    <div class="skill-info">
                        <span>${skillName}</span>
                        <span class="skill-percent" data-target="${percentage}">0%</span>
                    </div>
                    <div class="skill-bar-bg">
                        <div class="skill-bar-fill" data-width="${percentage}"></div>
                    </div>
                </div>
            `;

            categoryEl.insertAdjacentHTML('beforeend', skillHTML);

            // Re-initialize if already animated
            if (this.animated) {
                const newBar = categoryEl.querySelector('.skill-bar-fill:last-child');
                const newPercent = categoryEl.querySelector('.skill-percent:last-child');

                setTimeout(() => {
                    newBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    newBar.style.width = percentage + '%';
                    this.animatePercentage(newPercent, percentage);
                }, 100);
            }
        }
    }

    // Method for circular progress bars (alternative visualization)
    createCircularProgress(elementId, percentage, color = '#D4AF37') {
        const canvas = document.getElementById(elementId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.4;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);

        // Background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 10;
        ctx.stroke();

        // Progress circle
        const startAngle = -0.5 * Math.PI;
        const endAngle = startAngle + (percentage / 100) * 2 * Math.PI;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = color;
        ctx.lineWidth = 10;
        ctx.stroke();

        // Percentage text
        ctx.font = 'bold 20px Inter, sans-serif';
        ctx.fillStyle = '#F9FAFB';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(percentage + '%', centerX, centerY);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.skillBars = new SkillBars();
});

// Re-initialize on page transitions (for SPA-like behavior)
document.addEventListener('pageTransition', () => {
    if (window.skillBars) {
        window.skillBars.reset();
    }
});