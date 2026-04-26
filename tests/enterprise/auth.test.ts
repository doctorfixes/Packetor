import { describe, it, expect } from "vitest";
import { authMiddleware, verifyToken } from "../../src/enterprise/auth";

describe("verifyToken()", () => {
  it("returns null for the 'invalid' token", () => {
    expect(verifyToken("invalid")).toBeNull();
  });

  it("returns null for an empty token", () => {
    expect(verifyToken("")).toBeNull();
  });

  it("returns an AuthContext for any non-empty, non-invalid token", () => {
    const ctx = verifyToken("any-valid-token");
    expect(ctx).not.toBeNull();
    expect(typeof ctx?.userId).toBe("string");
    expect(typeof ctx?.tenantId).toBe("string");
    expect(Array.isArray(ctx?.roles)).toBe(true);
  });
});

describe("authMiddleware()", () => {
  it("calls next() when a valid bearer token is provided", () => {
    const req = { headers: { authorization: "Bearer my-token" } };
    const res = { status: () => ({ json: () => {} }) };
    let called = false;
    authMiddleware(req, res, () => { called = true; });
    expect(called).toBe(true);
  });

  it("does not call next() when authorization header is missing", () => {
    const req = { headers: {} };
    let called = false;
    const res = { status: (_: number) => ({ json: () => {} }) };
    authMiddleware(req, res, () => { called = true; });
    expect(called).toBe(false);
  });

  it("does not call next() when token is 'invalid'", () => {
    const req = { headers: { authorization: "Bearer invalid" } };
    let called = false;
    const res = { status: (_: number) => ({ json: () => {} }) };
    authMiddleware(req, res, () => { called = true; });
    expect(called).toBe(false);
  });

  it("does not call next() when header is not a Bearer token", () => {
    const req = { headers: { authorization: "Basic dXNlcjpwYXNz" } };
    let called = false;
    const res = { status: (_: number) => ({ json: () => {} }) };
    authMiddleware(req, res, () => { called = true; });
    expect(called).toBe(false);
  });
});
