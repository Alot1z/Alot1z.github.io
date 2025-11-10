# Design Specification - Enhanced GitHub Stars Explorer with LLM Analysis

## 1. Direction & Rationale

### 1.1 Design Foundation

**Style:** Modern Minimalism Premium  
**Visual Essence:** Professional restraint meets intelligent analysis. Clean, data-dense interface with generous spacing that balances privacy-first security controls with powerful LLM insights. 90% neutral palette ensures repository data and AI analysis remain the hero, while subtle 10% accent color guides action flows.

**Real-World Examples:**
- **Linear** (linear.app) - Clean issue tracking with subtle depth
- **Vercel Dashboard** (vercel.com) - Minimalist developer tools
- **Arc Browser Settings** (arc.net) - Privacy controls with clarity
- **Stripe Dashboard** (stripe.com) - Data visualization excellence
- **Raycast** (raycast.com) - Command interface elegance

### 1.2 Privacy-First Design Philosophy

**Core Principle:** Trust through transparency. Every API key input, data storage decision, and LLM analysis is accompanied by clear visual indicators of where data lives (browser-only) and who gets billed (user-only).

**Visual Language:**
- **Encrypted data** = Lock icons + green status badges
- **Local storage** = Browser icon + "Stays in your browser" labels
- **Active LLM call** = Token counter + cost estimate in real-time
- **Privacy zones** = Subtle background tint for sensitive areas

### 1.3 Enhanced Over v1

Building on the existing Modern Minimalism Premium foundation, this enhanced version adds:
- **Analytics Dashboard:** Chart-based visualizations (language trends, quality distribution, star activity)
- **LLM Integration:** Analysis panels with streaming text, insights cards
- **Security UI:** API key management with encrypted storage indicators
- **History System:** Timeline of past analyses with comparison tools
- **Smart Loading:** Skeleton screens, progress indicators, token usage displays

---

## 2. Design Tokens

### 2.1 Color System

#### Primary Brand Color

| Token | Value | Usage | WCAG Ratio |
|-------|-------|-------|------------|
| `primary-50` | `#EEF2FF` | LLM analysis card backgrounds | - |
| `primary-100` | `#E0E7FF` | Hover states on analysis items | - |
| `primary-500` | `#6366F1` | Primary CTAs, "Analyze with AI" buttons | 4.56:1 ✅ |
| `primary-600` | `#4F46E5` | Button hover states | 5.89:1 ✅ |
| `primary-900` | `#312E81` | Active/pressed states | 10.2:1 ✅ |

**Rationale:** Indigo conveys intelligence and technology (AI/LLM association) while remaining professional.

#### Neutral Palette

| Token | Value | Usage |
|-------|-------|-------|
| `neutral-50` | `#FAFAFA` | Page background |
| `neutral-100` | `#F5F5F5` | Card backgrounds (surface elevation) |
| `neutral-200` | `#E5E5E5` | Borders, dividers |
| `neutral-500` | `#A3A3A3` | Disabled states, placeholders |
| `neutral-700` | `#404040` | Secondary text, metadata |
| `neutral-900` | `#171717` | Primary text, headings |

**Contrast:** Cards (neutral-100) on page (neutral-50) = 6% lightness difference ✅

#### Semantic Colors

| Token | Value | Usage | WCAG |
|-------|-------|-------|------|
| `success-500` | `#10B981` | API key validated, analysis saved | 3.9:1 (icons only) |
| `success-700` | `#047857` | Success text | 5.2:1 ✅ |
| `warning-500` | `#F59E0B` | Rate limit warnings, cost alerts | 2.9:1 (icons only) |
| `warning-700` | `#B45309` | Warning text | 5.5:1 ✅ |
| `error-500` | `#EF4444` | API errors, validation failures | 4.1:1 ✅ |
| `error-700` | `#B91C1C` | Error text | 6.8:1 ✅ |

#### Privacy & Security Colors (NEW)

| Token | Value | Usage |
|-------|-------|-------|
| `privacy-bg` | `#F0FDF4` | Privacy-safe zones (light green tint) |
| `privacy-border` | `#86EFAC` | Encrypted data indicators |
| `privacy-text` | `#166534` | "Stored locally" labels |

