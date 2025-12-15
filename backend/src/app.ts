import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { router as healthRouter } from "./features/health/routes";
import { router as authRouter } from "./features/auth/routes";
import { router as assetsRouter } from "./features/assets/routes";
import { router as verificationRouter } from "./features/verification/routes";
import { router as scansRouter } from "./features/scans/routes";
import { notFoundHandler, errorHandler } from "./middleware/error-handlers";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/assets", assetsRouter);
  app.use("/", verificationRouter);
  app.use("/", scansRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

