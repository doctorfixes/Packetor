import { describe, it, expect } from "vitest";
import { extractFacts } from "../../src/rulepacks/construction/v1/factRules";
import { extractTimeline } from "../../src/rulepacks/construction/v1/timelineRules";
import { detectRiskFlags } from "../../src/rulepacks/construction/v1/riskFlags";

const SAMPLE_TEXT = `
  Project ID: PROJ-2024
  RFI number: 042
  Submittal number: SUB-007
  Contract number: CNT-1001
  Submitted by: Bob Builder
  Contractor: Acme Construction
  Spec section: 03 30 00
  RFI submitted: 06/01/2024
  Submittal date: 06/10/2024
`;

describe("Construction Rule-Pack v1 – factRules", () => {
  it("extracts project ID", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const project = facts.find((f) => f.label === "Project ID");
    expect(project).toBeDefined();
  });

  it("extracts RFI number", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const rfi = facts.find((f) => f.label === "RFI Number");
    expect(rfi).toBeDefined();
  });

  it("extracts contractor", () => {
    const facts = extractFacts(SAMPLE_TEXT);
    const contractor = facts.find((f) => f.label === "Contractor");
    expect(contractor).toBeDefined();
  });

  it("returns empty array for text with no construction facts", () => {
    expect(extractFacts("nothing relevant here")).toEqual([]);
  });
});

describe("Construction Rule-Pack v1 – timelineRules", () => {
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

  it("returns empty array when no construction dates found", () => {
    expect(extractTimeline("no dates here")).toEqual([]);
  });
});

describe("Construction Rule-Pack v1 – riskFlags", () => {
  it("raises no missing project-ID flag when project ID present", () => {
    const flags = detectRiskFlags(SAMPLE_TEXT);
    expect(flags.some((f) => f.includes("Project ID absent"))).toBe(false);
  });

  it("detects construction delay flag", () => {
    const flags = detectRiskFlags(
      "Project ID: X RFI #1 contractor delayed behind schedule."
    );
    expect(flags.some((f) => f.includes("delay"))).toBe(true);
  });

  it("detects safety incident flag", () => {
    const flags = detectRiskFlags(
      "Project ID: X RFI #1 contractor OSHA safety violation reported."
    );
    expect(flags.some((f) => f.includes("Safety"))).toBe(true);
  });

  it("detects lien flag", () => {
    const flags = detectRiskFlags(
      "Project ID: X RFI #1 contractor mechanics lien filed."
    );
    expect(flags.some((f) => f.includes("Lien"))).toBe(true);
  });
});