**Rationale:** Subtle green tint communicates safety without alarm colors.

### 2.2 Typography

#### Font Family

| Token | Value |
|-------|-------|
| `font-primary` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| `font-mono` | `'SF Mono', 'Monaco', 'Inconsolata', monospace` |

**Monospace Usage:** API keys (partial display), code snippets in LLM analysis, technical metadata.

#### Type Scale (Desktop 1920px)

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `text-hero` | `64px` | `700` | `1.1` | `-0.02em` | Page title (rare) |
| `text-title` | `48px` | `700` | `1.2` | `-0.01em` | Modal headers |
| `text-subtitle` | `32px` | `600` | `1.3` | `0` | Section headers |
| `text-large` | `20px` | `400` | `1.6` | `0` | Analysis intro text |
| `text-body` | `16px` | `400` | `1.5` | `0` | Repository descriptions, UI text |
| `text-small` | `14px` | `400` | `1.5` | `0` | Metadata, helper text |
| `text-caption` | `12px` | `400` | `1.4` | `0.01em` | Timestamps, privacy labels |

#### Type Scale (Mobile <768px)

| Token | Size | Notes |
|-------|------|-------|
| `text-title` | `36px` | Reduced from 48px |
| `text-subtitle` | `28px` | Reduced from 32px |
| `text-body` | `16px` | Unchanged (readability) |

### 2.3 Spacing (8-Point Grid)

| Token | Value | Primary Usage |
|-------|-------|---------------|
| `space-1` | `8px` | Icon + text inline spacing |
| `space-2` | `16px` | Standard element gaps |
| `space-3` | `24px` | Related group spacing, card gaps |
| `space-4` | `32px` | Card padding (minimum) |
| `space-6` | `48px` | Section internal spacing |
| `space-8` | `64px` | Section boundaries |
| `space-12` | `96px` | Dashboard top spacing |
| `space-16` | `128px` | Hero sections (if used) |

**Note:** Prefer multiples of 8px (8, 16, 24, 32, 48, 64, 96) over 4px increments.

### 2.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `8px` | Badges, pills |
| `radius-md` | `12px` | Buttons, inputs |
| `radius-lg` | `16px` | Cards, modals |
| `radius-xl` | `24px` | Large containers (analytics dashboard) |
| `radius-full` | `9999px` | Avatars, circular buttons |

### 2.5 Box Shadow

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Repository cards at rest |
| `shadow-card-hover` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Card hover state |
| `shadow-modal` | `0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.04)` | Modals, drawers |
| `shadow-privacy` | `0 0 0 3px rgba(134, 239, 172, 0.3)` | Privacy-zone glow (green) |

### 2.6 Animation Timing

| Token | Value | Usage |
|-------|-------|-------|
| `duration-fast` | `200ms` | Button hover, simple interactions |
| `duration-base` | `250ms` | Card hover, state changes |
| `duration-slow` | `300ms` | Modals, drawers, LLM streaming |
| `duration-ai-stream` | `50ms` | Text streaming animation (per token) |

| Token | Value | Usage |
|-------|-------|-------|
| `easing-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Most transitions (ease-out) |
| `easing-smooth` | `cubic-bezier(0.4, 0, 0.6, 1)` | Smooth start/end (modals) |

---

## 3. Component Specifications

### 3.1 Enhanced Repository Card with LLM Insights

**Structure:**
```
Card Container (16px radius, 32px padding)
  ├─ Header Row
  │   ├─ Repository Icon (32px avatar)
  │   ├─ Name + Owner (16px semibold)
  │   └─ Star Count Badge (right aligned)
  ├─ Description (16px regular, neutral-700, 2-line clamp)
  ├─ Metadata Row
  │   ├─ Language Badge (12px radius pill)
  │   ├─ Quality Score (1-10, colored indicator)
  │   └─ Updated Date (14px caption)
  ├─ LLM Insight Preview (NEW)
  │   ├─ AI Icon (16px, primary-500)
  │   └─ One-line summary (14px italic, neutral-600)
  └─ Action Row
      ├─ "Analyze with AI" Button (if no analysis)
      └─ "View Analysis" Link (if analyzed)
