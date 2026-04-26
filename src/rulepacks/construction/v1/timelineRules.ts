import { TimelineEntry } from '../../../structuring/buildTimeline';

const CONSTRUCTION_DATE_PATTERNS = [
  /\bRFI\s+submitted[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bRFI\s+responded[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bsubmittal\s+(?:date|submitted|received)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bnotice\s+to\s+proceed[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bsubstantial\s+completion[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bchange\s+order\s+(?:dated|on|issued)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
];

const EVENT_LABELS: Record<string, string> = {
  'rfi submitted': 'RFI submitted',
  'rfi responded': 'RFI response received',
  submittal: 'Submittal',
  'notice to proceed': 'Notice to proceed',
  'substantial completion': 'Substantial completion',
  'change order': 'Change order',
};

/**
 * Extract construction-specific timeline entries from document text.
 */
export function extractTimeline(text: string): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const seen = new Set<string>();

  for (const pattern of CONSTRUCTION_DATE_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const date = match[1].trim();
      const src = (match[0] || '').toLowerCase();
      let event = 'Construction event';
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
