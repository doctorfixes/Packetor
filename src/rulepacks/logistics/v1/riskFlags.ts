const LOGISTICS_RISK_KEYWORDS: Array<{ flag: string; pattern: RegExp }> = [
  { flag: 'Damaged goods reported',          pattern: /\b(?:damage[d]?|damaged\s+goods|freight\s+damage)\b/i },
  { flag: 'Delivery delay indicated',        pattern: /\b(?:delay(?:ed)?|late\s+delivery|missed\s+ETA)\b/i },
  { flag: 'Carrier compliance issue noted',  pattern: /\b(?:violation|out\s+of\s+compliance|FMCSA)\b/i },
  { flag: 'Hazardous materials detected',    pattern: /\b(?:hazmat|hazardous\s+materials?|HAZMAT)\b/i },
];

/**
 * Scan text for logistics risk flag keywords and return a list of human-readable flags.
 */
export function detectRiskFlags(text: string): string[] {
  const flags: string[] = [];

  // Required-field absence checks
  if (!/\bbill\s+of\s+lading\b/i.test(text)) {
    flags.push('Bill of Lading reference absent');
  }
  if (!/\bcarrier\b/i.test(text)) {
    flags.push('Carrier identification absent');
  }
  if (!/\b(?:origin|destination)\b/i.test(text)) {
    flags.push('Origin or destination not specified');
  }

  // Warning signal presence checks
  for (const { flag, pattern } of LOGISTICS_RISK_KEYWORDS) {
    if (pattern.test(text)) {
      flags.push(flag);
    }
  }

  return flags;
}
