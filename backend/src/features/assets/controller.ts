import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { assetsService } from "./service";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.string().min(1).default("generic"),
  status: z.string().min(1).default("active"),
  uri: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

export const listAssets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const assets = await assetsService.listByUser(userId);
    res.json({ assets });
  } catch (err) {
    next(err);
  }
};

export const createAsset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const body = createSchema.parse(req.body);
    const asset = await assetsService.create(userId, body);
    res.status(201).json({ asset });
  } catch (err) {
    next(err);
  }
};

