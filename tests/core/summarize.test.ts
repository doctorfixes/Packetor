import { describe, it, expect } from "vitest";
import { summarize } from "../../src/structuring/summarize";

describe("summarize()", () => {
  it("produces deterministic summary", () => {
    const text = "Hello world";
    const s1 = summarize(text);
    const s2 = summarize(text);
    expect(s1).toBe(s2);
  });

  it("returns no-content message for empty string", () => {
    expect(summarize("")).toBe("(No content to summarize.)");
  });

  it("returns no-content message for whitespace-only string", () => {
    expect(summarize("   ")).toBe("(No content to summarize.)");
  });

  it("returns first paragraph when multiple paragraphs present", () => {
    const text = "First paragraph.\n\nSecond paragraph.";
    expect(summarize(text)).toBe("First paragraph.");
  });

  it("truncates text longer than 300 characters", () => {
    const text = "a".repeat(350);
    const result = summarize(text);
    // slice(0, 297) + '…' = 297 chars + 1 char = 298 chars total
    expect(result.length).toBe(298);
    expect(result.endsWith("…")).toBe(true);
  });

  it("does not truncate text of exactly 300 characters", () => {
    const text = "a".repeat(300);
    const result = summarize(text);
    expect(result).toBe(text);
  });
});
