# Design Tokens & Styling Architecture (`design-tokens.md`)

This document defines the **Design Tokens System**, **CSS Custom Variables**, **Glassmorphism Backdrop Rules**, and **Typography Guidelines** for the **OCT Catalog Platform**.

---

## 🎨 Design System Philosophy

The OCT Catalog UI is crafted using a **Premium Dark Glassmorphism Aesthetics System**. It utilizes curated HSL color tailors, subtle micro-animations, backdrop-filter blurs, and gradient highlights to deliver an executive-level user experience.

---

## 💎 CSS Variable Tokens (`src/index.css`)

### 1. Color Palette Tokens

```css
:root {
  /* Typography Families */
  --font-heading: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Premium Dark Theme Backgrounds */
  --bg-primary: #0b0f19;
  --bg-secondary: #131b2e;
  --bg-tertiary: #1b2640;
  --bg-card: rgba(22, 30, 49, 0.75);
  --bg-card-hover: rgba(30, 42, 69, 0.85);

  /* Primary & Accent Glows */
  --accent-primary: #6366f1;         /* Indigo 500 */
  --accent-primary-hover: #4f46e5;   /* Indigo 600 */
  --accent-glow: rgba(99, 102, 241, 0.35);

  /* Functional Accents */
  --accent-secondary: #06b6d4;       /* Cyan 500 */
  --accent-emerald: #10b981;         /* Emerald 500 */
  --accent-amber: #f59e0b;           /* Amber 500 */
  --accent-rose: #f43f5e;            /* Rose 500 */

  /* Text Contrast Hierarchy */
  --text-primary: #f8fafc;           /* Slate 50 */
  --text-secondary: #94a3b8;         /* Slate 400 */
  --text-muted: #64748b;             /* Slate 500 */

  /* Borders & Glassmorphism Shadows */
  --border-color: rgba(255, 255, 255, 0.08);
  --border-color-hover: rgba(99, 102, 241, 0.4);

  --glass-bg: rgba(15, 23, 42, 0.65);
  --glass-border: rgba(255, 255, 255, 0.12);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);

  /* Border Radii */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  /* Transition Curves */
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 2. Light Theme Overrides

```css
[data-theme="light"] {
  --bg-primary: #f8fafc;
  --bg-secondary: #f1f5f9;
  --bg-tertiary: #e2e8f0;
  --bg-card: rgba(255, 255, 255, 0.85);
  --bg-card-hover: rgba(255, 255, 255, 0.95);

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;

  --border-color: rgba(0, 0, 0, 0.08);
  --border-color-hover: rgba(99, 102, 241, 0.5);

  --glass-bg: rgba(255, 255, 255, 0.75);
  --glass-border: rgba(0, 0, 0, 0.08);
  --glass-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}
```

---

## ⚡ Glassmorphism & Utility Utility Classes

### 1. Glass Panel Utility (`.glass-panel`)
```css
.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}
```

### 2. Gradient Text Styles (`.gradient-text`)
```css
.gradient-text {
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 🔤 Typography & Font Import

Loaded from Google Fonts in `index.html`:
- **Outfit**: Headings (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`) with weight `700` and letter-spacing `-0.02em`.
- **Plus Jakarta Sans**: Body copy, buttons, form inputs, and metric labels.

---

## 🛠️ Production Build Integration

Tailwind CSS v4 is compiled locally via `@tailwindcss/vite` plugin registered in `vite.config.js` and imported in `src/index.css` via `@import "tailwindcss";`. This eliminates external CDN dependencies while generating optimized CSS bundles (`dist/assets/index-*.css`).
