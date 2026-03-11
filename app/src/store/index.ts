import { configureStore } from '@reduxjs/toolkit'

import { authReducer } from './authSlice'
import { candlesReducer } from './candlesSlice'
import { quotesReducer } from './quotesSlice'
import { tickersReducer } from './tickersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    candles: candlesReducer,
    quotes: quotesReducer,
    tickers: tickersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
