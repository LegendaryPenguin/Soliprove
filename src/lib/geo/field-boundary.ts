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
