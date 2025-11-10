# Open Source LLM Providers: API Endpoints, Model Availability, Pricing, and Authentication (2025)

## Executive Summary

The open-source large language model (LLM) ecosystem has matured into a rich marketplace of inference providers, tooling, and deployment options. This report presents a comparative analysis of five prominent platforms that expose open-weight models via production-grade APIs: Hugging Face Inference Providers, Replicate, Together AI, Groq, and Reka AI. It distills how to access their APIs, which models and tasks are supported, how pricing works, and how teams should authenticate, govern, and integrate these services.

Three themes define the current landscape. First, OpenAI compatibility has become a de facto standard, allowing teams to re-use familiar request schemas and client libraries across multiple providers. Hugging Face exposes an OpenAI-compatible router and Together AI is fully compatible with OpenAI’s APIs, while Groq and Reka AI also support OpenAI-style request shapes for chat and other modalities, which materially reduces integration friction and switching costs.[^12][^14][^6][^9] Second, multi-provider routing has moved from a convenience to a strategy. Hugging Face’s router provides centralized authentication and billing, automatic failover, and cost/performance hints (e.g., “cheapest” or “fastest”), enabling teams to dynamically balance quality, cost, and throughput without re-architecting their clients.[^12][^1] Third, pricing has diverged into two broad models. Token-based billing dominates text, vision, speech, and embeddings workloads (Together AI, Groq, Reka), while time-and-hardware billing remains prevalent for general-purpose, containerized inference and custom deployments (Replicate), with a growing subset of models billed by input/output at the model level.[^3][^5][^8][^10]

Several pricing highlights stand out. Groq publishes a wide menu of text models priced per million tokens, alongside automatic speech recognition (ASR) per-hour rates and a prompt-caching feature that discounts input tokens on cache hits, plus a Batch API that halves costs for asynchronous processing—useful for large backfills or offline workflows.[^5] Together AI lists granular per‑million‑token rates across text and vision models, per‑megapixel pricing for image generation, and per‑hour dedicated instance rates; it also offers code execution services and fine-tuning priced by dataset token counts with specialized minimums for certain families.[^3][^4] Replicate’s model pages provide model-specific estimates, and its core billing is either by hardware time (per second) or by model-defined input/output units (e.g., per image, per video second), offering flexibility and transparency.[^8][^10] Reka AI charges by 1M tokens for chat and per 1,000 requests for research, with multimodal add-ons (image/video/audio) priced separately—useful for multimodality-first agents and retrieval-heavy research flows.[^6]

Model availability is broad and evolving. Together AI advertises more than 200 open-source and specialized models spanning text, vision, image, audio, video, embeddings, reranking, and moderation; Groq lists an extensive roster that includes Llama 4 families, Qwen, GPT‑OSS, and safety models; Hugging Face’s router federates access to 200+ models across leading providers; Replicate hosts a mix of official and community models; and Reka focuses on its own chat and research families.[^15][^5][^1][^11][^6] For production teams, the differences are not only in model names but in reliability and governance: “Official” or “always-on” models at Replicate have predictable pricing and stability, while Hugging Face’s router emphasizes centralized controls, credits, and organization-level billing policies.[^11][^1]

Provider selection should begin with workload fit. For sustained high-throughput chat and structured tool use, Groq’s low-latency token pricing and batch options are compelling. For end-to-end platform flexibility (webhooks, deployments, server-side streaming) and operational observability, Replicate’s HTTP API is extensive. For broad, multi-provider access with unified billing and failover, Hugging Face’s router is uniquely positioned. For a balanced catalog of text, image, video, embeddings, and fine-tuning options with OpenAI compatibility and dedicated GPU endpoints, Together AI is a strong default. For multimodal research and native chat with per‑modality add‑ons, Reka AI should be considered.

Information gaps remain. Some public documentation does not publish rate limits, explicit REST base paths for certain SDK-driven interactions, or comprehensive per‑model overage policies. Dedicated endpoint hourly rates are well documented at Together AI, while per‑model per‑hour rates for dedicated hosting at other providers are less consistently presented. These uncertainties should be validated during implementation and vendor onboarding.

This report is implementation-focused. It summarizes endpoints and auth, compares pricing units and selected rates, maps model catalogs to modalities, and concludes with a decision framework and integration checklist to accelerate proofs of concept and production adoption.[^12][^3][^5][^8][^6]



## Methodology and Source Reliability

The analysis prioritizes official documentation, pricing pages, and API references from the providers under review. Where a platform exposes an OpenAI-compatible API, we cross-checked the compatibility notes and base URLs against the OpenAI API reference to ensure alignment of schemas and behaviors.[^14][^7] Pricing figures are taken directly from public provider pages, favoring per‑million‑token rates for text and vision, per‑megapixel for image generation, per‑hour or per‑second for compute-oriented billing, and model-specific examples for input/output pricing. Model availability was assessed using the providers’ catalogs and official statements about “always-on” or “official” models, which implies stability and predictable pricing.

Two limitations are worth noting. First, documentation is not uniformly comprehensive across all providers. In particular, some rate limits and REST base paths for SDK-oriented experiences are not explicitly published, requiring inference from SDKs or community examples. Second, model rosters and prices are updated frequently; therefore, any prices and model lists cited here should be validated at integration time. All citations in this report are public-facing sources listed in the References section.



## Provider Deep Dives

### Hugging Face Inference Providers

