# stick-it-v2 — Design Document

> Living document. Updated after every change request. Sections stay empty until decided — nothing here is speculative.

## 1. Overview

**stick-it** — a public micro-posting app. A user makes an account, writes a short "sticky note", and it appears on a single global feed that every user sees update in real time. Closest analogue: Twitter, with one shared timeline rather than follows.

Core loop: sign up → post a note → watch the global feed move.

Implications this places on the stack:

- Accounts and sessions — Supabase Auth.
- One shared feed, not per-user timelines — no follow graph, no fan-out.
- Real-time delivery — Supabase Realtime. Realtime respects RLS, and the table must be added to the `supabase_realtime` publication before changes broadcast.
- Notes are world-readable but only author-writable, so read and write policies differ. See §8.

## 2. Decisions Log

| Date       | Decision                                                                                                                                   | Reason                                                                                                                                                                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-04 | Repo initialized as empty dir; `DESIGN.md` created as single source of truth                                                               | Incremental build — spec grows one request at a time                                                                                                                                                                                                                                                                                              |
| 2026-09-04 | Backend = Supabase (Postgres + Auth + Data API)                                                                                            | Managed Postgres w/ row-level auth; official TanStack Start integration exists                                                                                                                                                                                                                                                                    |
| 2026-09-04 | Supabase project settings: Data API **on**, auto-expose new tables **off**, automatic RLS **on**                                           | Data API required by `supabase-js`. Auto-expose off keeps table grants explicit — a second lock behind RLS. Auto-RLS trigger removes the "forgot to enable RLS" failure mode                                                                                                                                                                      |
| 2026-09-04 | Scaffolded TanStack Start in repo root via `@tanstack/cli create --target-dir . --package-manager pnpm --framework React --no-git --force` | Flat layout, no nested folder; git already initialized                                                                                                                                                                                                                                                                                            |
| 2026-09-04 | `unrs-resolver` build script allowed in `pnpm-workspace.yaml`                                                                              | pnpm 11 blocks install scripts by default; this native resolver (pulled in by the TanStack ESLint config) needs its script to link the platform binary                                                                                                                                                                                            |
| 2026-09-04 | Removed `pnpm.onlyBuiltDependencies` from `package.json`                                                                                   | pnpm 11 no longer reads that field — `allowBuilds` in `pnpm-workspace.yaml` replaces it                                                                                                                                                                                                                                                           |
| 2026-09-04 | No test runner, no extra npm scripts                                                                                                       | Add only when a need appears                                                                                                                                                                                                                                                                                                                      |
| 2026-09-04 | Deleted scaffold `README.md` and `AGENTS.md`; stripped placeholder UI from `index.tsx`; app title set to `stick-it`                        | Learning TanStack Start — keep the tree small enough to read end to end                                                                                                                                                                                                                                                                           |
| 2026-09-04 | Added `/login` and `/register` as placeholder routes                                                                                       | Route shells first, forms and auth wiring later                                                                                                                                                                                                                                                                                                   |
| 2026-09-04 | App concept fixed: accounts + sticky notes on one global real-time feed                                                                    | Scopes out follow graphs, per-user timelines, and fan-out entirely                                                                                                                                                                                                                                                                                |
| 2026-09-04 | Added shadcn (`base-nova`); it replaced the `#/*` path alias with `@/*`                                                                    | Component primitives without hand-rolling them; alias swap was shadcn's doing, not a deliberate choice                                                                                                                                                                                                                                            |
| 2026-09-25 | Installed `@supabase/supabase-js` + `@supabase/ssr`; browser and server clients in `src/lib/supabase/`                                     | Matches the integration pattern recorded in §3                                                                                                                                                                                                                                                                                                    |
| 2026-09-25 | Env keys named `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`                                                                       | The `PUBLISHABLE` in the name marks it browser-safe, so it can never be mistaken for the service-role key                                                                                                                                                                                                                                         |
| 2026-09-25 | Generated types live at `src/lib/supabase/database.types.ts`, not the repo root                                                            | Keeps the client imports relative and short; root was only the CLI's default output path                                                                                                                                                                                                                                                          |
| 2026-09-25 | `supabase/.temp` gitignored; `supabase/` itself kept                                                                                       | `supabase/migrations/` will live there — the folder is the CLI's project root, not clutter                                                                                                                                                                                                                                                        |
| 2026-09-25 | Generated files excluded from ESLint (`routeTree.gen.ts`, `database.types.ts`)                                                             | Generated code fails the TanStack naming rules and is rewritten on every regen                                                                                                                                                                                                                                                                    |
| 2026-09-25 | Supabase agent skills vendored in `.agents/skills/`, symlinked into `.claude/skills/`                                                      | `.agents/` is the cross-tool layout the Supabase skill installer writes; Claude Code only reads `.claude/skills/`                                                                                                                                                                                                                                 |
| 2026-09-25 | `.agents/` and `.claude/` committed, not ignored                                                                                           | The `.claude/skills` symlinks point into `.agents/`; ignoring either leaves a fresh clone with dangling links                                                                                                                                                                                                                                     |
| 2026-09-25 | `server.ts` reads `import.meta.env`, not `process.env`                                                                                     | Vite loads `.env` into `import.meta.env` only. Safe here because both values are public; a service-role key must never be read this way, since Vite inlines the value into the bundle at build time                                                                                                                                               |
| 2026-09-25 | Schema workflow: **dashboard SQL editor only. No migration files in this repo.**                                                           | Owner's call. Consequence: the database is the sole source of truth for schema — nothing in git records it. Verify live state with `supabase db query --linked`, and re-run `pnpm gen:types` after every schema change                                                                                                                            |
| 2026-09-25 | `supabase/config.toml` kept (from `supabase init`), `supabase/migrations/` removed                                                         | The config anchors read-only CLI tooling — `db query --linked`, `db advisors` — without introducing SQL files                                                                                                                                                                                                                                     |
| 2026-09-25 | Profile rows created by an `after insert on auth.users` trigger, not by client code                                                        | Atomic with user creation and works for every signup path; a client-side insert can fail halfway and leave a user with no profile                                                                                                                                                                                                                 |
| 2026-09-25 | Trigger function lives in a `private` schema with `EXECUTE` revoked                                                                        | Postgres grants `EXECUTE` to `PUBLIC` on every new function, so a `security definer` function in `public` is an endpoint callable by `anon`                                                                                                                                                                                                       |
| 2026-09-26 | Auth mutations run in server functions (`src/lib/auth.ts`), not from the browser client                                                    | The session cookie arrives as `Set-Cookie` from our own origin, so the next SSR render already knows the user                                                                                                                                                                                                                                     |
| 2026-09-26 | Server functions return `{ error: string \| null }`, never Supabase's raw response                                                         | The raw response carries `access_token` and `refresh_token`. Cookies are the one authoritative store; a copy in React state also goes stale when tokens rotate                                                                                                                                                                                    |
| 2026-09-26 | Navigate client-side with `useNavigate` instead of `throw redirect()` from the handler                                                     | With a thrown redirect, `useServerFn` returns `router.navigate(...)` — so `result` is `undefined` while TypeScript still types it as the handler's return. The types were lying; this makes them honest                                                                                                                                           |
| 2026-09-26 | Email confirmation disabled in the Supabase dashboard                                                                                      | Defers the `/auth/confirm` route. Re-enabling makes `signUp` return a null session, so the success path must change at the same time                                                                                                                                                                                                              |
| 2026-09-27 | Session read with `getClaims()`, never `getSession()`                                                                                      | The `@supabase/ssr` cookie is `httpOnly: false`, so the browser can rewrite it and `getSession()` would trust a forged cookie — it only decodes. `getClaims()` verifies the signature against the project JWKS. This project signs ES256, so verification is local and cached; on a symmetric project it falls back to a `getUser()` network call |
| 2026-09-27 | Session loaded once in the root route's `beforeLoad`, read from route context                                                              | Child guards get it typed for free, and deleting the root loader turns every guard into a compile error instead of a silent `undefined`                                                                                                                                                                                                           |
| 2026-09-27 | `router.invalidate()` after every auth mutation                                                                                            | The router holds the context it computed before the cookie changed; without invalidating, a fresh login navigates with `context.user` still null                                                                                                                                                                                                  |

