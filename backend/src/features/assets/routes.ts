import { Router } from "express";

import { requireAuth } from "../../middleware/auth";
import { listAssets, createAsset } from "./controller";

export const router = Router();

router.use(requireAuth);

router.get("/", listAssets);
router.post("/", createAsset);

