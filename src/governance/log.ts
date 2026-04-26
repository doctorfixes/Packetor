import fs from 'fs';
import { tenantPath } from '../enterprise/storage';

export interface PacketLogEntry {
  inputHash: string;
  outputHash: string;
  templateVersion: string;
  rulepackVersion: string;
  engineVersion: string;
  sourceName: string;
  timestamp?: string;
}

/**
 * Append a governance log entry to the tenant's logs/packets.jsonl.
 * Creates the log directory if it does not exist.
 */
export function logPacket(entry: PacketLogEntry, tenant = 'default'): void {
  try {
    const logFile = tenantPath(tenant, 'packets.jsonl');
    const record: PacketLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };
    fs.appendFileSync(logFile, JSON.stringify(record) + '\n', 'utf8');
  } catch (err) {
    // Governance logging must never crash the main process
    console.warn('Governance log write failed:', err);
  }
}
