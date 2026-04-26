import path from 'path';
import { Fact } from '../structuring/extractFacts';
import { TimelineEntry } from '../structuring/buildTimeline';

export interface RulePack {
  name: string;
  version: string;
  extractFacts?: (text: string) => Fact[];
  extractTimeline?: (text: string) => TimelineEntry[];
  detectRiskFlags?: (text: string) => string[];
}

/** Allowlist of registered rule-pack identifiers (format: "<name>/<version>"). */
const ALLOWED_RULEPACKS = new Set<string>([
  'insurance/v1',
  'healthcare/v1',
  'logistics/v1',
  'legal/v1',
  'construction/v1',
]);

/** Safe segment: only alphanumerics, hyphens and underscores. */
const SAFE_SEGMENT = /^[a-zA-Z0-9_-]+$/;

/**
 * Validate that an identifier is in the allowlist and contains only safe path segments.
 * Returns true if the identifier is safe to use as a module path.
 */
function isAllowedIdentifier(identifier: string): boolean {
  if (!ALLOWED_RULEPACKS.has(identifier)) {
    return false;
  }
  return identifier.split('/').every((part) => SAFE_SEGMENT.test(part));
}

/**
 * Dynamically load a rule‑pack by its path identifier (e.g. "insurance/v1").
 * Only identifiers explicitly listed in ALLOWED_RULEPACKS may be loaded.
 * Returns null if the rule‑pack is not found or the identifier is not allowed.
 */
export async function loadRulePack(identifier: string): Promise<RulePack | null> {
  if (!isAllowedIdentifier(identifier)) {
    console.warn(`Rule-pack "${identifier}" is not in the allowlist or contains unsafe characters.`);
    return null;
  }

  // identifier format: "<name>/<version>"
  const parts = identifier.split('/');

  // Verify the resolved path does not escape the rulepacks base directory
  const rulepackDir = path.resolve(__dirname, identifier);
  const expectedBase = path.resolve(__dirname);
  const relative = path.relative(expectedBase, rulepackDir);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    console.warn(`Rule-pack path resolves outside the rulepacks directory: "${identifier}"`);
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require(path.join(rulepackDir, 'factRules')) as {
      extractFacts?: (text: string) => Fact[];
    };
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const timelineMod = require(path.join(rulepackDir, 'timelineRules')) as {
      extractTimeline?: (text: string) => TimelineEntry[];
    };
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const riskMod = require(path.join(rulepackDir, 'riskFlags')) as {
      detectRiskFlags?: (text: string) => string[];
    };

    return {
      name: parts[0],
      version: parts[1],
      extractFacts: mod.extractFacts,
      extractTimeline: timelineMod.extractTimeline,
      detectRiskFlags: riskMod.detectRiskFlags,
    };
  } catch {
    console.warn(`Rule-pack "${identifier}" could not be loaded.`);
    return null;
  }
}
