import fs from 'fs';
import path from 'path';

const LOG_DIR = path.resolve(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'packets.jsonl');

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
 * Append a governance log entry to logs/packets.jsonl.
 * Creates the log directory if it does not exist.
 */
export function logPacket(entry: PacketLogEntry): void {
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    const record: PacketLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };
    fs.appendFileSync(LOG_FILE, JSON.stringify(record) + '\n', 'utf8');
  } catch (err) {
    // Governance logging must never crash the main process
    console.warn('Governance log write failed:', err);
  }
}
