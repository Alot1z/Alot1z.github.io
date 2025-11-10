import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RepositoryWithScore, GitHubAPI } from './github-api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return '1 day ago';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }
}

export function getQualityScoreColor(score: number): string {
  if (score >= 8) return 'text-success';
  if (score >= 4) return 'text-warning';
  return 'text-error';
}

export function getQualityScoreBg(score: number): string {
  if (score >= 8) return 'bg-success/10 text-success';
  if (score >= 4) return 'bg-warning/10 text-warning';
  return 'bg-error/10 text-error';
}

export function sortRepositories(
  repos: RepositoryWithScore[],
  sortBy: 'name' | 'stars' | 'updated' | 'quality'
): RepositoryWithScore[] {
  const sorted = [...repos];
  
  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'stars':
      return sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
    case 'updated':
      return sorted.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    case 'quality':
      return sorted.sort((a, b) => b.qualityScore - a.qualityScore);
    default:
      return sorted;
  }
}

export function filterRepositories(
  repos: RepositoryWithScore[],
  filters: {
    search?: string;
    categories?: string[];
    languages?: string[];
    qualityMin?: number;
    qualityMax?: number;
  }
): RepositoryWithScore[] {
  return repos.filter(repo => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        repo.name.toLowerCase().includes(searchTerm) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm)) ||
        repo.topics.some(topic => topic.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }
    
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      const hasMatchingCategory = filters.categories.some(category =>
        repo.categories.includes(category)
      );
      if (!hasMatchingCategory) return false;
    }
    
    // Language filter
    if (filters.languages && filters.languages.length > 0) {
      if (!repo.language || !filters.languages.includes(repo.language)) {
        return false;
      }
    }
    
    // Quality score filter
    if (filters.qualityMin !== undefined && repo.qualityScore < filters.qualityMin) {
      return false;
    }
    if (filters.qualityMax !== undefined && repo.qualityScore > filters.qualityMax) {
      return false;
    }
    
    return true;
  });
}

export function processRepositories(repos: any[]): RepositoryWithScore[] {
  return repos.map(repo => {
    const qualityScore = GitHubAPI.calculateQualityScore(repo);
    const categories = GitHubAPI.categorizeRepository(repo);
    
    return {
      ...repo,
      qualityScore,
      categories
    } as RepositoryWithScore;
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
