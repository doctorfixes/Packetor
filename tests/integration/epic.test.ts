import { describe, it, expect } from "vitest";
import { sendToEpic, fetchFromEpic } from "../../src/enterprise/integrations/epic";

const CONFIG = {
  fhirBaseUrl: "https://fhir.epic.com/api/FHIR/R4",
  clientId: "test-client-id",
  clientSecret: "test-secret",
  tenantId: "tenant-001",
};

describe("Epic Integration", () => {
  it("sendToEpic returns a URL containing the resource type", async () => {
    const url = await sendToEpic(CONFIG, "DocumentReference", { data: "packet" });
    expect(url).toContain("DocumentReference");
  });

  it("sendToEpic returns a URL containing the base URL", async () => {
    const url = await sendToEpic(CONFIG, "DocumentReference", {});
    expect(url).toContain(CONFIG.fhirBaseUrl);
  });

  it("sendToEpic returns a string", async () => {
    const url = await sendToEpic(CONFIG, "Patient", {});
    expect(typeof url).toBe("string");
  });

  it("fetchFromEpic returns a string", async () => {
    const result = await fetchFromEpic(CONFIG, "DocumentReference", "stub-id");
    expect(typeof result).toBe("string");
  });
});
