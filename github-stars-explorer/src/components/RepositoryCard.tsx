// Repository card component
import React from 'react';
import { Star, GitFork, Calendar, ExternalLink, Tag, Sparkles } from 'lucide-react';
import { RepositoryWithScore } from '../lib/github-api';
import { formatNumber, formatDate, getQualityScoreBg, cn } from '../lib/utils';
import { LANGUAGE_COLORS } from '../lib/github-api';

interface RepositoryCardProps {
  repository: RepositoryWithScore;
  onClick: (repo: RepositoryWithScore) => void;
  onAnalyze?: (repo: RepositoryWithScore) => void;
  hasAnalysis?: boolean;
}

export function RepositoryCard({ repository, onClick, onAnalyze, hasAnalysis }: RepositoryCardProps) {
  const languageColor = repository.language ? LANGUAGE_COLORS[repository.language] : '#6B7280';

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger onClick when clicking the analyze button
    const target = e.target as HTMLElement;
    if (target.closest('button[data-analyze-button]')) {
      return;
    }
    onClick(repository);
  };

  const handleAnalyzeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAnalyze) {
      onAnalyze(repository);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group cursor-pointer",
        "bg-bg-surface dark:bg-dark-bg-surface",
        "border border-neutral-200 dark:border-dark-neutral-200",
        "rounded-xl p-6 transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]",
        "hover:border-primary-100 dark:hover:border-dark-primary-100",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      )}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-heading font-semibold text-neutral-900 dark:text-dark-neutral-900 group-hover:text-primary-500 dark:group-hover:text-dark-primary-500 transition-colors line-clamp-1">
          {repository.name}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-dark-neutral-500 flex-shrink-0 ml-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span className="font-medium">{formatNumber(repository.stargazers_count)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitFork className="w-4 h-4" />
            <span className="font-medium">{formatNumber(repository.forks_count)}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {repository.description && (
        <p className="text-body-lg text-neutral-700 dark:text-dark-neutral-700 mb-4 line-clamp-2">
          {repository.description}
        </p>
      )}

      {/* Language Badge */}
      {repository.language && (
        <div className="flex items-center space-x-2 mb-4">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: languageColor }}
          />
          <span className="text-sm text-neutral-600 dark:text-dark-neutral-600">
            {repository.language}
          </span>
        </div>
      )}

      {/* Footer Row */}
      <div className="flex items-center justify-between">
        {/* Quality Score */}
        <div className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
          getQualityScoreBg(repository.qualityScore)
        )}>
          <span>Quality: {repository.qualityScore.toFixed(1)}/10</span>
        </div>

        {/* Categories */}
        {repository.categories && repository.categories.length > 0 && (
          <div className="flex items-center space-x-1">
            {repository.categories.slice(0, 2).map((category) => (
              <span
                key={category}
                className="inline-flex items-center px-2 py-1 bg-primary-50 dark:bg-dark-primary-50 text-primary-700 dark:text-dark-primary-700 text-xs font-medium rounded-md"
              >
                {category}
              </span>
            ))}
            {repository.categories.length > 2 && (
              <span className="text-xs text-neutral-500 dark:text-dark-neutral-500">
                +{repository.categories.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Last Updated */}
      <div className="flex items-center space-x-1 mt-4 text-xs text-neutral-500 dark:text-dark-neutral-500">
        <Calendar className="w-3 h-3" />
        <span>Updated {formatDate(repository.updated_at)}</span>
      </div>

      {/* Topics Preview */}
      {repository.topics && repository.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {repository.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center px-2 py-1 bg-neutral-100 dark:bg-dark-neutral-100 text-neutral-600 dark:text-dark-neutral-600 text-xs rounded"
            >
              {topic}
            </span>
          ))}
          {repository.topics.length > 3 && (
            <span className="text-xs text-neutral-500 dark:text-dark-neutral-500">
              +{repository.topics.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* AI Analysis Button */}
      {onAnalyze && (
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-dark-neutral-200">
          <button
            data-analyze-button
            onClick={handleAnalyzeClick}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all font-medium",
              hasAnalysis
                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                : "bg-primary-500 hover:bg-primary-600 text-white"
            )}
          >
            <Sparkles className="w-4 h-4" />
            <span>{hasAnalysis ? 'View Analysis' : 'Analyze with AI'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
