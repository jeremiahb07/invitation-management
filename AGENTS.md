# AGENTS.md

Instructions for AI coding agents working in this project. Codex, Cursor, GitHub
Copilot, Gemini CLI, Aider, Zed, Windsurf, and Claude Code all read this file.

## What this is

`invitation` - an Express 5 + TypeScript HTTP API running on Node.

> TODO: describe the problem this project solves.

## Stack

- Runtime: Node, ESM (`"type": "module"`)
- Framework: Express 5
- Language: TypeScript, strict mode, compiled with `tsc` to `dist/`
- Database: MongoDB via Mongoose, reached through `src/lib/db.ts`
- Package manager: npm
- Dev loop: `tsx watch`

No frontend, auth, or validation library is installed. Adding one is a
deliberate, discussed step, never a silent mid-task install.

## Commands

Package manager: **npm** (`package-lock.json`).

- Install: `npm install`
- Dev server: `npm run dev` (tsx watch, http://localhost:3000)
- Build: `npm run build` (`tsc` to `dist/`)
- Production server: `npm run start` (`node dist/server.js`, build first)
- Test: `npm test` (`vitest run`)
- Test watch: `npm run test:watch` (`vitest`)

Typecheck runs as part of `npm run build`; there is no separate typecheck script.

**No lint command.** No linter is configured.

**The test gate is on.** `npm test` must be green before a step is approved,
before any checkpoint commit, and before `/complete` merges. A step that adds
logic ships a passing test in the same diff. Page-rendering and integration steps
are exempt and ride on real request or browser evidence plus the build.

Test files live next to the source file they cover (`src/lib/env.test.ts`).
`tsconfig.json` excludes `src/**/*.test.ts`, so tests stay out of `dist/`; the
tradeoff is that `npm run build` does not typecheck them, and Vitest is what
surfaces a type error in a test.

**No Verify command and no automatic GitHub checks.** Neither is set up yet.

The server reads `PORT` from the environment and falls back to `3000`.

## Conventions

### TypeScript

- Keep `strict: true` on
- No `any` - use proper typing or `unknown`
- Define interfaces for request bodies, response payloads, and data models
- Type Express handlers explicitly: `(req: Request, res: Response)`
- ESM project: relative imports carry a `.js` extension
  (`import { x } from './lib/x.js'`), because that is what the compiled output
  resolves at runtime

### Express

- Keep `src/server.ts` thin: app wiring, middleware, and `listen` only
- Routes live in their own modules and mount onto the app
- Handlers stay thin: parse and validate input, call a function that holds the
  logic, send the response. Business logic belongs in a testable module
- Read configuration from `process.env` with an explicit fallback, as `PORT` does

### File organization

- Server entry: `src/server.ts`
- Routes: `src/routes/[feature].ts`
- Business logic: `src/services/[feature].ts`
- Mongoose models: `src/models/[feature].ts`
- Types: `src/types/[feature].ts`
- Utils: `src/lib/[utility].ts`

Create these directories when a feature needs one, not upfront.

### Naming

- Files: kebab-case (`invite-code.ts`)
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase (no prefix)

### Validation and error handling

- Never trust client input. Every request body, query param, and route param is
  untrusted until validated
- Wrap async handler bodies in try/catch, or route errors to a shared Express
  error middleware
- Return meaningful status codes: 400 bad input, 401/403 auth, 404 missing,
  500 unexpected
- Send a consistent JSON error shape, for example `{ error: "message" }`
- Never leak stack traces or internal messages in a response body; log them
  server-side

### Verification

Prefer real request evidence over reading the code and assuming it works.

- Start with `npm run dev` and exercise the endpoint with `curl` or an equivalent
  client. Capture the actual status code and response body
- Check server log output for unhandled errors during the request
- `npm run build` must succeed; it is the typecheck gate
- `npm test` must pass; it is the logic gate
- The app does render HTML: the guest invitation page and the admin pages, via
  EJS. Check those in a browser and capture what you saw, since a curl of an HTML
  page proves the status code and nothing about the page
- Do not add Playwright or browser E2E tooling. Loading a page yourself is the
  expected check; automating a browser is separate setup work that has not been
  agreed

### Code quality

- No commented-out code
- No unused imports or variables
- Keep functions under 50 lines when possible
- Make minimal changes to accomplish the task; don't refactor unrelated code
- Don't add features that weren't asked for

### Comments

Write code that explains itself; comment only what the code cannot say.

- Comment the **why**, not the **what**. Delete any comment that restates the code
- No banner blocks, section dividers, or narration of obvious code
- A comment earns its place when it captures a non-obvious decision, a gotcha or
  workaround, why a value is what it is, or a link to a spec or issue
- When in doubt, leave the comment out

### Writing

- No em dashes in generated content: docs, comments, commit messages, READMEs
- Use a hyphen for `term - description` separators; rephrase prose with commas,
  parentheses, or a colon. Avoid en dashes and the ellipsis character too

## Working style

- Build in small, reviewable steps rather than one large change
- Show the diff and a short summary for each step
- Ask before committing; don't auto-commit
- Use conventional commit messages (`feat:`, `fix:`, `chore:`)
- No AI attribution in commit messages
- A new branch per feature or fix: `feature/[name]` or `fix/[name]`
- If something isn't working after 2-3 attempts, stop and explain the issue
- Ask for clarification when requirements are unclear
