"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSoilProve } from "@/context/soilprove-context";
import type { FarmerInput } from "@/types";

export function StepInput() {
  const { farmerInput, setFarmerInput, field } = useSoilProve();
  const [advanced, setAdvanced] = useState(false);
  const nDefault = field?.fertilizerPrices?.nitrogenDefaultPerLb ?? 0.52;

  return (
    <div className="space-y-6 max-w-xl">
      <p className="text-sm text-[#6B7280] rounded-lg bg-[#FAF7EF] border border-[#E7E0D0] px-3 py-2">
        Without a soil test, SoilProve uses conservative P/K estimates. Add lab
        values in advanced mode for a tighter prescription.
      </p>
      <div>
        <Label>Crop rotation</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {(
            [
              ["corn_after_soybean", "Corn after soybean"],
              ["corn_after_corn", "Corn after corn"],
            ] as const
          ).map(([val, label]) => (
            <Button
              key={val}
              type="button"
              variant={farmerInput.rotation === val ? "default" : "secondary"}
              size="sm"
              onClick={() => setFarmerInput({ rotation: val })}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Label>Nitrogen source</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {(
            [
              ["anhydrous", "Anhydrous"],
              ["uan28", "UAN 28"],
              ["uan32", "UAN 32"],
              ["urea", "Urea"],
            ] as const
          ).map(([val, label]) => (
            <Button
              key={val}
              type="button"
              variant={
                farmerInput.nitrogenProduct === val ? "default" : "secondary"
              }
              size="sm"
              onClick={() =>
                setFarmerInput({
                  nitrogenProduct: val as FarmerInput["nitrogenProduct"],
                })
              }
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cornPrice">Corn price ($/bu)</Label>
          <Input
            id="cornPrice"
            type="number"
            step="0.01"
            value={farmerInput.cornPricePerBu}
            onChange={(e) =>
              setFarmerInput({
                cornPricePerBu: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="nPrice">Nitrogen price ($/ton)</Label>
          <Input
            id="nPrice"
            type="number"
            value={farmerInput.nitrogenPricePerTon ?? 650}
            onChange={(e) =>
              setFarmerInput({
                nitrogenPricePerTon: parseFloat(e.target.value) || 0,
              })
            }
          />
          <p className="text-xs text-[#6B7280] mt-1">
            Regional default ~${(nDefault * 2000 * 0.82).toFixed(0)}/ton anhydrous
            equiv.
          </p>
        </div>
      </div>
      <div>
        <Label>Current flat rate (lb/ac)</Label>
        <div className="grid grid-cols-3 gap-3 mt-2">
          <div>
            <Label htmlFor="nRate" className="text-xs text-[#6B7280]">
              N
            </Label>
            <Input
              id="nRate"
              type="number"
              value={farmerInput.currentNRate}
              onChange={(e) =>
                setFarmerInput({
                  currentNRate: parseInt(e.target.value, 10) || 0,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="pRate" className="text-xs text-[#6B7280]">
              P₂O₅
            </Label>
            <Input
              id="pRate"
              type="number"
              value={farmerInput.currentP2O5Rate}
              onChange={(e) =>
                setFarmerInput({
                  currentP2O5Rate: parseInt(e.target.value, 10) || 0,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="kRate" className="text-xs text-[#6B7280]">
              K₂O
            </Label>
            <Input
              id="kRate"
              type="number"
              value={farmerInput.currentK2ORate}
              onChange={(e) =>
                setFarmerInput({
                  currentK2ORate: parseInt(e.target.value, 10) || 0,
                })
              }
            />
          </div>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        className="text-[#1F6F43] px-0"
        onClick={() => setAdvanced(!advanced)}
      >
        {advanced ? "− Hide" : "+ Show"} optional soil test
      </Button>
      {advanced && (
        <div className="grid sm:grid-cols-2 gap-4 border-t border-[#E7E0D0] pt-4">
          <div>
            <Label htmlFor="ph">pH</Label>
            <Input
              id="ph"
              type="number"
              step="0.1"
              placeholder="6.5"
              defaultValue={farmerInput.soilTest?.ph}
              onChange={(e) =>
                setFarmerInput({
                  soilTest: {
                    ...farmerInput.soilTest,
                    ph: parseFloat(e.target.value) || undefined,
                  },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="om">Organic matter %</Label>
            <Input
              id="om"
              type="number"
              step="0.1"
              placeholder="3.8"
              defaultValue={farmerInput.soilTest?.organicMatterPct}
              onChange={(e) =>
                setFarmerInput({
                  soilTest: {
                    ...farmerInput.soilTest,
                    organicMatterPct: parseFloat(e.target.value) || undefined,
                  },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="pPpm">Soil test P (ppm)</Label>
            <Input
              id="pPpm"
              type="number"
              placeholder="25"
              defaultValue={farmerInput.soilTest?.phosphorusPpm}
              onChange={(e) =>
                setFarmerInput({
                  soilTest: {
                    ...farmerInput.soilTest,
                    phosphorusPpm: parseFloat(e.target.value) || undefined,
                  },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="kPpm">Soil test K (ppm)</Label>
            <Input
              id="kPpm"
              type="number"
              placeholder="180"
              defaultValue={farmerInput.soilTest?.potassiumPpm}
              onChange={(e) =>
                setFarmerInput({
                  soilTest: {
                    ...farmerInput.soilTest,
                    potassiumPpm: parseFloat(e.target.value) || undefined,
                  },
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
