const CONSTRUCTION_RISK_KEYWORDS: Array<{ flag: string; pattern: RegExp }> = [
  { flag: 'Change order dispute indicated',      pattern: /\b(?:disputed?\s+change\s+order|change\s+order\s+denied)\b/i },
  { flag: 'Construction delay documented',       pattern: /\b(?:delay(?:ed)?|behind\s+schedule|schedule\s+impact)\b/i },
  { flag: 'Safety incident or violation noted',  pattern: /\b(?:safety\s+(?:incident|violation|issue)|OSHA)\b/i },
  { flag: 'Lien or bond claim referenced',       pattern: /\b(?:mechanic[s]?[\s\']?\s*lien|performance\s+bond|payment\s+bond)\b/i },
  { flag: 'Deficiency or non-conformance noted', pattern: /\b(?:deficienc(?:y|ies)|non-?conformance|punch\s+list)\b/i },
];

/**
 * Scan text for construction risk flag keywords and return a list of human-readable flags.
 */
export function detectRiskFlags(text: string): string[] {
  const flags: string[] = [];

  // Required-field absence checks
  if (!/\bproject\s*(?:id|no|number|#)/i.test(text)) {
    flags.push('Project ID absent');
  }
  if (!/\bRFI\b/i.test(text)) {
    flags.push('RFI reference absent');
  }
  if (!/\bcontract(?:or)?\b/i.test(text)) {
    flags.push('Contractor or contract reference absent');
  }

  // Warning signal presence checks
  for (const { flag, pattern } of CONSTRUCTION_RISK_KEYWORDS) {
    if (pattern.test(text)) {
      flags.push(flag);
    }
  }

  return flags;
}
