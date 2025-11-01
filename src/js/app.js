// Alot1z's Repository Wiki - Main Application
// Interactive functionality for repository search, filtering, and visualization

class RepositoryWiki {
    constructor() {
        this.data = repositoriesData;
        this.charts = {};
        this.init();
    }

    init() {
        this.loadOverview();
        this.loadCategories();
        this.loadStatistics();
        this.loadTrending();
        this.setupSearch();
        this.setupNavigation();
        this.updateFooterStats();
        this.setupSmoothScroll();
        this.setupIntersectionObserver();
    }

    // Load overview section
    loadOverview() {
        const overviewGrid = document.getElementById('overview-grid');
        const categories = Object.entries(this.data.categories);

        overviewGrid.innerHTML = categories.map(([key, category]) => `
            <div class="overview-card">
                <div class="overview-icon">${this.getCategoryIcon(key)}</div>
                <div class="overview-title">${category.name}</div>
                <div class="overview-count">${category.count}</div>
                <div class="overview-description">${category.description}</div>
                <button class="btn btn-primary" onclick="wiki.showCategoryDetails('${key}')">
                    View Details
                </button>
            </div>
        `).join('');
    }

    // Load detailed categories
    loadCategories() {
        const categoriesContainer = document.getElementById('categories-container');
        const categories = Object.entries(this.data.categories);

        categoriesContainer.innerHTML = categories.map(([key, category]) => `
            <div class="category-card" id="category-${key}">
                <div class="category-header">
                    <div class="category-icon">${this.getCategoryIcon(key)}</div>
                    <div class="category-title">${category.name}</div>
                </div>
                <div class="category-description">${category.description}</div>
                <div class="category-stats">
                    <div class="category-stat">
                        <span class="category-stat-number">${category.count}</span>
                        <span class="category-stat-label">Repositories</span>
                    </div>
                    <div class="category-stat">
                        <span class="category-stat-number">${this.getUniqueLanguages(category.repositories)}</span>
                        <span class="category-stat-label">Languages</span>
                    </div>
                    <div class="category-stat">
                        <span class="category-stat-number">${category.priority}</span>
                        <span class="category-stat-label">Priority</span>
                    </div>
                </div>
                <div class="category-repos">
                    ${category.repositories.slice(0, 5).map(repo => `
                        <div class="category-repo">
                            <a href="https://github.com${repo.url}" target="_blank" class="repo-name">
                                ${repo.name}
                            </a>
                            <span class="repo-language">${repo.language}</span>
                        </div>
                    `).join('')}
                    ${category.repositories.length > 5 ? `
                        <div class="category-repo">
                            <span class="repo-name">... and ${category.repositories.length - 5} more</span>
                        </div>
                    ` : ''}
                </div>
                <button class="btn btn-primary mt-2" onclick="wiki.showAllCategoryRepos('${key}')">
                    View All ${category.count} Repositories
                </button>
            </div>
        `).join('');
    }

