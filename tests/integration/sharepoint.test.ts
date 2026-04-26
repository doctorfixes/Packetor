import { describe, it, expect } from "vitest";
import {
  uploadToSharePoint,
  downloadFromSharePoint,
} from "../../src/enterprise/integrations/sharepoint";

const CONFIG = {
  siteUrl: "https://contoso.sharepoint.com/sites/Packetor",
  libraryName: "Documents",
  clientId: "test-client-id",
  clientSecret: "test-secret",
  tenantId: "tenant-abc",
};

describe("SharePoint Integration", () => {
  it("uploadToSharePoint returns a URL containing the site URL", async () => {
    const url = await uploadToSharePoint(CONFIG, "packet.md", "content");
    expect(url).toContain(CONFIG.siteUrl);
  });

  it("uploadToSharePoint returns a URL containing the library name", async () => {
    const url = await uploadToSharePoint(CONFIG, "packet.md", "content");
    expect(url).toContain(CONFIG.libraryName);
  });

  it("uploadToSharePoint returns a URL containing the filename", async () => {
    const url = await uploadToSharePoint(CONFIG, "report.pdf", "content");
    expect(url).toContain("report.pdf");
  });

  it("uploadToSharePoint returns a string", async () => {
    const url = await uploadToSharePoint(CONFIG, "doc.md", "data");
    expect(typeof url).toBe("string");
  });

  it("downloadFromSharePoint returns a string", async () => {
    const result = await downloadFromSharePoint(CONFIG, "packet.md");
    expect(typeof result).toBe("string");
  });
});
