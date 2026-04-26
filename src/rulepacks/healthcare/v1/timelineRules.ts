import { TimelineEntry } from '../../../structuring/buildTimeline';

const HEALTHCARE_DATE_PATTERNS = [
  /\bdate\s+of\s+service[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bprior\s+auth(?:orization)?\s+(?:requested|submitted)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bprior\s+auth(?:orization)?\s+(?:approved|denied)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bappointment\s+(?:date|on)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
  /\bdischarge\s+(?:date|on)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},?\s*\d{4})/gi,
];

const EVENT_LABELS: Record<string, string> = {
  'date of service': 'Date of service',
  'prior auth': 'Prior authorization',
  appointment: 'Appointment',
  discharge: 'Discharge',
};

/**
 * Extract healthcare-specific timeline entries from document text.
 */
export function extractTimeline(text: string): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const seen = new Set<string>();

  for (const pattern of HEALTHCARE_DATE_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const date = match[1].trim();
      const src = (match[0] || '').toLowerCase();
      let event = 'Healthcare event';
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
