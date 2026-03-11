import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import {
  createAlert,
  deleteAlert,
  fetchAlerts,
  updateAlert,
  type CreateAlertPayload,
} from '../services/api'
import type { Alert } from '../types'
import type { RootState } from './index'

export type AlertsStatus = 'idle' | 'loading' | 'succeeded' | 'error'

interface AlertsState {
  items: Alert[]
  status: AlertsStatus
  error: string | null
}

interface ToggleAlertArgs {
  id: string
  isActive: boolean
}

const initialState: AlertsState = {
  items: [],
  status: 'idle',
  error: null,
}

const getTokenOrReject = (state: RootState): string => {
  const token = state.auth.token
  if (!token) {
    throw new Error('You must be logged in to manage alerts.')
  }

  return token
}

export const fetchAlertsThunk = createAsyncThunk<Alert[], void, { state: RootState; rejectValue: string }>(
  'alerts/fetchAlerts',
  async (_, thunkApi) => {
    try {
      const token = getTokenOrReject(thunkApi.getState())
      return await fetchAlerts(token)
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Failed to fetch alerts.'
      return thunkApi.rejectWithValue(message)
    }
  },
)

export const createAlertThunk = createAsyncThunk<
  Alert,
  CreateAlertPayload,
  { state: RootState; rejectValue: string }
>('alerts/createAlert', async (payload, thunkApi) => {
  try {
    const token = getTokenOrReject(thunkApi.getState())
    return await createAlert(token, payload)
  } catch (requestError) {
    const message = requestError instanceof Error ? requestError.message : 'Failed to create alert.'
    return thunkApi.rejectWithValue(message)
  }
})

export const toggleAlertThunk = createAsyncThunk<
  Alert,
  ToggleAlertArgs,
  { state: RootState; rejectValue: string }
>('alerts/toggleAlert', async ({ id, isActive }, thunkApi) => {
  try {
    const token = getTokenOrReject(thunkApi.getState())
    return await updateAlert(token, id, isActive)
  } catch (requestError) {
    const message = requestError instanceof Error ? requestError.message : 'Failed to update alert.'
    return thunkApi.rejectWithValue(message)
  }
})

export const deleteAlertThunk = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>('alerts/deleteAlert', async (id, thunkApi) => {
  try {
    const token = getTokenOrReject(thunkApi.getState())
    await deleteAlert(token, id)
    return id
  } catch (requestError) {
    const message = requestError instanceof Error ? requestError.message : 'Failed to delete alert.'
    return thunkApi.rejectWithValue(message)
  }
})

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlertsThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAlertsThunk.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(fetchAlertsThunk.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload ?? 'Failed to fetch alerts.'
      })
      .addCase(createAlertThunk.pending, (state) => {
        state.error = null
      })
      .addCase(createAlertThunk.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items]
      })
      .addCase(createAlertThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to create alert.'
      })
      .addCase(toggleAlertThunk.pending, (state) => {
        state.error = null
      })
      .addCase(toggleAlertThunk.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        )
      })
      .addCase(toggleAlertThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to update alert.'
      })
      .addCase(deleteAlertThunk.pending, (state) => {
        state.error = null
      })
      .addCase(deleteAlertThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteAlertThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to delete alert.'
      })
  },
})

export const alertsReducer = alertsSlice.reducer

export const selectAlerts = (state: RootState): Alert[] => state.alerts.items
export const selectAlertsStatus = (state: RootState): AlertsStatus => state.alerts.status
export const selectAlertsError = (state: RootState): string | null => state.alerts.error
