import { Fact } from '../../../structuring/extractFacts';

const INSURANCE_FACT_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'Claim Number',    pattern: /\bclaim\s*(?:no|number|#)[.:\s]+([A-Z0-9\-]{4,})/i },
  { label: 'Insured Name',    pattern: /\binsured[:\s]+([A-Za-z][\w\s\-,']{2,40})/i },
  { label: 'Policy Number',   pattern: /\bpolicy\s*(?:no|number|#)[.:\s]+([A-Z0-9\-]{4,})/i },
  { label: 'Claim Amount',    pattern: /\bclaim(?:ed)?\s*(?:amount|value)[:\s]*\$?([\d,]+(?:\.\d{2})?)/i },
  { label: 'Loss Date',       pattern: /\b(?:date\s+of\s+loss|loss\s+date)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/i },
  { label: 'Adjuster',        pattern: /\badjuster[:\s]+([A-Za-z][\w\s\-,']{2,40})/i },
  { label: 'Coverage Type',   pattern: /\bcoverage[:\s]+([A-Za-z][\w\s\-,']{2,60})/i },
];

/**
 * Extract insurance-specific facts from document text.
 */
export function extractFacts(text: string): Fact[] {
  const facts: Fact[] = [];
  const seen = new Set<string>();

  for (const { label, pattern } of INSURANCE_FACT_PATTERNS) {
    const match = pattern.exec(text);
    if (match && match[1]) {
      const value = match[1].trim();
      const key = `${label}:${value}`;
      if (!seen.has(key)) {
        seen.add(key);
        facts.push({ label, value });
      }
    }
  }

  return facts;
}
