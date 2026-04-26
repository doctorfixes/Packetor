import { describe, it, expect } from "vitest";
import { detectRiskFlags } from "../../src/rulepacks/legal/v1/riskFlags";

describe("Legal Rule-Pack v1 – riskFlags (extended)", () => {
  it("flags case number absent when missing", () => {
    const flags = detectRiskFlags("Plaintiff: John Smith Defendant: ACME court stated.");
    expect(flags.some((f) => f.includes("Case number"))).toBe(true);
  });

  it("does not flag case number absent when present", () => {
    const flags = detectRiskFlags(
      "Case number: 2023-CV-001 Plaintiff: John court."
    );
    expect(flags.some((f) => f.includes("Case number"))).toBe(false);
  });

  it("flags parties not identified when both plaintiff and defendant absent", () => {
    const flags = detectRiskFlags("Case number: 2023-CV-001 court filed.");
    expect(flags.some((f) => f.includes("Parties"))).toBe(true);
  });

  it("does not flag parties when plaintiff is present", () => {
    const flags = detectRiskFlags(
      "Case number: 2023-CV-001 Plaintiff: Alice court."
    );
    expect(flags.some((f) => f.includes("Parties"))).toBe(false);
  });

  it("flags court not specified when court keyword absent", () => {
    const flags = detectRiskFlags(
      "Case number: 2023-CV-001 Plaintiff: Alice Defendant: Bob"
    );
    expect(flags.some((f) => f.includes("Court"))).toBe(true);
  });

  it("does not flag court when court keyword present", () => {
    const flags = detectRiskFlags(
      "Case number: 2023-CV-001 Plaintiff: Alice court presided."
    );
    expect(flags.some((f) => f.includes("Court"))).toBe(false);
  });

  it("detects contempt flag", () => {
    const flags = detectRiskFlags(
      "Case number: X plaintiff defendant court — held in contempt."
    );
    expect(flags.some((f) => f.includes("Contempt"))).toBe(true);
  });

  it("detects sanction flag", () => {
    const flags = detectRiskFlags(
      "Case number: X plaintiff defendant court — sanctions imposed."
    );
    expect(flags.some((f) => f.includes("Contempt"))).toBe(true);
  });

  it("detects spoliation risk flag", () => {
    const flags = detectRiskFlags(
      "Case number: X plaintiff defendant court — spoliation of evidence alleged."
    );
    expect(flags.some((f) => f.includes("Spoliation"))).toBe(true);
  });

  it("detects destruction of evidence flag", () => {
    const flags = detectRiskFlags(
      "Case number: X plaintiff defendant court — destruction of evidence found."
    );
    expect(flags.some((f) => f.includes("Spoliation"))).toBe(true);
  });
});