Hugging Face Inference Providers offer a single, consistent API to access hundreds of models from multiple inference providers. The design goal is to remove vendor lock-in, provide instant access, and enable production-grade performance with automatic failover. Tasks supported include chat completion for large language models and vision-language models, feature extraction (embeddings), text-to-image, text-to-video, and speech-to-text.[^12]

Access methods and endpoints. Developers can interact through official client libraries (Python and JavaScript) or via an OpenAI-compatible base path. The router exposes an OpenAI-compatible endpoint for chat at the path /v1/chat/completions. A GET /v1/models call enumerates available models across providers.[^12]

To illustrate the access surface, Table 1 summarizes the main interaction modes and the key request constructs.

Table 1. Hugging Face router access summary (tasks, base, auth, billing, and selection)
| Dimension | Summary |
|---|---|
| Supported tasks | Chat completion (LLM/VLM), feature extraction, text-to-image, text-to-video, speech-to-text, search & retrieval (embeddings), traditional ML tasks (classification, NER, summarization). |
| Base and paths | OpenAI-compatible base path with /v1/chat/completions for chat; GET /v1/models to list models. |
| SDKs | Python and JavaScript InferenceClient; drop-in replacement for OpenAI clients when using the router base. |
| Authentication | Bearer token (Hugging Face user access token). Fine-grained permissions for “Make calls to Inference Providers” are recommended. |
| Billing and credits | Pay-as-you-go; Hugging Face does not mark up provider rates. Monthly credits vary by plan (e.g., Free, Pro, Team/Enterprise); enterprise Hub includes shared credits and controls (e.g., spending limits, provider allowlists). |
| Organization billing | Centralized billing via X‑HF‑Bill‑To header (or SDK parameter bill_to). |
| Provider selection | Automatic routing with “:fastest” and “:cheapest” hints; explicit selection by provider name suffix (e.g., “:sambanova”). |

Source: Hugging Face Inference Providers documentation and pricing.[^12][^1]

Pricing model. Hugging Face charges pay‑as‑you‑go for routed requests without additional markup. Monthly credits are available depending on plan; for example, Free users have modest credits, Pro users have higher credits with pay‑as‑you‑go overage, and organizations receive per‑seat credits with centralized governance. When users opt to supply their own provider keys, billing shifts to the upstream provider and Hugging Face credits do not apply.[^1]

Model availability. The router federates 200+ models spanning tasks from chat to generation. Integrated providers include Cerebras, Cohere, Fal AI, Fireworks, Groq, Replicate, SambaNova, Scaleway, Together, and others. Automatic failover and server-side routing allow teams to trade off throughput and cost dynamically using the “:fastest” and “:cheapest” hints, or to pin to a specific provider if needed for compliance or performance reasons.[^12][^1]

Organization billing and governance. Enterprise Hub administrators can enable centralized billing, set spending limits, and restrict which inference providers are available. SDKs support the bill_to parameter and the X‑HF‑Bill‑To header to route costs to the correct cost center. Teams can track spend on the billing page.[^1]

Information gaps. The documentation reviewed does not publish explicit numeric rate limits for the router; the pricing and governance model is clearly documented, but some per‑provider specifics may require account-level settings or direct provider documentation.[^1][^12]



### Replicate

Replicate provides a general-purpose HTTP API for running predictions, managing models and versions, deploying to dedicated hardware, and handling files and collections. It supports both official “always-on” models and community-contributed models, including private deployments packaged with Cog.[^8][^11]

Endpoints and core resources. The API is versioned under /v1 and exposes the following resources: predictions (create/get/list/cancel), models (create/get/list/patch/delete, versions), deployments (create/get/list/patch/delete), files (upload/list/info/delete/download content), and collections (list/get).[^8] As of August 2025, the POST /v1/predictions endpoint can run any model (official or community) through a unified interface, simplifying client code and orchestration.[^11] Rate limits include 600 requests per minute for creating predictions and 3,000 requests per minute for other endpoints.[^8]

Table 2 distills the key endpoints and typical usage.

Table 2. Replicate HTTP API endpoints and rate limits
| Method | Path | Purpose | Rate Limit (indicative) | Notes |
|---|---|---|---|---|
| POST | /v1/predictions | Create a prediction | 600 rpm | Unified endpoint for all models; supports Prefer: wait, Cancel-After headers. |
| GET | /v1/predictions/{id} | Get prediction | 3,000 rpm | Returns status, output (files served via replicate.delivery), logs, metrics. |
| GET | /v1/predictions | List predictions | 3,000 rpm | Paginated, most recent first. |
| POST | /v1/predictions/{id}/cancel | Cancel prediction | 3,000 rpm | For long-running jobs. |
| POST | /v1/models/{owner}/{model}/predictions | Official model prediction | 600 rpm | Convenience for “official” models. |
| GET/POST/PATCH/DELETE | /v1/models, /v1/models/{owner}/{model}, /v1/models/{owner}/{model}/versions | Models and versions | 3,000 rpm | Versions expose OpenAPI schema for inputs/outputs. |
| POST/GET/PATCH/DELETE | /v1/deployments | Dedicated deployments | 3,000 rpm | Configurable min/max instances and hardware SKU. |
| POST/GET/DELETE | /v1/files | File management | 3,000 rpm | For batch inputs and outputs; purpose “batch” for Batch API. |
| GET | /v1/collections, /v1/collections/{slug} | Collections | 3,000 rpm | Curated model groups. |

Source: Replicate HTTP API reference.[^8]

Authentication. All requests require a Bearer token in the Authorization header. Token lifecycle management is documented under Replicate’s security guides.[^8][^19]

