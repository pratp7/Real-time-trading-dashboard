import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { logout as logoutAction, selectAuthUser, selectIsAuthenticated } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

const navLinkStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 12px',
  borderRadius: '8px',
  background: active ? 'var(--color-surface-alt)' : 'transparent',
  color: 'var(--color-text-primary)',
  fontWeight: 600,
})

export const AppLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const authUser = useAppSelector(selectAuthUser)

  const handleLogout = () => {
    dispatch(logoutAction())
    navigate('/auth')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/dashboard" style={navLinkStyle(location.pathname === '/dashboard')}>
            Dashboard
          </Link>
          <Link to="/alerts" style={navLinkStyle(location.pathname === '/alerts')}>
            Alerts
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
                {authUser ? authUser.email : 'Authenticated'}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: 8,
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" style={navLinkStyle(location.pathname === '/auth')}>
              Login
            </Link>
          )}
        </div>
      </header>

      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>
    </div>
  )
}
