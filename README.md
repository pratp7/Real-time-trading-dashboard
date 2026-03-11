# Real-time Trading Dashboard

Real-time crypto trading dashboard with a React + TypeScript frontend and a Node.js + Express backend.

## Project Structure

- app: React frontend (Vite, Redux Toolkit, Socket.IO client, Chart.js)
- server: Express backend (REST + Socket.IO, mock auth, in-memory alerts)
- docker-compose.yml: deployment for separate frontend and backend images

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+

### 1) Install dependencies

In one terminal:

```bash
cd server
npm install
```

In another terminal:

```bash
cd app
npm install
```

### 2) Run backend

```bash
cd server
npm run dev
```

Backend runs at http://localhost:5000.

### 3) Run frontend

```bash
cd app
npm run dev
```

Frontend runs at http://localhost:5173.

## Docker Deployment (Separate FE and BE Images)

The repository includes:

- app/Dockerfile
- server/Dockerfile
- docker-compose.yml

### Build and start containers

```bash
docker compose up --build
```

### Access services

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/api/health

### Stop containers

```bash
docker compose down
```

## Unit Tests

### Frontend unit tests

```bash
cd app
npm test
```

Current frontend unit test includes format utilities in app/src/tests/unit.

### Backend unit tests

```bash
cd server
npm test
```

Current backend unit tests include:

- market validation logic
- alerts service behavior

## How to Calculate Test Coverage

### Frontend coverage

```bash
cd app
npm run coverage
```

### Backend coverage

```bash
cd server
npm run coverage
```

Vitest prints coverage summary in terminal and writes a coverage report folder.

## Notes and Assumptions

- Backend uses mocked authentication and in-memory alert storage.
- Market feed is simulated for deterministic behavior during assessment.
- Alerts are scoped by authenticated user token.