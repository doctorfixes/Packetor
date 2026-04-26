const LEGAL_RISK_KEYWORDS: Array<{ flag: string; pattern: RegExp }> = [
  { flag: 'Privilege assertion detected',      pattern: /\b(?:attorney[\s-]client\s+privilege|work\s+product|privileged)\b/i },
  { flag: 'Spoliation risk indicated',         pattern: /\b(?:spoliation|destruction\s+of\s+evidence|deleted\s+evidence)\b/i },
  { flag: 'Statute of limitations concern',    pattern: /\bstatute\s+of\s+limitations\b/i },
  { flag: 'Contempt or sanction noted',        pattern: /\b(?:contempt|sanction[s]?)\b/i },
  { flag: 'Sealed document referenced',        pattern: /\bsealed\b/i },
];

/**
 * Scan text for legal risk flag keywords and return a list of human-readable flags.
 */
export function detectRiskFlags(text: string): string[] {
  const flags: string[] = [];

  // Required-field absence checks
  if (!/\bcase\s*(?:no|number|#)/i.test(text)) {
    flags.push('Case number absent');
  }
  if (!/(plaintiff|defendant)/i.test(text)) {
    flags.push('Parties (plaintiff / defendant) not identified');
  }
  if (!/\bcourt\b/i.test(text)) {
    flags.push('Court or jurisdiction not specified');
  }

  // Warning signal presence checks
  for (const { flag, pattern } of LEGAL_RISK_KEYWORDS) {
    if (pattern.test(text)) {
      flags.push(flag);
    }
  }

  return flags;
}
