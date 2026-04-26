import { describe, it, expect } from "vitest";
import { enforceStrictMode } from "../../src/governance/enforce";

describe("enforceStrictMode()", () => {
  it("passes a valid packet without throwing", () => {
    expect(() =>
      enforceStrictMode({ summary: "ok", facts: [], timeline: [] })
    ).not.toThrow();
  });

  it("returns true for a valid packet", () => {
    expect(enforceStrictMode({ summary: "ok", facts: [], timeline: [] })).toBe(true);
  });

  it("throws when summary is null", () => {
    expect(() =>
      enforceStrictMode({ summary: null, facts: [], timeline: [] })
    ).toThrow();
  });

  it("throws when summary is an empty string", () => {
    expect(() =>
      enforceStrictMode({ summary: "", facts: [], timeline: [] })
    ).toThrow();
  });

  it("throws when facts is not an array", () => {
    expect(() =>
      enforceStrictMode({ summary: "ok", facts: null, timeline: [] })
    ).toThrow();
  });

  it("throws when timeline is not an array", () => {
    expect(() =>
      enforceStrictMode({ summary: "ok", facts: [], timeline: null })
    ).toThrow();
  });
});
