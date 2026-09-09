"use client";

import React, { useState } from "react";
import {
  Truck,
  Users,
  MapPin,
  CheckCircle2,
  Clock,
  Camera,
  Wifi,
  WifiOff,
  ClipboardCheck,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function FieldOperationsPage() {
  const [teams, setTeams] = useState([
    {
      id: "QRT-01",
      lead: "Dr. Rajesh Mehta (Geologist)",
      location: "Joshimath Ward 5, Chamoli",
      habitationsAssessed: 18,
      status: "In Field",
      connectivity: "online",
      lastSync: "4 mins ago",
    },
    {
      id: "QRT-02",
      lead: "S. Rawat (Surveyor)",
      location: "Mendipathar, North Garo Hills",
      habitationsAssessed: 14,
      status: "In Field",
      connectivity: "online",
      lastSync: "12 mins ago",
    },
    {
      id: "QRT-03",
      lead: "A. Verma (Civil Engineer)",
      location: "Dharchula Safe Plateau, Pithoragarh",
      habitationsAssessed: 22,
      status: "Site Completed",
      connectivity: "online",
      lastSync: "1 hour ago",
    },
    {
      id: "QRT-04",
      lead: "P. Singh (Disaster Specialist)",
      location: "Ukhimath Valley, Rudraprayag",
      habitationsAssessed: 9,
      status: "In Field",
      connectivity: "offline",
      lastSync: "3 hours ago (Queued Offline)",
    },
  ]);

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
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ECFDF3] text-[#164E3A]">
                  <Truck className="h-4 w-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#101828]">
                  Field Operations & Rapid Ground Survey
                </h1>
              </div>
              <p className="text-xs text-[#667085] mt-1">
                Real-time tracking of on-ground survey teams, sensor validation checkpoints, and offline sync logs
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-[#027A48] bg-[#ECFDF3] border border-[#A6F4C5] px-3 py-1.5 rounded-xl shadow-xs">
              <ClipboardCheck className="h-4 w-4" />
              <span>4 Active Quick Response Teams (QRT)</span>
            </div>
          </div>

          {/* Operational Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">
                Field Teams Deployed
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#101828]">4</span>
                <span className="text-xs font-bold text-[#027A48]">Active QRTs</span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">16 geologists and drone operators</p>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">
                Habitations Verified
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#164E3A]">63</span>
                <span className="text-xs font-medium text-[#667085]">/ 100 total</span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">Ground truth photo verified</p>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">
                Geotagged Fissure Logs
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#B42318]">142</span>
                <span className="text-xs font-bold text-[#B42318]">Documented</span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">With millimeter gauge timestamps</p>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">
                Sync Pipeline Status
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#027A48]">96.4%</span>
                <span className="text-xs font-bold text-[#027A48]">Healthy</span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">Offline stores syncing to master DB</p>
            </div>
          </div>

          {/* Teams Status Table */}
          <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#101828]">
                Ground Survey Teams Telemetry Log
              </h2>
              <p className="text-xs text-[#667085] mt-0.5">
                Live field survey status and sync telemetry across mountainous sectors
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="border-b border-[#EAECF0] bg-[#F9FAFB] text-[#475467] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Team Call-Sign</th>
                    <th className="py-3 px-4">Officer In Charge</th>
                    <th className="py-3 px-4">Current Sector</th>
                    <th className="py-3 px-4">Verified Habitations</th>
                    <th className="py-3 px-4">Sync Telemetry</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAECF0] text-[#344054]">
                  {teams.map((t) => (
                    <tr key={t.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3.5 px-4 font-bold font-mono text-[#101828]">
                        {t.id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#344054]">
                        {t.lead}
                      </td>
                      <td className="py-3.5 px-4 text-[#667085]">
                        <span className="flex items-center gap-1 font-medium text-[#344054]">
                          <MapPin className="h-3 w-3 text-[#E11D48]" />
                          {t.location}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#101828]">
                        {t.habitationsAssessed} habitations
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          {t.connectivity === "online" ? (
                            <Wifi className="h-3.5 w-3.5 text-[#027A48]" />
                          ) : (
                            <WifiOff className="h-3.5 w-3.5 text-[#D97706]" />
                          )}
                          <span className="text-[#667085]">{t.lastSync}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            t.status === "In Field"
                              ? "bg-[#EFF8FF] text-[#175CD3] border border-[#B2DDFF]"
                              : "bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5]"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
