# API Documentation

Complete guide to all 15+ LLM provider integrations in the Universal GitHub Stars Explorer.

## Table of Contents

- [Provider Overview](#provider-overview)
- [Tier 1: Major Cloud Providers](#tier-1-major-cloud-providers)
- [Tier 2: Specialized Providers](#tier-2-specialized-providers)
- [Tier 3: Local & Custom](#tier-3-local--custom)
- [Integration Guide](#integration-guide)
- [Rate Limits](#rate-limits)
- [Cost Optimization](#cost-optimization)

## Provider Overview

All providers follow the same integration pattern with provider-specific configurations. The system automatically handles:

- Authentication (Bearer tokens, API keys, or none for local)
- Streaming support (where available)
- Rate limiting and retries
- Cost calculation and tracking
- Error handling

### Provider Configuration Structure

```typescript
interface ProviderConfig {
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
  isLocal?: boolean;
}
```

## Tier 1: Major Cloud Providers

### 1. OpenAI

**Website**: [platform.openai.com](https://platform.openai.com)

**API Endpoint**: `https://api.openai.com/v1`

**Authentication**: Bearer token

**Models**:
- `gpt-4`: Most capable, best for complex analysis ($0.03/$0.06 per 1K tokens)
- `gpt-4-turbo`: Faster and more affordable GPT-4 ($0.01/$0.03 per 1K tokens)
- `gpt-4o`: Multimodal flagship model ($0.005/$0.015 per 1K tokens)
- `gpt-3.5-turbo`: Fast and efficient ($0.0005/$0.0015 per 1K tokens)

**Getting API Key**:
1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Navigate to API Keys section
3. Create new secret key
4. Add billing information

**Example Usage**:
```typescript
{
  provider: 'openai',
  apiKey: 'sk-...',
  model: 'gpt-4-turbo'
}
```

### 2. Anthropic

**Website**: [console.anthropic.com](https://console.anthropic.com)

**API Endpoint**: `https://api.anthropic.com/v1`

**Authentication**: API key (x-api-key header)

**Models**:
- `claude-3-opus-20240229`: Most capable Claude ($0.015/$0.075 per 1K tokens)
- `claude-3-sonnet-20240229`: Balanced performance ($0.003/$0.015 per 1K tokens)
- `claude-3-haiku-20240307`: Fastest and most affordable ($0.00025/$0.00125 per 1K tokens)

**Getting API Key**:
1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Request API access
3. Generate API key in console

**Features**:
- 200K context window
- Strong reasoning capabilities
- Excellent safety features

### 3. Z.ai (GLM)

**Website**: [open.bigmodel.cn](https://open.bigmodel.cn)

**API Endpoint**: `https://open.bigmodel.cn/api/paas/v4`

**Authentication**: Bearer token

**Models**:
- `glm-4`: Latest GLM-4 with enhanced capabilities ($0.01/$0.01 per 1K tokens)
- `glm-4v`: Multimodal GLM-4 with vision
- `glm-3-turbo`: Fast and efficient ($0.0005/$0.0005 per 1K tokens)

**Getting API Key**:
1. Register at [open.bigmodel.cn](https://open.bigmodel.cn)
2. Complete verification
3. Generate API key

**Special Features**:
- Excellent Chinese and English support
- Competitive pricing
- Large context windows (128K tokens)

### 4. Google Gemini

**Website**: [ai.google.dev](https://ai.google.dev)

**API Endpoint**: `https://generativelanguage.googleapis.com/v1`

**Authentication**: API key (URL parameter)

**Models**:
- `gemini-pro`: Best for text tasks ($0.00025/$0.0005 per 1K tokens)
- `gemini-pro-vision`: Multimodal with vision capabilities
- `gemini-ultra`: Most capable (waitlist)

**Getting API Key**:
1. Visit [ai.google.dev](https://ai.google.dev)
2. Sign in with Google account
3. Generate API key

**Features**:
- Very affordable pricing
- Large context window (32K tokens)
- Multimodal capabilities

### 5. DeepSeek

**Website**: [www.deepseek.com](https://www.deepseek.com)

**API Endpoint**: `https://api.deepseek.com/v1`

**Authentication**: Bearer token

**Models**:
- `deepseek-chat`: General purpose chat ($0.0001/$0.0002 per 1K tokens)
- `deepseek-coder`: Specialized for code generation

**Features**:
- Extremely affordable
- Strong coding capabilities
- Fast response times

### 6. Mistral AI

**Website**: [mistral.ai](https://mistral.ai)

**API Endpoint**: `https://api.mistral.ai/v1`

**Authentication**: Bearer token

**Models**:
- `mistral-large`: Most capable ($0.008/$0.024 per 1K tokens)
- `mistral-medium`: Balanced performance ($0.0027/$0.0081 per 1K tokens)
- `mistral-small`: Fast and efficient ($0.001/$0.003 per 1K tokens)

**Features**:
- Strong open-source models
- European company (GDPR compliant)
- Good performance/cost ratio

### 7. Cohere

**Website**: [cohere.com](https://cohere.com)

**API Endpoint**: `https://api.cohere.ai/v1`

**Authentication**: Bearer token

**Models**:
- `command-r-plus`: Most capable with RAG ($0.003/$0.015 per 1K tokens)
- `command-r`: RAG-optimized ($0.0005/$0.0015 per 1K tokens)
- `command`: General purpose ($0.001/$0.002 per 1K tokens)

**Features**:
- Enterprise-grade
- Excellent for retrieval-augmented generation
- Large context windows (128K tokens)

## Tier 2: Specialized Providers

### 8. Hugging Face

**Website**: [huggingface.co](https://huggingface.co)

**API Endpoint**: `https://api-inference.huggingface.co/models`

**Authentication**: Bearer token

**Models**: 10,000+ open source models including:
- `meta-llama/Llama-2-70b-chat-hf`
- `mistralai/Mistral-7B-Instruct-v0.2`
- `bigcode/starcoder`

**Getting API Key**:
1. Sign up at [huggingface.co](https://huggingface.co)
2. Go to Settings > Access Tokens
3. Create new token

**Features**:
- Access to thousands of models
- Free tier available
- Model flexibility

### 9. Replicate

**Website**: [replicate.com](https://replicate.com)

**API Endpoint**: `https://api.replicate.com/v1`

**Authentication**: Bearer token

**Features**:
- Run open source models at scale
- Pay-per-use pricing
- No infrastructure management

### 10. Together AI

**Website**: [together.ai](https://together.ai)

**API Endpoint**: `https://api.together.xyz/v1`

**Authentication**: Bearer token

**Features**:
- Fast inference for open models
- Competitive pricing ($0.0009/$0.0009 per 1K tokens)
- High throughput

### 11. Perplexity

**Website**: [perplexity.ai](https://www.perplexity.ai)

**API Endpoint**: `https://api.perplexity.ai`

**Authentication**: Bearer token

**Models**:
- `sonar-medium-online`: Search-enhanced model

**Features**:
- Search-augmented responses
- Real-time information
- Citation support

### 12. Fireworks AI

**Website**: [fireworks.ai](https://fireworks.ai)

**API Endpoint**: `https://api.fireworks.ai/inference/v1`

**Authentication**: Bearer token

**Features**:
- High-speed inference
- Multiple open source models
- Affordable pricing

## Tier 3: Local & Custom

### 13. Ollama

**Website**: [ollama.ai](https://ollama.ai)

**API Endpoint**: `http://localhost:11434/api`

**Authentication**: None (local)

**Setup**:
```bash
# Install Ollama
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows: Download from ollama.ai

# Pull a model
ollama pull llama2
ollama pull codellama
ollama pull mistral

# Start server (usually auto-starts)
ollama serve
```

**Available Models**:
- `llama2`: Meta's Llama 2 (7B, 13B, 70B)
- `codellama`: Code-specialized Llama
- `mistral`: Mistral 7B
- `phi`: Microsoft's Phi models
- Many more at [ollama.ai/library](https://ollama.ai/library)

**Features**:
- Completely free
- Runs on your hardware
- No API key needed
- Full privacy

### 14. LM Studio

**Website**: [lmstudio.ai](https://lmstudio.ai)

**API Endpoint**: `http://localhost:1234/v1`

**Authentication**: None (local)

**Setup**:
1. Download LM Studio from [lmstudio.ai](https://lmstudio.ai)
2. Launch application
3. Browse and download models
4. Load a model
5. Start local server

**Features**:
- User-friendly GUI
- Model management
- OpenAI-compatible API
- Hardware optimization

### 15. LocalAI

**Website**: [localai.io](https://localai.io)

**API Endpoint**: `http://localhost:8080/v1`

**Authentication**: None (local)

**Setup**:
```bash
# Docker installation
docker run -p 8080:8080 --name local-ai -ti \
  localai/localai:latest

# Download models
curl http://localhost:8080/models/apply \
  -H "Content-Type: application/json" \
  -d '{"id": "TheBloke/Mistral-7B-Instruct-v0.1-GGUF"}'
```

**Features**:
- Self-hosted OpenAI API
- Multiple model support
- Docker deployment
- Enterprise-ready

### 16. Custom Endpoint

**Configuration**: Any OpenAI-compatible API

**Setup**:
1. Enter custom endpoint URL
2. Provide API key (if required)
3. Select model name

**Use Cases**:
- Enterprise internal APIs
- Azure OpenAI
- Vertex AI (Google Cloud)
- Self-hosted solutions
- Development/testing environments

## Integration Guide

### Adding a New Provider

1. **Define Provider Configuration** in `providers-config.ts`:
```typescript
myProvider: {
  id: 'my-provider',
  name: 'My Provider',
  description: 'Description',
  website: 'https://example.com',
  apiEndpoint: 'https://api.example.com/v1',
  requiresAuth: true,
  supportsStreaming: true,
  authType: 'bearer',
  defaultModel: 'model-name',
  models: [...]
}
```

2. **Implement API Client** in `llm-api-universal.ts`:
```typescript
async function analyzeWithMyProvider(
  repository: RepositoryWithScore,
  config: AnalysisConfig,
  callbacks: StreamingCallback
): Promise<void> {
  // Implementation
}
```

3. **Add to Router** in `analyzeRepository()`:
```typescript
case 'my-provider':
  return analyzeWithMyProvider(repository, config, callbacks);
```

## Rate Limits

Provider rate limits (typical free tier):

| Provider | Requests/min | Tokens/min | Notes |
|----------|--------------|------------|-------|
| OpenAI | 60 | 90,000 | Tier-based |
| Anthropic | 50 | 100,000 | Increases with usage |
| Google | 60 | 32,000 | Per minute |
| Z.ai (GLM) | 20 | 60,000 | Per minute |
| DeepSeek | 60 | 100,000 | Very generous |
| Hugging Face | 100 | Varies | Model dependent |
| Local (All) | Unlimited | Unlimited | Hardware limited |

Rate limiting is handled automatically with exponential backoff.

## Cost Optimization

### Tips for Reducing Costs

1. **Choose the Right Model**:
   - Use cheaper models for simple analysis (GPT-3.5, Claude Haiku, GLM-3 Turbo)
   - Reserve premium models for complex tasks

2. **Use Local LLMs When Possible**:
   - Ollama, LM Studio, LocalAI are completely free
   - Good for development and high-volume usage

3. **Leverage Caching**:
   - Analysis results are cached locally
   - Avoid re-analyzing same repositories

4. **Compare Providers**:
   - DeepSeek and Gemini offer best value
   - Claude Haiku is most affordable premium option
   - GLM-4 competitive for Chinese/English content

5. **Set Budget Alerts**:
   - Monitor usage in provider dashboards
   - Set spending limits

### Cost Comparison Example

For analyzing 100 repositories (avg 500 input + 400 output tokens each):

| Provider | Total Cost | Cost/Analysis |
|----------|-----------|---------------|
| DeepSeek Chat | $0.04 | $0.0004 |
| Gemini Pro | $0.06 | $0.0006 |
| Claude 3 Haiku | $0.06 | $0.0006 |
| GLM-3 Turbo | $0.09 | $0.0009 |
| GPT-3.5 Turbo | $0.09 | $0.0009 |
| GPT-4o | $0.55 | $0.0055 |
| Claude 3 Sonnet | $0.81 | $0.0081 |
| GPT-4 Turbo | $1.30 | $0.0130 |
| Claude 3 Opus | $3.60 | $0.0360 |
| Local LLMs | $0.00 | $0.0000 |

## Troubleshooting

### Common Issues

**API Key Invalid**:
- Verify key is correct
- Check billing is enabled
- Ensure key has correct permissions

**Rate Limit Exceeded**:
- Wait for rate limit reset
- Upgrade to higher tier
- Use local LLM as fallback

**Network Errors**:
- Check internet connection
- Verify firewall settings
- Try different provider

**Local LLM Not Detected**:
- Ensure Ollama/LM Studio is running
- Check correct port (11434 for Ollama, 1234 for LM Studio)
- Verify model is loaded

## Support

For provider-specific issues:
- Check provider's official documentation
- Review status pages for outages
- Contact provider support

For integration issues:
- Report on [GitHub Issues](https://github.com/yourusername/github-stars-explorer/issues)
- Check existing issues for solutions
