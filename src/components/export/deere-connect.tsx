"use client";

import { useEffect, useState } from "react";
import { Loader2, Tractor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FieldProfile, Recommendation } from "@/types";

export function DeereConnect({
  field,
  recommendation,
}: {
  field: FieldProfile;
  recommendation: Recommendation;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<
    Array<{ id: string; name: string; acres?: number; orgName?: string }>
  >([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const deere = params.get("deere");
    if (deere === "connected") setStatus("Connected to John Deere.");
    if (deere === "error" || deere === "token_error")
      setStatus("Deere sign-in failed. Check API credentials or use file export.");
    if (deere === "disabled")
      setStatus("Deere integration is off. Set DEERE_ENABLED=true in environment.");
  }, []);

  const loadFields = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/deere/fields");
      const data = await res.json();
      setFields(data.fields ?? []);
      if (data.demo) setStatus("Showing demo fields — connect Deere API for live data.");
    } catch {
      setStatus("Could not load Deere fields.");
    }
    setLoading(false);
  };

  const connect = () => {
    window.location.href = "/api/deere/auth";
  };

  const pushPlan = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/deere/workplan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field,
          recommendation,
          fieldId: selectedFieldId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus(data.message ?? "Sent to John Deere.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Push failed");
    }
    setLoading(false);
  };

  return (
    <Card className="border-[#1F6F43]/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Tractor className="h-5 w-5 text-[#1F6F43]" />
          John Deere Operations Center
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-[#6B7280]">
          Connect your Operations Center account to import field boundaries or push
          zone prescriptions.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="default" size="sm" onClick={connect}>
            Connect John Deere
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void loadFields()}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Load my fields
          </Button>
        </div>
        {fields.length > 0 && (
          <select
            className="w-full rounded-lg border border-[#E7E0D0] px-3 py-2 text-sm"
            value={selectedFieldId}
            onChange={(e) => setSelectedFieldId(e.target.value)}
          >
            <option value="">Select a field (optional)</option>
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} {f.orgName ? `· ${f.orgName}` : ""}{" "}
                {f.acres ? `(${f.acres} ac)` : ""}
              </option>
            ))}
          </select>
        )}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => void pushPlan()}
          disabled={loading}
        >
          Push prescription to Deere
        </Button>
        {status && (
          <p className="text-xs text-[#1F6F43] bg-[#1F6F43]/5 rounded-lg px-3 py-2">
            {status}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
