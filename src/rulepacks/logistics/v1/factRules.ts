import { Fact } from '../../../structuring/extractFacts';

const LOGISTICS_FACT_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'Load Number',    pattern: /\bload\s*(?:no|number|#)[.:\s]*(\w{3,})/i },
  { label: 'Carrier ID',     pattern: /\bcarrier\s*(?:id|#)[.:\s]*(\w{3,})/i },
  { label: 'Origin',         pattern: /\borigin[:\s]+([A-Za-z][\w\s,\-]{2,60})/i },
  { label: 'Destination',    pattern: /\bdestination[:\s]+([A-Za-z][\w\s,\-]{2,60})/i },
  { label: 'Bill of Lading', pattern: /\bbill\s+of\s+lading[:\s#]*(\w{3,})/i },
  { label: 'Pro Number',     pattern: /\bpro\s*(?:no|number|#)[.:\s]*(\w{3,})/i },
  { label: 'Weight (lbs)',   pattern: /\bweight[:\s]+([\d,]+(?:\.\d+)?)\s*lbs?\b/i },
];

/**
 * Extract logistics-specific facts from document text.
 */
export function extractFacts(text: string): Fact[] {
  const facts: Fact[] = [];
  const seen = new Set<string>();

  for (const { label, pattern } of LOGISTICS_FACT_PATTERNS) {
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
