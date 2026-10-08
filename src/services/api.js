import { handleServerlessApiRequest } from '../serverlessApi.js';

const getApiBase = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000/api';
  }
  return '/api';
};

async function edgeFetch(path, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('oct_auth_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}`, 'x-auth-token': token } : {}),
    ...(options.headers || {})
  };

  const primaryUrl = `${getApiBase()}${path}`;
  try {
    const res = await fetch(primaryUrl, { ...options, headers });
    if (res.status !== 404 && res.status !== 502 && res.status !== 503) {
      return res;
    }
  } catch (err) {
    // API server offline or static host
  }

  // Edge / In-Browser Serverless Fallback
  const fallbackUrl = `http://edge.internal/api${path}`;
  const mockReq = new Request(fallbackUrl, {
    method: options.method || 'GET',
    headers,
    body: options.body || null
  });
  return await handleServerlessApiRequest(mockReq);
}

/**
 * Production Catalog, Phase 1, Phase 2 & Phase 3 E-Commerce Intelligence API Client
 */
export const api = {
  // Authentication
  async login(passcode) {
    const res = await edgeFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode })
    });
    return await res.json();
  },

  async verifyAuth() {
    try {
      const res = await edgeFetch('/auth/verify');
      return res.ok;
    } catch (e) {
      return false;
    }
  },
  // -----------------------------------------------------------------
  // Phase 3 Intelligence API Methods
  // -----------------------------------------------------------------

  // Run Competitor Benchmark Analysis
  async getCompetitorBenchmark(product, targetCompetitorAsin = 'B09X98102A') {
    const res = await edgeFetch('/intelligence/benchmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, targetCompetitorAsin })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to benchmark competitor');
    return data;
  },

  // Discover Keyword Opportunities
  async getKeywordOpportunities(product, category = 'ai-hardware') {
    const res = await edgeFetch('/intelligence/keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, category })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to discover keywords');
    return data;
  },

  // Extract Customer Review Sentiment & Pain Points
  async getReviewSentiment(product, reviewsText = '') {
    const res = await edgeFetch('/intelligence/sentiment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, reviewsText })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to extract review sentiment');
    return data;
  },

  // -----------------------------------------------------------------
  // Phase 1 & 2 API Methods
  // -----------------------------------------------------------------

  async getBrandDna() {
    try {
      const res = await edgeFetch('/expert/dna');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.brandDna;
    } catch (err) {
      return null;
    }
  },

  async saveBrandDna(dnaData) {
    const res = await edgeFetch('/expert/dna', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dnaData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save Brand DNA');
    return data.brandDna;
  },

  async runAudit(product, channel = 'amazon') {
    const res = await edgeFetch('/expert/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, channel })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to run gap audit');
    return data;
  },

  async getOptimizations() {
    try {
      const res = await edgeFetch('/expert/optimizations');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.optimizations || [];
    } catch (err) {
      return [];
    }
  },

  async runOptimization(product, channel = 'amazon') {
    const res = await edgeFetch('/expert/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, channel })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to run listing optimization');
    return data.optimization;
  },

  async runOptimizationAll(product) {
    const res = await edgeFetch('/expert/optimize-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to run parallel swarm optimization');
    return data;
  },

  async approveOptimization(optimizationId, modifiedOptimized = null) {
    const res = await edgeFetch('/expert/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optimizationId, modifiedOptimized })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to approve optimization');
    return data.optimization;
  },

  // Standard Catalog Methods
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const path = `/products${query ? `?${query}` : ''}`;
    try {
      const res = await edgeFetch(path);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.products || [];
    } catch (err) {
      return [];
    }
  },

  async createProduct(productData) {
    const res = await edgeFetch('/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create product');
    return data.product;
  },

  async submitOrder(orderData) {
    const res = await edgeFetch('/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Checkout failed');
    return data.order;
  }
};
