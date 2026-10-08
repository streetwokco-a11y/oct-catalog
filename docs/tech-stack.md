# Technology Stack Specifications (`tech-stack.md`)

This document outlines the **Technology Stack**, **Framework Dependencies**, **Cloud Infrastructure**, and **Build Pipelines** powering the **OCT Catalog Platform**.

---

## 🚀 Technology Stack Overview

| Layer | Component / Technology | Specification & Version | Purpose |
|-------|------------------------|-------------------------|---------|
| **Frontend Core** | React | `v18.2.0` | UI Component Tree & Virtual DOM |
| **Build Tooling** | Vite | `v5.4.21` | High-speed ESM bundler & dev server |
| **Styling Engine** | Tailwind CSS + `@tailwindcss/vite` | `v4.x` | Local production JIT CSS compilation |
| **Icon System** | Lucide React | `v0.344.0` | Micro-animation SVG icon set |
| **Serverless Runtime** | Cloudflare Workers | V8 Isolate Runtime (`2024-03-01`) | Global Edge API & Static Asset Hosting |
| **Deployment CLI** | Wrangler | `v4.86.0` | Cloudflare Workers deployment tool |
| **API Architecture** | Web Standard API Router | `src/serverlessApi.js` | Zero-dependency Request/Response Router |
| **Version Control** | Git & GitHub | `streetwokco-a11y/oct-catalog` | Codebase persistence & CI/CD tracking |

---

## ⚡ Key Framework Architectures

### 1. Frontend Client Architecture (`src/`)
- **React 18 Hooks**: State management via `useState`, `useEffect`, and component-level reactive hooks.
- **Dynamic API Client (`src/services/api.js`)**: Encapsulates `edgeFetch` helper with automatic Bearer token injection (`x-auth-token`) and fallback execution to in-browser Serverless API router if offline.
- **Lucide Icons**: Tree-shaken SVG icon imports (`Boxes`, `ShieldCheck`, `Lock`, `BarChart3`, `Zap`, `Download`, `Search`, etc.).

### 2. Edge Serverless Architecture (`worker.js` & `src/serverlessApi.js`)
- **Web Standard API Router**: Handcrafted router consuming standard `Request` and `Response` Web APIs (`fetch`, `Headers`, `Response.json()`).
- **Zero Node Dependencies**: Subagents and rule engines run in pure ESM without `fs`, `path`, or `http` modules.
- **Cross-Platform UTF-8 Byte Calculation**: Utilizes `TextEncoder` instead of Node `Buffer.byteLength` for 100% compatibility in V8 isolates.

### 3. Regulatory Compliance & Rules Engines (`connectors/`)
- **Claim Guard (`connectors/claimGuard.js`)**: Truth-in-Advertising classifier inspecting listing text against FTC rules.
- **Rules Engine (`connectors/ruleEngine.js`)**: Pre-loaded JSON validation contracts for **Amazon**, **Flipkart**, **Shopify**, **Myntra**, and **Nykaa**.
- **Competitor Engine (`connectors/competitorEngine.js`)**: Benchmark scanner, keyword opportunity calculator & review sentiment parser.

---

## 🛠️ CLI Development & Build Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "server": "node server.js",
    "start": "node server.js",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vite build && wrangler deploy"
  }
}
```
