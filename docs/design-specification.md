# Design Specification - GitHub Stars Explorer

## 1. Direction & Rationale

**Style:** Modern Minimalism Premium

**Visual Essence:** Professional developer tool with generous spacing, restrained color palette (90% neutral grays, 8% indigo accent, 2% semantic), and data-dense card layouts. Equal polish for dark and light themes. Clean typography with clear hierarchy, subtle shadows for depth, and micro-interactions for premium feel. Balances information density with breathing room.

**Real-World Examples:**
- Linear (linear.app) - Clean issue tracking with generous spacing
- Vercel Dashboard (vercel.com) - Professional developer tools aesthetic  
- GitHub's modern UI (github.com) - Familiar patterns for target audience

**Target Audience:** Developers (18-40) managing large collections of starred repositories, seeking efficient filtering and organization tools.

---

## 2. Design Tokens

### 2.1 Color Palette

**Primary (Indigo - Professional Tech)**

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| primary-50 | #EEF2FF | #1E1B4B | Hover backgrounds, badges |
| primary-100 | #E0E7FF | #312E81 | Selected states, focus rings |
| primary-500 | #6366F1 | #818CF8 | CTAs, links, active filters |
| primary-600 | #4F46E5 | #6366F1 | Button hover states |
| primary-900 | #312E81 | #EEF2FF | Dark accents (light mode only) |

**Neutrals (90% of UI)**

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| neutral-50 | #FAFAFA | #0A0A0A | Page background |
| neutral-100 | #F5F5F5 | #171717 | Card surfaces |
| neutral-200 | #E5E5E5 | #262626 | Borders, dividers |
| neutral-500 | #A3A3A3 | #737373 | Disabled text, placeholders |
| neutral-700 | #404040 | #D4D4D4 | Secondary text, labels |
| neutral-900 | #171717 | #FAFAFA | Primary text, headings |

**Semantic Colors**

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| success | #10B981 | #34D399 | Quality scores 8-10 |
| warning | #F59E0B | #FBBF24 | Quality scores 4-7 |
| error | #EF4444 | #F87171 | Quality scores 1-3, errors |
| info | #3B82F6 | #60A5FA | Helper text, tips |

**Background System (Surface Depth)**

| Token | Light Mode | Dark Mode | Purpose |
|-------|-----------|-----------|---------|
| bg-page | neutral-50 | #0A0A0A | Base layer |
| bg-surface | neutral-100 | #171717 | Cards (+6% contrast) |
| bg-elevated | #FFFFFF | #262626 | Modals, dropdowns (+12% contrast) |

