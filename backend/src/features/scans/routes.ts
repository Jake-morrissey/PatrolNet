import { Router } from "express";

import { requireAuth } from "../../middleware/auth";
import { startScan } from "./controller";

export const router = Router();

router.post("/start-scan", requireAuth, startScan);

