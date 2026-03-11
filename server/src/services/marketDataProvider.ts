import { HistoryPoint, Ticker } from "../types/domain";

export interface HistoryQuery {
  tickerId: string;
  interval: string;
  limit: number;
}

export interface MarketDataProvider {
  getTickers(): Promise<Ticker[]>;
  getHistory(query: HistoryQuery): Promise<HistoryPoint[]>;
}
