export interface Fact {
  label: string;
  value: string;
}

const FACT_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'Date',        pattern: /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})\b/ },
  { label: 'Reference',  pattern: /\b(?:ref(?:erence)?|case|id|no)[.:\s#]+([A-Z0-9\-]{4,})/i },
  { label: 'Amount',     pattern: /\b(?:total|amount|sum|balance)[:\s]*\$?([\d,]+(?:\.\d{2})?)/i },
  { label: 'Name',       pattern: /\b(?:name|client|customer|insured)[:\s]+([A-Za-z][\w\s\-,']{2,40})/i },
  { label: 'Policy',     pattern: /\b(?:policy|contract)[#\s:]+([A-Z0-9\-]{4,})/i },
];

/**
 * Scans text for common fact patterns and returns labelled key-value pairs.
 */
export function extractFacts(text: string): Fact[] {
  const facts: Fact[] = [];
  const seen = new Set<string>();

  for (const { label, pattern } of FACT_PATTERNS) {
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
