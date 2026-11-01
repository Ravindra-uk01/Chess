# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Online multiplayer chess app. npm-workspaces + Turborepo monorepo (Node >= 24, npm). The root `README.md` is the unmodified Turborepo starter and does not describe this project.

**Follow [.agents/rules/engineering-rules.md](.agents/rules/engineering-rules.md) on every task.** Key points: make the smallest change that works and reuse existing code; ask before choosing between multiple reasonable approaches; **always ask before** deleting files/data, changing the Prisma schema or migrations, changing API/WebSocket message contracts, adding or upgrading dependencies, or touching auth/security code; keep `.env.example` updated when adding env vars; leave no dead code or debug logs; give a short plan before non-trivial work and summarize changes afterward.

## Commands

Run from the repo root unless noted.

```sh
npm install
npm run docker:up          # Postgres 16 on localhost:5433 (user chess / chess123 / db chess_dev)
npm run dev                # all apps via turbo (runs db:generate first)
npx turbo dev --filter=frontend   # a single app (frontend | backend | websocket-server)
npm run build | lint | check-types
npm run format             # prettier
```

Database (run inside `packages/db`; it reads `DATABASE_URL` from its own `.env` via `prisma.config.ts`):

```sh
npm run db:generate        # regenerate client into packages/db/src/generated/client
npm run db:dev             # prisma migrate dev + generate (creates a migration)
npm run db:push            # push schema without a migration
```

There are no automated tests; every package's `test` script is a placeholder. Lint exists only in `apps/frontend` and `packages/ui`. The frontend `build` (`tsc -b && vite build`) is the main type check.

## Architecture

Three runtime processes share one Postgres database:

- **`apps/frontend`**: Vite + React 18 + React Router 7 + Recoil + Tailwind. Runs on :5173.
- **`apps/backend`**: Express 5 HTTP API on `PORT` (frontend expects :3000). Handles auth only: email/password, guest accounts, Google/Facebook/Apple OAuth via Passport, and forgot/reset password via nodemailer. Routes are in `src/router/auth.ts`, mounted at `/auth`. A node-cron job (`src/jobs`) deletes inactive guest users nightly.
- **`apps/ws`** (package name `websocket-server`): a raw `ws` server on a hard-coded port 8080 that runs all live gameplay with `chess.js`.

Shared packages:

- **`@repo/db`**: Prisma 7 client using the `@prisma/adapter-pg` driver adapter. Its source entry is `src/index.ts`, and the generated client is checked in under `src/generated/client`. Both backend and ws access it through a thin `src/db/index.ts` re-export.
- **`@repo/store`**: Recoil `userAtom`. Its default value calls `GET /auth/refresh` with cookies to restore the session, which is why `App.tsx` wraps routes in `<Suspense>`.
- `@repo/ui`, `@repo/eslint-config`, `@repo/typescript-config`: leftovers from the Turborepo starter.

### Auth flow across services

The backend issues a JWT signed with `JWT_SECRET` and sets it as a cookie (`jwt`/`token`). `/auth/refresh` returns the user object, including `token`. The frontend opens the WebSocket as `ws://…:8080?token=<jwt>`, and `apps/ws/src/auth` verifies it with the same `JWT_SECRET`. **The two services must share `JWT_SECRET`.** Note that `apps/ws` does not import `dotenv`, so its `JWT_SECRET` and `DATABASE_URL` must already be in the process environment; otherwise it silently falls back to `'default_secret'`.

### Game lifecycle (apps/ws)

- `GameManager`: one instance per server. It holds in-memory `games` and a single `pendingGameId` used for random matchmaking, and it dispatches incoming messages by `type`.
- `SocketManager`: a singleton that maps gameId to the sockets in that room and is used for `broadcast`.
- `Game`: wraps a `chess.js` board. A game exists **only in memory** until the second player joins. At that point `updateSecondPlayer` creates the DB `Game` row and broadcasts `INIT_GAME`. Each move is stored as a `Move` row and updates `Game.currentFen` in a single transaction. Abandon and move-clock timers end the game with `TIME_UP`/`ABANDONED` statuses.
- `JOIN_ROOM` rehydrates an in-progress game from the DB (`seedMoves`) after a reconnect or server restart. Finished games return `GAME_ENDED` with their move history.
- Joining a specific game by link is done with `INIT_GAME` plus a `gameId` (see `components/ShareGame.tsx`).

Message type strings live in `apps/ws/src/messages.ts`. The frontend uses the same string literals, so any change to a message must be made on both sides. The frontend keeps one shared socket in `src/context/SocketContext.tsx`, and `hooks/useSocket.ts` re-exports it.

### Frontend layout

Screens are in `src/screens`. Chess UI pieces (board, lobby, setup, and in-game panels) are in `src/components/chess`. Protected routes use `ProtectedRouteWithSuspense` + `Layout`, and guests are allowed on `/play` and `/game/:gameId`. Backend and WS URLs come from `VITE_APP_BACKEND_URL` / `VITE_APP_WEBSOCKET_URL`, with localhost fallbacks. `@repo/store` hard-codes `BACKEND_URL = http://localhost:3000`.

## Environment

Each app has its own `.env` (backend, ws, packages/db). The root `.env`/`.env.example` only configures docker-compose Postgres. Backend vars include `PORT`, `DATABASE_URL`, `JWT_SECRET`, `SESSION_SECRET`, `ALLOWED_HOSTS` (CORS, comma-separated), `CLIENT_ORIGIN`, `AUTH_REDIRECT_URL`, `COOKIE_MAX_AGE`, `SMTP_*`, `GOOGLE_CLIENT_*`, and `FACEBOOK_APP_*`.
