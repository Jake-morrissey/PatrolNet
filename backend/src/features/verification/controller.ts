import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { verificationService } from "./service";

const bodySchema = z.object({
  domain: z.string().min(1),
  verification_method: z.enum(["dns", "file", "token"]),
  token: z.string().min(6),
});

export const verifyDomain = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = bodySchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const verification = await verificationService.requestOrVerify(
      userId,
      parsed.domain,
      parsed.verification_method,
      parsed.token,
    );

    res.json({ verification });
  } catch (err) {
    next(err);
  }
};

