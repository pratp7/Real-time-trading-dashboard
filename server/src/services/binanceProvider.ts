import { HistoryPoint, Ticker } from "../types/domain";
import { HistoryQuery, MarketDataProvider } from "./marketDataProvider";

const CURATED_TICKERS: Ticker[] = [
  { id: "btc", symbol: "BTCUSDT", name: "Bitcoin", currency: "USDT" },
  { id: "eth", symbol: "ETHUSDT", name: "Ethereum", currency: "USDT" },
  { id: "sol", symbol: "SOLUSDT", name: "Solana", currency: "USDT" },
];

const BINANCE_KLINES_URL = "https://api.binance.com/api/v3/klines";
const HISTORY_CACHE_TTL_MS = 20_000;

interface HistoryCacheEntry {
  timestampMs: number;
  points: HistoryPoint[];
}

type BinanceKlineRow = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string,
];

export class BinanceProvider implements MarketDataProvider {
  private readonly historyCache = new Map<string, HistoryCacheEntry>();

  async getTickers(): Promise<Ticker[]> {
    return CURATED_TICKERS;
  }

  async getHistory(query: HistoryQuery): Promise<HistoryPoint[]> {
    const ticker = CURATED_TICKERS.find((item) => item.id === query.tickerId.toLowerCase());
    if (!ticker) {
      throw new Error("Ticker not found");
    }

    const cacheKey = `${ticker.id}:${query.interval}:${query.limit}`;
    const cached = this.historyCache.get(cacheKey);
    if (cached && Date.now() - cached.timestampMs < HISTORY_CACHE_TTL_MS) {
      return cached.points;
    }

    const params = new URLSearchParams({
      symbol: ticker.symbol,
      interval: query.interval,
      limit: String(query.limit),
    });

    const response = await fetch(`${BINANCE_KLINES_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Binance history fetch failed with status ${response.status}`);
    }

    const rawRows = (await response.json()) as BinanceKlineRow[];
    const points = rawRows.map((row) => ({
      timestamp: new Date(row[0]).toISOString(),
      open: Number.parseFloat(row[1]),
      high: Number.parseFloat(row[2]),
      low: Number.parseFloat(row[3]),
      close: Number.parseFloat(row[4]),
      volume: Number.parseFloat(row[5]),
    }));

    this.historyCache.set(cacheKey, {
      timestampMs: Date.now(),
      points,
    });

    return points;
  }
}
