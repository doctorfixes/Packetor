import { describe, it, expect } from "vitest";
import { extractFacts, Fact } from "../../src/structuring/extractFacts";

describe("extractFacts()", () => {
  it("returns empty array when no patterns match", () => {
    expect(extractFacts("absolutely nothing matches this sentence")).toEqual([]);
  });

  it("extracts a date fact", () => {
    const facts = extractFacts("Date: 01/15/2020");
    const found = facts.find((f: Fact) => f.label === "Date");
    expect(found).toBeDefined();
    expect(found?.value).toContain("01/15/2020");
  });

  it("extracts a policy number", () => {
    const facts = extractFacts("Policy #: POL-1234");
    const found = facts.find((f: Fact) => f.label === "Policy");
    expect(found).toBeDefined();
    expect(found?.value).toContain("POL-1234");
  });

  it("extracts a dollar amount", () => {
    const facts = extractFacts("Total amount: $5,000.00");
    const found = facts.find((f: Fact) => f.label === "Amount");
    expect(found).toBeDefined();
    expect(found?.value).toContain("5,000.00");
  });

  it("is deterministic for the same input", () => {
    const text = "Name: John Smith, Policy #: ABC-9876";
    expect(extractFacts(text)).toEqual(extractFacts(text));
  });

  it("each returned fact has label and value strings", () => {
    const facts = extractFacts("Name: Jane Doe");
    for (const fact of facts) {
      expect(typeof fact.label).toBe("string");
      expect(typeof fact.value).toBe("string");
    }
  });
});
