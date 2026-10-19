# Engineering Rules (follow on every task)

## 1. Scope: smallest change that works
- Make the minimal change needed to deliver the requested behavior. Do not refactor, rename, reformat, or "improve" unrelated code.
- Before writing new code, search the codebase for existing functions, components, hooks, or utils that already do the job. Reuse them.
- If logic is needed in 2+ places, put it in ONE shared file (e.g. `utils/`, `lib/`, `services/`) and call it from each place. Never copy-paste logic.
- Do not add new libraries unless truly needed. If you think one is needed, ask first.

## 2. Readability: a human must understand it in one read
- Write simple, boring, explicit code. Prefer clarity over cleverness.
- Small functions that do one thing. Descriptive names (`getUserById`, not `getU`).
- Avoid deep nesting; use early returns.
- Comment the "why", not the "what". Add a short comment for any non-obvious decision.
- Code must be easy to debug: clear flow, meaningful error messages, useful logs at boundaries (API calls, DB calls, external services).

## 3. Maintainability and standards
- Follow the existing project structure, naming, and style. Match what is already there.
- Keep a clear separation: routes/controllers (HTTP only) -> services (business logic) -> data layer (DB queries).
- No magic numbers or hardcoded strings/URLs/secrets. Use constants and environment variables.
- Validate all external input (request bodies, params, env vars) at the boundary.
- Handle errors explicitly: never swallow errors silently; return consistent error shapes.
- Use TypeScript types properly. No `any` unless unavoidable, and say why.
- Never commit secrets. Keep `.env.example` updated when adding env vars.

## 4. Long-term over short-term
- Prefer the solution that is easier to maintain, test, and extend over the quicker hack.
- Never leave TODO hacks, dead code, commented-out code, or debug logs behind.
- If the correct fix needs a bigger refactor than the task allows, do the minimal safe version and tell me what the bigger fix would be. Do not do the big refactor on your own.

## 5. Ask before deciding
- If there are 2 or more reasonable approaches (library, pattern, data model, API design, folder structure), STOP and ask me. Give each option with a short pro/con and your recommendation.
- If the requirement is unclear or has missing info, ask. Do not guess.
- Always ask before: deleting files or data, changing DB schema or migrations, changing public API contracts, installing/upgrading dependencies, or touching auth/security/payment code.

## 6. Database and API safety
- Schema changes go through migrations only. Never edit the DB manually or reset data without asking.
- Keep queries efficient: no N+1 queries, add indexes when filtering/sorting on large tables, paginate list endpoints.
- Keep API responses consistent (status codes, error format, naming).
- Never expose sensitive fields (passwords, tokens) in responses or logs.

## 7. Verify your work
- Run the project's lint, type check, and tests after changes and fix what you broke. Say clearly if you could not run them.
- Add or update tests for new logic, especially shared utilities and business rules.
- Never claim something works unless you checked it.

## 8. How to communicate
- Before coding a non-trivial task: give a short plan (files you will touch, and why).
- After coding: summarize what changed, which files, and anything I should review or decide.
- Be honest about risks, assumptions, and things you were unsure about.
- Keep git changes focused: one concern per commit, clear commit messages.
