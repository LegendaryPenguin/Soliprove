# SoilProve — Product phases & checklists

Track what shipped in each phase and what remains for a full pilot. **Phase 3 Lite** (current) adds practical improvements without auth/database depth.

---

## Phase 1 — MVP wizard & rule engine

**Goal:** Map-first 6-step wizard with transparent, rule-based prescriptions.

| # | Item | Status |
|---|------|--------|
| 1 | Next.js app, landing, methodology | Done |
| 2 | 6-step wizard with progress & coach | Done |
| 3 | `localStorage` wizard state | Done |
| 4 | Rule-based N / P / K engine (MRTN-inspired) | Done |
| 5 | Mock field profile (soil, NASS, weather, prices) | Done |
| 6 | Synthetic peer fields JSON | Done |
| 7 | CSV + GeoJSON export API routes | Done |
| 8 | Recharts results + peer UI | Done |

---

## Phase 2 — Map precision, design, exports

**Goal:** Production-feel wizard UX and equipment handoff.

| # | Item | Status |
|---|------|--------|
| 1 | React Leaflet + Geoman draw/upload | Done |
| 2 | Satellite / street tiles, draggable pin | Done |
| 3 | Address & ZIP search (Census forward geocode) | Done |
| 4 | Geolocation with clear errors | Done |
| 5 | Acres from polygon (`@turf/area`) | Done |
| 6 | Design tokens, IBM Plex, landing refresh | Done |
| 7 | Framer Motion step transitions | Done |
| 8 | WizardCoach + demo fallback banner | Done |
| 9 | PDF export (jsPDF) | Done |
| 10 | John Deere OAuth + field list | Done |
| 11 | OEM import guide modals | Done |
| 12 | Soil test CSV parser | Done |
| 13 | `.env.example`, verify scripts, README | Done |

---

## Phase 3 Lite — Pilot polish (build next — no auth/DB)

**Goal:** Realer data, boundary-aware zones, validation, **Cape Girardeau default** — without going too deep.

| # | Item | Status |
|---|------|--------|
| 1 | **Cape Girardeau, MO** as default map pin & demos | Done |
| 2 | Census **reverse** geocode (`POST /api/geocode`) | Done |
| 3 | NASS live fetch when `NASS_API_KEY` set + county table | Done |
| 4 | NWS forecast enrichment on weather route | Done |
| 5 | State-aware soil & fertilizer defaults (MO included) | Done |
| 6 | Zones **clipped** to drawn boundary (`@turf/intersect`) | Done |
| 7 | Zod validation on farm inputs | Done |
| 8 | Recommendation via `POST /api/recommendation` | Done |
| 9 | Reset wizard control | Done |
| 10 | Controlled soil-test fields (CSV sync) | Done |
| 11 | Geoman draw validates boundary acres | Done |
| 12 | Fix double corn-after-corn N bump | Done |
| 13 | Data `asOf` on API payloads + context step labels | Done |

---

## Phase 3A — Accounts & saved fields (deferred)

| # | Item | Status |
|---|------|--------|
| 1 | Farmer auth (Clerk / NextAuth) | Not started |
| 2 | Postgres / Supabase schema | Not started |
| 3 | `/dashboard` — saved fields list | Not started |
| 4 | Prescription history & versioning | Not started |
| 5 | Import `localStorage` on first login | Not started |
| 6 | Multi-device sync | Not started |

---

## Phase 3B — Full live agronomy APIs (partial)

| # | Item | Status |
|---|------|--------|
| 1 | SDA SSURGO spatial query | Not started |
| 2 | NASS Quick Stats (keyed) | **Lite:** optional live + fallback |
| 3 | Full NWS precip / drought | **Lite:** forecast text |
| 4 | AMS live fertilizer prices | Not started |
| 5 | Census reverse geocode | **Lite:** done |

---

## Phase 3C — Advanced zones (partial)

| # | Item | Status |
|---|------|--------|
| 1 | Zones inside drawn boundary | **Lite:** wedge clip |
| 2 | SSURGO map-unit zone splits | Not started |
| 3 | Manual zone rate override | Not started |
| 4 | Zone map on results | Done (Phase 2) |

---

## Phase 3D — Real peer network (deferred)

| # | Item | Status |
|---|------|--------|
| 1 | Opt-in peer outcomes database | Not started |
| 2 | Anonymized county-level storage | Not started |
| 3 | Server-only peer match | Not started |
| 4 | Synthetic vs real badges | Not started |

---

## Phase 3E — Server authority & QA (partial)

| # | Item | Status |
|---|------|--------|
| 1 | Server recommendation endpoint used by UI | **Lite:** done |
| 2 | Zod input validation | **Lite:** done |
| 3 | Playwright e2e | Not started |
| 4 | Unit tests for engine | Not started |
| 5 | CI on Vercel preview | Not started |

---

## Phase 3F — Deere & OEM depth (deferred)

| # | Item | Status |
|---|------|--------|
| 1 | Real Deere Work Plan POST | Not started |
| 2 | OAuth token refresh | Not started |
| 3 | ISOXML / shapefile export | Not started |
| 4 | Deere field ↔ saved field mapping | Not started |

---

## Phase 3G–H — Pilot ops & commercial (deferred)

| # | Item | Status |
|---|------|--------|
| 1 | CCA shareable report link | Not started |
| 2 | In-app feedback | Not started |
| 3 | Terms / privacy for peer data | Not started |
| 4 | Billing / subscriptions | Out of scope |

---

## Default location

All new sessions center on **Cape Girardeau County, Missouri** (`37.3059, -89.5181`, ZIP `63701`) unless the user moves the pin or searches another address.

---

## Verify after changes

```bash
npm run build
npm run start
npm run verify
```
