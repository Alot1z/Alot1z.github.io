/**
 * Universal LLM Provider Configuration
 * Supports 15+ LLM providers including cloud and local models
 */

export type LLMProvider = 
  // Tier 1: Major Cloud Providers
  | 'openai'
  | 'anthropic'
  | 'zai'          // Z.ai (GLM models)
  | 'google'       // Google Gemini
  | 'deepseek'     // DeepSeek models
  | 'mistral'      // Mistral AI
  | 'cohere'       // Cohere
  // Tier 2: Specialized Providers
  | 'huggingface'  // Hugging Face Inference API
  | 'replicate'    // Replicate
  | 'together'     // Together AI
  | 'perplexity'   // Perplexity AI
  | 'fireworks'    // Fireworks AI
  // Tier 3: Local LLM Support
  | 'ollama'       // Ollama local
  | 'lmstudio'     // LM Studio
  | 'localai'      // LocalAI
  | 'custom';      // Custom OpenAI-compatible endpoint

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  pricing?: {
    input: number;   // per 1K tokens
    output: number;  // per 1K tokens
  };
}

export interface ProviderConfig {
  id: LLMProvider;
  name: string;
  description: string;
  website: string;
  apiEndpoint: string;
  requiresAuth: boolean;
  supportsStreaming: boolean;
  models: ModelInfo[];
  defaultModel: string;
  authType: 'bearer' | 'api-key' | 'none' | 'custom';
  rateLimit?: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
  isLocal?: boolean;
  setupInstructions?: string;
}