```

**Design Tokens:**
- Background: `neutral-100`
- Padding: `space-4` (32px)
- Radius: `radius-lg` (16px)
- Gap between elements: `space-2` (16px)
- Shadow: `shadow-card` → `shadow-card-hover` on hover

**States:**
- **Default:** Neutral-100 background, card shadow
- **Hover:** Lift `-4px`, scale `1.02`, shadow-card-hover, cursor pointer
- **Analyzing:** Subtle pulse animation on AI button, disabled interactions
- **Analyzed:** Green checkmark badge, "View Analysis" link primary-500

**Note:** LLM insight preview truncated to 1 line with ellipsis. Clicking opens full analysis modal.

---

### 3.2 API Key Management Modal (NEW)

**Structure:**
```
Modal Overlay (rgba(0,0,0,0.5) backdrop)
  └─ Modal Container (600px max-width, 24px radius)
      ├─ Header (48px height)
      │   ├─ Lock Icon (24px, primary-500)
      │   ├─ "API Key Management" (24px semibold)
      │   └─ Close Button (32px touch target)
      ├─ Privacy Assurance Banner
      │   ├─ Privacy-bg background (green tint)
      │   ├─ Browser Icon + "Stored locally in your browser only"
      │   └─ "Never sent to our servers" (14px)
      ├─ Provider Tabs (OpenAI / Anthropic)
      │   └─ Tab buttons (48px height, horizontal)
      ├─ Key Input Section
      │   ├─ Label: "API Key" + Info tooltip
      │   ├─ Input Field (56px height, monospace font)
      │   │   ├─ Placeholder: "sk-..." or "sk-ant-..."
      │   │   ├─ Type: password (toggle visibility icon)
      │   │   └─ Paste button (right side)
      │   └─ Validation Status (below input)
      │       ├─ Success: Green checkmark + "Connected"
      │       ├─ Error: Red X + error message
      │       └─ Validating: Spinner + "Checking..."
      ├─ Billing Info Card (if validated)
      │   ├─ "Your Usage" (16px semibold)
      │   ├─ Estimated cost per analysis (~$0.01-0.05)
      │   └─ "You are billed directly by [Provider]"
      ├─ Advanced Settings (Collapsible)
      │   ├─ Model Selection (dropdown)
      │   ├─ Max Tokens (number input)
      │   └─ Auto-cache results (toggle)
      └─ Footer Actions
          ├─ "Clear Key" (text button, error-500)
          └─ "Save & Close" (primary button, disabled until valid)
```

**Design Tokens:**
- Modal width: `600px` max, `90vw` mobile
- Padding: `space-6` (48px) inside modal
- Input height: `56px`
- Privacy banner bg: `privacy-bg` (#F0FDF4)
- Shadow: `shadow-modal`

**States:**
- **Empty:** Input placeholder, disabled save button
- **Validating:** Spinner animation, disabled input
- **Valid:** Green checkmark, enabled save button, billing info visible
- **Invalid:** Red error message, retry hint, save disabled

**Interaction:**
- Open: Fade in overlay (300ms) + scale up modal from 0.95 to 1.0
- Close: Reverse animation
- Validation: Debounced 500ms after typing stops, then API test call

---

### 3.3 LLM Analysis Panel

**Structure:**
```
Drawer/Modal (800px max-width, slides from right)
  ├─ Header (Sticky)
  │   ├─ Repository Name + Icon (20px semibold)
  │   ├─ Analysis Status Badge ("Analyzing..." / "Complete")
  │   └─ Actions (Export, Compare, Close)
  ├─ Cost Indicator (NEW)
  │   ├─ Token count (real-time during streaming)
  │   └─ Estimated cost ($0.XX)
  ├─ Analysis Content (Scrollable)
  │   ├─ Streaming Text (if in progress)
  │   │   └─ Typewriter effect (50ms per token)
  │   ├─ Rendered Markdown (when complete)
  │   │   ├─ Headings (20px semibold)
  │   │   ├─ Paragraphs (16px, 1.6 line-height)
  │   │   ├─ Code blocks (mono font, neutral-100 bg)
  │   │   └─ Lists (16px bullets)
  │   └─ Insights Cards (if structured)
  │       ├─ "Key Strengths" card (success tint)
  │       ├─ "Potential Issues" card (warning tint)
  │       └─ "Recommendations" card (primary tint)
  ├─ Metadata Footer
  │   ├─ Analyzed timestamp (14px caption)
  │   ├─ Model used (GPT-4 / Claude Opus)
  │   └─ Cache status indicator
  └─ Action Bar (Sticky bottom)
      ├─ "Save to History" button
      ├─ "Compare" button (if history exists)
      └─ "Export" dropdown (Markdown / JSON / PDF)
