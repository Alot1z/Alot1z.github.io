// Loading skeleton component
import React from 'react';
import { cn } from '../lib/utils';

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-neutral-200 dark:bg-dark-neutral-200 rounded",
        className
      )}
    />
  );
}

export function RepositoryCardSkeleton() {
  return (
    <div className="bg-bg-surface dark:bg-dark-bg-surface border border-neutral-200 dark:border-dark-neutral-200 rounded-xl p-6">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <LoadingSkeleton className="h-6 w-2/3" />
        <div className="flex items-center space-x-4">
          <LoadingSkeleton className="h-4 w-12" />
          <LoadingSkeleton className="h-4 w-12" />
        </div>
      </div>

      {/* Description */}
      <LoadingSkeleton className="h-4 w-full mb-2" />
      <LoadingSkeleton className="h-4 w-3/4 mb-4" />

      {/* Language Badge */}
      <div className="flex items-center space-x-2 mb-4">
        <LoadingSkeleton className="h-3 w-3 rounded-full" />
        <LoadingSkeleton className="h-4 w-20" />
      </div>

      {/* Footer Row */}
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-6 w-24" />
        <div className="flex space-x-1">
          <LoadingSkeleton className="h-6 w-16" />
          <LoadingSkeleton className="h-6 w-16" />
        </div>
      </div>

      {/* Last Updated */}
      <LoadingSkeleton className="h-3 w-32 mt-4" />

      {/* Topics Preview */}
      <div className="flex space-x-1 mt-3">
        <LoadingSkeleton className="h-5 w-16" />
        <LoadingSkeleton className="h-5 w-20" />
        <LoadingSkeleton className="h-5 w-18" />
      </div>
    </div>
  );
}

export function StatisticsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="bg-bg-surface dark:bg-dark-bg-surface border border-neutral-200 dark:border-dark-neutral-200 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <LoadingSkeleton className="h-4 w-24 mb-2" />
              <LoadingSkeleton className="h-8 w-16" />
            </div>
            <LoadingSkeleton className="h-12 w-12 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-neutral-100 dark:bg-dark-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">🔍</span>
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-dark-neutral-900 mb-2">
        No repositories found
      </h3>
      <p className="text-neutral-600 dark:text-dark-neutral-600 max-w-md mx-auto">
        Try adjusting your search terms or filters to find what you're looking for.
      </p>
    </div>
  );
}
