import request from "supertest";
import { describe, it, beforeEach, afterAll, expect, vi } from "vitest";

import dns from "dns/promises";

import { createApp } from "../../src/app";
import { resetDb, disconnectDb } from "../helpers/db";
import { createUser, authHeaderForUser } from "../helpers/factories";

const app = createApp();

describe("verification routes", () => {
  beforeEach(async () => {
    await resetDb();
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await resetDb();
    await disconnectDb();
  });

  it("verifies domain with matching token", async () => {
    const user = await createUser({ acceptedTos: true });
    const token = "token-abc";

    const res = await request(app)
      .post("/verify-domain")
      .set(authHeaderForUser(user.id))
      .send({ domain: "example.com", verification_method: "dns", token })
      .expect(200);

    expect(res.body.verification.domain).toBe("example.com");
    expect(res.body.verification.status).toBe("verified");
  });

  it("blocks domain when token mismatches", async () => {
    const user = await createUser({ acceptedTos: true });

    await request(app)
      .post("/verify-domain")
      .set(authHeaderForUser(user.id))
      .send({ domain: "example.com", verification_method: "dns", token: "first-token" })
      .expect(200);

    const res = await request(app)
      .post("/verify-domain")
      .set(authHeaderForUser(user.id))
      .send({ domain: "example.com", verification_method: "dns", token: "wrong-token" })
      .expect(403);

    expect(res.body.message).toMatch(/failed/i);
  });

  it("verifies via DNS TXT", async () => {
    const user = await createUser({ acceptedTos: true });
    const token = "dns-token";

    vi.spyOn(dns, "resolveTxt").mockResolvedValue([["dns-token"]]);

    const res = await request(app)
      .post("/verify-domain")
      .set(authHeaderForUser(user.id))
      .send({ domain: "example.com", verification_method: "dns", token })
      .expect(200);

    expect(res.body.verification.status).toBe("verified");
  });

  it("verifies via HTTP file", async () => {
    const user = await createUser({ acceptedTos: true });
    const token = "file-token";

    vi.stubGlobal("fetch", vi.fn(async () => new Response(token)));

    const res = await request(app)
      .post("/verify-domain")
      .set(authHeaderForUser(user.id))
      .send({ domain: "example.com", verification_method: "file", token })
      .expect(200);

    expect(res.body.verification.status).toBe("verified");
  });
});

