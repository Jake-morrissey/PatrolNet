import request from "supertest";
import { describe, it, beforeEach, afterAll, expect, vi } from "vitest";

import { createApp } from "../../src/app";
import { resetDb, disconnectDb } from "../helpers/db";
import { createUser, createAsset, authHeaderForUser } from "../helpers/factories";

const app = createApp();

describe("assets routes", () => {
  beforeEach(async () => {
    await resetDb();
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await resetDb();
    await disconnectDb();
  });

  it("rejects unauthenticated requests to GET /assets", async () => {
    await request(app).get("/assets").expect(401);
  });

  it("rejects unauthenticated requests to POST /assets", async () => {
    await request(app).post("/assets").send({ name: "Example" }).expect(401);
  });

  it("lists assets for the authenticated user", async () => {
    const user = await createUser();
    await createAsset(user.id, { name: "User Asset 1" });
    await createAsset(user.id, { name: "User Asset 2" });

    const res = await request(app)
      .get("/assets")
      .set(authHeaderForUser(user.id))
      .expect(200);

    expect(res.body.assets).toHaveLength(2);
    expect(res.body.assets[0]).toHaveProperty("name");
    expect(res.body.assets[0]).toHaveProperty("type");
  });

  it("creates an asset for the authenticated user", async () => {
    const user = await createUser();

    const res = await request(app)
      .post("/assets")
      .set(authHeaderForUser(user.id))
      .send({ name: "Created Asset", status: "active", type: "device" })
      .expect(201);

    expect(res.body.asset).toMatchObject({
      name: "Created Asset",
      status: "active",
      type: "device",
      userId: user.id,
    });
  });
});