Pricing. Replicate’s billing is usage-based with two principal modes. For many public models, usage is billed by hardware time at per‑second rates that vary by SKU (e.g., CPU small, T4, L40S, A100 80GB, H100). Alternatively, some models bill by input/output (e.g., per image, per video second, or per token), with estimates shown on each model page. Private models typically run on dedicated hardware and are billed for all “online” time (setup, idle, active), except for fast‑booting fine‑tunes which are billed only for active processing.[^10] The documentation provides a detailed hardware schedule; Table 3 shows a representative subset.

Table 3. Selected Replicate hardware pricing (per second and per hour)
| Hardware | Price per second | Price per hour | Notes |
|---|---|---|---|
| CPU (Small) | $0.000025 | $0.09 | 1x CPU, 2 GB RAM |
| CPU | $0.000100 | $0.36 | 4x CPU, 8 GB RAM |
| Nvidia T4 (1x) | $0.000225 | $0.81 | 4x CPU, 16 GB GPU RAM, 16 GB RAM |
| Nvidia L40S (1x) | $0.000975 | $3.51 | 10x CPU, 48 GB GPU RAM, 65 GB RAM |
| Nvidia A100 80GB (1x) | $0.001400 | $5.04 | 10x CPU, 80 GB GPU RAM, 144 GB RAM |
| Nvidia H100 (1x) | $0.001525 | $5.49 | 13x CPU, 80 GB GPU RAM, 72 GB RAM |

Source: Replicate billing and pricing documentation.[^10]

Model availability. Replicate maintains “official” models that are always on, predictably priced, and have a stable API, complementing a large catalog of community models. The platform is commonly used for image, video, and multimodal tasks, as well as bespoke inference flows that require webhooks, server-sent events, and per‑model I/O billing.[^11][^10]

Operational features. The API supports synchronous and asynchronous operation (e.g., Prefer: wait), cancellation windows (Cancel-After), webhooks with filtered event types, streaming via server‑sent events where available, and file input/output through the replicate.delivery domain. Prediction inputs and outputs are automatically removed after an hour by default; teams must persist outputs if longer retention is required.[^8]



### Together AI

Together AI provides serverless inference across a wide range of open-source models, OpenAI-compatible endpoints, dedicated endpoints on custom GPUs, fine-tuning, batch inference, code execution, and GPU cloud clusters. Its OpenAI compatibility means most applications can integrate by changing the base URL and API key while preserving request schemas and client libraries.[^14][^3]

Base URL and compatibility. The platform exposes an OpenAI-compatible base at /v1 and supports chat, vision, images, embeddings, audio (speech), and more. The compatibility layer allows teams to use the official OpenAI client libraries with minimal code changes.[^14]

Pricing. Together AI prices serverless inference per modality and per model. For text and vision, charges are per 1M input and output tokens. For image generation, per‑megapixel pricing is typical, often with default steps included. For audio (text-to-speech) it is per 1M characters, and for video it is per video unit with fixed resolution and duration. Transcription is per audio minute. Embeddings, rerankers, and moderation are priced per 1M tokens. Dedicated endpoints are billed per hour by GPU type, and fine-tuning is priced by the token count in the training and evaluation datasets, with specialized minimum charges for certain families. Table 4 summarizes pricing by modality and selected model rates.[^3]

Table 4. Together AI pricing by modality and selected models
| Modality | Unit | Representative pricing |
|---|---|---|
| Text/Vision (LLM/VLM) | $ per 1M input tokens / 1M output tokens | DeepSeek‑R1: $3.00 / $7.00; Qwen3 235B A22B Instruct 2507 FP8: $0.20 / $0.60; Qwen3 235B A22B Thinking 2507 FP8: $0.65 / $3.00; Llama 4 Scout: $0.18 / $0.59; Llama 4 Maverick: $0.27 / $0.85; Llama 3.1 405B Instruct Turbo: $3.50 / $3.50; gpt‑oss‑20B: $0.05 / $0.20; gpt‑oss‑120B: $0.15 / $0.60. |
| Image generation | $ per megapixel (MP) | FLUX.1 [dev]: $0.025/MP (28 default steps); FLUX.1 [pro]: $0.05/MP; FLUX.1 [schnell]: $0.0027/MP; Google Imagen 4.0 Fast: $0.02/MP; Ultra: $0.06/MP. |
| Audio (TTS) | $ per 1M characters | Cartesia Sonic‑2: $65.00. |
| Video generation | $ per video | MiniMax 01 Director (720p/5s): $0.28; Google Veo 3.0 (720p/8s): $1.60; Sora 2 (720p/8s): $0.80; Sora 2 Pro (1080p/8s): $4.00. |
| Transcription | $ per audio minute | Whisper Large v3: $0.0015. |
| Embeddings | $ per 1M tokens | BGE‑Base‑EN v1.5: $0.01; BGE‑Large‑EN v1.5: $0.02; GTE ModernBERT base: $0.08. |
| Rerank | $ per 1M tokens | Mxbai Rerank Large V2: $0.10; Salesforce Llama Rank V1 (8B): $0.10. |
| Moderation | $ per 1M tokens | Llama Guard 4 12B: $0.20; Llama Guard 3 11B Vision Turbo: $0.18. |
| Dedicated endpoints | $ per hour per GPU | 1x H200 141GB: $4.99; 1x H100 80GB: $3.36; 1x A100 SXM 80GB: $2.56; 1x L40S 48GB: $2.10. |