```

**Design Tokens:**
- Width: `800px` max, `100vw` mobile
- Padding: `space-6` (48px)
- Content max-width: `65ch` (optimal readability)
- Markdown line-height: `1.6`
- Code block bg: `neutral-100`, padding `space-3`

**States:**
- **Analyzing:** 
  - Status badge: Animated dots "Analyzing..."
  - Content: Streaming text with typewriter effect
  - Token counter: Updates in real-time
  - Actions: Disabled except "Cancel"
- **Complete:**
  - Status badge: Green checkmark "Complete"
  - Content: Fully rendered markdown
  - Actions: All enabled
- **Error:**
  - Status badge: Red X "Failed"
  - Content: Error message + retry button
  - Cost shown: Tokens used before failure

**Streaming Animation:**
- Each token appears with 50ms delay
- Cursor blink at end of stream (|)
- Smooth scroll to keep latest text visible
- Pause button to stop streaming (not cancel API call)

---

### 3.4 Analytics Dashboard Grid (NEW)

**Structure:**
```
Dashboard Container (full-width, 96px top margin)
  ├─ Header Row
  │   ├─ "Analytics Overview" (32px semibold)
  │   └─ Date Range Filter (dropdown, right aligned)
  ├─ Metric Cards Row (4 cards, equal width)
  │   ├─ Total Stars (large number + trend)
  │   ├─ Repositories Analyzed (AI icon)
  │   ├─ Languages (count + top 3)
  │   └─ Average Quality (1-10 score)
  └─ Chart Grid (2x2 or 3x1 on mobile)
      ├─ Language Distribution (Donut chart)
      ├─ Star Activity Over Time (Line chart)
      ├─ Quality Score Distribution (Bar chart)
      └─ AI Insights Summary (Tag cloud / list)
```

**Metric Card Specifications:**
- Size: `1fr` grid (equal width), min `240px`
- Padding: `space-4` (32px)
- Background: `neutral-100`
- Radius: `radius-lg` (16px)
- Shadow: `shadow-card`
- Layout:
  - Label (14px uppercase, neutral-500, 0.05em tracking)
  - Value (48px bold, neutral-900)
  - Trend indicator (↑/↓ arrow + percentage, 14px)
  - Sparkline (optional, 48px height mini-chart)

**Chart Specifications:**
- Container: `neutral-100` background, 16px radius, 32px padding
- Aspect ratio: `16:9` for line/bar charts, `1:1` for donut
- Colors: Use primary-500 for main data, neutral-200 for grid lines
- Library recommendation: Chart.js or Recharts (React)
- Axis labels: `text-small` (14px), neutral-700
- Hover tooltips: White bg, shadow-modal, 12px radius

**Responsive:**
- Desktop (≥1024px): 2x2 grid, metric cards in single row
- Tablet (768-1023px): 2x2 grid, metric cards 2x2
- Mobile (<768px): Single column stack, metric cards 1x4

---

### 3.5 Privacy Status Indicator (NEW)

**Structure:**
```
Compact Banner (Header or Footer)
  ├─ Lock Icon (16px, success-500)
  ├─ Status Text: "100% Private - Data stays in your browser"
  └─ Info Button (opens privacy details modal)
