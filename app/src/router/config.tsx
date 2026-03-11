import { Navigate, type RouteObject } from 'react-router-dom'
import type { ReactElement } from 'react'

import { AppLayout } from '../layouts/AppLayout'
import { AuthPage } from '../pages/AuthPage'
import { AlertsPage } from '../pages/AlertsPage'
import { DashboardPage } from '../pages/DashboardPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { TickerWorkspacePage } from '../pages/TickerWorkspacePage'
import { GuestOnly, RequireAuth } from './guards'

type AccessType = 'public' | 'protected' | 'guest'

interface RouteDefinition {
  path: string
  element: ReactElement
  access: AccessType
}

const appPages: RouteDefinition[] = [
  {
    path: '/auth',
    element: <AuthPage />,
    access: 'guest',
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
    access: 'public',
  },
  {
    path: '/market/:tickerId',
    element: <TickerWorkspacePage />,
    access: 'protected',
  },
  {
    path: '/alerts',
    element: <AlertsPage />,
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
