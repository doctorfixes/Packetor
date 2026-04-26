import { Fact } from '../../../structuring/extractFacts';

const LEGAL_FACT_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'Case Number',    pattern: /\bcase\s*(?:no|number|#)[.:\s]+([A-Z0-9\-:]{3,})/i },
  { label: 'Plaintiff',      pattern: /\bplaintiff[:\s]+([A-Za-z][\w\s\-,']{2,60})/i },
  { label: 'Defendant',      pattern: /\bdefendant[:\s]+([A-Za-z][\w\s\-,']{2,60})/i },
  { label: 'Court',          pattern: /\b(?:court|tribunal)[:\s]+([A-Za-z][\w\s\-,']{2,80})/i },
  { label: 'Judge',          pattern: /\bjudge[:\s]+([A-Za-z][\w\s\-,']{2,60})/i },
  { label: 'Filing Date',    pattern: /\bfiled[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/i },
  { label: 'Docket Number',  pattern: /\bdocket\s*(?:no|number|#)[.:\s]+([A-Z0-9\-:]{3,})/i },
];

/**
 * Extract legal-specific facts from document text.
 */
export function extractFacts(text: string): Fact[] {
  const facts: Fact[] = [];
  const seen = new Set<string>();

  for (const { label, pattern } of LEGAL_FACT_PATTERNS) {
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
