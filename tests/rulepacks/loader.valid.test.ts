/**
 * Tests that each rulepack module exports functions conforming to the RulePack
 * interface.  The loader uses CJS require() at runtime (incompatible with the
 * vitest transform pipeline for TypeScript sources), so the interface contract
 * is verified by importing the sub-modules directly and by validating them
 * through validateRulePack.
 */
import { describe, it, expect } from "vitest";
import { validateRulePack } from "../../src/rulepacks/validate";

// Insurance v1
import { extractFacts as insExtractFacts } from "../../src/rulepacks/insurance/v1/factRules";
import { extractTimeline as insExtractTimeline } from "../../src/rulepacks/insurance/v1/timelineRules";
import { detectRiskFlags as insDetectRiskFlags } from "../../src/rulepacks/insurance/v1/riskFlags";

// Healthcare v1
import { extractFacts as hcExtractFacts } from "../../src/rulepacks/healthcare/v1/factRules";
import { extractTimeline as hcExtractTimeline } from "../../src/rulepacks/healthcare/v1/timelineRules";
import { detectRiskFlags as hcDetectRiskFlags } from "../../src/rulepacks/healthcare/v1/riskFlags";

// Legal v1
import { extractFacts as lgExtractFacts } from "../../src/rulepacks/legal/v1/factRules";
import { extractTimeline as lgExtractTimeline } from "../../src/rulepacks/legal/v1/timelineRules";
import { detectRiskFlags as lgDetectRiskFlags } from "../../src/rulepacks/legal/v1/riskFlags";

// Logistics v1
import { extractFacts as lsExtractFacts } from "../../src/rulepacks/logistics/v1/factRules";
import { extractTimeline as lsExtractTimeline } from "../../src/rulepacks/logistics/v1/timelineRules";
import { detectRiskFlags as lsDetectRiskFlags } from "../../src/rulepacks/logistics/v1/riskFlags";

// Construction v1
import { extractFacts as cnExtractFacts } from "../../src/rulepacks/construction/v1/factRules";
import { extractTimeline as cnExtractTimeline } from "../../src/rulepacks/construction/v1/timelineRules";
import { detectRiskFlags as cnDetectRiskFlags } from "../../src/rulepacks/construction/v1/riskFlags";

describe("RulePack module interface – insurance/v1", () => {
  it("passes validateRulePack", () => {
    expect(() =>
      validateRulePack({
        template: "insurance/v1",
        factRules: insExtractFacts,
        timelineRules: insExtractTimeline,
        riskFlags: insDetectRiskFlags,
      })
    ).not.toThrow();
  });

  it("extractFacts returns an array", () => {
    expect(Array.isArray(insExtractFacts("Policy number: POL-12345"))).toBe(true);
  });

  it("extractTimeline returns an array", () => {
    expect(Array.isArray(insExtractTimeline("Date of loss: 01/15/2022"))).toBe(true);
  });

  it("detectRiskFlags returns an array", () => {
    expect(Array.isArray(insDetectRiskFlags("multiple claims filed"))).toBe(true);
  });
});

describe("RulePack module interface – healthcare/v1", () => {
  it("passes validateRulePack", () => {
    expect(() =>
      validateRulePack({
        template: "healthcare/v1",
        factRules: hcExtractFacts,
        timelineRules: hcExtractTimeline,
        riskFlags: hcDetectRiskFlags,
      })
    ).not.toThrow();
  });

  it("extractFacts returns an array", () => {
    expect(Array.isArray(hcExtractFacts("Patient: Jane Doe ICD-10: Z00.00"))).toBe(true);
  });

  it("extractTimeline returns an array", () => {
    expect(Array.isArray(hcExtractTimeline("Date of service: 02/14/2023"))).toBe(true);
  });

  it("detectRiskFlags returns an array", () => {
    expect(Array.isArray(hcDetectRiskFlags("experimental treatment"))).toBe(true);
  });
});

describe("RulePack module interface – legal/v1", () => {
  it("passes validateRulePack", () => {
    expect(() =>
      validateRulePack({
        template: "legal/v1",
        factRules: lgExtractFacts,
        timelineRules: lgExtractTimeline,
        riskFlags: lgDetectRiskFlags,
      })
    ).not.toThrow();
  });

  it("extractFacts returns an array", () => {
    expect(
      Array.isArray(lgExtractFacts("Case number: 2023-CV-001 Plaintiff: Alice"))
    ).toBe(true);
  });

  it("extractTimeline returns an array", () => {
    expect(Array.isArray(lgExtractTimeline("Filed on: 01/10/2023"))).toBe(true);
  });

  it("detectRiskFlags returns an array", () => {
    expect(
      Array.isArray(lgDetectRiskFlags("attorney-client privilege asserted"))
    ).toBe(true);
  });
});

describe("RulePack module interface – logistics/v1", () => {
  it("passes validateRulePack", () => {
    expect(() =>
      validateRulePack({
        template: "logistics/v1",
        factRules: lsExtractFacts,
        timelineRules: lsExtractTimeline,
        riskFlags: lsDetectRiskFlags,
      })
    ).not.toThrow();
  });

  it("extractFacts returns an array", () => {
    expect(
      Array.isArray(lsExtractFacts("Load number: LOAD-9001 Origin: Chicago"))
    ).toBe(true);
  });

  it("extractTimeline returns an array", () => {
    expect(Array.isArray(lsExtractTimeline("Pickup date: 04/01/2024"))).toBe(true);
  });

  it("detectRiskFlags returns an array", () => {
    expect(Array.isArray(lsDetectRiskFlags("damaged goods reported"))).toBe(true);
  });
});

describe("RulePack module interface – construction/v1", () => {
  it("passes validateRulePack", () => {
    expect(() =>
      validateRulePack({
        template: "construction/v1",
        factRules: cnExtractFacts,
        timelineRules: cnExtractTimeline,
        riskFlags: cnDetectRiskFlags,
      })
    ).not.toThrow();
  });

  it("extractFacts returns an array", () => {
    expect(
      Array.isArray(cnExtractFacts("Project ID: PROJ-001 RFI #1 contractor: Acme"))
    ).toBe(true);
  });

  it("extractTimeline returns an array", () => {
    expect(
      Array.isArray(cnExtractTimeline("RFI submitted: 06/01/2024"))
    ).toBe(true);
  });

  it("detectRiskFlags returns an array", () => {
    expect(
      Array.isArray(cnDetectRiskFlags("Project ID: PROJ-001 RFI #1 contractor: Acme delayed."))
    ).toBe(true);
  });
});
