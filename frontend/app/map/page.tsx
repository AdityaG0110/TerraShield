"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RiskMap from "../../components/RiskMap";
import { SettlementListItem } from "../../lib/types";
import { fetchSettlements } from "../../lib/api";

export default function MapPage() {
  const [district, setDistrict] = useState("All Districts");
  const [settlements, setSettlements] = useState<SettlementListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchSettlements({ district });
        setSettlements(data.results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [district]);

  const uniqueDistricts = React.useMemo(() => {
    const set = new Set<string>();
    settlements.forEach((s) => {
      if (s.district) set.add(s.district);
    });
    return Array.from(set).sort();
  }, [settlements]);

  return (
    <div className="h-screen bg-[#0B0F19] text-white flex flex-col overflow-hidden">
      <Navbar
        selectedDistrict={district}
        onDistrictChange={setDistrict}
        districtsList={uniqueDistricts}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 relative overflow-hidden flex flex-col">
          {/* Sub-header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#0E1524] px-6 py-2.5 z-10">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Full-Spectrum GIS Red-Zone Cartography
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                ({settlements.length} Geotagged Settlements in {district})
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Tile Provider:</span>
              <span className="font-mono text-cyan-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                CartoDB High-Contrast Satellite Overlay
              </span>
            </div>
          </div>

          {/* Full Screen Interactive Map Container */}
          <div className="flex-1 w-full relative">
            <RiskMap
              settlements={settlements}
              height="100%"
              initialCenter={[27.50, 81.80]}
              initialZoom={9}
              interactiveSideDrawer={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
