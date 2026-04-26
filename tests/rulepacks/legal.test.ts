import { describe, it, expect } from "vitest";
import { extractFacts } from "../../src/rulepacks/legal/v1/factRules";
import { extractTimeline } from "../../src/rulepacks/legal/v1/timelineRules";
import { detectRiskFlags } from "../../src/rulepacks/legal/v1/riskFlags";

const SAMPLE_TEXT = `
  Case number: 2023-CV-00123
  Plaintiff: John Smith
  Defendant: ACME Corp
  Court: Superior Court of California
  Judge: Hon. Alice Brown
  Filed on: 01/10/2023
  Hearing on: 04/15/2023
  Docket number: DCK-456
`;

describe("Legal Rule-Pack v1 – factRules", () => {
  it("extracts case number", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const caseNum = facts.find((f) => f.label === "Case Number");
    expect(caseNum).toBeDefined();
  });

  it("extracts plaintiff", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const plaintiff = facts.find((f) => f.label === "Plaintiff");
    expect(plaintiff).toBeDefined();
  });

  it("extracts defendant", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const defendant = facts.find((f) => f.label === "Defendant");
    expect(defendant).toBeDefined();
  });

  it("returns empty array for text with no legal facts", () => {
    expect(extractFacts("nothing relevant here")).toEqual([]);
  });
});

describe("Legal Rule-Pack v1 – timelineRules", () => {
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

  it("returns empty array when no legal dates found", () => {
    expect(extractTimeline("no dates here")).toEqual([]);
  });
});

describe("Legal Rule-Pack v1 – riskFlags", () => {
  it("raises no missing parties flag when plaintiff and defendant present", () => {
    const flags = detectRiskFlags(SAMPLE_TEXT);
    expect(flags.some((f) => f.includes("Parties"))).toBe(false);
  });

  it("detects privilege assertion flag", () => {
    const flags = detectRiskFlags("This is attorney-client privilege communication.");
    expect(flags.some((f) => f.includes("Privilege"))).toBe(true);
  });

  it("detects statute of limitations concern", () => {
    const flags = detectRiskFlags(
      "The statute of limitations may bar this claim. plaintiff present defendant present court stated."
    );
    expect(flags.some((f) => f.includes("Statute of limitations"))).toBe(true);
  });

  it("detects sealed document reference", () => {
    const flags = detectRiskFlags(
      "plaintiff defendant court — sealed document attached."
    );
    expect(flags.some((f) => f.includes("Sealed"))).toBe(true);
  });
});
