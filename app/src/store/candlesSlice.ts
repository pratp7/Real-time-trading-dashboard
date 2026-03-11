import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { fetchHistory } from '../services/api'
import type { CandleUpdate, HistoryPoint } from '../types'
import type { RootState } from './index'

export type CandleLoadStatus = 'idle' | 'loading' | 'succeeded' | 'error'

interface CandlesState {
  byKey: Record<string, HistoryPoint[]>
  statusByKey: Record<string, CandleLoadStatus>
  errorByKey: Record<string, string | null>
}

interface FetchHistoryArgs {
  tickerId: string
  interval: string
  limit: number
}

interface FetchHistoryResult {
  key: string
  points: HistoryPoint[]
}

interface UpsertLiveCandlePayload {
  tickerId: string
  interval: string
  candle: CandleUpdate
}

const initialState: CandlesState = {
  byKey: {},
  statusByKey: {},
  errorByKey: {},
}

const toKey = (tickerId: string, interval: string): string => {
  return `${tickerId.toLowerCase()}:${interval}`
}

export const fetchHistoryThunk = createAsyncThunk<
  FetchHistoryResult,
  FetchHistoryArgs,
  { rejectValue: { key: string; message: string } }
>('candles/fetchHistory', async ({ tickerId, interval, limit }, thunkApi) => {
  const key = toKey(tickerId, interval)

  try {
    const points = await fetchHistory(tickerId, interval, limit)
    return { key, points }
  } catch (requestError) {
    const message =
      requestError instanceof Error ? requestError.message : 'Failed to load historical data.'

    return thunkApi.rejectWithValue({ key, message })
  }
})

const candlesSlice = createSlice({
  name: 'candles',
  initialState,
  reducers: {
    upsertLiveCandle: (state, action: { payload: UpsertLiveCandlePayload }) => {
      const { tickerId, interval, candle } = action.payload
      const key = toKey(tickerId, interval)
      const previous = state.byKey[key] ?? []

      const normalized: HistoryPoint = {
        timestamp: candle.timestamp,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
      }

      if (previous.length === 0) {
        state.byKey[key] = [normalized]
        return
      }

      const last = previous[previous.length - 1]
      if (last.timestamp === normalized.timestamp) {
        state.byKey[key] = [...previous.slice(0, -1), normalized]
        return
      }

      const next = [...previous, normalized]
      state.byKey[key] = next.length > 200 ? next.slice(next.length - 200) : next
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistoryThunk.pending, (state, action) => {
        const key = toKey(action.meta.arg.tickerId, action.meta.arg.interval)
        state.statusByKey[key] = 'loading'
        state.errorByKey[key] = null
      })
      .addCase(fetchHistoryThunk.fulfilled, (state, action) => {
        state.byKey[action.payload.key] = action.payload.points
        state.statusByKey[action.payload.key] = 'succeeded'
        state.errorByKey[action.payload.key] = null
      })
      .addCase(fetchHistoryThunk.rejected, (state, action) => {
        const key = action.payload?.key ?? toKey(action.meta.arg.tickerId, action.meta.arg.interval)
        state.statusByKey[key] = 'error'
        state.errorByKey[key] = action.payload?.message ?? 'Failed to load historical data.'
      })
  },
})

export const { upsertLiveCandle } = candlesSlice.actions
export const candlesReducer = candlesSlice.reducer

export const selectCandleKey = (tickerId: string, interval: string): string => {
  return toKey(tickerId, interval)
}

export const selectCandlesForKey = (
  state: RootState,
  tickerId: string,
  interval: string,
): HistoryPoint[] => {
  return state.candles.byKey[toKey(tickerId, interval)] ?? []
}

export const selectCandleStatusForKey = (
  state: RootState,
  tickerId: string,
  interval: string,
): CandleLoadStatus => {
  return state.candles.statusByKey[toKey(tickerId, interval)] ?? 'idle'
}

export const selectCandleErrorForKey = (
  state: RootState,
  tickerId: string,
  interval: string,
): string | null => {
  return state.candles.errorByKey[toKey(tickerId, interval)] ?? null
}
