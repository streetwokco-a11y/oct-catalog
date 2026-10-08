/**
 * Phase 2 & Phase 3 E-Commerce Expert Subagent Engine (Multi-Agent Swarm Orchestrator)
 */

import { runClaimGuard } from './claimGuard.js';
import { auditProductWithRules, preValidateExport } from './ruleEngine.js';
import {
  amazonAgent,
  flipkartAgent,
  nykaaAgent,
  myntraAgent,
  shopifyAgent,
  runAllChannelAgents
} from './channelAgents.js';

export { runAllChannelAgents };

// Default Brand DNA Profile template
export const DEFAULT_BRAND_DNA = {
  brandName: 'OCT Tech & Audio',
  sector: 'Consumer Electronics & AI Hardware',
  voiceAndTone: {
    personality: 'Authoritative, Innovative, Minimalist, Premium',
    tone: 'Confident, Tech-forward, Benefit-driven',
    vocabularyDo: ['Precision-engineered', 'Seamless', 'Next-generation', 'Cryogenic', 'High-throughput'],
    vocabularyDont: ['Cheap', 'Hurry', 'Best seller', 'Hot deal', 'Mind-blowing', 'Free shipping'],
    onBrandExample: 'Engineered with cryogenic liquid loops for zero-throttling local AI workloads.',
    offBrandExample: 'Buy this hot item right now for unbelievable cheap price!'
  },
  buyerPersonas: [
    {
      role: 'AI Developer & Tech Enthusiast',
      ageGroup: '25-45',
      keyTraits: 'Performance-obsessed, values hardware specs, demands reliability',
      painPoints: 'Thermal throttling in standard desktop setups, high cloud latency'
    }
  ],
  usps: [
    'Cryogenic Dual-Chamber Liquid Loop Cooling',
    'Zero-latency local LLM inference capability',
    'Certified 2-Year Direct Enterprise Warranty'
  ],
  visualStyle: {
    mainPhotoStyle: 'Pure White Background (#FFFFFF), Product fills 85% frame, Studio Lighting',
    secondaryPhotos: 'Scale shot, Port diagram, Exploded spec view, Minimalist desk lifestyle shot',
    brandColors: ['#6366F1', '#0B0F19', '#10B981']
  }
};

function deepMergeBrandDna(target, source) {
  if (!source) return target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMergeBrandDna(target[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

export function runBrandDNAAgent(customDna = {}) {
  const merged = deepMergeBrandDna(DEFAULT_BRAND_DNA, customDna);
  return {
    success: true,
    agent: 'BrandDNAAgent',
    brandDna: merged,
    generatedAt: new Date().toISOString()
  };
}

export async function runListingAuditAgent(product = {}, channel = 'amazon') {
  const chLower = channel.toLowerCase();
  let agentRes;
  if (chLower === 'amazon') agentRes = await amazonAgent.audit(product, DEFAULT_BRAND_DNA);
  else if (chLower === 'flipkart') agentRes = await flipkartAgent.audit(product, DEFAULT_BRAND_DNA);
  else if (chLower === 'nykaa') agentRes = await nykaaAgent.audit(product, DEFAULT_BRAND_DNA);
  else if (chLower === 'myntra') agentRes = await myntraAgent.audit(product, DEFAULT_BRAND_DNA);
  else if (chLower === 'shopify') agentRes = await shopifyAgent.audit(product, DEFAULT_BRAND_DNA);
  else agentRes = await amazonAgent.audit(product, DEFAULT_BRAND_DNA);

  const ruleAudit = auditProductWithRules(product, chLower);
  const claimGuardResult = runClaimGuard(
    `${product.name} ${product.description} ${(product.features || []).join(' ')}`,
    product,
    DEFAULT_BRAND_DNA
  );

  return {
    success: true,
    agent: agentRes.agent || 'ListingAuditAgent',
    channel: chLower,
    overallScore: agentRes.overallScore || ruleAudit.overallScore,
    metrics: ruleAudit.metrics,
    explanations: agentRes.explanations || ruleAudit.explanations,
    claimGuard: claimGuardResult,
    auditedAt: new Date().toISOString()
  };
}

export async function runListingOptimizerAgent(product = {}, brandDna = DEFAULT_BRAND_DNA, channel = 'amazon') {
  const chLower = channel.toLowerCase();
  let optResult;

  if (chLower === 'amazon') optResult = await amazonAgent.optimize(product, brandDna);
  else if (chLower === 'flipkart') optResult = await flipkartAgent.optimize(product, brandDna);
  else if (chLower === 'nykaa') optResult = await nykaaAgent.optimize(product, brandDna);
  else if (chLower === 'myntra') optResult = await myntraAgent.optimize(product, brandDna);
  else if (chLower === 'shopify') optResult = await shopifyAgent.optimize(product, brandDna);
  else optResult = await amazonAgent.optimize(product, brandDna);

  const exportValidation = preValidateExport(optResult.optimized, chLower);

  return {
    success: true,
    agent: optResult.agent,
    channel: chLower,
    original: optResult.original,
    optimized: optResult.optimized,
    scoringDifferential: optResult.scoringDifferential,
    claimGuard: optResult.claimGuard,
    exportValidation,
    status: 'PENDING_APPROVAL',
    optimizedAt: new Date().toISOString()
  };
}
