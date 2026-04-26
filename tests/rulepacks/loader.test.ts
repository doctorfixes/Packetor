import { describe, it, expect } from "vitest";
import { loadRulePack } from "../../src/rulepacks/loader";

describe("loadRulePack()", () => {
  it("returns null for an empty identifier", async () => {
    const result = await loadRulePack("");
    expect(result).toBeNull();
  });

  it("returns null for an identifier not in the allowlist", async () => {
    const result = await loadRulePack("unknown/v1");
    expect(result).toBeNull();
  });

  it("returns null for a path-traversal attempt", async () => {
    const result = await loadRulePack("../../etc/passwd");
    expect(result).toBeNull();
  });

  it("returns null for an identifier with unsafe characters", async () => {
    const result = await loadRulePack("insurance/v1;rm -rf /");
    expect(result).toBeNull();
  });

  it("returns null for an identifier with dot-segments", async () => {
    const result = await loadRulePack("insurance/../insurance/v1");
    expect(result).toBeNull();
  });

  it("returns null for an identifier with a shell metacharacter", async () => {
    const result = await loadRulePack("insurance/v1|cat");
    expect(result).toBeNull();
  });

  it("returns null for a single-segment identifier (missing version)", async () => {
    const result = await loadRulePack("insurance");
    expect(result).toBeNull();
  });

  it("returns null for null-byte injection attempt", async () => {
    const result = await loadRulePack("insurance\x00/v1");
    expect(result).toBeNull();
  });
});
