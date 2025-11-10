/**
 * Universal Provider Selector Component
 * Comprehensive UI for selecting and configuring 15+ LLM providers
 */

import React, { useState, useEffect } from 'react';
import { 
  Cloud, Server, Zap, Search, Check, X, AlertCircle, 
  ShieldCheck, Eye, EyeOff, ExternalLink, Info
} from 'lucide-react';
import {
  type LLMProvider,
  type ProviderConfig,
  type ModelInfo,
  getAllProviders,
  getCloudProviders,
  getLocalProviders,
  getProvidersByTier,
  getProviderConfig
} from '../lib/providers-config';
import { encryptAPIKey, decryptAPIKey } from '../lib/encryption';
import { validateAPIKey, detectLocalLLMs } from '../lib/llm-api-universal';
import { 
  detectOllamaModels, 
  detectLMStudioModels, 
  detectLocalAIModels,
  getModelDisplayName,
  formatModelSize,
  type LocalServiceStatus 
} from '../lib/local-llm-detection';
import { cn } from '../lib/utils';

interface ProviderSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onProviderSelected: (provider: LLMProvider, apiKey: string, model?: string) => void;
}

type ViewMode = 'select' | 'configure';

export function ProviderSelector({ isOpen, onClose, onProviderSelected }: ProviderSelectorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'cloud' | 'local'>('all');
  const [availableLocalProviders, setAvailableLocalProviders] = useState<LLMProvider[]>([]);

  // Configuration state
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [validationError, setValidationError] = useState('');

  // Dynamic model detection for local providers
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [localServiceStatus, setLocalServiceStatus] = useState<LocalServiceStatus | null>(null);

  // Detect local LLMs on mount
  useEffect(() => {
    if (isOpen) {
      detectLocalLLMs().then(setAvailableLocalProviders);
    }
  }, [isOpen]);

  // Load existing configuration when provider is selected
  useEffect(() => {
    if (selectedProvider && viewMode === 'configure') {
      loadProviderConfig(selectedProvider);
    }
  }, [selectedProvider, viewMode]);

  const loadProviderConfig = async (provider: LLMProvider) => {
    try {
      const config = getProviderConfig(provider);
      
      // For local providers, fetch dynamic models
      if (provider === 'ollama' || provider === 'lmstudio' || provider === 'localai') {
        setIsLoadingModels(true);
        let status: LocalServiceStatus | null = null;
        
        try {
          if (provider === 'ollama') {
            status = await detectOllamaModels();
          } else if (provider === 'lmstudio') {
            status = await detectLMStudioModels();
          } else if (provider === 'localai') {
            status = await detectLocalAIModels();
          }
          
          setLocalServiceStatus(status);
          
          if (status && status.available && status.models.length > 0) {
            // Convert local models to ModelInfo format
            const models: ModelInfo[] = status.models.map(m => ({
              id: m.name,
              name: getModelDisplayName(m.name),
              description: formatModelSize(m.size) || 'Local model',
              contextWindow: 4096, // Default
            }));
            
            setAvailableModels(models);
            setSelectedModel(models[0].id); // Select first available model
            setValidationStatus('valid'); // Local provider is available
          } else {
            // Service not running or no models, use static config
            setAvailableModels(config.models);
            setSelectedModel(config.defaultModel);
            setValidationStatus('idle');
          }
        } catch (error) {
          console.error(`Failed to detect ${provider} models:`, error);
          setAvailableModels(config.models);
          setSelectedModel(config.defaultModel);
        } finally {
          setIsLoadingModels(false);
        }
      } else {
        // Cloud providers use static model list
        setAvailableModels(config.models);
        setSelectedModel(config.defaultModel);
      }
      
      if (config.requiresAuth) {
        const encryptedKey = localStorage.getItem(`llm_key_${provider}`);
        if (encryptedKey) {
          const decryptedKey = await decryptAPIKey(encryptedKey);
          setApiKey(decryptedKey);
          setValidationStatus('valid');
        } else {
          setApiKey('');
          if (!config.isLocal) {
            setValidationStatus('idle');
          }
        }
      } else {
        setApiKey('');
        if (!config.isLocal && validationStatus === 'idle') {
          setValidationStatus('valid'); // Local providers don't need API keys
        }
      }

      if (provider === 'custom') {
        const savedEndpoint = localStorage.getItem('custom_endpoint');
        setCustomEndpoint(savedEndpoint || '');
      }
    } catch (error) {
      console.error('Failed to load provider config:', error);
    }
  };

  const handleProviderSelect = (provider: LLMProvider) => {
    setSelectedProvider(provider);
    setViewMode('configure');
    setValidationStatus('idle');
    setValidationError('');
  };

  const handleValidate = async () => {
    if (!selectedProvider) return;

    const config = getProviderConfig(selectedProvider);

    if (config.requiresAuth && !apiKey.trim()) {
      setValidationStatus('invalid');
      setValidationError('API key is required');
      return;
    }

    if (selectedProvider === 'custom' && !customEndpoint.trim()) {
      setValidationStatus('invalid');
      setValidationError('Custom endpoint is required');
      return;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      const isValid = await validateAPIKey({
        provider: selectedProvider,
        apiKey: apiKey.trim(),
        model: selectedModel,
        customEndpoint: selectedProvider === 'custom' ? customEndpoint : undefined,
      });

      if (isValid) {
        setValidationStatus('valid');

        // Save configuration
        if (config.requiresAuth) {
          const encrypted = await encryptAPIKey(apiKey.trim());
          localStorage.setItem(`llm_key_${selectedProvider}`, encrypted);
        }

        if (selectedProvider === 'custom' && customEndpoint) {
          localStorage.setItem('custom_endpoint', customEndpoint);
        }

        // Notify parent
        onProviderSelected(selectedProvider, apiKey.trim(), selectedModel);
        onClose();
      } else {
        setValidationStatus('invalid');
        setValidationError('Validation failed. Please check your credentials and try again.');
      }
    } catch (error) {
      setValidationStatus('invalid');
      setValidationError(error instanceof Error ? error.message : 'Validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  const getFilteredProviders = (): ProviderConfig[] => {
    let providers = getAllProviders();

    // Filter by type
    if (filterType === 'cloud') {
      providers = getCloudProviders();
    } else if (filterType === 'local') {
      providers = getLocalProviders();
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      providers = providers.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    return providers;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {viewMode === 'select' ? 'Select LLM Provider' : 'Configure Provider'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {viewMode === 'select' 
                  ? 'Choose from 15+ cloud and local LLM providers'
                  : `Setup ${selectedProvider ? getProviderConfig(selectedProvider).name : ''}`
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          {viewMode === 'select' ? (
            <SelectProviderView
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterType={filterType}
              setFilterType={setFilterType}
              providers={getFilteredProviders()}
              availableLocalProviders={availableLocalProviders}
              onProviderSelect={handleProviderSelect}
            />
          ) : selectedProvider ? (
            <ConfigureProviderView
              provider={selectedProvider}
              apiKey={apiKey}
              setApiKey={setApiKey}
              showApiKey={showApiKey}
              setShowApiKey={setShowApiKey}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              customEndpoint={customEndpoint}
              setCustomEndpoint={setCustomEndpoint}
              validationStatus={validationStatus}
              validationError={validationError}
              availableModels={availableModels}
              isLoadingModels={isLoadingModels}
              localServiceStatus={localServiceStatus}
              onBack={() => setViewMode('select')}
            />
          ) : null}
        </div>

        {/* Footer */}
        {viewMode === 'configure' && (
          <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>All keys are encrypted and stored locally</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setViewMode('select')}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Back
                </button>
                <button
                  onClick={handleValidate}
                  disabled={isValidating}
                  className={cn(
                    "px-6 py-2 bg-blue-600 text-white rounded-lg transition",
                    "hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center gap-2"
                  )}
                >
                  {isValidating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Validating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Validate & Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Select Provider View Component
function SelectProviderView({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  providers,
  availableLocalProviders,
  onProviderSelect,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterType: 'all' | 'cloud' | 'local';
  setFilterType: (t: 'all' | 'cloud' | 'local') => void;
  providers: ProviderConfig[];
  availableLocalProviders: LLMProvider[];
  onProviderSelect: (provider: LLMProvider) => void;
}) {
  const tiers = getProvidersByTier();

  return (
    <div className="p-6 space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'cloud', 'local'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "px-4 py-2 rounded-lg transition capitalize",
                filterType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              {type === 'all' ? 'All Providers' : `${type} Only`}
            </button>
          ))}
        </div>
      </div>

      {/* Provider Grid */}
      <div className="space-y-8">
        {filterType === 'all' && (
          <>
            <ProviderTierSection
              title="Tier 1: Major Cloud Providers"
              description="Industry-leading AI companies with powerful models"
              providers={tiers.tier1}
              availableLocalProviders={availableLocalProviders}
              onSelect={onProviderSelect}
            />
            <ProviderTierSection
              title="Tier 2: Specialized Providers"
              description="Specialized platforms and model hosting services"
              providers={tiers.tier2}
              availableLocalProviders={availableLocalProviders}
              onSelect={onProviderSelect}
            />
            <ProviderTierSection
              title="Tier 3: Local & Custom"
              description="Run models locally or use custom endpoints"
              providers={tiers.tier3}
              availableLocalProviders={availableLocalProviders}
              onSelect={onProviderSelect}
            />
          </>
        )}
        {filterType !== 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                isAvailable={!provider.isLocal || availableLocalProviders.includes(provider.id)}
                onSelect={() => onProviderSelect(provider.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProviderTierSection({
  title,
  description,
  providers,
  availableLocalProviders,
  onSelect,
}: {
  title: string;
  description: string;
  providers: ProviderConfig[];
  availableLocalProviders: LLMProvider[];
  onSelect: (provider: LLMProvider) => void;
}) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            isAvailable={!provider.isLocal || availableLocalProviders.includes(provider.id)}
            onSelect={() => onSelect(provider.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ProviderCard({
  provider,
  isAvailable,
  onSelect,
}: {
  provider: ProviderConfig;
  isAvailable: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "p-4 border rounded-lg text-left transition group relative",
        "hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400",
        "border-gray-200 dark:border-gray-700 cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {provider.name}
            {provider.isLocal && (
              <Server className="w-4 h-4 text-green-500" />
            )}
            {!provider.isLocal && (
              <Cloud className="w-4 h-4 text-blue-500" />
            )}
          </h4>
        </div>
        {provider.isLocal && !isAvailable && (
          <span className="text-xs text-red-500">Not Running</span>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{provider.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {provider.models.length} {provider.models.length === 1 ? 'model' : 'models'}
        </span>
        {provider.supportsStreaming && (
          <Zap className="w-4 h-4 text-yellow-500" title="Streaming support" />
        )}
      </div>
    </button>
  );
}

// Configure Provider View Component
function ConfigureProviderView({
  provider,
  apiKey,
  setApiKey,
  showApiKey,
  setShowApiKey,
  selectedModel,
  setSelectedModel,
  customEndpoint,
  setCustomEndpoint,
  validationStatus,
  validationError,
  availableModels,
  isLoadingModels,
  localServiceStatus,
  onBack,
}: {
  provider: LLMProvider;
  apiKey: string;
  setApiKey: (key: string) => void;
  showApiKey: boolean;
  setShowApiKey: (show: boolean) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  customEndpoint: string;
  setCustomEndpoint: (endpoint: string) => void;
  validationStatus: 'idle' | 'valid' | 'invalid';
  validationError: string;
  availableModels: ModelInfo[];
  isLoadingModels: boolean;
  localServiceStatus: LocalServiceStatus | null;
  onBack: () => void;
}) {
  const config = getProviderConfig(provider);

  return (
    <div className="p-6 space-y-6">
      {/* Provider Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">{config.name}</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">{config.description}</p>
            {config.website && (
              <a
                href={config.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-2"
              >
                Visit website <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* API Key Input */}
      {config.requiresAuth && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Enter your ${config.name} API key`}
              className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Custom Endpoint */}
      {provider === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            API Endpoint
          </label>
          <input
            type="url"
            value={customEndpoint}
            onChange={(e) => setCustomEndpoint(e.target.value)}
            placeholder="https://api.example.com/v1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      )}

      {/* Model Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Model {isLoadingModels && <span className="text-xs text-gray-500">(Detecting...)</span>}
        </label>
        {isLoadingModels ? (
          <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Detecting available models...</span>
          </div>
        ) : (
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={availableModels.length === 0}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {availableModels.length > 0 ? (
              availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} {model.description && `- ${model.description}`}
                </option>
              ))
            ) : (
              <option value="">No models available</option>
            )}
          </select>
        )}
        {localServiceStatus && !localServiceStatus.available && config.isLocal && (
          <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
            Service not running. {localServiceStatus.error || 'Please start the service to detect available models.'}
          </p>
        )}
        {localServiceStatus && localServiceStatus.available && localServiceStatus.models.length === 0 && (
          <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
            Service is running but no models found. Please download models first.
          </p>
        )}
        {localServiceStatus && localServiceStatus.available && localServiceStatus.models.length > 0 && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">
            Detected {localServiceStatus.models.length} available {localServiceStatus.models.length === 1 ? 'model' : 'models'}
          </p>
        )}
      </div>

      {/* Setup Instructions for Local Providers */}
      {config.isLocal && config.setupInstructions && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Setup Instructions</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{config.setupInstructions}</p>
        </div>
      )}

      {/* Validation Status */}
      {validationStatus !== 'idle' && (
        <div
          className={cn(
            "p-4 rounded-lg flex items-start gap-3",
            validationStatus === 'valid'
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          )}
        >
          {validationStatus === 'valid' ? (
            <>
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Validation Successful</p>
                <p className="text-sm text-green-800 dark:text-green-200">Your credentials are valid and have been saved.</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-100">Validation Failed</p>
                <p className="text-sm text-red-800 dark:text-red-200">{validationError}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
