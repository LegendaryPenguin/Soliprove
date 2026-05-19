import area from "@turf/area";

/** Create a circular demo field polygon (~40 ac default) */
export function createDemoFieldBoundary(
  lat: number,
  lon: number,
  acres: number
): GeoJSON.FeatureCollection {
  const radiusMeters = Math.sqrt((acres * 4046.86) / Math.PI);
  const points = 32;
  const coords: [number, number][] = [];

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dLat = (radiusMeters / 111320) * Math.cos(angle);
    const dLon =
      (radiusMeters / (111320 * Math.cos((lat * Math.PI) / 180))) *
      Math.sin(angle);
    coords.push([lon + dLon, lat + dLat]);
  }

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { acres },
        geometry: { type: "Polygon", coordinates: [coords] },
      },
    ],
  };
}

/** Acres from GeoJSON polygon (WGS84) */
export function acresFromBoundary(
  boundary: GeoJSON.FeatureCollection | GeoJSON.Polygon
): number {
  let feature: GeoJSON.Feature;
  if ("type" in boundary && boundary.type === "FeatureCollection") {
    const f = boundary.features[0];
    if (!f?.geometry) return 0;
    feature = f as GeoJSON.Feature;
  } else {
    feature = {
      type: "Feature",
      properties: {},
      geometry: boundary as GeoJSON.Polygon,
    };
  }
  const sqMeters = area(feature);
  return Math.round((sqMeters / 4046.86) * 10) / 10;
}

/** Centroid of first polygon in collection */
export function centroidFromBoundary(
  boundary: GeoJSON.FeatureCollection
): { lat: number; lon: number } | null {
  const geom = boundary.features[0]?.geometry;
  if (!geom || geom.type !== "Polygon") return null;
  const ring = geom.coordinates[0];
  if (!ring?.length) return null;
  let latSum = 0;
  let lonSum = 0;
  const n = ring.length - 1;
  for (let i = 0; i < n; i++) {
    lonSum += ring[i][0];
    latSum += ring[i][1];
  }
  return { lat: latSum / n, lon: lonSum / n };
}

export function parseGeoJSONFile(text: string): GeoJSON.FeatureCollection {
  const parsed = JSON.parse(text) as
    | GeoJSON.FeatureCollection
    | GeoJSON.Feature
    | GeoJSON.Polygon;

  if (parsed.type === "FeatureCollection") {
    if (!parsed.features?.length) throw new Error("Empty FeatureCollection");
    return parsed;
  }
  if (parsed.type === "Feature") {
    return { type: "FeatureCollection", features: [parsed] };
  }
  if (parsed.type === "Polygon") {
    return {
      type: "FeatureCollection",
      features: [{ type: "Feature", properties: {}, geometry: parsed }],
    };
  }
  throw new Error("Unsupported GeoJSON type");
}

export function validateBoundary(
  boundary: GeoJSON.FeatureCollection
): void {
  if (boundary.features.length !== 1) {
    throw new Error("Upload one field polygon at a time");
  }
  const geom = boundary.features[0].geometry;
  if (geom?.type !== "Polygon") {
    throw new Error("Boundary must be a polygon");
  }
  const acres = acresFromBoundary(boundary);
  if (acres < 0.5 || acres > 5000) {
    throw new Error(`Field area ${acres} ac looks invalid (0.5–5000 ac)`);
  }
}

/** Split demo field into 3 wedge zones for map coloring */
export function createZoneGeometries(
  lat: number,
  lon: number,
  acres: number
): GeoJSON.Polygon[] {
  const radiusMeters = Math.sqrt((acres * 4046.86) / Math.PI);
  const wedges = 3;
  const polygons: GeoJSON.Polygon[] = [];

  for (let w = 0; w < wedges; w++) {
    const startAngle = (w / wedges) * 2 * Math.PI;
    const endAngle = ((w + 1) / wedges) * 2 * Math.PI;
    const coords: [number, number][] = [[lon, lat]];

    const steps = 12;
    for (let i = 0; i <= steps; i++) {
      const angle = startAngle + ((endAngle - startAngle) * i) / steps;
      const dLat = (radiusMeters / 111320) * Math.cos(angle);
      const dLon =
        (radiusMeters / (111320 * Math.cos((lat * Math.PI) / 180))) *
        Math.sin(angle);
      coords.push([lon + dLon, lat + dLat]);
    }
    coords.push([lon, lat]);

    polygons.push({ type: "Polygon", coordinates: [coords] });
  }

  return polygons;
}