Source: Together AI pricing and serverless model pricing details.[^3][^4]

Fine-tuning and code execution. Fine-tuning is priced by tokens processed (training dataset size times epochs, plus optional evaluation tokens) with standard and specialized pricing tiers. Specialized models may incur minimum charges and are limited to LoRA fine-tuning. Code execution includes a sandbox priced per vCPU‑hour and per GiB‑hour of RAM, and a code interpreter priced per 60‑minute session.[^3] These options, coupled with batch inference at reduced cost, make Together AI a practical choice for teams that need to iterate on model quality while maintaining predictable unit economics.[^3]

Model availability. Together AI advertises 200+ open-source and specialized models, spanning text, vision, image, audio, video, embeddings, rerank, and moderation. The catalog includes recent open models (e.g., Llama 4, DeepSeek‑R1, Qwen3 families) and a range of image and video generators. The combination of breadth and OpenAI compatibility reduces switching costs and encourages reuse of existing integrations and orchestration code.[^15][^14][^3]

Information gaps. The materials reviewed do not enumerate an exhaustive list of REST base URLs beyond the OpenAI‑compatible /v1 surface or explicit numeric rate limits. Teams should confirm any throughput constraints during onboarding.[^3][^14]



### Groq

Groq focuses on fast, low‑cost inference for open-weight and open-source models, with transparent per‑million‑token pricing across text models, ASR per-hour rates, and support for prompt caching and batch processing. Its API exposes OpenAI-compatible endpoints for chat, audio, models, and file management, enabling straightforward integration with existing clients.[^5][^6]

Base URL and OpenAI compatibility. The API provides OpenAI-compatible paths for chat (/openai/v1/chat/completions), audio (transcriptions, translations, speech), and model listing. SDKs in Python and JavaScript offer convenience methods for completions, audio, models, batches, files, and fine-tuning (closed beta).[^6]

Authentication. Requests use a Bearer token in the Authorization header (API key issued by Groq).[^6][^20]

Pricing. Groq’s on-demand pricing covers text models, ASR, and TTS, with prompt caching discounts and batch processing that halves cost for asynchronous jobs. Table 5 shows representative text models, and Table 6 summarizes ASR/TTS pricing and prompt caching.[^5]

Table 5. Groq text models: speed and per‑million‑token pricing
| Model | Speed (TPS) | Input $/1M | Output $/1M |
|---|---:|---:|---:|
| Llama 3.1 8B Instant 128k | 840 | 0.05 | 0.08 |
| Llama 3.3 70B Versatile 128k | 394 | 0.59 | 0.79 |
| Llama 4 Scout (17Bx16E) 128k | 594 | 0.11 | 0.34 |
| Llama 4 Maverick (17Bx128E) 128k | 562 | 0.20 | 0.60 |
| Qwen3 32B 131k | 662 | 0.29 | 0.59 |
| GPT‑OSS 20B 128k | 1,000 | 0.075 | 0.30 |
| GPT‑OSS 120B 128k | 500 | 0.15 | 0.60 |
| Llama Guard 4 12B 128k | 325 | 0.20 | 0.20 |

Source: Groq pricing.[^5]

Table 6. Groq ASR/TTS and prompt caching
| Category | Model | Price | Notes |
|---|---|---|---|
| ASR | Whisper Large v3 | $0.111 per hour transcribed | Audio billed at minimum 10s per request. |
| ASR | Whisper Large v3 Turbo | $0.04 per hour transcribed | Audio billed at minimum 10s per request. |
| TTS | PlayAI Dialog v1.0 | $50 per 1M characters | ~140 characters per second. |
| Prompt caching | Multiple (e.g., GPT‑OSS 20B/120B, Kimi K2) | Cached input tokens priced at 50% of uncached | No fee for caching feature; discount applies on cache hit. |

Source: Groq pricing.[^5]

Batch API. Groq’s Batch API processes large workloads asynchronously with a 50% cost reduction and does not impact standard rate limits, with processing windows of 24 hours to 7 days. This is attractive for nightly indexing, batch classification, or large prompt pipelines where latency is not critical.[^5]

Model availability. The catalog includes modern open models and safety models (e.g., Llama 4, Qwen3, GPT‑OSS) along with ASR and TTS options. Groq’s published throughput (tokens per second) provides useful expectations for real-time use cases.[^5]

Information gaps. Public materials do not publish numeric global rate limits. Design for backoff and retries, and confirm any per‑model constraints during solution testing.[^6]



### Reka AI

Reka AI offers an API with pay‑as‑you‑go pricing for chat and research. Its models are designed for multimodality and efficiency, with research priced per 1,000 requests and chat priced per 1M tokens with optional per‑modality add‑ons for image, video, and audio. The API quickstart indicates OpenAI SDK compatibility, which helps minimize integration overhead.[^6][^7]

Authentication. Authentication is not detailed on the pricing page reviewed. The quickstart demonstrates usage via the OpenAI SDK, suggesting a standard API key-based approach; teams should confirm Bearer token usage and header formats in account settings.[^6][^7]

Pricing. Table 7 summarizes Reka’s pricing for research and chat, including multimodal add‑ons.[^6]

