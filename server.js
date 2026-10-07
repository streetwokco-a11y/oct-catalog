import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import crypto from 'crypto';
import { dispatchToMarketplaces, DEFAULT_PRICING_RULES } from './connectors/marketplaceConnectors.js';
import { runBrandDNAAgent, runListingAuditAgent, runListingOptimizerAgent, DEFAULT_BRAND_DNA } from './connectors/expertAgents.js';
import { runCompetitorBenchmark, discoverKeywordOpportunities, extractReviewSentiment, COMPETITOR_BENCHMARKS } from './connectors/competitorEngine.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'database', 'catalog_store.json');

function ensureDatabase() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialStore = {
      categories: [
        { id: 'cat-1', name: 'AI Hardware & Robotics', slug: 'ai-hardware' },
        { id: 'cat-2', name: 'Next-Gen Electronics', slug: 'electronics' },
        { id: 'cat-3', name: 'Cyber Apparel & Wearables', slug: 'apparel' },
        { id: 'cat-4', name: 'Smart Home Automation', slug: 'smart-home' }
      ],
      products: [
        {
          id: 'oct-001',
          sku: 'SKU-849102',
          name: 'OctaCore AI Neural Workstation',
          category: 'ai-hardware',
          price: 3499,
          originalPrice: 3899,
          stock: 14,
          rating: 4.9,
          reviewsCount: 128,
          badge: 'Flagship',
          image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
          description: 'Ultra-high throughput AI local workstation featuring 128GB Unified HBM memory and liquid cryogenic cooling system.',
          specs: {
            'Neural Engine': 'OCT Tensor Engine v4.2',
            'Memory': '128GB HBM3 High Bandwidth',
            'Cooling': 'Dual Cryo-Chamber Liquid Loop',
            'Power Draw': '650W Max Efficiency'
          },
          features: [
            'Zero-latency local LLM inference',
            'Quantum-ready encryption co-processor',
            'Whisper-quiet acoustic dampening enclosure'
          ],
          createdAt: new Date().toISOString()
        }
      ],
      brand_dna: DEFAULT_BRAND_DNA,
      optimizations: [],
      audit_logs: [],
      pricing_rules: DEFAULT_PRICING_RULES,
      orders: [],
      inventory_logs: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialStore, null, 2), 'utf-8');
  }
}

function readDB() {
  ensureDatabase();
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { categories: [], products: [], brand_dna: DEFAULT_BRAND_DNA, optimizations: [], audit_logs: [], pricing_rules: DEFAULT_PRICING_RULES, orders: [], inventory_logs: [] };
  }
}

