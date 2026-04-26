import { describe, it, expect, vi } from "vitest";
import { applyRulePack } from "../../src/structuring/applyRulePack";
import type { StructuredPacket } from "../../src/structuring/structurePacket";

vi.mock("../../src/rulepacks/loader", () => ({
  loadRulePack: vi.fn(),
}));

import { loadRulePack } from "../../src/rulepacks/loader";

const basePacket: StructuredPacket = {
  sourceName: "doc.txt",
  summary: "A test summary.",
  facts: [{ label: "Date", value: "01/01/2024" }],
  timeline: [{ date: "01/01/2024", event: "Initial event." }],
  riskFlags: [],
  rawText: "Some raw text.",
};

describe("applyRulePack()", () => {
  it("returns the original packet unchanged when the rulepack is not found", async () => {
    vi.mocked(loadRulePack).mockResolvedValueOnce(null);
    const result = await applyRulePack(basePacket, "unknown/v1");
    expect(result).toEqual(basePacket);
  });

  it("merges extra facts returned by the rulepack", async () => {
    vi.mocked(loadRulePack).mockResolvedValueOnce({
      name: "test",
      version: "v1",
      extractFacts: () => [{ label: "PolicyNumber", value: "POL-999" }],
    });
    const result = await applyRulePack(basePacket, "test/v1");
    expect(result.facts).toContainEqual({ label: "PolicyNumber", value: "POL-999" });
    expect(result.facts).toContainEqual(basePacket.facts[0]);
  });

  it("preserves the original facts alongside new ones", async () => {
    vi.mocked(loadRulePack).mockResolvedValueOnce({
      name: "test",
      version: "v1",
      extractFacts: () => [{ label: "NewFact", value: "val" }],
    });
    const result = await applyRulePack(basePacket, "test/v1");
    expect(result.facts.length).toBe(basePacket.facts.length + 1);
  });

  it("merges extra timeline entries returned by the rulepack", async () => {
    vi.mocked(loadRulePack).mockResolvedValueOnce({
      name: "test",
      version: "v1",
      extractTimeline: () => [{ date: "02/02/2024", event: "New milestone." }],
    });
    const result = await applyRulePack(basePacket, "test/v1");
    expect(result.timeline).toContainEqual({
      date: "02/02/2024",
      event: "New milestone.",
    });
    expect(result.timeline.length).toBe(basePacket.timeline.length + 1);
  });

  it("adds risk flags returned by the rulepack", async () => {
    vi.mocked(loadRulePack).mockResolvedValueOnce({
      name: "test",
      version: "v1",
      detectRiskFlags: () => ["High-value claim."],
    });
    const result = await applyRulePack(basePacket, "test/v1");
    expect(result.riskFlags).toContain("High-value claim.");
  });

  it("handles a rulepack with all optional functions absent", async () => {
    vi.mocked(loadRulePack).mockResolvedValueOnce({
      name: "minimal",
      version: "v1",
    });
    const result = await applyRulePack(basePacket, "minimal/v1");
    expect(result.facts).toEqual(basePacket.facts);
    expect(result.timeline).toEqual(basePacket.timeline);
    expect(result.riskFlags).toEqual(basePacket.riskFlags);
  });

  it("preserves all other packet fields unchanged", async () => {
    vi.mocked(loadRulePack).mockResolvedValueOnce({
      name: "test",
      version: "v1",
      extractFacts: () => [{ label: "X", value: "y" }],
    });
    const result = await applyRulePack(basePacket, "test/v1");
    expect(result.sourceName).toBe(basePacket.sourceName);
    expect(result.summary).toBe(basePacket.summary);
    expect(result.rawText).toBe(basePacket.rawText);
  });
});
