import { NextFunction, Request, Response } from "express";
import { verifyMockToken } from "../services/authService";
import { AuthUser } from "../types/domain";

type AuthenticatedRequest = Request & { user?: AuthUser };

export const mockAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const user = verifyMockToken(token);
  if (!user) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  (req as AuthenticatedRequest).user = user;

  next();
};