    // Load statistics
    loadStatistics() {
        const stats = this.data.getStatistics();
        const statsGrid = document.getElementById('stats-grid');

        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-card-value">${stats.totalRepositories}</div>
                <div class="stat-card-label">Total Repositories</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-value">${stats.totalCategories}</div>
                <div class="stat-card-label">Categories</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-value">${Object.keys(stats.languageDistribution).length}</div>
                <div class="stat-card-label">Languages</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-value">${Object.keys(stats.licenseDistribution).length}</div>
                <div class="stat-card-label">License Types</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-value">${stats.difficultyDistribution.beginner}</div>
                <div class="stat-card-label">Beginner Friendly</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-value">${stats.difficultyDistribution.advanced}</div>
                <div class="stat-card-label">Advanced Projects</div>
            </div>
        `;

        this.loadCharts(stats);
    }

    // Load charts
    loadCharts(stats) {
        this.createLanguageChart(stats.languageDistribution);
        this.createCategoryChart();
        this.createDifficultyChart(stats.difficultyDistribution);
    }

    createLanguageChart(languageData) {
        const ctx = document.getElementById('language-chart').getContext('2d');
        
        // Sort languages by count and take top 10
        const sortedLanguages = Object.entries(languageData)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        this.charts.language = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: sortedLanguages.map(([lang]) => lang),
                datasets: [{
                    data: sortedLanguages.map(([, count]) => count),
                    backgroundColor: [
                        '#0969da', '#8250df', '#1a7f37', '#9a6700',
                        '#d1242f', '#fb8500', '#2ea043', '#fd7e14',
                        '#6f42c1', '#0ea5e9'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    createCategoryChart() {
        const ctx = document.getElementById('category-chart').getContext('2d');
        const categories = Object.entries(this.data.categories);

        this.charts.category = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories.map(([key, category]) => category.name),
                datasets: [{
                    label: 'Repositories',
                    data: categories.map(([, category]) => category.count),
                    backgroundColor: [
                        'rgba(9, 105, 218, 0.8)',
                        'rgba(130, 80, 223, 0.8)',
                        'rgba(26, 127, 55, 0.8)',
                        'rgba(154, 103, 0, 0.8)',
                        'rgba(209, 36, 47, 0.8)',
                        'rgba(251, 133, 0, 0.8)'
                    ],
                    borderColor: [
                        '#0969da', '#8250df', '#1a7f37', '#9a6700',
                        '#d1242f', '#fb8500'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 5
                        }
                    }
                }
            }
        });
    }

    createDifficultyChart(difficultyData) {
        const ctx = document.getElementById('difficulty-chart').getContext('2d');

        this.charts.difficulty = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Beginner', 'Intermediate', 'Advanced'],
                datasets: [{
                    data: [
                        difficultyData.beginner,
                        difficultyData.intermediate,
                        difficultyData.advanced
                    ],
                    backgroundColor: [
                        'rgba(26, 127, 55, 0.8)',
                        'rgba(251, 133, 0, 0.8)',
                        'rgba(209, 36, 47, 0.8)'
                    ],
                    borderColor: [
                        '#1a7f37', '#fb8500', '#d1242f'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} projects (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Load trending repositories
    loadTrending() {
        const trendingGrid = document.getElementById('trending-grid');
        const trending = this.data.getTrendingRepositories(10);

        trendingGrid.innerHTML = trending.map((repo, index) => `
            <div class="trending-item">
                <div class="trending-rank">#${index + 1}</div>
                <div class="trending-content">
                    <div class="trending-title">
                        <a href="https://github.com${repo.url}" target="_blank" class="repo-name">
                            ${repo.name}
                        </a>
                    </div>
                    <div class="trending-description">${repo.description}</div>
                    <div class="trending-meta">
                        <span class="repo-language">${repo.language}</span>
                        <span>📅 ${this.formatDate(repo.lastUpdated)}</span>
                        <span>${repo.difficulty}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Setup search functionality
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const categoryFilter = document.getElementById('category-filter');
        const languageFilter = document.getElementById('language-filter');
        const difficultyFilter = document.getElementById('difficulty-filter');

        // Populate filters
        this.populateFilters(categoryFilter, languageFilter);

        // Search functionality
        const performSearch = () => {
            const query = searchInput.value.trim();
            const category = categoryFilter.value;
            const language = languageFilter.value;
            const difficulty = difficultyFilter.value;

            let results = this.data.getAllRepositories();

            // Apply filters
            if (query) {
                results = this.data.searchRepositories(query);
            }
            if (category) {
                results = results.filter(repo => repo.category === category);
            }
            if (language) {
                results = results.filter(repo => repo.language === language);
            }
            if (difficulty) {
                results = results.filter(repo => repo.difficulty === difficulty);
            }

            this.displaySearchResults(results);
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });

        categoryFilter.addEventListener('change', performSearch);
        languageFilter.addEventListener('change', performSearch);
        difficultyFilter.addEventListener('change', performSearch);

