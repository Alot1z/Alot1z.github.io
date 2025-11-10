// App header component with theme toggle and API key management
import React from 'react';
import { Moon, Sun, Key } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

interface HeaderProps {
  onAPIKeyClick?: () => void;
  hasAPIKey?: boolean;
}

export function Header({ onAPIKeyClick, hasAPIKey }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo/Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              GitHub Stars Explorer
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* API Key Button */}
            {onAPIKeyClick && (
              <button
                onClick={onAPIKeyClick}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300",
                  "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500",
                  hasAPIKey && "bg-green-50 dark:bg-green-900/20"
                )}
                aria-label="Manage API Key"
              >
                <Key className={cn(
                  "w-5 h-5",
                  hasAPIKey ? "text-green-600 dark:text-green-400" : "text-neutral-700 dark:text-neutral-300"
                )} />
                <span className="hidden sm:inline text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  API Key
                </span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-lg transition-all duration-300",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                "focus:outline-none focus:ring-2 focus:ring-primary-500"
              )}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              ) : (
                <Sun className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
