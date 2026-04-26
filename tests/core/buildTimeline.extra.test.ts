import { describe, it, expect } from "vitest";
import { buildTimeline } from "../../src/structuring/buildTimeline";

describe("buildTimeline() – extended edge cases", () => {
  it("parses month-name date format ('January 15, 2023')", () => {
    const text = "January 15, 2023 — The contract was signed.";
    const timeline = buildTimeline(text);
    expect(timeline.length).toBeGreaterThan(0);
    expect(timeline.some((e) => e.date.includes("January"))).toBe(true);
  });

  it("parses abbreviated month name ('Jan 15, 2023')", () => {
    const text = "Jan 15, 2023 inspection completed at the site.";
    const timeline = buildTimeline(text);
    expect(timeline.length).toBeGreaterThan(0);
  });

  it("handles multiple dated events in a single line", () => {
    const text =
      "On 01/01/2022 project started. On 12/31/2022 project completed.";
    const timeline = buildTimeline(text);
    expect(timeline.length).toBeGreaterThanOrEqual(1);
  });

  it("returns entries with non-empty date strings", () => {
    const text = "Event occurred on 05/15/2021. Meeting held June 3, 2022.";
    const timeline = buildTimeline(text);
    for (const entry of timeline) {
      expect(entry.date.length).toBeGreaterThan(0);
    }
  });

  it("returns entries with non-empty event strings", () => {
    const text = "Report filed on 03/10/2020. Inspection on 04/01/2020.";
    const timeline = buildTimeline(text);
    for (const entry of timeline) {
      expect(entry.event.length).toBeGreaterThan(0);
    }
  });

  it("handles an empty string without throwing", () => {
    expect(() => buildTimeline("")).not.toThrow();
    expect(buildTimeline("")).toEqual([]);
  });

  it("handles text with only dates but no descriptive context gracefully", () => {
    // Very short context after the date will likely not match the 10-char min event requirement.
    expect(() => buildTimeline("01/01/2020")).not.toThrow();
  });
});
