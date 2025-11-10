# GitHub Stars Explorer - Enhanced with AI Analysis

A powerful, privacy-first web application to explore and analyze any GitHub user's starred repositories with LLM-powered insights.

## Live Deployments

- **MiniMax.io**: [https://l3o16ys8f3nl.space.minimax.io](https://l3o16ys8f3nl.space.minimax.io)
- **GitHub Pages**: Will be available at `https://[username].github.io/[repo-name]` after deployment

## Key Features

### Core Features
- Search any GitHub user's starred repositories
- Smart categorization by functionality
- Tag-based filtering
- Quality scoring (1-10)
- Language badges
- Full-text search
- Multi-criteria filtering
- Dark/light theme
- PWA with offline support
- Mobile-responsive design

### Enhanced Features (NEW)
- **LLM-Powered Analysis**: Get AI insights for any repository using OpenAI or Anthropic
- **Privacy-First Architecture**: 
  - API keys encrypted and stored locally in your browser
  - Direct browser-to-API calls (no proxy server)
  - Zero data collection on our servers
- **Analysis Caching**: 
  - Save analysis results locally in IndexedDB
  - Reduce API costs by reusing cached results
- **Cost Tracking**: Real-time token usage and cost estimates
- **Enhanced Analytics**: Interactive charts and visualizations
- **Markdown Export**: Export analysis to Markdown format

## Privacy & Security

This application follows a **100% privacy-first** architecture:

- Your API keys are encrypted using Web Crypto API before storage
- All API keys stored in browser localStorage only (never sent to our servers)
- LLM analysis requests go directly from your browser to OpenAI/Anthropic
- Analysis results cached locally in IndexedDB
- No tracking, no analytics, no data collection

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- GitHub account (to explore starred repos)
- OpenAI or Anthropic API key (optional, for LLM analysis)

### Installation

```bash
# Clone the repository
git clone https://github.com/[username]/github-stars-explorer.git
cd github-stars-explorer

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Environment Setup

No environment variables required! The application runs entirely in the browser.

## How to Use

### 1. Explore Starred Repositories

1. Enter any GitHub username or profile URL
2. Browse the categorized list of starred repositories
3. Filter by language, category, or quality score
4. Click on any repository to see detailed information

### 2. Enable AI Analysis (Optional)

1. Click the "API Key" button in the header
2. Choose your provider (OpenAI or Anthropic)
3. Enter your API key (it will be encrypted and stored locally)
4. Click "Validate & Save"

### 3. Analyze Repositories

1. Click "Analyze with AI" on any repository card
2. Watch the real-time streaming analysis
3. See token usage and cost estimates
4. Export analysis to Markdown

### 4. Manage Your Data

- **Clear API Keys**: Settings → Clear Saved API Key
- **Clear Analysis Cache**: Browser settings → Clear site data
- **View Privacy Info**: Click the "100% Private" badge

## API Key Setup

### OpenAI

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy and paste into the app

**Recommended Models:**
- GPT-4 Turbo (best quality/price ratio)
- GPT-3.5 Turbo (fastest, cheapest)

### Anthropic

1. Go to [Anthropic Console](https://console.anthropic.com/account/keys)
2. Create a new API key
3. Copy and paste into the app

**Recommended Models:**
- Claude 3 Sonnet (best quality/price ratio)
- Claude 3 Haiku (fastest, cheapest)

## Cost Estimates

Typical analysis costs per repository:
- **GPT-4 Turbo**: $0.01 - $0.03
- **GPT-3.5 Turbo**: $0.001 - $0.005
- **Claude 3 Sonnet**: $0.005 - $0.015
- **Claude 3 Haiku**: $0.0005 - $0.002

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Lucide React
- **LLM Integration**: OpenAI SDK + Anthropic SDK
- **Data Persistence**: IndexedDB (idb library)
- **Markdown Rendering**: react-markdown + remark-gfm
- **Charts**: Recharts
- **Encryption**: Web Crypto API

## Design System

Based on **Modern Minimalism Premium** style:
- 90% neutral grays, 10% indigo accent
- Generous whitespace (48-96px sections)
- Subtle animations and micro-interactions
- WCAG AA compliant (4.5:1+ contrast ratios)
- W3C design tokens in `docs/design-tokens-enhanced.json`

## Project Structure

```
github-stars-explorer/
├── src/
│   ├── components/          # React components
│   │   ├── APIKeyModal.tsx        # API key management
│   │   ├── AnalysisPanel.tsx      # LLM analysis display
│   │   ├── PrivacyStatusIndicator.tsx
│   │   ├── RepositoryCard.tsx     # Enhanced with AI button
│   │   └── ...
│   ├── lib/                 # Utilities and services
│   │   ├── encryption.ts          # Web Crypto API
│   │   ├── analysis-cache.ts      # IndexedDB cache
│   │   ├── llm-api.ts             # OpenAI/Anthropic integration
│   │   ├── github-api.ts          # GitHub API
│   │   └── utils.ts
│   ├── contexts/            # React contexts
│   │   └── ThemeContext.tsx
│   └── ...
├── docs/                    # Design specifications
│   ├── design-specification-enhanced.md
│   ├── content-structure-plan-enhanced.md
│   └── design-tokens-enhanced.json
├── .github/workflows/       # CI/CD
│   └── deploy.yml           # GitHub Pages deployment
└── ...
```

## Deployment

### Deploy to GitHub Pages

1. Fork/clone this repository
2. Enable GitHub Pages in repository settings
3. Set source to "GitHub Actions"
4. Push to `main` branch
5. GitHub Actions will automatically build and deploy

### Deploy to MiniMax.io

Already deployed at: [https://l3o16ys8f3nl.space.minimax.io](https://l3o16ys8f3nl.space.minimax.io)

### Deploy to Vercel/Netlify

```bash
# Build the project
pnpm build

# Deploy dist/ folder to your platform of choice
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use for personal or commercial projects.

## Privacy Policy

This application:
- Does NOT collect any user data
- Does NOT send data to our servers
- Does NOT track user behavior
- ONLY makes API calls directly to GitHub (public data) and your chosen LLM provider

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation in `docs/` directory

## Acknowledgments

- Design inspiration: Linear, Vercel, Arc Browser, Stripe
- Icons: Lucide React
- UI Components: Radix UI
- LLM APIs: OpenAI & Anthropic

---

**Built with privacy and user experience in mind.**
