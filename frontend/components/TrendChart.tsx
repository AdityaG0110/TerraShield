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
    popAtRisk: Math.round(d.population_at_risk / 1000),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* 1. Monthly Hazard Risk & Rainfall Trend */}
      <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#101828]">
              Seasonal Risk Index & Rainfall Trend
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              12-month simulation showing monsoon vulnerability surge
            </p>
          </div>
          <span className="text-xs font-semibold text-[#164E3A] bg-[#ECFDF3] border border-[#A6F4C5] px-2.5 py-1 rounded-md">
            Seasonal Cycle
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F7" />
              <XAxis dataKey="month" stroke="#98A2B3" fontSize={11} />
              <YAxis stroke="#98A2B3" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#EAECF0",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#101828",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
                stroke="#0284C7"
                fillOpacity={0.4}
                fill="url(#colorRain)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Red-Zone & Critical Habitations by District */}
      <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#101828]">
              Habitations at Risk by District
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Comparison of Critical and Red Zone habitations across monitored districts
            </p>
          </div>
          <span className="text-xs font-semibold text-[#B54708] bg-[#FFFAEB] border border-[#FEDF89] px-2.5 py-1 rounded-md">
            Cross-District
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={districtBarData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F7" />
              <XAxis dataKey="name" stroke="#98A2B3" fontSize={11} />
              <YAxis stroke="#98A2B3" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#EAECF0",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#101828",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#475467" }} />
              <Bar dataKey="critical" name="Critical Red Zones" fill="#DC2626" radius={[4, 4, 0, 0]} />
              <Bar dataKey="red_zone" name="Red Zones" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
