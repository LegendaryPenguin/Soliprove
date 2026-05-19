# SoilProve

Map-first fertilizer prescription and peer-validation tool for Midwest corn farmers.

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS + shadcn-style UI
- Leaflet maps
- Recharts
- Rule-based recommendation engine (MRTN-inspired N, soil-test P/K)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## User flow

1. **Landing** — product overview
2. **Wizard** (`/wizard`) — field pin → auto context → farm inputs → prescription → peers → export
3. **Methodology** (`/methodology`) — transparent logic and data sources

## API routes

| Route | Purpose |
|-------|---------|
| `POST /api/geocode` | County/state from lat/lon |
| `GET /api/soil` | SSURGO-style soil context (mock + SDA-ready) |
| `GET /api/nass` | County corn yield benchmark |
| `GET /api/weather` | NWS weather context |
| `GET /api/fertilizer-prices` | Regional N/P/K defaults |
| `POST /api/recommendation` | Full prescription |
| `POST /api/peer-match` | Similar field matching |
| `POST /api/export/csv` | Zone CSV |
| `POST /api/export/geojson` | Zone GeoJSON |

## Environment (optional, for live APIs)

```env
NASS_API_KEY=
NOAA_CDO_TOKEN=
```

Demo mode works without keys using structured mock fallbacks.

## Disclaimer

SoilProve is a decision-support tool. Final fertilizer decisions should be reviewed with a certified crop adviser or local extension recommendation.
