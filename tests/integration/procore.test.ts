import { describe, it, expect } from "vitest";
import { uploadToProcore, downloadFromProcore } from "../../src/enterprise/integrations/procore";

const CONFIG = {
  baseUrl: "https://api.procore.com",
  clientId: "test-client-id",
  clientSecret: "test-secret",
  companyId: "company-1",
  projectId: "project-42",
};

describe("Procore Integration", () => {
  it("uploadToProcore returns a URL containing the project ID", async () => {
    const url = await uploadToProcore(CONFIG, "packet.md", "content");
    expect(url).toContain(CONFIG.projectId);
  });

  it("uploadToProcore returns a URL containing the filename", async () => {
    const url = await uploadToProcore(CONFIG, "report.pdf", "content");
    expect(url).toContain("report.pdf");
  });

  it("uploadToProcore returns a string", async () => {
    const url = await uploadToProcore(CONFIG, "doc.md", "data");
    expect(typeof url).toBe("string");
  });

  it("downloadFromProcore returns a string", async () => {
    const content = await downloadFromProcore(CONFIG, "packet.md");
    expect(typeof content).toBe("string");
  });
});
