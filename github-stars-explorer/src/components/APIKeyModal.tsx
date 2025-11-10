/**
 * API Key Management Modal
 * Secure modal for managing OpenAI/Anthropic API keys with encryption
 */

import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Check, X, AlertCircle, ShieldCheck } from 'lucide-react';
import { encryptAPIKey, decryptAPIKey } from '../lib/encryption';
import { validateAPIKey, getAvailableModels, type LLMProvider } from '../lib/llm-api';
import { cn } from '../lib/utils';

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (provider: LLMProvider, apiKey: string) => void;
}

export function APIKeyModal({ isOpen, onClose, onKeySaved }: APIKeyModalProps) {
  const [provider, setProvider] = useState<LLMProvider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [validationError, setValidationError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load existing key on mount
  useEffect(() => {
    if (isOpen) {
      loadExistingKey();
    }
  }, [isOpen, provider]);

  const loadExistingKey = async () => {
    try {
      const storageKey = `${provider}_key`;
      const encryptedKey = localStorage.getItem(storageKey);
      
      if (encryptedKey) {
        const decryptedKey = await decryptAPIKey(encryptedKey);
        setApiKey(decryptedKey);
        setValidationStatus('valid');
      } else {
        setApiKey('');
        setValidationStatus('idle');
      }
    } catch (error) {
      console.error('Failed to load API key:', error);
      setApiKey('');
      setValidationStatus('idle');
    }
  };

  const handleValidate = async () => {
    if (!apiKey.trim()) {
      setValidationStatus('invalid');
      setValidationError('API key is required');
      return;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      const isValid = await validateAPIKey({
        provider,
        apiKey: apiKey.trim(),
      });

      if (isValid) {
        setValidationStatus('valid');
        
        // Encrypt and save
        const encrypted = await encryptAPIKey(apiKey.trim());
        localStorage.setItem(`${provider}_key`, encrypted);
        
        onKeySaved(provider, apiKey.trim());
      } else {
        setValidationStatus('invalid');
        setValidationError('Invalid API key. Please check and try again.');
      }
    } catch (error) {
      setValidationStatus('invalid');
      setValidationError(error instanceof Error ? error.message : 'Validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem(`${provider}_key`);
    setApiKey('');
    setValidationStatus('idle');
    setValidationError('');
  };

  const handleClose = () => {
    if (validationStatus === 'valid') {
      onClose();
    } else {
      const confirm = window.confirm('Close without saving a valid API key? You will not be able to analyze repositories.');
      if (confirm) {
        onClose();
      }
    }
  };

  const availableModels = getAvailableModels(provider);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              API Key Management
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Assurance Banner */}
        <div className="m-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                100% Private & Secure
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Your API key is encrypted and stored only in your browser. Never sent to our servers.
                All analysis requests go directly from your browser to {provider === 'openai' ? 'OpenAI' : 'Anthropic'}.
              </p>
            </div>
          </div>
        </div>

        {/* Provider Selection */}
        <div className="px-6 pb-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Choose Provider
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setProvider('openai')}
              className={cn(
                'flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium',
                provider === 'openai'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              )}
            >
              OpenAI
            </button>
            <button
              onClick={() => setProvider('anthropic')}
              className={cn(
                'flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium',
                provider === 'anthropic'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              )}
            >
              Anthropic
            </button>
          </div>
        </div>

        {/* API Key Input */}
        <div className="px-6 pb-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setValidationStatus('idle');
                setValidationError('');
              }}
              placeholder={provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
              className={cn(
                'w-full px-4 py-3 pr-24 rounded-lg border-2 font-mono text-sm',
                'bg-white dark:bg-neutral-900',
                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                validationStatus === 'valid' && 'border-green-500',
                validationStatus === 'invalid' && 'border-red-500',
                validationStatus === 'idle' && 'border-neutral-200 dark:border-neutral-700'
              )}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Validation Status */}
          {validationStatus === 'valid' && (
            <div className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400 text-sm">
              <Check className="w-4 h-4" />
              <span>API key validated and encrypted</span>
            </div>
          )}
          {validationStatus === 'invalid' && (
            <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm">
              <X className="w-4 h-4" />
              <span>{validationError}</span>
            </div>
          )}

          <button
            onClick={handleValidate}
            disabled={isValidating || !apiKey.trim()}
            className={cn(
              'w-full mt-3 py-3 px-4 rounded-lg font-medium transition-all',
              'bg-primary-500 hover:bg-primary-600 text-white',
              'disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed'
            )}
          >
            {isValidating ? 'Validating...' : 'Validate & Save'}
          </button>
        </div>

        {/* Billing Info (if validated) */}
        {validationStatus === 'valid' && (
          <div className="mx-6 mb-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              Billing Information
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Average cost per analysis: <strong>$0.01 - $0.05</strong>
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              You are billed directly by {provider === 'openai' ? 'OpenAI' : 'Anthropic'}.
              Check your usage at their dashboard.
            </p>
          </div>
        )}

        {/* Advanced Settings */}
        <div className="px-6 pb-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </button>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Available Models
                </label>
                <div className="space-y-2">
                  {availableModels.map((model) => (
                    <div key={model.value} className="text-sm text-neutral-600 dark:text-neutral-400">
                      <strong>{model.label}</strong> - {model.cost}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={handleClearKey}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Clear Saved API Key
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-neutral-200 dark:border-neutral-700">
          <a
            href={provider === 'openai' 
              ? 'https://platform.openai.com/api-keys'
              : 'https://console.anthropic.com/account/keys'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Get API Key from {provider === 'openai' ? 'OpenAI' : 'Anthropic'}
          </a>
          <button
            onClick={handleClose}
            disabled={validationStatus !== 'valid'}
            className={cn(
              'py-2 px-6 rounded-lg font-medium transition-all',
              validationStatus === 'valid'
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed'
            )}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
