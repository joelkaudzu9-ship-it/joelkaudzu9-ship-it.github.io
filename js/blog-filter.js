/* ========================================
   BLOG-FILTER.JS - Blog Category Filtering & Search
   Author: Joel George Kaudzu Portfolio
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initBlogFilters();
    initBlogSearch();
    initLoadMore();
    initBlogPagination();
});

/* ===== BLOG CATEGORY FILTERS ===== */
function initBlogFilters() {
    const filterButtons = document.querySelectorAll('.category-btn');
    const posts = document.querySelectorAll('.post-card');

    if (!filterButtons.length || !posts.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            // Filter posts
            posts.forEach(post => {
                if (category === 'all') {
                    post.style.display = 'block';
                    animatePost(post, 'show');
                } else {
                    const postCategory = post.getAttribute('data-category');
                    if (postCategory && postCategory.includes(category)) {
                        post.style.display = 'block';
                        animatePost(post, 'show');
                    } else {
                        animatePost(post, 'hide');
                    }
                }
            });

            // Update URL with filter parameter (without page reload)
            const url = new URL(window.location);
            if (category === 'all') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', category);
            }
            window.history.pushState({}, '', url);

            // Re-initialize pagination for filtered results
            if (typeof initBlogPagination === 'function') {
                initBlogPagination();
            }
        });
    });

    // Check URL for category parameter on load
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        const matchingButton = document.querySelector(`.category-btn[data-category="${categoryParam}"]`);
        if (matchingButton) {
            matchingButton.click();
        }
    }
}

/* ===== BLOG SEARCH ===== */
function initBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    const posts = document.querySelectorAll('.post-card');
    const noResults = document.getElementById('noResults');

    if (!searchInput || !posts.length) return;

    let searchTimeout;

    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            const searchTerm = this.value.toLowerCase().trim();
            let hasResults = false;

            posts.forEach(post => {
                const title = post.querySelector('h3')?.textContent.toLowerCase() || '';
                const excerpt = post.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
                const categories = post.getAttribute('data-category')?.toLowerCase() || '';

                if (title.includes(searchTerm) || excerpt.includes(searchTerm) || categories.includes(searchTerm)) {
                    post.style.display = 'block';
                    animatePost(post, 'show');
                    hasResults = true;
                } else {
                    animatePost(post, 'hide');
                }
            });

            // Show/hide no results message
            if (noResults) {
                noResults.style.display = hasResults ? 'none' : 'block';
            }

            // Update search parameter in URL
            const url = new URL(window.location);
            if (searchTerm) {
                url.searchParams.set('search', searchTerm);
            } else {
                url.searchParams.delete('search');
            }
            window.history.pushState({}, '', url);

        }, 300); // Debounce for performance
    });

    // Check URL for search parameter on load
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
        searchInput.value = searchParam;
        searchInput.dispatchEvent(new Event('input'));
    }
}

/* ===== LOAD MORE POSTS ===== */
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMorePosts');
    const postsContainer = document.getElementById('postsGrid');

    if (!loadMoreBtn || !postsContainer) return;

    let currentPage = 1;
    const postsPerPage = 6;
    let totalPosts = postsContainer.children.length;
    let loadedPosts = postsPerPage;

    // Initially hide posts beyond first page
    for (let i = loadedPosts; i < totalPosts; i++) {
        postsContainer.children[i].style.display = 'none';
    }

    // Hide load more button if all posts are shown
    if (totalPosts <= postsPerPage) {
        loadMoreBtn.style.display = 'none';
    }

    loadMoreBtn.addEventListener('click', function() {
        const start = loadedPosts;
        const end = Math.min(loadedPosts + postsPerPage, totalPosts);

        // Show next batch of posts
        for (let i = start; i < end; i++) {
            const post = postsContainer.children[i];
            post.style.display = 'block';
            animatePost(post, 'show');
        }

        loadedPosts = end;

        // Hide button if all posts are loaded
        if (loadedPosts >= totalPosts) {
            loadMoreBtn.style.display = 'none';
        }

        // Update page parameter in URL
        currentPage++;
        const url = new URL(window.location);
        url.searchParams.set('page', currentPage);
        window.history.pushState({}, '', url);
    });
}

