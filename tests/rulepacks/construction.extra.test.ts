import { describe, it, expect } from "vitest";
import { detectRiskFlags } from "../../src/rulepacks/construction/v1/riskFlags";

describe("Construction Rule-Pack v1 – riskFlags (extended)", () => {
  it("flags RFI reference absent when RFI not mentioned", () => {
    const flags = detectRiskFlags(
      "Project ID: PROJ-001 contractor: Acme Construction schedule update."
    );
    expect(flags.some((f) => f.includes("RFI"))).toBe(true);
  });

  it("does not flag RFI absent when RFI is present", () => {
    const flags = detectRiskFlags(
      "Project ID: PROJ-001 RFI #1 contractor: Acme."
    );
    expect(flags.some((f) => f.includes("RFI reference absent"))).toBe(false);
  });

  it("flags project ID absent when project ID not mentioned", () => {
    const flags = detectRiskFlags(
      "RFI #1 contractor: Acme Construction schedule update."
    );
    expect(flags.some((f) => f.includes("Project ID absent"))).toBe(true);
  });

  it("flags contractor absent when contractor not mentioned", () => {
    const flags = detectRiskFlags(
      "Project ID: PROJ-001 RFI #42 work order noted."
    );
    expect(flags.some((f) => f.includes("Contractor"))).toBe(true);
  });

  it("detects deficiency or non-conformance flag", () => {
    const flags = detectRiskFlags(
      "Project ID: PROJ-001 RFI #1 contractor: Acme deficiency noted in work."
    );
    expect(flags.some((f) => f.includes("Deficiency"))).toBe(true);
  });

  it("detects non-conformance keyword", () => {
    const flags = detectRiskFlags(
      "Project ID: PROJ-001 RFI #1 contractor: Acme non-conformance report filed."
    );
    expect(flags.some((f) => f.includes("Deficiency"))).toBe(true);
  });

  it("detects change order dispute flag", () => {
    const flags = detectRiskFlags(
      "Project ID: PROJ-001 RFI #1 contractor: Acme disputed change order submitted."
    );
    expect(flags.some((f) => f.includes("Change order dispute"))).toBe(true);
  });

  it("raises no safety flag for normal project text", () => {
    const flags = detectRiskFlags(
      "Project ID: PROJ-001 RFI #1 contractor: Acme routine progress report."
    );
    expect(flags.some((f) => f.includes("Safety"))).toBe(false);
  });
});
