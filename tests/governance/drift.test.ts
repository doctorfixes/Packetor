import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { detectDrift } from "../../src/governance/drift";
import type { PacketLogEntry } from "../../src/governance/log";

function writeLog(filePath: string, entries: PacketLogEntry[]): void {
  const lines = entries.map((e) => JSON.stringify(e)).join("\n") + "\n";
  fs.writeFileSync(filePath, lines, "utf8");
}

let tmpDir: string;
let logFile: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "packetor-drift-"));
  logFile = path.join(tmpDir, "packets.jsonl");
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

const baseEntry = (): PacketLogEntry => ({
  inputHash: "aaa",
  outputHash: "bbb",
  templateVersion: "v1",
  rulepackVersion: "v1",
  engineVersion: "0.2.0",
  sourceName: "test.txt",
});

describe("detectDrift()", () => {
  it("returns empty report when log file does not exist", () => {
    const report = detectDrift(path.join(tmpDir, "nonexistent.jsonl"));
    expect(report.totalPackets).toBe(0);
    expect(report.duplicateInputHashes).toEqual([]);
  });

  it("returns correct totals for a single entry", () => {
    writeLog(logFile, [baseEntry()]);
    const report = detectDrift(logFile);
    expect(report.totalPackets).toBe(1);
    expect(report.duplicateInputHashes).toEqual([]);
  });

  it("reports no drift when the same input always produces the same output", () => {
    writeLog(logFile, [baseEntry(), baseEntry()]);
    const report = detectDrift(logFile);
    expect(report.duplicateInputHashes).toEqual([]);
  });

  it("detects drift when the same input produces different outputs", () => {
    const e1 = { ...baseEntry(), outputHash: "hash-A" };
    const e2 = { ...baseEntry(), outputHash: "hash-B" };
    writeLog(logFile, [e1, e2]);
    const report = detectDrift(logFile);
    expect(report.duplicateInputHashes).toContain("aaa");
  });

  it("collects unique template versions", () => {
    const entries = [
      { ...baseEntry(), templateVersion: "v1" },
      { ...baseEntry(), templateVersion: "v2" },
    ];
    writeLog(logFile, entries);
    const report = detectDrift(logFile);
    expect(report.uniqueTemplates).toContain("v1");
    expect(report.uniqueTemplates).toContain("v2");
  });
});
