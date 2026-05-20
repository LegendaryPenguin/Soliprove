# SoilProve

Map-first fertilizer prescription and peer-validation tool for Midwest corn farmers.

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS + shadcn-style UI
- React Leaflet + Geoman (satellite map, polygon draw)
- Recharts
- Framer Motion (wizard transitions)
- Rule-based recommendation engine (MRTN-inspired N, soil-test P/K)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The wizard defaults to **Cape Girardeau County, Missouri** (ZIP 63701). See [docs/PHASES.md](docs/PHASES.md) for the full phase roadmap.

Copy `.env.example` to `.env.local` and configure optional integrations.

## User flow

1. **Landing** — product overview + 6-step strip
2. **Wizard** (`/wizard`) — guided steps with coach tips
3. **Methodology** (`/methodology`) — transparent logic

### Wizard steps

1. **Field location** — satellite map, draggable pin, polygon draw, GeoJSON upload, address/ZIP search, geolocation (HTTPS required in production)
2. **Field context** — USDA soil, NASS yield, weather, prices
3. **Farm inputs** — rotation, economics, optional soil test / CSV
4. **Prescription** — N/P/K, savings, zones, confidence
5. **Peer proof** — similar nearby fields
6. **Export** — CSV, GeoJSON, PDF, John Deere OAuth, OEM import guides

## API routes

| Route | Purpose |
|-------|---------|
| `POST /api/geocode` | County/state from lat/lon |
| `GET /api/geocode/search` | Census address/ZIP search |
| `GET /api/soil` | SSURGO-style soil context |
| `GET /api/nass` | County corn yield |
| `GET /api/weather` | NWS weather |
| `GET /api/fertilizer-prices` | Regional defaults |
| `POST /api/recommendation` | Full prescription |
| `POST /api/peer-match` | Peer matching |
| `GET /api/deere/auth` | John Deere OAuth start |
| `GET /api/deere/callback` | OAuth callback |
| `GET /api/deere/fields` | List Deere fields |
| `POST /api/deere/workplan` | Push prescription payload |

## Verification

```bash
npm run start
node scripts/verify-apis.mjs
node scripts/verify-flow.mjs
```

## Deploy (Vercel)

- Set environment variables from `.env.example`
- **Geolocation** requires HTTPS (automatic on Vercel)
- Add `https://your-domain.com/api/deere/callback` to Deere app redirect URIs when using `DEERE_ENABLED=true`

## Disclaimer

SoilProve is a decision-support tool. Final fertilizer decisions should be reviewed with a certified crop adviser or local extension recommendation.
