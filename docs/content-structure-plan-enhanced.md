# Content Structure Plan - Enhanced GitHub Stars Explorer with LLM Analysis

## 1. Material Inventory
**Existing Foundation:**
- Original GitHub Stars Explorer (v1) design specifications
- Modern Minimalism Premium style guide
- GitHub API integration patterns

**New Features:**
- LLM-powered repository analysis (OpenAI/Anthropic)
- Privacy-first API key management
- Enhanced analytics dashboard
- Analysis history and comparison
- Local data persistence with encryption

## 2. Website Structure
**Type:** SPA (Single Page Application)
**Reasoning:** 
- Interactive dashboard experience with state management
- Single goal: explore and analyze starred repositories
- Client-side only architecture (no backend)
- All features accessible without navigation
- Enhanced UX with modal overlays for settings/analysis

## 3. Section Breakdown

### Main Application View

**Purpose**: Primary interface for exploring and analyzing GitHub starred repositories

**Content Mapping:**

| Section | Component Pattern | Data Source | Content to Extract | Visual Asset |
|---------|------------------|-------------|-------------------|--------------|
| Header/Navigation | Sticky Navigation Bar | User input + localStorage | Username, theme toggle, settings trigger | - |
| Search & Filters | Horizontal Filter Bar | User interaction | Search query, category filters, language filters, quality range | - |
| Analytics Dashboard | Chart Grid (NEW) | GitHub API + LLM analysis | Repository stats, language distribution, star trends, quality metrics | - |
| Repository Cards Grid | Enhanced Card Grid | GitHub API + LLM cache | Repo name, description, stars, language, quality score, LLM insights | Repository avatar images |
| Floating Action Button | Fixed Position CTA | User interaction | Quick analyze trigger | - |

### Modal Overlays

#### API Key Management Modal (NEW)

| Section | Component Pattern | Data Source | Content to Extract | Visual Asset |
|---------|------------------|-------------|-------------------|--------------|
| Security Header | Modal Header | Static content | Privacy assurance message | Lock icon |
| Provider Selection | Tab Switcher | User preference | OpenAI/Anthropic selection | - |
| Key Input | Secure Input Field | User input | API key (encrypted before storage) | - |
| Status Indicator | Validation Badge | API validation | Connection status, billing estimate | - |
| Privacy Controls | Settings Panel | User preferences | Local storage options, auto-clear settings | - |

#### LLM Analysis Panel (NEW)

| Section | Component Pattern | Data Source | Content to Extract | Visual Asset |
|---------|------------------|-------------|-------------------|--------------|
| Repository Context | Compact Card | Selected repository | Name, description, tech stack | - |
| Analysis Content | Markdown Renderer | LLM API response | Analysis text, insights, recommendations | - |
| Action Buttons | Button Group | User interaction | Save, compare, export, re-analyze | - |
| Loading State | Skeleton + Progress | API call status | Processing indicator, token usage | - |

#### Analysis History Drawer (NEW)

| Section | Component Pattern | Data Source | Content to Extract | Visual Asset |
|---------|------------------|-------------|-------------------|--------------|
| History List | Timeline List | IndexedDB cache | Past analyses with timestamps | - |
| Comparison View | Split Comparison | Selected history items | Side-by-side analysis comparison | - |
| Export Options | Action Menu | User selection | Export format options (JSON/Markdown/PDF) | - |

#### Settings Panel (NEW)

| Section | Component Pattern | Data Source | Content to Extract | Visual Asset |
|---------|------------------|-------------|-------------------|--------------|
| API Settings | Collapsible Section | User preferences | API provider, rate limits, caching options | - |
| Privacy Settings | Toggle Group | User preferences | Local storage, auto-clear, analytics disable | - |
| Theme Settings | Theme Switcher | User preference | Light/dark mode, color customization | - |
| Data Management | Danger Zone | User action | Clear cache, clear history, clear API keys | - |

### Empty/Error States

| State | Component Pattern | Data Source | Content to Extract | Visual Asset |
|-------|------------------|-------------|-------------------|--------------|
| No API Key | Empty State Card | - | Setup instructions, privacy assurance | Key icon |
| API Error | Error Alert | API error response | Error message, troubleshooting tips | - |
| No Repositories | Empty State | GitHub API | Prompt to enter username | - |
| Rate Limited | Warning Banner | API headers | Retry timer, rate limit info | - |

## 4. Content Analysis

**Information Density:** High
- Repository data (metadata, stats, analysis)
- LLM-generated insights (variable length)
- Analytics visualizations (charts, graphs)
- User settings and preferences
- Privacy and security information

**Content Balance:**
- Interactive Data: 60% (repository cards, charts, analysis)
- UI Controls: 25% (filters, settings, buttons)
- Informational: 15% (help text, privacy notices, error messages)
- Content Type: Data-driven interactive dashboard

**Privacy-First Features:**
- Encrypted API key storage (browser-only)
- Local data persistence (IndexedDB)
- Zero server-side tracking
- Transparent data usage indicators
- User-controlled data lifecycle

**Performance Considerations:**
- Client-side LLM API calls (CORS configured)
- Cached analysis results (reduce API costs)
- Lazy loading for repository cards
- Optimistic UI updates
- Rate limiting and error handling

## 5. Key User Flows

**Flow 1: First-Time Setup**
1. Enter GitHub username → Load stars
2. Prompt for API key → Open settings modal
3. Enter/validate API key → Privacy notice
4. Start analyzing repositories

**Flow 2: Analyzing Repositories**
1. Browse repository cards
2. Click "Analyze with AI" button
3. View LLM analysis in modal
4. Save to history or compare
5. Export analysis report

**Flow 3: Privacy Management**
1. Open settings panel
2. Review API key status
3. Configure data retention
4. Clear cached data
5. Verify privacy status

**Flow 6: Analytics Dashboard**
1. View overview charts (stars, languages, quality)
2. Filter by insights from LLM analysis
3. Compare repositories based on AI assessments
4. Export dashboard data
