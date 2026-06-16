# Fortune India — Design System v1.0
## "Precision Commerce" — Enterprise Design Reference

---

## 0. Visual Bug Fixes (From Screenshot Review)

### Bug 1 — Bento Hero Tile 1: Button clipped at bottom
**Root cause:** The bento tile has `overflow: hidden` + fixed row height (340px).  
The tile content (eyebrow + H1 + paragraph + 4 chips + 2 CTAs) overflows the tile height.

**Fix — do ALL of these:**
```css
/* 1. Increase row 1 height */
grid-template-rows: 400px 160px;   /* was 340px */

/* 2. Give the tile padding room */
.tile-main { padding: 40px 44px; }

/* 3. Reduce H1 font size on the tile */
.tile-main h1 { font-size: clamp(26px, 3.2vw, 42px); }

/* 4. Reduce chip margin */
.chip-row { margin-bottom: 16px; }   /* was 24px */

/* 5. Do NOT use overflow:hidden on the main text tile */
.tile-main { overflow: visible; }
```

### Bug 2 — Product Card Hover State (from Image 3)
**Current:** "Add to Cart" slides up from bottom of info section.  
**Correct:** On hover, the IMAGE ZONE gets a dark overlay and TWO buttons appear centred over the image:
- Button 1: Dark filled pill — "🛒 Add to Cart" (dark bg, white text)
- Button 2: Light outlined pill — "👁 View Details" (white/cream bg, dark text)

The discount badge (-17%) stays BELOW the image zone at the image/info border.
The "184 sold" social proof appears on the SAME LINE as the star rating (right-aligned).

---

## 1. Brand Foundation

### 1.1 Identity

| Property | Value |
|---|---|
| **Company** | Fortune India |
| **Full name** | Fortune India Precision Printing Solutions |
| **Tagline** | "Transforming Your Vision into Reality." |
| **Sub-tagline** | "High-Quality, Durable & Precision Printing Solutions" |
| **Voice** | Confident. Technical. Trustworthy. Direct. |
| **Audience** | Procurement managers, engineers, operations heads at manufacturing & PSU companies |
| **Model** | B2B ecommerce — catalogue + cart + RFQ hybrid |
| **Authorized to** | HAL (Hindustan Aeronautics Limited), BHEL (Bharat Heavy Electricals), TATA Group |
| **Location** | 369, Attibele, Bangalore, Karnataka |
| **Phone** | +91 88305 75677 |
| **Email** | fortuneindiabgl@gmail.com |

### 1.2 Design Philosophy: "Precision Commerce"

Fortune India occupies a precise niche — the visual language must communicate **industrial precision** (clean, technical, exact) while remaining **commercially accessible** (warm canvas, approachable cards, clear CTAs). 

Three principles govern every decision:
1. **One signal, zero noise** — Orange `#FF5A1F` is the only chromatic accent. Everything else is neutral. When orange appears, it means "action" or "identity."
2. **Precision over decoration** — Grid alignment, consistent spacing increments, and typographic hierarchy do the work. No gradients, no decorative blobs, no unnecessary shadows.
3. **Trust through specificity** — Real company names (HAL, BHEL, TATA), real specs, real addresses. Vagueness erodes B2B trust faster than anything.

---

## 2. Color Tokens

```css
:root {
  /* ── Backgrounds ── */
  --color-canvas:        #F6F4F0;   /* warm off-white — page background */
  --color-surface:       #FFFFFF;   /* card surfaces, modals */
  --color-surface-alt:   #EEEBE5;   /* alternate section bg, table headers */
  --color-signal-tint:   #FFF0EB;   /* hero tile bg, light orange wash */
  --color-dark:          #141414;   /* footer, dark strips */
  --color-dark-card:     #1E1E1E;   /* cards on dark surfaces */
  --color-dark-border:   #2A2A2A;   /* borders on dark surfaces */

  /* ── Brand Accent ── */
  --color-signal:        #FF5A1F;   /* PRIMARY orange — CTAs, links, icons */
  --color-signal-hover:  #E04A10;   /* hover state */
  --color-signal-active: #C83A00;   /* pressed/active state */
  --color-signal-tint:   #FFF0EB;   /* very soft orange wash */
  --color-signal-mid:    #FF7A47;   /* mid-tone for gradients */

  /* ── Text ── */
  --color-ink:           #0F0F0F;   /* headings — near black */
  --color-body:          #3A3A3A;   /* body paragraphs */
  --color-muted:         #7A7A7A;   /* captions, labels, placeholders */
  --color-placeholder:   #ADADAD;   /* input placeholder text */
  --color-on-dark:       #FFFFFF;   /* text on dark backgrounds */
  --color-on-dark-muted: #9A9A9A;   /* muted text on dark */
  --color-on-dark-dim:   #6A6A6A;   /* very muted text on dark */

  /* ── Borders ── */
  --color-border:        #E2DFD8;   /* default card/input border */
  --color-border-dark:   #CCC9C1;   /* emphasized borders */
  --color-border-light:  #F0EDE8;   /* very subtle dividers */

  /* ── Status ── */
  --color-success:       #1A9E5C;
  --color-success-tint:  #EBF8F2;
  --color-success-border:#B8E6D4;
  --color-warning:       #E6A817;
  --color-warning-tint:  #FDF5E0;
  --color-warning-border:#F5DFA0;
  --color-error:         #E63946;
  --color-error-tint:    #FDEAEB;
  --color-error-border:  #F5B8BC;

  /* ── Semantic UI ── */
  --color-star:          #F5A623;   /* star rating gold */
  --color-sold-text:     #7A7A7A;   /* "184 sold" muted */
  --color-discount-bg:   #E63946;   /* discount badge red */
  --color-brand-badge-bg:#FFFFFF;   /* "Fortune India" badge on card */
}
```

