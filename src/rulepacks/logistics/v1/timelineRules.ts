import { TimelineEntry } from '../../../structuring/buildTimeline';

const LOGISTICS_DATE_PATTERNS = [
  /\bpickup\s+(?:date|on)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bdelivery\s+(?:date|on)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bETA[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bETD[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bshipped\s+on[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
];

const EVENT_LABELS: Record<string, string> = {
  pickup: 'Pickup',
  delivery: 'Delivery',
  eta: 'Estimated time of arrival (ETA)',
  etd: 'Estimated time of departure (ETD)',
  shipped: 'Shipped',
};

/**
 * Extract logistics-specific timeline entries from document text.
 */
export function extractTimeline(text: string): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const seen = new Set<string>();

  for (const pattern of LOGISTICS_DATE_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const date = match[1].trim();
      const src = (match[0] || '').toLowerCase();
      let event = 'Logistics event';
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
