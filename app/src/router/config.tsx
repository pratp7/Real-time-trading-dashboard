import { lazy, Suspense } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import type { ReactElement } from 'react'

import { AppLayout } from '../layouts/AppLayout'
import { NotFoundPage } from '../pages/NotFoundPage'
import { GuestOnly, RequireAuth } from './guards'

type AccessType = 'public' | 'protected' | 'guest'

interface RouteDefinition {
  path: string
  element: ReactElement
  access: AccessType
}

const AuthPage = lazy(async () => {
  const module = await import('../pages/AuthPage')
  return { default: module.AuthPage }
})

const DashboardPage = lazy(async () => {
  const module = await import('../pages/DashboardPage')
  return { default: module.DashboardPage }
})

const TickerWorkspacePage = lazy(async () => {
  const module = await import('../pages/TickerWorkspacePage')
  return { default: module.TickerWorkspacePage }
})

const AlertsPage = lazy(async () => {
  const module = await import('../pages/AlertsPage')
  return { default: module.AlertsPage }
})

const withSuspense = (element: ReactElement): ReactElement => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            border: '1px solid var(--color-border)',
            borderRadius: 12,
            background: 'var(--color-surface)',
            padding: 16,
          }}
        >
          Loading page...
        </div>
      }
    >
      {element}
    </Suspense>
  )
}

const appPages: RouteDefinition[] = [
  {
    path: '/auth',
    element: withSuspense(<AuthPage />),
    access: 'guest',
  },
  {
    path: '/dashboard',
    element: withSuspense(<DashboardPage />),
    access: 'public',
  },
  {
    path: '/market/:tickerId',
    element: withSuspense(<TickerWorkspacePage />),
    access: 'protected',
  },
  {
    path: '/alerts',
    element: withSuspense(<AlertsPage />),
    access: 'protected',
  },
]

const wrapWithAccessGuard = (
  element: ReactElement,
  access: AccessType,
): ReactElement => {
  if (access === 'protected') {
    return <RequireAuth />
  }

  if (access === 'guest') {
    return <GuestOnly />
  }

  return element
}

const toRouteObject = (definition: RouteDefinition): RouteObject => {
  if (definition.access === 'public') {
    return {
      path: definition.path,
      element: definition.element,
    }
  }

  return {
    path: definition.path,
    element: wrapWithAccessGuard(definition.element, definition.access),
    children: [
      {
        index: true,
        element: definition.element,
      },
    ],
  }
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      ...appPages.map(toRouteObject),
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]