/* ===== BLOG PAGINATION ===== */
function initBlogPagination() {
    const paginationContainer = document.getElementById('pagination');
    const posts = document.querySelectorAll('.post-card:not([style*="display: none"])');
    const postsPerPage = 6;

    if (!paginationContainer || !posts.length) return;

    const totalPages = Math.ceil(posts.length / postsPerPage);
    const currentPage = getCurrentPage();

    renderPagination(paginationContainer, totalPages, currentPage);

    // Show posts for current page
    posts.forEach((post, index) => {
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;

        if (index >= start && index < end) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

function renderPagination(container, totalPages, currentPage) {
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '<div class="pagination">';

    // Previous button
    html += `<button class="page-item ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}">
        <i class="fas fa-chevron-left"></i>
    </button>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 2 && i <= currentPage + 2)
        ) {
            html += `<button class="page-item ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        } else if (
            i === currentPage - 3 ||
            i === currentPage + 3
        ) {
            html += `<span class="page-dots">...</span>`;
        }
    }

    // Next button
    html += `<button class="page-item ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}">
        <i class="fas fa-chevron-right"></i>
    </button>`;

    html += '</div>';

    container.innerHTML = html;

    // Add event listeners
    container.querySelectorAll('.page-item:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = parseInt(this.getAttribute('data-page'));
            if (!isNaN(page)) {
                goToPage(page);
            }
        });
    });
}

function getCurrentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    const page = parseInt(pageParam);
    return !isNaN(page) && page > 0 ? page : 1;
}

function goToPage(page) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.pushState({}, '', url);

    // Re-initialize pagination
    initBlogPagination();

    // Scroll to top of blog section
    const blogSection = document.getElementById('blog-posts');
    if (blogSection) {
        blogSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/* ===== POST ANIMATIONS ===== */
function animatePost(post, action) {
    if (action === 'show') {
        post.style.opacity = '0';
        post.style.display = 'block';

        // Trigger reflow
        post.offsetHeight;

        post.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        post.style.opacity = '1';
        post.style.transform = 'translateY(0)';
    } else {
        post.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        post.style.opacity = '0';
        post.style.transform = 'translateY(20px)';

        setTimeout(() => {
            post.style.display = 'none';
        }, 300);
    }
}

/* ===== SORTING FUNCTIONALITY ===== */
function initBlogSort() {
    const sortSelect = document.getElementById('sortPosts');
    const postsContainer = document.getElementById('postsGrid');

    if (!sortSelect || !postsContainer) return;

    sortSelect.addEventListener('change', function() {
        const sortBy = this.value;
        const posts = Array.from(postsContainer.children);

        switch(sortBy) {
            case 'newest':
                posts.sort((a, b) => {
                    const dateA = new Date(a.getAttribute('data-date'));
                    const dateB = new Date(b.getAttribute('data-date'));
                    return dateB - dateA;
                });
                break;
            case 'oldest':
                posts.sort((a, b) => {
                    const dateA = new Date(a.getAttribute('data-date'));
                    const dateB = new Date(b.getAttribute('data-date'));
                    return dateA - dateB;
                });
                break;
            case 'popular':
                posts.sort((a, b) => {
                    const viewsA = parseInt(a.getAttribute('data-views') || '0');
                    const viewsB = parseInt(b.getAttribute('data-views') || '0');
                    return viewsB - viewsA;
                });
                break;
        }

        // Reorder DOM
        posts.forEach(post => postsContainer.appendChild(post));

        // Re-initialize pagination
        initBlogPagination();
    });
}

/* ===== TAGS CLOUD FILTERING ===== */
function initTagsFilter() {
    const tagButtons = document.querySelectorAll('.tag-filter');

    tagButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tag = this.getAttribute('data-tag');
            const searchInput = document.getElementById('blogSearch');

            if (searchInput) {
                searchInput.value = tag;
                searchInput.dispatchEvent(new Event('input'));
            }

            // Highlight active tag
            tagButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/* ===== RELATED POSTS SUGGESTIONS ===== */
function initRelatedPosts() {
    const currentPost = document.querySelector('.blog-article');
    if (!currentPost) return;

    const currentCategories = currentPost.getAttribute('data-categories')?.split(',') || [];
    const relatedContainer = document.getElementById('relatedPosts');

    if (!relatedContainer || !currentCategories.length) return;

    // Find posts with matching categories
    const allPosts = document.querySelectorAll('.post-card');
    const relatedPosts = [];

    allPosts.forEach(post => {
        if (post === currentPost.closest('.post-card')) return;

        const postCategories = post.getAttribute('data-category')?.split(',') || [];
        const hasMatching = postCategories.some(cat => currentCategories.includes(cat));

        if (hasMatching) {
            relatedPosts.push(post);
        }
    });

    // Display up to 3 related posts
    const relatedHTML = relatedPosts.slice(0, 3).map(post => {
        const title = post.querySelector('h3')?.textContent || '';
        const image = post.querySelector('img')?.getAttribute('src') || '';
        const link = post.querySelector('a')?.getAttribute('href') || '#';

        return `
            <div class="related-post glass-card">
                <img src="${image}" alt="${title}" loading="lazy">
                <h4><a href="${link}">${title}</a></h4>
            </div>
        `;
    }).join('');

    if (relatedHTML) {
        relatedContainer.innerHTML = relatedHTML;
    }
}

/* ===== BOOKMARKING POSTS ===== */
function initBookmarks() {
    const bookmarkBtns = document.querySelectorAll('.bookmark-post');

    bookmarkBtns.forEach(btn => {
        const postId = btn.getAttribute('data-post-id');

        // Check if already bookmarked
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
        if (bookmarks.includes(postId)) {
            btn.classList.add('bookmarked');
            btn.setAttribute('aria-label', 'Remove bookmark');
        }

        btn.addEventListener('click', function(e) {
            e.preventDefault();

            const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
            const index = bookmarks.indexOf(postId);

            if (index === -1) {
                // Add bookmark
                bookmarks.push(postId);
                this.classList.add('bookmarked');
                this.setAttribute('aria-label', 'Remove bookmark');
                showToast('Post bookmarked!');
            } else {
                // Remove bookmark
                bookmarks.splice(index, 1);
                this.classList.remove('bookmarked');
                this.setAttribute('aria-label', 'Bookmark post');
                showToast('Bookmark removed');
            }

            localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarks));
        });
    });
}

