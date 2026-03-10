import express, { Request, Response } from "express";

import cors from "cors";
const app = express();
const PORT = 5000;

const configuredOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...configuredOrigins,
]);

const isAllowedOrigin = (origin: string) => {
  if (allowedOrigins.has(origin)) {
    return true;
  }

  return /^(https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?)$/.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl, mobile apps, Postman)
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.options("/{*path}", cors());
app.use(express.json());


app.get("/api", (req: Request, res: Response) => {
  res.send("dummy tickers data");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
