"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Plus, Minus, Layers, Shield, ChevronRight, Check } from "lucide-react";

interface MarkerItem {
  id: string;
  name: string;
  type: "red" | "orange" | "yellow" | "green";
  layer: "landslide" | "flood" | "cloudburst" | "habitations" | "relocation";
  x: number; // percentage from left
  y: number; // percentage from top
  riskScore?: number;
  label: string;
}

const SAMPLE_MARKERS: MarkerItem[] = [
  { id: "1", name: "Joshimath", type: "red", layer: "landslide", x: 79, y: 44, riskScore: 84.6, label: "Joshimath" },
  { id: "2", name: "Chamoli Main", type: "red", layer: "landslide", x: 81, y: 46, riskScore: 79.2, label: "Chamoli" },
  { id: "3", name: "Rudraprayag", type: "red", layer: "flood", x: 65, y: 36, riskScore: 75.8, label: "Rudraprayag" },
  { id: "4", name: "Tehri Garhwal", type: "orange", layer: "flood", x: 52, y: 50, riskScore: 61.4, label: "Tehri" },
  { id: "5", name: "Srinagar (Garhwal)", type: "orange", layer: "flood", x: 64, y: 53, riskScore: 58.2, label: "Srinagar" },
  { id: "6", name: "Upper Alaknanda", type: "orange", layer: "landslide", x: 56, y: 28, riskScore: 54.0, label: "" },
  { id: "7", name: "Pauri Sub-basin", type: "yellow", layer: "habitations", x: 76, y: 30, riskScore: 38.5, label: "Pauri" },
  { id: "8", name: "Deoprayag Valley", type: "yellow", layer: "habitations", x: 94, y: 65, riskScore: 32.0, label: "" },
  { id: "9", name: "Gopeshwar Safe Hub", type: "green", layer: "relocation", x: 75, y: 47, label: "Relocation Site" },
  { id: "10", name: "Gauchar Safe Plateau", type: "green", layer: "relocation", x: 64, y: 52, label: "Relocation Site" },
  { id: "11", name: "Karnaprayag Buffer", type: "green", layer: "relocation", x: 69, y: 54, label: "Relocation Site" },
];

