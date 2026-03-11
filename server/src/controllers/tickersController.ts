import { Request, Response } from "express";

import { marketDataProvider } from "../services/providerRegistry";

const ALLOWED_INTERVALS = new Set(["1m", "5m", "15m", "1h", "4h", "1d"]);
const DEFAULT_INTERVAL = "1m";
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 1000;

const getSingleQueryParam = (param: string | string[] | undefined): string | undefined => {
  if (Array.isArray(param)) {
    return param[0];
  }

  return param;
};

const toSafeLimit = (rawLimit: string | undefined): number | null => {
  if (!rawLimit) {
    return DEFAULT_LIMIT;
  }

  const parsed = Number.parseInt(rawLimit, 10);
  if (Number.isNaN(parsed) || parsed < 1 || parsed > MAX_LIMIT) {
    return null;
  }

  return parsed;
};

export const getTickers = async (_req: Request, res: Response): Promise<void> => {
  const tickers = await marketDataProvider.getTickers();
  res.status(200).json({ data: { tickers } });
};

export const getTickerHistory = async (req: Request, res: Response): Promise<void> => {
  const tickerParam = req.params.id;
  const tickerId = (Array.isArray(tickerParam) ? tickerParam[0] : tickerParam).toLowerCase();
  const interval = getSingleQueryParam(req.query.interval as string | string[] | undefined);
  const normalizedInterval = interval ?? DEFAULT_INTERVAL;

  if (!ALLOWED_INTERVALS.has(normalizedInterval)) {
    res.status(400).json({
      error: `Invalid interval. Allowed values: ${Array.from(ALLOWED_INTERVALS).join(", ")}`,
    });
    return;
  }

  const normalizedLimit = toSafeLimit(
    getSingleQueryParam(req.query.limit as string | string[] | undefined),
  );
  if (normalizedLimit === null) {
    res.status(400).json({ error: `Invalid limit. Must be between 1 and ${MAX_LIMIT}` });
    return;
  }

  const tickers = await marketDataProvider.getTickers();
  const selectedTicker = tickers.find((ticker) => ticker.id === tickerId);
  if (!selectedTicker) {
    res.status(404).json({ error: "Ticker not found" });
    return;
  }

  const points = await marketDataProvider.getHistory({
    tickerId,
    interval: normalizedInterval,
    limit: normalizedLimit,
  });

  res.status(200).json({
    data: {
      symbol: selectedTicker.id.toUpperCase(),
      interval: normalizedInterval,
      points,
    },
  });
};
