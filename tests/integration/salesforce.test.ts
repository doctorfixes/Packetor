import { describe, it, expect } from "vitest";
import { pushToSalesforce, queryFromSalesforce } from "../../src/enterprise/integrations/salesforce";

const CONFIG = {
  instanceUrl: "https://example.salesforce.com",
  clientId: "test-client-id",
  clientSecret: "test-secret",
  apiVersion: "v58.0",
};

describe("Salesforce Integration", () => {
  it("pushToSalesforce returns a URL containing the instance URL", async () => {
    const url = await pushToSalesforce(CONFIG, "Case", { subject: "test" });
    expect(url).toContain(CONFIG.instanceUrl);
  });

  it("pushToSalesforce returns a URL containing the object type", async () => {
    const url = await pushToSalesforce(CONFIG, "ContentDocument", {});
    expect(url).toContain("ContentDocument");
  });

  it("pushToSalesforce returns a string", async () => {
    const url = await pushToSalesforce(CONFIG, "Case", {});
    expect(typeof url).toBe("string");
  });

  it("queryFromSalesforce returns a string", async () => {
    const result = await queryFromSalesforce(CONFIG, "SELECT Id FROM Case");
    expect(typeof result).toBe("string");
  });
});
