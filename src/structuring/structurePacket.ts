import { summarize } from './summarize';
import { extractFacts, Fact } from './extractFacts';
import { buildTimeline, TimelineEntry } from './buildTimeline';

export interface StructuredPacket {
  sourceName: string;
  summary: string;
  facts: Fact[];
  timeline: TimelineEntry[];
  riskFlags: string[];
  rawText: string;
}

/**
 * Assemble all structured components into a single packet object.
 */
export function structurePacket(rawText: string, sourceName: string): StructuredPacket {
  return {
    sourceName,
    summary: summarize(rawText),
    facts: extractFacts(rawText),
    timeline: buildTimeline(rawText),
    riskFlags: [],
    rawText,
  };
}
