import fs from 'fs';
import path from 'path';
import { resolveTenant } from './tenant';

/**
 * Tenant-scoped storage scaffolding (v1.0 placeholder).
 *
 * Writes and reads packet files under each tenant's storage directory.
 * Swap out for S3 / Azure Blob / SharePoint in production.
 */

/**
 * Save a packet to the tenant's storage path.
 * Returns the resolved file path.
 */
export function savePacket(tenantId: string, filename: string, content: string): string {
  const tenant = resolveTenant(tenantId);
  const dir = path.resolve(process.cwd(), tenant.storagePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

/**
 * Load a packet from the tenant's storage path.
 * Returns null if the file does not exist.
 */
export function loadPacket(tenantId: string, filename: string): string | null {
  const tenant = resolveTenant(tenantId);
  const filePath = path.resolve(process.cwd(), tenant.storagePath, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * List all packet files stored for a tenant.
 */
export function listPackets(tenantId: string): string[] {
  const tenant = resolveTenant(tenantId);
  const dir = path.resolve(process.cwd(), tenant.storagePath);
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.json'));
}
