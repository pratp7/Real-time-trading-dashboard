import { Request, Response } from "express";

export const login = (req: Request, res: Response): void => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  res.status(200).json({
    user: {
      id: "user-1",
      email,
    },
    token: "mock-token",
  });
};
