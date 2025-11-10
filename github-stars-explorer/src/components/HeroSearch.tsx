// Hero search section component
import React, { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeroSearchProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export function HeroSearch({ onSearch, isLoading, error }: HeroSearchProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  const handleExampleClick = () => {
    const exampleUsername = 'Alot1z';
    setInput(exampleUsername);
    onSearch(exampleUsername);
  };

  return (
    <section className="bg-neutral-50 dark:bg-neutral-900 py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Explore Your
            <span className="text-primary-500 dark:text-primary-400"> GitHub Stars</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-neutral-700 dark:text-neutral-300 mb-12 max-w-2xl mx-auto">
            Transform your chaotic starred repositories into an organized, searchable interface with smart categorization and quality scoring.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter GitHub username (e.g., octocat) or paste full URL"
                  className={cn(
                    "w-full pl-12 pr-4 py-4 text-lg",
                    "border-2 rounded-xl transition-all duration-300",
                    "bg-white dark:bg-neutral-800",
                    "border-neutral-200 dark:border-neutral-600",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                    "placeholder-neutral-500 dark:placeholder-neutral-400",
                    "text-neutral-900 dark:text-neutral-100"
                  )}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300",
                  "bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700",
                  "text-white",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                  "flex items-center justify-center space-x-2"
                )}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Explore</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Error Message */}
            {error && (
              <p className="text-error text-sm mt-4 max-w-2xl mx-auto">
                {error}
              </p>
            )}
          </form>

          {/* Example Link */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <span>Try it with:</span>
            <button
              onClick={handleExampleClick}
              className="flex items-center space-x-2 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 underline underline-offset-4 transition-colors"
            >
              <span className="font-mono">github.com/Alot1z?tab=stars</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-700">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Smart Categorization</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                AI-powered categorization of your repositories by technology and purpose
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Quality Scoring</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Automatic quality assessment based on stars, activity, and maintenance
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Advanced Filtering</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Find exactly what you need with powerful search and filter options
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
