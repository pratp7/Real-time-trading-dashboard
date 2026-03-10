import express, { Request, Response } from "express";

import cors from "cors";
const app = express();
const PORT = 5000;

const productionOrigin = process.env.PRODUCTION_APP_URL?.trim();

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...(productionOrigin ? [productionOrigin] : []),
]);

const isAllowedOrigin = (origin: string) => {
  return allowedOrigins.has(origin);
};

const corsOptions: cors.CorsOptions = {
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
};

app.use(cors(corsOptions));

app.options("/{*path}", cors(corsOptions));
app.use(express.json());


app.get("/api", (req: Request, res: Response) => {
  res.send("dummy tickers data");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