## 3. Stack

Framework: TanStack Start (React), Vite 8, React 19, TypeScript 6, Tailwind 4.
UI: shadcn (`base-nova` style, built on Base UI — _not_ Radix), `lucide-react` icons, Inter Variable via `@fontsource-variable/inter`. Class merging via the `cn` package (shadcn's own, re-exported from `src/lib/utils.ts`).
Tooling: ESLint (`@tanstack/eslint-config`) + Prettier. Package manager: pnpm.

Path alias: `@/*` → `./src/*`, declared in `tsconfig.json` and resolved by Vite's `tsconfigPaths`.

Backend: Supabase — not yet installed. Planned packages: `@supabase/supabase-js`, `@supabase/ssr`.
Cookie helpers for the server client: `@tanstack/react-start/server` (`getCookies`, `setCookie`, `setResponseHeader`).

Scripts: `dev`, `build`, `preview`, `lint`, `format`, `check`, `generate-routes`, `gen:types`.

`gen:types` hardcodes the Supabase project ref. That ref is not a secret — it is the subdomain of `VITE_SUPABASE_URL`, which ships to the browser regardless.

## 4. Architecture

_TBD — components, data flow, boundaries._

## 5. Data Model

Current live schema (from `src/lib/supabase/database.types.ts`):

| Table             | Columns                                                                                        | Notes                                                                                                                                                                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public.profiles` | `id` (uuid, PK, FK → `auth.users.id` `on delete cascade`), `username` (text, NOT NULL, UNIQUE) | RLS on. **Zero policies and zero DML grants, so the table is still unreadable from the app** — a SELECT grant and policy are outstanding. No INSERT grant or policy by design: rows come only from the signup trigger, which bypasses RLS |

Open schema question: `NOT NULL` does not reject `''`. The server function rejects a blank username at the app layer; a `CHECK (length(trim(username)) > 0)` would enforce it for every caller.

Because the unique violation fires inside the trigger, a duplicate username rolls back the `auth.users` insert and GoTrue reports only `Database error saving new user`. The account is correctly not created, but the message is opaque. A pre-flight availability check would improve the message without replacing the constraint as the real guarantee — it needs the same SELECT grant as reading profiles, and it is inherently racy.

Not yet created: the notes table backing the global feed.

Profile creation: `public.handle_new_user()`, a `security definer` trigger function fired by `on_auth_user_created` `after insert on auth.users`. It reads `new.raw_user_meta_data ->> 'username'` into `profiles.username`, then strips the key from `auth.users`.

So the client supplies username through `signUp({ options: { data: { username } } })`. Consequence worth remembering: the access token minted during that same signup still carries the original metadata, so `user_metadata.username` is present on the first session and gone after a refresh. **Read username from `profiles`, never from the JWT.**

Design constraints already known:

- `auth.users` is Supabase's, in the `auth` schema — no custom columns, not selectable from the client. All public user data belongs in `public.profiles`, keyed to `auth.users.id`.
- Realtime broadcasts row changes, not joins. A `notes` INSERT payload carries only `notes` columns, so an author name on the feed means either denormalizing it onto the row or fetching the profile when the event lands.

## 6. Interfaces

### UI

Routing is file-based: a file in `src/routes/` becomes a URL, and the Vite plugin regenerates `src/routeTree.gen.ts` on save.

| Route         | File                                           | State                                                                   |
| ------------- | ---------------------------------------------- | ----------------------------------------------------------------------- |
| `/`           | `src/routes/index.tsx`                         | Placeholder                                                             |
| `/login`      | `src/routes/login.tsx`                         | **Working.** Posts to `signIn`; redirects to `/` when already signed in |
| `/register`   | `src/routes/register.tsx`                      | **Working.** Posts to `signUp`; redirects to `/` when already signed in |
| any unmatched | `notFoundComponent` in `src/routes/__root.tsx` | 404 page with a link home                                               |

### Server functions

All live in `src/lib/auth.ts`. Each is a public HTTP endpoint, so its validator is a trust boundary rather than a convenience.

| Function         | Input          | Returns                                                                         |
| ---------------- | -------------- | ------------------------------------------------------------------------------- |
| `signUp`         | `SignUpSchema` | `{ error: string \| null }`                                                     |
| `signIn`         | `SignInSchema` | `{ error: string \| null }`                                                     |
| `signOut`        | none           | `{ error: string \| null }` — `scope: 'local'`, so other devices stay signed in |
| `getCurrentUser` | none           | `{ id, email } \| null`                                                         |

### Route protection

`beforeLoad` covers what Next.js splits between middleware and page-level checks: it runs on the server during SSR and on the client during navigation, from one declaration. (`createMiddleware` exists in TanStack Start but applies to server functions, not routes.)

**`beforeLoad` guards are UX, not security.** They run on the client during client-side navigation and can be bypassed. Enforcement belongs in RLS policies and inside the server functions; a guard only saves a wasted render.

Current guards: `/login` and `/register` redirect to `/` when `context.user` is set. No page yet requires a session.

## 7. File Map

| Path                                 | Responsibility                                                             |
| ------------------------------------ | -------------------------------------------------------------------------- |
| `src/router.tsx`                     | Router factory; augments `Register` so route types resolve app-wide        |
| `src/routes/__root.tsx`              | Root layout, HTML shell, devtools                                          |
| `src/routes/index.tsx`               | `/` route                                                                  |
| `src/routes/login.tsx`               | `/login` route — form markup only, not wired                               |
| `src/routes/register.tsx`            | `/register` route — signup form                                            |
| `src/lib/auth.ts`                    | Auth server functions. `signUp` today; `signIn`/`signOut` to follow        |
| `src/components/ui/`                 | shadcn-generated primitives — regenerated by `shadcn add`, don't hand-edit |
| `src/lib/utils.ts`                   | Re-exports `cn`                                                            |
| `src/lib/supabase/client.ts`         | Browser Supabase client                                                    |
| `src/lib/supabase/server.ts`         | Server Supabase client — cookie-backed session                             |
| `src/lib/supabase/database.types.ts` | Generated from the live schema by `pnpm gen:types` — never hand-edit       |
| `supabase/`                          | Supabase CLI project root; migrations will live in `supabase/migrations/`  |
| `.agents/skills/`                    | Vendored Supabase agent skills, pinned by `skills-lock.json`               |
| `components.json`                    | shadcn config: style, aliases, css entry                                   |
| `src/routeTree.gen.ts`               | Generated route tree — never edit by hand                                  |
| `src/styles.css`                     | Tailwind entry                                                             |
| `vite.config.ts`                     | Vite plugins: devtools, tailwind, tanstackStart, react                     |
| `pnpm-workspace.yaml`                | pnpm `allowBuilds` — which packages may run install scripts                |
| `DESIGN.md`                          | This document                                                              |

## 8. Conventions

### Database

Schema changes are made in the Supabase dashboard SQL editor. There are no migration files. Every table added there needs all three of the following, or it will not work:

1. RLS enabled — the project's auto-RLS trigger does this for new `public` tables, but only those.
2. An explicit `grant` to `authenticated` (and `anon` only if genuinely public). "Automatically expose new tables" is off, so without a grant the Data API returns `permission denied for table`.
3. At least one policy. RLS on with no policy denies everything — no error, just no rows.

After any schema change: run `pnpm gen:types` to refresh `database.types.ts`, and `pnpm dlx supabase db advisors --linked` to catch security regressions. The advisor is the check that replaces reviewing a migration diff.

`security definer` functions: always `set search_path = ''`, and always `revoke execute ... from public, anon, authenticated`. Postgres grants `EXECUTE` to `PUBLIC` on every new function, so a `security definer` function in `public` is otherwise a callable API endpoint.

### Secrets

`VITE_`-prefixed env vars are shipped to the browser bundle. Only the publishable/anon key belongs there. The service-role key is a non-prefixed server-only var and must never be imported into a file reachable from a component.

## 9. Open Questions

- What is the app? Awaiting first feature request.
- Confirm TanStack Start as the framework, then scaffold.
