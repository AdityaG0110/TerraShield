"use client";

import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  AlertOctagon,
  CheckCircle,
  Radio,
  Send,
  CheckCheck,
  MapPin,
  Clock,
  Filter,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function AlertsPage() {
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "moderate">("all");
  const [broadcastAlert, setBroadcastAlert] = useState<string | null>(null);

  const [alerts, setAlerts] = useState([
    {
      id: "alt-1",
      title: "Landslide Risk Rapid Surge",
      location: "Chamoli, Uttarakhand",
      habitation: "Joshimath (Ward 4-7)",
      severity: "critical",
      time: "18 minutes ago",
      desc: "Slope saturation sensor detected 42mm/hr rainfall surge exceeding 25° stability limit. Ground crack sensors registered 2.1mm widening.",
      acknowledged: false,
    },
    {
      id: "alt-2",
      title: "New High-Risk Red Zone Classified",
      location: "Rudraprayag, Uttarakhand",
      habitation: "Koti Village",
      severity: "critical",
      time: "2 hours ago",
      desc: "Automated NDMA scoring recomputed from live GSI and IMD feeds. Village risk index climbed from 64.2 to 81.0 (Critical).",
      acknowledged: false,
    },
    {
      id: "alt-3",
      title: "Flash Flood Warning Issued",
      location: "Tehri Garhwal, Uttarakhand",
      habitation: "Charali Settlement",
      severity: "high",
      time: "5 hours ago",
      desc: "Bhagirathi catchment basin received 140mm rainfall in past 6 hours. Downstream habitations advised to activate pre-evacuation alert.",
      acknowledged: false,
    },
    {
      id: "alt-4",
      title: "Safe Relocation Capacity Update",
      location: "Pithoragarh, Uttarakhand",
      habitation: "Dharchula Safe Plateau",
      severity: "moderate",
      time: "1 day ago",
      desc: "District administration added 450 tents and verified potable groundwater availability, expanding safe intake capacity to 4,200 persons.",
      acknowledged: true,
    },
    {
      id: "alt-5",
      title: "Telemetry Ingestion Sync Complete",
      location: "North Garo Hills, Meghalaya",
      habitation: "Resubelpara & Mendipathar",
      severity: "moderate",
      time: "2 days ago",
      desc: "Doppler radar rainfall grids and SRTM elevation tiles successfully reconciled with 2026 census cadastral boundaries.",
      acknowledged: true,
    },
  ]);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleBroadcast = (habitation: string) => {
    setBroadcastAlert(`Emergency alert successfully broadcast via CAP SMS gateway to 1,250 registered devices in ${habitation}.`);
    setTimeout(() => setBroadcastAlert(null), 5000);
  };

  const filtered = alerts.filter((a) => {
    if (filter === "all") return true;
    return a.severity === filter;
  });

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

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
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FEF3F2] text-[#D92D20]">
                  <Bell className="h-4 w-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#101828]">
                  Early Warning & Disaster Alerts Feed
                </h1>
              </div>
              <p className="text-xs text-[#667085] mt-1">
                Real-time multi-hazard telemetry triggers, early evacuation advisories, and emergency response dispatch
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-[#D92D20] bg-[#FEF3F2] border border-[#FECDCA] px-3 py-1.5 rounded-xl shadow-xs">
              <Radio className="h-4 w-4 animate-pulse" />
              <span>{unacknowledgedCount} Active Alerts Requiring Action</span>
            </div>
          </div>

          {/* Broadcast Notification Alert */}
          {broadcastAlert && (
            <div className="rounded-xl border border-[#A6F4C5] bg-[#ECFDF3] p-3 text-xs text-[#027A48] flex items-center gap-2 shadow-xs animate-in fade-in">
              <CheckCircle className="h-4 w-4 text-[#12B76A]" />
              <span>{broadcastAlert}</span>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === "all"
                  ? "bg-[#164E3A] text-white shadow-xs"
                  : "bg-white text-[#344054] hover:bg-[#F9FAFB] border border-[#EAECF0]"
              }`}
            >
              All Alerts ({alerts.length})
            </button>
            <button
              onClick={() => setFilter("critical")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === "critical"
                  ? "bg-[#D92D20] text-white shadow-xs"
                  : "bg-white text-[#B42318] hover:bg-[#FEF3F2] border border-[#EAECF0]"
              }`}
            >
              Critical Only ({alerts.filter((a) => a.severity === "critical").length})
            </button>
            <button
              onClick={() => setFilter("high")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === "high"
                  ? "bg-[#F79009] text-white shadow-xs"
                  : "bg-white text-[#B54708] hover:bg-[#FFFAEB] border border-[#EAECF0]"
              }`}
            >
              High Warning ({alerts.filter((a) => a.severity === "high").length})
            </button>
            <button
              onClick={() => setFilter("moderate")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === "moderate"
                  ? "bg-[#0284C7] text-white shadow-xs"
                  : "bg-white text-[#0284C7] hover:bg-[#EFF8FF] border border-[#EAECF0]"
              }`}
            >
              Advisories ({alerts.filter((a) => a.severity === "moderate").length})
            </button>
          </div>

          {/* Alerts Feed List */}
          <div className="space-y-4">
            {filtered.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-xl border bg-white p-5 shadow-xs transition-all ${
                  !alert.acknowledged && alert.severity === "critical"
                    ? "border-[#FECDCA] ring-1 ring-[#FDA29B]/30"
                    : "border-[#EAECF0]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          alert.severity === "critical"
                            ? "bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]"
                            : alert.severity === "high"
                            ? "bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89]"
                            : "bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF]"
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <h3 className="text-base font-bold text-[#101828]">
                        {alert.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#667085]">
                      <span className="flex items-center gap-1 font-semibold text-[#344054]">
                        <MapPin className="h-3 w-3 text-[#E11D48]" />
                        {alert.habitation} ({alert.location})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.time}
                      </span>
                    </div>

                    <p className="text-xs text-[#344054] pt-1 leading-relaxed">
                      {alert.desc}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    <button
                      onClick={() => handleBroadcast(alert.habitation)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#164E3A] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#0E3326] transition-colors"
                      title="Broadcast CAP Alert SMS"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Broadcast SMS</span>
                    </button>

                    {!alert.acknowledged ? (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#D0D5DD] bg-[#F9FAFB] px-3 py-1.5 text-xs font-semibold text-[#344054] hover:bg-[#EAECF0] transition-colors"
                      >
                        <CheckCheck className="h-3.5 w-3.5 text-[#027A48]" />
                        <span>Acknowledge</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-[#027A48] bg-[#ECFDF3] border border-[#A6F4C5] px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Acknowledged
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
