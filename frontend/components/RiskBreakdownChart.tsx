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
    <div className="w-full rounded-xl border border-slate-800 bg-[#121927] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Explainable Risk Factor Contribution
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Breakdown of weighted hazard points contributing to composite index ({totalScore.toFixed(1)}/100)
          </p>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-1 rounded">
          NDMA Grounded Model
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 35]}
              stroke="#64748B"
              fontSize={11}
              tickFormatter={(v) => `${v} pts`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94A3B8"
              fontSize={12}
              width={110}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-3 text-xs shadow-xl backdrop-blur-md">
                      <p className="font-semibold text-white">{d.name}</p>
                      <p className="text-cyan-400 mt-1">
                        Points Contributed: <span className="font-mono font-bold">{d.points}</span> pts
                      </p>
                      <p className="text-slate-400">Weightage: {d.weight}</p>
                      <p className="text-slate-400">Raw Recorded Value: {d.rawValue}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="points" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.points)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-center">
        {factors.map((f) => (
          <div key={f.factor} className="p-2 rounded bg-slate-900/50 border border-slate-800/50">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block truncate">
              {factorLabels[f.factor] || f.factor}
            </span>
            <span className="text-sm font-bold font-mono text-white mt-0.5 block">
              {f.points} <span className="text-[10px] text-slate-400 font-normal">pts</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              raw: {f.raw_value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