**Anti-patterns — NEVER do these:**
- ❌ No gradient backgrounds on any public-facing element
- ❌ No secondary accent color — orange is the only chromatic color
- ❌ No `#000000` pure black — always use `--color-ink` (`#0F0F0F`)
- ❌ No opacity < 0.3 on any text for accessibility
- ❌ No `color: var(--color-muted)` on interactive elements

---

## 3. Typography System

### 3.1 Font Stack

```css
--font-display: 'Plus Jakarta Sans', sans-serif;   /* headings */
--font-body:    'Inter', sans-serif;               /* body, UI */
--font-mono:    'JetBrains Mono', monospace;       /* specs, labels, badges */
```

**Rationale:**
- **Plus Jakarta Sans** — modern, rounded, premium. Communicates industrial precision without feeling cold. The rounded terminals soften the technical subject matter.
- **Inter** — the most legible neutral UI face at small sizes. Invisible at 14px, which is what body copy needs.
- **JetBrains Mono** — designed for technical readability. Used on specs, part numbers, dimensions, category labels — signals precision to an engineering audience.

### 3.2 Type Scale

```css
/* Display */
--text-hero:       clamp(32px, 5.5vw, 56px);    /* homepage H1 */
--text-display:    clamp(26px, 3.5vw, 40px);    /* page headings */
--text-heading:    clamp(20px, 2.5vw, 28px);    /* section headings */
--text-subhead:    20px;                          /* sub-headings */

/* Body */
--text-body-lg:    17px;                          /* hero description */
--text-body:       15px;                          /* standard body */
--text-body-sm:    14px;                          /* secondary body */

/* UI */
--text-label:      13px;                          /* UI labels */
--text-caption:    12px;                          /* captions, meta */
--text-micro:      11px;                          /* badges, chips */
--text-nano:       10px;                          /* eyebrows, mono labels */

/* Mono — always pair with letter-spacing */
--text-mono-lg:    13px;   /* spec lines */
--text-mono-sm:    11px;   /* badge text */
--text-mono-xs:    10px;   /* eyebrow labels */
--text-mono-xxs:   9px;    /* ultra-small brand marks */
```

### 3.3 Typographic Rules

```
Headings (Plus Jakarta Sans):
  font-weight: 800 (H1), 700 (H2/H3), 600 (H4)
  letter-spacing: -0.5px (hero), -0.3px (display), 0 (heading)
  line-height: 1.1 (hero), 1.2 (display), 1.3 (heading)

Body (Inter):
  font-weight: 400 (default), 500 (emphasis), 600 (strong)
  line-height: 1.7 (paragraphs), 1.5 (UI text), 1.3 (labels)

Mono (JetBrains Mono):
  font-weight: 400 or 500 only
  letter-spacing: 0.06em (badges), 0.10em (eyebrows), 0.14em (section labels)
  Always: text-transform: uppercase on eyebrows/labels
```

---

## 4. Spacing & Layout

### 4.1 Spacing Scale (4px base)

```css
--space-1:  4px    --space-2:  8px    --space-3:  12px
--space-4:  16px   --space-5:  20px   --space-6:  24px
--space-8:  32px   --space-10: 40px   --space-12: 48px
--space-16: 64px   --space-20: 80px   --space-24: 96px
--space-32: 128px
```

### 4.2 Border Radius

```css
--radius-sm:   6px    /* inputs, small chips */
--radius-md:   10px   /* small cards, tooltips */
--radius-lg:   14px   /* medium cards */
--radius-xl:   20px   /* product cards, main cards */
--radius-2xl:  24px   /* bento tiles, hero cards */
--radius-3xl:  32px   /* large feature cards */
--radius-pill: 100px  /* ALL buttons, ALL badges */
```

**Rule:** No `border-radius: 0` on any user-facing element. All interactive surfaces are rounded.

### 4.3 Container & Grid

```css
--container-max:  1280px
--container-pad:  clamp(16px, 5vw, 72px)   /* horizontal page padding */
--section-pad-y:  clamp(56px, 7vw, 96px)   /* vertical section padding */

/* Product grid */
--grid-products:  repeat(auto-fill, minmax(280px, 1fr))

/* Bento hero grid */
/* Desktop */  grid-template-columns: 1fr 320px 260px;
               grid-template-rows: 400px 160px;  /* FIXED: was 340px — caused button clip */
/* Tablet */   grid-template-columns: 1fr 1fr;
/* Mobile */   grid-template-columns: 1fr;
```

### 4.4 Shadow System

```css
--shadow-card:   0 2px 8px rgba(15,15,15,0.07), 0 1px 2px rgba(15,15,15,0.04);
--shadow-hover:  0 8px 28px rgba(15,15,15,0.14), 0 2px 8px rgba(15,15,15,0.06);
--shadow-md:     0 4px 16px rgba(15,15,15,0.10);
--shadow-lg:     0 12px 40px rgba(15,15,15,0.16);
--shadow-inset:  inset 0 1px 2px rgba(15,15,15,0.06);
--shadow-focus:  0 0 0 3px rgba(255,90,31,0.20);  /* focus ring */
```

---

## 5. Component Library

### 5.1 ProductCard — CANONICAL SPECIFICATION

