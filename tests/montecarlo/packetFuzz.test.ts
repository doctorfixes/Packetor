import { describe, it, expect } from "vitest";
import { summarize } from "../../src/structuring/summarize";
import { extractFacts } from "../../src/structuring/extractFacts";

function randomText(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789 ";
  return Array.from({ length: 200 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

describe("Packet Monte Carlo Fuzzing", () => {
  it("summarize() never throws on random input", () => {
    for (let i = 0; i < 200; i++) {
      const text = randomText();
      expect(() => summarize(text)).not.toThrow();
    }
  });

  it("extractFacts() never throws on random input", () => {
    for (let i = 0; i < 200; i++) {
      const text = randomText();
      expect(() => extractFacts(text)).not.toThrow();
    }
  });

  it("summarize() always returns a string on random input", () => {
    for (let i = 0; i < 200; i++) {
      const result = summarize(randomText());
      expect(typeof result).toBe("string");
    }
  });

  it("extractFacts() always returns an array on random input", () => {
    for (let i = 0; i < 200; i++) {
      const result = extractFacts(randomText());
      expect(Array.isArray(result)).toBe(true);
    }
  });
});
