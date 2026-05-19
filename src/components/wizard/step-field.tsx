"use client";

import dynamic from "next/dynamic";
import { Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSoilProve } from "@/context/soilprove-context";

const FieldMap = dynamic(
  () => import("@/components/map/field-map").then((m) => m.FieldMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] sm:h-[360px] animate-pulse rounded-xl bg-[#E7E0D0]" />
    ),
  }
);

export function StepField() {
  const { draftLocation, setDraftLocation } = useSoilProve();
  const { lat, lon, acres, zip } = draftLocation;

  const useMyLocation = () => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      setDraftLocation({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 order-2 lg:order-1">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={useMyLocation}>
            <Navigation className="h-4 w-4" /> Use my location
          </Button>
          <Button type="button" variant="secondary" size="sm" disabled>
            Upload boundary (soon)
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="lat">Latitude</Label>
            <Input
              id="lat"
              type="number"
              step="0.0001"
              value={lat}
              onChange={(e) =>
                setDraftLocation({ lat: parseFloat(e.target.value) || lat })
              }
            />
          </div>
          <div>
            <Label htmlFor="lon">Longitude</Label>
            <Input
              id="lon"
              type="number"
              step="0.0001"
              value={lon}
              onChange={(e) =>
                setDraftLocation({ lon: parseFloat(e.target.value) || lon })
              }
            />
          </div>
        </div>
        <div>
          <Label htmlFor="zip">Search county / ZIP (demo)</Label>
          <Input
            id="zip"
            value={zip ?? ""}
            onChange={(e) => setDraftLocation({ zip: e.target.value })}
            placeholder="61820"
          />
        </div>
        <div>
          <Label htmlFor="acres">Field acres</Label>
          <Input
            id="acres"
            type="number"
            min={1}
            value={acres}
            onChange={(e) =>
              setDraftLocation({ acres: parseInt(e.target.value, 10) || 40 })
            }
          />
          <p className="text-xs text-[#6B7280] mt-1">
            We&apos;ll create a circular demo boundary (~{acres} ac) around your pin.
          </p>
        </div>
      </div>
      <div className="order-1 lg:order-2">
        <FieldMap
          lat={lat}
          lon={lon}
          interactive
          className="h-[280px] sm:h-[360px] w-full rounded-xl border border-[#E7E0D0]"
          onPinDrop={(la, lo) => setDraftLocation({ lat: la, lon: lo })}
        />
      </div>
    </div>
  );
}
