# Universal LLM-Powered GitHub Stars Explorer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Privacy First](https://img.shields.io/badge/Privacy-First-green.svg)](docs/PRIVACY.md)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue.svg)](.github/workflows/deploy.yml)

> The most comprehensive GitHub Stars Explorer with support for **15+ LLM providers** - completely open source, privacy-first, and ready for GitHub Pages deployment.

## Features

### Universal LLM Support (15+ Providers)

**Tier 1: Major Cloud Providers**
- OpenAI (GPT-4, GPT-4 Turbo, GPT-4o, GPT-3.5)
- Anthropic (Claude 3 Opus, Sonnet, Haiku)
- Z.ai/GLM (GLM-4, GLM-3 Turbo, GLM-4V)
- Google (Gemini Pro, Ultra, Flash)
- DeepSeek (Chat, Coder)
- Mistral AI (Large, Medium, Small)
- Cohere (Command R+, Command R)

**Tier 2: Specialized Providers**
- Hugging Face (Inference API - 10,000+ models)
- Replicate (Open source models)
- Together AI (Fast inference)
- Perplexity (Search-enhanced)
- Fireworks AI (Performance optimized)

**Tier 3: Local & Custom**
- Ollama (Local model runner)
- LM Studio (Desktop local LLMs)
- LocalAI (Self-hosted OpenAI API)
- Custom OpenAI-compatible endpoints

### Core Capabilities

- **Repository Exploration**: Browse and analyze all your GitHub starred repositories
- **Smart Categorization**: Automatic categorization by functionality and use case
- **Quality Scoring**: Intelligent 1-10 quality scores based on multiple factors
- **Advanced Filtering**: Search, filter by language, category, and quality range
- **AI Analysis**: Deep repository analysis with your choice of 15+ LLM providers
- **Privacy-First Architecture**: 100% client-side, zero server-side data collection
- **Offline Support**: PWA with caching for offline access
- **Mobile Responsive**: Optimized for all screen sizes
- **Dark/Light Theme**: Automatic theme switching with system preference

### Privacy & Security

- All API keys encrypted and stored locally using Web Crypto API
- Direct browser-to-provider API calls (no proxy servers)
- Zero analytics or tracking
- No server-side data collection
- Complete transparency through open source
- Read our [Privacy Architecture Whitepaper](docs/PRIVACY.md)

## Quick Start

### Option 1: Use Online (Recommended)

