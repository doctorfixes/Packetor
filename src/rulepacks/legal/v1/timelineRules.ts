import { TimelineEntry } from '../../../structuring/buildTimeline';

const LEGAL_DATE_PATTERNS = [
  /\bfiled\s+on[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bhearing\s+(?:date|on|scheduled)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\btrial\s+(?:date|on|set)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bdeposition\s+(?:date|on|taken)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bjudgment\s+(?:entered|rendered|on)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bsettlement\s+(?:date|reached|on)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
];

const EVENT_LABELS: Record<string, string> = {
  filed: 'Filing',
  hearing: 'Hearing',
  trial: 'Trial',
  deposition: 'Deposition',
  judgment: 'Judgment',
  settlement: 'Settlement',
};

/**
 * Extract legal-specific timeline entries from document text.
 */
export function extractTimeline(text: string): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const seen = new Set<string>();

  for (const pattern of LEGAL_DATE_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const date = match[1].trim();
      const src = (match[0] || '').toLowerCase();
      let event = 'Legal event';
      for (const [keyword, label] of Object.entries(EVENT_LABELS)) {
        if (src.includes(keyword)) {
          event = label;
          break;
        }
      }
      const key = `${date}|${event}`;
      if (!seen.has(key)) {
        seen.add(key);
        entries.push({ date, event });
      }
    }
  }

  return entries;
}
