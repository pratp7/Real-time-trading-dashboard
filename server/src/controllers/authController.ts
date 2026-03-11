import { Request, Response } from "express";

import { authenticateMockUser, signMockToken } from "../services/authService";

export const login = (req: Request, res: Response): void => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const user = authenticateMockUser(email, password);
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = signMockToken(user);

  res.status(200).json({ user, token });
};
