import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { generatePacketFromText, ENGINE_VERSION, TEMPLATE_VERSION } from "../../src/api/packet";

let tmpDir: string;
let originalCwd: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "packetor-api-test-"));
  originalCwd = process.cwd();
  process.chdir(tmpDir);
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("generatePacketFromText()", () => {
  it("returns a string", async () => {
    const result = await generatePacketFromText("Hello world.");
    expect(typeof result).toBe("string");
  });

  it("output contains the default source name 'text-input'", async () => {
    const result = await generatePacketFromText("Hello world.");
    expect(result).toContain("text-input");
  });

  it("output contains the summary section", async () => {
    const result = await generatePacketFromText("Hello world.");
    expect(result).toContain("## Summary");
  });

  it("output contains the Key Facts section", async () => {
    const result = await generatePacketFromText("Hello world.");
    expect(result).toContain("## Key Facts");
  });

  it("output contains the Timeline section", async () => {
    const result = await generatePacketFromText("Hello world.");
    expect(result).toContain("## Timeline");
  });

  it("is deterministic for identical inputs with no rulepack", async () => {
    const text = "Stable deterministic text.";
    const a = await generatePacketFromText(text);
    const b = await generatePacketFromText(text);
    expect(a).toBe(b);
  });

  it("handles text that contains dates and facts", async () => {
    const text = "Policy #: POL-0001\nDate of loss: 01/15/2022\nTotal amount: $5,000.00";
    const result = await generatePacketFromText(text);
    expect(result).toContain("## Key Facts");
    expect(result.length).toBeGreaterThan(100);
  });

  it("produces a non-empty result for a single-word input", async () => {
    const result = await generatePacketFromText("hello");
    expect(result.length).toBeGreaterThan(0);
  });

  it("writes a governance log entry to the tenant log directory", async () => {
    await generatePacketFromText("Logged content.", undefined, "default");
    const logFile = path.join(tmpDir, "tenants", "default", "logs", "packets.jsonl");
    expect(fs.existsSync(logFile)).toBe(true);
  });

  it("generates different markdown for different input texts", async () => {
    const a = await generatePacketFromText("First document content.");
    const b = await generatePacketFromText("Second document content.");
    expect(a).not.toBe(b);
  });
});

describe("API constants", () => {
  it("ENGINE_VERSION is a non-empty string", () => {
    expect(typeof ENGINE_VERSION).toBe("string");
    expect(ENGINE_VERSION.length).toBeGreaterThan(0);
  });

  it("TEMPLATE_VERSION is a non-empty string", () => {
    expect(typeof TEMPLATE_VERSION).toBe("string");
    expect(TEMPLATE_VERSION.length).toBeGreaterThan(0);
  });
});
