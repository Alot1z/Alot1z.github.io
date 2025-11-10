/**
 * Privacy Status Indicator
 * Shows users that data stays in their browser
 */

import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function PrivacyStatusIndicator() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {/* Privacy Badge */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowDetails(true)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full',
            'bg-green-50 dark:bg-green-900/20',
            'border border-green-200 dark:border-green-800',
            'hover:bg-green-100 dark:hover:bg-green-900/30',
            'transition-all shadow-lg'
          )}
        >
          <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-900 dark:text-green-100">
            100% Private
          </span>
          <Info className="w-3 h-3 text-green-600 dark:text-green-400" />
        </button>
      </div>

      {/* Privacy Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Privacy & Security
                </h2>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* What's Stored Locally */}
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  What's Stored in Your Browser
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>API keys (encrypted with Web Crypto API)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>Analysis results cache (IndexedDB)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>User preferences (theme, filters)</span>
                  </li>
                </ul>
              </div>

              {/* What Never Leaves Browser */}
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  What Never Leaves Your Browser
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>Your API keys (never sent to our servers)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>Repository analysis results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span>User search history</span>
                  </li>
                </ul>
              </div>

              {/* Direct API Calls */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Direct Browser-to-API Communication
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  All LLM analysis requests go directly from your browser to OpenAI/Anthropic. 
                  We never see your API keys or analysis content.
                </p>
              </div>

              {/* Clear Data */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Clear All Data
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  You can clear all locally stored data at any time from your browser settings 
                  or by using the clear data option in app settings.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-700">
              <button
                onClick={() => setShowDetails(false)}
                className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
