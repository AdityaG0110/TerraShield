"use client";

import React, { useState } from "react";
import {
  Scale,
  Trees,
  Droplet,
  HeartPulse,
  Mountain,
  Building,
  ArrowUpRight,
  ShieldCheck,
  Info,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function CarryingCapacityPage() {
  const [targetDistrict, setTargetDistrict] = useState("All");

  const districtCapacities = [
    { name: "Chamoli", state: "Uttarakhand", allocated: 24500, available: 68000, utilization: 36, status: "High Headroom" },
    { name: "Rudraprayag", state: "Uttarakhand", allocated: 19800, available: 42000, utilization: 47, status: "Moderate Headroom" },
    { name: "Tehri Garhwal", state: "Uttarakhand", allocated: 31200, available: 75000, utilization: 41, status: "High Headroom" },
    { name: "Pithoragarh", state: "Uttarakhand", allocated: 15400, available: 52000, utilization: 29, status: "Optimal Headroom" },
    { name: "Kamrup", state: "Assam", allocated: 84000, available: 145000, utilization: 58, status: "Moderate Headroom" },
    { name: "East Khasi Hills", state: "Meghalaya", allocated: 32000, available: 65000, utilization: 49, status: "Moderate Headroom" },
    { name: "Aizawl", state: "Mizoram", allocated: 28500, available: 65600, utilization: 43, status: "High Headroom" },
  ];

  const totalAllocated = districtCapacities.reduce((sum, d) => sum + d.allocated, 0);
  const totalAvailable = districtCapacities.reduce((sum, d) => sum + d.available, 0);
  const overallUtilization = Math.round((totalAllocated / totalAvailable) * 100);

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#101828] flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FEF0C7] text-[#B54708]">
                  <Scale className="h-4 w-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#101828]">
                  Carrying Capacity & Ecological Thresholds
                </h1>
              </div>
              <p className="text-xs text-[#667085] mt-1">
                Quantitative assessment of sustainable demographic accommodation in non-hazardous designated safe zones
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-[#164E3A] bg-[#ECFDF3] border border-[#A6F4C5] px-3 py-1.5 rounded-xl shadow-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>NDMA Model Ver. 2.4 Grounded</span>
            </div>
          </div>

          {/* Top Capacity Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider">
                  Total Safe Capacity
                </span>
                <Trees className="h-4 w-4 text-[#164E3A]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#101828]">{totalAvailable.toLocaleString()}</span>
                <span className="text-xs font-medium text-[#667085]">Individuals</span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">Ecologically verified land buffer</p>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider">
                  Allocated Relocations
                </span>
                <Building className="h-4 w-4 text-[#2563EB]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#2563EB]">{totalAllocated.toLocaleString()}</span>
                <span className="text-xs font-medium text-[#667085]">Residents</span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">Currently mapped to safe clusters</p>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider">
                  Remaining Buffer Headroom
                </span>
                <ArrowUpRight className="h-4 w-4 text-[#027A48]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#027A48]">{(totalAvailable - totalAllocated).toLocaleString()}</span>
                <span className="text-xs font-bold text-[#027A48]">Free Cap.</span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">Ready for emergency influx</p>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider">
                  Capacity Utilization
                </span>
                <span className="text-xs font-mono font-bold text-[#164E3A]">{overallUtilization}%</span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-[#EAECF0] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#164E3A] rounded-full transition-all"
                    style={{ width: `${overallUtilization}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#667085] mt-2">Well below critical overload index (85%)</p>
            </div>
          </div>

          {/* 4 Pillars of Carrying Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#101828]">
                <Mountain className="h-4 w-4 text-[#D97706]" />
                <span>Slope & Geo-Stability</span>
              </div>
              <p className="text-xs text-[#667085] mt-1">
                Candidate zones restricted to gentle gradients (&lt; 15°), zero fault plane intersection.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-[#027A48] bg-[#ECFDF3] px-2 py-0.5 rounded inline-block">
                98.4% Compliance
              </div>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#101828]">
                <Droplet className="h-4 w-4 text-[#0284C7]" />
                <span>Water Security Buffer</span>
              </div>
              <p className="text-xs text-[#667085] mt-1">
                Groundwater yield &gt; 70 LPCD sustained supply during peak drought/monsoon variance.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-[#027A48] bg-[#ECFDF3] px-2 py-0.5 rounded inline-block">
                85.0 LPCD Verified
              </div>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#101828]">
                <Building className="h-4 w-4 text-[#164E3A]" />
                <span>Buildable Safe Land</span>
              </div>
              <p className="text-xs text-[#667085] mt-1">
                Contiguous government non-forest revenue land minimum 2.5 hectares per 100 households.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-[#027A48] bg-[#ECFDF3] px-2 py-0.5 rounded inline-block">
                3,420 Hectares Available
              </div>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#101828]">
                <HeartPulse className="h-4 w-4 text-[#E11D48]" />
                <span>Health & Road Connectivity</span>
              </div>
              <p className="text-xs text-[#667085] mt-1">
                All-weather arterial road access within 4.5 km; Primary Health Centre (PHC) &lt; 8 km.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-[#027A48] bg-[#ECFDF3] px-2 py-0.5 rounded inline-block">
                3.2 km Avg Proximity
              </div>
            </div>
          </div>

          {/* District-by-District Capacity Table */}
          <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#101828]">
                District Carrying Capacity Utilization Matrix
              </h2>
              <p className="text-xs text-[#667085] mt-0.5">
                Monitoring safe recipient zone capacity vs incoming vulnerable habitations
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="border-b border-[#EAECF0] bg-[#F9FAFB] text-[#475467] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">District / State</th>
                    <th className="py-3 px-4">Allocated Intake</th>
                    <th className="py-3 px-4">Maximum Sustainable</th>
                    <th className="py-3 px-4">Utilization Meter</th>
                    <th className="py-3 px-4 text-right">Headroom Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAECF0] text-[#344054]">
                  {districtCapacities.map((d) => (
                    <tr key={d.name} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#101828] block">{d.name}</span>
                        <span className="text-[11px] text-[#667085]">{d.state}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#101828]">
                        {d.allocated.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#164E3A]">
                        {d.available.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 w-60">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-[#EAECF0] h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#164E3A] rounded-full"
                              style={{ width: `${d.utilization}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs text-[#667085]">{d.utilization}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5]">
                          {d.status}
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