export default function HeroMapCard() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayers, setActiveLayers] = useState({
    landslide: true,
    flood: true,
    cloudburst: false,
    habitations: true,
    relocation: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredMarker, setHoveredMarker] = useState<MarkerItem | null>(null);

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.45));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));

  const filteredMarkers = SAMPLE_MARKERS.filter((m) => {
    if (!activeLayers[m.layer]) return false;
    if (searchQuery.trim()) {
      return m.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="relative w-full rounded-2xl border border-[#D0D5DD] bg-white shadow-2xl overflow-hidden transition-all">
      {/* Top Search Bar */}
      <div className="p-3 sm:p-4 border-b border-[#EAECF0] bg-white z-20 relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-[#98A2B3]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location, district or habitation..."
            className="w-full rounded-xl border border-[#EAECF0] bg-[#F9FAFB] pl-10 pr-4 py-2 text-xs sm:text-sm text-[#101828] placeholder-[#98A2B3] focus:border-[#164E3A] focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#164E3A]/15 transition-all"
          />
        </div>
      </div>

      {/* Map Canvas with Topographic Terrain */}
      <div className="relative h-[380px] sm:h-[460px] w-full bg-[#EBF2EA] overflow-hidden select-none">
        {/* Styled Topographic Contours & Mountain Relief (SVG pattern) */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Topographic Contour Texture */}
          <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="terrain-contours" width="220" height="220" patternUnits="userSpaceOnUse">
                {/* Elevation Contours */}
                <path d="M 0 30 Q 55 10 110 30 T 220 30" fill="none" stroke="#D3E2D0" strokeWidth="1.2" />
                <path d="M 0 65 Q 60 45 120 70 T 220 60" fill="none" stroke="#D3E2D0" strokeWidth="1.2" />
                <path d="M 0 100 Q 40 85 110 110 T 220 95" fill="none" stroke="#C2D8BF" strokeWidth="1.4" />
                <path d="M 0 140 Q 75 115 140 145 T 220 135" fill="none" stroke="#D3E2D0" strokeWidth="1.2" />
                <path d="M 0 180 Q 50 160 110 190 T 220 175" fill="none" stroke="#D3E2D0" strokeWidth="1.2" />
                <path d="M 0 215 Q 70 195 130 220 T 220 210" fill="none" stroke="#C2D8BF" strokeWidth="1.4" />
                {/* River Ribbons */}
                <path d="M 30 0 C 45 60 70 120 120 180 T 170 220" fill="none" stroke="#93C5FD" strokeWidth="2.5" opacity="0.65" />
                <path d="M 160 0 C 140 40 120 100 120 180" fill="none" stroke="#BAE6FD" strokeWidth="1.8" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#terrain-contours)" />
          </svg>

          {/* District Labels */}
          <div className="absolute top-[22%] left-[45%] text-[10px] sm:text-[11px] font-bold text-[#4B6B45]/70 tracking-widest uppercase pointer-events-none">
            Tehri Garhwal
          </div>
          <div className="absolute top-[18%] left-[68%] text-[10px] sm:text-[11px] font-bold text-[#4B6B45]/70 tracking-widest uppercase pointer-events-none">
            Chamoli
          </div>
          <div className="absolute top-[52%] left-[64%] text-[10px] sm:text-[11px] font-bold text-[#4B6B45]/70 tracking-widest uppercase pointer-events-none">
            Srinagar
          </div>
          <div className="absolute top-[58%] left-[76%] text-[10px] sm:text-[11px] font-bold text-[#4B6B45]/70 tracking-widest uppercase pointer-events-none">
            Pauri
          </div>

          {/* Markers Placed Geographically */}
          {filteredMarkers.map((marker) => {
            const isHovered = hoveredMarker?.id === marker.id;

            return (
              <div
                key={marker.id}
                onMouseEnter={() => setHoveredMarker(marker)}
                onMouseLeave={() => setHoveredMarker(null)}
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
              >
                {/* Red Zone Pulsing Circle */}
                {marker.type === "red" && (
                  <div className="relative flex items-center justify-center">
                    {/* Concentric Animated Radar Rings */}
                    <span className="absolute h-9 w-9 rounded-full bg-[#EF4444]/25 animate-ping opacity-75" />
                    <span className="absolute h-6 w-6 rounded-full bg-[#EF4444]/40 animate-pulse" />
                    <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] border-2 border-white shadow-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>

                    {/* Label Badge */}
                    {marker.label && (
                      <span className="absolute left-5 text-[10px] font-extrabold text-[#991B1B] bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded-md border border-[#FCA5A5] shadow-xs whitespace-nowrap">
                        {marker.label}
                      </span>
                    )}
                  </div>
                )}

                {/* Moderate Risk (Orange) Marker */}
                {marker.type === "orange" && (
                  <div className="relative flex items-center justify-center">
                    <span className="absolute h-5 w-5 rounded-full bg-[#F59E0B]/30" />
                    <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#F59E0B] border-2 border-white shadow-xs">
                      <span className="h-1 w-1 rounded-full bg-white" />
                    </span>
                    {marker.label && (
                      <span className="absolute left-4 text-[9px] font-bold text-[#B45309] bg-white/85 px-1 py-0.2 rounded border border-[#FDE68A] whitespace-nowrap">
                        {marker.label}
                      </span>
                    )}
                  </div>
                )}

                {/* Low Risk (Yellow) Marker */}
                {marker.type === "yellow" && (
                  <div className="relative flex items-center justify-center">
                    <span className="h-3 w-3 rounded-full bg-[#EAB308] border border-white shadow-2xs" />
                    {marker.label && (
                      <span className="absolute left-3.5 text-[9px] font-semibold text-[#854D0E] bg-white/80 px-1 py-0.2 rounded border border-[#FEF08A] whitespace-nowrap">
                        {marker.label}
                      </span>
                    )}
                  </div>
                )}

                {/* Relocation Site (Green Diamond / Shield) */}
                {marker.type === "green" && (
                  <div className="relative flex items-center justify-center">
                    <div className="h-4 w-4 bg-[#16A34A] text-white rotate-45 rounded-xs border-2 border-white shadow-xs flex items-center justify-center">
                      <div className="-rotate-45 text-[8px] font-bold">▲</div>
                    </div>
                  </div>
                )}

                {/* Hover Tooltip Card */}
                {isHovered && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-[#0B192C] text-white text-[11px] rounded-lg py-1 px-2.5 shadow-xl whitespace-nowrap border border-white/20">
                    <div className="font-bold">{marker.name}</div>
                    {marker.riskScore && (
                      <div className="text-[10px] text-[#86EFAC]">
                        Risk Score: {marker.riskScore}/100
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Zoom Controls on Top Left */}
        <div className="absolute top-3 left-3 z-20 flex flex-col rounded-lg border border-[#D0D5DD] bg-white shadow-md overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-[#344054] hover:bg-[#F4F6F8] hover:text-[#164E3A] border-b border-[#EAECF0] transition-colors"
            title="Zoom In"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-[#344054] hover:bg-[#F4F6F8] hover:text-[#164E3A] transition-colors"
            title="Zoom Out"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Floating Layers Panel on Top Right (Exact Replica from Image 2) */}
        <div className="absolute top-3 right-3 z-20 w-44 sm:w-52 rounded-xl border border-[#D0D5DD] bg-white/95 backdrop-blur-sm p-3 shadow-lg text-xs">
          {/* Header */}
          <div className="flex items-center gap-1.5 text-[#101828] font-bold pb-2 border-b border-[#EAECF0] text-[11px]">
            <Layers className="h-3.5 w-3.5 text-[#164E3A]" />
            <span>Layers</span>
          </div>

          {/* Interactive Checkboxes */}
          <div className="mt-2 space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer text-[#344054] text-[11px]">
              <input
                type="checkbox"
                checked={activeLayers.landslide}
                onChange={() => toggleLayer("landslide")}
                className="rounded border-[#D0D5DD] text-[#164E3A] focus:ring-[#164E3A]"
              />
              <span>Landslide</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[#344054] text-[11px]">
              <input
                type="checkbox"
                checked={activeLayers.flood}
                onChange={() => toggleLayer("flood")}
                className="rounded border-[#D0D5DD] text-[#164E3A] focus:ring-[#164E3A]"
              />
              <span>Flood</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[#344054] text-[11px]">
              <input
                type="checkbox"
                checked={activeLayers.cloudburst}
                onChange={() => toggleLayer("cloudburst")}
                className="rounded border-[#D0D5DD] text-[#164E3A] focus:ring-[#164E3A]"
              />
              <span>Cloudburst</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[#344054] text-[11px]">
              <input
                type="checkbox"
                checked={activeLayers.habitations}
                onChange={() => toggleLayer("habitations")}
                className="rounded border-[#D0D5DD] text-[#164E3A] focus:ring-[#164E3A]"
              />
              <span>Vulnerable Habitations</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[#344054] text-[11px]">
              <input
                type="checkbox"
                checked={activeLayers.relocation}
                onChange={() => toggleLayer("relocation")}
                className="rounded border-[#D0D5DD] text-[#164E3A] focus:ring-[#164E3A]"
              />
              <span>Relocation Sites</span>
            </label>
          </div>

          {/* Color Legend */}
          <div className="mt-2.5 pt-2 border-t border-[#EAECF0] space-y-1 text-[10px] text-[#475467]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#DC2626] shrink-0" />
              <span>High Risk (Red Zone)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B] shrink-0" />
              <span>Moderate Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#EAB308] shrink-0" />
              <span>Low Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-[#16A34A] rotate-45 rounded-xs shrink-0" />
              <span>Relocation Site</span>
            </div>
          </div>
        </div>

        {/* Floating Preview Card on Bottom Left (Exact Replica from Image 2) */}
        <Link
          href="/login"
          className="absolute bottom-3 left-3 z-20 flex items-center gap-2.5 rounded-xl border border-[#D0D5DD] bg-white/95 backdrop-blur-sm p-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] max-w-[240px] group"
        >
          <div className="relative h-11 w-13 rounded-lg overflow-hidden shrink-0 border border-[#EAECF0]">
            <Image
              src="/mountain-town-thumb.jpg"
              alt="Himalayan mountain settlement"
              fill
              className="object-cover"
            />
          </div>
          <div className="pr-1 overflow-hidden">
            <div className="text-[11px] font-bold text-[#101828] truncate">
              Safer Communities
            </div>
            <div className="text-[10px] text-[#164E3A] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>Through Smarter Decisions</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