This is the most important component. Every instance must match this exactly.

```
ANATOMY (resting state):
┌─────────────────────────────────────────┐
│ [☆ FORTUNE INDIA] ←top-left  [♡] ←top-right │  
│                                         │  IMAGE ZONE
│              Placeholder                │  bg: #EBEBEB
│                                         │  aspect-ratio: 4/3
│                                         │
└─────────────────────────────────────────┘
       ↑ [-17%] ← red pill, overlaps border (translateY -50%)
┌─────────────────────────────────────────┐
│ WALL MOUNT ← orange mono 10px           │  
│ 43/55 Slim Wall Mount Display           │  INFO ZONE
│ by DSAM Official ← mono 11px muted     │  bg: white
│ ★★★★½  (25)            184 sold →      │  
│                                         │  
│ ₹1,500.00  ~~₹1,800.00~~   [IN STOCK]  │  
└─────────────────────────────────────────┘

ANATOMY (hover state — image zone):
┌─────────────────────────────────────────┐
│ [☆ FORTUNE INDIA]             [♡]       │
│         dark overlay rgba(0,0,0,0.55)   │
│    ┌─────────────────────────────┐      │
│    │  🛒  Add to Cart            │  ← dark pill (#141414 bg, white)
│    └─────────────────────────────┘      │
│    ┌─────────────────────────────┐      │
│    │  👁  View Details           │  ← light pill (white/cream bg, dark text)
│    └─────────────────────────────┘      │
└─────────────────────────────────────────┘
       ↑ [-17%] ← stays in same position

KEY DIFFERENCES FROM OLD SPEC:
1. Hover buttons appear OVER the IMAGE (not below it)
2. Dark overlay animates in on hover: opacity 0 → 1
3. Both buttons slide up: translateY(12px) → translateY(0)
4. Discount badge is BELOW image at the border, translateY(-50%)
5. "184 sold" is RIGHT-ALIGNED on the same line as stars
6. No "Add to Cart" in the info section at all
7. Stock badge is to the RIGHT of the price on the same row
```

**ProductCard CSS Specification:**

```css
/* Card wrapper */
.product-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  transition: transform 300ms cubic-bezier(0.16,1,0.3,1),
              box-shadow 300ms cubic-bezier(0.16,1,0.3,1);
  position: relative;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

/* IMAGE ZONE */
.pc-image-zone {
  position: relative;
  aspect-ratio: 4/3;
  background: #EBEBEB;
  overflow: hidden;
}
.pc-image-zone img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 500ms cubic-bezier(0.16,1,0.3,1);
}
.product-card:hover .pc-image-zone img {
  transform: scale(1.04);
}

/* Hover overlay — over image */
.pc-hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 20px;
  transition: opacity 250ms ease;
  z-index: 3;
}
.product-card:hover .pc-hover-overlay { opacity: 1; }

/* Hover buttons */
.pc-hover-btn {
  width: 100%;
  max-width: 220px;
  border-radius: var(--radius-pill);
  padding: 11px 20px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  border: none;
  transform: translateY(12px);
  transition: transform 280ms cubic-bezier(0.16,1,0.3,1),
              background 150ms ease;
}
.product-card:hover .pc-hover-btn {
  transform: translateY(0);
}
.pc-hover-btn:nth-child(2) {
  transition-delay: 40ms;  /* stagger */
}
.pc-btn-cart {
  background: #141414;
  color: #fff;
}
.pc-btn-cart:hover { background: #2a2a2a; }
.pc-btn-view {
  background: #F6F4F0;
  color: #0F0F0F;
}
.pc-btn-view:hover { background: #fff; }

/* TOP-LEFT: brand badge */
.pc-brand-badge {
  position: absolute;
  top: 12px; left: 12px;
  z-index: 4;
  background: rgba(255,255,255,0.95);
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: var(--radius-pill);
  padding: 5px 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-ink);
  box-shadow: 0 1px 4px rgba(0,0,0,0.10);
  backdrop-filter: blur(4px);
}
.pc-brand-star { color: var(--color-signal); font-size: 11px; }

/* TOP-RIGHT: wishlist button */
.pc-wishlist {
  position: absolute;
  top: 12px; right: 12px;
  z-index: 4;
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.95);
  border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  backdrop-filter: blur(4px);
  transition: transform 150ms ease, background 150ms ease;
}
.pc-wishlist:hover { transform: scale(1.10); background: #fff; }
.pc-wishlist svg { width: 16px; height: 16px; color: #ccc; transition: color 150ms; }
.pc-wishlist.active svg { color: #E63946; fill: #E63946; }

/* DISCOUNT BADGE — sits at image/info boundary */
.pc-discount {
  position: absolute;
  bottom: -1px;             /* flush with bottom of image zone */
  left: 14px;
  z-index: 5;
  transform: translateY(-50%);  /* half above, half below the border */
  background: var(--color-discount-bg);
  color: #fff;
  border-radius: var(--radius-pill);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  letter-spacing: 0.02em;
}

/* INFO ZONE */
.pc-info {
  padding: 16px 16px 18px;
  border-top: 1px solid var(--color-border);
  position: relative;
}

/* Category */
.pc-category {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-signal);
  margin-bottom: 5px;
}

/* Product name */
.pc-name {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  color: var(--color-ink);
  line-height: 1.25;
  margin-bottom: 3px;
}

/* Brand line */
.pc-brand-line {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  margin-bottom: 10px;
}
.pc-brand-line strong {
  font-weight: 500;
  color: #555;
}

/* Stars + sold count — SAME ROW */
.pc-rating-row {
  display: flex;
  align-items: center;
  justify-content: space-between;  /* stars left, sold right */
  margin-bottom: 14px;
}
.pc-stars { display: flex; gap: 1px; }
.pc-star { font-size: 14px; color: var(--color-star); line-height: 1; }
.pc-star-empty { color: #D1D5DB; }
.pc-review-count {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--color-muted);
  margin-left: 5px;
}
.pc-sold-count {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--color-sold-text);
  font-weight: 400;
}

/* Price + stock — SAME ROW */
.pc-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.pc-price-block { display: flex; align-items: baseline; gap: 8px; }
.pc-price-current {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  color: var(--color-ink);
  letter-spacing: -0.3px;
}
.pc-price-original {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-muted);
  text-decoration: line-through;
}
.pc-stock-badge {
  border-radius: var(--radius-pill);
  padding: 5px 12px;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.pc-stock-in  { background: var(--color-success-tint);  color: var(--color-success); }
.pc-stock-low { background: var(--color-warning-tint);  color: var(--color-warning); }
.pc-stock-out { background: var(--color-error-tint);    color: var(--color-error);   }
```

