# Developer README
Website is working here https://hiring-platform-vioy.vercel.app/
Setup (Windows/PowerShell):
1. Install Node.js 18+ and npm
2. cd frontend
3. npm install
4. npm run dev

Quick facts:
- Vite + React + TypeScript
- Dexie (IndexedDB) for local persistence
- MSW mocks that read/write the Dexie DB

Key files:
- src/db.ts Dexie schema
- src/utils/seedData.ts seeder and backfill helper
- src/utils/api.ts fetch wrapper and toast policy
- src/mocks/handlers.ts mocked REST endpoints

Dev helpers:
- window.__DEV__.backfillAllTimelines(force) populates timeline and notes
- Seeder targets: 25 jobs, 1000 candidates, 3 assessments

Decisions:
- Seeder is idempotent and inserts in chunks for robustness
- Global toasts shown only for server 5xx errors; callers handle 4xx
- Timeline timestamps are normalized to Date objects for UI stability
- MSW uses Dexie so API responses reflect local state

Known issues:
- Final comment cleanup under frontend/src is pending
- Seeder is non-deterministic; add a seedable RNG for reproducible tests

Validate locally:
cd frontend
npm install
npm run dev

For backfill (dev only): open browser console and run:
await window.__DEV__.backfillAllTimelines(true)

Run typecheck:
npx tsc --noEmit

Branching suggestion:
git checkout -b chore/remove-src-comments
git add -A
git commit -m "chore: concise developer README"
