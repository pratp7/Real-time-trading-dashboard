import jwt, { JwtPayload } from "jsonwebtoken";

import { config } from "../config/env";
import { AuthUser } from "../types/domain";

interface MockUserRecord extends AuthUser {
  password: string;
}

interface AuthTokenPayload extends JwtPayload {
  sub: string;
  email: string;
}

const MOCK_USERS: MockUserRecord[] = [
  {
    id: "user-1",
    email: "demo@trading.local",
    password: "demo123",
  },
];

export const authenticateMockUser = (email: string, password: string): AuthUser | null => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = MOCK_USERS.find(
    (record) => record.email.toLowerCase() === normalizedEmail && record.password === password,
  );

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
  };
};

export const signMockToken = (user: AuthUser): string => {
  return jwt.sign({ email: user.email }, config.jwtSecret, {
    subject: user.id,
    expiresIn: "12h",
  });
};

export const verifyMockToken = (token: string): AuthUser | null => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthTokenPayload;

    if (!decoded.sub || !decoded.email) {
      return null;
    }

    return {
      id: decoded.sub,
      email: decoded.email,
    };
  } catch {
    return null;
  }
};
