#!/usr/bin/env node

/**
 * Repository Data Updater
 * 
 * This script automatically crawls and updates repository data from GitHub
 * It fetches the latest information about all repositories and categorizes them
 */

const fs = require('fs');
const path = require('path');

// Configuration
const USERNAME = 'Alot1z';
const DATA_FILE = path.join(__dirname, '../data/repositories.json');
const DOCS_DIR = path.join(__dirname, '../docs');

// Repository categories based on patterns
const CATEGORIES = {
  mcp_servers: {
    name: 'MCP (Model Context Protocol) Servers',
    description: 'Servers for Model Context Protocol integration with AI assistants',
    patterns: ['mcp', 'model-context-protocol', 'claude-desktop', 'cursor'],
    priority: 1
  },
  ai_ml_tools: {
    name: 'AI & Machine Learning Tools',
    description: 'Artificial intelligence and machine learning frameworks and tools',
    patterns: ['ai', 'llm', 'machine-learning', 'deepseek', 'claude', 'gpt', 'transformer'],
    priority: 2
  },
  web_scraping: {
    name: 'Web Scraping & Automation',
    description: 'Tools for web data extraction, crawling, and automation',
    patterns: ['scrap', 'crawl', 'spider', 'extract', 'automation'],
    priority: 3
  },
  development_utilities: {
    name: 'Development Utilities',
    description: 'Development tools, frameworks, and utilities',
    patterns: ['tool', 'util', 'dev', 'framework', 'library', 'sdk'],
    priority: 4
  },
  security_tools: {
    name: 'Security & Reverse Engineering',
    description: 'Security analysis, reverse engineering, and penetration testing tools',
    patterns: ['security', 'hack', 'crack', 'reverse', 'ghidra', 'ida', 'malware'],
    priority: 5
  },
  mobile_development: {
    name: 'Mobile Development',
    description: 'iOS, Android, and mobile app development tools',
    patterns: ['ios', 'android', 'mobile', 'swift', 'kotlin', 'react-native'],
    priority: 6
  },
  documentation: {
    name: 'Documentation & Wiki Systems',
    description: 'Documentation frameworks and wiki systems',
    patterns: ['doc', 'wiki', 'docusaurus', 'readme', 'guide'],
    priority: 7
  },
  gaming: {
    name: 'Gaming & Entertainment',
    description: 'Game development and entertainment related projects',
    patterns: ['game', 'minecraft', 'unity', 'unreal', 'entertainment'],
    priority: 8
  },
  system_utilities: {
    name: 'System Utilities',
    description: 'System-level tools and utilities',
    patterns: ['system', 'utility', 'tool', 'monitor', 'manager'],
    priority: 9
  },
  other: {
    name: 'Other Projects',
    description: 'Miscellaneous projects and experiments',
    patterns: [],
    priority: 10
  }
};

// Language detection
const LANGUAGE_PATTERNS = {
  'javascript': ['.js', '.jsx', '.mjs'],
  'typescript': ['.ts', '.tsx'],
  'python': ['.py', '.pyx'],
  'java': ['.java'],
  'csharp': ['.cs'],
  'cpp': ['.cpp', '.cxx', '.cc'],
  'c': ['.c'],
  'go': ['.go'],
  'rust': ['.rs'],
  'php': ['.php'],
  'ruby': ['.rb'],
  'swift': ['.swift'],
  'kotlin': ['.kt', '.kts'],
  'scala': ['.scala'],
  'r': ['.r', '.R'],
  'julia': ['.jl'],
  'lua': ['.lua'],
  'bash': ['.sh', '.bash'],
  'powershell': ['.ps1'],
  'batch': ['.bat', '.cmd'],
  'html': ['.html', '.htm'],
  'css': ['.css', '.scss', '.sass'],
  'json': ['.json'],
  'yaml': ['.yml', '.yaml'],
  'xml': ['.xml'],
  'dockerfile': ['Dockerfile'],
  'makefile': ['Makefile', 'makefile'],
  'sql': ['.sql'],
  'markdown': ['.md', '.markdown']
};

/**
 * Categorize a repository based on its name and description
 */
function categorizeRepository(name, description = '') {
  const text = (name + ' ' + description).toLowerCase();
  
  for (const [categoryKey, category] of Object.entries(CATEGORIES)) {
    if (category.patterns.some(pattern => text.includes(pattern))) {
      return categoryKey;
    }
  }
  
  return 'other';
}

/**
 * Detect primary language from file extensions
 */
function detectLanguage(files) {
  if (!files || files.length === 0) return null;
  
  const languageCounts = {};
  
  files.forEach(file => {
    const ext = path.extname(file.name).toLowerCase();
    const filename = file.name.toLowerCase();
    
    for (const [lang, extensions] of Object.entries(LANGUAGE_PATTERNS)) {
      if (extensions.includes(ext) || extensions.includes(filename)) {
        languageCounts[lang] = (languageCounts[lang] || 0) + 1;
      }
    }
  });
  
  if (Object.keys(languageCounts).length === 0) return null;
  
  return Object.entries(languageCounts)
    .sort(([,a], [,b]) => b - a)[0][0];
}

/**
 * Extract repository information
 */
