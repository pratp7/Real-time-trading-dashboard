import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAppSelector } from '../store/hooks'
import { selectIsAuthenticated } from '../store/authSlice'

export const RequireAuth = () => {
  const location = useLocation()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export const GuestOnly = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
