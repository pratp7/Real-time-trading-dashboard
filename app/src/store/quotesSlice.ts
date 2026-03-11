import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { QuoteUpdate } from '../types'
import type { RootState } from './index'

interface QuotesState {
  bySymbol: Record<string, QuoteUpdate>
}

const initialState: QuotesState = {
  bySymbol: {},
}

const quotesSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    updateQuote: (state, action: PayloadAction<QuoteUpdate>) => {
      state.bySymbol[action.payload.symbol] = action.payload
    },
    clearQuotes: (state) => {
      state.bySymbol = {}
    },
  },
})

export const { updateQuote, clearQuotes } = quotesSlice.actions
export const quotesReducer = quotesSlice.reducer

export const selectQuotesBySymbol = (
  state: RootState,
): Record<string, QuoteUpdate> => state.quotes.bySymbol
