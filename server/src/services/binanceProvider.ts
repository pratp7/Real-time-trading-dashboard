import { HistoryPoint, Ticker } from "../types/domain";
import { HistoryQuery, MarketDataProvider } from "./marketDataProvider";

const CURATED_TICKERS: Ticker[] = [
  { id: "btc", symbol: "BTCUSDT", name: "Bitcoin", currency: "USDT" },
  { id: "eth", symbol: "ETHUSDT", name: "Ethereum", currency: "USDT" },
  { id: "sol", symbol: "SOLUSDT", name: "Solana", currency: "USDT" },
];

export class BinanceProvider implements MarketDataProvider {
  async getTickers(): Promise<Ticker[]> {
    return CURATED_TICKERS;
  }

  async getHistory(_query: HistoryQuery): Promise<HistoryPoint[]> {
    return [];
  }
}
