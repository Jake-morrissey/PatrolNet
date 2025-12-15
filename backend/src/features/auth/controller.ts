import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { authService } from "./service";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = credentialsSchema.parse(req.body);
    const result = await authService.register(data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = credentialsSchema.parse(req.body);
    const result = await authService.login(data);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = refreshSchema.parse(req.body);
    const result = await authService.refresh(data.refreshToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

