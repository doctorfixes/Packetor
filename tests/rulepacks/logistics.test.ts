import { describe, it, expect } from "vitest";
import { extractFacts } from "../../src/rulepacks/logistics/v1/factRules";
import { extractTimeline } from "../../src/rulepacks/logistics/v1/timelineRules";
import { detectRiskFlags } from "../../src/rulepacks/logistics/v1/riskFlags";

const SAMPLE_TEXT = `
  Load number: LOAD-9001
  Carrier ID: CARR-42
  Origin: Chicago, IL
  Destination: Dallas, TX
  Bill of lading: BOL-555
  Pickup date: 04/01/2024
  Delivery date: 04/05/2024
  Weight: 2,500 lbs
`;

describe("Logistics Rule-Pack v1 – factRules", () => {
  it("extracts load number", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const load = facts.find((f) => f.label === "Load Number");
    expect(load).toBeDefined();
  });

  it("extracts origin", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const origin = facts.find((f) => f.label === "Origin");
    expect(origin).toBeDefined();
  });

  it("extracts destination", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const dest = facts.find((f) => f.label === "Destination");
    expect(dest).toBeDefined();
  });

  it("returns empty array for text with no logistics facts", () => {
    expect(extractFacts("nothing relevant here")).toEqual([]);
  });
});

describe("Logistics Rule-Pack v1 – timelineRules", () => {
  it("extracts timeline entries from the sample text", () => {
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

  it("returns empty array when no logistics dates found", () => {
    expect(extractTimeline("no dates here")).toEqual([]);
  });
});

describe("Logistics Rule-Pack v1 – riskFlags", () => {
  it("detects damaged goods flag", () => {
    const flags = detectRiskFlags("Freight damage reported on delivery.");
    expect(flags.some((f) => f.includes("Damaged goods"))).toBe(true);
  });

  it("detects delivery delay flag", () => {
    const flags = detectRiskFlags("Late delivery due to weather.");
    expect(flags.some((f) => f.includes("delay"))).toBe(true);
  });

  it("detects hazmat flag", () => {
    const flags = detectRiskFlags("Hazmat materials on board.");
    expect(flags.some((f) => f.includes("Hazardous"))).toBe(true);
  });

  it("raises no missing bill-of-lading flag when present", () => {
    const flags = detectRiskFlags(SAMPLE_TEXT);
    expect(flags.some((f) => f.includes("Bill of Lading"))).toBe(false);
  });
});
