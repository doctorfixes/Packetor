import { createHash } from 'crypto';

/**
 * Return the SHA-256 hex digest of a string.
 */
export function hashString(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Return the SHA-256 hex digest of a Buffer.
 */
export function hashBuffer(input: Buffer): string {
  return createHash('sha256').update(input).digest('hex');
}