        // Real-time search
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 300);
        });
    }

    // Populate filter dropdowns
    populateFilters(categoryFilter, languageFilter) {
        // Categories
        Object.entries(this.data.categories).forEach(([key, category]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });

        // Languages
        const languages = [...new Set(this.data.getAllRepositories().map(repo => repo.language))];
        languages.sort().forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = lang;
            languageFilter.appendChild(option);
        });
    }

    // Display search results
    displaySearchResults(results) {
        const searchResults = document.getElementById('search-results');
        const resultsContainer = document.getElementById('search-results-container');

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="text-center">No repositories found matching your criteria.</p>';
        } else {
            resultsContainer.innerHTML = results.map(repo => `
                <div class="category-card">
                    <div class="category-header">
                        <div class="category-icon">${this.getCategoryIcon(repo.category)}</div>
                        <div>
                            <div class="category-title">
                                <a href="https://github.com${repo.url}" target="_blank" class="repo-name">
                                    ${repo.name}
                                </a>
                            </div>
                            <div class="category-repo">
                                <span class="repo-language">${repo.language}</span>
                                <span class="repo-language">${repo.license}</span>
                            </div>
                        </div>
                    </div>
                    <div class="category-description">${repo.description}</div>
                    <div class="category-repos">
                        <div><strong>Tags:</strong> ${repo.tags.join(', ')}</div>
                        <div><strong>Difficulty:</strong> ${repo.difficulty}</div>
                        <div><strong>Last Updated:</strong> ${this.formatDate(repo.lastUpdated)}</div>
                        ${repo.forks ? `<div><strong>Forked from:</strong> ${repo.original}</div>` : ''}
                    </div>
                </div>
            `).join('');
        }

        searchResults.classList.remove('hidden');
    }

    // Setup navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Scroll to section
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Update active nav on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    // Update footer statistics
    updateFooterStats() {
        document.getElementById('footer-total-repos').textContent = this.data.total;
        document.getElementById('footer-total-categories').textContent = Object.keys(this.data.categories).length;
        document.getElementById('footer-last-updated').textContent = this.formatDate(this.data.lastUpdated);
    }

    // Setup smooth scroll
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Setup intersection observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections for animation
        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    // Helper methods
    getCategoryIcon(categoryKey) {
        const icons = {
            'mcp-servers': '🤖',
            'ai-ml-tools': '🧠',
            'web-scraping': '🕷️',
            'development-tools': '🛠️',
            'security-tools': '🔒',
            'mobile-development': '📱'
        };
        return icons[categoryKey] || '📁';
    }

    getUniqueLanguages(repositories) {
        return [...new Set(repositories.map(repo => repo.language))].length;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }

    showCategoryDetails(categoryKey) {
        const category = this.data.categories[categoryKey];
        const section = document.getElementById('categories');
        section.scrollIntoView({ behavior: 'smooth' });
        
        // Highlight the category card
        setTimeout(() => {
            const categoryCard = document.getElementById(`category-${categoryKey}`);
            if (categoryCard) {
                categoryCard.style.border = '2px solid var(--primary-color)';
                categoryCard.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    categoryCard.style.border = '';
                    categoryCard.style.transform = '';
                }, 2000);
            }
        }, 500);
    }

    showAllCategoryRepos(categoryKey) {
        const category = this.data.categories[categoryKey];
        const allRepos = category.repositories.map(repo => `
            <div class="category-repo">
                <a href="https://github.com${repo.url}" target="_blank" class="repo-name">
                    ${repo.name}
                </a>
                <span class="repo-language">${repo.language}</span>
            </div>
        `).join('');

        // Update the category card to show all repos
        const categoryCard = document.getElementById(`category-${categoryKey}`);
        const reposContainer = categoryCard.querySelector('.category-repos');
        reposContainer.innerHTML = allRepos;
        
        categoryCard.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the application when DOM is ready
let wiki;
document.addEventListener('DOMContentLoaded', () => {
    wiki = new RepositoryWiki();
    
    // Add some interactivity
    console.log('🚀 Alot1z\'s Repository Wiki loaded successfully!');
    console.log(`📊 Total repositories: ${repositoriesData.total}`);
    console.log(`📁 Categories: ${Object.keys(repositoriesData.categories).length}`);
});

// Export for global access
window.wiki = wiki;
