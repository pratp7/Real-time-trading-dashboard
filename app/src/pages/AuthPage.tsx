import { useLocation } from 'react-router-dom'

import { LoginForm } from '../components/Auth/LoginForm'

interface AuthLocationState {
  from?: string
}

export const AuthPage = () => {
  const location = useLocation()
  const state = (location.state as AuthLocationState | null) ?? null
  const redirectTo = state?.from ?? '/dashboard'

  return (
    <section
      style={{
        maxWidth: 520,
        margin: '48px auto',
        padding: 24,
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        background: 'var(--color-surface)',
      }}
    >
      <h1 style={{ marginBottom: 8 }}>Authentication</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>
        Login to access protected market routes and alerts.
      </p>
      <LoginForm redirectTo={redirectTo} />
    </section>
  )
}

