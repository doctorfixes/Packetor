import { describe, it, expect } from "vitest";
import { extractFacts } from "../../src/structuring/extractFacts";

describe("extractFacts() – extended edge cases", () => {
  it("extracts a Reference fact", () => {
    const facts = extractFacts("Reference: REF-7890");
    const found = facts.find((f) => f.label === "Reference");
    expect(found).toBeDefined();
    expect(found?.value).toContain("REF-7890");
  });

  it("extracts a case-number reference (case: CASE-123)", () => {
    const facts = extractFacts("Case: CASE-1234");
    const found = facts.find((f) => f.label === "Reference");
    expect(found).toBeDefined();
  });

  it("extracts a Name fact", () => {
    const facts = extractFacts("Name: Alice Johnson");
    const found = facts.find((f) => f.label === "Name");
    expect(found).toBeDefined();
    expect(found?.value).toContain("Alice");
  });

  it("extracts client name", () => {
    const facts = extractFacts("Client: Bob Smith");
    const found = facts.find((f) => f.label === "Name");
    expect(found).toBeDefined();
    expect(found?.value).toContain("Bob");
  });

  it("does not duplicate a fact when the same pattern matches twice", () => {
    const text = "Policy #: POL-9999 and also Policy #: POL-9999";
    const facts = extractFacts(text);
    const policyFacts = facts.filter((f) => f.label === "Policy");
    expect(policyFacts.length).toBe(1);
  });

  it("extracts multiple distinct fact labels from rich text", () => {
    const text =
      "Date: 01/15/2023 Name: Carol Davis Amount: $1,200.00 Policy #: POL-5678";
    const facts = extractFacts(text);
    const labels = facts.map((f) => f.label);
    expect(labels).toContain("Date");
    expect(labels).toContain("Name");
    expect(labels).toContain("Amount");
    expect(labels).toContain("Policy");
  });
});
