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
    <div className="h-screen bg-[#F4F6F8] text-[#101828] flex flex-col overflow-hidden">
      <Navbar
        selectedDistrict={district}
        onDistrictChange={setDistrict}
        districtsList={uniqueDistricts}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 relative overflow-hidden flex flex-col">
          {/* Sub-header Bar matching Figma Executive Style */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAECF0] bg-white px-4 sm:px-6 py-2.5 z-10 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#164E3A]"></span>
              <span className="text-xs font-bold text-[#101828] uppercase tracking-wider">
                Full-Spectrum GIS Red-Zone Cartography
              </span>
              <span className="text-xs text-[#667085] hidden sm:inline">
                ({settlements.length} Geotagged Settlements in {district})
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#667085] hidden md:inline">Tile Provider:</span>
              <span className="font-mono text-[#164E3A] bg-[#ECFDF3] border border-[#A6F4C5] px-2 py-0.5 rounded-md text-[11px] font-semibold">
                CartoDB Voyager High-Contrast
              </span>
            </div>
          </div>

          {/* Full Screen Interactive Map Container */}
          <div className="flex-1 w-full relative">
            <RiskMap
              settlements={settlements}
              height="100%"
              initialCenter={[26.0, 93.5]}
              initialZoom={7}
              interactiveSideDrawer={true}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
