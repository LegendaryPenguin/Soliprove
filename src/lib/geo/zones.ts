import intersect from "@turf/intersect";
import { featureCollection } from "@turf/helpers";
import {
  acresFromBoundary,
  centroidFromBoundary,
  createZoneGeometries,
} from "@/lib/geo/field-boundary";

export type ZoneGeometryResult = {
  geometry: GeoJSON.Polygon;
  acres: number;
};

export function createZonesForField(
  lat: number,
  lon: number,
  fieldAcres: number,
  boundary?: GeoJSON.FeatureCollection
): ZoneGeometryResult[] {
  const center = boundary ? centroidFromBoundary(boundary) : null;
  const cLat = center?.lat ?? lat;
  const cLon = center?.lon ?? lon;
  const wedges = createZoneGeometries(cLat, cLon, fieldAcres);
  const boundaryFeature = boundary?.features[0];

  if (!boundaryFeature?.geometry || boundaryFeature.geometry.type !== "Polygon") {
    return splitAcresEvenly(wedges, fieldAcres);
  }

  const boundaryPoly = boundaryFeature as GeoJSON.Feature<GeoJSON.Polygon>;
  const clipped: ZoneGeometryResult[] = [];

  for (const wedge of wedges) {
    const wedgeFeature: GeoJSON.Feature<GeoJSON.Polygon> = {
      type: "Feature",
      properties: {},
      geometry: wedge,
    };
    const result = intersect(
      featureCollection([wedgeFeature, boundaryPoly])
    );
    if (result?.geometry?.type === "Polygon") {
      const fc: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: [
          { type: "Feature", properties: {}, geometry: result.geometry },
        ],
      };
      const acres = acresFromBoundary(fc);
      if (acres >= 0.1) clipped.push({ geometry: result.geometry, acres });
    }
  }

  if (clipped.length === 0) {
    return [
      {
        geometry: boundaryFeature.geometry as GeoJSON.Polygon,
        acres: fieldAcres,
      },
    ];
  }

  const totalClipped = clipped.reduce((s, z) => s + z.acres, 0);
  if (totalClipped > 0 && Math.abs(totalClipped - fieldAcres) > 0.5) {
    for (const z of clipped) {
      z.acres = Math.round((z.acres / totalClipped) * fieldAcres * 10) / 10;
    }
  }

  return clipped.slice(0, 3);
}

function splitAcresEvenly(
  polygons: GeoJSON.Polygon[],
  fieldAcres: number
): ZoneGeometryResult[] {
  const a1 = Math.round(fieldAcres * 0.38 * 10) / 10;
  const a2 = Math.round(fieldAcres * 0.3 * 10) / 10;
  const a3 = Math.round((fieldAcres - a1 - a2) * 10) / 10;
  const acres = [a1, a2, a3];
  return polygons.map((geometry, i) => ({
    geometry,
    acres: acres[i] ?? fieldAcres / polygons.length,
  }));
}
