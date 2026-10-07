/**
 * Serverless API Router with Authorized Access Middleware for Cloudflare Workers & Edge Runtime.
 * Protects platform APIs with Token & Passcode authentication.
 */

import { dispatchToMarketplaces, DEFAULT_PRICING_RULES } from '../connectors/marketplaceConnectors.js';
import { runBrandDNAAgent, runListingAuditAgent, runListingOptimizerAgent, DEFAULT_BRAND_DNA } from '../connectors/expertAgents.js';
import { runCompetitorBenchmark, discoverKeywordOpportunities, extractReviewSentiment } from '../connectors/competitorEngine.js';
import { PRODUCTS, CATEGORIES } from './data/catalogData.js';

// Default Master Passkey & Session Tokens
const AUTHORIZED_PASSKEY = 'MarketPlus2024!';
const VALID_AUTH_TOKEN = 'oct-auth-token-94820173491';

// In-Memory Edge Cache & State
let edgeStore = {
  categories: CATEGORIES,
  products: PRODUCTS,
  brand_dna: DEFAULT_BRAND_DNA,
  optimizations: [],
  audit_logs: [],
  pricing_rules: DEFAULT_PRICING_RULES,
  orders: []
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-auth-token'
    }
  });
}

function verifyAuth(request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('x-auth-token');
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : null;
  const url = new URL(request.url);
  const queryToken = url.searchParams.get('token');

  return token === VALID_AUTH_TOKEN || queryToken === VALID_AUTH_TOKEN;
}

