import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { clearAuthToken, getAuthToken, setAuthToken } from '../auth/session'
import { login } from '../services/api'
import type { AuthUser } from '../types'
import type { RootState } from './index'

export type AuthStatus = 'idle' | 'loading' | 'error'

interface AuthState {
  user: AuthUser | null
  token: string | null
  status: AuthStatus
  error: string | null
}

interface LoginArgs {
  email: string
  password: string
}

interface LoginResult {
  user: AuthUser
  token: string
}

const initialState: AuthState = {
  user: null,
  token: getAuthToken(),
  status: 'idle',
  error: null,
}

export const loginThunk = createAsyncThunk<LoginResult, LoginArgs, { rejectValue: string }>(
  'auth/login',
  async ({ email, password }, thunkApi) => {
    try {
      const result = await login(email, password)
      return {
        user: result.user,
        token: result.token,
      }
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : 'Unable to sign in with provided credentials.'

      return thunkApi.rejectWithValue(message)
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
      clearAuthToken()
    },
    clearAuthError: (state) => {
      state.error = null
      if (state.status === 'error') {
        state.status = 'idle'
      }
    },
    setAuthUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.status = 'idle'
        state.error = null
        setAuthToken(action.payload.token)
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload ?? 'Unable to sign in with provided credentials.'
      })
  },
})

export const { logout, clearAuthError, setAuthUser } = authSlice.actions
export const authReducer = authSlice.reducer

export const selectAuth = (state: RootState): AuthState => state.auth
export const selectAuthUser = (state: RootState): AuthUser | null => state.auth.user
export const selectAuthToken = (state: RootState): string | null => state.auth.token
export const selectAuthStatus = (state: RootState): AuthStatus => state.auth.status
export const selectAuthError = (state: RootState): string | null => state.auth.error
export const selectIsAuthenticated = (state: RootState): boolean => Boolean(state.auth.token)
