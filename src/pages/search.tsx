import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

import styles from './search.module.css';

interface Repository {
  name: string;
  url: string;
  description: string;
  language: string;
  license: string | null;
  last_updated: string;
  category: string;
  stars: number;
  forks: number;
  topics: string[];
}

interface Category {
  name: string;
  description: string;
  count: number;
}

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updated');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load repository data
    const loadData = async () => {
      try {
        const response = await fetch('/data/repositories.json');
        const data = await response.json();
        setRepositories(data.repositories || []);
        setCategories(data.categories || {});
      } catch (error) {
        console.error('Failed to load repository data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredAndSortedRepositories = useMemo(() => {
    let filtered = repositories.filter(repo => {
      const matchesSearch = searchTerm === '' || 
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || repo.category === selectedCategory;
      const matchesLanguage = selectedLanguage === 'all' || repo.language === selectedLanguage;

      return matchesSearch && matchesCategory && matchesLanguage;
    });

    // Sort repositories
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime();
        case 'stars':
          return b.stars - a.stars;
        case 'forks':
          return b.forks - a.forks;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [repositories, searchTerm, selectedCategory, selectedLanguage, sortBy]);

  const languages = useMemo(() => {
    const langSet = new Set(repositories.map(repo => repo.language).filter(Boolean));
    return Array.from(langSet).sort();
  }, [repositories]);

  const getLanguageIcon = (language: string) => {
    const icons: Record<string, string> = {
      'JavaScript': '🟨',
      'TypeScript': '🔷',
      'Python': '🐍',
      'Java': '☕',
      'C#': '🔷',
      'C++': '⚙️',
      'Go': '🐹',
      'Rust': '🦀',
      'PHP': '🐘',
      'Ruby': '💎',
      'Swift': '🍎',
      'Kotlin': '🎯',
      'HTML': '🌐',
      'CSS': '🎨',
      'Shell': '📟',
      'PowerShell': '💻',
      'Batch': '📝'
    };
    return icons[language] || '📄';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'mcp_servers': '🔌',
      'ai_ml_tools': '🤖',
      'web_scraping': '🕷️',
      'development_utilities': '🛠️',
      'security_tools': '🔒',
      'mobile_development': '📱',
      'documentation': '📚',
      'gaming': '🎮',
      'system_utilities': '⚙️',
      'other': '📦'
    };
    return icons[category] || '📦';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Layout title="Search Repositories" description="Search through all repositories">
        <div className="container margin-vert--lg">
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading repository data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Search Repositories" description="Search through all repositories">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--12 text--center margin-bottom--lg">
            <Heading as="h1">🔍 Search Repositories</Heading>
            <p>Search through all {repositories.length} repositories by name, description, language, or category</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <div className={styles.searchIcon}>🔍</div>
          </div>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label htmlFor="category-filter">Category:</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Categories</option>
                {Object.entries(categories).map(([key, category]) => (
                  <option key={key} value={key}>
                    {getCategoryIcon(key)} {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="language-filter">Language:</label>
              <select
                id="language-filter"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {getLanguageIcon(lang)} {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="sort-filter">Sort by:</label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="updated">Last Updated</option>
                <option value="stars">Stars</option>
                <option value="forks">Forks</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className={styles.resultsSummary}>
          <p>
            Found <strong>{filteredAndSortedRepositories.length}</strong> repositories
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in ${categories[selectedCategory]?.name}`}
            {selectedLanguage !== 'all' && ` written in ${selectedLanguage}`}
          </p>
        </div>

        {/* Results Grid */}
        <div className={styles.resultsGrid}>
          {filteredAndSortedRepositories.map(repo => (
            <div key={repo.name} className={styles.repoCard}>
              <div className={styles.repoHeader}>
                <div>
                  <h3 className={styles.repoTitle}>
                    <a href={repo.url} target="_blank" rel="noopener noreferrer">
                      {repo.name}
                    </a>
                  </h3>
                  <div className={styles.repoMeta}>
                    <span className={`badge ${styles.languageBadge} ${styles[`language-${repo.language.toLowerCase().replace('#', '').replace(/\s+/g, '-')}`]}`}>
                      {getLanguageIcon(repo.language)} {repo.language}
                    </span>
                    <span className={`badge ${styles.categoryBadge}`}>
                      {getCategoryIcon(repo.category)} {categories[repo.category]?.name}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={styles.repoBody}>
                <p className={styles.repoDescription}>{repo.description}</p>
                
                {repo.topics.length > 0 && (
                  <div className={styles.topics}>
                    {repo.topics.slice(0, 5).map(topic => (
                      <span key={topic} className={styles.topic}>{topic}</span>
                    ))}
                    {repo.topics.length > 5 && <span className={styles.topic}>+{repo.topics.length - 5}</span>}
                  </div>
                )}
              </div>

              <div className={styles.repoStats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>⭐ {repo.stars}</span>
                  <span className={styles.statLabel}>Stars</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>🔀 {repo.forks}</span>
                  <span className={styles.statLabel}>Forks</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>📅 {formatDate(repo.last_updated)}</span>
                  <span className={styles.statLabel}>Updated</span>
                </div>
              </div>

              <div className={styles.repoFooter}>
                <Link to={repo.url} className="button button--primary button--block">
                  View Repository →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedRepositories.length === 0 && (
          <div className={styles.noResults}>
            <h3>No repositories found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default SearchPage;
