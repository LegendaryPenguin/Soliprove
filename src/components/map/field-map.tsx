"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  GeoJSON,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import type { RecommendationZone } from "@/types";
import {
  acresFromBoundary,
  centroidFromBoundary,
  validateBoundary,
} from "@/lib/geo/field-boundary";

export type MapTileMode = "satellite" | "street";

type FieldMapProps = {
  lat: number;
  lon: number;
  boundary?: GeoJSON.FeatureCollection;
  zones?: RecommendationZone[];
  onPinChange?: (lat: number, lon: number) => void;
  onBoundaryChange?: (boundary: GeoJSON.FeatureCollection, acres: number) => void;
  interactive?: boolean;
  enableDraw?: boolean;
  tileMode?: MapTileMode;
  className?: string;
};

const CONFIDENCE_COLORS: Record<string, string> = {
  high: "#22C55E",
  medium: "#FACC15",
  low: "#EF4444",
};

const pinIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapRecenter({ lat, lon, boundary }: { lat: number; lon: number; boundary?: GeoJSON.FeatureCollection }) {
  const map = useMap();
  useEffect(() => {
    if (boundary?.features?.length) {
      const layer = L.geoJSON(boundary);
      map.fitBounds(layer.getBounds(), { padding: [24, 24], maxZoom: 17 });
    } else {
      map.setView([lat, lon], Math.max(map.getZoom(), 16));
    }
  }, [lat, lon, boundary, map]);
  return null;
}

function MapClickHandler({
  onPinChange,
}: {
  onPinChange?: (lat: number, lon: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPinChange?.(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function GeomanDraw({
  enableDraw,
  boundary,
  onBoundaryChange,
}: {
  enableDraw: boolean;
  boundary?: GeoJSON.FeatureCollection;
  onBoundaryChange?: (b: GeoJSON.FeatureCollection, acres: number) => void;
}) {
  const map = useMap();
  const drawnLayerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!enableDraw) return;

    map.pm.addControls({
      position: "topright",
      drawMarker: false,
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: true,
      drawPolygon: true,
      drawText: false,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true,
    });

    const onCreate = (e: { layer: L.Layer }) => {
      if (drawnLayerRef.current) {
        map.removeLayer(drawnLayerRef.current);
      }
      drawnLayerRef.current = e.layer;
      const gj = (e.layer as L.Polygon).toGeoJSON() as GeoJSON.Feature;
      const fc: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: [gj],
      };
      try {
        validateBoundary(fc);
        onBoundaryChange?.(fc, acresFromBoundary(fc));
      } catch {
        /* invalid polygon — Geoman layer kept for edit */
      }
    };

    const onUpdate = () => {
      if (!drawnLayerRef.current) return;
      const gj = (drawnLayerRef.current as L.Polygon).toGeoJSON() as GeoJSON.Feature;
      const fc: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: [gj],
      };
      try {
        validateBoundary(fc);
        onBoundaryChange?.(fc, acresFromBoundary(fc));
      } catch {
        /* invalid polygon — Geoman layer kept for edit */
      }
    };

    // Geoman leaflet events
    map.on("pm:create", onCreate as L.LeafletEventHandlerFn);
    map.on("pm:edit", onUpdate as L.LeafletEventHandlerFn);
    map.on("pm:remove", () => {
      drawnLayerRef.current = null;
    });

    return () => {
      map.off("pm:create", onCreate as L.LeafletEventHandlerFn);
      map.off("pm:edit", onUpdate as L.LeafletEventHandlerFn);
      map.pm.removeControls();
    };
  }, [enableDraw, map, onBoundaryChange]);

  useEffect(() => {
    if (!enableDraw || !boundary?.features?.length || drawnLayerRef.current) return;
    const layer = L.geoJSON(boundary);
    layer.eachLayer((l) => {
      drawnLayerRef.current = l;
      l.addTo(map);
    });
  }, [boundary, enableDraw, map]);

  return null;
}

export function FieldMap({
  lat,
  lon,
  boundary,
  zones,
  onPinChange,
  onBoundaryChange,
  interactive = false,
  enableDraw = false,
  tileMode = "satellite",
  className = "h-[320px] w-full rounded-xl",
}: FieldMapProps) {
  const satelliteUrl =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const streetUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const zoneGeoJson = useMemo(() => {
    if (!zones?.length) return null;
    return {
      type: "FeatureCollection" as const,
      features: zones
        .filter((z) => z.geometry)
        .map((z) => ({
          type: "Feature" as const,
          properties: {
            zone: z.zone,
            confidence: z.confidence,
          },
          geometry: z.geometry!,
        })),
    };
  }, [zones]);

  const handleDragEnd = useCallback(
    (e: L.DragEndEvent) => {
      const pos = e.target.getLatLng();
      onPinChange?.(pos.lat, pos.lng);
    },
    [onPinChange]
  );

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={16}
      scrollWheelZoom={interactive || enableDraw}
      className={className}
      style={{ height: "100%", width: "100%", minHeight: 280 }}
    >
      <TileLayer
        attribution={
          tileMode === "satellite"
            ? "Esri, Maxar, Earthstar"
            : "&copy; OpenStreetMap"
        }
        url={tileMode === "satellite" ? satelliteUrl : streetUrl}
      />
      {tileMode === "satellite" && (
        <TileLayer
          url={streetUrl}
          opacity={0.15}
          attribution=""
        />
      )}

      <MapRecenter lat={lat} lon={lon} boundary={boundary} />

      {boundary && !enableDraw && (
        <GeoJSON
          key={JSON.stringify(boundary)}
          data={boundary}
          style={{
            color: "#1F6F43",
            weight: 2,
            fillOpacity: 0.2,
            fillColor: "#1F6F43",
          }}
        />
      )}

      {zoneGeoJson && (
        <GeoJSON
          data={zoneGeoJson}
          style={(feature) => {
            const c =
              CONFIDENCE_COLORS[
                String(feature?.properties?.confidence ?? "medium")
              ] ?? "#6B7280";
            return {
              color: c,
              weight: 2,
              fillOpacity: 0.45,
              fillColor: c,
            };
          }}
        />
      )}

      <Marker
        position={[lat, lon]}
        icon={pinIcon}
        draggable={interactive || enableDraw}
        eventHandlers={{ dragend: handleDragEnd }}
      />

      {interactive && onPinChange && !enableDraw && (
        <MapClickHandler onPinChange={onPinChange} />
      )}

      {enableDraw && (
        <GeomanDraw
          enableDraw={enableDraw}
          boundary={boundary}
          onBoundaryChange={onBoundaryChange}
        />
      )}
    </MapContainer>
  );
}

export { centroidFromBoundary, acresFromBoundary };