```

**Design Tokens:**
- Background: `privacy-bg` (subtle green tint)
- Border: `1px solid privacy-border`
- Padding: `space-2` (16px) vertical, `space-4` horizontal
- Radius: `radius-md` (12px)
- Text: `text-small` (14px), `privacy-text` color

**Placement Options:**
1. Fixed bottom-right corner (toast-style, dismissible)
2. Header right side (next to theme toggle)
3. Footer bar (full-width)

**Interaction:**
- Click info button → Opens modal with:
  - "What data is stored locally" (list)
  - "What data never leaves your browser" (list)
  - "How to clear all data" (button)
  - Link to full privacy policy

---

### 3.6 Loading & Skeleton States (NEW)

**LLM Analysis Loading:**
```
Modal with animated state
  ├─ Header: Repository name + "Analyzing..."
  ├─ Progress Indicator
  │   ├─ Animated gradient bar (0-100%)
  │   ├─ Status text: "Reading repository..." → "Generating insights..."
  │   └─ Elapsed time counter (00:05)
  ├─ Token Counter (live)
  │   └─ "Tokens used: 1,234 (~$0.02)"
  └─ Cancel Button (text button)
```

**Repository Card Skeleton:**
```
Card Container (same dimensions as real card)
  ├─ Avatar Circle (32px, animated shimmer)
  ├─ Title Bar (60% width, shimmer)
  ├─ Description Lines (3 lines, varying widths, shimmer)
  ├─ Badge Shapes (3 pills, shimmer)
  └─ Button Shape (shimmer)
```

**Shimmer Animation:**
- Background gradient: `linear-gradient(90deg, neutral-200 0%, neutral-300 50%, neutral-200 100%)`
- Animation: Translate X from -100% to 100%, 1.5s infinite
- Easing: `ease-in-out`

---

## 4. Layout & Responsive

### 4.1 Application Layout (SPA)

**Base Structure:**
```
App Container (100vh, flex column)
  ├─ Sticky Header (64px height)
  │   ├─ Logo/Title (left, 32px height)
  │   ├─ Username Input (center, 400px max)
  │   └─ Actions (right: Theme, Settings, API Status)
  ├─ Main Content (flex-grow, scrollable)
  │   ├─ Analytics Dashboard (96px top margin)
  │   │   └─ Full-width container, 1400px max-width
  │   ├─ Filter Bar (sticky, 72px height)
  │   │   └─ Horizontal filters (search, category, language, quality)
  │   └─ Repository Grid
  │       └─ 3 columns desktop, 2 tablet, 1 mobile
  └─ Privacy Footer (48px height, optional)
```

**Container Max-Widths:**
- Dashboard: `1400px` (needs space for charts)
- Repository grid: `1200px` (3-column optimum)
- Modals: `600px` (forms), `800px` (analysis)

### 4.2 Repository Grid Layout

**Desktop (≥1024px):**
- Columns: `3` (repeat(3, 1fr))
- Gap: `space-3` (24px)
- Min card width: `320px`

**Tablet (768-1023px):**
- Columns: `2`
- Gap: `space-3` (24px)

**Mobile (<768px):**
- Columns: `1`
- Gap: `space-2` (16px)
- Card padding reduced to `space-3` (24px)

### 4.3 Modal Responsive Behavior

**Desktop:**
- Fixed width (600px/800px)
- Centered with overlay
- 48px margin from viewport edges

**Mobile:**
- Full-screen takeover (100vw, 100vh)
- Slide from bottom animation
- Header sticky top, actions sticky bottom
- Content scrollable between

### 4.4 Breakpoints

| Name | Value | Usage |
|------|-------|-------|
| `sm` | `640px` | Mobile landscape, adjust typography |
| `md` | `768px` | Tablet portrait, 2-column grid |
| `lg` | `1024px` | Desktop, 3-column grid, full dashboard |
| `xl` | `1280px` | Large desktop, max container widths |

---

## 5. Interaction & Animation

### 5.1 Animation Standards

**Durations:**
- Button hover: `200ms`
- Card hover: `250ms`
- Modal open/close: `300ms`
- LLM text streaming: `50ms` per token
- Skeleton shimmer: `1500ms` loop

**Easing:**
- Default: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
- Smooth: `cubic-bezier(0.4, 0, 0.6, 1)` (modals)
- Bounce (rare): `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (success states)

**Performance Rule:**
- ✅ Animate: `transform` (translate, scale, rotate), `opacity`
- ❌ Never: `width`, `height`, `margin`, `padding`, `top`, `left`

