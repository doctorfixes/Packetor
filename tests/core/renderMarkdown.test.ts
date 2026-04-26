import { describe, it, expect } from "vitest";
import { renderMarkdown } from "../../src/output/renderMarkdown";
import type { StructuredPacket } from "../../src/structuring/structurePacket";

function makePacket(overrides: Partial<StructuredPacket> = {}): StructuredPacket {
  return {
    sourceName: "test-doc.txt",
    summary: "This is the summary.",
    facts: [],
    timeline: [],
    riskFlags: [],
    rawText: "raw",
    ...overrides,
  };
}

describe("renderMarkdown()", () => {
  it("includes the source name in the heading", () => {
    const md = renderMarkdown(makePacket({ sourceName: "my-file.txt" }));
    expect(md).toContain("# Packet: my-file.txt");
  });

  it("includes the summary section", () => {
    const md = renderMarkdown(makePacket({ summary: "Short summary here." }));
    expect(md).toContain("## Summary");
    expect(md).toContain("Short summary here.");
  });

  it("includes the Key Facts section", () => {
    const md = renderMarkdown(makePacket());
    expect(md).toContain("## Key Facts");
  });

  it("renders a placeholder when there are no facts", () => {
    const md = renderMarkdown(makePacket({ facts: [] }));
    expect(md).toContain("_No key facts extracted._");
  });

  it("renders each fact as a bullet with label and value", () => {
    const md = renderMarkdown(
      makePacket({ facts: [{ label: "Policy", value: "POL-001" }] })
    );
    expect(md).toContain("- **Policy**: POL-001");
  });

  it("renders multiple facts", () => {
    const md = renderMarkdown(
      makePacket({
        facts: [
          { label: "Date", value: "01/01/2024" },
          { label: "Amount", value: "5,000.00" },
        ],
      })
    );
    expect(md).toContain("- **Date**: 01/01/2024");
    expect(md).toContain("- **Amount**: 5,000.00");
  });

  it("includes the Timeline section", () => {
    const md = renderMarkdown(makePacket());
    expect(md).toContain("## Timeline");
  });

  it("renders a placeholder when there are no timeline entries", () => {
    const md = renderMarkdown(makePacket({ timeline: [] }));
    expect(md).toContain("_No timeline entries found._");
  });

  it("renders each timeline entry as a bullet with date and event", () => {
    const md = renderMarkdown(
      makePacket({
        timeline: [{ date: "01/15/2020", event: "Claim filed." }],
      })
    );
    expect(md).toContain("- **01/15/2020** — Claim filed.");
  });

  it("does not include Risk Flags section when riskFlags is empty", () => {
    const md = renderMarkdown(makePacket({ riskFlags: [] }));
    expect(md).not.toContain("## Risk Flags");
  });

  it("includes Risk Flags section when riskFlags is present", () => {
    const md = renderMarkdown(makePacket({ riskFlags: ["High-value claim."] }));
    expect(md).toContain("## Risk Flags");
    expect(md).toContain("⚠️ High-value claim.");
  });

  it("includes the source name in the footer", () => {
    const md = renderMarkdown(makePacket({ sourceName: "footer-doc.txt" }));
    expect(md).toContain("_Source: footer-doc.txt_");
  });

  it("contains horizontal rule separators", () => {
    const md = renderMarkdown(makePacket());
    expect(md).toContain("---");
  });

  it("is deterministic for identical inputs", () => {
    const packet = makePacket({
      facts: [{ label: "Name", value: "Alice" }],
      timeline: [{ date: "02/02/2024", event: "Meeting held." }],
    });
    expect(renderMarkdown(packet)).toBe(renderMarkdown(packet));
  });

  it("returns a non-empty string", () => {
    const md = renderMarkdown(makePacket());
    expect(typeof md).toBe("string");
    expect(md.length).toBeGreaterThan(0);
  });
});
