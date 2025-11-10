/**
 * LLM API integration for repository analysis
 * Supports OpenAI and Anthropic with streaming
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import type { RepositoryWithScore } from './github-api';

export type LLMProvider = 'openai' | 'anthropic';
export type OpenAIModel = 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
export type AnthropicModel = 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229' | 'claude-3-haiku-20240307';

export interface AnalysisConfig {
  provider: LLMProvider;
  apiKey: string;
  model?: string;
  maxTokens?: number;
}

export interface AnalysisResult {
  content: string;
  tokenCount: number;
  cost: number;
  model: string;
  provider: LLMProvider;
}

export interface StreamingCallback {
  onToken: (token: string) => void;
  onComplete: (result: AnalysisResult) => void;
  onError: (error: Error) => void;
}

// Token pricing (per 1K tokens) - Updated as of Nov 2024
const PRICING = {
  openai: {
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  },
  anthropic: {
    'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
    'claude-3-sonnet-20240229': { input: 0.003, output: 0.015 },
    'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
  },
};

/**
 * Create analysis prompt for a repository
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
 * Validate API key by making a test call
 */
export async function validateAPIKey(config: AnalysisConfig): Promise<boolean> {
  try {
    if (config.provider === 'openai') {
      const client = new OpenAI({
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true, // Client-side only for privacy
      });
      
      // Test with minimal completion
      await client.chat.completions.create({
        model: config.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Test' }],
        max_tokens: 5,
      });
      
      return true;
    } else {
      const client = new Anthropic({
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true,
      });
      
      // Test with minimal completion
      await client.messages.create({
        model: config.model || 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Test' }],
      });
      
      return true;
    }
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
}

/**
 * Estimate cost for analysis
 */
export function estimateCost(
  provider: LLMProvider,
  model: string,
  inputTokens: number = 500,
  outputTokens: number = 400
): number {
  const providerPricing = PRICING[provider];
  const modelPricing = (providerPricing as any)[model];
  
  if (!modelPricing) return 0;
  
  const inputCost = (inputTokens / 1000) * modelPricing.input;
  const outputCost = (outputTokens / 1000) * modelPricing.output;
  
  return inputCost + outputCost;
}

/**
 * Analyze repository with OpenAI (streaming)
 */
async function analyzeWithOpenAI(
  repository: RepositoryWithScore,
  config: AnalysisConfig,
  callbacks: StreamingCallback
): Promise<void> {
  const client = new OpenAI({
    apiKey: config.apiKey,
    dangerouslyAllowBrowser: true,
  });
  
  const model = config.model || 'gpt-4-turbo';
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
    
    // Calculate actual cost
    const inputTokens = Math.ceil(createAnalysisPrompt(repository).split(' ').length * 1.3);
    const cost = estimateCost('openai', model, inputTokens, tokenCount);
    
    callbacks.onComplete({
      content: fullContent,
      tokenCount: inputTokens + tokenCount,
      cost,
      model,
      provider: 'openai',
    });
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error('OpenAI API error'));
  }
}

/**
 * Analyze repository with Anthropic (streaming)
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
  
  const model = config.model || 'claude-3-sonnet-20240229';
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
    let tokenCount = 0;
    
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        const token = chunk.delta.text;
        fullContent += token;
        tokenCount++;
        callbacks.onToken(token);
      }
    }
    
    const message = await stream.finalMessage();
    
    // Calculate actual cost
    const inputTokens = message.usage.input_tokens;
    const outputTokens = message.usage.output_tokens;
    const cost = estimateCost('anthropic', model, inputTokens, outputTokens);
    
    callbacks.onComplete({
      content: fullContent,
      tokenCount: inputTokens + outputTokens,
      cost,
      model,
      provider: 'anthropic',
    });
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error('Anthropic API error'));
  }
}

/**
 * Main analysis function with streaming
 */
export async function analyzeRepository(
  repository: RepositoryWithScore,
  config: AnalysisConfig,
  callbacks: StreamingCallback
): Promise<void> {
  if (config.provider === 'openai') {
    return analyzeWithOpenAI(repository, config, callbacks);
  } else {
    return analyzeWithAnthropic(repository, config, callbacks);
  }
}

/**
 * Get default model for provider
 */
export function getDefaultModel(provider: LLMProvider): string {
  return provider === 'openai' ? 'gpt-4-turbo' : 'claude-3-sonnet-20240229';
}

/**
 * Get available models for provider
 */
export function getAvailableModels(provider: LLMProvider): Array<{ value: string; label: string; cost: string }> {
  if (provider === 'openai') {
    return [
      { value: 'gpt-4', label: 'GPT-4 (Most Capable)', cost: '$0.03-0.06/1K tokens' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (Recommended)', cost: '$0.01-0.03/1K tokens' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Fast)', cost: '$0.0005-0.0015/1K tokens' },
    ];
  } else {
    return [
      { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus (Most Capable)', cost: '$0.015-0.075/1K tokens' },
      { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet (Recommended)', cost: '$0.003-0.015/1K tokens' },
      { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (Fast)', cost: '$0.00025-0.00125/1K tokens' },
    ];
  }
}
