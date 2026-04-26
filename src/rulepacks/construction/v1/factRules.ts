import { Fact } from '../../../structuring/extractFacts';

const CONSTRUCTION_FACT_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'Project ID',      pattern: /\bproject\s*(?:id|no|number|#)[.:\s]+([A-Z0-9\-]{2,})/i },
  { label: 'RFI Number',      pattern: /\bRFI\s*(?:no|number|#)?[.:\s]*(\d{1,6})\b/i },
  { label: 'Submittal Number',pattern: /\bsubmittal\s*(?:no|number|#)[.:\s]+([A-Z0-9\-]{2,})/i },
  { label: 'Contract Number', pattern: /\bcontract\s*(?:no|number|#)[.:\s]+([A-Z0-9\-]{2,})/i },
  { label: 'Submitted By',    pattern: /\bsubmitted\s+by[:\s]+([A-Za-z][\w\s\-,']{2,60})/i },
  { label: 'Contractor',      pattern: /\bcontractor[:\s]+([A-Za-z][\w\s\-,']{2,60})/i },
  { label: 'Spec Section',    pattern: /\bspec(?:ification)?\s+section[:\s]+([\d\s\.]{2,20})/i },
];

/**
 * Extract construction-specific facts from document text.
 */
export function extractFacts(text: string): Fact[] {
  const facts: Fact[] = [];
  const seen = new Set<string>();

  for (const { label, pattern } of CONSTRUCTION_FACT_PATTERNS) {
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
