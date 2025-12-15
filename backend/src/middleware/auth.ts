import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { prisma } from "../db/client";
import { HttpError } from "../utils/errors";

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new HttpError(401, "Unauthorized");
    }

    const token = authHeader.substring("Bearer ".length);
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload;
    const userId = Number(payload.sub);

    if (!userId) {
      throw new HttpError(401, "Unauthorized");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpError(401, "Unauthorized");
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    next(new HttpError(401, "Unauthorized"));
  }
};

