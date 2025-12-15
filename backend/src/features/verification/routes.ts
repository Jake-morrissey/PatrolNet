import { Router } from "express";

import { requireAuth } from "../../middleware/auth";
import { verifyDomain } from "./controller";

export const router = Router();

router.post("/verify-domain", requireAuth, verifyDomain);

