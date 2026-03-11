import { NextFunction, Request, Response } from "express";

const MOCK_BEARER_TOKEN = "mock-token";

export const mockAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (token !== MOCK_BEARER_TOKEN) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  req.user = {
    id: "user-1",
    email: "demo@trading.local",
  };

  next();
};
