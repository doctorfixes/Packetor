import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { savePacket, loadPacket, listPackets } from "../../src/enterprise/storage";
import { registerTenant } from "../../src/enterprise/tenant";

let tmpDir: string;
let tenantId: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "packetor-storage-"));
  tenantId = `storage-${Date.now()}`;
  registerTenant({
    id: tenantId,
    name: "Storage Test Tenant",
    storagePath: path.join(tmpDir, tenantId),
  });
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("savePacket()", () => {
  it("returns the file path where content was written", () => {
    const filePath = savePacket(tenantId, "packet.md", "# Hello");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("persists the exact content passed", () => {
    const content = "deterministic content";
    const filePath = savePacket(tenantId, "out.md", content);
    expect(fs.readFileSync(filePath, "utf8")).toBe(content);
  });

  it("creates the tenant directory if it does not exist", () => {
    const filePath = savePacket(tenantId, "new.md", "data");
    expect(fs.existsSync(path.dirname(filePath))).toBe(true);
  });
});

describe("loadPacket()", () => {
  it("returns content of a previously saved packet", () => {
    savePacket(tenantId, "saved.md", "stored value");
    expect(loadPacket(tenantId, "saved.md")).toBe("stored value");
  });

  it("returns null when the file does not exist", () => {
    expect(loadPacket(tenantId, "ghost.md")).toBeNull();
  });
});

describe("listPackets()", () => {
  it("returns an empty array when no packets exist", () => {
    expect(listPackets(tenantId)).toEqual([]);
  });

  it("lists saved .md files", () => {
    savePacket(tenantId, "a.md", "content a");
    savePacket(tenantId, "b.md", "content b");
    const list = listPackets(tenantId);
    expect(list).toContain("a.md");
    expect(list).toContain("b.md");
  });

  it("lists saved .json files", () => {
    savePacket(tenantId, "data.json", "{}");
    expect(listPackets(tenantId)).toContain("data.json");
  });

  it("does not list files with other extensions", () => {
    savePacket(tenantId, "ignore.txt", "text");
    const list = listPackets(tenantId);
    expect(list).not.toContain("ignore.txt");
  });
});