**ProductCard TSX Props Interface:**
```tsx
interface ProductCardProps {
  id: string
  slug: string
  name: string
  price: number
  originalPrice?: number
  images: string[]            // array of image URLs
  category: string
  categorySlug: string
  brand?: string              // default: "Fortune India"
  rating?: number             // 0–5, supports half stars
  reviewCount?: number
  soldCount?: number          // "184 sold" social proof
  stock: number               // 0 = out, 1–5 = low, 6+ = in stock
}
```

---

### 5.2 Button System

All buttons use `border-radius: var(--radius-pill)`, Plus Jakarta Sans, `font-weight: 600`.

```tsx
// Variants
type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'dark' | 'white'
type ButtonSize    = 'sm' | 'md' | 'lg'

// primary  — bg: signal, text: white,   hover: signal-hover
// outline  — bg: transparent, border: signal, text: signal, hover: signal-tint bg
// ghost    — bg: transparent, border: border-dark, text: ink, hover: canvas bg
// dark     — bg: #141414, text: white,  hover: #2a2a2a
// white    — bg: white, text: ink,      hover: surface-alt — used on dark bg sections

// Sizes
// sm: padding 8px 18px, font 13px, height 36px
// md: padding 11px 24px, font 14px, height 44px  ← default
// lg: padding 14px 32px, font 15px, height 52px
```

### 5.3 Input System

```css
/* Default boxed input */
.input {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 11px 14px;
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-ink);
  transition: border-color 150ms, box-shadow 150ms;
  width: 100%;
}
.input:focus {
  border-color: var(--color-signal);
  box-shadow: var(--shadow-focus);
  outline: none;
}
.input::placeholder { color: var(--color-placeholder); }
.input.error { border-color: var(--color-error); }

/* Label */
.input-label {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink);
  margin-bottom: 6px;
  display: block;
}

/* Error message */
.input-error {
  font-size: 12px;
  color: var(--color-error);
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
```

### 5.4 Badge / Chip System

```css
/* All badges: border-radius pill, JetBrains Mono */

.badge-signal  { bg: signal-tint,   color: signal,   border: signal }
.badge-success { bg: success-tint,  color: success,  border: success-border }
.badge-warning { bg: warning-tint,  color: warning,  border: warning-border }
.badge-error   { bg: error-tint,    color: error,    border: error-border }
.badge-neutral { bg: surface-alt,   color: muted,    border: border-dark }
.badge-dark    { bg: dark,          color: white,    border: none }

/* Sizes */
.badge-sm { padding: 3px 10px;  font-size: 10px; }  /* eyebrow labels */
.badge-md { padding: 5px 14px;  font-size: 11px; }  /* default */
.badge-lg { padding: 7px 18px;  font-size: 13px; }  /* category filter tabs */
```

### 5.5 Section Eyebrow Pattern

Every section uses this exact eyebrow pattern:
```tsx
<p className="section-eyebrow">/ SECTION LABEL</p>
<h2 className="section-heading">Main Heading Here.</h2>
<p className="section-sub">Supporting description sentence.</p>
```

```css
.section-eyebrow {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-signal);
  margin-bottom: 10px;
}
.section-heading {
  font-family: var(--font-display);
  font-size: clamp(26px, 3.5vw, 40px);
  font-weight: 800;
  color: var(--color-ink);
  letter-spacing: -0.4px;
  line-height: 1.15;
  margin-bottom: 12px;
}
.section-sub {
  font-size: 16px;
  color: var(--color-muted);
  max-width: 560px;
  line-height: 1.7;
}
```

---

## 6. Page-by-Page Specifications

### 6.1 Homepage — Bug Fixes

**Fix: Bento Hero Tile 1 (button clipped)**

The tile-main needs height adjustment. Change grid-template-rows from `340px 150px` to `400px 160px`. Additionally the tile should have `min-height` instead of fixed height so it can flex:

```css
.bento-grid {
  grid-template-rows: minmax(380px, auto) 160px;
}
.tile-main {
  padding: 40px 44px;
  overflow: visible;   /* critical — not hidden */
  align-self: stretch;
}
```

