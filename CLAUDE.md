# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on port 8090
npm run build    # Build production bundle
npm run start    # Start production server on port 8090
npm run lint     # Run ESLint
```

## Architecture

**Stack:** Next.js 14 App Router, TypeScript, Material Tailwind + Tailwind CSS, Redux Toolkit, Axios.

**Backend:** Separate REST API at `http://localhost:8080`. All HTTP calls go through service classes in `app/api/` — there are no Next.js API routes. The `ConnectAnimapService` in `app/api/builder.ts` centralizes Axios config (base URL, Authorization header, Content-Type).

**Auth:** A hardcoded JWT Bearer token lives in `app/api/builder.ts`. NextAuth is installed but not wired up; the login page does not yet integrate with the backend.

**Data flow:**
1. Server Components (`async` page files) call service classes directly and await the results.
2. Service classes (`AnimeService`, `EpisodeService`, `CharacterService`, etc.) use `ConnectAnimapService` to make Axios requests.
3. Mutations go through Server Actions (`'use server'`), which call services then invoke `revalidatePath()` to bust cache and `redirect()` to navigate.
4. Client Components (`'use client'`) manage modal open/close state and controlled form inputs, then delegate submission to Server Actions.

**Redux:** Store is configured in `lib/store.ts` with a `StoreProvider` in `lib/provider.tsx`, but is minimally used — most state is server-side via Next.js caching.

## Key Data Entities

- **Anime** — central entity; has episodes, songs, studios, categories, image
- **Episode** — belongs to an Anime; multilingual names; linked to Characters
- **Character** — multilingual names; associated with Episodes
- **Song** — belongs to an Anime; type = opening/ending/soundtrack; has channel links (YouTube, Spotify) and Artists
- **Artist** — creator of Songs
- **Category / CategoryUniverse** — classification tags for Anime
- **Studio** — production studio

DTOs for all entities live in `app/api/dtos/`.

## Conventions

- **Path alias:** `@/*` maps to the repo root (configured in `tsconfig.json`).
- **Modals:** defined as Client Components alongside the page that uses them (e.g., `app/anime/component/createAnimeModal.tsx`).
- **Shared UI components** (Navbar, Sidebar, Datepicker, etc.) live in `app/component/`.
- **Tailwind theme:** custom colors extended in `tailwind.config.ts`; uses the `@material-tailwind/react` plugin.
