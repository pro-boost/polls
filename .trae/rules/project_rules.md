---
description: Core project rules for the Polling App with QR Code Sharing. Enforces coding conventions, architecture, and tech stack.
globs:
  alwaysApply: true
type: project
---

## Project Rules: Polling App with QR Code Sharing

### Technology Stack

- **Language:** TypeScript
- **Framework:** Next.js (App Router)
- **Database & Auth:** Supabase
- **Styling:** Tailwind CSS with shadcn/ui components
- **State Management:** Server Components for server state; useState/useReducer for local Client Component state
- **API Communication:** Use Next.js Server Actions for mutations; fetch data in Server Components
- **Utility Libraries:** Only `qrcode.react` for generating QR codes; no additional libraries without approval

### Architecture & Code Style

- **Directory Structure:**
  - `/app` → routes/pages
  - `/components/ui` → shadcn/ui components
  - `/components/` → custom reusable components
  - `/lib` → Supabase client, utilities, Server Actions
- **Component Design:** Server Components preferred. Client Components (`'use client'`) only for interactivity.
- **Naming Conventions:** PascalCase for components (CreatePollForm.tsx), camelCase for functions (submitVote.ts).
- **Error Handling:** Use try/catch in Server Actions and Route Handlers; `error.tsx` for route segment errors.
- **Secrets:** Never hardcode API keys; use `.env.local` environment variables.

### Code Patterns

- Forms must call Server Actions for data submission (minimize client-side JS).
- **Do not** create separate API routes and fetch on the client; always use Server Actions.
- **Do not** fetch data in Client Components using useEffect; fetch in Server Components.

### Verification Checklist

When producing code or responses, always ensure:

- Uses Next.js App Router and Server Components for fetching
- Uses Server Actions for mutations (forms)
- Supabase client handles all database interactions
- UI components use shadcn/ui where appropriate
- API keys and secrets come from environment variables, never hardcoded
