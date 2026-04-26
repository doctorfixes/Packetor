import { describe, it, expect, vi, beforeEach } from "vitest";
import { ingestFile } from "../../src/ingestion/fileIngest";
import type { UploadedFile } from "express-fileupload";

// Mock the extraction module so tests don't depend on a real PDF parser.
vi.mock("../../src/extraction/extractText", () => ({
  extractTextFromPdf: async (_data: Buffer) => "extracted pdf text",
}));

// Minimal helper to create a fake UploadedFile object.
function makeFile(
  content: string | Buffer,
  mimetype: string,
  name = "test-file"
): UploadedFile {
  const data = typeof content === "string" ? Buffer.from(content, "utf8") : content;
  return {
    name,
    data,
    size: data.length,
    encoding: "utf8",
    tempFilePath: "",
    truncated: false,
    mimetype,
    md5: "",
    mv: async () => {},
  } as unknown as UploadedFile;
}

describe("ingestFile()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the text content for a plain-text file", async () => {
    const file = makeFile("Hello plain text", "text/plain");
    const result = await ingestFile(file);
    expect(result).toBe("Hello plain text");
  });

  it("falls back to UTF-8 decode for an unknown mimetype", async () => {
    const file = makeFile("arbitrary data", "application/octet-stream");
    const result = await ingestFile(file);
    expect(result).toBe("arbitrary data");
  });

  it("returns the OCR stub for image/png mimetype", async () => {
    const file = makeFile(Buffer.alloc(10), "image/png");
    const result = await ingestFile(file);
    expect(result).toContain("OCR extraction is not yet implemented");
  });

  it("returns the OCR stub for image/jpeg mimetype", async () => {
    const file = makeFile(Buffer.alloc(10), "image/jpeg");
    const result = await ingestFile(file);
    expect(result).toContain("OCR extraction is not yet implemented");
  });

  it("returns the OCR stub for image/jpg mimetype", async () => {
    const file = makeFile(Buffer.alloc(10), "image/jpg");
    const result = await ingestFile(file);
    expect(result).toContain("OCR extraction is not yet implemented");
  });

  it("returns the OCR stub for image/webp mimetype", async () => {
    const file = makeFile(Buffer.alloc(10), "image/webp");
    const result = await ingestFile(file);
    expect(result).toContain("OCR extraction is not yet implemented");
  });

  it("returns a string for PDF mimetype using the mocked extractor", async () => {
    const file = makeFile(Buffer.alloc(8), "application/pdf");
    const result = await ingestFile(file);
    expect(typeof result).toBe("string");
  });

  it("handles uppercase mimetype by lowercasing before matching", async () => {
    const file = makeFile("content", "TEXT/PLAIN");
    const result = await ingestFile(file);
    // TEXT/PLAIN lowercased → text/plain (no special handler), falls back to UTF-8
    expect(result).toBe("content");
  });
});
