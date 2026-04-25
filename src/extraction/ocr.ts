/**
 * OCR stub – returns a placeholder until a real OCR library is wired in.
 *
 * To integrate a real OCR engine (e.g. Tesseract via tesseract.js), replace
 * the body of this function with the appropriate async call.
 */
export async function extractTextFromOcr(data: Buffer): Promise<string> {
  void data; // suppress unused-variable warning until real implementation
  return '[OCR extraction is not yet implemented. Please supply a text or PDF file.]';
}
