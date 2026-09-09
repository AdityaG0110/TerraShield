"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { Layers, Compass, ArrowRight, ShieldAlert, X } from "lucide-react";
import { SettlementListItem, RiskCategory } from "../lib/types";
import RiskCategoryBadge from "./RiskCategoryBadge";

interface Props {
  settlements: SettlementListItem[];
  height?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  highlightSettlementId?: string;
  interactiveSideDrawer?: boolean;
}

// Custom SVG Icons for Leaflet markers
function createCustomPin(category: RiskCategory, isSelected: boolean = false) {
  let color = "#22C55E";
  let pulseClass = "";
  if (category === "critical") {
    color = "#DC2626";
    pulseClass = "marker-pulse-critical";
  } else if (category === "red_zone") {
    color = "#F97316";
  } else if (category === "watch") {
    color = "#EAB308";
  }

  const strokeWidth = isSelected ? "3" : "1.5";
  const strokeColor = isSelected ? "#164E3A" : "#FFFFFF";
  const size = isSelected ? 34 : 26;

  const svgHtml = `
    <div class="${pulseClass}" style="transform: translate(-50%, -100%);">
      <svg width="${size}" height="${size * 1.3}" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37258 18.6274 0 12 0Z" fill="${color}"/>
        <circle cx="12" cy="12" r="5" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: "custom-leaflet-pin",
    iconSize: [0, 0],
    popupAnchor: [0, -32],
  });
}

function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function RiskMapClient({
  settlements,
  height = "600px",
  initialCenter = [26.0, 93.5],
  initialZoom = 7,
  highlightSettlementId,
  interactiveSideDrawer = true,
}: Props) {
  const [selectedSettlement, setSelectedSettlement] = useState<SettlementListItem | null>(null);
  const [activeLayer, setActiveLayer] = useState<"all" | "critical" | "high_risk" | "safe">("all");
  const [showInundationBuffers, setShowInundationBuffers] = useState(true);

  // Compute bounding center if settlements available
  const computedCenter: [number, number] = React.useMemo(() => {
    if (settlements.length === 0) return initialCenter;
    const avgLat = settlements.reduce((sum, s) => sum + s.latitude, 0) / settlements.length;
    const avgLon = settlements.reduce((sum, s) => sum + s.longitude, 0) / settlements.length;
    return [avgLat, avgLon];
  }, [settlements, initialCenter]);

  const computedZoom = settlements.length > 0 ? 7 : initialZoom;

  useEffect(() => {
    if (highlightSettlementId) {
      const match = settlements.find((s) => s.id === highlightSettlementId);
      if (match) setSelectedSettlement(match);
    }
  }, [highlightSettlementId, settlements]);

  // Filter settlements based on layer toggle
  const visibleSettlements = settlements.filter((s) => {
    if (activeLayer === "critical") return s.risk_category === "critical";
    if (activeLayer === "high_risk") return s.risk_category === "critical" || s.risk_category === "red_zone";
    if (activeLayer === "safe") return s.risk_category === "safe" || s.risk_category === "watch";
    return true;
  });

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-[#EAECF0] bg-white shadow-xs" style={{ height }}>
      {/* Floating Layer Controls (Top-Right) */}
      <div className="absolute right-3 sm:right-4 top-3 sm:top-4 z-[1000] rounded-xl border border-[#EAECF0] bg-white/95 p-3 shadow-lg backdrop-blur-md text-xs w-56 sm:w-60 text-[#344054]">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#EAECF0] text-[#101828] font-semibold uppercase tracking-wider text-[11px]">
          <Layers className="h-3.5 w-3.5 text-[#164E3A]" />
          <span>GIS Hazard Layers</span>
        </div>

        <div className="space-y-1">
          <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded hover:bg-[#F9FAFB]">
            <span className="text-[#344054]">All Habitations ({settlements.length})</span>
            <input
              type="radio"
              name="layerToggle"
              checked={activeLayer === "all"}
              onChange={() => setActiveLayer("all")}
              className="accent-[#164E3A]"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded hover:bg-[#F9FAFB]">
            <span className="text-[#EF4444] font-medium">Critical Red Zones Only</span>
            <input
              type="radio"
              name="layerToggle"
              checked={activeLayer === "critical"}
              onChange={() => setActiveLayer("critical")}
              className="accent-[#EF4444]"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded hover:bg-[#F9FAFB]">
            <span className="text-[#F97316] font-medium">Red & Critical Zones</span>
            <input
              type="radio"
              name="layerToggle"
              checked={activeLayer === "high_risk"}
              onChange={() => setActiveLayer("high_risk")}
              className="accent-[#F97316]"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded hover:bg-[#F9FAFB]">
            <span className="text-[#164E3A]">Safe / Watch Candidates</span>
            <input
              type="radio"
              name="layerToggle"
              checked={activeLayer === "safe"}
              onChange={() => setActiveLayer("safe")}
              className="accent-[#164E3A]"
            />
          </label>

          <div className="pt-2 border-t border-[#EAECF0] mt-2">
            <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded hover:bg-[#F9FAFB] text-[#475467]">
              <span>Inundation Buffers</span>
              <input
                type="checkbox"
                checked={showInundationBuffers}
                onChange={(e) => setShowInundationBuffers(e.target.checked)}
                className="accent-[#164E3A]"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Floating Legend (Bottom-Left) */}
      <div className="absolute left-3 sm:left-4 bottom-3 sm:bottom-4 z-[1000] rounded-xl border border-[#EAECF0] bg-white/95 p-3 shadow-lg backdrop-blur-md text-[11px] space-y-1.5 text-[#344054]">
        <span className="font-semibold text-[#101828] uppercase tracking-wider block mb-1">
          Hazard Index
        </span>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-[#EF4444] font-medium">Critical (75–100)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
          <span className="text-[#F97316] font-medium">Red Zone (50–74.9)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
          <span className="text-[#D97706]">Watch (25–49.9)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-[#164E3A]">Safe (0–24.9)</span>
        </div>
      </div>

      {/* Slide-in Settlement Drawer */}
      {interactiveSideDrawer && selectedSettlement && (
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-[1001] w-72 sm:w-80 rounded-xl border border-[#D0D5DD] bg-white/95 p-4 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-left duration-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold text-[#164E3A] uppercase tracking-wider">
                Habitation Telemetry
              </span>
              <h4 className="text-base font-bold text-[#101828] mt-0.5">
                {selectedSettlement.name}
              </h4>
              <p className="text-xs text-[#667085]">
                {selectedSettlement.district}, {selectedSettlement.state}
              </p>
            </div>
            <button
              onClick={() => setSelectedSettlement(null)}
              className="text-[#667085] hover:text-[#101828] rounded p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between border-y border-[#EAECF0] py-2.5">
            <div>
              <span className="text-[10px] text-[#667085] block">Risk Score</span>
              <span className="text-lg font-bold font-mono text-[#101828]">
                {selectedSettlement.risk_score.toFixed(1)}
                <span className="text-xs text-[#667085] font-normal">/100</span>
              </span>
            </div>
            <RiskCategoryBadge category={selectedSettlement.risk_category} />
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-[#F9FAFB] border border-[#EAECF0]">
              <span className="text-[10px] text-[#667085] block">Population</span>
              <span className="font-mono font-semibold text-[#101828]">
                {selectedSettlement.population.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-[#F9FAFB] border border-[#EAECF0]">
              <span className="text-[10px] text-[#667085] block">Households</span>
              <span className="font-mono font-semibold text-[#101828]">
                {selectedSettlement.households}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-4 space-y-2">
            <Link
              href={`/settlements/${selectedSettlement.id}`}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#164E3A] px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0E3326] transition-colors"
            >
              <span>View Full XAI Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {(selectedSettlement.risk_category === "red_zone" ||
              selectedSettlement.risk_category === "critical") && (
              <Link
                href={`/relocation/${selectedSettlement.id}`}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#FEF3F2] border border-[#FECDCA] px-3 py-1.5 text-xs font-semibold text-[#B42318] hover:bg-[#FEE4E2] transition-colors"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Evaluate Relocation Sites</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Leaflet Map Element */}
      <MapContainer
        center={computedCenter}
        zoom={computedZoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <MapViewController center={computedCenter} zoom={computedZoom} />

        {/* CartoDB Voyager Clean High-Contrast Executive Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Hazard Inundation Buffers */}
        {showInundationBuffers &&
          visibleSettlements.map((s) => {
            if (s.risk_category === "critical" || s.risk_category === "red_zone") {
              const radius = s.risk_category === "critical" ? 3500 : 2000;
              const color = s.risk_category === "critical" ? "#DC2626" : "#F97316";
              return (
                <Circle
                  key={`buffer-${s.id}`}
                  center={[s.latitude, s.longitude]}
                  radius={radius}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.18,
                    color: color,
                    weight: 1,
                    dashArray: "4, 6",
                  }}
                />
              );
            }
            return null;
          })}

        {/* Habitation Pin Markers */}
        {visibleSettlements.map((s) => {
          const isSelected = selectedSettlement?.id === s.id;
          return (
            <Marker
              key={s.id}
              position={[s.latitude, s.longitude]}
              icon={createCustomPin(s.risk_category, isSelected)}
              eventHandlers={{
                click: () => {
                  setSelectedSettlement(s);
                },
              }}
            >
              <Popup>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-white text-sm">{s.name}</p>
                  <p className="text-slate-400">{s.district} District</p>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-bold">
                      Risk: {s.risk_score.toFixed(1)}/100
                    </span>
                    <RiskCategoryBadge category={s.risk_category} size="sm" />
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
