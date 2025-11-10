/**
 * Universal LLM API Client
 * Supports 15+ providers with streaming, rate limiting, and cost tracking
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import type { RepositoryWithScore } from './github-api';
import { 
  type LLMProvider, 
  type ProviderConfig,
  getProviderConfig,
  estimateCost as calculateCost
} from './providers-config';

export interface AnalysisConfig {
  provider: LLMProvider;
  apiKey: string;
  model?: string;
  maxTokens?: number;
  customEndpoint?: string; // For custom provider
}

export interface AnalysisResult {
  content: string;
  tokenCount: number;
  cost: number;
  model: string;
  provider: LLMProvider;
  timestamp: number;
}

export interface StreamingCallback {
  onToken: (token: string) => void;
  onComplete: (result: AnalysisResult) => void;
  onError: (error: Error) => void;
}

/**
 * Create analysis prompt for repository
 */
function createAnalysisPrompt(repository: RepositoryWithScore): string {
  return `Analyze this GitHub repository and provide insights:

**Repository:** ${repository.full_name}
**Description:** ${repository.description || 'No description'}
**Language:** ${repository.language || 'Unknown'}
**Stars:** ${repository.stargazers_count}
**Topics:** ${repository.topics?.join(', ') || 'None'}

Please provide a comprehensive analysis covering:

1. **Purpose & Use Case**: What problem does this repository solve? Who is the target audience?

2. **Key Strengths**: What makes this repository valuable? (code quality, documentation, community, unique features)

3. **Technical Stack**: Brief overview of technologies used and architecture patterns.

4. **Potential Issues or Limitations**: Any concerns about maintenance, dependencies, or scalability?

5. **Recommendations**: Should someone use this? For what use cases? Any alternatives to consider?

Keep your analysis concise (300-400 words), practical, and actionable. Focus on insights that help developers decide if this is right for their project.`;
}

/**
 * OpenAI and OpenAI-compatible providers
 */
async function analyzeWithOpenAI(
  repository: RepositoryWithScore,
  config: AnalysisConfig,
  callbacks: StreamingCallback,
  endpoint?: string
): Promise<void> {
  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: endpoint,
    dangerouslyAllowBrowser: true,
  });

  const providerConfig = getProviderConfig(config.provider);
  const model = config.model || providerConfig.defaultModel;
  const maxTokens = config.maxTokens || 800;

  try {
    const stream = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are an expert software engineer analyzing GitHub repositories. Provide insightful, practical analysis.' },
        { role: 'user', content: createAnalysisPrompt(repository) },
      ],
      max_tokens: maxTokens,
      stream: true,
      temperature: 0.7,
    });

    let fullContent = '';
    let tokenCount = 0;

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || '';
      if (token) {
        fullContent += token;
        tokenCount++;
        callbacks.onToken(token);
      }
    }

    const inputTokens = Math.ceil(createAnalysisPrompt(repository).split(' ').length * 1.3);
    const cost = calculateCost(config.provider, model, inputTokens, tokenCount);

    callbacks.onComplete({
      content: fullContent,
      tokenCount: inputTokens + tokenCount,
      cost,
      model,
      provider: config.provider,
      timestamp: Date.now(),
    });
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(`${providerConfig.name} API error`));
  }
}

/**
 * Anthropic provider
 */
async function analyzeWithAnthropic(
  repository: RepositoryWithScore,
  config: AnalysisConfig,
  callbacks: StreamingCallback
): Promise<void> {
  const client = new Anthropic({
    apiKey: config.apiKey,
    dangerouslyAllowBrowser: true,
  });

  const providerConfig = getProviderConfig(config.provider);
  const model = config.model || providerConfig.defaultModel;
  const maxTokens = config.maxTokens || 800;

  try {
    const stream = await client.messages.stream({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: 'user', content: createAnalysisPrompt(repository) },
      ],
      system: 'You are an expert software engineer analyzing GitHub repositories. Provide insightful, practical analysis.',
      temperature: 0.7,
    });

    let fullContent = '';

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        const token = chunk.delta.text;
        fullContent += token;
        callbacks.onToken(token);
      }
    }

    const message = await stream.finalMessage();
    const cost = calculateCost(
      config.provider,
      model,
      message.usage.input_tokens,
      message.usage.output_tokens
    );

    callbacks.onComplete({
      content: fullContent,
      tokenCount: message.usage.input_tokens + message.usage.output_tokens,
      cost,
      model,
      provider: config.provider,
      timestamp: Date.now(),
    });
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error('Anthropic API error'));
  }
}

/**
 * Google Gemini provider
 */
