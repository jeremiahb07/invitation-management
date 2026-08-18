# invitation

An Express 5 + TypeScript HTTP API running on Node.

> TODO: describe what this project does.

## Requirements

- Node (ESM)
- npm

## Getting started

```bash
npm install
npm run dev
```

The server listens on http://localhost:3000. Set `PORT` to override.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with watch mode (`tsx`) |
| `npm run build` | Typecheck and compile to `dist/` |
| `npm run start` | Run the compiled server (build first) |

No linter or test runner is configured yet.

## Project layout

```
src/
  server.ts    app wiring, middleware, listen
```

Conventions for contributors and AI coding agents live in [AGENTS.md](AGENTS.md).