**Bento Grid — full corrected layout:**
```
Desktop: grid-template-columns: 1fr 320px 260px
         grid-template-rows: minmax(380px, auto) 160px

Tile 1 [col 1, row 1, signal-tint]:
  Eyebrow, H1 clamp(28px,3.5vw,44px), body 15px, 4 chips, 2 CTAs
  overflow: visible; padding: 40px 44px

Tile 2 [col 2, row 1, grey placeholder]:
  Product image / placeholder
  Badge bottom-right: white pill "500+ Products Delivered"

Tile 3 [col 3, row 1, dark #141414]:
  🛡️ icon, "DEFENCE GRADE" mono orange, H3 white, body #9A9A9A, "Explore Range →"

Tile 4 [col 1 first-half, row 2, white card]:
  "15+" extrabold, "Years in Precision Printing"

Tile 5 [col 1 second-half, row 2, white card]:
  "10+" extrabold, "Industries Served"

Tile 6 [col 2, row 2, signal orange]:
  "Bulk Order Pricing" h4 white, body white/80, "Request Quote →" pill

Tile 7 [col 3, row 2, white card]:
  5 stars, quote italic, author mono
```

---

### 6.2 Shop / Products Page

**URL:** `/products`  
**Purpose:** Browse all products with category filter and search

**Layout:**
```
[Announcement Strip]
[Header]

Page Header (canvas bg, 56px padding top):
  Eyebrow: "/ PRODUCT CATALOGUE"
  H1: "Precision Printing Products."
  Sub: "Browse our full range of industrial-grade printing solutions."

Filter Bar (sticky, white, border-bottom, top: 64px [header height]):
  Left: Filter tabs — pill chips
    [ All ] [ Nameplates ] [ Labels & Decals ] [ Stickers ] [ Flex & Banners ] [ Packaging ] [ Barcode Labels ]
    Active: signal orange fill. Inactive: outlined border-dark.
  Right: Sort dropdown + Search input (icon inside)
  
  Below tabs: result count "Showing 24 products" mono 12px muted

Product Grid (canvas bg):
  padding: 32px container-pad
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))
  gap: 24px
  Each card: <ProductCard /> component — exact spec from section 5.1

Empty state (no products in category):
  Centred icon + "No products in this category yet" + "Contact us for custom orders →"

Pagination (if > 12 products):
  Prev / page numbers / Next — pill buttons, signal active state
```

---

### 6.3 Product Detail Page

**URL:** `/products/[slug]`  
**Purpose:** Full product info, specs, add to cart

**Layout — 2 columns (55% / 45%):**

```
[Breadcrumb — slash separator]:
  Home / Products / Nameplates / Aluminium Engraved Nameplate
  font: mono 12px muted, separators "/" in signal orange

LEFT COLUMN (55%):
  Main image: rounded-xl, border, aspect 4:3 or 1:1
  Thumbnails row: 4 thumbnails below, selected = signal border 2px
  Click main image → lightbox (Motion scaled overlay, backdrop blur)

RIGHT COLUMN (45%):
  Category badge: signal-tint bg, signal text, mono 11px, pill
  
  Product name: Plus Jakarta Sans 32px bold ink

  Rating row: stars + "(25 reviews)" + "184 sold" right-aligned

  Price block:
    Current price: 28px extrabold ink — "₹1,500.00"
    Original: 16px strikethrough muted — "₹1,800.00"
    Discount badge: "-17%" error-red pill
  
  Short description: Inter 15px body 1.7 line-height

  Specs Table:
    background: canvas, border-radius: radius-lg, padding: 20px
    Label col: mono 12px muted, 120px wide
    Value col: Inter 14px semibold ink
    Border-bottom: 1px border-light on each row
    Rows: Material | Process | Size | Finish | Min. Order | Delivery | Compliance

  Feature chips (flex wrap):
    Each: canvas bg, border-dark border, mono 11px muted, pill
    Derived from product specs

  Quantity selector:
    [–] [  3  ] [+] — border input, ink text, signal +/– buttons
    "Min. order: 50 units" mono 11px muted below

  CTAs (full width, stacked):
    Primary (52px height): "Add to Cart" signal filled pill
    Secondary (44px height): "Request Custom Quote →" ghost pill
    
  Delivery info card:
    canvas bg, border, radius-lg, padding 14px
    🚚 "Pan-India delivery in 5–7 working days"
    🏭 "Bulk discounts available above 500 units"

BELOW FOLD:
  "/ SPECIFICATIONS" — full specs in 2-column table
  "/ RELATED PRODUCTS" — 4-card horizontal row
  "/ REVIEWS" — star breakdown + review cards
```

---

### 6.4 Cart Page

**URL:** `/cart`  
**Purpose:** Review items, adjust quantities, proceed to checkout

**Layout — 2 columns (60% / 40%):**

```
Page header (canvas bg):
  H1: "Your Cart" + item count "3 items" mono muted

LEFT — Cart Items (60%):
  Each item row (white card, radius-xl, border, padding 20px):
    [Product image 80×80 rounded-lg]
    Product name: 16px semibold ink
    Category: mono 10px orange
    Brand line: mono 11px muted
    Spec summary: mono 11px muted (e.g. "Anodized · Laser Engraved")
    
    Quantity control: [–] [qty] [+] with border, inline, signal color
    
    Price (right side): current price bold + per-unit muted below
    
    Remove: "✕ Remove" link, mono 11px, muted → error on hover
    
    Wishlist: "♡ Save for later" link, mono 11px, muted → signal on hover

  Divider between items: 1px border-light

  Bottom of item list:
    "← Continue Shopping" ghost link left-aligned

RIGHT — Order Summary (40%):
  White card, border, radius-xl, padding 24px, sticky top: 96px

  Title: "Order Summary" Plus Jakarta Sans 18px semibold ink

  Line items:
    Subtotal: right-aligned
    Shipping: "Calculated at checkout" or free if >threshold
    GST (18%): calculated
    ─────────────────────────
    Total: 22px extrabold ink (right)

  Promo code input:
    [Code input         ] [Apply →]
    Signal outlined button, full-width row

  CTA: "Proceed to Checkout →" signal filled pill, 52px height, full-width

  Security note below CTA:
    🔒 "Secure checkout. 100% safe & encrypted."
    mono 11px muted, centered

  Trust badges row:
    [ Razorpay ] [ SSL ] [ GST Compliant ]
    Grayscale, small, 80px each

Empty cart state:
  Centered illustration area + "Your cart is empty"
  "Browse Products →" signal button
```

