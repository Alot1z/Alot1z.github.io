import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { FilterBar } from './components/FilterBar';
import { StatisticsDashboard } from './components/StatisticsDashboard';
import { RepositoryCard } from './components/RepositoryCard';
import { RepositoryModal } from './components/RepositoryModal';
import { RepositoryCardSkeleton, EmptyState } from './components/LoadingStates';
import { ProviderSelector } from './components/ProviderSelector';
import { AnalysisPanel } from './components/AnalysisPanel';
import { PrivacyStatusIndicator } from './components/PrivacyStatusIndicator';
import { ThemeProvider } from './contexts/ThemeContext';
import { GitHubAPI, RepositoryWithScore } from './lib/github-api';
import { processRepositories, sortRepositories, filterRepositories, cn } from './lib/utils';
import { decryptAPIKey } from './lib/encryption';
import { getLatestAnalysis } from './lib/analysis-cache';
import type { LLMProvider } from './lib/providers-config';

type SortOption = 'name' | 'stars' | 'updated' | 'quality';

function AppContent() {
  // State management
  const [repositories, setRepositories] = useState<RepositoryWithScore[]>([]);
  const [filteredRepositories, setFilteredRepositories] = useState<RepositoryWithScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepository, setSelectedRepository] = useState<RepositoryWithScore | null>(null);
  const [username, setUsername] = useState('');

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [qualityRange, setQualityRange] = useState<[number, number]>([1, 10]);
  const [sortBy, setSortBy] = useState<SortOption>('updated');

  // LLM Analysis state
  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false);
  const [hasAPIKey, setHasAPIKey] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<LLMProvider>('openai');
  const [currentAPIKey, setCurrentAPIKey] = useState('');
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [repositoryToAnalyze, setRepositoryToAnalyze] = useState<RepositoryWithScore | null>(null);
  const [analyzedRepos, setAnalyzedRepos] = useState<Set<string>>(new Set());

  // Check for existing API keys on mount
  useEffect(() => {
    checkForAPIKeys();
    loadAnalyzedRepos();
  }, []);

  const checkForAPIKeys = async () => {
    // Check for any saved provider keys (new format: llm_key_{provider})
    const providers: LLMProvider[] = ['openai', 'anthropic', 'zai', 'google', 'deepseek', 'mistral', 'cohere'];
    
    for (const provider of providers) {
      const key = localStorage.getItem(`llm_key_${provider}`);
      if (key) {
        try {
          const decrypted = await decryptAPIKey(key);
          setCurrentProvider(provider);
          setCurrentAPIKey(decrypted);
          setHasAPIKey(true);
          return; // Use the first found key
        } catch (error) {
          console.error(`Failed to decrypt ${provider} key:`, error);
        }
      }
    }
    
    // Fallback: Check old format keys for backward compatibility
    const openaiKey = localStorage.getItem('openai_key');
    const anthropicKey = localStorage.getItem('anthropic_key');
    
    if (openaiKey) {
      try {
        const decrypted = await decryptAPIKey(openaiKey);
        setCurrentProvider('openai');
        setCurrentAPIKey(decrypted);
        setHasAPIKey(true);
      } catch (error) {
        console.error('Failed to decrypt OpenAI key:', error);
      }
    } else if (anthropicKey) {
      try {
        const decrypted = await decryptAPIKey(anthropicKey);
        setCurrentProvider('anthropic');
        setCurrentAPIKey(decrypted);
        setHasAPIKey(true);
      } catch (error) {
        console.error('Failed to decrypt Anthropic key:', error);
      }
    }
  };

  const loadAnalyzedRepos = async () => {
    // Load list of repositories that have cached analysis
    const analyzed = new Set<string>();
    // This is a simplified version - in production you'd query IndexedDB
    setAnalyzedRepos(analyzed);
  };

  const handleProviderSelected = async (provider: LLMProvider, apiKey: string, model?: string) => {
    setCurrentProvider(provider);
    setCurrentAPIKey(apiKey);
    setHasAPIKey(true);
  };

  const handleAnalyzeRepository = (repo: RepositoryWithScore) => {
    if (!hasAPIKey) {
      setShowAPIKeyModal(true);
      return;
    }
    
    setRepositoryToAnalyze(repo);
    setShowAnalysisPanel(true);
  };

  // Handle search
  const handleSearch = async (input: string) => {
    setIsLoading(true);
    setError(null);
    setRepositories([]);
    setFilteredRepositories([]);
    setSelectedCategories([]);
    setSelectedLanguages([]);
    setSearchTerm('');
    setQualityRange([1, 10]);

    try {
      const extractedUsername = GitHubAPI.extractUsername(input);
      setUsername(extractedUsername);

      const repos = await GitHubAPI.fetchUserStars(extractedUsername);
      const processedRepos = processRepositories(repos);
      
      setRepositories(processedRepos);
      setFilteredRepositories(processedRepos);
      
      // Load analysis cache status
      await loadAnalysisStatusForRepos(processedRepos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalysisStatusForRepos = async (repos: RepositoryWithScore[]) => {
    const analyzed = new Set<string>();
    for (const repo of repos) {
      const cached = await getLatestAnalysis(repo.full_name);
      if (cached) {
        analyzed.add(repo.full_name);
      }
    }
    setAnalyzedRepos(analyzed);
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = filterRepositories(repositories, {
      search: searchTerm,
      categories: selectedCategories,
      languages: selectedLanguages,
      qualityMin: qualityRange[0],
      qualityMax: qualityRange[1],
    });

    filtered = sortRepositories(filtered, sortBy);
    setFilteredRepositories(filtered);
  }, [repositories, searchTerm, selectedCategories, selectedLanguages, qualityRange, sortBy]);

  // Filter handlers
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedLanguages([]);
    setQualityRange([1, 10]);
  };

  // Show hero search until first search
  const showHero = repositories.length === 0 && !isLoading;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <Header 
        onAPIKeyClick={() => setShowAPIKeyModal(true)}
        hasAPIKey={hasAPIKey}
      />
      
      {showHero ? (
        <HeroSearch
          onSearch={handleSearch}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <>
          {/* Show search if we have data */}
          {repositories.length > 0 && (
            <div className="sticky top-16 z-30 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 py-4">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {username}'s Starred Repositories
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                    {filteredRepositories.length} of {repositories.length} repositories
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          {repositories.length > 0 && (
            <FilterBar
              repositories={repositories}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              selectedLanguages={selectedLanguages}
              onLanguageToggle={handleLanguageToggle}
              qualityRange={qualityRange}
              onQualityRangeChange={setQualityRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
            />
          )}

          {/* Statistics Dashboard */}
          {repositories.length > 0 && (
            <StatisticsDashboard repositories={repositories} />
          )}

          {/* Repository Grid */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                  <RepositoryCardSkeleton key={index} />
                ))}
              </div>
            ) : filteredRepositories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRepositories.map((repository) => (
                  <RepositoryCard
                    key={repository.id}
                    repository={repository}
                    onClick={setSelectedRepository}
                    onAnalyze={handleAnalyzeRepository}
                    hasAnalysis={analyzedRepos.has(repository.full_name)}
                  />
                ))}
              </div>
            ) : repositories.length > 0 ? (
              <EmptyState />
            ) : null}
          </div>
        </>
      )}

      {/* Repository Detail Modal */}
      <RepositoryModal
        repository={selectedRepository}
        isOpen={!!selectedRepository}
        onClose={() => setSelectedRepository(null)}
      />

      {/* Provider Selector Modal */}
      <ProviderSelector
        isOpen={showAPIKeyModal}
        onClose={() => setShowAPIKeyModal(false)}
        onProviderSelected={handleProviderSelected}
      />

      {/* LLM Analysis Panel */}
      <AnalysisPanel
        repository={repositoryToAnalyze}
        isOpen={showAnalysisPanel}
        onClose={() => {
          setShowAnalysisPanel(false);
          setRepositoryToAnalyze(null);
          // Reload analysis status
          if (repositories.length > 0) {
            loadAnalysisStatusForRepos(repositories);
          }
        }}
        provider={currentProvider}
        apiKey={currentAPIKey}
      />

      {/* Privacy Status Indicator */}
      <PrivacyStatusIndicator />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
