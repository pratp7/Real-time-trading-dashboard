import type {
  Alert,
  AlertCondition,
  ApiError,
  ApiResponse,
  HistoryPoint,
  LoginResponse,
  Ticker,
} from '../types'

const API_BASE = '/api'

interface HistoryData {
  symbol: string
  interval: string
  points: HistoryPoint[]
}

interface TickersData {
  tickers: Ticker[]
}

export interface CreateAlertPayload {
  symbol: string
  name: string
  targetPrice: number
  condition: AlertCondition
}

const buildHeaders = (token?: string): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

const toApiErrorMessage = (fallbackMessage: string, payload: unknown): string => {
  if (!payload || typeof payload !== 'object') {
    return fallbackMessage
  }

  const maybeError = (payload as ApiError).error
  if (typeof maybeError === 'string' && maybeError.trim()) {
    return maybeError
  }

  return fallbackMessage
}

const parseJsonSafe = async <T>(response: Response): Promise<T | null> => {
  const text = await response.text()
  if (!text) {
    return null
  }

  return JSON.parse(text) as T
}

const request = async <TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> => {
  const response = await fetch(`${API_BASE}${path}`, init)
  const payload = await parseJsonSafe<unknown>(response)

  if (!response.ok) {
    throw new Error(
      toApiErrorMessage(`Request failed with status ${response.status}`, payload),
    )
  }

  return payload as TResponse
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ email, password }),
  })
}

export const fetchTickers = async (): Promise<Ticker[]> => {
  const response = await request<ApiResponse<TickersData>>('/tickers')
  return response.data.tickers
}

export const fetchHistory = async (
  tickerId: string,
  interval: string,
  limit: number,
): Promise<HistoryPoint[]> => {
  const params = new URLSearchParams({
    interval,
    limit: String(limit),
  })

  const response = await request<ApiResponse<HistoryData>>(
    `/tickers/${encodeURIComponent(tickerId)}/history?${params.toString()}`,
  )

  return response.data.points
}

export const fetchAlerts = async (token: string): Promise<Alert[]> => {
  const response = await request<{ alerts: Alert[] }>('/alerts', {
    headers: buildHeaders(token),
  })

  return response.alerts
}

export const createAlert = async (
  token: string,
  payload: CreateAlertPayload,
): Promise<Alert> => {
  return request<Alert>('/alerts', {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  })
}

export const updateAlert = async (
  token: string,
  id: string,
  isActive: boolean,
): Promise<Alert> => {
  return request<Alert>(`/alerts/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: buildHeaders(token),
    body: JSON.stringify({ isActive }),
  })
}

export const deleteAlert = async (token: string, id: string): Promise<void> => {
  await request<unknown>(`/alerts/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: buildHeaders(token),
  })
}
