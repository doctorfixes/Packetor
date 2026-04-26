import { describe, it, expect } from "vitest";
import { structurePacket } from "../../src/structuring/structurePacket";

describe("structurePacket()", () => {
  it("assembles a packet with the expected shape", () => {
    const packet = structurePacket("Some raw text.", "doc.txt");
    expect(typeof packet.summary).toBe("string");
    expect(Array.isArray(packet.facts)).toBe(true);
    expect(Array.isArray(packet.timeline)).toBe(true);
    expect(Array.isArray(packet.riskFlags)).toBe(true);
    expect(packet.rawText).toBe("Some raw text.");
    expect(packet.sourceName).toBe("doc.txt");
  });

  it("summary is derived from the raw text", () => {
    const packet = structurePacket("Hello world.", "test.txt");
    expect(packet.summary).toBe("Hello world.");
  });

  it("is deterministic for identical inputs", () => {
    const a = structurePacket("Deterministic input.", "a.txt");
    const b = structurePacket("Deterministic input.", "a.txt");
    expect(a.summary).toBe(b.summary);
    expect(a.facts).toEqual(b.facts);
    expect(a.timeline).toEqual(b.timeline);
  });

  it("returns empty riskFlags by default", () => {
    const packet = structurePacket("text", "file.txt");
    expect(packet.riskFlags).toEqual([]);
  });
});