// Provider configurations
export const PROVIDER_CONFIGS: Record<LLMProvider, ProviderConfig> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    description: 'Industry-leading models including GPT-4 and GPT-3.5',
    website: 'https://platform.openai.com',
    apiEndpoint: 'https://api.openai.com/v1',
    requiresAuth: true,
    supportsStreaming: true,
    authType: 'bearer',
    defaultModel: 'gpt-4-turbo',
    models: [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        description: 'Most capable model, best for complex tasks',
        contextWindow: 8192,
        pricing: { input: 0.03, output: 0.06 }
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: 'Faster and more affordable GPT-4',
        contextWindow: 128000,
        pricing: { input: 0.01, output: 0.03 }
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Multimodal flagship model',
        contextWindow: 128000,
        pricing: { input: 0.005, output: 0.015 }
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and efficient for most tasks',
        contextWindow: 16385,
        pricing: { input: 0.0005, output: 0.0015 }
      }
    ]
  },

  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude models with strong reasoning and safety',
    website: 'https://www.anthropic.com',
    apiEndpoint: 'https://api.anthropic.com/v1',
    requiresAuth: true,
    supportsStreaming: true,
    authType: 'api-key',
    defaultModel: 'claude-3-sonnet-20240229',
    models: [
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        description: 'Most capable Claude model',
        contextWindow: 200000,
        pricing: { input: 0.015, output: 0.075 }
      },
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        description: 'Balanced performance and speed',
        contextWindow: 200000,
        pricing: { input: 0.003, output: 0.015 }
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        description: 'Fastest Claude model',
        contextWindow: 200000,
        pricing: { input: 0.00025, output: 0.00125 }
      }
    ]
  },

  zai: {
    id: 'zai',
    name: 'Z.ai (GLM)',
    description: 'Zhipu AI GLM series - powerful Chinese and English models',
    website: 'https://open.bigmodel.cn',
    apiEndpoint: 'https://open.bigmodel.cn/api/paas/v4',
    requiresAuth: true,
    supportsStreaming: true,
    authType: 'bearer',
    defaultModel: 'glm-4',
    models: [
      {
        id: 'glm-4',
        name: 'GLM-4',
        description: 'Latest GLM-4 model with enhanced capabilities',
        contextWindow: 128000,
        pricing: { input: 0.01, output: 0.01 }
      },
      {
        id: 'glm-4v',
        name: 'GLM-4V',
        description: 'Multimodal GLM-4 with vision capabilities',
        contextWindow: 2000,
        pricing: { input: 0.01, output: 0.01 }
      },
      {
        id: 'glm-3-turbo',
        name: 'GLM-3 Turbo',
        description: 'Fast and efficient GLM-3',
        contextWindow: 128000,
        pricing: { input: 0.0005, output: 0.0005 }
      }
    ]
  },

  google: {
    id: 'google',
    name: 'Google',
    description: 'Gemini models with multimodal capabilities',
    website: 'https://ai.google.dev',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1',
    requiresAuth: true,
    supportsStreaming: true,
    authType: 'api-key',
    defaultModel: 'gemini-pro',
    models: [
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        description: 'Best model for text tasks',
        contextWindow: 32760,
        pricing: { input: 0.00025, output: 0.0005 }
      },
      {
        id: 'gemini-pro-vision',
        name: 'Gemini Pro Vision',
        description: 'Multimodal model with vision',
        contextWindow: 16384,
        pricing: { input: 0.00025, output: 0.0005 }
      },
      {
        id: 'gemini-ultra',
        name: 'Gemini Ultra',
        description: 'Most capable Gemini model',
        contextWindow: 32760,
        pricing: { input: 0.00125, output: 0.00375 }
      }
    ]
  },

  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'Specialized models for chat and coding',
    website: 'https://www.deepseek.com',
    apiEndpoint: 'https://api.deepseek.com/v1',
    requiresAuth: true,
    supportsStreaming: true,
    authType: 'bearer',
    defaultModel: 'deepseek-chat',
    models: [
      {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        description: 'General purpose chat model',
        contextWindow: 32768,
        pricing: { input: 0.0001, output: 0.0002 }
      },
      {
        id: 'deepseek-coder',
        name: 'DeepSeek Coder',
        description: 'Specialized for code generation',
        contextWindow: 16384,
        pricing: { input: 0.0001, output: 0.0002 }
      }
    ]
  },

  mistral: {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'High-performance open models',
    website: 'https://mistral.ai',
    apiEndpoint: 'https://api.mistral.ai/v1',
    requiresAuth: true,
    supportsStreaming: true,
    authType: 'bearer',
    defaultModel: 'mistral-medium',
    models: [
      {
        id: 'mistral-large',
        name: 'Mistral Large',
        description: 'Most capable Mistral model',
        contextWindow: 32000,
        pricing: { input: 0.008, output: 0.024 }
      },
      {
        id: 'mistral-medium',
        name: 'Mistral Medium',
        description: 'Balanced performance',
        contextWindow: 32000,
        pricing: { input: 0.0027, output: 0.0081 }
      },
      {
        id: 'mistral-small',
        name: 'Mistral Small',
        description: 'Fast and efficient',
        contextWindow: 32000,
        pricing: { input: 0.001, output: 0.003 }
      }
    ]
  },

  cohere: {
    id: 'cohere',
    name: 'Cohere',
    description: 'Enterprise-grade language models',
    website: 'https://cohere.com',
    apiEndpoint: 'https://api.cohere.ai/v1',
    requiresAuth: true,
    supportsStreaming: true,
    authType: 'bearer',
    defaultModel: 'command-r',
    models: [
      {
        id: 'command-r-plus',
        name: 'Command R+',
        description: 'Most capable Command model',
        contextWindow: 128000,
        pricing: { input: 0.003, output: 0.015 }
      },
      {
        id: 'command-r',
        name: 'Command R',
        description: 'Balanced RAG-optimized model',
        contextWindow: 128000,
        pricing: { input: 0.0005, output: 0.0015 }
      },
      {
        id: 'command',
        name: 'Command',
        description: 'General purpose model',
        contextWindow: 4096,
        pricing: { input: 0.001, output: 0.002 }
      }
    ]
  },

  huggingface: {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'Access to thousands of open source models',
    website: 'https://huggingface.co',
    apiEndpoint: 'https://api-inference.huggingface.co/models',
    requiresAuth: true,
    supportsStreaming: false,
    authType: 'bearer',
    defaultModel: 'meta-llama/Llama-2-70b-chat-hf',
    models: [
      {
        id: 'meta-llama/Llama-2-70b-chat-hf',
        name: 'Llama 2 70B',
        description: 'Meta\'s open source model',
        contextWindow: 4096
      },
      {
        id: 'mistralai/Mistral-7B-Instruct-v0.2',
        name: 'Mistral 7B',
        description: 'Efficient open model',
        contextWindow: 8192
      },
      {
        id: 'bigcode/starcoder',
        name: 'StarCoder',
        description: 'Code generation model',
        contextWindow: 8192
      }
    ]
  },

  replicate: {
    id: 'replicate',
    name: 'Replicate',
    description: 'Run open source models at scale',
    website: 'https://replicate.com',
    apiEndpoint: 'https://api.replicate.com/v1',
    requiresAuth: true,
    supportsStreaming: true,
    authType: 'bearer',
    defaultModel: 'meta/llama-2-70b-chat',
    models: [
      {
        id: 'meta/llama-2-70b-chat',
        name: 'Llama 2 70B Chat',
        description: 'Meta\'s Llama 2 on Replicate',
        contextWindow: 4096
      }
    ]
  },

  together: {
    id: 'together',
    name: 'Together AI',
    description: 'Fast inference for open source models',
    website: 'https://together.ai',
    apiEndpoint: 'https://api.together.xyz/v1',
    requiresAuth: true,
    supportsStreaming: true,
    authType: 'bearer',
    defaultModel: 'togethercomputer/llama-2-70b-chat',
    models: [
      {
        id: 'togethercomputer/llama-2-70b-chat',
        name: 'Llama 2 70B',
        description: 'Fast Llama 2 inference',
        contextWindow: 4096,
        pricing: { input: 0.0009, output: 0.0009 }
      }
    ]
  },

  perplexity: {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Search-optimized language models',
    website: 'https://www.perplexity.ai',
    apiEndpoint: 'https://api.perplexity.ai',
    requiresAuth: true,
    supportsStreaming: true,
    authType: 'bearer',
    defaultModel: 'sonar-medium-online',
    models: [
      {
        id: 'sonar-medium-online',
        name: 'Sonar Medium Online',
        description: 'Search-enhanced model',
        contextWindow: 12000,
        pricing: { input: 0.0006, output: 0.0006 }
      }
    ]
  },

  fireworks: {
    id: 'fireworks',
    name: 'Fireworks AI',
    description: 'Fast inference platform',
    website: 'https://fireworks.ai',
    apiEndpoint: 'https://api.fireworks.ai/inference/v1',
    requiresAuth: true,
    supportsStreaming: true,
    authType: 'bearer',
    defaultModel: 'accounts/fireworks/models/llama-v2-70b-chat',
    models: [
      {
        id: 'accounts/fireworks/models/llama-v2-70b-chat',
        name: 'Llama 2 70B',
        description: 'Fast Llama 2 on Fireworks',
        contextWindow: 4096,
        pricing: { input: 0.0009, output: 0.0009 }
      }
    ]
  },

  ollama: {
    id: 'ollama',
    name: 'Ollama',
    description: 'Run LLMs locally on your machine',
    website: 'https://ollama.ai',
    apiEndpoint: 'http://localhost:11434/api',
    requiresAuth: false,
    supportsStreaming: true,
    authType: 'none',
    defaultModel: 'llama2',
    isLocal: true,
    setupInstructions: 'Install Ollama from ollama.ai and run "ollama pull llama2"',
    models: [
      {
        id: 'llama2',
        name: 'Llama 2',
        description: 'Meta\'s open source model (local)',
        contextWindow: 4096
      },
      {
        id: 'codellama',
        name: 'Code Llama',
        description: 'Code-specialized model (local)',
        contextWindow: 16384
      },
      {
        id: 'mistral',
        name: 'Mistral',
        description: 'Efficient 7B model (local)',
        contextWindow: 8192
      }
    ]
  },

  lmstudio: {
    id: 'lmstudio',
    name: 'LM Studio',
    description: 'Desktop app for running local LLMs',
    website: 'https://lmstudio.ai',
    apiEndpoint: 'http://localhost:1234/v1',
    requiresAuth: false,
    supportsStreaming: true,
    authType: 'none',
    defaultModel: 'local-model',
    isLocal: true,
    setupInstructions: 'Download LM Studio, load a model, and start the local server',
    models: [
      {
        id: 'local-model',
        name: 'Local Model',
        description: 'Any model loaded in LM Studio',
        contextWindow: 4096
      }
    ]
  },

  localai: {
    id: 'localai',
    name: 'LocalAI',
    description: 'Self-hosted OpenAI-compatible API',
    website: 'https://localai.io',
    apiEndpoint: 'http://localhost:8080/v1',
    requiresAuth: false,
    supportsStreaming: true,
    authType: 'none',
    defaultModel: 'gpt-3.5-turbo',
    isLocal: true,
    setupInstructions: 'Install LocalAI and configure your models',
    models: [
      {
        id: 'gpt-3.5-turbo',
        name: 'Local GPT-3.5',
        description: 'OpenAI-compatible local model',
        contextWindow: 4096
      }
    ]
  },

  custom: {
    id: 'custom',
    name: 'Custom Endpoint',
    description: 'Use any OpenAI-compatible API endpoint',
    website: '',
    apiEndpoint: '',
    requiresAuth: true,
    supportsStreaming: true,
    authType: 'custom',
    defaultModel: 'gpt-3.5-turbo',
    models: [
      {
        id: 'gpt-3.5-turbo',
        name: 'Custom Model',
        description: 'OpenAI-compatible model',
        contextWindow: 4096
      }
    ]
  }
};

