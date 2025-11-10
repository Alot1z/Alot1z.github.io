/**
 * Local LLM Model Detection
 * Dynamically fetch available models from running local services
 */

export interface LocalModel {
  name: string;
  size?: number;
  modified?: string;
  details?: any;
}

export interface LocalServiceStatus {
  available: boolean;
  models: LocalModel[];
  error?: string;
}

/**
 * Detect Ollama and fetch available models
 */
export async function detectOllamaModels(): Promise<LocalServiceStatus> {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });

    if (!response.ok) {
      return { available: false, models: [], error: 'Ollama not responding' };
    }

    const data = await response.json();
    const models = data.models?.map((model: any) => ({
      name: model.name,
      size: model.size,
      modified: model.modified_at,
      details: model.details,
    })) || [];

    return { available: true, models };
  } catch (error) {
    return { 
      available: false, 
      models: [], 
      error: error instanceof Error ? error.message : 'Connection failed' 
    };
  }
}

/**
 * Detect LM Studio and fetch available models
 */
export async function detectLMStudioModels(): Promise<LocalServiceStatus> {
  try {
    const response = await fetch('http://localhost:1234/v1/models', {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return { available: false, models: [], error: 'LM Studio not responding' };
    }

    const data = await response.json();
    const models = data.data?.map((model: any) => ({
      name: model.id,
      details: model,
    })) || [];

    return { available: true, models };
  } catch (error) {
    return { 
      available: false, 
      models: [], 
      error: error instanceof Error ? error.message : 'Connection failed' 
    };
  }
}

/**
 * Detect LocalAI and fetch available models
 */
export async function detectLocalAIModels(): Promise<LocalServiceStatus> {
  try {
    const response = await fetch('http://localhost:8080/v1/models', {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return { available: false, models: [], error: 'LocalAI not responding' };
    }

    const data = await response.json();
    const models = data.data?.map((model: any) => ({
      name: model.id,
      details: model,
    })) || [];

    return { available: true, models };
  } catch (error) {
    return { 
      available: false, 
      models: [], 
      error: error instanceof Error ? error.message : 'Connection failed' 
    };
  }
}

/**
 * Detect all local LLM services and their models
 */
export async function detectAllLocalLLMs(): Promise<{
  ollama: LocalServiceStatus;
  lmstudio: LocalServiceStatus;
  localai: LocalServiceStatus;
}> {
  const [ollama, lmstudio, localai] = await Promise.all([
    detectOllamaModels(),
    detectLMStudioModels(),
    detectLocalAIModels(),
  ]);

  return { ollama, lmstudio, localai };
}

/**
 * Get model display name from technical name
 */
export function getModelDisplayName(technicalName: string): string {
  // Remove common suffixes and format nicely
  let name = technicalName;
  
  // Remove version tags
  name = name.replace(/:\d+b?$/i, '');
  name = name.replace(/:\w+$/i, '');
  
  // Format common models
  const formatMap: Record<string, string> = {
    'llama2': 'Llama 2',
    'llama2:7b': 'Llama 2 7B',
    'llama2:13b': 'Llama 2 13B',
    'llama2:70b': 'Llama 2 70B',
    'codellama': 'Code Llama',
    'mistral': 'Mistral 7B',
    'mixtral': 'Mixtral 8x7B',
    'phi': 'Phi 2',
    'gemma': 'Gemma',
    'vicuna': 'Vicuna',
    'orca': 'Orca',
    'neural-chat': 'Neural Chat',
  };

  const lowerName = name.toLowerCase();
  for (const [key, value] of Object.entries(formatMap)) {
    if (lowerName.includes(key)) {
      return value;
    }
  }

  // Capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Format model size to human-readable format
 */
export function formatModelSize(bytes?: number): string {
  if (!bytes) return '';
  
  const gb = bytes / (1024 ** 3);
  if (gb >= 1) {
    return `${gb.toFixed(1)} GB`;
  }
  
  const mb = bytes / (1024 ** 2);
  return `${mb.toFixed(0)} MB`;
}

/**
 * Check if a local service is available (quick check without fetching models)
 */
export async function quickCheckLocalService(endpoint: string): Promise<boolean> {
  try {
    const response = await fetch(endpoint, {
      method: 'HEAD',
      signal: AbortSignal.timeout(1000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
