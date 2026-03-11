import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { fetchTickers } from '../services/api'
import type { Ticker } from '../types'
import type { RootState } from './index'

export type TickersStatus = 'idle' | 'loading' | 'succeeded' | 'error'

interface TickersState {
  items: Ticker[]
  selectedId: string | null
  status: TickersStatus
  error: string | null
}

const initialState: TickersState = {
  items: [],
  selectedId: null,
  status: 'idle',
  error: null,
}

export const fetchTickersThunk = createAsyncThunk<
  Ticker[],
  void,
  { rejectValue: string }
>('tickers/fetchTickers', async (_, thunkApi) => {
  try {
    return await fetchTickers()
  } catch (requestError) {
    const message = requestError instanceof Error ? requestError.message : 'Failed to load tickers.'
    return thunkApi.rejectWithValue(message)
  }
})

const tickersSlice = createSlice({
  name: 'tickers',
  initialState,
  reducers: {
    selectTicker: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickersThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTickersThunk.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
        state.error = null

        if (!state.selectedId && action.payload.length > 0) {
          state.selectedId = action.payload[0].id
        }
      })
      .addCase(fetchTickersThunk.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload ?? 'Failed to load tickers.'
      })
  },
})

export const { selectTicker } = tickersSlice.actions
export const tickersReducer = tickersSlice.reducer

export const selectTickers = (state: RootState): Ticker[] => state.tickers.items
export const selectTickersStatus = (state: RootState): TickersStatus => state.tickers.status
export const selectTickersError = (state: RootState): string | null => state.tickers.error
export const selectTickerId = (state: RootState): string | null => state.tickers.selectedId
