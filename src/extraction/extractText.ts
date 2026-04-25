// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (data: Buffer) => Promise<{ text: string }>;

/**
 * Extract plain text from a PDF buffer using pdf-parse.
 */
export async function extractTextFromPdf(data: Buffer): Promise<string> {
  const result = await pdfParse(data);
  return result.text.trim();
}
