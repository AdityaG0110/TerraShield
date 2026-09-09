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
  const strokeColor = isSelected ? "#06B6D4" : "#FFFFFF";
  const size = isSelected ? 34 : 26;

  const svgHtml = `
    <div class="${pulseClass}" style="transform: translate(-50%, -100%);">
      <svg width="${size}" height="${size * 1.3}" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37258 18.6274 0 12 0Z" fill="${color}"/>
        <circle cx="12" cy="12" r="5" fill="#0B0F19" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>
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

  // Compute center dynamically from settlements
  const computedCenter: [number, number] = React.useMemo(() => {
    if (settlements.length > 0) {
      const avgLat = settlements.reduce((sum, s) => sum + s.latitude, 0) / settlements.length;
      const avgLon = settlements.reduce((sum, s) => sum + s.longitude, 0) / settlements.length;
      return [avgLat, avgLon];
    }
    return initialCenter;
  }, [settlements, initialCenter]);

  const computedZoom = settlements.length > 20 ? 7 : initialZoom;

  // Set initial selected if specified
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
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-800 bg-[#0B0F19]" style={{ height }}>
      {/* Floating Layer Controls (Top-Right) */}
      <div className="absolute right-4 top-4 z-[1000] rounded-xl border border-slate-700/80 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md text-xs w-60">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800 text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
          <Layers className="h-3.5 w-3.5 text-cyan-400" />
          <span>GIS Hazard Layers</span>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded hover:bg-slate-800">
            <span className="text-slate-200">All Habitations ({settlements.length})</span>
            <input
              type="radio"
              name="layerToggle"
              checked={activeLayer === "all"}
              onChange={() => setActiveLayer("all")}
              className="accent-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded hover:bg-slate-800">
            <span className="text-red-400 font-medium">Critical Red Zones Only</span>
            <input
              type="radio"
              name="layerToggle"
              checked={activeLayer === "critical"}
              onChange={() => setActiveLayer("critical")}
              className="accent-red-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded hover:bg-slate-800">
            <span className="text-orange-400 font-medium">Red & Critical Zones</span>
            <input
              type="radio"
              name="layerToggle"
              checked={activeLayer === "high_risk"}
              onChange={() => setActiveLayer("high_risk")}
              className="accent-orange-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded hover:bg-slate-800">
            <span className="text-emerald-400">Safe / Watch Candidates</span>
            <input
              type="radio"
              name="layerToggle"
              checked={activeLayer === "safe"}
              onChange={() => setActiveLayer("safe")}
              className="accent-emerald-500"
            />
          </label>

          <div className="pt-2 border-t border-slate-800 mt-2">
            <label className="flex items-center justify-between cursor-pointer py-1 px-2 rounded hover:bg-slate-800 text-slate-300">
              <span>Inundation Buffers</span>
              <input
                type="checkbox"
                checked={showInundationBuffers}
                onChange={(e) => setShowInundationBuffers(e.target.checked)}
                className="accent-cyan-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Floating Legend (Bottom-Left) */}
      <div className="absolute left-4 bottom-4 z-[1000] rounded-xl border border-slate-700/80 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-[11px] space-y-1.5">
        <span className="font-semibold text-slate-300 uppercase tracking-wider block mb-1">
          Hazard Index
        </span>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-red-400 font-medium">Critical (75–100)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
          <span className="text-orange-400 font-medium">Red Zone (50–74.9)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
          <span className="text-amber-400">Watch (25–49.9)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-emerald-400">Safe (0–24.9)</span>
        </div>
      </div>

      {/* Slide-in Settlement Drawer (PRD 19.3) */}
      {interactiveSideDrawer && selectedSettlement && (
        <div className="absolute top-4 left-4 z-[1001] w-80 rounded-xl border border-cyan-500/40 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-left duration-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                Habitation Telemetry
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                {selectedSettlement.name}
              </h4>
              <p className="text-xs text-slate-400">
                {selectedSettlement.district}, {selectedSettlement.state}
              </p>
            </div>
            <button
              onClick={() => setSelectedSettlement(null)}
              className="text-slate-400 hover:text-white rounded p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between border-y border-slate-800 py-2.5">
            <div>
              <span className="text-[10px] text-slate-400 block">Risk Score</span>
              <span className="text-lg font-bold font-mono text-white">
                {selectedSettlement.risk_score.toFixed(1)}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </span>
            </div>
            <RiskCategoryBadge category={selectedSettlement.risk_category} />
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-800/60">
              <span className="text-[10px] text-slate-400 block">Population</span>
              <span className="font-mono font-semibold text-white">
                {selectedSettlement.population.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-800/60">
              <span className="text-[10px] text-slate-400 block">Households</span>
              <span className="font-mono font-semibold text-white">
                {selectedSettlement.households}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-4 space-y-2">
            <Link
              href={`/settlements/${selectedSettlement.id}`}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition-colors"
            >
              <span>View Full XAI Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {(selectedSettlement.risk_category === "red_zone" ||
              selectedSettlement.risk_category === "critical") && (
              <Link
                href={`/relocation/${selectedSettlement.id}`}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-orange-600/20 border border-orange-500/40 px-3 py-1.5 text-xs font-semibold text-orange-300 hover:bg-orange-600/30 transition-colors"
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

        {/* CartoDB Dark Matter High-Tech Command Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