Visit **[https://yourusername.github.io/github-stars-explorer](https://yourusername.github.io/github-stars-explorer)** (replace with your actual URL after deployment)

### Option 2: Deploy Your Own

1. Fork this repository
2. Enable GitHub Pages in Settings > Pages > Source: GitHub Actions
3. Push any commit to trigger automatic deployment
4. Visit `https://[your-username].github.io/github-stars-explorer`

### Option 3: Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/github-stars-explorer.git
cd github-stars-explorer

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Usage Guide

### 1. Browse Repositories

- Enter any GitHub username or profile URL
- Example: `https://github.com/torvalds?tab=stars` or just `torvalds`
- Explore categorized repositories with quality scores

### 2. Setup LLM Provider

Click "Configure LLM" and choose from:

**Cloud Providers** (Requires API key):
- OpenAI: Get key at [platform.openai.com](https://platform.openai.com)
- Anthropic: Get key at [console.anthropic.com](https://console.anthropic.com)
- Z.ai (GLM): Get key at [open.bigmodel.cn](https://open.bigmodel.cn)
- Google: Get key at [ai.google.dev](https://ai.google.dev)
- And 8 more providers...

**Local Providers** (No API key needed):
1. **Ollama**: Install from [ollama.ai](https://ollama.ai)
   ```bash
   ollama pull llama2  # Download model
   ollama serve        # Start server
   ```

2. **LM Studio**: Download from [lmstudio.ai](https://lmstudio.ai), load a model, start local server

3. **LocalAI**: Self-hosted OpenAI API - See [setup guide](docs/DEPLOYMENT.md#local-llm-setup)

### 3. Analyze Repositories

- Click "Analyze with AI" on any repository card
- Watch real-time streaming analysis
- View token count and cost estimation
- Export analysis as Markdown
- Results are cached locally for offline access

### 4. Compare Providers

- Try different LLM providers on the same repository
- Compare analysis quality, speed, and cost
- Switch providers anytime without losing data

## Documentation

- [API Documentation](docs/API.md) - Complete provider integration guide
- [Privacy Architecture](docs/PRIVACY.md) - Security and privacy details
- [Deployment Guide](docs/DEPLOYMENT.md) - Deploy to GitHub Pages, Vercel, Netlify
- [Contributing](CONTRIBUTING.md) - How to contribute
- [Security Policy](SECURITY.md) - Report vulnerabilities

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Tailwind Animate
- **LLM SDKs**: OpenAI SDK, Anthropic SDK
- **Storage**: IndexedDB (idb) for analysis cache
- **Security**: Web Crypto API for key encryption
- **UI Components**: Lucide Icons, React Markdown
- **Charts**: Recharts for analytics visualization

## Architecture

### 100% Privacy-First Design

```
┌─────────────┐
│   Browser   │
│  (You)      │
└──────┬──────┘
       │
       ├─────────► GitHub API (Public repos only)
       │
       ├─────────► OpenAI API (Direct, encrypted)
       │
       ├─────────► Anthropic API (Direct, encrypted)
       │
       ├─────────► Any LLM Provider (Direct, encrypted)
       │
       └─────────► Local LLM (No network)

NO SERVER IN BETWEEN
NO DATA COLLECTION
NO TRACKING
```

### Key Security Features

1. **API Key Encryption**: Web Crypto API (AES-GCM 256-bit)
2. **Local Storage Only**: Keys never leave your browser
3. **Direct API Calls**: No proxy servers
4. **Open Source**: Full transparency, audit the code
5. **No Analytics**: Zero tracking or telemetry

## Pricing Comparison

Compare costs across providers (per 1M tokens):

| Provider | Input | Output | Notes |
|----------|-------|--------|-------|
| GPT-4o | $5 | $15 | Best value premium |
| GPT-4 Turbo | $10 | $30 | High performance |
| Claude 3 Haiku | $0.25 | $1.25 | Most affordable |
| GLM-4 | $10 | $10 | Strong Chinese/English |
| DeepSeek | $0.10 | $0.20 | Very affordable |
| Gemini Pro | $0.25 | $0.50 | Google's offering |
| Local LLMs | $0 | $0 | Free but uses your hardware |

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Areas for Contribution

- Add new LLM provider integrations
- Improve UI/UX design
- Enhance analysis prompts
- Add new features (comparison tools, export formats, etc.)
- Write documentation and tutorials
- Report bugs and suggest features

## Roadmap

- [ ] Provider comparison dashboard
- [ ] Batch repository analysis
- [ ] Analysis history and trends
- [ ] Export to various formats (PDF, CSV, JSON)
- [ ] Repository recommendations based on analysis
- [ ] Chrome extension for quick analysis
- [ ] NPM package for embedding
- [ ] More LLM providers (Vertex AI, Azure OpenAI, etc.)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- GitHub for the amazing API
- OpenAI, Anthropic, Z.ai, and all LLM providers
- Open source community for local LLM tools (Ollama, LM Studio, LocalAI)
- React and Vite teams for excellent developer experience
- TailwindCSS for beautiful styling utilities

## Support

- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/github-stars-explorer/issues)
- **Discussions**: Join conversations on [GitHub Discussions](https://github.com/yourusername/github-stars-explorer/discussions)
- **Security**: Report vulnerabilities via [SECURITY.md](SECURITY.md)

## Star History

If you find this project useful, please consider giving it a star!

---

**Built with** 💙 **by the open source community**

**Powered by** 🤖 **15+ LLM providers**

**Privacy** 🔒 **100% guaranteed**
