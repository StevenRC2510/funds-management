# BTG Pactual - Investment Funds Management

SPA for managing investment funds (FPV and FIC), built with Angular 21 as a technical test for BTG Pactual.

## Features

- **Fund catalog**: browse and filter by category (FPV/FIC)
- **Fund subscription**: select notification method (Email/SMS) with minimum balance validation
- **Portfolio**: view active subscriptions with cancellation option
- **Transaction history**: chronological log of subscriptions and cancellations
- **Responsive design**: desktop (table) and mobile (cards + bottom navigation)

## Tech Stack

- **Angular 21** — Standalone components, Signals, `httpResource`
- **TypeScript 5.9** — Strict mode
- **Tailwind CSS 4** — Utility-first styling
- **Vitest 4** — Unit testing
- **json-server** — Mock REST API
- **lucide-angular** — Icons

## Prerequisites

- Node.js >= 18
- npm >= 9

## Setup

```bash
git clone <repo-url>
cd funds-management
npm install
```

## Running

```bash
# Start json-server (port 3000) + Angular dev server (port 4200)
npm run dev
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

### Individual commands

```bash
# Angular dev server only
npm start

# json-server only
npm run api

# Production build
npm run build
```

## Tests

```bash
npm test
```

## Project Structure

```
src/app/
├── core/
│   ├── interceptors/       # HTTP interceptors (base URL, error handling)
│   ├── models/             # Interfaces and types (Fund, User, Subscription, Transaction)
│   └── services/           # Data services (Fund, User, Subscription, Transaction, Notification)
├── features/
│   ├── funds/              # Fund catalog + subscription flow
│   ├── portfolio/          # Active subscriptions portfolio
│   └── history/            # Transaction history
└── shared/
    ├── components/         # Reusable components (Header, Toast, ConfirmDialog, etc.)
    └── pipes/              # CopCurrencyPipe
```

## Architecture

- **State management**: Angular Signals as single source of truth in services
- **Data fetching**: `httpResource` for reads, `HttpClient` for mutations
- **Multi-step operations**: chained `concatMap` (POST subscription → PATCH balance → POST transaction)
- **Components**: `ChangeDetectionStrategy.OnPush`, signal-based inputs/outputs
- **Routing**: lazy loading with `loadComponent`

## API (json-server)

| Method | Endpoint             | Description                    |
|--------|----------------------|--------------------------------|
| GET    | /funds               | List available funds           |
| GET    | /user                | Get user data                  |
| PATCH  | /user                | Update balance                 |
| GET    | /subscriptions       | List active subscriptions      |
| POST   | /subscriptions       | Create subscription            |
| DELETE | /subscriptions/:id   | Cancel subscription            |
| GET    | /transactions        | List transactions              |
| POST   | /transactions        | Record transaction             |
