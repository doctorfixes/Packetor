import fs from 'fs';
import { PacketLogEntry } from './log';

export interface DriftReport {
  totalPackets: number;
  uniqueTemplates: string[];
  uniqueRulepacks: string[];
  engineVersions: string[];
  duplicateInputHashes: string[];
}

/**
 * Read the governance log and produce a drift report.
 * A "drift" is detected when packets with the same input hash
 * produce different output hashes (indicating non-determinism).
 */
export function detectDrift(logFilePath: string): DriftReport {
  if (!fs.existsSync(logFilePath)) {
    return {
      totalPackets: 0,
      uniqueTemplates: [],
      uniqueRulepacks: [],
      engineVersions: [],
      duplicateInputHashes: [],
    };
  }

  const lines = fs.readFileSync(logFilePath, 'utf8').split('\n').filter(Boolean);
  const entries: PacketLogEntry[] = lines.map((l) => JSON.parse(l) as PacketLogEntry);

  const inputToOutputs = new Map<string, Set<string>>();
  const templates = new Set<string>();
  const rulepacks = new Set<string>();
  const engines = new Set<string>();

  for (const entry of entries) {
    templates.add(entry.templateVersion);
    rulepacks.add(entry.rulepackVersion);
    engines.add(entry.engineVersion);

    if (!inputToOutputs.has(entry.inputHash)) {
      inputToOutputs.set(entry.inputHash, new Set());
    }
    inputToOutputs.get(entry.inputHash)!.add(entry.outputHash);
  }

  const duplicateInputHashes: string[] = [];
  for (const [inputHash, outputs] of inputToOutputs.entries()) {
    if (outputs.size > 1) {
      duplicateInputHashes.push(inputHash);
    }
  }

  return {
    totalPackets: entries.length,
    uniqueTemplates: [...templates],
    uniqueRulepacks: [...rulepacks],
    engineVersions: [...engines],
    duplicateInputHashes,
  };
}
