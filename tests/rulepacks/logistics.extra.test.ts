import { describe, it, expect } from "vitest";
import { detectRiskFlags } from "../../src/rulepacks/logistics/v1/riskFlags";

describe("Logistics Rule-Pack v1 – riskFlags (extended)", () => {
  it("flags carrier absent when carrier not mentioned", () => {
    const flags = detectRiskFlags(
      "Bill of lading: BOL-001 Origin: Chicago Destination: Dallas."
    );
    expect(flags.some((f) => f.includes("Carrier"))).toBe(true);
  });

  it("does not flag carrier when carrier is mentioned", () => {
    const flags = detectRiskFlags(
      "Bill of lading: BOL-001 Carrier: FastFreight Origin: Chicago Destination: Dallas."
    );
    expect(flags.some((f) => f.includes("Carrier identification"))).toBe(false);
  });

  it("flags origin or destination absent when both are missing", () => {
    const flags = detectRiskFlags(
      "Bill of lading: BOL-001 Carrier: FastFreight weight 100 lbs."
    );
    expect(flags.some((f) => f.includes("Origin or destination"))).toBe(true);
  });

  it("does not flag origin/destination when origin is present", () => {
    const flags = detectRiskFlags(
      "Bill of lading: BOL-001 Carrier: FastFreight Origin: Chicago."
    );
    expect(flags.some((f) => f.includes("Origin or destination"))).toBe(false);
  });

  it("flags bill of lading absent when not mentioned", () => {
    const flags = detectRiskFlags(
      "Carrier: FastFreight Origin: Chicago Destination: Dallas."
    );
    expect(flags.some((f) => f.includes("Bill of Lading"))).toBe(true);
  });

  it("detects carrier compliance issue – violation keyword", () => {
    const flags = detectRiskFlags(
      "Bill of lading: BOL-001 Carrier: X Origin: A Destination: B carrier violation noted."
    );
    expect(flags.some((f) => f.includes("compliance"))).toBe(true);
  });

  it("detects carrier compliance issue – FMCSA keyword", () => {
    const flags = detectRiskFlags(
      "Bill of lading: BOL-001 Carrier: X Origin: A Destination: B FMCSA audit triggered."
    );
    expect(flags.some((f) => f.includes("compliance"))).toBe(true);
  });

  it("detects damaged goods flag for 'damage' keyword", () => {
    const flags = detectRiskFlags(
      "Bill of lading: BOL-001 Carrier: X Origin: A Destination: B — shipment sustained damage."
    );
    expect(flags.some((f) => f.includes("Damaged goods"))).toBe(true);
  });
});
