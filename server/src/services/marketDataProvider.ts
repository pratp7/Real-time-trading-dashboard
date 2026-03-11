import { CandleUpdate, HistoryPoint, QuoteUpdate, Ticker } from "../types/domain";

export interface HistoryQuery {
  tickerId: string;
  interval: string;
  limit: number;
}

export interface QuotesQuery {
  tickerIds: string[];
}

export interface CandleQuery {
  tickerId: string;
  interval: string;
}

export interface MarketDataProvider {
  getTickers(): Promise<Ticker[]>;
  getHistory(query: HistoryQuery): Promise<HistoryPoint[]>;
  getQuotes(query: QuotesQuery): Promise<QuoteUpdate[]>;
  getLatestCandle(query: CandleQuery): Promise<CandleUpdate>;
}
