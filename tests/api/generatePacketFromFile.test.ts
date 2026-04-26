import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { generatePacketFromFile } from "../../src/api/packet";
import type { UploadedFile } from "express-fileupload";

// Mock extractTextFromPdf so we don't depend on a real PDF parser.
vi.mock("../../src/extraction/extractText", () => ({
  extractTextFromPdf: async (_data: Buffer) => "extracted pdf text from file",
}));

function makeUploadedFile(
  content: string | Buffer,
  mimetype: string,
  name = "test.txt"
): UploadedFile {
  const data =
    typeof content === "string" ? Buffer.from(content, "utf8") : content;
  return {
    name,
    data,
    size: data.length,
    mimetype,
    encoding: "utf8",
    tempFilePath: "",
    truncated: false,
    md5: "",
    mv: async () => {},
  } as unknown as UploadedFile;
}

let tmpDir: string;
let originalCwd: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "packetor-file-api-test-")
  );
  originalCwd = process.cwd();
  process.chdir(tmpDir);
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("generatePacketFromFile()", () => {
  it("returns a string", async () => {
    const file = makeUploadedFile("Hello from file.", "text/plain");
    const result = await generatePacketFromFile(file);
    expect(typeof result).toBe("string");
  });

  it("output contains the original file name", async () => {
    const file = makeUploadedFile("content", "text/plain", "invoice.txt");
    const result = await generatePacketFromFile(file);
    expect(result).toContain("invoice.txt");
  });

  it("output includes the Summary section", async () => {
    const file = makeUploadedFile("Some document text.", "text/plain");
    const result = await generatePacketFromFile(file);
    expect(result).toContain("## Summary");
  });

  it("output includes the Key Facts section", async () => {
    const file = makeUploadedFile("Content here.", "text/plain");
    const result = await generatePacketFromFile(file);
    expect(result).toContain("## Key Facts");
  });

  it("output includes the Timeline section", async () => {
    const file = makeUploadedFile("Content here.", "text/plain");
    const result = await generatePacketFromFile(file);
    expect(result).toContain("## Timeline");
  });

  it("is deterministic for identical plain-text file contents", async () => {
    const file1 = makeUploadedFile("Stable content.", "text/plain", "a.txt");
    const file2 = makeUploadedFile("Stable content.", "text/plain", "a.txt");
    expect(await generatePacketFromFile(file1)).toBe(
      await generatePacketFromFile(file2)
    );
  });

  it("produces different output for different file contents", async () => {
    const fileA = makeUploadedFile("Document alpha.", "text/plain", "a.txt");
    const fileB = makeUploadedFile("Document beta.", "text/plain", "b.txt");
    const a = await generatePacketFromFile(fileA);
    const b = await generatePacketFromFile(fileB);
    expect(a).not.toBe(b);
  });

  it("handles a PDF file via the mocked extractor", async () => {
    const file = makeUploadedFile(
      Buffer.from([0x25, 0x50, 0x44, 0x46]),
      "application/pdf",
      "report.pdf"
    );
    const result = await generatePacketFromFile(file);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("writes a governance log entry when a tenant is specified", async () => {
    const file = makeUploadedFile("Logged file content.", "text/plain");
    await generatePacketFromFile(file, undefined, "default");
    const logFile = path.join(
      tmpDir,
      "tenants",
      "default",
      "logs",
      "packets.jsonl"
    );
    expect(fs.existsSync(logFile)).toBe(true);
  });

  it("includes the file name (not 'text-input') in the governance log", async () => {
    const file = makeUploadedFile("content", "text/plain", "myreport.txt");
    await generatePacketFromFile(file, undefined, "default");
    const logFile = path.join(
      tmpDir,
      "tenants",
      "default",
      "logs",
      "packets.jsonl"
    );
    const line = JSON.parse(
      fs.readFileSync(logFile, "utf8").trim().split("\n")[0]
    ) as { sourceName: string };
    expect(line.sourceName).toBe("myreport.txt");
  });
});