/* ===== READING TIME ESTIMATOR ===== */
function initReadingTime() {
    const postContent = document.querySelector('.blog-article');
    const readingTimeElement = document.getElementById('readingTime');

    if (!postContent || !readingTimeElement) return;

    const text = postContent.textContent || '';
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average 200 words per minute

    readingTimeElement.textContent = `${readingTime} min read`;
}

/* ===== TABLE OF CONTENTS GENERATOR ===== */
function generateTOC() {
    const postContent = document.querySelector('.blog-article');
    const tocContainer = document.getElementById('tableOfContents');

    if (!postContent || !tocContainer) return;

    const headings = postContent.querySelectorAll('h2, h3');
    if (!headings.length) return;

    let tocHTML = '<ul class="toc">';
    let currentLevel = 2;

    headings.forEach((heading, index) => {
        // Add ID if not present
        if (!heading.id) {
            heading.id = `section-${index}`;
        }

        const level = parseInt(heading.tagName[1]);

        if (level > currentLevel) {
            tocHTML += '<ul>';
        } else if (level < currentLevel) {
            tocHTML += '</ul>'.repeat(currentLevel - level);
        }

        tocHTML += `<li><a href="#${heading.id}">${heading.textContent}</a></li>`;

        currentLevel = level;
    });

    tocHTML += '</ul>'.repeat(currentLevel - 2);
    tocHTML += '</ul>';

    tocContainer.innerHTML = tocHTML;
}

/* ===== EXPORT FUNCTIONS ===== */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initBlogFilters,
        initBlogSearch,
        initLoadMore,
        initBlogPagination,
        initBlogSort,
        initTagsFilter,
        initRelatedPosts,
        initBookmarks,
        initReadingTime,
        generateTOC
    };
}