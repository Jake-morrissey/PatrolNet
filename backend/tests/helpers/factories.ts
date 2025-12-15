import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../../src/db/client";
import { env } from "../../src/config/env";

type UserAttrs = {
  email?: string;
  password?: string;
  acceptedTos?: boolean;
};

type AssetAttrs = {
  name?: string;
  description?: string;
  type?: string;
  status?: string;
  uri?: string;
  metadata?: Record<string, unknown>;
};

export const createUser = async (attrs: UserAttrs = {}) => {
  const password = attrs.password ?? "Password123!";
  const passwordHash = await bcrypt.hash(password, 10);
  const email = attrs.email ?? `user-${Math.random().toString(16).slice(2)}@example.com`;
  const acceptedTosAt = attrs.acceptedTos ? new Date() : null;

  return prisma.user.create({
    data: { email, passwordHash, acceptedTosAt },
  });
};

export const tokenForUser = (userId: number) => {
  return jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
};

export const authHeaderForUser = (userId: number) => ({
  Authorization: `Bearer ${tokenForUser(userId)}`,
});

export const createAsset = async (userId: number, attrs: AssetAttrs = {}) => {
  const name = attrs.name ?? "Asset";

  return prisma.asset.create({
    data: {
      name,
      description: attrs.description,
      type: attrs.type ?? "generic",
      status: attrs.status ?? "active",
      uri: attrs.uri,
      metadata: attrs.metadata,
      userId,
    },
  });
};

export const createVerification = async (userId: number, domain: string, token: string) => {
  return prisma.domainVerification.create({
    data: {
      domain,
      method: "dns",
      token,
      status: "verified",
      verifiedAt: new Date(),
      userId,
    },
  });
};

