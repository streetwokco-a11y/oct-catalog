/**
 * Oct Catalog — Channel Rule Engine & Policy Auditor (2026 Standards)
 */

import { getRuleConfig, amazonAgent, flipkartAgent, nykaaAgent, myntraAgent, shopifyAgent } from './channelAgents.js';

export { getRuleConfig };

/**
 * Audit product against channel JSON rule config with traceable explanations & immutable rule IDs
 */
export function auditProductWithRules(product = {}, channel = 'amazon') {
  const rules = getRuleConfig(channel);
  const explanations = [];

  const title = String(product.name || '').trim();
  const description = String(product.description || '').trim();
  const features = Array.isArray(product.features) ? product.features : [];
  const specs = (product.specs && typeof product.specs === 'object') ? product.specs : {};
  const image = String(product.image || '').trim();

  // 1. Title Audit
  let titleScore = 100;
  if (rules.title.maxCharacters && title.length > rules.title.maxCharacters) {
    titleScore -= 40;
    explanations.push({
      metric: 'Title SEO',
      ruleId: rules.title.ruleId || `${rules.channel.toUpperCase()}-TITLE-MAX`,
      failedRule: `Title length (${title.length} chars) exceeds ${rules.channel.toUpperCase()} max limit of ${rules.title.maxCharacters} characters.`,
      recommendation: `Trim title by ${title.length - rules.title.maxCharacters} characters to prevent search index truncation.`
    });
  }

  if (rules.title.prohibitedWords) {
    const foundFluff = rules.title.prohibitedWords.filter(w => title.toLowerCase().includes(w));
    if (foundFluff.length > 0) {
      titleScore -= 30;
      explanations.push({
        metric: 'Title SEO Policy',
        ruleId: `${rules.channel}.v2026.1.prohibited_fluff`,
        failedRule: `Title contains prohibited promotional terms: "${foundFluff.join(', ')}".`,
        recommendation: `Remove promotional terms to comply with FTC and ${rules.channel.toUpperCase()} policy.`
      });
    }
  }

  // 2. Bullets Audit
  let bulletScore = 95;
  if (rules.bullets.minCount && features.length < rules.bullets.minCount) {
    bulletScore -= 30;
    explanations.push({
      metric: 'Bullet Persuasiveness',
      ruleId: rules.bullets.ruleId || `${rules.channel.toUpperCase()}-BULLET-MIN-COUNT`,
      failedRule: `Listing has only ${features.length} bullet points (Recommended: ${rules.bullets.recommendedCount}).`,
      recommendation: `Add ${rules.bullets.recommendedCount - features.length} more benefit-driven bullet points.`
    });
  }

  // 3. Image Audit
  let imageScore = 90;
  if (!image) {
    imageScore = 20;
    explanations.push({
      metric: 'Image Completeness',
      ruleId: rules.images.ruleId || `${rules.channel.toUpperCase()}-IMG-MAIN-MISSING`,
      failedRule: `Main image URL is missing.`,
      recommendation: `Upload main product image (${rules.images.minResolution}+ resolution).`
    });
  }

  // 4. Required Attributes Audit
  let specScore = 100;
  if (rules.requiredAttributes) {
    const missing = rules.requiredAttributes.filter(attr => !product[attr] && !specs[attr]);
    if (missing.length > 0) {
      specScore -= missing.length * 20;
      explanations.push({
        metric: 'Attribute Specs',
        ruleId: `${rules.channel}.v2026.1.required_attributes_missing`,
        failedRule: `Missing required channel attributes: "${missing.join(', ')}".`,
        recommendation: `Populate missing attribute specs to improve category filter indexing.`
      });
    }
  }

  const overallScore = Math.round(
    (titleScore * 0.25) +
    (bulletScore * 0.25) +
    (imageScore * 0.25) +
    (specScore * 0.25)
  );

  return {
    channel: rules.channel,
    version: rules.version,
    overallScore,
    metrics: {
      titleSeo: { score: Math.max(10, titleScore), length: title.length },
      bulletPersuasiveness: { score: Math.max(10, bulletScore), count: features.length },
      imageAssets: { score: Math.max(10, imageScore), minResolution: rules.images.minResolution },
      specCoverage: { score: Math.max(10, specScore) }
    },
    explanations
  };
}

/**
 * Validate listing output per channel prior to CSV export
 */
export function preValidateExport(optimizedListing = {}, channel = 'amazon') {
  const ch = channel.toLowerCase();
  if (ch === 'amazon') return amazonAgent.validatePreExport(optimizedListing);
  if (ch === 'flipkart') return flipkartAgent.validatePreExport(optimizedListing);
  if (ch === 'nykaa') return nykaaAgent.validatePreExport(optimizedListing);
  if (ch === 'myntra') return myntraAgent.validatePreExport(optimizedListing);
  if (ch === 'shopify') return shopifyAgent.validatePreExport(optimizedListing);

  return { valid: true, errors: [] };
}
