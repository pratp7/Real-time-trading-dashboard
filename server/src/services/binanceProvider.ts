import { CandleUpdate, HistoryPoint, QuoteUpdate, Ticker } from "../types/domain";
import { CandleQuery, HistoryQuery, MarketDataProvider, QuotesQuery } from "./marketDataProvider";

const CURATED_TICKERS: Ticker[] = [
  { id: "btc", symbol: "BTCUSDT", name: "Bitcoin", currency: "USDT" },
  { id: "eth", symbol: "ETHUSDT", name: "Ethereum", currency: "USDT" },
  { id: "sol", symbol: "SOLUSDT", name: "Solana", currency: "USDT" },
];

const BINANCE_KLINES_URL = "https://api.binance.com/api/v3/klines";
const BINANCE_TICKER_24H_URL = "https://api.binance.com/api/v3/ticker/24hr";
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

interface BinanceTicker24h {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  closeTime: number;
}

const getTickerById = (tickerId: string): Ticker | undefined => {
  return CURATED_TICKERS.find((item) => item.id === tickerId.toLowerCase());
};

const mapHistoryRow = (row: BinanceKlineRow): HistoryPoint => ({
  timestamp: new Date(row[0]).toISOString(),
  open: Number.parseFloat(row[1]),
  high: Number.parseFloat(row[2]),
  low: Number.parseFloat(row[3]),
  close: Number.parseFloat(row[4]),
  volume: Number.parseFloat(row[5]),
});

export class BinanceProvider implements MarketDataProvider {
  private readonly historyCache = new Map<string, HistoryCacheEntry>();

  async getTickers(): Promise<Ticker[]> {
    return CURATED_TICKERS;
  }

  async getHistory(query: HistoryQuery): Promise<HistoryPoint[]> {
    const ticker = getTickerById(query.tickerId);
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
    const points = rawRows.map(mapHistoryRow);

    this.historyCache.set(cacheKey, {
      timestampMs: Date.now(),
      points,
    });

    return points;
  }

  async getQuotes(query: QuotesQuery): Promise<QuoteUpdate[]> {
    const tickers = query.tickerIds
      .map((tickerId) => getTickerById(tickerId))
      .filter((ticker): ticker is Ticker => Boolean(ticker));

    if (tickers.length === 0) {
      return [];
    }

    const params = new URLSearchParams({
      symbols: JSON.stringify(tickers.map((ticker) => ticker.symbol)),
    });

    const response = await fetch(`${BINANCE_TICKER_24H_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Binance quotes fetch failed with status ${response.status}`);
    }

    const rows = (await response.json()) as BinanceTicker24h[];
    const tickerBySymbol = new Map(tickers.map((ticker) => [ticker.symbol, ticker]));

    return rows
      .filter((row) => tickerBySymbol.has(row.symbol))
      .map((row) => {
        const ticker = tickerBySymbol.get(row.symbol) as Ticker;

        return {
          symbol: ticker.id.toUpperCase(),
          price: Number.parseFloat(row.lastPrice),
          change: Number.parseFloat(row.priceChange),
          percent_change: Number.parseFloat(row.priceChangePercent),
          timestamp: new Date(row.closeTime).toISOString(),
        };
      });
  }

  async getLatestCandle(query: CandleQuery): Promise<CandleUpdate> {
    const ticker = getTickerById(query.tickerId);
    if (!ticker) {
      throw new Error("Ticker not found");
    }

    const points = await this.getHistory({
      tickerId: query.tickerId,
      interval: query.interval,
      limit: 1,
    });
    const latestPoint = points[0];

    if (!latestPoint) {
      throw new Error("No candle data available");
    }

    return {
      symbol: ticker.id.toUpperCase(),
      interval: query.interval,
      timestamp: latestPoint.timestamp,
      open: latestPoint.open,
      high: latestPoint.high,
      low: latestPoint.low,
      close: latestPoint.close,
      volume: latestPoint.volume,
    };
  }
}