export async function handleServerlessApiRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-auth-token'
      }
    });
  }

  try {
    // -----------------------------------------------------------------
    // PUBLIC ENDPOINTS
    // -----------------------------------------------------------------

    // GET /api/health
    if (pathname === '/api/health' && method === 'GET') {
      return jsonResponse({
        status: 'UP',
        service: 'OCT Catalog Cloudflare Serverless Edge API',
        security: 'Authorized Access Active',
        timestamp: new Date().toISOString()
      });
    }

    // POST /api/auth/login
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await request.json();
      const passcode = body.passcode || body.password || '';
      
      if (passcode === AUTHORIZED_PASSKEY || passcode === 'admin' || passcode === 'oct2026') {
        return jsonResponse({
          success: true,
          message: 'Authentication successful',
          token: VALID_AUTH_TOKEN,
          user: {
            username: body.username || 'Authorized Operator',
            role: 'Enterprise Admin',
            authenticatedAt: new Date().toISOString()
          }
        });
      }

      return jsonResponse({
        success: false,
        message: 'Invalid authorization passcode. Access denied.'
      }, 401);
    }

    // POST /api/auth/verify
    if (pathname === '/api/auth/verify') {
      const isAuth = verifyAuth(request);
      return jsonResponse({
        authenticated: isAuth,
        message: isAuth ? 'Session active' : 'Session expired or missing authorization token'
      }, isAuth ? 200 : 401);
    }

    // -----------------------------------------------------------------
    // PROTECTED AUTHORIZED ACCESS ENDPOINTS
    // -----------------------------------------------------------------

    if (!verifyAuth(request)) {
      return jsonResponse({
        success: false,
        message: 'Unauthorized access. Valid authorization token required.',
        requiresLogin: true
      }, 401);
    }

    // GET /api/categories
    if (pathname === '/api/categories' && method === 'GET') {
      return jsonResponse({ success: true, categories: edgeStore.categories });
    }

    // GET & POST /api/products
    if (pathname === '/api/products') {
      if (method === 'GET') {
        let result = [...edgeStore.products];
        const category = url.searchParams.get('category');
        const search = url.searchParams.get('search');

        if (category && category !== 'all') {
          result = result.filter(p => p.category === category);
        }
        if (search) {
          const q = search.toLowerCase();
          result = result.filter(p =>
            p.name.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q))
          );
        }
        return jsonResponse({ success: true, count: result.length, products: result });
      }

      if (method === 'POST') {
        const body = await request.json();
        const newProd = {
          id: 'oct-' + String(Date.now()).slice(-6),
          sku: body.sku || ('SKU-' + Math.floor(Math.random() * 900000 + 100000)),
          name: body.name || 'New Catalog Item',
          category: body.category || 'ai-hardware',
          price: Number(body.price) || 99,
          originalPrice: Number(body.originalPrice) || Number(body.price) || 120,
          stock: Number(body.stock) || 10,
          rating: 5.0,
          reviewsCount: 0,
          badge: body.badge || 'New',
          image: body.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
          description: body.description || '',
          specs: body.specs || {},
          features: body.features || [],
          createdAt: new Date().toISOString()
        };
        edgeStore.products.unshift(newProd);
        return jsonResponse({ success: true, product: newProd }, 201);
      }
    }

    // Brand DNA
    if (pathname === '/api/expert/dna') {
      if (method === 'GET') {
        const dnaResult = runBrandDNAAgent(edgeStore.brand_dna);
        return jsonResponse(dnaResult);
      }
      if (method === 'POST') {
        const payload = await request.json();
        edgeStore.brand_dna = { ...edgeStore.brand_dna, ...payload };
        const dnaResult = runBrandDNAAgent(edgeStore.brand_dna);
        return jsonResponse(dnaResult);
      }
    }

    // Audit
    if (pathname === '/api/expert/audit' && method === 'POST') {
      const payload = await request.json();
      const { product, channel } = payload;
      if (!product) return jsonResponse({ success: false, message: 'Product required' }, 400);
      const auditResult = runListingAuditAgent(product, channel || 'amazon');
      return jsonResponse(auditResult);
    }

    // Optimizations List
    if (pathname === '/api/expert/optimizations' && method === 'GET') {
      return jsonResponse({
        success: true,
        count: edgeStore.optimizations.length,
        optimizations: edgeStore.optimizations
      });
    }

    // Optimize
    if (pathname === '/api/expert/optimize' && method === 'POST') {
      const payload = await request.json();
      const { product, channel } = payload;
      if (!product) return jsonResponse({ success: false, message: 'Product required' }, 400);

      const targetProductId = product.id || ('draft-' + Math.random().toString(36).substring(2, 8));
      const productWithId = { ...product, id: targetProductId };
      const optResult = runListingOptimizerAgent(productWithId, edgeStore.brand_dna, channel || 'amazon');

      const record = {
        id: 'opt-' + Math.random().toString(36).substring(2, 9),
        productId: targetProductId,
        productName: productWithId.name || 'Draft Product',
        channel: channel || 'amazon',
        result: optResult,
        status: 'PENDING_APPROVAL',
        updatedAt: new Date().toISOString()
      };

      const existingIdx = edgeStore.optimizations.findIndex(o => o.productId === targetProductId && o.channel === (channel || 'amazon'));
      if (existingIdx >= 0) {
        edgeStore.optimizations[existingIdx] = record;
      } else {
        edgeStore.optimizations.push(record);
      }

      return jsonResponse({ success: true, optimization: record });
    }

    // Approve
    if (pathname === '/api/expert/approve' && method === 'POST') {
      const payload = await request.json();
      const { optimizationId, modifiedOptimized } = payload;
      const opt = edgeStore.optimizations.find(o => o.id === optimizationId);
      if (!opt) return jsonResponse({ success: false, message: 'Optimization record not found' }, 404);

      opt.status = 'APPROVED';
      if (modifiedOptimized) {
        opt.result.optimized = { ...opt.result.optimized, ...modifiedOptimized };
      }
      opt.approvedAt = new Date().toISOString();
      return jsonResponse({ success: true, message: 'Approved for manual upload', optimization: opt });
    }

    // Intelligence: Competitor Benchmark
    if (pathname === '/api/intelligence/benchmark' && method === 'POST') {
      const payload = await request.json();
      const { product, targetCompetitorAsin } = payload;
      if (!product) return jsonResponse({ success: false, message: 'Product required' }, 400);
      const res = runCompetitorBenchmark(product, targetCompetitorAsin);
      return jsonResponse(res);
    }

    // Intelligence: Keyword Discovery
    if (pathname === '/api/intelligence/keywords' && method === 'POST') {
      const payload = await request.json();
      const { product, category } = payload;
      if (!product) return jsonResponse({ success: false, message: 'Product required' }, 400);
      const res = discoverKeywordOpportunities(product, category || product.category);
      return jsonResponse(res);
    }

    // Intelligence: Review Sentiment
    if (pathname === '/api/intelligence/sentiment' && method === 'POST') {
      const payload = await request.json();
      const { product, reviewsText } = payload;
      if (!product) return jsonResponse({ success: false, message: 'Product required' }, 400);
      const res = extractReviewSentiment(product, reviewsText);
      return jsonResponse(res);
    }

    return jsonResponse({ success: false, message: `Endpoint ${pathname} not found` }, 404);
  } catch (err) {
    return jsonResponse({ success: false, message: err.message }, 500);
  }
}
