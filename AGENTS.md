# Fitzroya Desarrollos - AI Assistant Guidelines

## Project Overview

This is a Next.js 16 App Router site for Fitzroya Desarrollos. It includes the public marketing site, project pages, financing calculator, lead capture, blog/admin tools, and a small CRM/admin surface.

### Tech Stack

- Framework: Next.js 16 with App Router, React 19, TypeScript
- Authentication: BetterAuth with Email/Password
- Database: PostgreSQL with Drizzle ORM
- UI: shadcn/ui components with Tailwind CSS 4
- AI Integration: Vercel AI SDK 5 + OpenRouter
- Package manager: pnpm

## Core Working Rules

- Be concise and evidence-based. Do not invent state or assume DB contents without checking code, migrations, or the live DB when needed.
- Read the existing code before changing behavior. Prefer local patterns over new abstractions.
- Do not remove files, data columns, queries, UI features, or content just to silence an error. If a schema/runtime mismatch appears, fix the migration/state or raise it clearly.
- Preserve existing UX copy and navigation labels unless the user explicitly asks to change them. Example: the projects dropdown first item should remain "Ver todos los proyectos".
- Do not start the dev server yourself. If visual/manual confirmation is needed, ask the user to test locally.
- Do not use Playwright/browser automation unless explicitly requested.
- Do not delete assets unless the user explicitly asks to delete the file. Removing a reference from UI is not the same as deleting the asset.
- When the user asks for `checkpoint y push`, run verification, commit the current intended work, and push.

## Project Visibility Rules

The database is the source of truth for project visibility.

- `project.is_visible = true`: public project.
- `project.is_visible = false`: hidden from public frontend surfaces.
- Admin pages must always list all projects, visible and hidden.
- Public users should not see hidden projects in home listings, `/proyectos`, header, footer, calculator project options, or sitemap.
- Logged-in admins may see hidden project pages and should get a visible/hidden badge.
- Direct public access to hidden project pages should return `notFound()`.
- Do not reintroduce hardcoded project lists for public surfaces. Use DB-backed helpers.
- If navigation/listings depend on session state, make the route/component dynamic and avoid cached public responses.

## Database Rules

- Use Drizzle ORM from `@/lib/db`.
- Schema lives in `src/lib/schema.ts`.
- After schema changes:
  1. Generate migration with `pnpm db:generate`.
  2. Review the generated SQL.
  3. Apply with `pnpm db:migrate` when local DB behavior must be verified.
  4. If the dev server was running, restart it before debugging stale runtime errors.
- Do not skip migrations to work around `column does not exist` or similar DB errors.
- Prefer additive/backfill-safe migrations when existing data matters.

## Auth/Admin Rules

- Server auth uses `@/lib/auth` and helpers in `@/lib/session`.
- Unauthenticated `/admin` access should redirect to `/login?callbackURL=/admin`.
- Login should respect `callbackURL`; default post-login destination is `/admin`.
- `requireAdmin()` should block logged-in non-admin users from seeing CRM/admin pages.
- Use a DB role check for admin-only behavior when BetterAuth session fields do not expose custom role fields.

## Public Site Rules

- Keep public pages SEO-safe: hidden projects should not appear in public sitemap or public structured project listings.
- Do not remove existing project pages just because a project is hidden. Visibility is a DB/admin concern.
- For San Nicolas videos:
  - Keep both videos in the existing "Conoce San Nicolas" section unless the user asks otherwise.
  - Do not replace the hero with the project video unless explicitly requested again.
  - Do not delete video files.

## Commands

Use pnpm, not npm.

```powershell
pnpm dev
pnpm typecheck
pnpm lint
pnpm build:ci
pnpm db:generate
pnpm db:migrate
git status --short
git diff --stat
git diff --check
git add -A
git commit -m "Clear commit message"
git push origin master
```

Do not run `pnpm dev` yourself unless the user explicitly asks you to start the local server.

## Verification Expectations

For code changes:

```powershell
pnpm typecheck
pnpm lint
```

For larger app/router/schema changes:

```powershell
pnpm build:ci
```

Lint warnings may already exist. Report warnings honestly, but do not claim lint failed if it exits successfully.

## OpenRouter AI Rules

- This project uses OpenRouter, not direct OpenAI.
- Use `@openrouter/ai-sdk-provider`.
- Default model is controlled by `OPENROUTER_MODEL`.
- Chat backend lives at `src/app/api/chat/route.ts`.

## File Storage

- Use the storage abstraction from `@/lib/storage`.
- Local development storage is served from `public/uploads/`.
- Vercel Blob is used when `BLOB_READ_WRITE_TOKEN` is configured.

## Checkpoint Workflow

Before committing:

1. Run `git status --short`.
2. Call out unrelated or surprising files before staging.
3. Run `pnpm typecheck`.
4. Run `pnpm lint`.
5. Run `pnpm build:ci` for larger or schema/router changes.
6. Run `git diff --check`.
7. Commit with a specific message.
8. Push to `origin master`.