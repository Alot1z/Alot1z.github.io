/**
 * LLM Analysis Panel
 * Full-screen modal for displaying streaming repository analysis
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Save, Clock, DollarSign, Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeRepository, type AnalysisConfig } from '../lib/llm-api-universal';
import { type LLMProvider, getProviderConfig } from '../lib/providers-config';
import { saveAnalysis, getLatestAnalysis } from '../lib/analysis-cache';
import type { RepositoryWithScore } from '../lib/github-api';
import { cn } from '../lib/utils';

interface AnalysisPanelProps {
  repository: RepositoryWithScore | null;
  isOpen: boolean;
  onClose: () => void;
  provider: LLMProvider;
  apiKey: string;
}

type AnalysisState = 'loading-cache' | 'analyzing' | 'complete' | 'error' | 'no-analysis';

export function AnalysisPanel({ repository, isOpen, onClose, provider, apiKey }: AnalysisPanelProps) {
  const [analysisState, setAnalysisState] = useState<AnalysisState>('no-analysis');
  const [streamingContent, setStreamingContent] = useState('');
  const [finalContent, setFinalContent] = useState('');
  const [tokenCount, setTokenCount] = useState(0);
  const [cost, setCost] = useState(0);
  const [error, setError] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [model, setModel] = useState('');
  
  const contentRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Load cached analysis or start new analysis
  useEffect(() => {
    if (isOpen && repository) {
      loadOrAnalyze();
    } else {
      resetState();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen, repository]);

  // Auto-scroll during streaming
  useEffect(() => {
    if (analysisState === 'analyzing' && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamingContent, analysisState]);

  const resetState = () => {
    setAnalysisState('no-analysis');
    setStreamingContent('');
    setFinalContent('');
    setTokenCount(0);
    setCost(0);
    setError('');
    setElapsedTime(0);
    setModel('');
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const loadOrAnalyze = async () => {
    if (!repository) return;

    setAnalysisState('loading-cache');

    // Check cache first
    const cached = await getLatestAnalysis(repository.full_name);

    if (cached && Date.now() - cached.timestamp < 7 * 24 * 60 * 60 * 1000) { // 7 days
      // Use cached analysis
      setFinalContent(cached.analysis);
      setTokenCount(cached.tokenCount);
      setCost(cached.cost);
      setModel(cached.model);
      setAnalysisState('complete');
    } else {
      // Start new analysis
      startAnalysis();
    }
  };

  const startAnalysis = async () => {
    if (!repository || !apiKey) return;

    setAnalysisState('analyzing');
    setStreamingContent('');
    setError('');
    startTimeRef.current = Date.now();

    // Start elapsed time counter
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    const config: AnalysisConfig = {
      provider,
      apiKey,
      model: getProviderConfig(provider).defaultModel,
    };

    try {
      await analyzeRepository(repository, config, {
        onToken: (token) => {
          setStreamingContent(prev => prev + token);
          setTokenCount(prev => prev + 1);
        },
        onComplete: async (result) => {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }

          setFinalContent(result.content);
          setTokenCount(result.tokenCount);
          setCost(result.cost);
          setModel(result.model);
          setAnalysisState('complete');

          // Save to cache
          await saveAnalysis({
            repositoryFullName: repository.full_name,
            repositoryUrl: repository.html_url,
            analysis: result.content,
            model: result.model,
            provider: result.provider,
            tokenCount: result.tokenCount,
            cost: result.cost,
            timestamp: Date.now(),
            version: 1,
          });
        },
        onError: (err) => {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }

          setError(err.message);
          setAnalysisState('error');
        },
      });
    } catch (err) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      setError(err instanceof Error ? err.message : 'Analysis failed');
      setAnalysisState('error');
    }
  };

  const handleExportMarkdown = () => {
    if (!repository || !finalContent) return;

    const markdown = `# ${repository.full_name} - Analysis\n\n${finalContent}\n\n---\n\n**Model:** ${model}\n**Tokens:** ${tokenCount.toLocaleString()}\n**Cost:** $${cost.toFixed(4)}\n**Date:** ${new Date().toISOString()}`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${repository.name}-analysis.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !repository) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm">
      <div className="ml-auto w-full max-w-4xl h-full bg-white dark:bg-neutral-900 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                {repository.full_name}
              </h2>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {analysisState === 'analyzing' && (
                <>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(elapsedTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono">{tokenCount.toLocaleString()} tokens</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${cost.toFixed(4)}</span>
                  </div>
                </>
              )}
              {analysisState === 'complete' && (
                <>
                  <span className="text-green-600 dark:text-green-400 font-medium">Complete</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono">{tokenCount.toLocaleString()} tokens</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${cost.toFixed(4)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-6">
          {analysisState === 'loading-cache' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading analysis...</p>
              </div>
            </div>
          )}

          {analysisState === 'analyzing' && (
            <div className="prose dark:prose-invert max-w-none">
              <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                  <div className="animate-pulse">Analyzing...</div>
                </div>
              </div>
              <div className="font-normal leading-relaxed">
                {streamingContent}
                <span className="inline-block w-2 h-5 bg-primary-500 animate-pulse ml-1"></span>
              </div>
            </div>
          )}

          {analysisState === 'complete' && (
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {finalContent}
              </ReactMarkdown>
            </div>
          )}

          {analysisState === 'error' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Analysis Failed
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">{error}</p>
                <button
                  onClick={startAnalysis}
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  Retry Analysis
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {analysisState === 'complete' && (
          <div className="flex items-center justify-between p-6 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Analyzed with <span className="font-mono">{model}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={startAnalysis}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                Re-analyze
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