// Helper functions
export function getProviderConfig(provider: LLMProvider): ProviderConfig {
  return PROVIDER_CONFIGS[provider];
}

export function getAllProviders(): ProviderConfig[] {
  return Object.values(PROVIDER_CONFIGS);
}

export function getCloudProviders(): ProviderConfig[] {
  return getAllProviders().filter(p => !p.isLocal);
}

export function getLocalProviders(): ProviderConfig[] {
  return getAllProviders().filter(p => p.isLocal);
}

export function getProvidersByTier(): { tier1: ProviderConfig[], tier2: ProviderConfig[], tier3: ProviderConfig[] } {
  return {
    tier1: ['openai', 'anthropic', 'zai', 'google', 'deepseek', 'mistral', 'cohere'].map(id => PROVIDER_CONFIGS[id as LLMProvider]),
    tier2: ['huggingface', 'replicate', 'together', 'perplexity', 'fireworks'].map(id => PROVIDER_CONFIGS[id as LLMProvider]),
    tier3: ['ollama', 'lmstudio', 'localai', 'custom'].map(id => PROVIDER_CONFIGS[id as LLMProvider])
  };
}

export function estimateCost(provider: LLMProvider, model: string, inputTokens: number, outputTokens: number): number {
  const config = getProviderConfig(provider);
  const modelInfo = config.models.find(m => m.id === model);
  
  if (!modelInfo?.pricing) return 0;
  
  const inputCost = (inputTokens / 1000) * modelInfo.pricing.input;
  const outputCost = (outputTokens / 1000) * modelInfo.pricing.output;
  
  return inputCost + outputCost;
}
