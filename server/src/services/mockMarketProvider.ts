import { CandleUpdate, HistoryPoint, QuoteUpdate, Ticker } from "../types/domain";
import { CandleQuery, HistoryQuery, MarketDataProvider, QuotesQuery } from "./marketDataProvider";

const CURATED_TICKERS: Ticker[] = [
  { id: "btc", symbol: "BTCUSDT", name: "Bitcoin", currency: "USDT" },
  { id: "eth", symbol: "ETHUSDT", name: "Ethereum", currency: "USDT" },
  { id: "sol", symbol: "SOLUSDT", name: "Solana", currency: "USDT" },
];

const BASE_PRICES: Record<string, number> = {
  btc: 68250,
  eth: 3520,
  sol: 145,
};

const INTERVAL_MS: Record<string, number> = {
  "1m": 60_000,
  "5m": 5 * 60_000,
  "15m": 15 * 60_000,
  "1h": 60 * 60_000,
  "4h": 4 * 60 * 60_000,
  "1d": 24 * 60 * 60_000,
};

interface MarketState {
  price: number;
  previousPrice: number;
  step: number;
}

const clamp = (value: number, min: number): number => {
  return value < min ? min : value;
};

const round = (value: number): number => {
  return Number(value.toFixed(2));
};

const getTickerById = (tickerId: string): Ticker | undefined => {
  return CURATED_TICKERS.find((ticker) => ticker.id === tickerId.toLowerCase());
};

const getIntervalMs = (interval: string): number => {
  return INTERVAL_MS[interval] ?? INTERVAL_MS["1m"];
};

export class MockMarketProvider implements MarketDataProvider {
  private readonly marketState = new Map<string, MarketState>(
    Object.entries(BASE_PRICES).map(([tickerId, basePrice]) => [
      tickerId,
      {
        price: basePrice,
        previousPrice: basePrice,
        step: 0,
      },
    ]),
  );

  async getTickers(): Promise<Ticker[]> {
    return CURATED_TICKERS;
  }

  async getHistory(query: HistoryQuery): Promise<HistoryPoint[]> {
    const ticker = getTickerById(query.tickerId);
    if (!ticker) {
      throw new Error("Ticker not found");
    }

    const basePrice = this.marketState.get(ticker.id)?.price ?? BASE_PRICES[ticker.id];
    const intervalMs = getIntervalMs(query.interval);
    const now = Date.now();
    const points: HistoryPoint[] = [];

    for (let index = query.limit - 1; index >= 0; index -= 1) {
      const step = this.marketState.get(ticker.id)?.step ?? 0;
      const pointSeed = step - index;
      const waveA = Math.sin(pointSeed / 2.7) * basePrice * 0.0035;
      const waveB = Math.cos(pointSeed / 5.2) * basePrice * 0.0021;
      const drift = (pointSeed % 9 - 4) * basePrice * 0.00035;

      const close = clamp(basePrice + waveA + waveB + drift, 1);
      const open = clamp(close - Math.sin(pointSeed / 1.9) * basePrice * 0.0016, 1);
      const high = Math.max(open, close) + basePrice * 0.0018;
      const low = clamp(Math.min(open, close) - basePrice * 0.0018, 1);
      const volume = Math.round(8_000 + Math.abs(Math.sin(pointSeed / 3.1)) * 12_000);

      points.push({
        timestamp: new Date(now - index * intervalMs).toISOString(),
        open: round(open),
        high: round(high),
        low: round(low),
        close: round(close),
        volume,
      });
    }

    return points;
  }

  async getQuotes(query: QuotesQuery): Promise<QuoteUpdate[]> {
    return query.tickerIds
      .map((tickerId) => getTickerById(tickerId))
      .filter((ticker): ticker is Ticker => Boolean(ticker))
      .map((ticker) => {
        const state = this.marketState.get(ticker.id);
        if (!state) {
          throw new Error(`Missing market state for ${ticker.id}`);
        }

        state.step += 1;
        state.previousPrice = state.price;

        const basePrice = BASE_PRICES[ticker.id];
        const waveA = Math.sin(state.step / 2.3) * basePrice * 0.0024;
        const waveB = Math.cos(state.step / 7.1) * basePrice * 0.0015;
        const microTrend = ((state.step % 6) - 2.5) * basePrice * 0.00025;
        const nextPrice = clamp(basePrice + waveA + waveB + microTrend, 1);
        const change = nextPrice - state.previousPrice;

        state.price = nextPrice;

        return {
          symbol: ticker.id.toUpperCase(),
          price: round(nextPrice),
          change: round(change),
          percent_change: round((change / state.previousPrice) * 100),
          timestamp: new Date().toISOString(),
        };
      });
  }

  async getLatestCandle(query: CandleQuery): Promise<CandleUpdate> {
    const ticker = getTickerById(query.tickerId);
    if (!ticker) {
      throw new Error("Ticker not found");
    }

    const state = this.marketState.get(ticker.id);
    if (!state) {
      throw new Error("Ticker state not found");
    }

    state.step += 1;

    const basePrice = BASE_PRICES[ticker.id];
    const open = state.price;
    const candleDrift = Math.sin(state.step / 2.8) * basePrice * 0.0019;
    const close = clamp(open + candleDrift, 1);
    const high = Math.max(open, close) + basePrice * 0.0012;
    const low = clamp(Math.min(open, close) - basePrice * 0.0012, 1);
    const volume = Math.round(5_500 + Math.abs(Math.cos(state.step / 4.5)) * 10_000);

    state.previousPrice = state.price;
    state.price = close;

    return {
      symbol: ticker.id.toUpperCase(),
      interval: query.interval,
      timestamp: new Date().toISOString(),
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
      volume,
    };
  }
}
