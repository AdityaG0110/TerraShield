"use client";

import React, { useState } from "react";
import {
  Database,
  RefreshCw,
  CheckCircle2,
  Server,
  CloudLightning,
  Mountain,
  Satellite,
  Layers,
  FileSpreadsheet,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function DataSourcesPage() {
  const [syncingSource, setSyncingSource] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const sources = [
    {
      id: "src-1",
      name: "IMD Doppler Weather Radar Grid",
      agency: "India Meteorological Department",
      icon: CloudLightning,
      latency: "142 ms",
      frequency: "Every 15 mins",
      records: "14,200 grid cells",
      status: "Operational",
      statusType: "good",
    },
    {
      id: "src-2",
      name: "GSI Macro Landslide Hazard Zonation",
      agency: "Geological Survey of India",
      icon: Mountain,
      latency: "210 ms",
      frequency: "Daily Feed",
      records: "3,890 slope polygons",
      status: "Operational",
      statusType: "good",
    },
    {
      id: "src-3",
      name: "ISRO Bhuvan SRTM Digital Elevation (DEM)",
      agency: "National Remote Sensing Centre (NRSC)",
      icon: Satellite,
      latency: "310 ms",
      frequency: "Weekly Audit",
      records: "30m contour tiles",
      status: "Operational",
      statusType: "good",
    },
    {
      id: "src-4",
      name: "Sentinel-2 Multi-Spectral Surface Water",
      agency: "Copernicus / European Space Agency",
      icon: Layers,
      latency: "450 ms",
      frequency: "5-Day Swath",
      records: "Inundation vectors",
      status: "Syncing",
      statusType: "warn",
    },
    {
      id: "src-5",
      name: "Census Habitation & Administrative Boundaries",
      agency: "Registrar General & Census Commissioner",
      icon: FileSpreadsheet,
      latency: "85 ms",
      frequency: "Monthly Sync",
      records: "100 Verified Villages",
      status: "Operational",
      statusType: "good",
    },
  ];

  const handleSync = (name: string) => {
    setSyncingSource(name);
    setTimeout(() => {
      setSyncingSource(null);
      setToast(`Telemetry feed "${name}" synchronized successfully.`);
      setTimeout(() => setToast(null), 4000);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#101828] flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F9F5FF] text-[#7C3AED]">
                  <Database className="h-4 w-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#101828]">
                  Telemetry Feeds & Data Ingestion Pipelines
                </h1>
              </div>
              <p className="text-xs text-[#667085] mt-1">
                Real-time ingestion health, API endpoints, and GIS sensor feeds supporting the TerraShield risk engine
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-[#027A48] bg-[#ECFDF3] border border-[#A6F4C5] px-3 py-1.5 rounded-xl shadow-xs">
              <Server className="h-4 w-4" />
              <span>All 5 Pipelines Connected</span>
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div className="rounded-xl border border-[#A6F4C5] bg-[#ECFDF3] p-3 text-xs text-[#027A48] flex items-center gap-2 shadow-xs animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-[#12B76A]" />
              <span>{toast}</span>
            </div>
          )}

          {/* Ingestion Pipeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sources.map((src) => {
              const Icon = src.icon;
              const isSyncing = syncingSource === src.name;

              return (
                <div
                  key={src.id}
                  className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F9FAFB] border border-[#EAECF0] text-[#164E3A]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          src.statusType === "good"
                            ? "bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5]"
                            : "bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89]"
                        }`}
                      >
                        {src.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#101828] mt-3">
                      {src.name}
                    </h3>
                    <p className="text-xs text-[#667085] mt-0.5">
                      {src.agency}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-[#F9FAFB] border border-[#EAECF0]">
                        <span className="text-[10px] text-[#667085] block">Latency</span>
                        <span className="font-mono font-bold text-[#101828]">{src.latency}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#F9FAFB] border border-[#EAECF0]">
                        <span className="text-[10px] text-[#667085] block">Frequency</span>
                        <span className="font-medium text-[#101828]">{src.frequency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EAECF0] flex items-center justify-between">
                    <span className="text-[11px] text-[#667085] font-mono">{src.records}</span>
                    <button
                      onClick={() => handleSync(src.name)}
                      disabled={isSyncing}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#D0D5DD] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50 shadow-xs"
                    >
                      <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin text-[#164E3A]" : ""}`} />
                      <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
