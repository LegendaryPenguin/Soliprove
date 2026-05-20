# Phase 3 Lite — implementation notes

Execute in **Agent mode** (Plan mode blocks `.ts` edits). Dependencies already installed: `zod`, `@turf/intersect`, `@turf/centroid`.

## Cape Girardeau default

Create `src/lib/defaults/location.ts` and import `CAPE_GIRARDEAU` in:
- `src/context/soilprove-context.tsx` — `DEFAULT_DRAFT` lat/lon/zip, `pinPlaced: true`
- `src/lib/mock/field-profile.ts` — `MO` in `MOCK_LOCATIONS`, fallbacks `Cape Girardeau` / `MO`
- `src/app/page.tsx` — hero card text
- `src/app/api/geocode/search/route.ts` — ZIP fallback coords
- `src/components/wizard/step-field.tsx` — search placeholder
- `src/data/peer-fields.json` — add 2–3 peers near `37.3, -89.5`

## APIs

- `src/app/api/geocode/route.ts` — Census coordinates reverse geocode
- `src/app/api/nass/route.ts` — Quick Stats when `NASS_API_KEY`, else table incl. Cape Girardeau ~192 bu/ac
- `src/app/api/weather/route.ts` — NWS `/points` then forecast URL
- `src/app/api/soil/route.ts` — MO regional series (Sharkey / Dexter) by lat band
- `src/app/api/fertilizer-prices/route.ts` — `MO: 0.51`, `asOf` ISO date

## Zones

- `src/lib/geo/zones.ts` — `createZonesForField()` with `@turf/intersect`
- `src/lib/recommendation/index.ts` — use zone acres from geometry areas

## Validation & UX

- `src/lib/validation/farmer-input.ts` — Zod schema
- `src/context/soilprove-context.tsx` — validate before generate; `fetch` recommendation API
- `src/components/wizard/wizard-shell.tsx` — Reset wizard button
- `src/components/wizard/step-input.tsx` — `value` not `defaultValue` on soil test
- `src/components/map/field-map.tsx` — `validateBoundary` on pm:create/edit
- `src/lib/recommendation/nitrogen.ts` — remove duplicate `corn_after_corn +30`
- `src/components/wizard/step-context.tsx` — show `dataAsOf` / live flag when present

## Verify & commit

```bash
npm run build
npm run verify
git add -A
git commit -m "Phase 3 Lite: Cape Girardeau default, live geocode/NASS/weather, boundary zones, validation"
```