function writeDB(data) {
  ensureDatabase();
  const tmpPath = DB_PATH + '.tmp';
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpPath, DB_PATH);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', err => reject(err));
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  try {
    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJson(res, 200, {
        status: 'UP',
        service: 'OCT Catalog Phase 3 Intelligence API',
        timestamp: new Date().toISOString()
      });
    }

    // -------------------------------------------------------------
    // PHASE 3 INTELLIGENCE API ENDPOINTS
    // -------------------------------------------------------------

    // POST /api/intelligence/benchmark (Competitor Benchmarking)
    if (pathname === '/api/intelligence/benchmark' && req.method === 'POST') {
      const payload = await parseJsonBody(req);
      const { product, targetCompetitorAsin } = payload;
      if (!product) return sendJson(res, 400, { success: false, message: 'Product object required' });

      const benchmarkResult = runCompetitorBenchmark(product, targetCompetitorAsin);
      return sendJson(res, 200, benchmarkResult);
    }

    // POST /api/intelligence/keywords (Keyword Opportunity Discovery)
    if (pathname === '/api/intelligence/keywords' && req.method === 'POST') {
      const payload = await parseJsonBody(req);
      const { product, category } = payload;
      if (!product) return sendJson(res, 400, { success: false, message: 'Product object required' });

      const keywordResult = discoverKeywordOpportunities(product, category || product.category);
      return sendJson(res, 200, keywordResult);
    }

    // POST /api/intelligence/sentiment (Review Sentiment & Pain-Point Extractor)
    if (pathname === '/api/intelligence/sentiment' && req.method === 'POST') {
      const payload = await parseJsonBody(req);
      const { product, reviewsText } = payload;
      if (!product) return sendJson(res, 400, { success: false, message: 'Product object required' });

      const sentimentResult = extractReviewSentiment(product, reviewsText);
      return sendJson(res, 200, sentimentResult);
    }

    // -------------------------------------------------------------
    // PHASE 1 & 2 EXPERT SERVICES API ENDPOINTS
    // -------------------------------------------------------------

    if (pathname === '/api/expert/dna') {
      const db = readDB();
      if (req.method === 'GET') {
        const dnaResult = runBrandDNAAgent(db.brand_dna);
        return sendJson(res, 200, dnaResult);
      }
      if (req.method === 'POST') {
        const payload = await parseJsonBody(req);
        db.brand_dna = { ...db.brand_dna, ...payload };
        writeDB(db);
        const dnaResult = runBrandDNAAgent(db.brand_dna);
        return sendJson(res, 200, dnaResult);
      }
    }

    if (pathname === '/api/expert/audit' && req.method === 'POST') {
      const payload = await parseJsonBody(req);
      const { product, channel } = payload;
      if (!product) return sendJson(res, 400, { success: false, message: 'Product object required for gap audit' });

      const auditResult = runListingAuditAgent(product, channel || 'amazon');
      return sendJson(res, 200, auditResult);
    }

    if (pathname === '/api/expert/optimizations' && req.method === 'GET') {
      const db = readDB();
      return sendJson(res, 200, {
        success: true,
        count: (db.optimizations || []).length,
        optimizations: db.optimizations || []
      });
    }

    if (pathname === '/api/expert/optimize' && req.method === 'POST') {
      const payload = await parseJsonBody(req);
      const { product, channel } = payload;
      const db = readDB();

      if (!product) return sendJson(res, 400, { success: false, message: 'Product object required for optimization' });

      const targetProductId = product.id || ('draft-' + crypto.randomBytes(3).toString('hex'));
      const productWithId = { ...product, id: targetProductId };

      const optResult = runListingOptimizerAgent(productWithId, db.brand_dna, channel || 'amazon');

      db.optimizations = db.optimizations || [];
      const existingIdx = db.optimizations.findIndex(o => o.productId === targetProductId && o.channel === (channel || 'amazon'));
      
      const record = {
        id: 'opt-' + crypto.randomBytes(4).toString('hex'),
        productId: targetProductId,
        productName: productWithId.name || 'Draft Product',
        channel: channel || 'amazon',
        result: optResult,
        status: 'PENDING_APPROVAL',
        updatedAt: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        db.optimizations[existingIdx] = record;
      } else {
        db.optimizations.push(record);
      }

      db.audit_logs = db.audit_logs || [];
      db.audit_logs.push({
        auditId: 'log-' + crypto.randomBytes(4).toString('hex'),
        productId: targetProductId,
        channel: channel || 'amazon',
        beforeScore: optResult.scoringDifferential.beforeScore,
        afterScore: optResult.scoringDifferential.afterScore,
        claimsInspected: optResult.claimGuard ? optResult.claimGuard.totalClaimsEvaluated : 0,
        highRiskClaims: optResult.claimGuard ? optResult.claimGuard.highRiskCount : 0,
        timestamp: new Date().toISOString()
      });

      writeDB(db);

      return sendJson(res, 200, { success: true, optimization: record });
    }

    if (pathname === '/api/expert/approve' && req.method === 'POST') {
      const payload = await parseJsonBody(req);
      const { optimizationId, modifiedOptimized } = payload;
      const db = readDB();

      const opt = (db.optimizations || []).find(o => o.id === optimizationId);
      if (!opt) return sendJson(res, 404, { success: false, message: 'Optimization record not found' });

      opt.status = 'APPROVED';
      if (modifiedOptimized) {
        opt.result.optimized = { ...opt.result.optimized, ...modifiedOptimized };
      }
      opt.approvedAt = new Date().toISOString();

      writeDB(db);

      return sendJson(res, 200, {
        success: true,
        message: 'Listing approved for manual channel upload!',
        optimization: opt
      });
    }

    // Standard Catalog Endpoints
    if (pathname === '/api/categories' && req.method === 'GET') {
      const db = readDB();
      return sendJson(res, 200, { success: true, categories: db.categories });
    }

    if (pathname === '/api/products' && req.method === 'GET') {
      const db = readDB();
      let result = [...db.products];

      if (query.category && query.category !== 'all') {
        result = result.filter(p => p.category === query.category);
      }

      if (query.search) {
        const q = query.search.toLowerCase();
        result = result.filter(p =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q))
        );
      }

      return sendJson(res, 200, {
        success: true,
        count: result.length,
        products: result
      });
    }

    if (pathname === '/api/products' && req.method === 'POST') {
      const payload = await parseJsonBody(req);
      const db = readDB();
      const newProduct = {
        id: 'oct-' + crypto.randomBytes(4).toString('hex'),
        sku: 'SKU-' + Math.floor(100000 + Math.random() * 900000),
        name: String(payload.name).trim(),
        category: String(payload.category).trim(),
        price: Number(payload.price),
        stock: Number(payload.stock),
        rating: 5.0,
        reviewsCount: 0,
        badge: payload.badge || 'New Arrival',
        image: payload.image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
        description: payload.description || '',
        specs: payload.specs || {},
        features: Array.isArray(payload.features) ? payload.features : [],
        createdAt: new Date().toISOString()
      };

      db.products.push(newProduct);
      writeDB(db);

      return sendJson(res, 201, { success: true, product: newProduct });
    }

    return sendJson(res, 404, { success: false, message: 'Endpoint not found' });

  } catch (err) {
    console.error('API Server Error:', err);
    return sendJson(res, 500, { success: false, message: 'Internal Server Error', error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 OCT Catalog Phase 3 Intelligence API running on http://localhost:${PORT}`);
  ensureDatabase();
});
