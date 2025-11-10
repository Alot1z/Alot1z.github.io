/**
 * IndexedDB cache for LLM analysis results
 * Reduces API costs by caching analysis locally
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { LLMProvider } from './providers-config';

interface AnalysisRecord {
  id: string; // repository full_name + timestamp
  repositoryFullName: string;
  repositoryUrl: string;
  analysis: string;
  model: string;
  provider: LLMProvider;
  tokenCount: number;
  cost: number;
  timestamp: number;
  version: number; // For cache invalidation
}

interface AnalysisCacheDB extends DBSchema {
  analyses: {
    key: string;
    value: AnalysisRecord;
    indexes: {
      'by-repository': string;
      'by-timestamp': number;
    };
  };
}

const DB_NAME = 'github-stars-analysis-cache';
const DB_VERSION = 1;
const STORE_NAME = 'analyses';
const MAX_CACHE_SIZE = 50; // Maximum number of cached analyses

let dbPromise: Promise<IDBPDatabase<AnalysisCacheDB>> | null = null;

async function getDB(): Promise<IDBPDatabase<AnalysisCacheDB>> {
  if (!dbPromise) {
    dbPromise = openDB<AnalysisCacheDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by-repository', 'repositoryFullName');
        store.createIndex('by-timestamp', 'timestamp');
      },
    });
  }
  return dbPromise;
}

/**
 * Save analysis to cache
 */
export async function saveAnalysis(record: Omit<AnalysisRecord, 'id'>): Promise<void> {
  try {
    const db = await getDB();
    const id = `${record.repositoryFullName}_${Date.now()}`;
    
    await db.put(STORE_NAME, {
      ...record,
      id,
    });
    
    // Cleanup old entries if cache is too large
    await cleanupOldEntries();
  } catch (error) {
    console.error('Failed to save analysis to cache:', error);
  }
}

/**
 * Get latest analysis for a repository
 */
export async function getLatestAnalysis(repositoryFullName: string): Promise<AnalysisRecord | null> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const index = tx.store.index('by-repository');
    
    const analyses = await index.getAll(repositoryFullName);
    
    if (analyses.length === 0) {
      return null;
    }
    
    // Return most recent
    return analyses.sort((a, b) => b.timestamp - a.timestamp)[0];
  } catch (error) {
    console.error('Failed to get analysis from cache:', error);
    return null;
  }
}

/**
 * Get all analyses for history view
 */
export async function getAllAnalyses(): Promise<AnalysisRecord[]> {
  try {
    const db = await getDB();
    const analyses = await db.getAll(STORE_NAME);
    return analyses.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to get all analyses:', error);
    return [];
  }
}

/**
 * Delete a specific analysis
 */
export async function deleteAnalysis(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
  } catch (error) {
    console.error('Failed to delete analysis:', error);
  }
}

/**
 * Clear all cached analyses
 */
export async function clearAllAnalyses(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear(STORE_NAME);
  } catch (error) {
    console.error('Failed to clear analyses:', error);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  count: number;
  totalTokens: number;
  totalCost: number;
  oldestTimestamp: number | null;
  newestTimestamp: number | null;
}> {
  try {
    const db = await getDB();
    const analyses = await db.getAll(STORE_NAME);
    
    if (analyses.length === 0) {
      return {
        count: 0,
        totalTokens: 0,
        totalCost: 0,
        oldestTimestamp: null,
        newestTimestamp: null,
      };
    }
    
    return {
      count: analyses.length,
      totalTokens: analyses.reduce((sum, a) => sum + a.tokenCount, 0),
      totalCost: analyses.reduce((sum, a) => sum + a.cost, 0),
      oldestTimestamp: Math.min(...analyses.map(a => a.timestamp)),
      newestTimestamp: Math.max(...analyses.map(a => a.timestamp)),
    };
  } catch (error) {
    console.error('Failed to get cache stats:', error);
    return {
      count: 0,
      totalTokens: 0,
      totalCost: 0,
      oldestTimestamp: null,
      newestTimestamp: null,
    };
  }
}

/**
 * Cleanup old entries if cache exceeds max size
 */
async function cleanupOldEntries(): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const index = tx.store.index('by-timestamp');
    
    const allKeys = await index.getAllKeys();
    
    if (allKeys.length > MAX_CACHE_SIZE) {
      const keysToDelete = allKeys.slice(0, allKeys.length - MAX_CACHE_SIZE);
      for (const key of keysToDelete) {
        const record = await tx.store.get(key);
        if (record) {
          await tx.store.delete(record.id);
        }
      }
    }
    
    await tx.done;
  } catch (error) {
    console.error('Failed to cleanup old entries:', error);
  }
}
