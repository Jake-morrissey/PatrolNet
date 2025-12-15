import request from "supertest";
import jwt from "jsonwebtoken";
import { describe, it, beforeEach, afterAll, expect, vi } from "vitest";

import { createApp } from "../../src/app";
import { resetDb, disconnectDb } from "../helpers/db";
import { createUser, authHeaderForUser } from "../helpers/factories";
import { env } from "../../src/config/env";

const app = createApp();

describe("auth middleware", () => {
  beforeEach(async () => {
    await resetDb();
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await resetDb();
    await disconnectDb();
  });

  it("rejects missing bearer token", async () => {
    await request(app).get("/assets").expect(401);
  });

  it("rejects malformed bearer token", async () => {
    await request(app).get("/assets").set("Authorization", "Bearer").expect(401);
    await request(app).get("/assets").set("Authorization", "Bearer   ").expect(401);
  });

  it("rejects invalid signature", async () => {
    const user = await createUser();
    const badToken = jwt.sign({ sub: user.id }, "wrong-secret", { expiresIn: "15m" });

    await request(app)
      .get("/assets")
      .set("Authorization", `Bearer ${badToken}`)
      .expect(401);
  });

  it("allows valid token and attaches user context", async () => {
    const user = await createUser();

    const res = await request(app)
      .get("/assets")
      .set(authHeaderForUser(user.id))
      .expect(200);

    expect(res.body.assets).toEqual([]);

    // Additional sanity: token signed with the correct secret decodes to the user id.
    const token = authHeaderForUser(user.id).Authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload;
    expect(Number(payload.sub)).toBe(user.id);
  });
});

