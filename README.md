# BTG Pactual - Gestión de Fondos de Inversión

Aplicación SPA para la gestión de fondos de inversión (FPV y FIC), desarrollada con Angular 21 como prueba técnica para BTG Pactual.

## Funcionalidades

- **Catálogo de fondos**: visualización y filtrado por categoría (FPV/FIC)
- **Suscripción a fondos**: con selección de método de notificación (Email/SMS) y validación de saldo mínimo
- **Portafolio**: visualización de suscripciones activas con opción de cancelación
- **Historial de transacciones**: registro cronológico de aperturas y cancelaciones
- **Diseño responsivo**: desktop (tabla) y mobile (cards + bottom navigation)

## Tecnologías

- **Angular 21** — Standalone components, Signals, `httpResource`
- **TypeScript 5.9** — Strict mode
- **Tailwind CSS 4** — Utility-first styling
- **Vitest 4** — Unit testing
- **json-server** — Mock REST API
- **lucide-angular** — Iconos

## Requisitos previos

- Node.js >= 18
- npm >= 9

## Instalación

```bash
git clone <repo-url>
cd funds-management
npm install
```

## Ejecución

```bash
# Iniciar json-server (puerto 3000) + Angular dev server (puerto 4200)
npm run dev
```

Abrir [http://localhost:4200](http://localhost:4200) en el navegador.

### Comandos individuales

```bash
# Solo Angular dev server
npm start

# Solo json-server
npm run api

# Build de producción
npm run build
```

## Tests

```bash
npm test
```

## Estructura del proyecto

```
src/app/
├── core/
│   ├── interceptors/       # HTTP interceptors (base URL, error handling)
│   ├── models/             # Interfaces y tipos (Fund, User, Subscription, Transaction)
│   └── services/           # Servicios de datos (Fund, User, Subscription, Transaction, Notification)
├── features/
│   ├── funds/              # Catálogo de fondos + flujo de suscripción
│   ├── portfolio/          # Portafolio de suscripciones activas
│   └── history/            # Historial de transacciones
└── shared/
    ├── components/         # Componentes reutilizables (Header, Toast, ConfirmDialog, etc.)
    └── pipes/              # CopCurrencyPipe
```

## Arquitectura

- **State management**: Angular Signals como fuente de verdad en servicios
- **Data fetching**: `httpResource` para lectura, `HttpClient` para mutaciones
- **Operaciones multi-paso**: `concatMap` encadenado (POST suscripción → PATCH balance → POST transacción)
- **Componentes**: `ChangeDetectionStrategy.OnPush`, inputs/outputs con signal API
- **Routing**: Lazy loading con `loadComponent`

## API (json-server)

| Método | Endpoint             | Descripción                    |
|--------|----------------------|--------------------------------|
| GET    | /funds               | Listar fondos disponibles      |
| GET    | /user                | Obtener datos del usuario      |
| PATCH  | /user                | Actualizar saldo               |
| GET    | /subscriptions       | Listar suscripciones activas   |
| POST   | /subscriptions       | Crear suscripción              |
| DELETE | /subscriptions/:id   | Cancelar suscripción           |
| GET    | /transactions        | Listar transacciones           |
| POST   | /transactions        | Registrar transacción          |
