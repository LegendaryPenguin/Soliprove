"use client";

import { useEffect, useRef } from "react";
import type { RecommendationZone } from "@/types";

type FieldMapProps = {
  lat: number;
  lon: number;
  boundary?: GeoJSON.FeatureCollection;
  zones?: RecommendationZone[];
  onPinDrop?: (lat: number, lon: number) => void;
  interactive?: boolean;
  className?: string;
};

const CONFIDENCE_COLORS: Record<string, string> = {
  high: "#22C55E",
  medium: "#FACC15",
  low: "#EF4444",
};

export function FieldMap({
  lat,
  lon,
  boundary,
  zones,
  onPinDrop,
  interactive = false,
  className = "h-[320px] w-full rounded-xl",
}: FieldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Fix default marker paths in bundled Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [lat, lon],
        zoom: 14,
        scrollWheelZoom: interactive,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      }).addTo(map);

      if (boundary?.features?.[0]?.geometry) {
        L.geoJSON(boundary, {
          style: { color: "#1F6F43", weight: 2, fillOpacity: 0.15, fillColor: "#1F6F43" },
        }).addTo(map);
      }

      if (zones?.length) {
        zones.forEach((z) => {
          if (!z.geometry) return;
          L.geoJSON(z.geometry, {
            style: {
              color: CONFIDENCE_COLORS[z.confidence] ?? "#6B7280",
              weight: 2,
              fillOpacity: 0.45,
              fillColor: CONFIDENCE_COLORS[z.confidence],
            },
          })
            .bindPopup(
              `<strong>Zone ${z.zone}</strong><br/>N: ${z.nRate} | P: ${z.p2o5Rate} | K: ${z.k2oRate}`
            )
            .addTo(map);
        });
      }

      const marker = L.marker([lat, lon]).addTo(map);

      if (interactive && onPinDrop) {
        map.on("click", (e: L.LeafletMouseEvent) => {
          marker.setLatLng(e.latlng);
          onPinDrop(e.latlng.lat, e.latlng.lng);
        });
      }

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setView([lat, lon], mapRef.current.getZoom());
  }, [lat, lon]);

  return <div ref={containerRef} className={className} />;
}
