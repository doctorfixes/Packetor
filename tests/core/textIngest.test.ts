import { describe, it, expect } from "vitest";
import { ingestText } from "../../src/ingestion/textIngest";

describe("ingestText()", () => {
  it("returns an empty string for empty input", () => {
    expect(ingestText("")).toBe("");
  });

  it("returns an empty string for whitespace-only input", () => {
    expect(ingestText("   \n   ")).toBe("");
  });

  it("preserves a single paragraph unchanged (trimmed)", () => {
    expect(ingestText("Hello world")).toBe("Hello world");
  });

  it("trims leading and trailing whitespace from each paragraph", () => {
    expect(ingestText("  Hello  ")).toBe("Hello");
  });

  it("collapses multiple spaces within a paragraph into one", () => {
    expect(ingestText("too   many    spaces")).toBe("too many spaces");
  });

  it("collapses tabs and newlines within a paragraph into a single space", () => {
    expect(ingestText("line one\nline two")).toBe("line one line two");
  });

  it("preserves two-paragraph structure separated by a blank line", () => {
    const result = ingestText("First paragraph.\n\nSecond paragraph.");
    expect(result).toBe("First paragraph.\n\nSecond paragraph.");
  });

  it("preserves multi-paragraph structure", () => {
    const input = "Para one.\n\nPara two.\n\nPara three.";
    const result = ingestText(input);
    const parts = result.split("\n\n");
    expect(parts).toHaveLength(3);
    expect(parts[0]).toBe("Para one.");
    expect(parts[1]).toBe("Para two.");
    expect(parts[2]).toBe("Para three.");
  });

  it("drops whitespace-only paragraphs between real paragraphs", () => {
    const result = ingestText("First.\n\n   \n\nSecond.");
    expect(result).toBe("First.\n\nSecond.");
  });

  it("normalizes whitespace inside each paragraph while keeping paragraph breaks", () => {
    const result = ingestText("  Hello   world  \n\n  Foo   bar  ");
    expect(result).toBe("Hello world\n\nFoo bar");
  });

  it("is deterministic for the same input", () => {
    const text = "Some   text\n\nSecond   paragraph.";
    expect(ingestText(text)).toBe(ingestText(text));
  });
});
