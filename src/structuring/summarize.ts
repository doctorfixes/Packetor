/**
 * Produces a short summary from extracted text.
 * Uses the first non-empty paragraph (or the first 300 characters) as the summary.
 */
export function summarize(text: string): string {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length === 0) return '(No content to summarize.)';
  const first = paragraphs[0];
  return first.length <= 300 ? first : first.slice(0, 297) + '…';
}
