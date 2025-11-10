// Statistics dashboard component
import React from 'react';
import { Archive, Star, Code, TrendingUp } from 'lucide-react';
import { RepositoryWithScore } from '../lib/github-api';
import { formatNumber, cn } from '../lib/utils';

interface StatisticsDashboardProps {
  repositories: RepositoryWithScore[];
}

export function StatisticsDashboard({ repositories }: StatisticsDashboardProps) {
  // Calculate statistics
  const totalRepos = repositories.length;
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const uniqueLanguages = new Set(repositories.map(repo => repo.language).filter(Boolean)).size;
  const avgQualityScore = totalRepos > 0 
    ? repositories.reduce((sum, repo) => sum + repo.qualityScore, 0) / totalRepos 
    : 0;

  // Language distribution
  const languageCounts = repositories.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topLanguages = Object.entries(languageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Category distribution
  const categoryCounts = repositories.reduce((acc, repo) => {
    if (Array.isArray(repo.categories)) {
      repo.categories.forEach(category => {
        acc[category] = (acc[category] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Quality score distribution
  const qualityRanges = {
    high: repositories.filter(repo => repo.qualityScore >= 8).length,
    medium: repositories.filter(repo => repo.qualityScore >= 4 && repo.qualityScore < 8).length,
    low: repositories.filter(repo => repo.qualityScore < 4).length,
  };

  const stats = [
    {
      icon: Archive,
      label: 'Total Repositories',
      value: totalRepos.toString(),
      color: 'text-primary-500',
      bgColor: 'bg-primary-50 dark:bg-dark-primary-50',
    },
    {
      icon: Star,
      label: 'Total Stars',
      value: formatNumber(totalStars),
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: Code,
      label: 'Languages',
      value: uniqueLanguages.toString(),
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      icon: TrendingUp,
      label: 'Avg Quality Score',
      value: avgQualityScore.toFixed(1),
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="bg-bg-page dark:bg-dark-bg-page py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={cn(
                  "bg-bg-surface dark:bg-dark-bg-surface",
                  "border border-neutral-200 dark:border-dark-neutral-200",
                  "rounded-xl p-6 transition-all duration-300",
                  "hover:shadow-md hover:-translate-y-1"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600 dark:text-dark-neutral-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-neutral-900 dark:text-dark-neutral-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    stat.bgColor
                  )}>
                    <Icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Distributions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Languages */}
          <div className="bg-bg-surface dark:bg-dark-bg-surface border border-neutral-200 dark:border-dark-neutral-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-neutral-900 mb-4">
              Top Languages
            </h3>
            <div className="space-y-3">
              {topLanguages.map(([language, count], index) => {
                const percentage = (count / totalRepos) * 100;
                return (
                  <div key={language}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-neutral-700 dark:text-dark-neutral-700">
                        {language}
                      </span>
                      <span className="text-sm text-neutral-500 dark:text-dark-neutral-500">
                        {count} repos
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-dark-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-bg-surface dark:bg-dark-bg-surface border border-neutral-200 dark:border-dark-neutral-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-neutral-900 mb-4">
              Top Categories
            </h3>
            <div className="space-y-3">
              {topCategories.map(([category, count], index) => {
                const percentage = (count / totalRepos) * 100;
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-neutral-700 dark:text-dark-neutral-700">
                        {category}
                      </span>
                      <span className="text-sm text-neutral-500 dark:text-dark-neutral-500">
                        {count} repos
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-dark-neutral-200 rounded-full h-2">
                      <div
                        className="bg-info h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quality Distribution */}
          <div className="bg-bg-surface dark:bg-dark-bg-surface border border-neutral-200 dark:border-dark-neutral-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-neutral-900 mb-4">
              Quality Distribution
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full" />
                  <span className="text-sm text-neutral-700 dark:text-dark-neutral-700">
                    High Quality (8-10)
                  </span>
                </div>
                <span className="text-sm font-medium text-neutral-900 dark:text-dark-neutral-900">
                  {qualityRanges.high} repos
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-warning rounded-full" />
                  <span className="text-sm text-neutral-700 dark:text-dark-neutral-700">
                    Medium Quality (4-7)
                  </span>
                </div>
                <span className="text-sm font-medium text-neutral-900 dark:text-dark-neutral-900">
                  {qualityRanges.medium} repos
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-error rounded-full" />
                  <span className="text-sm text-neutral-700 dark:text-dark-neutral-700">
                    Low Quality (1-3)
                  </span>
                </div>
                <span className="text-sm font-medium text-neutral-900 dark:text-dark-neutral-900">
                  {qualityRanges.low} repos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
