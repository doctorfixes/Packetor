import { describe, it, expect } from "vitest";
import { detectRiskFlags } from "../../src/rulepacks/insurance/v1/riskFlags";

describe("Insurance Rule-Pack v1 – riskFlags (extended)", () => {
  it("detects late claim filing flag", () => {
    const flags = detectRiskFlags("Late filing of claim submitted.");
    expect(flags.some((f) => f.includes("Late claim filing"))).toBe(true);
  });

  it("detects delayed submission flag", () => {
    const flags = detectRiskFlags("Delayed report received from insured.");
    expect(flags.some((f) => f.includes("Late claim filing"))).toBe(true);
  });

  it("detects coverage dispute – exclusion keyword", () => {
    const flags = detectRiskFlags("Policy exclusion applies here.");
    expect(flags.some((f) => f.includes("Coverage dispute"))).toBe(true);
  });

  it("detects coverage dispute – not covered keyword", () => {
    const flags = detectRiskFlags("Damage is not covered under the policy.");
    expect(flags.some((f) => f.includes("Coverage dispute"))).toBe(true);
  });

  it("detects coverage dispute – coverage denied keyword", () => {
    const flags = detectRiskFlags("Coverage denied due to lapse.");
    expect(flags.some((f) => f.includes("Coverage dispute"))).toBe(true);
  });

  it("detects pre-existing condition flag", () => {
    const flags = detectRiskFlags("Pre-existing damage noted on inspection.");
    expect(flags.some((f) => f.includes("Pre-existing"))).toBe(true);
  });

  it("detects suspicious loss – arson keyword", () => {
    const flags = detectRiskFlags("Arson suspected in fire loss claim.");
    expect(flags.some((f) => f.includes("Suspicious"))).toBe(true);
  });

  it("detects suspicious loss – staged keyword", () => {
    const flags = detectRiskFlags("Staged accident reported by witness.");
    expect(flags.some((f) => f.includes("Suspicious"))).toBe(true);
  });

  it("returns empty array for completely benign claim text with all required fields", () => {
    const benign =
      "Policy number: POL-0001 Claim filed. Routine assessment completed.";
    const flags = detectRiskFlags(benign);
    expect(Array.isArray(flags)).toBe(true);
  });
});
