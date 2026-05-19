"use client";

import dynamic from "next/dynamic";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { formatCurrency } from "@/lib/utils";
import { useSoilProve } from "@/context/soilprove-context";

const FieldMap = dynamic(
  () => import("@/components/map/field-map").then((m) => m.FieldMap),
  { ssr: false, loading: () => <div className="h-72 animate-pulse rounded-xl bg-[#E7E0D0]" /> }
);

export function StepResults() {
  const { recommendation, farmerInput, field } = useSoilProve();
  if (!recommendation || !farmerInput || !field) {
    return (
      <p className="text-sm text-[#6B7280]">
        Complete farm inputs and click Generate prescription to see your plan.
      </p>
    );
  }

  const chartData = [
    {
      nutrient: "N",
      current: farmerInput.currentNRate,
      recommended: recommendation.nRate,
    },
    {
      nutrient: "P₂O₅",
      current: farmerInput.currentP2O5Rate,
      recommended: recommendation.p2o5Rate,
    },
    {
      nutrient: "K₂O",
      current: farmerInput.currentK2ORate,
      recommended: recommendation.k2oRate,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-[#1F6F43]/30">
          <CardHeader>
            <CardTitle>Recommended plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-[#6B7280]">Nitrogen</p>
                <p className="text-3xl font-bold text-[#123524]">
                  {recommendation.nRate}{" "}
                  <span className="text-lg font-normal">lb N/ac</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Phosphorus</p>
                <p className="text-3xl font-bold text-[#123524]">
                  {recommendation.p2o5Rate}{" "}
                  <span className="text-lg font-normal">lb P₂O₅/ac</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Potassium</p>
                <p className="text-3xl font-bold text-[#123524]">
                  {recommendation.k2oRate}{" "}
                  <span className="text-lg font-normal">lb K₂O/ac</span>
                </p>
              </div>
            </div>
            <p className="mt-6 text-4xl font-bold text-[#1F6F43]">
              {formatCurrency(recommendation.savingsPerAcre)}/ac saved
            </p>
            <p className="text-[#6B7280]">
              Total field savings: {formatCurrency(recommendation.totalSavings)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yield-risk confidence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-bold text-[#123524]">
              {recommendation.confidenceScore}%
            </p>
            <Progress value={recommendation.confidenceScore} />
            <ConfidenceBadge level={recommendation.confidenceLabel} />
            <ul className="text-xs text-[#6B7280] space-y-1">
              <li>Soil test: +{recommendation.confidenceBreakdown.soilTestScore}</li>
              <li>USDA soil: +{recommendation.confidenceBreakdown.soilDataScore}</li>
              <li>Peer match: +{recommendation.confidenceBreakdown.peerMatchScore}</li>
              <li>Weather: +{recommendation.confidenceBreakdown.weatherScore}</li>
              <li>
                Conservative reduction: +
                {recommendation.confidenceBreakdown.conservativeReductionScore}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current vs SoilProve</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="nutrient" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#8B5E3C" name="Current" />
                <Bar dataKey="recommended" fill="#1F6F43" name="SoilProve" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <FieldMap
          lat={field.lat}
          lon={field.lon}
          boundary={field.boundary}
          zones={recommendation.zones}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Management zones</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#6B7280] border-b border-[#E7E0D0]">
                <th className="py-2">Zone</th>
                <th>Acres</th>
                <th>N</th>
                <th>P₂O₅</th>
                <th>K₂O</th>
                <th>Confidence</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {recommendation.zones.map((z) => (
                <tr key={z.zone} className="border-b border-[#E7E0D0]/60">
                  <td className="py-3 font-medium">{z.zone}</td>
                  <td>{z.acres}</td>
                  <td>{z.nRate}</td>
                  <td>{z.p2o5Rate}</td>
                  <td>{z.k2oRate}</td>
                  <td>
                    <ConfidenceBadge level={z.confidence} />
                  </td>
                  <td className="text-[#6B7280] max-w-xs">{z.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <ul className="text-sm text-[#6B7280] list-disc pl-5 space-y-1">
        {recommendation.explanation.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>

    </div>
  );
}
