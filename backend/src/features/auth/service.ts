import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../../db/client";
import { env } from "../../config/env";
import { HttpError } from "../../utils/errors";

type Credentials = { email: string; password: string };

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

const signTokens = (userId: number): Tokens => {
  const accessToken = jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

export const authService = {
  async register(creds: Credentials) {
    const existing = await prisma.user.findUnique({ where: { email: creds.email } });
    if (existing) {
      throw new HttpError(409, "Email already registered");
    }

    const passwordHash = await bcrypt.hash(creds.password, 10);
    const user = await prisma.user.create({
      data: { email: creds.email, passwordHash },
    });

    const tokens = signTokens(user.id);
    return { user: { id: user.id, email: user.email }, ...tokens };
  },

  async login(creds: Credentials) {
    const user = await prisma.user.findUnique({ where: { email: creds.email } });
    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const valid = await bcrypt.compare(creds.password, user.passwordHash);
    if (!valid) {
      throw new HttpError(401, "Invalid credentials");
    }

    const tokens = signTokens(user.id);
    return { user: { id: user.id, email: user.email }, ...tokens };
  },

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as jwt.JwtPayload;
      const userId = Number(payload.sub);
      if (!userId) throw new Error("Invalid token subject");

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new HttpError(401, "Invalid token");
      }

      const tokens = signTokens(user.id);
      return { user: { id: user.id, email: user.email }, ...tokens };
    } catch (err) {
      throw new HttpError(401, "Invalid token");
    }
  },
};

