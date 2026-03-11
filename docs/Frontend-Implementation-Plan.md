# Frontend Implementation Plan (Implemented)

## Scope Delivered

- React + TypeScript app with route-based structure.
- Public dashboard ticker list and protected market/alerts routes.
- Mock login/logout flow integrated with backend JWT auth endpoint.
- Real-time quote updates and real-time candle updates via Socket.IO.
- Candlestick chart with interval switching (`1m`, `5m`, `15m`, `1h`, `4h`, `1d`).
- Alerts UI for create, list, activate/deactivate, and delete.
- Basic unit tests for shared utility functions.
- Dockerized frontend image served by Nginx.

## Implemented Architecture

- Router: `/auth`, `/dashboard`, `/market/:tickerId`, `/alerts`.
- State management: Redux Toolkit slices for `auth`, `tickers`, `quotes`, `candles`, `alerts`.
- Services:
  - REST client for auth, tickers, history, and alerts.
  - Socket singleton for quote and candle subscriptions.
- Components:
  - Login form
  - Ticker list with live prices
  - Candlestick chart + interval selector
  - Alert panel with CRUD actions

## Testing Implemented

- Unit tests with Vitest in `app/src/tests/unit`.
- Coverage command available via `npm run coverage`.

## Out of Scope (Not Implemented)

- Full integration test suite for all flows.
- Advanced UI polish/animation system.
- Production auth/refresh-token lifecycle.