---

### 6.5 Checkout / Payment Page

**URL:** `/checkout`  
**Purpose:** Collect delivery details, place order, Razorpay payment

**Layout — 2 columns (55% / 45%):**

```
Page stepper header (white, border-bottom):
  [1. Cart] → [2. Details] → [3. Payment] → [4. Confirm]
  Current step: signal orange, completed: signal-tint, upcoming: muted

LEFT — Order Details Form (55%):
  Section: "Contact Information"
    Full Name* (required)
    Company Name
    Email* (required — for order confirmation)
    Phone* (required, +91 format)

  Section: "Delivery Address"
    Address Line 1*
    Address Line 2 (optional)
    City* | State* (2-column)
    Pincode* | Country (2-column, default: India)
    
  Section: "Order Details"
    Special Instructions / Notes (textarea, 4 rows)
    PO Number (for B2B billing)
    GST Number (optional, for GST invoice)

  Section: "Payment Method"
    Radio selection (card style, selected = signal border):
    ○ Pay Online (Razorpay — UPI, Cards, NetBanking)
      [Razorpay logo]  Powered by Razorpay
    ○ Cash on Delivery
      "Available for orders above ₹500"
    ○ NEFT / Bank Transfer
      "Account details sent via email after order confirmation"

  CTA:
    "Proceed to Pay →" signal filled pill, 52px, full-width
    OR if COD: "Place Order →"
    
  Below CTA:
    mono 11px muted: "By placing this order you agree to our Terms & Conditions"

RIGHT — Order Summary (45%):
  Sticky white card — same summary as cart page
  
  Items list (compact):
    Product image 56px square + name + qty + price
    Scrollable if >4 items, max-height 320px

  Totals block identical to cart summary

  Security section:
    🔒 "All payments secured by Razorpay"
    Icons: Visa / Mastercard / UPI / NetBanking
```

**Razorpay Integration Specification:**
```ts
// When user clicks "Proceed to Pay":

// Step 1: Create order via API
POST /api/orders
Body: { items, customerDetails, paymentMethod: 'RAZORPAY' }
Response: { orderId, razorpayOrderId, amount }

// Step 2: Open Razorpay checkout
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: amount * 100,          // paise
  currency: "INR",
  name: "Fortune India",
  description: `Order #${orderId}`,
  order_id: razorpayOrderId,     // from Razorpay API
  prefill: {
    name: customerDetails.name,
    email: customerDetails.email,
    contact: customerDetails.phone,
  },
  theme: { color: "#FF5A1F" },   // signal orange
  handler: async (response) => {
    // Step 3: Verify payment on server
    await fetch('/api/orders/verify', {
      method: 'POST',
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        orderId,
      })
    })
    router.push(`/orders/${orderId}`)
  }
}
const rzp = new window.Razorpay(options)
rzp.open()

// Environment variables needed:
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
```

---

### 6.6 Order Confirmation Page

**URL:** `/orders/[id]`

```
Full-page canvas bg, centered content max-width 640px:

Top: ✅ Green checkmark animation (scale 0→1, 400ms ease)
H2: "Order Confirmed!" Plus Jakarta Sans 32px extrabold ink
Sub: "Your order #FI-2025-001 has been placed successfully."

Order summary card (white, border, radius-2xl, padding 32px):
  Order number: mono bold
  Date: formatted
  Items list with images
  Total + payment method
  Delivery address

"What happens next" timeline (3 steps):
  1. Order Confirmed → 2. Processing (2-3 days) → 3. Shipped (5-7 days)
  Signal orange active step indicator

CTAs:
  "Continue Shopping →" signal outlined
  "Track Order" ghost (if tracking available)
  "Download Invoice" ghost with download icon
```

---

### 6.7 About Us Page

**URL:** `/about`

```
Hero (signal-tint bg, 80px padding):
  Eyebrow: "/ OUR STORY"
  H1: "Precision Printing, Built on Trust."
  Sub: "15+ years of delivering high-quality printing solutions 
        to India's most demanding industries."
  [Company photo placeholder — full width, radius-2xl, mt 40px]

Section: "Who We Are" (2 columns, canvas bg):
  Left: body copy 3 paragraphs about Fortune India
  Right: Stats card grid (2×2):
    500+ Projects | 15+ Years | 10+ Industries | 3 PSU Clients

Section: "Authorized Partners" (dark bg):
  Same HAL · BHEL · TATA chip design as homepage

Section: "Why Fortune India?" (canvas bg):
  4-card grid:
  1. 🎯 Precision — "Micron-level accuracy guaranteed"
  2. 🛡️ Certified — "Approved supplier to defence & aerospace"
  3. 🚚 Reliable — "Pan-India delivery with tracking"
  4. 💼 B2B First — "Custom quotes, bulk pricing, GST invoices"