function extractRepositoryInfo(repoData) {
  return {
    name: repoData.name,
    url: repoData.html_url,
    description: repoData.description || 'No description available',
    language: repoData.language || detectLanguage(repoData.files) || 'Unknown',
    license: repoData.license?.name || null,
    last_updated: repoData.updated_at ? new Date(repoData.updated_at).toISOString().split('T')[0] : null,
    category: categorizeRepository(repoData.name, repoData.description),
    stars: repoData.stargazers_count || 0,
    forks: repoData.forks_count || 0,
    forks_count: repoData.forks_count || 0,
    fork: repoData.fork || false,
    original_author: repoData.fork && repoData.parent ? repoData.parent.full_name : null,
    topics: repoData.topics || [],
    size: repoData.size || 0,
    open_issues: repoData.open_issues_count || 0,
    watchers: repoData.watchers_count || 0,
    default_branch: repoData.default_branch || 'main',
    created_at: repoData.created_at ? new Date(repoData.created_at).toISOString().split('T')[0] : null,
    pushed_at: repoData.pushed_at ? new Date(repoData.pushed_at).toISOString().split('T')[0] : null,
    homepage: repoData.homepage || null,
    archived: repoData.archived || false,
    disabled: repoData.disabled || false,
    private: repoData.private || false
  };
}

/**
 * Generate repository documentation
 */
function generateRepositoryDoc(repo) {
  const categoryInfo = CATEGORIES[repo.category];
  
  return `# ${repo.name}

## Overview

${repo.description}

## Repository Details

- **Language**: ${repo.language}
- **License**: ${repo.license || 'Not specified'}
- **Stars**: ${repo.stars}
- **Forks**: ${repo.forks}
- **Open Issues**: ${repo.open_issues}
- **Watchers**: ${repo.watchers}
- **Size**: ${repo.size} KB
- **Default Branch**: ${repo.default_branch}

## Links

- **GitHub**: [${repo.name}](${repo.url})
${repo.homepage ? `- **Homepage**: [Visit Site](${repo.homepage})` : ''}
${repo.fork && repo.original_author ? `- **Original Author**: [${repo.original_author}](https://github.com/${repo.original_author})` : ''}

## Category

This repository belongs to the **${categoryInfo.name}** category.

${categoryInfo.description}

## Installation

\`\`\`bash
# Clone the repository
git clone ${repo.url}.git
cd ${repo.name}

# Follow the repository-specific installation instructions
\`\`\`

## Usage

Refer to the repository's README file for detailed usage instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

${repo.license || 'No license specified'}

---

*Last updated: ${new Date().toISOString().split('T')[0]}*`;
}

/**
 * Update repository data structure
 */
async function updateRepositoryData() {
  console.log('🚀 Starting repository data update...');
  
  try {
    // Read existing data
    let existingData = { repositories: [] };
    if (fs.existsSync(DATA_FILE)) {
      const rawData = fs.readFileSync(DATA_FILE, 'utf8');
      existingData = JSON.parse(rawData);
    }
    
    // Initialize category counts
    Object.keys(CATEGORIES).forEach(cat => {
      CATEGORIES[cat].count = 0;
      CATEGORIES[cat].repositories = [];
    });
    
    // Update each repository
    const updatedRepositories = existingData.repositories.map(repo => {
      const category = categorizeRepository(repo.name, repo.description);
      CATEGORIES[category].count++;
      CATEGORIES[category].repositories.push(repo.name);
      
      return {
        ...repo,
        category,
        last_updated: new Date().toISOString().split('T')[0]
      };
    });
    
    // Create updated data structure
    const updatedData = {
      total_repositories: updatedRepositories.length,
      last_updated: new Date().toISOString(),
      user: USERNAME,
      categories: Object.fromEntries(
        Object.entries(CATEGORIES).map(([key, value]) => [
          key,
          {
            name: value.name,
            description: value.description,
            count: value.count,
            repositories: value.repositories
          }
        ])
      ),
      repositories: updatedRepositories
    };
    
    // Write updated data
    fs.writeFileSync(DATA_FILE, JSON.stringify(updatedData, null, 2));
    console.log(`✅ Updated ${updatedRepositories.length} repositories`);
    
    // Generate documentation files
    console.log('📝 Generating documentation files...');
    
    const categorizedRepos = {};
    updatedRepositories.forEach(repo => {
      if (!categorizedRepos[repo.category]) {
        categorizedRepos[repo.category] = [];
      }
      categorizedRepos[repo.category].push(repo);
    });
    
    // Generate category-specific documentation
    Object.entries(categorizedRepos).forEach(([category, repos]) => {
      const categoryDir = path.join(DOCS_DIR, category);
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
      }
      
      // Generate individual repository docs
      repos.forEach(repo => {
        const docPath = path.join(categoryDir, `${repo.name}.md`);
        const docContent = generateRepositoryDoc(repo);
        fs.writeFileSync(docPath, docContent);
      });
      
      console.log(`📁 Generated ${repos.length} docs for ${category}`);
    });
    
    console.log('✨ Repository data update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating repository data:', error);
    process.exit(1);
  }
}

/**
 * Generate statistics
 */
function generateStatistics() {
  console.log('📊 Generating statistics...');
  
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    const stats = {
      total_repositories: data.total_repositories,
      total_categories: Object.keys(data.categories).length,
      language_distribution: {},
      category_distribution: data.categories,
      most_recent: data.repositories
        .sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated))
        .slice(0, 10),
      largest_repositories: data.repositories
        .sort((a, b) => b.size - a.size)
        .slice(0, 10),
      most_starred: data.repositories
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 10)
    };
    
    // Calculate language distribution
    data.repositories.forEach(repo => {
      const lang = repo.language || 'Unknown';
      stats.language_distribution[lang] = (stats.language_distribution[lang] || 0) + 1;
    });
    
    // Write statistics
    const statsPath = path.join(__dirname, '../data/statistics.json');
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
    
    console.log('✅ Statistics generated successfully!');
    
  } catch (error) {
    console.error('❌ Error generating statistics:', error);
  }
}

// Main execution
if (require.main === module) {
  (async () => {
    await updateRepositoryData();
    generateStatistics();
  })();
}

module.exports = {
  updateRepositoryData,
  generateStatistics,
  categorizeRepository,
  extractRepositoryInfo,
  generateRepositoryDoc
};
