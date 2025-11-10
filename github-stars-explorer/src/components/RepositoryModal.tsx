// Repository detail modal component
import React, { useEffect } from 'react';
import { X, Star, GitFork, Calendar, ExternalLink, Copy, Github } from 'lucide-react';
import { RepositoryWithScore } from '../lib/github-api';
import { formatDate, formatNumber, getQualityScoreBg, cn } from '../lib/utils';
import { LANGUAGE_COLORS } from '../lib/github-api';

interface RepositoryModalProps {
  repository: RepositoryWithScore | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RepositoryModal({ repository, isOpen, onClose }: RepositoryModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !repository) return null;

  const languageColor = repository.language ? LANGUAGE_COLORS[repository.language] : '#6B7280';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(repository.html_url);
    // You could add a toast notification here
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-2xl max-h-[90vh] overflow-y-auto",
        "bg-bg-elevated dark:bg-dark-bg-elevated",
        "rounded-2xl shadow-xl",
        "transform transition-all duration-300",
        "border border-neutral-200 dark:border-dark-neutral-200"
      )}>
        {/* Header */}
        <div className="sticky top-0 bg-bg-elevated dark:bg-dark-bg-elevated border-b border-neutral-200 dark:border-dark-neutral-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-neutral-900 mb-2">
                {repository.name}
              </h2>
              <p className="text-neutral-500 dark:text-dark-neutral-500 font-mono">
                {repository.full_name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-neutral-500 dark:text-dark-neutral-500 hover:text-neutral-700 dark:hover:text-dark-neutral-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {repository.description && (
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-neutral-900 mb-2">
                Description
              </h3>
              <p className="text-neutral-700 dark:text-dark-neutral-700 leading-relaxed">
                {repository.description}
              </p>
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-bg-surface dark:bg-dark-bg-surface rounded-lg">
              <Star className="w-6 h-6 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold text-neutral-900 dark:text-dark-neutral-900">
                {formatNumber(repository.stargazers_count)}
              </div>
              <div className="text-sm text-neutral-600 dark:text-dark-neutral-600">Stars</div>
            </div>
            
            <div className="text-center p-4 bg-bg-surface dark:bg-dark-bg-surface rounded-lg">
              <GitFork className="w-6 h-6 text-info mx-auto mb-2" />
              <div className="text-2xl font-bold text-neutral-900 dark:text-dark-neutral-900">
                {formatNumber(repository.forks_count)}
              </div>
              <div className="text-sm text-neutral-600 dark:text-dark-neutral-600">Forks</div>
            </div>

            <div className="text-center p-4 bg-bg-surface dark:bg-dark-bg-surface rounded-lg">
              <Calendar className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-neutral-900 dark:text-dark-neutral-900">
                {formatDate(repository.updated_at)}
              </div>
              <div className="text-sm text-neutral-600 dark:text-dark-neutral-600">Last Update</div>
            </div>

            <div className="text-center p-4 bg-bg-surface dark:bg-dark-bg-surface rounded-lg">
              <div className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2",
                getQualityScoreBg(repository.qualityScore)
              )}>
                {repository.qualityScore.toFixed(1)}/10
              </div>
              <div className="text-sm text-neutral-600 dark:text-dark-neutral-600">Quality Score</div>
            </div>
          </div>

          {/* Language and Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Language */}
            {repository.language && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-neutral-900 mb-3">
                  Language
                </h3>
                <div className="flex items-center space-x-3 p-3 bg-bg-surface dark:bg-dark-bg-surface rounded-lg">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: languageColor }}
                  />
                  <span className="font-medium text-neutral-900 dark:text-dark-neutral-900">
                    {repository.language}
                  </span>
                </div>
              </div>
            )}

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-neutral-900 mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {repository.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 bg-primary-50 dark:bg-dark-primary-50 text-primary-700 dark:text-dark-primary-700 text-sm font-medium rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Topics */}
          {repository.topics && repository.topics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-neutral-900 mb-3">
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {repository.topics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center px-3 py-1 bg-neutral-100 dark:bg-dark-neutral-100 text-neutral-700 dark:text-dark-neutral-700 text-sm rounded-lg"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Owner Info */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-neutral-900 mb-3">
              Owner
            </h3>
            <div className="flex items-center space-x-3 p-3 bg-bg-surface dark:bg-dark-bg-surface rounded-lg">
              <img
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-medium text-neutral-900 dark:text-dark-neutral-900">
                  {repository.owner.login}
                </div>
                <div className="text-sm text-neutral-500 dark:text-dark-neutral-500">
                  GitHub User
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-bg-elevated dark:bg-dark-bg-elevated border-t border-neutral-200 dark:border-dark-neutral-200 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 px-6 py-3",
                "bg-primary-500 hover:bg-primary-600 dark:bg-dark-primary-500 dark:hover:bg-dark-primary-600",
                "text-white font-semibold rounded-lg transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              )}
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            
            <button
              onClick={handleCopyUrl}
              className={cn(
                "flex items-center justify-center space-x-2 px-6 py-3",
                "border border-neutral-200 dark:border-dark-neutral-200",
                "text-neutral-700 dark:text-dark-neutral-700",
                "hover:bg-bg-surface dark:hover:bg-dark-bg-surface",
                "rounded-lg transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              )}
            >
              <Copy className="w-4 h-4" />
              <span>Copy URL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
