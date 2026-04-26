import { describe, it, expect } from "vitest";
import { resolveTenant, registerTenant, getTenant } from "../../src/enterprise/tenant";
import type { Request } from "express";

describe("resolveTenant()", () => {
  it("returns the default tenant for an unknown ID", () => {
    const tenant = resolveTenant("no-such-tenant-xyz");
    expect(tenant.id).toBe("default");
  });

  it("returns the default tenant when 'default' is requested", () => {
    const tenant = resolveTenant("default");
    expect(tenant.id).toBe("default");
    expect(tenant.storagePath).toBeTruthy();
  });

  it("returns a registered tenant after registerTenant is called", () => {
    registerTenant({
      id: "acme-corp",
      name: "Acme Corp",
      storagePath: "tenants/acme-corp",
    });
    const tenant = resolveTenant("acme-corp");
    expect(tenant.id).toBe("acme-corp");
    expect(tenant.name).toBe("Acme Corp");
    expect(tenant.storagePath).toBe("tenants/acme-corp");
  });

  it("returns the default tenant after resolving an unregistered ID", () => {
    const tenant = resolveTenant("ghost-tenant");
    expect(tenant.id).toBe("default");
  });

  it("allows overwriting a registered tenant", () => {
    registerTenant({ id: "mutable", name: "Old Name", storagePath: "path/old" });
    registerTenant({ id: "mutable", name: "New Name", storagePath: "path/new" });
    const tenant = resolveTenant("mutable");
    expect(tenant.name).toBe("New Name");
    expect(tenant.storagePath).toBe("path/new");
  });
});

describe("getTenant()", () => {
  function makeRequest(
    headers: Record<string, string | string[] | undefined>
  ): Request {
    return { headers } as unknown as Request;
  }

  it("returns the x-tenant-id header value when set", () => {
    const req = makeRequest({ "x-tenant-id": "my-tenant" });
    expect(getTenant(req)).toBe("my-tenant");
  });

  it("trims whitespace from the x-tenant-id header", () => {
    const req = makeRequest({ "x-tenant-id": "  trimmed  " });
    expect(getTenant(req)).toBe("trimmed");
  });

  it("returns 'default' when x-tenant-id header is absent", () => {
    const req = makeRequest({});
    expect(getTenant(req)).toBe("default");
  });

  it("returns 'default' when x-tenant-id header is an empty string", () => {
    const req = makeRequest({ "x-tenant-id": "" });
    expect(getTenant(req)).toBe("default");
  });

  it("returns 'default' when x-tenant-id header is whitespace only", () => {
    const req = makeRequest({ "x-tenant-id": "   " });
    expect(getTenant(req)).toBe("default");
  });

  it("returns 'default' when the header is an array (non-string)", () => {
    const req = makeRequest({ "x-tenant-id": ["arr-tenant"] });
    expect(getTenant(req)).toBe("default");
  });
});
