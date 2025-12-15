import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { scansService } from "./service";

const startScanSchema = z.object({
  domain: z.string().min(1),
  plan_tier: z.number().int(),
});

export const startScan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const parsed = startScanSchema.parse(req.body);
    const job = await scansService.startScan(userId, parsed.domain, parsed.plan_tier);
    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
};

