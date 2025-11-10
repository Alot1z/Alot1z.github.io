// GitHub API integration utilities
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  pushed_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface RepositoryWithScore extends GitHubRepository {
  qualityScore: number;
  categories: string[];
}

export const CATEGORIES = {
  'AI/ML': [
    'ai', 'artificial-intelligence', 'machine-learning', 'deep-learning',
    'neural-networks', 'tensorflow', 'pytorch', 'keras', 'openai', 'llm',
    'nlp', 'computer-vision', 'gpt', 'bert', 'transformers', 'data-science',
    'analytics', 'scikit-learn', 'pandas', 'numpy', 'jupyter', 'notebook'
  ],
  'Web Development': [
    'javascript', 'typescript', 'react', 'vue', 'angular', 'nextjs', 'nuxt',
    'svelte', 'nodejs', 'express', 'web', 'frontend', 'backend', 'fullstack',
    'css', 'html', 'sass', 'less', 'webpack', 'vite', 'parcel', 'tailwind',
    'bootstrap', 'material-ui', 'ant-design', 'chakra-ui', 'styled-components'
  ],
  'Security': [
    'security', 'cybersecurity', 'encryption', 'authentication', 'authorization',
    'oauth', 'jwt', 'cors', 'csrf', 'xss', 'sql-injection', 'penetration-testing',
    'vulnerability', 'malware', 'firewall', 'vpn', 'ssl', 'https', 'pentest'
  ],
  'DevOps': [
    'devops', 'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins',
    'github-actions', 'gitlab-ci', 'ci-cd', 'deployment', 'monitoring',
    'prometheus', 'grafana', 'elk', 'logging', 'metrics', 'infrastructure',
    'automation', 'orchestration', 'microservices'
  ],
  'Mobile Development': [
    'mobile', 'ios', 'android', 'react-native', 'flutter', 'xamarin', 'ionic',
    'swift', 'kotlin', 'java', 'objective-c', 'dart', 'app-store', 'google-play'
  ],
  'Data Science': [
    'data-science', 'big-data', 'analytics', 'statistics', 'visualization',
    'd3', 'plotly', 'matplotlib', 'seaborn', 'tableau', 'powerbi', 'hadoop',
    'spark', 'kafka', 'elasticsearch', 'mongodb', 'postgresql', 'mysql'
  ],
  'Game Development': [
    'game', 'gaming', 'unity', 'unreal', 'godot', 'phaser', 'threejs',
    'webgl', 'opengl', 'directx', 'vulkan', 'game-engine', '2d', '3d'
  ],
  'Tools & Utilities': [
    'cli', 'command-line', 'utility', 'tools', 'productivity', 'automation',
    'scripts', 'macros', 'extensions', 'plugins', 'bundler', 'linter', 'formatter'
  ]
};

export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  Go: '#00add8',
  Rust: '#ce422b',
  Java: '#f89820',
  Kotlin: '#7f52ff',
  Swift: '#fa7343',
  PHP: '#777bb4',
  Ruby: '#cc342d',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Dart: '#0175c2',
  HTML: '#e34f26',
  CSS: '#1572b6',
  SCSS: '#c6538c',
  Sass: '#a53b70',
  Vue: '#4fc08d',
  React: '#61dafb',
  Angular: '#dd0031',
  Svelte: '#ff3e00',
  Nodejs: '#68a063',
  Shell: '#89e051'
};

export class GitHubAPI {
  private static readonly BASE_URL = 'https://api.github.com';
  private static readonly REPO_PER_PAGE = 100;

  static async fetchUserStars(username: string): Promise<GitHubRepository[]> {
    const repos: GitHubRepository[] = [];
    let page = 1;
    
    try {
      // First, check if user exists and get rate limit info
      const userResponse = await fetch(`${this.BASE_URL}/users/${username}`);
      if (!userResponse.ok) {
        throw new Error(`User "${username}" not found`);
      }

      // Fetch all starred repositories
      while (true) {
        const response = await fetch(
          `${this.BASE_URL}/users/${username}/starred?per_page=${this.REPO_PER_PAGE}&page=${page}`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        if (!response.ok) {
          if (response.status === 422) {
            // User has no starred repositories
            break;
          }
          throw new Error(`Failed to fetch repositories: ${response.statusText}`);
        }

        const data: GitHubRepository[] = await response.json();
        
        if (data.length === 0) {
          break;
        }

        repos.push(...data);
        page++;

        // GitHub API rate limit handling
        if (data.length < this.REPO_PER_PAGE) {
          break;
        }
      }

      return repos;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch starred repositories');
    }
  }

  static extractUsername(input: string): string {
    // Handle full GitHub URLs
    const urlMatch = input.match(/github\.com\/([^\/\s]+)/);
    if (urlMatch) {
      return urlMatch[1];
    }

    // Handle direct username input
    return input.trim().replace(/^@/, '');
  }

  static calculateQualityScore(repo: GitHubRepository): number {
    const stars = repo.stargazers_count;
    const forks = repo.forks_count;
    const now = new Date();
    const lastUpdate = new Date(repo.updated_at);
    const daysSinceUpdate = Math.max(1, (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Base score from stars (0-4 points)
    const starScore = Math.min(4, Math.log10(stars + 1));
    
    // Forks contribution (0-2 points)
    const forkScore = Math.min(2, Math.log10(forks + 1) * 0.5);
    
    // Recency score (0-2 points)
    let recencyScore = 0;
    if (daysSinceUpdate < 30) recencyScore = 2;
    else if (daysSinceUpdate < 90) recencyScore = 1.5;
    else if (daysSinceUpdate < 365) recencyScore = 1;
    else if (daysSinceUpdate < 730) recencyScore = 0.5;
    
    // Has description bonus (1 point)
    const descriptionScore = repo.description ? 1 : 0;
    
    // Topics bonus (1 point if has more than 2 topics)
    const topicScore = repo.topics && repo.topics.length > 2 ? 1 : 0;
    
    return Math.min(10, Math.max(1, starScore + forkScore + recencyScore + descriptionScore + topicScore));
  }

  static categorizeRepository(repo: GitHubRepository): string[] {
    const categories: string[] = [];
    const topics = repo.topics || [];
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    const language = (repo.language || '').toLowerCase();
    
    // Search in all text fields
    const searchText = `${name} ${description} ${topics.join(' ')} ${language}`.toLowerCase();
    
    for (const [category, keywords] of Object.entries(CATEGORIES)) {
      if (keywords.some(keyword => searchText.includes(keyword))) {
        categories.push(category);
      }
    }
    
    // If no categories found, try language-based classification
    if (categories.length === 0) {
      if (['javascript', 'typescript', 'html', 'css'].includes(language)) {
        categories.push('Web Development');
      } else if (['python', 'r', 'scala'].includes(language)) {
        categories.push('Data Science');
      }
    }
    
    return categories.length > 0 ? categories : ['Other'];
  }
}
