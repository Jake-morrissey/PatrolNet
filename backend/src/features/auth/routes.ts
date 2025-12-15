import { Router } from "express";
import { login, register, refreshToken } from "./controller";

export const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

