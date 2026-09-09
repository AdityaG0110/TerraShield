"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { DistrictRiskStat } from "../lib/types";

interface Props {
  districtStats: DistrictRiskStat[];
}

const MONTHLY_TREND_DATA = [
  { month: "Jan", rainfall: 18, riskIndex: 22, incidents: 0 },
  { month: "Feb", rainfall: 24, riskIndex: 24, incidents: 0 },
  { month: "Mar", rainfall: 35, riskIndex: 27, incidents: 0 },
  { month: "Apr", rainfall: 42, riskIndex: 30, incidents: 0 },
  { month: "May", rainfall: 75, riskIndex: 38, incidents: 1 },
  { month: "Jun", rainfall: 180, riskIndex: 58, incidents: 3 },
  { month: "Jul", rainfall: 320, riskIndex: 78, incidents: 7 },
  { month: "Aug", rainfall: 360, riskIndex: 84, incidents: 9 },
  { month: "Sep", rainfall: 240, riskIndex: 68, incidents: 4 },
  { month: "Oct", rainfall: 90, riskIndex: 42, incidents: 1 },
  { month: "Nov", rainfall: 25, riskIndex: 26, incidents: 0 },
  { month: "Dec", rainfall: 15, riskIndex: 20, incidents: 0 },
];

export default function TrendChart({ districtStats }: Props) {
  const districtBarData = districtStats.map((d) => ({
    name: d.district,
    critical: d.critical_zones,
    red_zone: d.red_zones,
    popAtRisk: Math.round(d.population_at_risk / 1000), // in thousands
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* 1. Monthly Hazard Risk & Rainfall Trend */}
      <div className="rounded-xl border border-slate-800 bg-[#121927] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Seasonal Risk Index & Rainfall Trend
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              12-month simulation showing monsoon vulnerability surge
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
            Seasonal Cycle
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_TREND_DATA}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-3 text-xs shadow-xl backdrop-blur-md">
                        <p className="font-semibold text-white">{d.month}</p>
                        <p className="text-red-400 mt-1">Risk Index: {d.riskIndex}/100</p>
                        <p className="text-cyan-400">Rainfall: {d.rainfall} mm</p>
                        <p className="text-amber-400">Incidents: {d.incidents}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="riskIndex"
                name="Risk Index"
                stroke="#DC2626"
                fillOpacity={1}
                fill="url(#colorRisk)"
              />
              <Area
                type="monotone"
                dataKey="rainfall"
                name="Rainfall (mm)"
                stroke="#06B6D4"
                fillOpacity={0.4}
                fill="url(#colorRain)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Red-Zone & Critical Habitations by District */}
      <div className="rounded-xl border border-slate-800 bg-[#121927] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Habitations at Risk by District
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison of Critical and Red Zone habitations across monitored districts
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
            Cross-District
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={districtBarData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-3 text-xs shadow-xl backdrop-blur-md">
                        <p className="font-semibold text-white">{d.name} District</p>
                        <p className="text-red-400 mt-1">Critical Zones: {d.critical}</p>
                        <p className="text-orange-400">Red Zones: {d.red_zone}</p>
                        <p className="text-cyan-400">Pop. at Risk: ~{d.popAtRisk}k</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#94A3B8" }} />
              <Bar dataKey="critical" name="Critical Red Zones" fill="#DC2626" radius={[4, 4, 0, 0]} />
              <Bar dataKey="red_zone" name="Red Zones" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
