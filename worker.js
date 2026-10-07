/**
 * Cloudflare Worker Entrypoint for OCT Catalog Platform
 * Handles Serverless API routes and serves static web app assets.
 */

import { handleServerlessApiRequest } from './src/serverlessApi.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Route /api/* requests to Serverless Edge API router
    if (url.pathname.startsWith('/api')) {
      return handleServerlessApiRequest(request);
    }

    // Serve static assets via Cloudflare Worker Assets binding
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('OCT Catalog Cloudflare Worker Ready', { status: 200 });
  }
};
