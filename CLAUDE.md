# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (Next.js, port 3000)

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # Run ESLint
```

### Backend (NestJS, port 3001)

```bash
cd backend
npm run start:dev           # Start dev server
npm test                    # Run all tests
npm run test:coverage       # Run tests with coverage report
npm test -- --testPathPattern=auth.service  # Run a single test file
```

### Database (Prisma)

```bash
cd backend
npm run prisma:generate  # Regenerate Prisma Client after schema changes
npm run prisma:push      # Sync schema to DB (dev only, no migration history)
npm run prisma:seed      # Seed demo data using @faker-js/faker
npm run prisma:studio    # Open Prisma Studio GUI
```

### Environment Variables

**Frontend** (`.env.local`): `NEXT_PUBLIC_API_URL=http://localhost:3001`

**Backend** (`.env`):

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/invoice_db?schema=public
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=re_xxxxxxxxxxxx
FRONTEND_URL=http://localhost:3000
```

## Architecture

### Monorepo Structure

```
invoice-app/
├── app/           # Next.js App Router pages and layouts
├── components/    # Shared React components
├── hooks/         # Custom React hooks
├── lib/           # API client functions (fetch wrappers)
├── shared/types/  # TypeScript types shared between frontend and backend
├── backend/
│   ├── src/
│   │   ├── auth/      # Auth module (JWT, email verification)
│   │   ├── invoices/  # Invoice CRUD
│   │   ├── clients/   # Client CRUD
│   │   ├── prisma/    # Global PrismaService
│   │   ├── middleware/ # LoggerMiddleware (all routes)
│   │   └── filters/   # HttpExceptionLoggerFilter
│   └── prisma/        # schema.prisma + migrations + seed.ts
└── tsconfig.base.json # Shared TS config; defines @shared/* path alias
```

### Backend (NestJS)

- **Modules**: `Auth`, `Invoices`, `Clients` all import the global `PrismaModule`
- **Auth flow**: Register → Resend email verification → Login → JWT in HTTP-only cookie → JwtAuthGuard on protected routes
- **Swagger docs**: Available at `http://localhost:3001/api` in dev

### Frontend (Next.js)

- API calls go through `lib/` functions using `fetch` with `credentials: "include"` for cookie-based auth
- `shared/types/` provides shared DTOs and interfaces — import via `@shared/*` alias
- Internationalization: UI language via `react-i18next`; invoice language (en/ja) is stored per-invoice in the DB

### Database Models (Prisma + PostgreSQL)

- `User` — auth fields + personal/address info + `isVerified` / `verificationToken`
- `Invoice` — belongs to User; optional Client; has many Tasks; currency enum (JPY/USD/EUR/GBP/AUD); language enum (en/ja)
- `Task` — child of Invoice (name, rate, hours); deleted and recreated on invoice update
- `Client` — belongs to User; can be linked to many invoices
- `BankAccount` — belongs to User

### Testing

- Tests live in `backend/src/**/*.spec.ts`, run with Jest + ts-jest
- Uses `@nestjs/testing` `Test.createTestingModule()` with mocked PrismaService
- Current coverage: AuthService, InvoicesService, ClientsService

## language

- comments, words to be used should be English
