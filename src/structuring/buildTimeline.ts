export interface TimelineEntry {
  date: string;
  event: string;
}

const DATE_EVENT_PATTERN =
  /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w{3,9} \d{1,2},?\s*\d{4})\b[^\n]*?([^.\n]{10,120}[.!?]?)/gi;

/**
 * Extracts dated events from text and returns them in chronological order.
 */
export function buildTimeline(text: string): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const seen = new Set<string>();
  let match: RegExpExecArray | null;

  // Reset lastIndex before iterating
  DATE_EVENT_PATTERN.lastIndex = 0;

  while ((match = DATE_EVENT_PATTERN.exec(text)) !== null) {
    const date = match[1].trim();
    const event = match[2].trim();
    const key = `${date}|${event}`;
    if (!seen.has(key)) {
      seen.add(key);
      entries.push({ date, event });
    }
  }

  return entries;
}
