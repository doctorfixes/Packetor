import { describe, it, expect } from "vitest";
import { enforceStrictMode } from "../../src/governance/enforce";

describe("enforceStrictMode() – extended edge cases", () => {
  it("throws when summary is a number (non-string)", () => {
    expect(() =>
      enforceStrictMode({ summary: 42 as unknown as string, facts: [], timeline: [] })
    ).toThrow();
  });

  it("throws when summary is an object", () => {
    expect(() =>
      enforceStrictMode({ summary: {} as unknown as string, facts: [], timeline: [] })
    ).toThrow();
  });

  it("throws when summary is undefined", () => {
    expect(() =>
      enforceStrictMode({
        summary: undefined as unknown as string,
        facts: [],
        timeline: [],
      })
    ).toThrow();
  });

  it("throws when facts is an object (not array)", () => {
    expect(() =>
      enforceStrictMode({
        summary: "ok",
        facts: {} as unknown as unknown[],
        timeline: [],
      })
    ).toThrow();
  });

  it("throws when timeline is an object (not array)", () => {
    expect(() =>
      enforceStrictMode({
        summary: "ok",
        facts: [],
        timeline: {} as unknown as unknown[],
      })
    ).toThrow();
  });

  it("accepts non-empty arrays for facts and timeline", () => {
    expect(() =>
      enforceStrictMode({
        summary: "valid",
        facts: [{ label: "Date", value: "01/01/2024" }],
        timeline: [{ date: "01/01/2024", event: "Event occurred." }],
      })
    ).not.toThrow();
  });
});
