import { describe, it, expect } from "vitest";
import { detectRiskFlags } from "../../src/rulepacks/healthcare/v1/riskFlags";

describe("Healthcare Rule-Pack v1 – riskFlags (extended)", () => {
  it("flags missing CPT code when CPT is absent", () => {
    const flags = detectRiskFlags("ICD-10: Z00.00 Medically necessary Prior auth approved.");
    expect(flags.some((f) => f.includes("CPT"))).toBe(true);
  });

  it("does not flag missing CPT when CPT is present", () => {
    const flags = detectRiskFlags(
      "ICD-10: Z00.00 CPT: 99213 Medically necessary Prior auth approved."
    );
    expect(flags.some((f) => f.includes("CPT"))).toBe(false);
  });

  it("flags prior authorization absent when keyword missing", () => {
    const flags = detectRiskFlags("ICD-10: Z00.00 CPT: 99213 Medically necessary.");
    expect(flags.some((f) => f.includes("Prior authorization"))).toBe(true);
  });

  it("does not flag prior authorization when present", () => {
    const flags = detectRiskFlags(
      "ICD-10: Z00.00 CPT: 99213 Medically necessary. Prior auth approved."
    );
    expect(flags.some((f) => f.includes("Prior authorization"))).toBe(false);
  });

  it("flags medical necessity absent when statement missing", () => {
    const flags = detectRiskFlags(
      "ICD-10: Z00.00 CPT: 99213 Prior auth approved."
    );
    expect(flags.some((f) => f.includes("Medical necessity"))).toBe(true);
  });

  it("does not flag medical necessity when 'medically necessary' is present", () => {
    const flags = detectRiskFlags(
      "ICD-10: Z00.00 CPT: 99213 Medically necessary. Prior auth approved."
    );
    expect(flags.some((f) => f.includes("Medical necessity"))).toBe(false);
  });

  it("flags missing ICD-10 when absent", () => {
    const flags = detectRiskFlags(
      "CPT: 99213 Medically necessary. Prior auth approved."
    );
    expect(flags.some((f) => f.includes("ICD-10"))).toBe(true);
  });

  it("raises no flags when all required fields are present and no warnings", () => {
    const text =
      "ICD-10: Z00.00 CPT: 99213 Medically necessary. Prior auth approved.";
    const flags = detectRiskFlags(text);
    // All four absence checks should be satisfied
    expect(flags.some((f) => f.includes("ICD-10"))).toBe(false);
    expect(flags.some((f) => f.includes("CPT"))).toBe(false);
    expect(flags.some((f) => f.includes("Prior authorization"))).toBe(false);
    expect(flags.some((f) => f.includes("Medical necessity"))).toBe(false);
  });
});
