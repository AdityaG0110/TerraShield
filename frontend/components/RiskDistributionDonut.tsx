"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Props {
  totalCount: number;
  criticalPct?: number;
  highPct?: number;
  moderatePct?: number;
  lowPct?: number;
  distribution?: {
    critical: number;
    red_zone: number;
    watch: number;
    safe: number;
  };
}

export default function RiskDistributionDonut({
  totalCount,
  distribution,
}: Props) {
  const critical = distribution?.critical || 8;
  const high = distribution?.red_zone || 81;
  const moderate = distribution?.watch || 11;
  const low = distribution?.safe || 0;

  const total = Math.max(1, critical + high + moderate + low);
  const critPct = Math.round((critical / total) * 100);
  const highPct = Math.round((high / total) * 100);
  const modPct = Math.round((moderate / total) * 100);
  const lowPct = Math.max(0, 100 - (critPct + highPct + modPct));

  const data = [
    { name: "Critical", value: critical, color: "#EF4444" },
    { name: "High", value: high, color: "#F97316" },
    { name: "Moderate", value: moderate, color: "#FBBF24" },
    { name: "Low", value: Math.max(low, 1), color: "#22C55E" },
  ];

  return (
    <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
      <h3 className="text-sm font-bold text-[#101828]">Risk Distribution</h3>

      {/* Donut Chart with Centered Text */}
      <div className="relative h-44 w-full mt-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label inside Donut */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-bold text-[#101828] font-sans">
            {totalCount.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#667085] -mt-0.5">Habitations</span>
        </div>
      </div>

      {/* Legend & Breakdown List */}
      <div className="mt-3 space-y-2 border-t border-[#F2F4F7] pt-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
            <span className="text-[#344054] font-medium">Critical</span>
          </div>
          <span className="font-semibold text-[#101828] font-mono">{critPct}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F97316]" />
            <span className="text-[#344054] font-medium">High</span>
          </div>
          <span className="font-semibold text-[#101828] font-mono">{highPct}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FBBF24]" />
            <span className="text-[#344054] font-medium">Moderate</span>
          </div>
          <span className="font-semibold text-[#101828] font-mono">{modPct}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            <span className="text-[#344054] font-medium">Low</span>
          </div>
          <span className="font-semibold text-[#101828] font-mono">{lowPct}%</span>
        </div>
      </div>
    </div>
  );
}
