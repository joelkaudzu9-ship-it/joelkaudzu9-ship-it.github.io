/* ========================================
   TIMELINE.JS - Interactive Innovation Timeline
   Author: Joel George Kaudzu Portfolio
======================================== */

class InnovationTimeline {
    constructor() {
        this.container = document.querySelector('.timeline-container');
        this.track = document.querySelector('.timeline-track');
        this.items = document.querySelectorAll('.timeline-item');
        this.prevBtn = document.querySelector('.timeline-prev');
        this.nextBtn = document.querySelector('.timeline-next');

        this.currentIndex = 0;
        this.itemWidth = 350; // Width of each timeline item
        this.itemGap = 32; // Gap between items
        this.visibleItems = this.getVisibleItems();

        this.init();
    }

    init() {
        if (!this.container || !this.track) return;

        this.setupEventListeners();
        this.setupTouchEvents();
        this.setupKeyboardNav();
        this.setupAutoPlay();
        this.updateButtons();
        this.loadTimelineData();

        // Initialize with fade-in
        this.items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    getVisibleItems() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }

    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.scrollToPrev());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.scrollToNext());
        }

        window.addEventListener('resize', () => {
            this.visibleItems = this.getVisibleItems();
            this.updateButtons();
        });
    }

    setupTouchEvents() {
        let startX = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.track.style.transition = 'none';
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const currentX = e.touches[0].clientX;
            const diff = currentX - startX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.scrollToPrev();
                } else {
                    this.scrollToNext();
                }
                isDragging = false;
            }
        }, { passive: false });

        this.track.addEventListener('touchend', () => {
            isDragging = false;
            this.track.style.transition = '';
        });
    }

    setupKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.scrollToPrev();
            } else if (e.key === 'ArrowRight') {
                this.scrollToNext();
            }
        });
    }

    setupAutoPlay() {
        let autoplayInterval = setInterval(() => {
            if (!document.hidden && this.isInViewport()) {
                this.scrollToNext();
            }
        }, 5000);

        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        this.container.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(() => {
                if (!document.hidden && this.isInViewport()) {
                    this.scrollToNext();
                }
            }, 5000);
        });
    }

    isInViewport() {
        const rect = this.container.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }

    scrollToPrev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.scrollToIndex();
        }
    }

    scrollToNext() {
        if (this.currentIndex < this.items.length - this.visibleItems) {
            this.currentIndex++;
            this.scrollToIndex();
        } else {
            // Loop back to start
            this.currentIndex = 0;
            this.scrollToIndex();
        }
    }

    scrollToIndex() {
        const scrollPosition = this.currentIndex * (this.itemWidth + this.itemGap);

        this.track.style.transform = `translateX(-${scrollPosition}px)`;
        this.updateButtons();
        this.highlightActiveItem();

        // Dispatch event
        this.container.dispatchEvent(new CustomEvent('timelineScroll', {
            detail: { index: this.currentIndex }
        }));
    }

    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        }

        if (this.nextBtn) {
            const isAtEnd = this.currentIndex >= this.items.length - this.visibleItems;
            this.nextBtn.disabled = false; // Allow looping
            this.nextBtn.style.opacity = '1';
        }
    }

    highlightActiveItem() {
        this.items.forEach((item, index) => {
            if (index === this.currentIndex) {
                item.classList.add('active');
                item.style.transform = 'scale(1.05)';
                item.style.zIndex = '10';
            } else {
                item.classList.remove('active');
                item.style.transform = 'scale(1)';
                item.style.zIndex = '1';
            }
        });
    }

    loadTimelineData() {
        // If timeline data exists in a separate JSON file, load it
        fetch('/data/timeline.json')
            .then(response => response.json())
            .then(data => {
                this.populateTimeline(data);
            })
            .catch(error => {
                console.log('Using inline timeline data');
                // Fallback to inline data
                this.populateTimeline(this.getDefaultData());
            });
    }

    getDefaultData() {
        return [
            {
                year: '2021',
                title: 'Mini Bio-Digester',
                description: 'Built as Form 2 student at Dedza Secondary School. First engineering project that sparked my curiosity in applied problem-solving.',
                icon: 'fa-flask',
                image: '/assets/images/projects/bio-digester-1.jpg'
            },
            {
                year: '2022',
                title: 'Avocado Oil Extraction',
                description: 'Experimental project exploring agricultural processing and value addition. Learned about chemical extraction methods.',
                icon: 'fa-oil-can',
                image: '/assets/images/projects/avocado-oil-1.jpg'
            },
            {
                year: '2023-24',
                title: 'Teaching & Mentorship',
                description: 'Student Teacher in Math & Physics at Bright Future Private Secondary School. Developed communication and leadership.',
                icon: 'fa-chalkboard',
                image: '/assets/images/leadership/teaching-math-1.jpg'
            },
            {
                year: '2024',
                title: 'CheckMySmile',
                description: 'Founded and built dental awareness & smile tracking solution. Platform encourages proactive dental health.',
                icon: 'fa-tooth',
                image: '/assets/images/projects/checkmysmile-dashboard.jpg'
            },
            {
                year: '2025',
                title: 'KUHES Campus Connect',
                description: 'Exclusive student networking platform using @kuhes.ac.mw emails. Strengthening academic collaboration.',
                icon: 'fa-network-wired',
                image: '/assets/images/projects/campus-connect-mockup.jpg'
            },
            {
                year: 'Future',
                title: 'Research & Medical-Tech',
                description: 'Vision to blend dentistry, immunology, and data analytics into scalable solutions for African healthcare.',
                icon: 'fa-dna',
                image: ''
            }
        ];
    }

    populateTimeline(data) {
        // Clear existing items
        this.track.innerHTML = '';

        // Create new timeline items from data
        data.forEach((item, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.setAttribute('data-year', item.year);

            timelineItem.innerHTML = `
                <div class="timeline-marker">
                    <span class="year">${item.year}</span>
                    <span class="dot"></span>
                </div>
                <div class="timeline-content glass-card">
                    <div class="content-icon">
                        <i class="fas ${item.icon}"></i>
                    </div>
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    ${item.image ? `<div class="content-media"><img src="${item.image}" alt="${item.title}" loading="lazy"></div>` : ''}
                </div>
            `;

            this.track.appendChild(timelineItem);
        });

        // Update items collection
        this.items = document.querySelectorAll('.timeline-item');

        // Recalculate and update
        this.updateButtons();
    }

    // Method to add new timeline items dynamically
    addItem(year, title, description, icon = 'fa-flask', image = null) {
        const newItem = document.createElement('div');
        newItem.className = 'timeline-item';
        newItem.setAttribute('data-year', year);
        newItem.innerHTML = `
            <div class="timeline-marker">
                <span class="year">${year}</span>
                <span class="dot"></span>
            </div>
            <div class="timeline-content glass-card">
                <div class="content-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <h4>${title}</h4>
                <p>${description}</p>
                ${image ? `<div class="content-media"><img src="${image}" alt="${title}" loading="lazy"></div>` : ''}
            </div>
        `;

        this.track.appendChild(newItem);
        this.items = document.querySelectorAll('.timeline-item');

        // Recalculate and update
        this.updateButtons();
    }

    // Method to animate timeline entrance
    animateEntrance() {
        if (typeof gsap !== 'undefined') {
            gsap.from('.timeline-item', {
                scrollTrigger: {
                    trigger: '.timeline-section',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 1,
                stagger: 0.2
            });
        }
    }

    // Method to jump to specific year
    jumpToYear(year) {
        const index = Array.from(this.items).findIndex(item =>
            item.getAttribute('data-year') === year.toString()
        );

        if (index !== -1) {
            this.currentIndex = Math.min(index, this.items.length - this.visibleItems);
            this.scrollToIndex();
        }
    }

    // Method to get current visible years
    getVisibleYears() {
        const visibleIndices = [];
        for (let i = 0; i < this.visibleItems; i++) {
            if (this.currentIndex + i < this.items.length) {
                visibleIndices.push(this.currentIndex + i);
            }
        }
        return visibleIndices.map(i => this.items[i]?.getAttribute('data-year'));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.timeline-container')) {
        window.innovationTimeline = new InnovationTimeline();
    }
});