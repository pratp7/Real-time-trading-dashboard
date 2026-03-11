import { Request, Response } from "express";

import { binanceProvider } from "../services/providerRegistry";

export const getTickers = async (_req: Request, res: Response): Promise<void> => {
  const tickers = await binanceProvider.getTickers();
  res.status(200).json({ data: { tickers } });
};

export const getTickerHistory = async (req: Request, res: Response): Promise<void> => {
  const tickerParam = req.params.id;
  const tickerId = Array.isArray(tickerParam) ? tickerParam[0] : tickerParam;
  const interval = (req.query.interval as string | undefined) ?? "1m";
  const limit = Number.parseInt((req.query.limit as string | undefined) ?? "100", 10);

  const points = await binanceProvider.getHistory({
    tickerId,
    interval,
    limit: Number.isNaN(limit) ? 100 : limit,
  });

  res.status(200).json({
    data: {
      symbol: tickerId.toUpperCase(),
      interval,
      points,
    },
  });
};
