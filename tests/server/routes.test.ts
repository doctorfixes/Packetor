import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { registerRoutes } from "../../src/server/routes";
import { registerTenant } from "../../src/enterprise/tenant";
import fs from "fs";
import os from "os";
import path from "path";
import type { Application, Request, Response } from "express";

// Mock the API layer so route tests don't do real packet generation.
vi.mock("../../src/api/packet", () => ({
  generatePacketFromFile: vi.fn(async () => "# Packet: file"),
  generatePacketFromText: vi.fn(async () => "# Packet: text"),
  ENGINE_VERSION: "0.2.0",
  TEMPLATE_VERSION: "generic/v1",
}));

import {
  generatePacketFromFile,
  generatePacketFromText,
} from "../../src/api/packet";

// Minimal Express-compatible app stub that collects registered routes.
type RouteHandler = (req: Request, res: Response) => void | Promise<void>;

function makeApp(): {
  app: Application;
  routes: Map<string, RouteHandler>;
} {
  const routes = new Map<string, RouteHandler>();
  const app = {
    post: (path: string, handler: RouteHandler) => {
      routes.set(path, handler);
    },
  } as unknown as Application;
  return { app, routes };
}

// Minimal mock req/res helpers.
function makeReq(
  overrides: Partial<{
    files: Record<string, unknown>;
    body: Record<string, unknown>;
    headers: Record<string, string>;
  }> = {}
): Request {
  return {
    files: overrides.files ?? null,
    body: overrides.body ?? {},
    headers: overrides.headers ?? {},
  } as unknown as Request;
}

interface MockRes {
  statusCode: number;
  body: unknown;
  status: (code: number) => MockRes;
  json: (body: unknown) => MockRes;
}

function makeRes(): MockRes {
  const res: MockRes = {
    statusCode: 200,
    body: undefined,
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(b) {
      res.body = b;
      return res;
    },
  };
  return res;
}

let tmpDir: string;
let originalCwd: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "packetor-routes-test-"));
  originalCwd = process.cwd();
  process.chdir(tmpDir);
  registerTenant({
    id: "default",
    name: "Default Tenant",
    storagePath: path.join(tmpDir, "tenants", "default"),
  });
  vi.clearAllMocks();
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("POST /api/packet/text route", () => {
  it("calls generatePacketFromText with the provided text", async () => {
    const { app, routes } = makeApp();
    registerRoutes(app);
    const handler = routes.get("/api/packet/text")!;

    const req = makeReq({ body: { text: "Hello world." } });
    const res = makeRes();
    await handler(req, res as unknown as Response);

    expect(vi.mocked(generatePacketFromText)).toHaveBeenCalledWith(
      "Hello world.",
      undefined,
      "default"
    );
  });

  it("responds with a packet field containing a string", async () => {
    const { app, routes } = makeApp();
    registerRoutes(app);
    const handler = routes.get("/api/packet/text")!;

    const req = makeReq({ body: { text: "Some text." } });
    const res = makeRes();
    await handler(req, res as unknown as Response);

    expect((res.body as { packet: string }).packet).toBe("# Packet: text");
  });

  it("returns 400 when text is missing", async () => {
    const { app, routes } = makeApp();
    registerRoutes(app);
    const handler = routes.get("/api/packet/text")!;

    const req = makeReq({ body: {} });
    const res = makeRes();
    await handler(req, res as unknown as Response);

    expect(res.statusCode).toBe(400);
  });

  it("returns 400 when text is not a string", async () => {
    const { app, routes } = makeApp();
    registerRoutes(app);
    const handler = routes.get("/api/packet/text")!;

    const req = makeReq({ body: { text: 42 } });
    const res = makeRes();
    await handler(req, res as unknown as Response);

    expect(res.statusCode).toBe(400);
  });

  it("passes the rulepack to generatePacketFromText when provided", async () => {
    const { app, routes } = makeApp();
    registerRoutes(app);
    const handler = routes.get("/api/packet/text")!;

    const req = makeReq({ body: { text: "doc text", rulepack: "insurance/v1" } });
    const res = makeRes();
    await handler(req, res as unknown as Response);

    expect(vi.mocked(generatePacketFromText)).toHaveBeenCalledWith(
      "doc text",
      "insurance/v1",
      "default"
    );
  });

  it("returns 500 when generatePacketFromText throws", async () => {
    vi.mocked(generatePacketFromText).mockRejectedValueOnce(
      new Error("internal failure")
    );
    const { app, routes } = makeApp();
    registerRoutes(app);
    const handler = routes.get("/api/packet/text")!;

    const req = makeReq({ body: { text: "some text" } });
    const res = makeRes();
    await handler(req, res as unknown as Response);

    expect(res.statusCode).toBe(500);
    expect((res.body as { error: string }).error).toBe("internal failure");
  });
});

describe("POST /api/packet/file route", () => {
  it("returns 400 when no file is uploaded", async () => {
    const { app, routes } = makeApp();
    registerRoutes(app);
    const handler = routes.get("/api/packet/file")!;

    const req = makeReq({ files: {} });
    const res = makeRes();
    await handler(req, res as unknown as Response);

    expect(res.statusCode).toBe(400);
  });

  it("calls generatePacketFromFile when a file is uploaded", async () => {
    const { app, routes } = makeApp();
    registerRoutes(app);
    const handler = routes.get("/api/packet/file")!;

    const fakeFile = { name: "doc.txt", data: Buffer.from("content") };
    const req = makeReq({ files: { file: fakeFile } });
    const res = makeRes();
    await handler(req, res as unknown as Response);

    expect(vi.mocked(generatePacketFromFile)).toHaveBeenCalledWith(
      fakeFile,
      undefined,
      "default"
    );
  });

  it("responds with a packet field when file upload succeeds", async () => {
    const { app, routes } = makeApp();
    registerRoutes(app);
    const handler = routes.get("/api/packet/file")!;

    const fakeFile = { name: "doc.txt", data: Buffer.from("content") };
    const req = makeReq({ files: { file: fakeFile } });
    const res = makeRes();
    await handler(req, res as unknown as Response);

    expect((res.body as { packet: string }).packet).toBe("# Packet: file");
  });

  it("returns 500 when generatePacketFromFile throws", async () => {
    vi.mocked(generatePacketFromFile).mockRejectedValueOnce(
      new Error("file processing error")
    );
    const { app, routes } = makeApp();
    registerRoutes(app);
    const handler = routes.get("/api/packet/file")!;

    const fakeFile = { name: "doc.txt", data: Buffer.from("x") };
    const req = makeReq({ files: { file: fakeFile } });
    const res = makeRes();
    await handler(req, res as unknown as Response);

    expect(res.statusCode).toBe(500);
  });
});
