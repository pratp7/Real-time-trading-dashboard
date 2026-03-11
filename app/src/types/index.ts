// ── Domain types matching the backend contract ────────────────────────────────

export interface Ticker {
  id: string
  symbol: string
  name: string
  currency: string
}

export interface HistoryPoint {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type AlertCondition = 'above' | 'below'

export interface Alert {
  id: string
  symbol: string
  name: string
  targetPrice: number
  createdAt: string
  isActive: boolean
  condition: AlertCondition
  userId: string
}

export interface QuoteUpdate {
  symbol: string
  price: number
  change: number
  percent_change: number
  timestamp: string
}

export interface CandleUpdate {
  symbol: string
  interval: string
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface AuthUser {
  id: string
  email: string
}

export interface LoginResponse {
  user: AuthUser
  token: string
}

// ── Generic REST response wrapper ─────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
}

export interface ApiError {
  error: string
}

// ── WebSocket subscription message shapes ────────────────────────────────────

export interface SubscribeQuotesMessage {
  action: 'subscribe'
  channel: 'quotes'
  symbols: string[]
}

export interface UnsubscribeQuotesMessage {
  action: 'unsubscribe'
  channel: 'quotes'
}

export interface SubscribeCandlesMessage {
  action: 'subscribe'
  channel: 'candles'
  symbol: string
  interval: string
}

export interface UnsubscribeCandlesMessage {
  action: 'unsubscribe'
  channel: 'candles'
}

export type SubscriptionMessage =
  | SubscribeQuotesMessage
  | UnsubscribeQuotesMessage
  | SubscribeCandlesMessage
  | UnsubscribeCandlesMessage

export interface SubscriptionAck {
  action: string
  channel: string
  symbols?: string[]
  symbol?: string
  interval?: string
}

export interface SubscriptionError {
  error: string
}

export interface QuotePayload {
  type: 'quote'
  data: QuoteUpdate[]
}

export interface CandlePayload extends CandleUpdate {
  type: 'candle'
}
