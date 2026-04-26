import { describe, it, expect } from "vitest";
import { extractTextFromOcr } from "../../src/extraction/ocr";

describe("extractTextFromOcr()", () => {
  it("returns a string without throwing", async () => {
    const result = await extractTextFromOcr(Buffer.alloc(0));
    expect(typeof result).toBe("string");
  });

  it("returns the expected placeholder message for a non-empty buffer", async () => {
    const result = await extractTextFromOcr(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    expect(result).toContain("OCR extraction is not yet implemented");
  });

  it("returns the same value for an empty buffer", async () => {
    const result = await extractTextFromOcr(Buffer.alloc(0));
    expect(result).toContain("OCR extraction is not yet implemented");
  });

  it("is deterministic – same input always returns the same result", async () => {
    const buf = Buffer.from("image-data");
    const a = await extractTextFromOcr(buf);
    const b = await extractTextFromOcr(buf);
    expect(a).toBe(b);
  });
});
