import { createDemoFieldBoundary } from "@/lib/geo/field-boundary";
import type { FieldProfile } from "@/types";

const MOCK_LOCATIONS: Record<
  string,
  { county: string; state: string; soilSeries: string }
> = {
  IL: { county: "Champaign", state: "IL", soilSeries: "Drummer" },
  IA: { county: "Story", state: "IA", soilSeries: "Clarion" },
  IN: { county: "Tippecanoe", state: "IN", soilSeries: "Raub" },
  DEFAULT: { county: "Champaign", state: "IL", soilSeries: "Drummer" },
};

export function buildMockFieldProfile(
  lat: number,
  lon: number,
  acres = 40,
  stateHint?: string
): FieldProfile {
  const stateKey = stateHint?.toUpperCase().slice(0, 2) ?? "IL";
  const loc = MOCK_LOCATIONS[stateKey] ?? MOCK_LOCATIONS.DEFAULT;

  return {
    id: `field-${Date.now()}`,
    name: `${loc.county} County Field`,
    lat,
    lon,
    acres,
    county: loc.county,
    state: loc.state,
    boundary: createDemoFieldBoundary(lat, lon, acres),
    soil: {
      mapUnitKey: "mock-198a",
      mapUnitName: `${loc.soilSeries} silty clay loam`,
      soilSeries: loc.soilSeries,
      texture: "silty clay loam",
      slope: "0–2%",
      drainageClass: "Poorly drained",
      hydrologicGroup: "B",
      availableWaterCapacity: "0.18 in/in",
      organicMatterEstimate: 3.8,
      source: "USDA_NRCS_SSURGO",
      confidence: "high",
    },
    cropBenchmark: {
      countyCornYieldBuAc: 214,
      stateCornYieldBuAc: 208,
      countyCornAcres: 185000,
      source: "USDA_NASS",
    },
    weather: {
      recentRainfallIn: 2.4,
      droughtRisk: "low",
      forecastSummary:
        "Near-normal temperatures; light rain expected mid-week.",
      stationName: "Regional NWS grid",
      source: "NWS",
    },
    fertilizerPrices: {
      nitrogenDefaultPerLb: 0.52,
      phosphateDefaultPerLb: 0.52,
      potashDefaultPerLb: 0.38,
      regionLabel: `${loc.state} — USDA AMS regional default`,
      source: "USDA AMS Market News (demo default)",
    },
  };
}

export type FieldProfileFetchResult = {
  profile: FieldProfile;
  usedDemoFallback: boolean;
};

export async function fetchFieldProfile(
  lat: number,
  lon: number,
  acres: number
): Promise<FieldProfileFetchResult> {
  let usedDemoFallback = false;
  const failedApis: string[] = [];

  try {
    let geo: { state?: string; county?: string } | null = null;
    try {
      const res = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon }),
      });
      if (res.ok) geo = await res.json();
      else failedApis.push("geocode");
    } catch {
      failedApis.push("geocode");
    }

    const state = geo?.state ?? "IL";
    const county = geo?.county ?? "Champaign";

    const fetchSafe = async (url: string, name: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          failedApis.push(name);
          return null;
        }
        return await res.json();
      } catch {
        failedApis.push(name);
        return null;
      }
    };

    const [soil, nass, weather, prices] = await Promise.all([
      fetchSafe(`/api/soil?lat=${lat}&lon=${lon}`, "soil"),
      fetchSafe(`/api/nass?state=${state}&county=${county}`, "nass"),
      fetchSafe(`/api/weather?lat=${lat}&lon=${lon}`, "weather"),
      fetchSafe(`/api/fertilizer-prices?state=${state}`, "fertilizer-prices"),
    ]);

    const base = buildMockFieldProfile(lat, lon, acres, state);

    if (geo?.county) base.county = geo.county;
    if (geo?.state) base.state = geo.state;

    if (soil?.soilSeries) {
      base.soil = { ...base.soil!, ...soil, source: "USDA_NRCS_SSURGO" };
    }
    if (nass?.countyCornYieldBuAc) {
      base.cropBenchmark = { ...base.cropBenchmark!, ...nass, source: "USDA_NASS" };
    }
    if (weather?.forecastSummary) {
      base.weather = { ...base.weather!, ...weather };
    }
    if (prices?.nitrogenDefaultPerLb) {
      base.fertilizerPrices = { ...base.fertilizerPrices!, ...prices };
    }

    usedDemoFallback = failedApis.length > 0;
    return { profile: base, usedDemoFallback };
  } catch {
    return {
      profile: buildMockFieldProfile(lat, lon, acres),
      usedDemoFallback: true,
    };
  }
}
