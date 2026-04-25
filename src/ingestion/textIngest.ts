/**
 * Normalise raw pasted text before processing.
 * Strips excess whitespace while preserving paragraph breaks.
 */
export function ingestText(raw: string): string {
  return raw
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n\n');
}
