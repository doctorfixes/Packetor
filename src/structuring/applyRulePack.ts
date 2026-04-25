import { loadRulePack } from '../rulepacks/loader';
import { StructuredPacket } from './structurePacket';

/**
 * Apply a named rule‑pack to an already‑structured packet.
 * The rule‑pack can augment facts, timeline, and risk flags.
 */
export async function applyRulePack(
  packet: StructuredPacket,
  rulepack: string
): Promise<StructuredPacket> {
  const pack = await loadRulePack(rulepack);
  if (!pack) {
    console.warn(`Rule-pack "${rulepack}" not found. Skipping.`);
    return packet;
  }

  const extraFacts = pack.extractFacts ? pack.extractFacts(packet.rawText) : [];
  const extraTimeline = pack.extractTimeline ? pack.extractTimeline(packet.rawText) : [];
  const flags = pack.detectRiskFlags ? pack.detectRiskFlags(packet.rawText) : [];

  return {
    ...packet,
    facts: [...packet.facts, ...extraFacts],
    timeline: [...packet.timeline, ...extraTimeline],
    riskFlags: [...packet.riskFlags, ...flags],
  };
}
