# System Architecture & DFD Specification (`architecture.md`)

This document presents the **System Architecture**, **Multi-Agent Swarm Framework**, **Regulatory Guard Systems**, and **Data Flow Diagrams (DFD)** for the **OCT Catalog Platform**.

---

## 📊 Complete Platform Data Flow Diagram (DFD)

```mermaid
graph TD
    %% External Entities
    Operator[("Authorized Operator / User")]
    Marketplaces[("Marketplaces: Amazon, Flipkart, Shopify, Myntra, Nykaa")]

    %% Security & Edge Entrypoint
    subgraph SecurityLayer ["Security & Cloudflare Edge Gateway"]
        AuthModal["Auth Security Screen (Passcode Input)"]
        AuthGate{"Edge Auth Middleware (x-auth-token)"}
        EdgeWorker["Cloudflare Edge Worker (worker.js)"]
    end

    %% Edge API Engine
    subgraph EdgeEngine ["Cloudflare Serverless Edge Engine (src/serverlessApi.js)"]
        HealthEndpoint["GET /api/health"]
        ProductsEndpoint["GET/POST /api/products"]
        BrandDnaEndpoint["GET/POST /api/expert/dna"]
        AuditEndpoint["POST /api/expert/audit"]
        OptimizeEndpoint["POST /api/expert/optimize"]
        ApproveEndpoint["POST /api/expert/approve"]
        IntelligenceEndpoint["POST /api/intelligence/*"]
    end

    %% Core Subagents & Engines
    subgraph SubagentSuite ["AI Expert Services & Regulatory Engines"]
        BrandDNAAgent["Brand DNA Agent"]
        GapAuditAgent["6-Metric Audit Engine"]
        RuleEngine["JSON Channel Rules Engine"]
        ClaimGuard["FTC Truth-in-Advertising Guard"]
        ListingOptimizer["Listing Optimizer Subagent"]
        CompetitorEngine["Competitor & Keyword Intelligence"]
    end

    %% Output & Export
    subgraph OutputLayer ["Approval & Output Layer"]
        HumanApprovalWS["Human Approval Workspace"]
        CSVExporter["RFC 4180 CSV & 1-Click Copy"]
    end

    %% Data Flows
    Operator -->|"1. Provide Passcode"| AuthModal
    AuthModal -->|"2. Submit Passcode"| AuthGate
    AuthGate -->|"3. Issue 256-Bit Bearer Token"| Operator
    
    Operator -->|"4. Access Platform (Bearer Token)"| EdgeWorker
    EdgeWorker --> AuthGate
    AuthGate -->|"5. Authenticated Request"| EdgeEngine

    EdgeEngine -->|"Products CRUD"| ProductsEndpoint
    EdgeEngine -->|"Brand Strategy"| BrandDnaEndpoint
    EdgeEngine -->|"Gap Audit Request"| AuditEndpoint
    EdgeEngine -->|"Optimization Request"| OptimizeEndpoint
    EdgeEngine -->|"Intelligence Scan"| IntelligenceEndpoint

    BrandDnaEndpoint --> BrandDNAAgent
    AuditEndpoint --> GapAuditAgent
    OptimizeEndpoint --> ListingOptimizer
    IntelligenceEndpoint --> CompetitorEngine

    RuleEngine -->|"Validation Rules & Limits"| GapAuditAgent
    RuleEngine -->|"Channel Constraints & Formatting"| ListingOptimizer
    ClaimGuard -->|"Classified Claims (VERIFIED / PROHIBITED)"| ListingOptimizer

    BrandDNAAgent -->|"Voice, Personas, USPs"| ListingOptimizer
    GapAuditAgent -->|"Metric Scores & Failed Rules"| ListingOptimizer
    CompetitorEngine -->|"Keyword & Review Signals"| ListingOptimizer

    ListingOptimizer -->|"Generated Listing + Why Annotations"| ApproveEndpoint
    ApproveEndpoint --> HumanApprovalWS

    Operator -->|"6. Review, Edit & Approve Listing"| HumanApprovalWS
    HumanApprovalWS -->|"7. Multi-Channel Export"| CSVExporter
    CSVExporter -->|"8. Manual Upload Feed"| Marketplaces
```

---

## 🤖 AI Subagent Swarm Architecture

The platform utilizes a **Micro-Subagent Swarm** design where specialized AI agents cooperate to audit, optimize, and validate product listings:

### 1. Brand DNA Agent (`connectors/expertAgents.js`)
- Maintains brand strategy, voice, tone, buyer personas, USPs, and visual attributes.
- Deeply merges custom DNA profiles with default fallbacks.

### 2. 6-Metric Gap Audit Engine (`connectors/expertAgents.js` & `connectors/ruleEngine.js`)
- Performs zero-login listing analysis against:
  1. Title SEO & Keyword Front-Loading
  2. Bullet Point Depth & Persuasiveness
  3. Image Asset Resolution & Fill Percentage
  4. Dynamic 249-Byte Search Term UTF-8 Calculation
  5. FTC Truth-in-Advertising Claim Safety
  6. Channel JSON Schema Contract Compliance

### 3. Single-Channel Specialist Swarm (`connectors/channelAgents.js`)
- Dedicated channel agents for **Amazon**, **Flipkart**, **Shopify**, **Myntra**, and **Nykaa**.
- Applies channel-specific title formulas, bullet structure constraints, image requirements, and deduplicated search terms.

### 4. FTC Claim Guard Engine (`connectors/claimGuard.js`)
- Classifies claims into `VERIFIED`, `SUPPORTED`, `NEEDS_HUMAN_VERIFICATION`, or `PROHIBITED`.
- Prevents unsubstantiated health, medical, or environmental claims from reaching production listings.

### 5. Competitor & Keyword Intelligence Engine (`connectors/competitorEngine.js`)
- Benchmarks catalog listings against competitor ASINs/FSNs.
- Extracts high-volume long-tail keywords and parses customer review sentiment to address buyer friction points.

---

## 📄 Output & Feed Formatting

- **Human Approval Workspace ([HumanApprovalWorkspace.jsx](file:///home/rockyy/oct%20catalog/catalog/src/components/HumanApprovalWorkspace.jsx))**: Provides side-by-side comparison, "Why" change annotations, and claim risk badges.
- **RFC 4180 CSV Exporter**: Uses `escapeCsvCell(str)` cell sanitization to produce error-free CSV files for direct upload to Amazon Seller Central, Flipkart Seller Hub, Shopify Admin, Myntra Partner Portal, or Nykaa Seller Portal.
