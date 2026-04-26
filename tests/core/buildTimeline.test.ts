import { describe, it, expect } from "vitest";
import { buildTimeline, TimelineEntry } from "../../src/structuring/buildTimeline";

describe("buildTimeline()", () => {
  it("returns empty array when no dated events found", () => {
    expect(buildTimeline("no dates here")).toEqual([]);
  });

  it("extracts dated events from text", () => {
    const text = "Accident occurred on 01/15/2020. Then filed on 03/10/2021.";
    const timeline = buildTimeline(text);
    expect(timeline.length).toBeGreaterThan(0);
  });

  it("each entry has date and event string fields", () => {
    const text = "Inspection on 06/01/2022. Report filed June 2, 2023.";
    const timeline = buildTimeline(text);
    for (const entry of timeline) {
      expect(typeof (entry as TimelineEntry).date).toBe("string");
      expect(typeof (entry as TimelineEntry).event).toBe("string");
    }
  });

  it("is deterministic for the same input", () => {
    const text = "Event on 01/01/2020 occurred here. Another on 05/05/2021.";
    expect(buildTimeline(text)).toEqual(buildTimeline(text));
  });

  it("deduplicates identical date-event pairs", () => {
    const text = "Event on 01/01/2020 occurred. Event on 01/01/2020 occurred.";
    const timeline = buildTimeline(text);
    const keys = timeline.map((e) => `${e.date}|${e.event}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