Table 7. Reka AI pricing overview
| Service | Model | Unit | Price | Notes |
|---|---|---|---:|---|
| Research | reka‑flash‑research | Per 1,000 requests | $25.00 (Standard), $35.00 (Parallel Thinking low), $60.00 (Parallel Thinking high) | Multi-step web research; “Parallel Thinking” tiers reflect depth/parallellism. |
| Chat | Reka Spark | Per 1M input tokens | $0.05 | Compact model; on-device suitability. |
| Chat | Reka Spark | Per 1M output tokens | $0.05 |  |
| Chat | Reka Spark | Image | $0.005 |  |
| Chat | Reka Spark | Video (per min) | $0.01 |  |
| Chat | Reka Spark | Audio (per min) | $0.005 |  |
| Chat | Reka Flash | Per 1M input tokens | $0.80 | Fast and cost-efficient. |
| Chat | Reka Flash | Per 1M output tokens | $2.00 |  |
| Chat | Reka Flash | Image | $0.01 |  |
| Chat | Reka Flash | Video (per min) | $0.06 |  |
| Chat | Reka Flash | Audio (per min) | $0.015 |  |
| Chat | Reka Core | Per 1M input tokens | $2.00 | Highest capability tier. |
| Chat | Reka Core | Per 1M output tokens | $6.00 |  |
| Chat | Reka Core | Image | $0.02 |  |
| Chat | Reka Core | Video (per min) | $0.08 |  |
| Chat | Reka Core | Audio (per min) | $0.02 |  |

Source: Reka AI pricing documentation.[^6]

Model availability. Reka’s offering centers on its own families: reka‑flash‑research for research workflows; Spark, Flash, and Core for chat across cost/performance/quality trade‑offs. This is a focused catalog compared with broad marketplaces, which can simplify evaluation and reduce decision paralysis for multimodality-centric use cases.[^6]

Information gaps. The pricing page does not explicitly describe auth header formats; the quickstart’s OpenAI SDK usage suggests an API key, but confirm exact headers (e.g., Authorization: Bearer) in Reka’s account or security documentation.[^6][^7]



## Cross-Provider Comparison

Although each provider exposes OpenAI-compatible patterns, they differ in pricing units, deployment options, and catalog breadth. This section compares the most relevant dimensions for engineering leaders and platform teams.

Endpoints and compatibility. Together AI and Groq expose OpenAI-compatible endpoints for chat, audio, models, and more. Hugging Face’s router offers an OpenAI-compatible path for chat and a models listing endpoint. Replicate uses its own unified prediction interface while supporting streaming and webhooks. Table 8 summarizes the endpoint patterns and notable features.[^12][^14][^6][^8]

