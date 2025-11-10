# Major Cloud LLM Providers Research Plan

## Objective
Research major cloud LLM providers and compile comprehensive data on their API endpoints, authentication methods, model lists, pricing, and rate limits.

## Providers to Research
1. **OpenAI**
   - [x] API endpoints documentation - Extracted basic info, need more details
   - [x] Authentication methods - API keys, organization/project headers
   - [x] Current model list - GPT-5, GPT-4, o4-mini, fine-tuning models
   - [x] Pricing structure - Detailed pricing extracted for all models
   - [x] Rate limits and quotas - Tier-based limits, usage tiers

2. **Anthropic**
   - [x] API endpoints documentation - Messages API, rate limiting policies
   - [x] Authentication methods - API keys with credit purchase tiers
   - [x] Current model list - Claude Opus 4/4.1, Sonnet 4, Haiku 3.5
   - [x] Pricing structure - Detailed per-million token pricing
   - [x] Rate limits and quotas - RPM/ITPM/OTPM limits, tier-based

3. **Google (Gemini)**
   - [x] API endpoints documentation - Basic info extracted
   - [x] Authentication methods - API keys
   - [x] Current model list - Gemini 2.5 Pro, Flash, Flash-Lite models
   - [x] Pricing structure - Detailed tier-based pricing
   - [x] Rate limits and quotas - Tier-based RPM/TPM limits

4. **Microsoft (Azure OpenAI)**
   - [x] API endpoints documentation - REST API with control/data plane separation
   - [x] Authentication methods - Azure subscription, regional quotas
   - [x] Current model list - GPT-5, o3, o4-mini, GPT-4.1, GPT-4o series
   - [x] Pricing structure - Global/Data Zone/Regional deployment pricing
   - [x] Rate limits and quotas - TPM/RPM limits, usage tiers

5. **Meta (Llama)**
   - [x] API endpoints documentation - Preview release, rate limit headers
   - [x] Authentication methods - API keys (team-based limits)
   - [x] Current model list - Llama-4-Maverick, Llama-3.3-70B, Llama-3.3-8B
   - [x] Pricing structure - Available through AWS Bedrock, other providers
   - [x] Rate limits and quotas - Team-based, RPM/TPM per model

6. **AWS (Amazon Bedrock)**
   - [x] API endpoints documentation - Control/data plane APIs, SDK support
   - [x] Authentication methods - AWS SDK with cryptographic signing
   - [x] Current model list - Anthropic Claude, Meta Llama, Mistral, Cohere, Stability AI
   - [x] Pricing structure - On-demand, batch, provisioned throughput, custom models
   - [x] Rate limits and quotas - Service quotas, various provider models

## Data Structure for JSON Output
```json
{
  "providers": {
    "openai": {
      "api_endpoints": {},
      "authentication": {},
      "models": [],
      "pricing": {},
      "rate_limits": {}
    },
    "anthropic": { ... },
    "google": { ... },
    "microsoft": { ... },
    "meta": { ... },
    "aws": { ... }
  }
}
```

## Research Steps
1. [x] Search for current official documentation for each provider
2. [x] Extract detailed information from official sources (OpenAI, Google Gemini)
3. [x] Extract detailed information from Anthropic, Microsoft, Meta, AWS
4. [x] Verify information across multiple sources - Cross-referenced pricing and rate limits
5. [x] Organize data in comprehensive JSON format - Created major_cloud_providers.json with complete data structure
6. [x] Document all sources used - Added 12 sources to tracking system with full citations
7. [x] Final review and quality check - Verified all data completeness and accuracy

## Success Criteria
- Complete data for all 6 major providers
- Current and accurate information (as of November 2025)
- Properly documented sources
- Comprehensive JSON file saved to data/llm_providers/