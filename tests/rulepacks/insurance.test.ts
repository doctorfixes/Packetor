import { describe, it, expect } from "vitest";
import { extractFacts } from "../../src/rulepacks/insurance/v1/factRules";
import { extractTimeline } from "../../src/rulepacks/insurance/v1/timelineRules";
import { detectRiskFlags } from "../../src/rulepacks/insurance/v1/riskFlags";

const SAMPLE_TEXT = `
  Policy number: POL-12345
  Claim number: CLM-67890
  Date of loss: 03/15/2021
  Claim filed: 03/20/2021
  Coverage: Comprehensive
  Multiple claims filed this year
`;

describe("Insurance Rule-Pack v1 – factRules", () => {
  it("extracts policy number", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const policy = facts.find((f) => f.label === "Policy Number");
    expect(policy).toBeDefined();
    expect(policy?.value).toContain("POL-12345");
  });

  it("extracts claim number", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const claim = facts.find((f) => f.label === "Claim Number");
    expect(claim).toBeDefined();
    expect(claim?.value).toContain("CLM-67890");
  });

  it("extracts coverage type", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const coverage = facts.find((f) => f.label === "Coverage Type");
    expect(coverage).toBeDefined();
  });

  it("returns empty array for text with no insurance facts", () => {
    expect(extractFacts("nothing relevant here")).toEqual([]);
  });
});

describe("Insurance Rule-Pack v1 – timelineRules", () => {
  it("extracts timeline entries from dated events", () => {
    const timeline = extractTimeline(SAMPLE_TEXT);
    expect(timeline.length).toBeGreaterThan(0);
  });

  it("each entry has date and event fields", () => {
    const timeline = extractTimeline(SAMPLE_TEXT);
    for (const entry of timeline) {
      expect(typeof entry.date).toBe("string");
      expect(typeof entry.event).toBe("string");
    }
  });

  it("returns empty array when no insurance dates found", () => {
    expect(extractTimeline("no dates here")).toEqual([]);
  });
});

describe("Insurance Rule-Pack v1 – riskFlags", () => {
  it("detects multiple claims risk flag", () => {
    const flags = detectRiskFlags(SAMPLE_TEXT);
    expect(flags.some((f) => f.includes("multiple claims"))).toBe(true);
  });

  it("detects high-value claim flag", () => {
    const flags = detectRiskFlags("Claim amount $1,000,000.00");
    expect(flags.some((f) => f.includes("High-value"))).toBe(true);
  });

  it("returns an array (may be empty) for benign text", () => {
    const flags = detectRiskFlags("routine claim, all clear");
    expect(Array.isArray(flags)).toBe(true);
  });
});
