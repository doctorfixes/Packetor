import { TimelineEntry } from '../../../structuring/buildTimeline';

const INSURANCE_DATE_PATTERNS = [
  /\b(?:date\s+of\s+loss)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\b(?:claim\s+filed|claim\s+received|claim\s+opened)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\b(?:inspection|assessment|survey)\s+on[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\b(?:settlement|payment)\s+(?:date|on)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
];

const EVENT_LABELS: Record<string, string> = {
  'date of loss': 'Date of loss',
  'claim filed': 'Claim filed',
  'claim received': 'Claim received',
  'claim opened': 'Claim opened',
  inspection: 'Inspection / assessment',
  assessment: 'Inspection / assessment',
  survey: 'Inspection / assessment',
  settlement: 'Settlement / payment',
  payment: 'Settlement / payment',
};

/**
 * Extract insurance-specific timeline entries from document text.
 */
export function extractTimeline(text: string): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const seen = new Set<string>();

  for (const pattern of INSURANCE_DATE_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const date = match[1].trim();
      // Derive a human-readable event label from the match source
      const src = (match[0] || '').toLowerCase();
      let event = 'Insurance event';
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
