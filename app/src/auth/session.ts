const AUTH_TOKEN_STORAGE_KEY = 'rtd.auth.token'

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
}

export const hasAuthToken = (): boolean => {
  return Boolean(getAuthToken())
}

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
}

export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
}

export const hasStoredAuthToken = (): boolean => {
  return Boolean(getAuthToken())
}