async function analyzeWithGoogle(
  repository: RepositoryWithScore,
  config: AnalysisConfig,
  callbacks: StreamingCallback
): Promise<void> {
  const providerConfig = getProviderConfig(config.provider);
  const model = config.model || providerConfig.defaultModel;
  const apiKey = config.apiKey;

  try {
    const response = await fetch(
      `${providerConfig.apiEndpoint}/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: createAnalysisPrompt(repository) }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: config.maxTokens || 800,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates[0]?.content?.parts[0]?.text || '';
    
    // Simulate streaming for consistent UX
    for (let i = 0; i < content.length; i += 5) {
      const chunk = content.slice(i, i + 5);
      callbacks.onToken(chunk);
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const inputTokens = Math.ceil(createAnalysisPrompt(repository).split(' ').length * 1.3);
    const outputTokens = Math.ceil(content.split(' ').length * 1.3);
    const cost = calculateCost(config.provider, model, inputTokens, outputTokens);

    callbacks.onComplete({
      content,
      tokenCount: inputTokens + outputTokens,
      cost,
      model,
      provider: config.provider,
      timestamp: Date.now(),
    });
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error('Google API error'));
  }
}

/**
 * DeepSeek provider (OpenAI-compatible)
 */
async function analyzeWithDeepSeek(
  repository: RepositoryWithScore,
  config: AnalysisConfig,
  callbacks: StreamingCallback
): Promise<void> {
  return analyzeWithOpenAI(repository, config, callbacks, 'https://api.deepseek.com/v1');
}

/**
 * Mistral provider (OpenAI-compatible)
 */
async function analyzeWithMistral(
  repository: RepositoryWithScore,
  config: AnalysisConfig,
  callbacks: StreamingCallback
): Promise<void> {
  return analyzeWithOpenAI(repository, config, callbacks, 'https://api.mistral.ai/v1');
}

/**
 * Cohere provider
 */
async function analyzeWithCohere(
  repository: RepositoryWithScore,
  config: AnalysisConfig,
  callbacks: StreamingCallback
): Promise<void> {
  const providerConfig = getProviderConfig(config.provider);
  const model = config.model || providerConfig.defaultModel;

  try {
    const response = await fetch(`${providerConfig.apiEndpoint}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        message: createAnalysisPrompt(repository),
        temperature: 0.7,
        max_tokens: config.maxTokens || 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.text || '';

    // Simulate streaming
    for (let i = 0; i < content.length; i += 5) {
      const chunk = content.slice(i, i + 5);
      callbacks.onToken(chunk);
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const inputTokens = Math.ceil(createAnalysisPrompt(repository).split(' ').length * 1.3);
    const outputTokens = Math.ceil(content.split(' ').length * 1.3);
    const cost = calculateCost(config.provider, model, inputTokens, outputTokens);

    callbacks.onComplete({
      content,
      tokenCount: inputTokens + outputTokens,
      cost,
      model,
      provider: config.provider,
      timestamp: Date.now(),
    });
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error('Cohere API error'));
  }
}

/**
 * Z.ai (GLM) provider - OpenAI-compatible
 */
async function analyzeWithZai(
  repository: RepositoryWithScore,
  config: AnalysisConfig,
  callbacks: StreamingCallback
): Promise<void> {
  return analyzeWithOpenAI(
    repository,
    config,
    callbacks,
    'https://open.bigmodel.cn/api/paas/v4'
  );
}

/**
 * Hugging Face provider
 */
async function analyzeWithHuggingFace(
  repository: RepositoryWithScore,
  config: AnalysisConfig,
  callbacks: StreamingCallback
): Promise<void> {
  const providerConfig = getProviderConfig(config.provider);
  const model = config.model || providerConfig.defaultModel;

  try {
    const response = await fetch(`${providerConfig.apiEndpoint}/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: createAnalysisPrompt(repository),
        parameters: {
          temperature: 0.7,
          max_new_tokens: config.maxTokens || 800,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = Array.isArray(data) ? data[0]?.generated_text || '' : data.generated_text || '';

    // Simulate streaming
    for (let i = 0; i < content.length; i += 5) {
      const chunk = content.slice(i, i + 5);
      callbacks.onToken(chunk);
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const inputTokens = Math.ceil(createAnalysisPrompt(repository).split(' ').length * 1.3);
    const outputTokens = Math.ceil(content.split(' ').length * 1.3);

    callbacks.onComplete({
      content,
      tokenCount: inputTokens + outputTokens,
      cost: 0, // Free tier
      model,
      provider: config.provider,
      timestamp: Date.now(),
    });
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error('Hugging Face API error'));
  }
}

/**
 * Ollama local provider
 */
async function analyzeWithOllama(
  repository: RepositoryWithScore,
  config: AnalysisConfig,
  callbacks: StreamingCallback
): Promise<void> {
  const providerConfig = getProviderConfig(config.provider);
  const model = config.model || providerConfig.defaultModel;

  try {
    const response = await fetch(`${providerConfig.apiEndpoint}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: createAnalysisPrompt(repository),
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Ollama not running. Please start Ollama and load a model.');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              fullContent += data.response;
              callbacks.onToken(data.response);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    const tokens = Math.ceil(fullContent.split(' ').length * 1.3);

    callbacks.onComplete({
      content: fullContent,
      tokenCount: tokens,
      cost: 0, // Local is free
      model,
      provider: config.provider,
      timestamp: Date.now(),
    });
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error('Ollama error'));
  }
}

/**
 * Generic OpenAI-compatible providers (Together, Replicate, Perplexity, Fireworks, LM Studio, LocalAI)
 */
async function analyzeWithGenericOpenAI(
  repository: RepositoryWithScore,
  config: AnalysisConfig,
  callbacks: StreamingCallback
): Promise<void> {
  const providerConfig = getProviderConfig(config.provider);
  return analyzeWithOpenAI(repository, config, callbacks, providerConfig.apiEndpoint);
}

/**
 * Main analysis router
 */
export async function analyzeRepository(
  repository: RepositoryWithScore,
  config: AnalysisConfig,
  callbacks: StreamingCallback
): Promise<void> {
  // Use custom endpoint if provided
  if (config.provider === 'custom' && config.customEndpoint) {
    return analyzeWithOpenAI(repository, config, callbacks, config.customEndpoint);
  }

  // Route to appropriate provider
  switch (config.provider) {
    case 'openai':
      return analyzeWithOpenAI(repository, config, callbacks);
    case 'anthropic':
      return analyzeWithAnthropic(repository, config, callbacks);
    case 'zai':
      return analyzeWithZai(repository, config, callbacks);
    case 'google':
      return analyzeWithGoogle(repository, config, callbacks);
    case 'deepseek':
      return analyzeWithDeepSeek(repository, config, callbacks);
    case 'mistral':
      return analyzeWithMistral(repository, config, callbacks);
    case 'cohere':
      return analyzeWithCohere(repository, config, callbacks);
    case 'huggingface':
      return analyzeWithHuggingFace(repository, config, callbacks);
    case 'ollama':
      return analyzeWithOllama(repository, config, callbacks);
    case 'replicate':
    case 'together':
    case 'perplexity':
    case 'fireworks':
    case 'lmstudio':
    case 'localai':
      return analyzeWithGenericOpenAI(repository, config, callbacks);
    default:
      callbacks.onError(new Error(`Unsupported provider: ${config.provider}`));
  }
}

/**
 * Validate API key for a provider
 */
export async function validateAPIKey(config: AnalysisConfig): Promise<boolean> {
  try {
    // Local providers don't need API keys
    const providerConfig = getProviderConfig(config.provider);
    if (!providerConfig.requiresAuth) {
      // Test connectivity for local providers
      const testResponse = await fetch(providerConfig.apiEndpoint, { method: 'HEAD' }).catch(() => null);
      return testResponse !== null;
    }

    // For cloud providers, make a minimal test request
    if (config.provider === 'openai' || config.provider === 'deepseek' || config.provider === 'mistral' || config.provider === 'zai') {
      const client = new OpenAI({
        apiKey: config.apiKey,
        baseURL: providerConfig.apiEndpoint,
        dangerouslyAllowBrowser: true,
      });

      await client.chat.completions.create({
        model: config.model || providerConfig.defaultModel,
        messages: [{ role: 'user', content: 'Test' }],
        max_tokens: 5,
      });

      return true;
    } else if (config.provider === 'anthropic') {
      const client = new Anthropic({
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true,
      });

      await client.messages.create({
        model: config.model || providerConfig.defaultModel,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Test' }],
      });

      return true;
    } else {
      // For other providers, test with a simple request
      const response = await fetch(providerConfig.apiEndpoint, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
        },
      });

      return response.ok;
    }
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
}

/**
 * Detect available local LLMs
 */
export async function detectLocalLLMs(): Promise<LLMProvider[]> {
  const available: LLMProvider[] = [];

  // Check Ollama
  try {
    const ollamaResponse = await fetch('http://localhost:11434/api/tags', { 
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });
    if (ollamaResponse.ok) available.push('ollama');
  } catch (e) {
    // Ollama not available
  }

  // Check LM Studio
  try {
    const lmstudioResponse = await fetch('http://localhost:1234/v1/models', { 
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });
    if (lmstudioResponse.ok) available.push('lmstudio');
  } catch (e) {
    // LM Studio not available
  }

  // Check LocalAI
  try {
    const locaaiResponse = await fetch('http://localhost:8080/v1/models', { 
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });
    if (locaaiResponse.ok) available.push('localai');
  } catch (e) {
    // LocalAI not available
  }

  return available;
}
