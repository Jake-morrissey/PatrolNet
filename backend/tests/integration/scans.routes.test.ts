import request from "supertest";
import { describe, it, beforeEach, afterAll, expect } from "vitest";

import { createApp } from "../../src/app";
import { resetDb, disconnectDb } from "../helpers/db";
import { createUser, createVerification, authHeaderForUser } from "../helpers/factories";
import * as scanExecutor from "../../src/features/scans/scanExecutor";

const app = createApp();

describe("scans routes", () => {
  beforeEach(async () => {
    await resetDb();
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await resetDb();
    await disconnectDb();
  });

  it("rejects when domain not verified", async () => {
    const user = await createUser({ acceptedTos: true });

    await request(app)
      .post("/start-scan")
      .set(authHeaderForUser(user.id))
      .send({ domain: "example.com", plan_tier: 10 })
      .expect(403);
  });

  it("rejects when TOS not accepted", async () => {
    const user = await createUser({ acceptedTos: false });
    await createVerification(user.id, "example.com", "token-123");

    const res = await request(app)
      .post("/start-scan")
      .set(authHeaderForUser(user.id))
      .send({ domain: "example.com", plan_tier: 10 })
      .expect(403);

    expect(res.body.message).toMatch(/TOS/i);
  });

  it("queues a scan when verified and within limits", async () => {
    const user = await createUser({ acceptedTos: true });
    await createVerification(user.id, "example.com", "token-123");

    vi.spyOn(scanExecutor, "executeScan").mockResolvedValue({
      success: true,
      findings: [
        {
          id: "f1",
          domain: "example.com",
          vulnerability_name: "Mock Vuln",
          severity: "medium",
          affected_url: "https://example.com",
          description: "desc",
          evidence: {},
          remediation: "fix",
          detected_at: new Date().toISOString(),
        },
      ],
    });

    const res = await request(app)
      .post("/start-scan")
      .set(authHeaderForUser(user.id))
      .send({ domain: "example.com", plan_tier: 10 })
      .expect(201);

    expect(res.body.job.domain).toBe("example.com");
    expect(res.body.job.status).toBe("queued");

    // Allow queue to process
    await new Promise((resolve) => setTimeout(resolve, 20));

    const jobRes = await request(app)
      .post("/start-scan")
      .set(authHeaderForUser(user.id))
      .send({ domain: "example.com", plan_tier: 10 })
      .expect(409); // should still see conflict while running/queued

    expect(jobRes.body.message).toBeDefined();
  });

  it("rejects when scan already active for domain", async () => {
    const user = await createUser({ acceptedTos: true });
    await createVerification(user.id, "example.com", "token-123");

    await request(app)
      .post("/start-scan")
      .set(authHeaderForUser(user.id))
      .send({ domain: "example.com", plan_tier: 10 })
      .expect(201);

    await request(app)
      .post("/start-scan")
      .set(authHeaderForUser(user.id))
      .send({ domain: "example.com", plan_tier: 10 })
      .expect(409);
  });

  it("retries once then succeeds", async () => {
    const user = await createUser({ acceptedTos: true });
    await createVerification(user.id, "retry.com", "token-123");

    const executeSpy = vi
      .spyOn(scanExecutor, "executeScan")
      .mockResolvedValueOnce({ success: false, error: "temporary" })
      .mockResolvedValueOnce({
        success: true,
        findings: [
          {
            id: "f2",
            domain: "retry.com",
            vulnerability_name: "Recovered",
            severity: "low",
            affected_url: "https://retry.com",
            description: "ok",
            evidence: {},
            remediation: "fix",
            detected_at: new Date().toISOString(),
          },
        ],
      });

    await request(app)
      .post("/start-scan")
      .set(authHeaderForUser(user.id))
      .send({ domain: "retry.com", plan_tier: 10 })
      .expect(201);

    // Allow queue to process retry
    await new Promise((resolve) => setTimeout(resolve, 30));

    expect(executeSpy).toHaveBeenCalledTimes(2);
  });
});