Section: "Industries We Serve" (surface-alt bg):
  Same 6-card grid as homepage industry solutions

Section: "Our Certifications" (white):
  Logo strip: ISO 9001 | HAL Vendor Code | BHEL Supplier | TATA Vendor

CTA Banner (signal orange):
  "Partner with Fortune India"
  "Talk to Our Team →"
```

---

### 6.8 Contact Us Page

**URL:** `/contact`

**Layout — 2 columns (60% / 40%):**

```
Page header:
  Eyebrow: "/ GET IN TOUCH"
  H1: "Talk to Our Team."
  Sub: "For orders, quotes, custom requirements, or any queries — 
        we respond within 1 business day."

LEFT — Contact Form (60%):
  Fields:
    Full Name*
    Company Name
    Email*
    Phone (+91 format)
    Subject (select):
      → Product Enquiry
      → Request a Quote
      → Bulk Order / Pricing
      → Partnership / Supplier
      → General Enquiry
    Message* (textarea, 6 rows)

  CTA: "Send Message →" signal pill, 52px height
  
  Success state: green checkmark + "Your message has been received. 
                 We'll respond within 1 business day."

RIGHT — Contact Cards (40%):
  Card 1 — Phone:
    📞 icon circle (signal-tint bg)
    "Call Us" mono 10px muted
    "+91 88305 75677" 18px semibold ink
    "Mon–Sat, 9AM–6PM" 12px muted

  Card 2 — Email:
    📧 icon circle
    "Email Us" mono 10px muted
    "fortuneindiabgl@gmail.com" 14px semibold
    "Response within 24 hours" 12px muted

  Card 3 — Visit:
    📍 icon circle
    "Our Office" mono 10px muted
    "369, Attibele" 15px semibold
    "Bangalore, Karnataka" 13px muted

  Office Hours:
    white card, border, radius-lg, padding 16px
    Mon–Fri: 9:00 AM – 6:00 PM
    Saturday: 10:00 AM – 4:00 PM
    Sunday: Closed
    Font: mono 12px, values: semibold ink

  Google Maps embed (greyscale, hover removes filter):
    height: 200px, radius-xl, overflow hidden
```

---

### 6.9 Blog Page

**URL:** `/blog`

**Purpose:** SEO, industry authority, content marketing

```
Page header (canvas bg):
  Eyebrow: "/ INSIGHTS & UPDATES"
  H1: "The Fortune India Blog."
  Sub: "Industry news, printing guides, and company updates."

Featured post (full-width, surface-alt bg):
  2-column: [large image 55%] [text 45%]
  Category badge: signal-tint
  H2: large bold ink
  Excerpt: 2-3 lines body muted
  "Read Article →" signal outlined pill + "8 min read" mono muted

Filter tabs:
  All · Industry News · Printing Guides · Product Updates · Case Studies

Blog grid (3-column):
  Each card (white, border, radius-xl, shadow-card):
    Image: aspect 16/9, radius-xl overflow hidden
    Category badge: top-left overlay
    Post date: mono 11px muted
    Title: Plus Jakarta Sans 18px semibold ink, 2-line clamp
    Excerpt: 14px muted, 3-line clamp
    "Read More →" mono 12px signal, inline arrow

Sidebar (optional on single post page):
  Recent posts | Categories | Newsletter signup
```

---

## 7. Animation System

### 7.1 Entrance Animations

```tsx
// Page sections — fade up on scroll entry
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
}

// Staggered children (product cards, industry cards)
const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.07 } }
}
const staggerChild = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
}

// Bento tiles — on mount (not scroll)
const bentoTile = (index: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }
})
```

### 7.2 Micro-interactions

```css
/* All card hover */
transition: transform 300ms cubic-bezier(0.16,1,0.3,1),
            box-shadow 300ms cubic-bezier(0.16,1,0.3,1);

/* All button press */
:active { transform: scale(0.97); }

/* Link underline sweep */
a::after { scaleX 0→1, 200ms, ease }

/* ProductCard: image scale on hover */
.pc-image img { transition: transform 500ms cubic-bezier(0.16,1,0.3,1); }

/* ProductCard: hover overlay fade */
.pc-hover-overlay { transition: opacity 250ms ease; }

/* ProductCard: hover buttons slide */
.pc-hover-btn { transition: transform 280ms cubic-bezier(0.16,1,0.3,1); }
```

### 7.3 Stats Counter (Intersection Observer)

```ts
// On scroll entry, count up from 0 to target
// Duration: 1800ms, easing: cubic easeOut (1 - (1-t)^3)
// Trigger: Intersection Observer threshold 0.3
// Only plays once (use Set to track observed elements)
```

### 7.4 Ticker Animation

```css
/* Footer ticker — CSS only, no JS */
@keyframes ticker-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }   /* content duplicated, so seamless */
}
.ticker-track {
  animation: ticker-scroll 30s linear infinite;
}
.ticker-track:hover { animation-play-state: paused; }
```

---

## 8. Responsive Breakpoints

```css
/* Mobile first */
@media (min-width: 640px)  { /* sm  — 2-col grids */ }
@media (min-width: 768px)  { /* md  — tablet */ }
@media (min-width: 1024px) { /* lg  — bento grid activates */ }
@media (min-width: 1280px) { /* xl  — full container */ }

/* Bento grid responsive */
/* < 768px:  single column, all tiles full width */
/* 768-1024: 2 columns, tile-main spans 2 */
/* > 1024px: 3 columns, full bento layout */

