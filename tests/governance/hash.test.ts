import { describe, it, expect } from "vitest";
import { hashString, hashBuffer } from "../../src/governance/hash";

describe("hashString()", () => {
  it("is deterministic", () => {
    expect(hashString("abc")).toBe(hashString("abc"));
  });

  it("changes when input changes", () => {
    expect(hashString("abc")).not.toBe(hashString("abcd"));
  });

  it("returns a 64-character hex string (SHA-256)", () => {
    const result = hashString("hello");
    expect(result).toMatch(/^[a-f0-9]{64}$/);
  });

  it("empty string produces a stable hash", () => {
    expect(hashString("")).toBe(hashString(""));
  });
});

describe("hashBuffer()", () => {
  it("is deterministic", () => {
    const buf = Buffer.from("test");
    expect(hashBuffer(buf)).toBe(hashBuffer(buf));
  });

  it("matches hashString for the same UTF-8 content", () => {
    const text = "match me";
    expect(hashBuffer(Buffer.from(text, "utf8"))).toBe(hashString(text));
  });
});