### 5.2 Micro-Interactions

**Button Hover:**
```
transform: translateY(-2px) scale(1.02)
shadow: increase elevation
duration: 200ms
```

**Card Hover:**
```
transform: translateY(-4px) scale(1.02)
shadow: shadow-card → shadow-card-hover
duration: 250ms
```

**API Key Validation:**
```
1. User types → debounce 500ms
2. Show spinner in input (right side)
3. API test call → 1-3s
4. Success: Green checkmark slides in + success message fade in
5. Error: Red X shake animation + error message
```

**LLM Streaming:**
```
1. Modal opens with progress bar
2. "Analyzing..." status with animated dots
3. Text appears token-by-token (50ms delay)
4. Smooth auto-scroll to keep latest visible
5. Completion: Progress bar → checkmark (300ms)
```

**Privacy Badge Pulse (First Visit):**
```
1. Badge appears bottom-right
2. Gentle scale pulse (1.0 → 1.05 → 1.0)
3. 3 pulses, then static
4. Auto-dismiss after 10s (fade out 300ms)
```

### 5.3 Loading States

**Page Load:**
1. Show skeleton cards (6-9 cards)
2. Shimmer animation active
3. Replace with real cards as data loads (stagger 50ms each)

**LLM Analysis:**
1. Button → "Analyzing..." + spinner
2. Open modal with progress indicator
3. Stream text with typewriter effect
4. Complete → enable all actions

**API Key Validation:**
1. Input → spinner (inline, 16px)
2. Success → green checkmark (slide right 200ms)
3. Error → red X (shake 300ms) + message

### 5.4 Accessibility (prefers-reduced-motion)

**When user prefers reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all animations except opacity fades */
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Keep fade transitions for essential feedback */
  .modal-enter, .toast-appear {
    transition: opacity 150ms ease-out;
  }
}
```

**Alternative feedback:**
- No card lift/scale on hover (keep shadow change only)
- No shimmer animation (show static placeholder)
- No streaming text (show "Loading..." then complete text)
- Keep color-based feedback (green/red status indicators)

---

## 6. Privacy & Security UI Patterns

### 6.1 Encrypted Data Indicators

**Visual Pattern:**
- Lock icon (16px) + "Encrypted" label
- Green border glow (privacy-border)
- Used for: API key display, stored analysis data

**Example:**
```
[API Key Input Container]
Border: 2px solid privacy-border
Shadow: shadow-privacy (green glow)
Icon: Lock (left side, success-500)
Label: "Encrypted in browser" (caption below)
```

### 6.2 Data Lifecycle Transparency

**Show user:**
- What's stored: API keys (encrypted), analysis cache, preferences
- Where: Browser localStorage/IndexedDB (not cloud)
- When cleared: User action only, or browser data clear
- Who accesses: Only user's browser, never sent to servers

**UI Element:**
```
Settings Panel → Data Management Section
  ├─ Storage Usage (e.g., "2.3 MB / 10 MB")
  ├─ Items Count (e.g., "15 analyses cached")
  ├─ Last Updated (timestamp)
  └─ Actions:
      ├─ "Clear Cache" (warning confirmation)
      ├─ "Clear API Keys" (danger confirmation)
      └─ "Export All Data" (download JSON)
```

### 6.3 Real-Time Cost Transparency

**During LLM Analysis:**
```
Token Counter (updates every 100ms)
  ├─ Icon: Receipt (16px)
  ├─ Text: "Tokens: 1,234 (~$0.02)"
  └─ Color: neutral-700 (normal), warning-500 (>5,000 tokens)
```

**In Settings:**
```
Billing Estimate Card
  ├─ "Your Usage" (title)
  ├─ "Avg cost per analysis: $0.01 - $0.05"
  ├─ "Billed by: OpenAI / Anthropic"
  └─ Link: "View [Provider] billing dashboard"
```

---

## Document Metadata

**Version:** 2.0 (Enhanced with LLM Analysis)  
**Word Count:** ~2,850 words  
**Last Updated:** 2025-11-10  
**Dependencies:** design-tokens-enhanced.json, Modern Minimalism Premium style guide  
**Target Audience:** Senior frontend engineers with design fundamentals
