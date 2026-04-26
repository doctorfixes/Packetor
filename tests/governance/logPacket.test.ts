import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { logPacket } from "../../src/governance/log";

describe("logPacket() – tenant-scoped", () => {
  let tmpDir: string;
  let originalCwd: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "packetor-log-test-"));
    originalCwd = process.cwd();
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  const entry = {
    inputHash: "abc123",
    outputHash: "def456",
    templateVersion: "generic/v1",
    rulepackVersion: "none",
    engineVersion: "0.2.0",
    sourceName: "test",
  };

  it("writes to the default tenant log when no tenant is given", () => {
    logPacket(entry);
    const logFile = path.join(tmpDir, "tenants", "default", "logs", "packets.jsonl");
    expect(fs.existsSync(logFile)).toBe(true);
    const line = JSON.parse(fs.readFileSync(logFile, "utf8").trim());
    expect(line.inputHash).toBe("abc123");
  });

  it("writes to a named tenant log", () => {
    logPacket(entry, "acme");
    // acme resolves to default tenant storagePath since it's not registered
    const logFile = path.join(tmpDir, "tenants", "default", "logs", "packets.jsonl");
    expect(fs.existsSync(logFile)).toBe(true);
  });

  it("includes a timestamp in the log entry", () => {
    logPacket(entry, "default");
    const logFile = path.join(tmpDir, "tenants", "default", "logs", "packets.jsonl");
    const line = JSON.parse(fs.readFileSync(logFile, "utf8").trim());
    expect(typeof line.timestamp).toBe("string");
  });

  it("appends multiple entries to the same file", () => {
    logPacket(entry, "default");
    logPacket({ ...entry, inputHash: "zzz999" }, "default");
    const logFile = path.join(tmpDir, "tenants", "default", "logs", "packets.jsonl");
    const lines = fs.readFileSync(logFile, "utf8").trim().split("\n");
    expect(lines).toHaveLength(2);
  });
});
