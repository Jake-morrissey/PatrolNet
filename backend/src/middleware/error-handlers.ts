import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/errors";

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Validation failed", issues: err.issues });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  res.status(500).json({ message: err.message || "Internal Server Error" });
};

