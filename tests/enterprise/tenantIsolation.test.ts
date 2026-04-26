import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { savePacket } from "../../src/enterprise/storage";
import { registerTenant } from "../../src/enterprise/tenant";

let tmpDir: string;
let tenantId: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "packetor-tenant-"));
  tenantId = `tenant-${Date.now()}`;
  registerTenant({
    id: tenantId,
    name: "Test Tenant",
    storagePath: path.join(tmpDir, tenantId),
  });
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("Tenant Isolation", () => {
  it("writes to a tenant-specific directory", () => {
    const filePath = savePacket(tenantId, "test.txt", "hello");
    expect(filePath).toContain(tenantId);
  });

  it("two tenants do not share storage paths", () => {
    const tenantB = `${tenantId}-B`;
    registerTenant({
      id: tenantB,
      name: "Tenant B",
      storagePath: path.join(tmpDir, tenantB),
    });

    const pathA = savePacket(tenantId, "file.txt", "a");
    const pathB = savePacket(tenantB, "file.txt", "b");
    expect(pathA).not.toBe(pathB);
  });

  it("written file content is accessible on disk", () => {
    const filePath = savePacket(tenantId, "data.txt", "my content");
    expect(fs.readFileSync(filePath, "utf8")).toBe("my content");
  });
});
