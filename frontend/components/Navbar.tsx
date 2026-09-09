"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, AlertTriangle, Radio, Activity } from "lucide-react";
import RoleSelector from "./RoleSelector";

interface Props {
  selectedDistrict?: string;
  onDistrictChange?: (district: string) => void;
  districtsList?: string[];
}

export default function Navbar({
  selectedDistrict = "All Districts",
  onDistrictChange,
  districtsList,
}: Props) {
  const pathname = usePathname();

  const defaultDistricts = [
    "All Districts",
    "Arunachal Pradesh",
    "Assam",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Tripura",
  ];

  const districts = districtsList && districtsList.length > 0
    ? (districtsList.includes("All Districts") ? districtsList : ["All Districts", ...districtsList])
    : defaultDistricts;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-[#0B0F19]/90 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-mono">
                Terra<span className="text-cyan-400">SHIELD</span>
              </span>
              <span className="rounded bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.5 text-[9px] font-semibold text-blue-400 uppercase tracking-wider">
                SIH 2026
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
              Hazard Risk Intelligence & Relocation DSS
            </p>
          </div>
        </Link>

        {/* Live operational badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3 py-1 text-xs text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] font-medium tracking-wide">
            LIVE SATELLITE & SENSOR FEEDS ACTIVE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* District Quick Filter (visible on dashboard & map) */}
        {onDistrictChange && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs">
            <span className="text-slate-400 font-medium">Jurisdiction:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
            >
              {districts.map((d) => (
                <option key={d} value={d} className="bg-slate-900 text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Role Selector */}
        <RoleSelector />
      </div>
    </header>
  );
}
