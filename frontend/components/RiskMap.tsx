"use client";

import dynamic from "next/dynamic";
import React from "react";
import { SettlementListItem } from "../lib/types";

interface Props {
  settlements: SettlementListItem[];
  height?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  highlightSettlementId?: string;
  interactiveSideDrawer?: boolean;
}

const DynamicMap = dynamic(() => import("./RiskMapClient"), {
  ssr: false,
  loading: () => (
    <div
      className="flex w-full items-center justify-center rounded-xl border border-slate-800 bg-[#0B0F19] text-xs text-slate-400 font-mono"
      style={{ minHeight: "450px" }}
    >
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
        <span>Initializing GIS Risk Map Engine & Satellite Telemetry...</span>
      </div>
    </div>
  ),
});

export default function RiskMap(props: Props) {
  return <DynamicMap {...props} />;
}
