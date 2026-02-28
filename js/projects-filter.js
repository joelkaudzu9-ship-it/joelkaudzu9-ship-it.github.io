/* ========================================
   PROJECTS-FILTER.JS - Filter Projects by Category
   Author: Joel George Kaudzu Portfolio
======================================== */

class ProjectFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projects = document.querySelectorAll('.project-item');
        this.projectsGrid = document.getElementById('projectsGrid');
        this.activeFilter = 'all';

        this.init();
    }

    init() {
        if (!this.filterButtons.length || !this.projects.length) return;

        this.setupEventListeners();
        this.loadProjectsFromData();
        this.setupSearch();
        this.setupSort();

        // Check URL for filter parameter
        this.checkUrlParams();
    }

    setupEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterProjects(filter);

                // Update active button
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update URL
                this.updateUrlParam('filter', filter);
            });
        });
    }

    filterProjects(category) {
        this.activeFilter = category;
        let visibleCount = 0;

        this.projects.forEach(project => {
            const projectCategories = project.getAttribute('data-category') || '';

            if (category === 'all' || projectCategories.includes(category)) {
                this.showProject(project);
                visibleCount++;
            } else {
                this.hideProject(project);
            }
        });

        // Show "no results" message if needed
        this.toggleNoResults(visibleCount === 0);

        // Dispatch event
        document.dispatchEvent(new CustomEvent('projectsFiltered', {
            detail: { category, count: visibleCount }
        }));
    }

    showProject(project) {
        project.style.display = 'block';
        // Animate in
        project.style.opacity = '0';
        project.style.transform = 'translateY(20px)';

        // Trigger reflow
        project.offsetHeight;

        project.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        project.style.opacity = '1';
        project.style.transform = 'translateY(0)';
    }

    hideProject(project) {
        project.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        project.style.opacity = '0';
        project.style.transform = 'translateY(20px)';

        setTimeout(() => {
            project.style.display = 'none';
        }, 300);
    }

    toggleNoResults(show) {
        let noResults = document.querySelector('.no-results');

        if (show) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results glass-card';
                noResults.innerHTML = `
                    <i class="fas fa-search"></i>
                    <h3>No projects found</h3>
                    <p>Try a different filter category</p>
                `;
                this.projectsGrid.parentNode.appendChild(noResults);
            }
            noResults.style.display = 'block';
        } else {
            if (noResults) {
                noResults.style.display = 'none';
            }
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('projectSearch');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.searchProjects(searchTerm);
        });
    }

    searchProjects(term) {
        let visibleCount = 0;

        this.projects.forEach(project => {
            const title = project.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = project.querySelector('p')?.textContent.toLowerCase() || '';
            const matches = title.includes(term) || description.includes(term);

            // Check if also matches current category filter
            const projectCategories = project.getAttribute('data-category') || '';
            const categoryMatches = this.activeFilter === 'all' || projectCategories.includes(this.activeFilter);

            if (matches && categoryMatches) {
                this.showProject(project);
                visibleCount++;
            } else {
                this.hideProject(project);
            }
        });

        this.toggleNoResults(visibleCount === 0);
    }

    setupSort() {
        const sortSelect = document.getElementById('projectSort');
        if (!sortSelect) return;

        sortSelect.addEventListener('change', (e) => {
            this.sortProjects(e.target.value);
        });
    }

    sortProjects(method) {
        const projectsArray = Array.from(this.projects);

        switch(method) {
            case 'newest':
                projectsArray.sort((a, b) => {
                    const yearA = parseInt(a.getAttribute('data-year') || '0');
                    const yearB = parseInt(b.getAttribute('data-year') || '0');
                    return yearB - yearA;
                });
                break;
            case 'oldest':
                projectsArray.sort((a, b) => {
                    const yearA = parseInt(a.getAttribute('data-year') || '0');
                    const yearB = parseInt(b.getAttribute('data-year') || '0');
                    return yearA - yearB;
                });
                break;
            case 'name':
                projectsArray.sort((a, b) => {
                    const nameA = a.querySelector('h3')?.textContent || '';
                    const nameB = b.querySelector('h3')?.textContent || '';
                    return nameA.localeCompare(nameB);
                });
                break;
        }

        // Reorder DOM
        projectsArray.forEach(project => {
            this.projectsGrid.appendChild(project);
        });

        // Re-apply current filter
        this.filterProjects(this.activeFilter);
    }

    loadProjectsFromData() {
        // If we have empty project grid, load from JSON
        if (this.projects.length === 0 && this.projectsGrid) {
            fetch('/data/projects.json')
                .then(response => response.json())
                .then(data => {
                    this.renderProjects(data.projects);
                })
                .catch(error => {
                    console.log('Using inline projects');
                });
        }
    }

    renderProjects(projects) {
        if (!this.projectsGrid) return;

        this.projectsGrid.innerHTML = '';

        projects.forEach(project => {
            if (!project.featured) return; // Only show featured on main page

            const projectCard = this.createProjectCard(project);
            this.projectsGrid.appendChild(projectCard);
        });

        // Update projects collection
        this.projects = document.querySelectorAll('.project-item');
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-item glass-card';
        card.setAttribute('data-category', project.category.join(' '));
        card.setAttribute('data-year', project.year);

        const statusClass = project.status === 'completed' ? 'completed' : 'in-progress';
        const statusText = project.status === 'completed' ? 'Completed' : 'In Progress';

        card.innerHTML = `
            <div class="project-media">
                <img src="/assets/images/projects/${project.images[0]}" alt="${project.name}">
                <div class="project-badges">
                    <span class="badge status ${statusClass}">${statusText}</span>
                </div>
            </div>
            <div class="project-content">
                <h3>${project.name}</h3>
                <p class="project-subtitle">${project.subtitle}</p>
                <p class="project-description">${project.description}</p>
                <div class="project-tools">
                    ${project.tools.slice(0, 3).map(tool => `<span>${tool}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="#" class="btn-link">View Project <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        `;

        return card;
    }

    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');

        if (filterParam) {
            const matchingButton = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
            if (matchingButton) {
                matchingButton.click();
            }
        }
    }

    updateUrlParam(key, value) {
        const url = new URL(window.location);
        if (value === 'all') {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }
        window.history.pushState({}, '', url);
    }

    // Method to get project count by category
    getCategoryCounts() {
        const counts = { all: this.projects.length };

        this.projects.forEach(project => {
            const categories = project.getAttribute('data-category')?.split(' ') || [];
            categories.forEach(cat => {
                counts[cat] = (counts[cat] || 0) + 1;
            });
        });

        return counts;
    }

    // Method to reset all filters
    resetFilters() {
        // Reset filter buttons
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');

        // Reset search
        const searchInput = document.getElementById('projectSearch');
        if (searchInput) searchInput.value = '';

        // Reset sort
        const sortSelect = document.getElementById('projectSort');
        if (sortSelect) sortSelect.value = 'newest';

        // Show all projects
        this.filterProjects('all');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.projects-section')) {
        window.projectFilter = new ProjectFilter();
    }
});