Table 8. Endpoint and compatibility matrix
| Provider | Base (indicative) | Chat path | Other notable paths | OpenAI‑compatible? | Streaming/Webhooks |
|---|---|---|---|---|---|
| Hugging Face | Router base | /v1/chat/completions | GET /v1/models | Yes (router) | SDK/streaming varies by provider; router for chat. |
| Replicate | /v1 | POST /v1/predictions | /v1/models, /v1/deployments, /v1/files, /v1/collections | No (proprietary) | Streaming via SSE where supported; webhooks with event filters. |
| Together AI | /v1 | /v1/chat/completions | /v1/images, /v1/audio/speech, /v1/embeddings, etc. | Yes | Streaming supported in client libraries. |
| Groq | /openai/v1 | /openai/v1/chat/completions | /openai/v1/audio/*, /openai/v1/models | Yes | Streaming supported. |
| Reka AI | (Not specified) | OpenAI SDK compatible | Research and multimodal add-ons | Yes (SDK‑level) | Not specified in pricing page. |

Sources: Provider documentation.[^12][^8][^14][^6][^6]

Pricing units and model pricing. Pricing mechanics are a key differentiator. Table 9 compares the pricing units by modality, and Table 10 lists selected model rates to anchor expectations.

Table 9. Pricing units by modality
| Modality | Hugging Face (router) | Replicate | Together AI | Groq | Reka AI |
|---|---|---|---|---|---|
| Text/Vision (LLM/VLM) | Routed to providers; pay‑as‑you‑go; credits apply | Hardware time (per second) or model I/O | Per 1M input/output tokens | Per 1M input/output tokens | Per 1M input/output tokens |
| Image generation | Provider‑dependent | Model I/O (per image) | Per megapixel (per image) | — | Per image (chat add‑on) |
| Video | Provider‑dependent | Model I/O (per second) | Per video (fixed res/duration) | — | Per minute (chat add‑on) |
| Audio (ASR/TTS) | Provider‑dependent | Model I/O (varies) | TTS per 1M characters; transcription per audio minute | ASR per hour; TTS per 1M characters | Audio per minute (chat add‑on) |
| Embeddings | Provider‑dependent | N/A or model I/O | Per 1M tokens | — | — |
| Dedicated compute | Inference Endpoints (HF) | Deployments (per hour by hardware) | Dedicated endpoints (per hour by GPU) | — | — |

Sources: Provider pricing documentation.[^1][^10][^3][^5][^6]

Table 10. Representative model pricing snapshots
| Provider | Model | Unit | Price |
|---|---|---|---|
| Together AI | DeepSeek‑R1 | $ per 1M tokens (in/out) | 3.00 / 7.00 |
| Together AI | Qwen3 235B A22B Instruct 2507 FP8 | $ per 1M tokens (in/out) | 0.20 / 0.60 |
| Together AI | Llama 4 Scout | $ per 1M tokens (in/out) | 0.18 / 0.59 |
| Together AI | Llama 4 Maverick | $ per 1M tokens (in/out) | 0.27 / 0.85 |
| Groq | Llama 3.1 8B Instant 128k | $ per 1M tokens (in/out) | 0.05 / 0.08 |
| Groq | Llama 3.3 70B Versatile 128k | $ per 1M tokens (in/out) | 0.59 / 0.79 |
| Groq | GPT‑OSS 20B 128k | $ per 1M tokens (in/out) | 0.075 / 0.30 |
| Groq | GPT‑OSS 120B 128k | $ per 1M tokens (in/out) | 0.15 / 0.60 |
| Replicate | Example: Whisper Large v3 (ASR) | $ per audio minute | 0.0015 |
| Replicate | Example: FLUX.1 [dev] (image) | $ per image | 0.025 |
| Reka AI | Reka Flash | $ per 1M tokens (in/out) | 0.80 / 2.00 |
| Reka AI | Reka Core | $ per 1M tokens (in/out) | 2.00 / 6.00 |

Sources: Provider pricing pages.[^3][^5][^6]

Model availability by modality and task. Together AI publishes a broad catalog across text, vision, image, audio, video, embeddings, rerank, and moderation. Groq lists text, ASR, and TTS, with high throughput figures for latency-sensitive applications. Hugging Face’s router provides federated access to 200+ models and tasks, while Replicate’s official models ensure stability for selected models. Reka’s catalog focuses on research and chat families. Table 11 summarizes coverage at a high level.[^15][^5][^1][^11][^6]

Table 11. Model availability snapshot by provider
| Provider | LLM/VLM | Image | Video | Audio (ASR/TTS) | Embeddings | Rerank/Moderation | Notes |
|---|---|---:|---:|---:|---:|---:|---|
| Hugging Face (router) | Yes | Yes | Yes | Yes (STT) | Yes | Yes | 200+ models; multi-provider routing. |
| Replicate | Yes | Yes | Yes | Yes | Some | Some | Official models are always-on and stable. |
| Together AI | Yes | Yes | Yes | Yes | Yes | Yes | 200+ open and specialized models. |
| Groq | Yes | — | — | Yes (ASR/TTS) | — | Safety models | High throughput text models. |
| Reka AI | Yes | Yes (add‑on) | Yes (add‑on) | Yes (add‑on) | — | — | Focused on research and chat families. |

Authentication. All providers reviewed rely on API keys or tokens with Bearer authentication. Table 12 summarizes auth patterns and organization-level controls where documented.[^12][^8][^14][^6][^6][^1][^19][^20]

Table 12. Authentication matrix
| Provider | Auth mechanism | Org billing controls | Notes |
|---|---|---|---|
| Hugging Face | Bearer token (HF user access token) | X‑HF‑Bill‑To header; SDK bill_to; spend limits; provider allowlists | Credits and governance via Enterprise Hub. |
| Replicate | Bearer token | Organization/account tokens | Rate limits vary by endpoint; data removal after 1 hour by default. |
| Together AI | API key | Account-level | OpenAI-compatible; confirm org controls in account settings. |
| Groq | Bearer token | Account-level | OpenAI-compatible; confirm org controls in account settings. |
| Reka AI | API key (assumed Bearer) | Not specified in pricing page | Quickstart shows OpenAI SDK usage. |

Rate limits and throughput. Replicate documents explicit rate limits (600 rpm for creating predictions, 3,000 rpm for other endpoints). Groq emphasizes throughput (tokens per second) on its pricing page but does not publish numeric rate limits in the documentation reviewed. Other providers do not specify rate limits in the sources we examined. For critical workloads, teams should implement exponential backoff, idempotency where applicable, and monitor 429 responses to tune concurrency.[^8][^5][^6]

Batch processing and caching. Groq’s Batch API halves costs and runs within 24 hours to 7 days, with no impact to standard rate limits. It also offers prompt caching that discounts input tokens on cache hits. Together AI provides a Batch Inference API with cost reductions for most models, and Replicate’s asynchronous patterns via webhooks and long‑running predictions cover batch-style workflows. Hugging Face’s router and Reka AI do not document analogous caching programs in the materials reviewed.[^5][^3][^8][^1][^6]



## Implementation Guidance: Authentication, Organization Billing, and Cost Controls

Authentication patterns. All providers expect API keys or tokens. Replicate and Groq explicitly document Bearer authorization. Hugging Face uses user access tokens with fine-grained permissions and can route to multiple providers with a single credential. Together AI and Reka AI support OpenAI‑compatible client usage, which typically implies API keys in standard headers. Keep tokens in secret stores, rotate regularly, and avoid hardcoding in source control.[^8][^20][^12][^14][^6]

Centralized billing and governance. Hugging Face’s Enterprise Hub supports organization-level billing for routed requests via the X‑HF‑Bill‑To header or SDK parameters, along with spend limits and provider allowlists. This makes it the default choice for platform teams that need to consolidate costs and enforce controls across multiple upstream providers without duplicating auth flows.[^1]

Choosing per‑provider keys vs. routed requests. Use Hugging Face’s routed requests when you want consolidated billing, credits, and automatic provider selection. Switch to custom provider keys when you need provider‑specific features, negotiated rates, or direct billing relationships. Understand that Hugging Face credits apply only to routed requests, not to custom‑key mode.[^1]

Cost control strategies. Combine model selection hints with workload scheduling. For example, use the “:cheapest” hint for background jobs and “:fastest” for user-facing requests via the Hugging Face router. For Groq, exploit prompt caching and the Batch API for offline or high-volume processing. At Together AI, choose dedicated endpoints when you need guaranteed capacity and stable latency, and use batch inference for cost-sensitive bulk workloads. For Replicate, decide between hardware time vs. I/O billing depending on model shape and call pattern, and leverage deployments for predictable capacity.[^1][^5][^3][^10]

Operational observability. At Replicate, leverage webhooks and logs for workflow orchestration and post‑hoc analysis; be aware that prediction data is removed after an hour by default. At Together AI and Groq, use request IDs and usage fields to correlate client-side traces with provider logs. For safety‑critical applications, adopt a provider with built-in safety models (e.g., Llama Guard) and include moderation passes in your pipeline where appropriate.[^8][^5][^3]

Vendor lock-in mitigation. OpenAI compatibility across Together AI, Groq, and the Hugging Face router reduces switching costs. Keep your request schemas close to OpenAI standards (e.g., chat.completions with messages), prefer SDK methods that abstract transport details, and parameterize base URLs and model IDs to avoid hard-coding. This enables multi‑provider routing and fallback strategies with minimal code churn.[^14][^12][^6]



## Strategic Recommendations

When to choose each provider.

- High-throughput chat and real-time UX. Groq’s published throughput and low per‑token rates make it well suited for latency-sensitive chat, tool use, and interactive agents, especially when paired with prompt caching and the Batch API for periodic large runs.[^5]

- Broad model access and multi-provider routing. Hugging Face’s router is ideal when you want centralized auth/billing, automatic failover, and cost/performance hints across multiple providers. This is especially useful for platform teams standardizing on a single integration while retaining flexibility to swap providers by policy or workload.[^1][^12]

- Balanced catalog with OpenAI compatibility and dedicated capacity. Together AI provides a strong default for teams that want an OpenAI‑compatible API, a wide range of models (text, vision, image, audio, video, embeddings), and the option to reserve dedicated GPUs for steady latency. Fine‑tuning and batch inference add operational flexibility.[^3][^15]

- General-purpose inference with operational depth. Replicate’s extensive HTTP API, streaming and webhook support, and deployments are a good fit for orchestrated pipelines and custom model packaging. Pricing transparency at the hardware and model levels allows precise cost forecasting.[^8][^10][^11]

- Multimodal research and native chat with per‑modality add‑ons. Reka AI’s research and chat models, priced per token with optional image/video/audio units, map well to agentic workflows and retrieval-heavy research tasks that must flex across modalities.[^6]

Design for portability and cost efficiency. Anchor your schema on OpenAI-compatible patterns where possible. Keep model IDs and provider bases configurable. For predictable savings, partition workloads: interactive traffic to “fastest” routing, background or batch to “cheapest,” and sensitive tasks to dedicated endpoints or moderated paths. For Groq, structure workloads to benefit from prompt caching and batch processing. For Replicate, choose I/O billing for image/video tasks with clear unit costs and hardware time for sustained compute.[^1][^5][^3][^10]

Governance and compliance. Consolidate billing to a central cost center where supported (e.g., Hugging Face X‑HF‑Bill‑To), set spend limits, and restrict providers to an allowlist. For regulated environments, enforce safety models and audit logs; record request IDs and content hashes for traceability. Align data retention settings with your policies—remember that Replicate removes prediction data after an hour unless persisted.[^1][^8]



## Appendices

### Appendix A: Endpoint and Auth Matrix (Detailed)

The table below consolidates base paths, notable endpoints, auth mechanisms, and organization billing controls across providers.

| Provider | Base (indicative) | Notable endpoints | Auth | Organization controls |
|---|---|---|---|---|
| Hugging Face | Router base | /v1/chat/completions; GET /v1/models | Bearer (HF token) | X‑HF‑Bill‑To; spend limits; provider allowlists |
| Replicate | /v1 | /v1/predictions; /v1/models; /v1/deployments; /v1/files; /v1/collections | Bearer (API token) | Account/org token scope |
| Together AI | /v1 | /v1/chat/completions; /v1/images; /v1/audio/speech; /v1/embeddings | API key | Account-level |
| Groq | /openai/v1 | /openai/v1/chat/completions; /openai/v1/audio/*; /openai/v1/models | Bearer (API key) | Account-level |
| Reka AI | (Not specified) | Research and chat (OpenAI SDK compatible) | API key (assumed Bearer) | Not specified in pricing page |

Sources: Provider documentation.[^12][^8][^14][^6][^6]



### Appendix B: Pricing Compendium (Representative)

This compendium provides a condensed reference for pricing units and representative rates. Validate at integration time, as catalogs and rates change frequently.

- Hugging Face Inference Providers. Pay‑as‑you‑go without markup. Monthly credits vary by plan (Free, Pro, Team/Enterprise). Custom provider keys shift billing to the provider and disable credit application.[^1]

- Replicate. Two billing modes: (1) hardware time per second by SKU (e.g., CPU small $0.09/h; T4 $0.81/h; L40S $3.51/h; A100 80GB $5.04/h; H100 $5.49/h), and (2) model-specific input/output (e.g., per image, per video second, per token). Private deployments bill for all online time; fast-booting fine‑tunes bill active time only.[^10]

- Together AI. Text/vision: per 1M input/output tokens (e.g., DeepSeek‑R1 $3/$7; Qwen3 A22B Instruct $0.20/$0.60; Llama 4 Scout $0.18/$0.59; Llama 4 Maverick $0.27/$0.85). Image: per MP (FLUX.1 [dev] $0.025; [pro] $0.05; [schnell] $0.0027). Video: per fixed video unit. Audio TTS: per 1M characters (Cartesia $65). Transcripts: per audio minute (Whisper v3 $0.0015). Embeddings: per 1M tokens (BGE base $0.01). Dedicated endpoints: per hour by GPU (H200 $4.99; H100 $3.36; A100 80GB $2.56; L40S $2.10). Fine‑tuning: by dataset token count; specialized minimums for certain families. Code execution: per vCPU‑hour and GiB‑hour; interpreter per 60‑minute session.[^3][^4]

- Groq. Text models per 1M tokens (e.g., Llama 3.1 8B Instant $0.05/$0.08; Llama 3.3 70B $0.59/$0.79; Llama 4 Scout $0.11/$0.34; GPT‑OSS 20B $0.075/$0.30; GPT‑OSS 120B $0.15/$0.60). Prompt caching: cached input priced at 50% of uncached for selected models. ASR: Whisper v3 $0.111/h; v3 Turbo $0.04/h. TTS: PlayAI Dialog $50/1M characters. Batch API: 50% lower cost; 24h–7d processing window; standard rate limits unaffected.[^5]

- Reka AI. Research: reka‑flash‑research per 1,000 requests ($25 Standard; $35 Parallel Thinking low; $60 Parallel Thinking high). Chat: Spark $0.05/$0.05 (in/out) per 1M tokens; Flash $0.80/$2.00; Core $2.00/$6.00. Add‑ons: image/video/audio priced per unit (see Table 7 for details).[^6]



### Appendix C: Model Catalog Mapping (Indicative)

The table below maps provider catalogs to modalities and tasks. It is indicative, not exhaustive.

| Provider | LLM/VLM | Image | Video | ASR/TTS | Embeddings | Rerank/Moderation | Notes |
|---|---|---:|---:|---:|---:|---:|---|
| Hugging Face (router) | Yes | Yes | Yes | Yes (STT) | Yes | Yes | 200+ models; multi-provider routing; automatic failover. |
| Replicate | Yes | Yes | Yes | Yes | Some | Some | Official models are always-on and stable; broad community catalog. |
| Together AI | Yes | Yes | Yes | Yes | Yes | Yes | 200+ open and specialized models; extensive modality coverage. |
| Groq | Yes | — | — | Yes | — | Safety models | High throughput text models; prompt caching; batch API. |
| Reka AI | Yes | Yes (add‑on) | Yes (add‑on) | Yes (add‑on) | — | — | Focused on research and chat families. |

Sources: Provider catalogs and documentation.[^15][^1][^11][^6][^5]



## References

[^1]: Hugging Face. Pricing and Billing – Inference Providers. https://huggingface.co/docs/inference-providers/en/pricing  
[^2]: Hugging Face. Inference Endpoints – Pricing. https://huggingface.co/docs/inference-endpoints/en/support/pricing  
[^3]: Together AI. Pricing. https://www.together.ai/pricing  
[^4]: Together AI. Serverless Models – Pricing Details. https://docs.together.ai/docs/serverless-models#image-models  
[^5]: Groq. On-Demand Pricing for Tokens-as-a-Service. https://groq.com/pricing  
[^6]: Groq. API Reference. https://console.groq.com/docs/api-reference  
[^7]: Replicate. Pricing. https://replicate.com/pricing  
[^8]: Replicate. HTTP API Reference. https://replicate.com/docs/reference/http  
[^9]: Replicate. Billing. https://replicate.com/docs/billing  
[^10]: Replicate. Official Models. https://replicate.com/docs/topics/models/official-models  
[^11]: Replicate. Run all models with the same API endpoint (Changelog). https://replicate.com/changelog/2025-08-05-run-all-models-with-the-same-api-endpoint  
[^12]: Hugging Face. Inference Providers – Overview and Access. https://huggingface.co/docs/inference-providers/en/index  
[^13]: Hugging Face. Welcome to Inference Providers on the Hub (Blog). https://huggingface.co/blog/inference-providers  
[^14]: Together AI. OpenAI API Compatibility. https://docs.together.ai/docs/openai-api-compatibility  
[^15]: Together AI. Models Catalog. https://www.together.ai/models  
[^16]: Reka AI. Pricing. https://docs.reka.ai/pricing  
[^17]: Reka AI. Quickstart Guide. https://docs.reka.ai/quick-start  
[^18]: OpenAI. API Reference. https://platform.openai.com/docs/api-reference/introduction  
[^19]: Replicate. API Tokens (Security). https://replicate.com/docs/topics/security/api-tokens  
[^20]: Groq. How do I authenticate API requests? (Community FAQ). https://community.groq.com/t/how-do-i-authenticate-api-requests/484



## Information Gaps

- Explicit numeric rate limits are not documented for Hugging Face Inference Providers, Together AI, and Reka AI in the reviewed materials. Replicate documents 600 rpm for creating predictions and 3,000 rpm for other endpoints.[^8]
- Hugging Face’s OpenAI‑compatible router details are documented, but some non‑chat task REST paths may require SDK usage. Confirm task‑specific endpoints in client libraries.[^12]
- Reka AI’s pricing page does not specify the exact auth header format; OpenAI SDK usage suggests a standard Bearer API key, but confirm in account documentation.[^6][^7]
- Model catalogs and prices are updated frequently. Validate model availability, per‑model rates, and any minimum charges (e.g., specialized fine‑tuning tiers) at the time of integration.[^3]
- Dedicated hosting/per‑model per‑hour rates are clearly documented at Together AI; comparable per‑model hourly rates for other platforms are not consistently published in the sources reviewed.[^3]