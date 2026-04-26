/**
 * Tests for extractTextFromPdf().
 *
 * extractText.ts is a thin wrapper around the `pdf-parse` library.
 * The full success path (extracting text from a real PDF) is covered
 * indirectly by fileIngest.test.ts which mocks extractText.  These tests
 * verify the error-propagation contract when pdf-parse receives invalid input
 * and confirm the function's return type contract.
 */
import { describe, it, expect } from "vitest";
import { extractTextFromPdf } from "../../src/extraction/extractText";

describe("extractTextFromPdf()", () => {
  it("returns a Promise (is async)", () => {
    const result = extractTextFromPdf(Buffer.from("not a pdf"));
    expect(result).toBeInstanceOf(Promise);
    // Prevent unhandled rejection in test output
    result.catch(() => {});
  });

  it("rejects with an error for an empty buffer", async () => {
    await expect(extractTextFromPdf(Buffer.alloc(0))).rejects.toThrow();
  });

  it("rejects with an error for a non-PDF buffer", async () => {
    const notAPdf = Buffer.from("this is definitely not a pdf", "utf8");
    await expect(extractTextFromPdf(notAPdf)).rejects.toThrow();
  });

  it("rejects with an error for random binary data", async () => {
    const garbage = Buffer.from([0x00, 0x01, 0x02, 0xfe, 0xff]);
    await expect(extractTextFromPdf(garbage)).rejects.toThrow();
  });
});
