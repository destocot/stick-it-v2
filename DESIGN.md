# stick-it-v2 — Design Document

> Living document. Updated after every change request. Sections stay empty until decided — nothing here is speculative.

## 1. Overview

_TBD — what the app does, who it is for._

## 2. Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-09-04 | Repo initialized as empty dir; `DESIGN.md` created as single source of truth | Incremental build — spec grows one request at a time |
| 2026-09-04 | Backend = Supabase (Postgres + Auth + Data API) | Managed Postgres w/ row-level auth; official TanStack Start integration exists |
| 2026-09-04 | Supabase project settings: Data API **on**, auto-expose new tables **off**, automatic RLS **on** | Data API required by `supabase-js`. Auto-expose off keeps table grants explicit — a second lock behind RLS. Auto-RLS trigger removes the "forgot to enable RLS" failure mode |
| 2026-09-04 | Scaffolded TanStack Start in repo root via `@tanstack/cli create --target-dir . --package-manager pnpm --framework React --no-git --force` | Flat layout, no nested folder; git already initialized |
| 2026-09-04 | `unrs-resolver` build script allowed in `pnpm-workspace.yaml` | pnpm 11 blocks install scripts by default; this native resolver (pulled in by the TanStack ESLint config) needs its script to link the platform binary |
| 2026-09-04 | Removed `pnpm.onlyBuiltDependencies` from `package.json` | pnpm 11 no longer reads that field — `allowBuilds` in `pnpm-workspace.yaml` replaces it |
| 2026-09-04 | No test runner, no extra npm scripts | Add only when a need appears |
| 2026-09-04 | Deleted scaffold `README.md` and `AGENTS.md`; stripped placeholder UI from `index.tsx`; app title set to `stick-it` | Learning TanStack Start — keep the tree small enough to read end to end |

## 3. Stack

Framework: TanStack Start (React), Vite 8, React 19, TypeScript 6, Tailwind 4.
Tooling: ESLint (`@tanstack/eslint-config`) + Prettier. Package manager: pnpm.

Backend: Supabase — not yet installed. Planned packages: `@supabase/supabase-js`, `@supabase/ssr`.
Cookie helpers for the server client: `@tanstack/react-start/server` (`getCookies`, `setCookie`, `setResponseHeader`).

Scripts: `dev`, `build`, `preview`, `lint`, `format`, `check`, `generate-routes`.

## 4. Architecture

_TBD — components, data flow, boundaries._

## 5. Data Model

_TBD — entities, fields, relationships, storage._

## 6. Interfaces

### UI
_TBD — screens, interactions._

### API / CLI
_TBD — endpoints or commands, inputs, outputs._

## 7. File Map

| Path | Responsibility |
|------|----------------|
| `src/router.tsx` | Router factory; augments `Register` so route types resolve app-wide |
| `src/routes/__root.tsx` | Root layout, HTML shell, devtools |
| `src/routes/index.tsx` | `/` route |
| `src/routeTree.gen.ts` | Generated route tree — never edit by hand |
| `src/styles.css` | Tailwind entry |
| `vite.config.ts` | Vite plugins: devtools, tailwind, tanstackStart, react |
| `pnpm-workspace.yaml` | pnpm `allowBuilds` — which packages may run install scripts |
| `DESIGN.md` | This document |

## 8. Conventions

### Database

Every migration that creates a `public` table must include, in the same file:

1. `alter table ... enable row level security;` — explicit, even though the auto-RLS trigger also does it.
2. Explicit `grant` to `authenticated` (and `anon` only if genuinely public).
3. At least one policy. RLS on with no policy = table unusable.

Auto-RLS covers only *new* tables in `public`. Tables in other schemas, and anything created before the trigger was enabled, must be audited by hand.

### Secrets

`VITE_`-prefixed env vars are shipped to the browser bundle. Only the publishable/anon key belongs there. The service-role key is a non-prefixed server-only var and must never be imported into a file reachable from a component.

## 9. Open Questions

- What is the app? Awaiting first feature request.
- Confirm TanStack Start as the framework, then scaffold.
