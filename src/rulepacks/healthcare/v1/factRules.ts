import { Fact } from '../../../structuring/extractFacts';

const HEALTHCARE_FACT_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'ICD-10 Code',     pattern: /\bICD-10[:\s]+([A-Z][0-9A-Z]{1,6}(?:\.[0-9A-Z]{1,4})?)/i },
  { label: 'CPT Code',        pattern: /\bCPT[:\s]+(\d{5})\b/ },
  { label: 'Patient Name',    pattern: /\bpatient[:\s]+([A-Za-z][\w\s\-,']{2,40})/i },
  { label: 'Date of Service', pattern: /\bdate\s+of\s+service[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/i },
  { label: 'Medication',      pattern: /\bmedication[:\s]+([A-Za-z0-9][\w\s\-,]{2,60})/i },
  { label: 'Provider NPI',    pattern: /\bNPI[:\s]+(\d{10})\b/ },
  { label: 'Diagnosis',       pattern: /\bdiagnosis[:\s]+([A-Za-z][\w\s\-,]{2,80})/i },
];

/**
 * Extract healthcare-specific facts from document text.
 */
export function extractFacts(text: string): Fact[] {
  const facts: Fact[] = [];
  const seen = new Set<string>();

  for (const { label, pattern } of HEALTHCARE_FACT_PATTERNS) {
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
