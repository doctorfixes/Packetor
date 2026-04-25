import { UploadedFile } from 'express-fileupload';
import { extractTextFromPdf } from '../extraction/extractText';
import { extractTextFromOcr } from '../extraction/ocr';

const IMAGE_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']);

export async function ingestFile(file: UploadedFile): Promise<string> {
  const mime = (file.mimetype || '').toLowerCase();

  if (mime === 'application/pdf') {
    return extractTextFromPdf(file.data);
  }

  if (IMAGE_MIME_TYPES.has(mime)) {
    return extractTextFromOcr(file.data);
  }

  // Plain text fallback
  return file.data.toString('utf8');
}
