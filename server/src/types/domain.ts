export interface Ticker {
  id: string;
  symbol: string;
  name: string;
  currency: string;
}

export interface HistoryPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type AlertCondition = "above" | "below";

export interface Alert {
  id: string;
  symbol: string;
  name: string;
  targetPrice: number;
  createdAt: string;
  isActive: boolean;
  condition: AlertCondition;
  userId: string;
}

export interface QuoteUpdate {
  symbol: string;
  price: number;
  change: number;
  percent_change: number;
  timestamp: string;
}

export interface CandleUpdate {
  symbol: string;
  interval: string;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AuthUser {
  id: string;
  email: string;
}
