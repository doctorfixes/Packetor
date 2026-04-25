const RISK_KEYWORDS: Array<{ flag: string; pattern: RegExp }> = [
  { flag: 'Possible fraud indicator: multiple claims in short period', pattern: /\bmultiple\s+claims\b/i },
  { flag: 'High-value claim detected',                                 pattern: /\$[\d,]{6,}/i },
  { flag: 'Late claim filing suspected',                               pattern: /\b(?:late|delayed)\s+(?:filing|report|submission)\b/i },
  { flag: 'Coverage dispute noted',                                    pattern: /\b(?:excluded|exclusion|not\s+covered|coverage\s+denied)\b/i },
  { flag: 'Pre-existing condition mentioned',                          pattern: /\bpre-?existing\b/i },
  { flag: 'Suspicious loss circumstances',                             pattern: /\b(?:arson|intentional|staged|suspicious)\b/i },
];

/**
 * Scan text for risk flag keywords and return a list of human-readable flags.
 */
export function detectRiskFlags(text: string): string[] {
  const flags: string[] = [];
  for (const { flag, pattern } of RISK_KEYWORDS) {
    if (pattern.test(text)) {
      flags.push(flag);
    }
  }
  return flags;
}
