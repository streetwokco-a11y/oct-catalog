const CHANNEL_RULES_MAP = {
  amazon: {
    channel: 'amazon',
    name: 'Amazon Seller Central Marketplace',
    version: '2026.1',
    title: {
      ruleId: 'amazon.v2026.1.title_max_length',
      maxCharacters: 200,
      minCharacters: 40,
      prohibitedWords: ['best seller', 'hot item', 'free shipping', 'top rated', 'cheap', 'discount', '100% guaranteed']
    },
    backendSearchTerms: {
      ruleId: 'amazon.v2026.1.backend_bytes_limit',
      maxBytes: 249,
      allowCommas: false,
      allowDuplication: false
    },
    bullets: {
      ruleId: 'amazon.v2026.1.bullets_count',
      recommendedCount: 5,
      minCount: 3,
      maxCharPerBullet: 250,
      minCharPerBullet: 50,
      allowEmojis: false
    },
    images: {
      ruleId: 'amazon.v2026.1.image_resolution',
      minResolution: '1000x1000',
      recommendedResolution: '2000x2000',
      pureWhiteBackground: true,
      frameFillPercent: 85,
      minImageCount: 3
    },
    requiredAttributes: ['name', 'price', 'stock', 'description', 'category']
  },
  flipkart: {
    channel: 'flipkart',
    name: 'Flipkart Seller Hub',
    version: '2026.1',
    title: {
      ruleId: 'flipkart.v2026.1.title_max_length',
      maxCharacters: 150,
      minCharacters: 25,
      prohibitedWords: ['best quality', 'lowest price', 'sale']
    },
    backendSearchTerms: { ruleId: 'flipkart.v2026.1.backend_bytes_limit', maxBytes: 200, allowCommas: true },
    bullets: { ruleId: 'flipkart.v2026.1.bullets_count', recommendedCount: 4, minCount: 3 },
    images: { ruleId: 'flipkart.v2026.1.image_resolution', minResolution: '1100x1100', pureWhiteBackground: true },
    requiredAttributes: ['name', 'price', 'stock', 'description']
  },
  shopify: {
    channel: 'shopify',
    name: 'Shopify Storefront API',
    version: '2026.1',
    title: { ruleId: 'shopify.v2026.1.title_max_length', maxCharacters: 255, minCharacters: 10 },
    backendSearchTerms: { ruleId: 'shopify.v2026.1.tags_limit', maxBytes: 500, allowCommas: true },
    bullets: { ruleId: 'shopify.v2026.1.bullets_count', recommendedCount: 6, minCount: 2 },
    images: { ruleId: 'shopify.v2026.1.image_resolution', minResolution: '800x800', pureWhiteBackground: false },
    requiredAttributes: ['name', 'price', 'description']
  },
  myntra: {
    channel: 'myntra',
    name: 'Myntra Partner Portal',
    version: '2026.1',
    title: { ruleId: 'myntra.v2026.1.title_max_length', maxCharacters: 120, minCharacters: 15 },
    backendSearchTerms: { ruleId: 'myntra.v2026.1.keywords', maxBytes: 200, allowCommas: true },
    bullets: { ruleId: 'myntra.v2026.1.bullets_count', recommendedCount: 5, minCount: 3 },
    images: { ruleId: 'myntra.v2026.1.image_resolution', minResolution: '1440x1920', pureWhiteBackground: true },
    requiredAttributes: ['name', 'price', 'stock', 'description', 'category']
  },
  nykaa: {
    channel: 'nykaa',
    name: 'Nykaa Seller Portal',
    version: '2026.1',
    title: { ruleId: 'nykaa.v2026.1.title_max_length', maxCharacters: 140, minCharacters: 15 },
    backendSearchTerms: { ruleId: 'nykaa.v2026.1.keywords', maxBytes: 200, allowCommas: true },
    bullets: { ruleId: 'nykaa.v2026.1.bullets_count', recommendedCount: 5, minCount: 3 },
    images: { ruleId: 'nykaa.v2026.1.image_resolution', minResolution: '1000x1000', pureWhiteBackground: true },
    requiredAttributes: ['name', 'price', 'stock', 'description', 'category']
  }
};

/**
 * Dynamically load & validate channel rules from config
 */
export function getChannelRuleConfig(channel = 'amazon') {
  const ch = channel.toLowerCase();
  if (CHANNEL_RULES_MAP[ch]) {
    return CHANNEL_RULES_MAP[ch];
  }
  return CHANNEL_RULES_MAP.amazon;
}

/**
 * Audit product against channel JSON rule config with traceable explanations & immutable rule IDs
 */
export function auditProductWithRules(product = {}, channel = 'amazon') {
  const rules = getChannelRuleConfig(channel);
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
        metric: 'Title SEO',
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
      recommendation: `Upload main JPEG product image (${rules.images.minResolution}+ resolution).`
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

  // Overall Score Calculation
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
 * Validate optimized listing data against channel rule schemas before CSV export
 */
export function preValidateExport(optimizedListing = {}, channel = 'amazon') {
  const rules = getChannelRuleConfig(channel);
  const errors = [];

  const title = optimizedListing.title || '';
  if (rules.title.maxCharacters && title.length > rules.title.maxCharacters) {
    errors.push(`Title length (${title.length}) exceeds ${rules.channel.toUpperCase()} max allowed (${rules.title.maxCharacters})`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