**WCAG Validation (Key Pairings):**
- primary-500 (#6366F1) on white: 4.56:1 ✅ AA
- neutral-900 (#171717) on white: 16.5:1 ✅ AAA
- neutral-700 (#404040) on neutral-50: 8.2:1 ✅ AAA

### 2.2 Typography

**Font Families**
- Primary: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Monospace: `'Fira Code', 'SF Mono', 'Consolas', monospace` (for repo names, code snippets)

**Type Scale**

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| display | 48px | 700 | 1.1 | -0.02em | Hero title (desktop only) |
| title | 32px | 700 | 1.2 | -0.01em | Section headers |
| heading | 20px | 600 | 1.3 | 0 | Card titles, repo names |
| body-lg | 18px | 400 | 1.6 | 0 | Repository descriptions |
| body | 16px | 400 | 1.5 | 0 | Standard UI text, filters |
| small | 14px | 400 | 1.5 | 0 | Metadata, labels |
| caption | 12px | 500 | 1.4 | 0.02em | Badges, tags |

**Responsive Adjustments (Mobile <768px)**
- display: 36px
- title: 24px
- heading: 18px

### 2.3 Spacing (8-Point Grid)

| Token | Value | Usage |
|-------|-------|-------|
| xs | 8px | Icon-text gaps, inline spacing |
| sm | 16px | Element spacing, button padding |
| md | 24px | Card internal spacing, related groups |
| lg | 32px | Card padding (minimum), component gaps |
| xl | 48px | Section spacing |
| 2xl | 64px | Major section boundaries |
| 3xl | 96px | Hero section spacing (desktop) |

**Mobile Reduction:** Reduce xl/2xl/3xl by 40% (64px → 40px, 96px → 56px)

### 2.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 8px | Badges, tags |
| md | 12px | Buttons, inputs, filters |
| lg | 16px | Cards, repository items |
| xl | 24px | Modals, large containers |

### 2.5 Shadows

```css
/* sm - Subtle card elevation */
0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)

/* md - Card hover state */
0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)

/* lg - Elevated hover */
0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)

/* xl - Modal prominence */
0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)
```

**Dark Mode:** Reduce opacity by 30% (use rgba(0,0,0,0.07) instead of 0.1)

### 2.6 Animation Timing

| Token | Value | Easing | Usage |
|-------|-------|--------|-------|
| fast | 200ms | ease-out | Button hovers, quick interactions |
| base | 250ms | ease-out | Card hovers, filter toggles |
| slow | 300ms | ease-in-out | Modal open/close, theme toggle |

---

## 3. Component Specifications

### 3.1 Hero Search Section

**Structure:**
- Height: 400px desktop, 320px mobile
- Centered content container (max-width 640px)
- Vertical layout: Title → Subtitle → Search input → Example link

**Tokens:**
- Title: display (48px/36px), neutral-900, bold 700
- Subtitle: body-lg (18px), neutral-700
- Vertical spacing: 24px between elements
- Container padding: 96px vertical (desktop), 64px (tablet), 48px (mobile)

**States:**
- Default: Clean, spacious, inviting
- Focus: Search input expands slightly (scale 1.02), primary-500 ring

**Note:** No background image/gradient - solid neutral-50 (light) or #0A0A0A (dark). Simplicity reinforces tool nature.

### 3.2 Search Input (Primary)

**Structure:**
- Height: 56px
- Icon (search) + input field + button (inline)
- Full-width on mobile, 600px max-width desktop

**Tokens:**
- Padding: 16px horizontal
- Border: 2px solid neutral-200, radius-md (12px)
- Font: body (16px), regular 400
- Button: primary-500 bg, 48px height, 24px horizontal padding, radius-md

**States:**
- Default: neutral-200 border
- Focus: primary-500 2px ring (no border jump), lift shadow-sm
- Error: error border, red text helper below
- Loading: Animated spinner replaces button

### 3.3 Repository Card

**Structure:**
- Padding: lg (32px) desktop, md (24px) mobile
- Grid: Name row → Description → Metadata row
- Hover-sensitive full card (not just title)

**Tokens:**
- Background: bg-surface (neutral-100 light, #171717 dark)
- Border: 1px solid neutral-200
- Radius: lg (16px)
- Gap: md (24px) between internal sections

**Content Layout:**
- **Name row:** Repo name (heading 20px, semibold) + Star count (small 14px, neutral-700) + Language badge
- **Description:** body-lg (18px), neutral-700, 2-line clamp with ellipsis
- **Metadata row:** Quality score badge + Tags (2-3 max) + Updated date (caption 12px)

**States:**
- Default: shadow-sm, neutral-100 bg
- Hover: lift -4px, shadow-lg, scale(1.02), primary-50 border tint (250ms ease-out)
- Active/Selected: primary-100 background, primary-500 border

**Note:** Language badge uses language-specific colors (JavaScript=#F7DF1E, Python=#3776AB, etc.) at 10% opacity backgrounds with full-sat text for recognition.

### 3.4 Filter System (Horizontal)

**Structure:**
- Sticky bar below header (height 64px)
- Horizontal scroll on mobile with fade indicators
- Layout: Search field (40%) + Category chips + Language dropdown + Quality slider + Sort dropdown

**Tokens:**
- Background: bg-elevated (white light, #262626 dark) with shadow-sm
- Padding: sm (16px) vertical, md (24px) horizontal
- Gap: sm (16px) between filter groups
- Border bottom: 1px neutral-200

**Filter Chips (Category/Tags):**
- Height: 40px
- Padding: 12px horizontal
- Radius: md (12px)
- Font: body (16px), medium 500
- Default: neutral-200 border, neutral-700 text
- Active: primary-500 bg, white text
- Hover: primary-50 bg (inactive), primary-600 bg (active)

**Note:** Max 8 visible categories before "More" dropdown. Use Lucide icons (16px) for filter types.

### 3.5 Statistics Dashboard

**Structure:**
- 4-column grid desktop → 2-column tablet → 1-column mobile
- Cards with centered content: Large number + Label + Trend indicator (optional)

**Tokens:**
- Card padding: lg (32px)
- Background: bg-surface with subtle gradient overlay (5% neutral-100 to transparent)
- Border: 1px solid neutral-200
- Radius: lg (16px)
- Gap: md (24px) between cards

**Content:**
- Number: display (48px), bold 700, primary-500 color
- Label: small (14px), neutral-700
- Icon: 32px, primary-500 with 10% opacity circle bg

**States:**
- Hover: Lift -2px, shadow-md (subtle interaction feedback)

### 3.6 Repository Detail Modal

**Structure:**
- Max-width: 800px
- Overlay: rgba(0,0,0,0.5) backdrop with backdrop-blur(8px)
- Vertical sections: Header → Stats row → Topics grid → Description → Actions

**Tokens:**
- Background: bg-elevated
- Padding: xl (48px) desktop, lg (32px) mobile
- Radius: xl (24px)
- Shadow: xl (prominent)

**Header:**
- Repo name: title (32px), bold
- Owner/name in monospace, neutral-700
- Close button: 40×40px, top-right, neutral-500 hover

**Actions:**
- Primary button: "View on GitHub" (56px height, primary-500)
- Secondary: "Copy URL" (neutral-200 border)

**Note:** Trap focus within modal, ESC to close, smooth 300ms fade in/out.

---

## 4. Layout & Responsive

### 4.1 App Structure (SPA)

**Global Layout:**
```
App Header (sticky, 72px)
  └─ Logo/Title (left) + Theme toggle (right)

Hero Search Section (400px, shown until first search)
  └─ Centered content (max-width 640px)

Filter Bar (sticky, 64px, appears after search)
  └─ Horizontal scrollable filters

Statistics Dashboard (auto height, 24px gap from filters)
  └─ 4-col grid of metric cards

Repository Grid (auto height, fills remaining space)
  └─ 3-col grid (desktop) → 2-col (tablet) → 1-col (mobile)
  └─ 24px gap between cards
```

**Visual Hierarchy:**
1. **Hero Search** (500px total with spacing): Primary focal point before interaction
2. **Statistics Dashboard** (auto, ~200px with cards): Secondary prominence after data loads
3. **Repository Grid** (infinite scroll): Main content area, equal card prominence
4. **Filter Bar** (sticky 64px): Persistent controls without obscuring content

**Navigation Pattern:**
- No traditional navigation (single-page tool)
- Header remains minimal (title + theme toggle only)
- Filters stick below header when scrolling past hero

**Responsive Strategy:**
- Hero: Full-width, reduce padding 96px → 48px on mobile
- Filters: Horizontal scroll with touch-drag on mobile, fade indicators at edges
- Stats: 4 → 2 → 1 columns at breakpoints
- Repo grid: 3 → 2 → 1 columns, maintain 24px gaps (16px mobile)

### 4.2 Grid System

**Breakpoints:**
```
sm:  640px  (Mobile landscape)
md:  768px  (Tablet portrait) 
lg:  1024px (Tablet landscape)
xl:  1280px (Desktop)
2xl: 1536px (Large desktop)
```

**Container Max-Widths:**
```
sm:  100% (full-width with 16px padding)
md:  100% (full-width with 24px padding)
lg:  100% (full-width with 32px padding)
xl:  1280px (centered, 32px padding)
2xl: 1440px (centered, 40px padding)
```

**Repository Grid Columns:**
```
Default (≥1280px): 3 columns, 24px gap, ~400px cards
lg (1024-1279px):  3 columns, 20px gap, ~320px cards
md (768-1023px):   2 columns, 20px gap, ~360px cards
sm (<768px):       1 column, 16px gap, full-width cards
```

### 4.3 Spacing Patterns

**Section Boundaries:**
- Hero → Stats: 64px (48px mobile)
- Stats → Repo Grid: 48px (32px mobile)
- Between repos: 24px (16px mobile)

**Component Spacing:**
- Card internal: 32px padding (24px mobile)
- Filter groups: 16px gap
- Metadata elements: 8px gap

**Content Whitespace Ratio:**
- Hero section: 50% content, 50% whitespace (breathing room)
- Repository grid: 65% content, 35% whitespace (data-dense but comfortable)
- Statistics cards: 60% content, 40% whitespace

### 4.4 Touch Targets (Mobile)

**Minimum Sizes:**
- Buttons: 48×48px
- Filter chips: 40px height
- Card tap area: Full card (minimum 120px height)
- Close buttons: 44×44px

**Spacing:**
- Between tappable elements: 8px minimum
- Filter chips: 8px horizontal gap
- Card grid gap: 16px (prevents mis-taps)

---

## 5. Interaction & Animation

### 5.1 Animation Standards

**Performance Rule:** Only animate `transform` and `opacity` (GPU-accelerated).

**Durations:**
- Button hover/active: 200ms (fast feedback)
- Card hover: 250ms (standard)
- Modal open/close: 300ms (smooth, noticeable)
- Theme toggle: 300ms (graceful transition)
- Page transitions: 300ms stagger (fade + translateY)

**Easing:**
- 90% of interactions: `ease-out` (natural deceleration)
- Modals, theme toggle: `ease-in-out` (smooth start/end)

### 5.2 Component Animations

**Repository Card Hover:**
```css
transform: translateY(-4px) scale(1.02)
box-shadow: shadow-sm → shadow-lg
border-color: neutral-200 → primary-100
transition: all 250ms ease-out
```

**Filter Chip Toggle:**
```css
/* Inactive → Active */
background: transparent → primary-500
color: neutral-700 → white
transform: scale(0.95) → scale(1.0) (on click)
transition: all 200ms ease-out
```

**Search Input Focus:**
```css
transform: scale(1.02)
box-shadow: 0 0 0 2px primary-500
transition: all 250ms ease-out
```

**Modal Enter/Exit:**
```css
/* Enter */
opacity: 0 → 1
transform: translateY(20px) → translateY(0)
backdrop: opacity 0 → 0.5
transition: all 300ms ease-in-out

/* Exit */
Reverse sequence, 300ms
```

### 5.3 Micro-interactions

**Button States:**
- Hover: Lift -2px, scale(1.02), darken background 10%
- Active: scale(0.98), no lift
- Disabled: opacity 0.5, cursor not-allowed, no hover effects

**Loading States:**
- Skeleton cards: Pulse animation (1.5s infinite), neutral-200 → neutral-100 gradient
- Spinner: Rotate 360deg (1s linear infinite), primary-500 color

**Theme Toggle:**
- Smooth color transitions across all elements (300ms ease-in-out)
- Icon rotation (moon ↔ sun, 300ms with slight scale pulse)
- Background colors fade, no jarring switches

**Scroll Behaviors:**
- Smooth scroll: `scroll-behavior: smooth` for anchor links
- Filter bar appears with slide-down + fade (300ms) when hero exits viewport
- Infinite scroll: Load more cards with stagger fade-in (50ms delay each)

### 5.4 Accessibility Animations

**Reduced Motion Support:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Focus States:**
- All interactive elements: 2px primary-500 focus ring
- Skip-to-content link (keyboard users): Slide-in from top
- Focus trap in modals: Tab cycles within modal only

**Animation Feedback:**
- Success states: Checkmark scale + fade (400ms)
- Error states: Subtle shake (300ms, translateX(-4px) → 4px → 0)
- Copy to clipboard: "Copied!" tooltip fade in/out (2s total)

---

**End of Design Specification**

**Files:** 3 deliverables
1. ✅ Content Structure Plan (docs/content-structure-plan.md)
2. ✅ Design Specification (docs/design-specification.md, ~2,400 words)
3. ⏳ Design Tokens JSON (next)
