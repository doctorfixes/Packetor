import { describe, it, expect } from "vitest";
import { validateRulePack } from "../../src/rulepacks/validate";

describe("validateRulePack()", () => {
  const valid = {
    template: "insurance/v1",
    factRules: () => [],
    timelineRules: () => [],
    riskFlags: () => [],
  };

  it("accepts a fully valid rule-pack", () => {
    expect(() => validateRulePack(valid)).not.toThrow();
  });

  it("returns true for a valid rule-pack", () => {
    expect(validateRulePack(valid)).toBe(true);
  });

  it("throws when template is missing", () => {
    expect(() =>
      validateRulePack({ ...valid, template: undefined })
    ).toThrow("Rule-pack missing template");
  });

  it("throws when factRules is missing", () => {
    expect(() =>
      validateRulePack({ ...valid, factRules: undefined })
    ).toThrow("Rule-pack missing factRules");
  });

  it("throws when timelineRules is missing", () => {
    expect(() =>
      validateRulePack({ ...valid, timelineRules: undefined })
    ).toThrow("Rule-pack missing timelineRules");
  });

  it("throws when riskFlags is missing", () => {
    expect(() =>
      validateRulePack({ ...valid, riskFlags: undefined })
    ).toThrow("Rule-pack missing riskFlags");
  });
});
