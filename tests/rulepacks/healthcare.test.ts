import { describe, it, expect } from "vitest";
import { extractFacts } from "../../src/rulepacks/healthcare/v1/factRules";
import { extractTimeline } from "../../src/rulepacks/healthcare/v1/timelineRules";
import { detectRiskFlags } from "../../src/rulepacks/healthcare/v1/riskFlags";

const SAMPLE_TEXT = `
  Patient: Jane Doe
  ICD-10: Z00.00
  CPT: 99213
  Date of service: 02/14/2023
  Provider NPI: 1234567890
  Diagnosis: Routine checkup
  Medication: Amoxicillin 500mg
  Medically necessary
  Prior authorization approved: 02/01/2023
`;

describe("Healthcare Rule-Pack v1 – factRules", () => {
  it("extracts patient name", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const patient = facts.find((f) => f.label === "Patient Name");
    expect(patient).toBeDefined();
  });

  it("extracts ICD-10 code", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const icd = facts.find((f) => f.label === "ICD-10 Code");
    expect(icd).toBeDefined();
    expect(icd?.value).toContain("Z00");
  });

  it("extracts CPT code", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const cpt = facts.find((f) => f.label === "CPT Code");
    expect(cpt).toBeDefined();
    expect(cpt?.value).toBe("99213");
  });

  it("returns empty array for text with no healthcare facts", () => {
    expect(extractFacts("nothing relevant here")).toEqual([]);
  });
});

describe("Healthcare Rule-Pack v1 – timelineRules", () => {
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

  it("returns empty array when no healthcare dates found", () => {
    expect(extractTimeline("no dates here")).toEqual([]);
  });
});

describe("Healthcare Rule-Pack v1 – riskFlags", () => {
  it("returns an array", () => {
    const flags = detectRiskFlags(SAMPLE_TEXT);
    expect(Array.isArray(flags)).toBe(true);
  });

  it("raises no missing-ICD10 flag when ICD-10 is present", () => {
    const flags = detectRiskFlags(SAMPLE_TEXT);
    expect(flags.some((f) => f.includes("ICD-10"))).toBe(false);
  });

  it("flags experimental treatment when keyword present", () => {
    const flags = detectRiskFlags("This is an experimental treatment plan.");
    expect(flags.some((f) => f.includes("Experimental"))).toBe(true);
  });

  it("flags out-of-network provider when keyword present", () => {
    const flags = detectRiskFlags("Provider is out-of-network.");
    expect(flags.some((f) => f.toLowerCase().includes("out-of-network"))).toBe(true);
  });
});
