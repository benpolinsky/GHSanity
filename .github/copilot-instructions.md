# Copilot Instructions for GH Sanity

## Project Overview

GH Sanity is a GitHub notifications management app built with **Next.js 15** (App Router, Turbopack) and **React 19**. It provides filtering, prioritization, and bulk actions for GitHub notifications.

## Tech Stack

- **Framework:** Next.js 15 with App Router (`src/app/`)
- **Language:** TypeScript (strict mode)
- **Styling:** CSS Modules (`.module.css` files)
- **State Management:** React Context + `useReducer` (`src/store/`)
- **Testing:** Vitest + React Testing Library + jsdom
- **Linting:** ESLint (next/core-web-vitals, next/typescript) + Prettier
- **Package Manager:** pnpm

## Project Structure

- `src/app/` — Next.js App Router pages and API helpers
- `src/components/` — React components (filters, icons, notifications, settings)
- `src/hooks/` — Custom React hooks (e.g., `useNotifications`)
- `src/store/` — App state (Context, Reducer, Storage)
- `src/shared/` — Shared utilities
- `src/types.ts` — Shared TypeScript types

## Conventions

- Use the `@/` path alias for imports from `src/` (e.g., `import { Notification } from "@/types"`)
- Components use CSS Modules for styling — co-located `.module.css` files alongside components
- Client components must include the `"use client"` directive
- State changes go through the reducer via `dispatch({ type: "ACTION_NAME", payload })` — action types are uppercase snake_case strings
- Types and interfaces live in `src/types.ts` unless component-specific
- Use `vitest` for testing (`pnpm vitest`), with globals enabled — no need to import `describe`/`it`/`expect`

## Key Patterns

- GitHub API calls are in `src/app/api/github.ts` and use a `NEXT_GH_TOKEN` env variable
- Notifications are fetched via the `useNotifications` hook, which dispatches to the global reducer
- Filtering logic (type, state, draft, reason, labels) is composed in `src/shared/filterHelpers.ts`
- Settings (label filters, prioritized repos) are persisted via `AppStorage`

## Development

- `pnpm dev` — starts dev server on port 7878 with Turbopack
- `pnpm build` — production build
- `pnpm lint` — ESLint
- `pnpm prettier` — Prettier check
- CI runs TypeScript check, lint, prettier, and build on push/PR to main
