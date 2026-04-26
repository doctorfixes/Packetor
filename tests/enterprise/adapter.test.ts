import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logIntegration, packetHash } from "../../src/enterprise/integrations/adapter";
import type { IntegrationLogEntry } from "../../src/enterprise/integrations/adapter";
import type { StructuredPacket } from "../../src/structuring/structurePacket";

function makePacket(rawText = "some raw text"): StructuredPacket {
  return {
    sourceName: "doc.txt",
    summary: "A summary.",
    facts: [],
    timeline: [],
    riskFlags: [],
    rawText,
  };
}

const baseEntry = (): IntegrationLogEntry => ({
  timestamp: new Date().toISOString(),
  tenant: "default",
  integration: "salesforce",
  status: "success",
  latencyMs: 42,
  packetHash: "sha256-abc123",
  responseId: "resp-001",
});

describe("logIntegration()", () => {
  let writeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
  });

  afterEach(() => {
    writeSpy.mockRestore();
  });

  it("writes to stdout", () => {
    logIntegration(baseEntry());
    expect(writeSpy).toHaveBeenCalledOnce();
  });

  it("writes valid NDJSON terminated with a newline", () => {
    logIntegration(baseEntry());
    const written = writeSpy.mock.calls[0][0] as string;
    expect(written.endsWith("\n")).toBe(true);
    expect(() => JSON.parse(written.trim())).not.toThrow();
  });

  it("serialises all required fields in the log entry", () => {
    const entry = baseEntry();
    logIntegration(entry);
    const written = writeSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(written.trim()) as IntegrationLogEntry;
    expect(parsed.tenant).toBe(entry.tenant);
    expect(parsed.integration).toBe(entry.integration);
    expect(parsed.status).toBe(entry.status);
    expect(parsed.latencyMs).toBe(entry.latencyMs);
    expect(parsed.packetHash).toBe(entry.packetHash);
    expect(parsed.responseId).toBe(entry.responseId);
  });

  it("serialises an error status entry without throwing", () => {
    const entry: IntegrationLogEntry = {
      ...baseEntry(),
      status: "error",
      error: "Network timeout",
    };
    expect(() => logIntegration(entry)).not.toThrow();
    const written = writeSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(written.trim()) as IntegrationLogEntry;
    expect(parsed.status).toBe("error");
    expect(parsed.error).toBe("Network timeout");
  });

  it("does not throw when stdout.write throws", () => {
    writeSpy.mockImplementationOnce(() => {
      throw new Error("write error");
    });
    expect(() => logIntegration(baseEntry())).not.toThrow();
  });
});

describe("packetHash()", () => {
  it("returns a string prefixed with 'sha256-'", () => {
    const hash = packetHash(makePacket());
    expect(hash.startsWith("sha256-")).toBe(true);
  });

  it("returns a 64-character hex digest after the prefix", () => {
    const hash = packetHash(makePacket());
    const hex = hash.replace("sha256-", "");
    expect(hex).toMatch(/^[a-f0-9]{64}$/);
  });

  it("is deterministic for the same rawText", () => {
    const packet = makePacket("hello world");
    expect(packetHash(packet)).toBe(packetHash(packet));
  });

  it("changes when rawText changes", () => {
    expect(packetHash(makePacket("text A"))).not.toBe(packetHash(makePacket("text B")));
  });

  it("hashes rawText regardless of other packet fields", () => {
    const packetA = { ...makePacket("same text"), sourceName: "a.txt" };
    const packetB = { ...makePacket("same text"), sourceName: "b.txt" };
    expect(packetHash(packetA)).toBe(packetHash(packetB));
  });
});
