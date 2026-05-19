"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Navigation,
  Upload,
  Map as MapIcon,
  Satellite,
  MapPin,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSoilProve } from "@/context/soilprove-context";
import { requestUserLocation } from "@/lib/geolocation";
import {
  parseGeoJSONFile,
  validateBoundary,
  centroidFromBoundary,
  acresFromBoundary,
} from "@/lib/geo/field-boundary";
import { cn } from "@/lib/utils";

const FieldMap = dynamic(
  () => import("@/components/map/field-map").then((m) => m.FieldMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] animate-pulse rounded-xl bg-[#E7E0D0]" />
    ),
  }
);

export function StepField() {
  const {
    draftLocation,
    setDraftLocation,
    setBoundary,
    locationError,
    setLocationError,
    mapTileMode,
    setMapTileMode,
    mapFullscreen,
    setMapFullscreen,
    fieldStepChecks,
  } = useSoilProve();

  const { lat, lon, acres, zip } = draftLocation;
  const [geoLoading, setGeoLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(zip ?? "");
  const [searchResults, setSearchResults] = useState<
    { lat: number; lon: number; label: string }[]
  >([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const useMyLocation = async () => {
    setGeoLoading(true);
    setLocationError(null);
    const result = await requestUserLocation();
    setGeoLoading(false);
    if (!result.ok) {
      setLocationError(result.message);
      return;
    }
    setDraftLocation({
      lat: result.lat,
      lon: result.lon,
      pinPlaced: true,
    });
  };

  const runSearch = async () => {
    if (searchQuery.length < 3) return;
    setLocationError(null);
    try {
      const res = await fetch(
        `/api/geocode/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      setSearchResults(data.results ?? []);
      if (data.results?.[0]) {
        const r = data.results[0];
        setDraftLocation({
          lat: r.lat,
          lon: r.lon,
          zip: searchQuery,
          pinPlaced: true,
        });
      }
    } catch {
      setLocationError("Address search failed. Try dropping a pin.");
    }
  };

  const handleUpload = useCallback(
    async (file: File) => {
      setUploadError(null);
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File must be under 5 MB");
        return;
      }
      try {
        const text = await file.text();
        const fc = parseGeoJSONFile(text);
        validateBoundary(fc);
        const ac = acresFromBoundary(fc);
        const center = centroidFromBoundary(fc);
        setBoundary(fc, ac);
        if (center) {
          setDraftLocation({
            lat: center.lat,
            lon: center.lon,
            pinPlaced: true,
            boundaryDrawn: true,
          });
        }
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Invalid file");
      }
    },
    [setBoundary, setDraftLocation]
  );

  const checks = [
    { key: "pin", label: "Pin placed", done: fieldStepChecks.pin },
    {
      key: "boundary",
      label: "Boundary set (draw or upload)",
      done: fieldStepChecks.boundary,
    },
    { key: "acres", label: "Acres confirmed", done: fieldStepChecks.acres },
  ];

  const mapBlock = (
    <FieldMap
      lat={lat}
      lon={lon}
      boundary={draftLocation.boundary}
      interactive
      enableDraw
      tileMode={mapTileMode}
      className={cn(
        "w-full rounded-xl border border-[#E7E0D0]",
        mapFullscreen
          ? "fixed inset-0 z-50 h-screen rounded-none border-0"
          : "h-[320px] sm:h-[400px]"
      )}
      onPinChange={(la, lo) =>
        setDraftLocation({ lat: la, lon: lo, pinPlaced: true })
      }
      onBoundaryChange={(b, ac) => {
        setBoundary(b, ac);
        setDraftLocation({ boundaryDrawn: true, acres: ac });
      }}
    />
  );

  return (
    <div className="space-y-4">
      <ul className="flex flex-wrap gap-2 text-xs">
        {checks.map((c) => (
          <li
            key={c.key}
            className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1 border",
              c.done
                ? "bg-[#1F6F43]/10 border-[#1F6F43]/40 text-[#1F6F43]"
                : "border-[#E7E0D0] text-[#6B7280]"
            )}
          >
            {c.done ? <Check className="h-3 w-3" /> : <span className="w-3" />}
            {c.label}
          </li>
        ))}
      </ul>

      {(locationError || uploadError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {locationError || uploadError}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void useMyLocation()}
          disabled={geoLoading}
        >
          {geoLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          Use my location
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-4 w-4" /> Upload GeoJSON
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".geojson,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleUpload(f);
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            setMapTileMode(mapTileMode === "satellite" ? "street" : "satellite")
          }
        >
          {mapTileMode === "satellite" ? (
            <MapIcon className="h-4 w-4" />
          ) : (
            <Satellite className="h-4 w-4" />
          )}
          {mapTileMode === "satellite" ? "Street" : "Satellite"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={() => setMapFullscreen(!mapFullscreen)}
        >
          <MapPin className="h-4 w-4" />
          {mapFullscreen ? "Exit full map" : "Full map"}
        </Button>
      </div>

      <p className="text-xs text-[#6B7280]">
        Draw a rectangle or polygon on satellite imagery, drag the pin, or upload
        a boundary file. Toolbar is on the map (top-right).
      </p>

      <div className={cn("relative", mapFullscreen && "z-50")}>
        {mapBlock}
        {mapFullscreen && (
          <Button
            className="absolute top-3 left-3 z-[1000]"
            size="sm"
            onClick={() => setMapFullscreen(false)}
          >
            Close map
          </Button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="search">Address / ZIP search</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void runSearch()}
              placeholder="61820 or 123 Farm Rd, Champaign IL"
            />
            <Button type="button" variant="secondary" onClick={() => void runSearch()}>
              Go
            </Button>
          </div>
          {searchResults.length > 1 && (
            <ul className="mt-2 text-xs border border-[#E7E0D0] rounded-lg divide-y max-h-32 overflow-auto">
              {searchResults.map((r) => (
                <li key={r.label}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-[#FAF7EF]"
                    onClick={() => {
                      setDraftLocation({
                        lat: r.lat,
                        lon: r.lon,
                        pinPlaced: true,
                      });
                      setSearchResults([]);
                    }}
                  >
                    {r.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <Label htmlFor="acres">Field acres</Label>
          <Input
            id="acres"
            type="number"
            min={1}
            className="mt-1"
            value={acres}
            onChange={(e) =>
              setDraftLocation({ acres: parseInt(e.target.value, 10) || 40 })
            }
          />
          <p className="text-xs text-[#6B7280] mt-1">
            Auto-updates when you draw a boundary; you can override manually.
          </p>
        </div>
      </div>
    </div>
  );
}
