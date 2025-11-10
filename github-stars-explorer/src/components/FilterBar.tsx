// Filter bar component for advanced filtering
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { RepositoryWithScore } from '../lib/github-api';
import { cn, debounce } from '../lib/utils';

interface FilterBarProps {
  repositories: RepositoryWithScore[];
  searchTerm: string;
  onSearchChange: (search: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  selectedLanguages: string[];
  onLanguageToggle: (language: string) => void;
  qualityRange: [number, number];
  onQualityRangeChange: (range: [number, number]) => void;
  sortBy: 'name' | 'stars' | 'updated' | 'quality';
  onSortChange: (sort: 'name' | 'stars' | 'updated' | 'quality') => void;
  onClearFilters: () => void;
}

export function FilterBar({
  repositories,
  searchTerm,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  selectedLanguages,
  onLanguageToggle,
  qualityRange,
  onQualityRangeChange,
  sortBy,
  onSortChange,
  onClearFilters,
}: FilterBarProps) {
  // Extract unique categories and languages
  const allCategories = Array.from(
    new Set(repositories.flatMap(repo => 
      Array.isArray(repo.categories) ? repo.categories : []
    ))
  ).sort();

  const allLanguages = Array.from(
    new Set(repositories.map(repo => repo.language).filter(Boolean))
  ).sort() as string[];

  // Create debounced search handler
  const debouncedSearch = React.useMemo(
    () => debounce((value: string) => onSearchChange(value), 300),
    [onSearchChange]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedLanguages.length > 0 ||
    qualityRange[0] > 1 || qualityRange[1] < 10 || searchTerm.length > 0;

  return (
    <div className="sticky top-16 z-40 bg-bg-elevated dark:bg-dark-bg-elevated border-b border-neutral-200 dark:border-dark-neutral-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col space-y-4">
          {/* First Row: Search and Sort */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500 dark:text-dark-neutral-500" />
              <input
                type="text"
                placeholder="Search repositories..."
                defaultValue={searchTerm}
                onChange={handleSearchChange}
                className={cn(
                  "w-full pl-10 pr-4 py-2 text-sm",
                  "border border-neutral-200 dark:border-dark-neutral-200",
                  "rounded-lg transition-all duration-200",
                  "bg-bg-page dark:bg-dark-bg-page",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                  "placeholder-neutral-500 dark:placeholder-dark-neutral-500"
                )}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral-600 dark:text-dark-neutral-600 whitespace-nowrap">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any)}
                className={cn(
                  "px-3 py-2 text-sm border rounded-lg",
                  "border-neutral-200 dark:border-dark-neutral-200",
                  "bg-bg-page dark:bg-dark-bg-page",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                )}
              >
                <option value="updated">Recently Updated</option>
                <option value="stars">Most Stars</option>
                <option value="quality">Quality Score</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 text-sm",
                  "text-neutral-600 dark:text-dark-neutral-600",
                  "hover:text-error dark:hover:text-dark-semantic-error",
                  "transition-colors"
                )}
              >
                <X className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Second Row: Category and Language Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Categories */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Filter className="w-4 h-4 text-neutral-500 dark:text-dark-neutral-500" />
                <span className="text-sm font-medium text-neutral-700 dark:text-dark-neutral-700">
                  Categories
                </span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryToggle(category)}
                    className={cn(
                      "px-3 py-1 text-sm rounded-lg transition-all duration-200",
                      "border",
                      selectedCategories.includes(category)
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-bg-page dark:bg-dark-bg-page text-neutral-700 dark:text-dark-neutral-700 border-neutral-200 dark:border-dark-neutral-200 hover:bg-primary-50 dark:hover:bg-dark-primary-50"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-dark-neutral-700">
                  Languages
                </span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {allLanguages.slice(0, 8).map((language) => (
                  <button
                    key={language}
                    onClick={() => onLanguageToggle(language)}
                    className={cn(
                      "px-3 py-1 text-sm rounded-lg transition-all duration-200",
                      "border",
                      selectedLanguages.includes(language)
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-bg-page dark:bg-dark-bg-page text-neutral-700 dark:text-dark-neutral-700 border-neutral-200 dark:border-dark-neutral-200 hover:bg-primary-50 dark:hover:bg-dark-primary-50"
                    )}
                  >
                    {language}
                  </button>
                ))}
                {allLanguages.length > 8 && (
                  <span className="text-xs text-neutral-500 dark:text-dark-neutral-500 px-2 py-1">
                    +{allLanguages.length - 8} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Third Row: Quality Score Range */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-neutral-700 dark:text-dark-neutral-700 min-w-0">
              Quality Score:
            </span>
            <div className="flex items-center space-x-2 flex-1">
              <span className="text-sm text-neutral-500 dark:text-dark-neutral-500">
                {qualityRange[0]}
              </span>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={qualityRange[0]}
                onChange={(e) => onQualityRangeChange([Number(e.target.value), qualityRange[1]])}
                className="flex-1"
              />
              <span className="text-sm text-neutral-500 dark:text-dark-neutral-500">
                {qualityRange[1]}
              </span>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={qualityRange[1]}
                onChange={(e) => onQualityRangeChange([qualityRange[0], Number(e.target.value)])}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