/* Product grid responsive */
/* < 640px:  1 column */
/* 640-1024: 2 columns */
/* > 1024px: 3 columns (homepage) or 4 columns (products page) */
```

---

## 9. Admin Panel Design

### 9.1 Layout

```
AdminSidebar (240px, white, border-right):
  Logo: "Fortune India" 17px bold + "ADMIN" mono 10px signal pill badge

  Nav groups (mono 10px uppercase signal letter-spacing):
  — OVERVIEW
      Dashboard
  — CATALOGUE
      Products
      Categories
  — OPERATIONS  
      Orders
      Inquiries
  — SETTINGS
      Users
      Store Settings

  Active state:
    background: signal-tint
    border-left: 3px solid signal (use box-shadow: inset 3px 0 0 signal)
    color: signal, font-weight 600

AdminHeader (white, border-bottom, 60px):
  Left: Page title 20px semibold ink
  Right: [🔔 Notifications] [Avatar circle 32px signal-tint bg + initials]
```

### 9.2 Admin Product Form

```
2-column layout (60% / 40%):

LEFT (60%):
  Product Name*
  Slug (auto-generated, editable)
  Description (rich text or textarea)
  Category (select dropdown)
  
  Specs (dynamic key-value pairs):
    [Key input] [Value input] [✕]
    [+ Add Spec] link

RIGHT (40%):
  Image Upload (UploadThing):
    Drag & drop zone, dashed border signal
    "Upload product images" + cloud icon
    Thumbnails with ✕ to remove

  Pricing:
    Price* (₹ prefix)
    Original Price (for discount display)
    Stock Quantity*

  Toggles:
    Featured: boolean
    Active / Published: boolean

  Submit: "Save Product" signal filled
  Delete: "Delete Product" error outlined (only on edit)
```

### 9.3 Admin Data Table

```
white, border, radius-xl, overflow hidden

Header row: canvas bg, mono 11px uppercase muted, border-bottom

Data rows:
  Inter 14px body
  hover: canvas bg
  border-bottom: 1px border-light

Action column (right):
  [Edit] signal text button + [Delete] error text button
  icon-only at small widths

Status column:
  Inline badge (success-tint / warning-tint / error-tint)

Pagination below table:
  "[←] 1 2 3 ... 12 [→]" pill buttons, signal active
```

---

## 10. Performance & Accessibility Checklist

### Accessibility
- All `<img>` have descriptive `alt` attributes
- `priority` prop on all above-fold Next.js `<Image>` components
- All interactive elements have `:focus-visible` ring (`outline: 2px solid signal, offset 3px`)
- WCAG AA contrast: body text `#3A3A3A` on canvas `#F6F4F0` = 6.8:1 ✓
- WCAG AA: white on signal `#FF5A1F` = 3.1:1 — only use for large text (>18px) or bold
- Semantic HTML: `<main>`, `<nav>`, `<section aria-labelledby>`, `<header>`, `<footer>`
- Mobile tap targets minimum 44×44px
- `prefers-reduced-motion` media query wraps all animations

### Performance
- `next/image` with correct `sizes` prop on all images
- Fonts: `display: 'swap'` on all Google Fonts
- Product images: WebP format, max 800px width for card thumbnails
- Lazy-load below-fold sections with `whileInView` (Framer Motion)
- Cart state in Zustand + localStorage persist (no server roundtrip on add)
- API routes: proper caching headers on product listing
- Skeleton loaders on all async data (shimmer animation)

### SEO
- Dynamic `generateMetadata()` on product and category pages
- Structured data: `Product` JSON-LD on product detail pages
- Breadcrumbs JSON-LD on product pages
- `robots.txt` — block `/admin/*`
- `sitemap.xml` — auto-generate from all product slugs

---

## 11. Anti-Patterns Reference (NEVER Do These)

| ❌ Wrong | ✅ Correct |
|---|---|
| Dark background on public pages | Warm white `#F6F4F0` always |
| "Add to Cart" slides up from info section | Hover buttons appear OVER the image |
| Overflow hidden on bento tile with content | `overflow: visible` on text tiles |
| Fixed pixel height on bento row | `minmax(380px, auto)` |
| Navy/blue as accent color | Signal orange `#FF5A1F` only |
| Cart/stock logic in component | Zustand store only |
| `border-radius: 0` anywhere | Minimum `--radius-sm` (6px) |
| Price without `formatPrice()` | Always use `formatPrice(amount)` |
| Generic "Submit" button labels | "Send Message →", "Place Order →" etc |
| Placeholder copy in production | Real Fortune India business content |
| "Shop Now" CTA copy | "Shop Products" or "View Catalogue" |
| `console.log` in production | Remove all debug logs |
| Client component for static data | Server component + fetch from Prisma |

---

## 12. File Naming Conventions

```
Components:     PascalCase   — ProductCard.tsx, AdminSidebar.tsx
Pages:          lowercase    — page.tsx, layout.tsx (Next.js convention)
API routes:     lowercase    — route.ts
Utilities:      camelCase    — formatPrice.ts, slugify.ts
Types:          PascalCase   — ProductCardProps, OrderStatus
CSS classes:    kebab-case   — pc-brand-badge, section-heading
CSS variables:  kebab-case   — --color-signal, --radius-xl
Prisma models:  PascalCase   — Product, OrderItem
Env vars:       SCREAMING_SNAKE — RAZORPAY_KEY_ID, DATABASE_URL
```