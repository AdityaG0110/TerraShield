"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FactorContribution } from "../lib/types";

interface Props {
  factors: FactorContribution[];
  totalScore: number;
}

export default function RiskBreakdownChart({ factors, totalScore }: Props) {
  const factorLabels: Record<string, string> = {
    slope: "Slope Gradient",
    rainfall: "Precipitation",
    elevation: "Elevation Hazard",
    population_density: "Pop Density",
    historical_incidents: "Disaster History",
  };

  const data = factors.map((f) => ({
    name: factorLabels[f.factor] || f.factor,
    points: f.points,
    weight: `${Math.round(f.weight * 100)}% wt`,
    rawValue: f.raw_value,
    factorKey: f.factor,
  }));

  const getColor = (points: number) => {
    if (points >= 18) return "#DC2626"; // red
    if (points >= 12) return "#F97316"; // orange
    if (points >= 7) return "#EAB308";  // yellow
    return "#22C55E";                  // green
  };

  return (
    <div className="w-full rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#101828]">
            Explainable Risk Factor Contribution
          </h3>
          <p className="text-xs text-[#667085] mt-0.5">
            Breakdown of weighted hazard points contributing to composite index ({totalScore.toFixed(1)}/100)
          </p>
        </div>
        <span className="text-xs font-semibold text-[#164E3A] bg-[#ECFDF3] border border-[#A6F4C5] px-2.5 py-1 rounded-md">
          NDMA Grounded Model
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
            <XAxis type="number" domain={[0, 40]} stroke="#98A2B3" fontSize={11} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#475467"
              fontSize={11}
              tickLine={false}
              width={110}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#EAECF0",
                borderRadius: "10px",
                fontSize: "12px",
                color: "#101828",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: any, name: any, item: any) => [
                `${Number(value).toFixed(2)} pts (${item.payload.weight})`,
                "Points Contribution",
              ]}
            />
            <Bar dataKey="points" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.points)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Factor Summary Table */}
      <div className="mt-4 border-t border-[#EAECF0] pt-3">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          {factors.map((f) => (
            <div key={f.factor} className="p-2 rounded-lg bg-[#F9FAFB] border border-[#EAECF0]">
              <span className="text-[10px] text-[#667085] block truncate font-medium">
                {factorLabels[f.factor] || f.factor}
              </span>
              <span className="text-xs font-bold text-[#101828] font-mono mt-0.5 block">
                {f.points.toFixed(1)} <span className="text-[10px] text-[#667085] font-normal">pts</span>
              </span>
              <span className="text-[10px] text-[#667085] font-mono block">
                ({Math.round(f.weight * 100)}% wt)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
