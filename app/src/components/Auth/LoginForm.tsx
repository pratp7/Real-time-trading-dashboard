import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { loginThunk, selectAuthError, selectAuthStatus } from '../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

interface LoginFormProps {
  redirectTo: string
}

export const LoginForm = ({ redirectTo }: LoginFormProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const authStatus = useAppSelector(selectAuthStatus)
  const authError = useAppSelector(selectAuthError)

  const [email, setEmail] = useState('demo@trading.local')
  const [password, setPassword] = useState('demo123')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await dispatch(loginThunk({ email, password })).unwrap()
      navigate(redirectTo, { replace: true })
    } catch {
      // Error state is handled by auth slice.
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
      <label style={{ display: 'grid', gap: 6 }}>
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)' }}
        />
      </label>

      <label style={{ display: 'grid', gap: 6 }}>
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)' }}
        />
      </label>

      {authStatus === 'error' && authError ? (
        <p style={{ color: 'var(--color-negative)' }}>{authError}</p>
      ) : null}

      <button
        type="submit"
        disabled={authStatus === 'loading'}
        style={{
          marginTop: 8,
          background: 'var(--color-accent)',
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 8,
        }}
      >
        {authStatus === 'loading' ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
