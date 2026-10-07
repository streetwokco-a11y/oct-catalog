/**
 * FTC Truth-in-Advertising Compliant Claim Guard Engine
 * Classifies product claims into VERIFIED, SUPPORTED, NEEDS_HUMAN_VERIFICATION, or PROHIBITED
 */

// FTC Prohibited Fluff & Deceptive Superlative Patterns
const FTC_PROHIBITED_PATTERNS = [
  { pattern: /100%\s*guaranteed/i, category: 'Unsubstantiated Deceptive Guarantee' },
  { pattern: /best\s*seller/i, category: 'Prohibited Sales Ranking Superlative' },
  { pattern: /top\s*rated/i, category: 'Unverified Social Proof Claim' },
  { pattern: /free\s*gift/i, category: 'Prohibited Promotional Term' },
  { pattern: /cure[s]?/i, category: 'Prohibited Medical Disease Claim' },
  { pattern: /fda\s*approved/i, category: 'Deceptive Regulatory Endorsement' }
];

// Health, Nutrition & Environmental Claim Patterns (Require Verification)
const FTC_HIGH_RISK_PATTERNS = [
  { pattern: /warranty/i, category: 'Legal Warranty Claim' },
  { pattern: /certified/i, category: 'Third-Party Certification' },
  { pattern: /organic/i, category: 'Agricultural / Material Claim' },
  { pattern: /eco[- ]friendly/i, category: 'FTC Green Guide Sustainability Claim' },
  { pattern: /carbon\s*neutral/i, category: 'FTC Green Guide Carbon Claim' },
  { pattern: /biodegradable/i, category: 'FTC Green Guide Degradability Claim' },
  { pattern: /cryogenic/i, category: 'Technical Specification Claim' },
  { pattern: /quantum/i, category: 'Technical Architecture Claim' },
  { pattern: /zero[- ]latency/i, category: 'Performance Guarantee Claim' }
];

/**
 * Scan content string and return structured claim verification records
 */
export function runClaimGuard(content = '', product = {}, brandDna = {}) {
  const text = typeof content === 'string' ? content : JSON.stringify(content);
  const claimsFound = [];

  const sentences = text.split(/[.!?\n]/).map(s => s.trim()).filter(s => s.length > 5);
  const productSpecs = product.specs || {};
  const brandUsps = brandDna.usps || [];

  for (const sentence of sentences) {
    let status = 'SUPPORTED';
    let risk = 'low';
    let verified = true;
    let source = 'product_description';
    let category = 'Standard Product Feature';

    // 1. Check FTC Prohibited Claims
    const prohibitedMatch = FTC_PROHIBITED_PATTERNS.find(p => p.pattern.test(sentence));
    if (prohibitedMatch) {
      status = 'PROHIBITED';
      risk = 'high';
      verified = false;
      source = 'ftc_prohibited_filter';
      category = prohibitedMatch.category;
    } 
    // 2. Check FTC High Risk / Environmental / Health / Warranty Claims
    else {
      const highRiskMatch = FTC_HIGH_RISK_PATTERNS.find(p => p.pattern.test(sentence));
      if (highRiskMatch) {
        category = highRiskMatch.category;

        // Cross check against product specs & brand USPs
        const isSpecBacked = Object.values(productSpecs).some(val => 
          sentence.toLowerCase().includes(String(val).toLowerCase())
        );
        const isUspBacked = brandUsps.some(usp => 
          sentence.toLowerCase().includes(usp.toLowerCase())
        );

        if (isSpecBacked || isUspBacked) {
          status = 'VERIFIED';
          risk = 'low';
          verified = true;
          source = isSpecBacked ? 'product_specs' : 'brand_dna_usps';
        } else {
          status = 'NEEDS_HUMAN_VERIFICATION';
          risk = 'medium';
          verified = false;
          source = 'unbacked_substantiation_required';
        }
      }
    }

    if (status !== 'SUPPORTED' || sentence.length > 30) {
      claimsFound.push({
        claim: sentence,
        status,
        category,
        source,
        verified,
        risk
      });
    }
  }

  const highRiskCount = claimsFound.filter(c => c.risk === 'high' || c.status === 'PROHIBITED').length;
  const verificationCount = claimsFound.filter(c => c.status === 'NEEDS_HUMAN_VERIFICATION').length;

  return {
    passed: highRiskCount === 0,
    totalClaimsEvaluated: claimsFound.length,
    highRiskCount,
    verificationCount,
    claims: claimsFound
  };
}
