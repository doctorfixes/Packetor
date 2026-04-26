const HEALTHCARE_WARNING_KEYWORDS: Array<{ flag: string; pattern: RegExp }> = [
  { flag: 'Experimental or investigational treatment noted', pattern: /\b(?:experimental|investigational)\b/i },
  { flag: 'Out-of-network provider indicated',              pattern: /\bout[\s-]of[\s-]network\b/i },
];

/**
 * Scan text for healthcare risk flag keywords and return a list of human-readable flags.
 * Absence checks raise flags when required fields are missing; presence checks raise flags
 * when warning signals are detected.
 */
export function detectRiskFlags(text: string): string[] {
  const flags: string[] = [];

  // Required-field absence checks
  if (!/\bICD-10\b/i.test(text)) {
    flags.push('Missing ICD-10 diagnosis code');
  }
  if (!/\bCPT\b/.test(text)) {
    flags.push('Missing CPT procedure code');
  }
  if (!/\bprior\s+auth(?:orization)?\b/i.test(text)) {
    flags.push('Prior authorization reference absent');
  }
  if (!/\bmedically\s+necessary\b/i.test(text)) {
    flags.push('Medical necessity statement absent');
  }

  // Warning signal presence checks
  for (const { flag, pattern } of HEALTHCARE_WARNING_KEYWORDS) {
    if (pattern.test(text)) {
      flags.push(flag);
    }
  }

  return flags;
}
