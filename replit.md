# Smart Venom K Academy

A comprehensive Arabic+English programming education platform with 7 programming languages (Python, JS, TS, Java, C++, Rust, Go) plus human languages (English, German, French), XP/gamification, subscription management with admin approval, code editor/playground, quizzes, leaderboard, and achievements.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/academy run dev` — run the frontend (port auto, served at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session encryption

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + wouter + Recharts + Monaco Editor
- API: Express 5 with pino logging
- DB: PostgreSQL + Drizzle ORM
- Auth: Session-based (bcryptjs + express-session + connect-pg-simple)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/academy/` — React+Vite frontend (all pages, contexts, components)
- `artifacts/api-server/src/routes/` — Express 5 API routes (auth, courses, lessons, quizzes, users, subscriptions, leaderboard, admin)
- `lib/db/src/schema/` — Drizzle ORM schema (users, courses, chapters, lessons, quiz_questions, user_progress, subscriptions, achievements, activity_log)
- `lib/api-client-react/src/generated/api.ts` — Auto-generated Orval hooks (from OpenAPI spec)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contract)

## Architecture decisions

- Session-based auth (not Clerk/Replit SSO) for full admin control over subscriptions and user management
- Admin manually approves subscription requests (WhatsApp support: +201034009418)
- XP level formula: `Math.floor(Math.sqrt(xp / 100)) + 1`
- Courses use `isActive` flag and `sortOrder` for ordering
- Quiz answers stored by index as string (`correct_option_id` column)
- `courses.id` must be used explicitly in SQL subqueries (Drizzle interpolates as bare `"id"` otherwise)

## Product

- Landing page with Arabic/English toggle and hero CTA
- Course catalog: 7 programming languages + 3 human languages
- Lesson viewer with Monaco code editor and live quiz per lesson
- XP/level gamification with achievements and streak tracking
- Leaderboard (public, top users by XP)
- Subscription requests flow (student requests → admin approves via Admin panel)
- Admin dashboard: stats, user management, subscription approval/rejection
- WhatsApp support button fixed at bottom-right (`https://wa.me/201034009418`)
- Full RTL Arabic support + dark theme

## Seeded accounts

- Admin: `admin@smartvenomk.com` / `Admin@SVK2025!`
- Demo student: `demo@smartvenomk.com` / `Admin@SVK2025!`

## User preferences

- Arabic-first platform (RTL) with English toggle
- Dark theme (deep navy/purple)
- WhatsApp number: 01034009418

## Gotchas

- Always use `courses.id` (not `${coursesTable.id}`) in raw SQL subqueries to avoid ambiguous column error
- Run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec change before touching frontend
- `pnpm --filter @workspace/db run push` then restart api-server after schema changes

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
