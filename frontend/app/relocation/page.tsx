"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Compass,
  Users,
  CheckCircle,
  Clock,
  Search,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { SettlementListItem } from "../../lib/types";
import { fetchSettlements } from "../../lib/api";

export default function RelocationOverviewPage() {
  const [settlements, setSettlements] = useState<SettlementListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("All");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchSettlements();
        setSettlements(data.results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const highRiskHabitations = settlements.filter(
    (s) => s.risk_category === "critical" || s.risk_category === "red_zone"
  );

  const filtered = highRiskHabitations.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.district.toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = districtFilter === "All" || s.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  const uniqueDistricts = Array.from(new Set(settlements.map((s) => s.district))).sort();

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#101828] flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ECFDF3] text-[#164E3A]">
                  <Compass className="h-4 w-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#101828]">
                  Relocation Sites & Carrying Capacity Planning
                </h1>
              </div>
              <p className="text-xs text-[#667085] mt-1">
                Multi-criteria relocation decision support: evaluating safe candidate receiving zones for vulnerable habitations
              </p>
            </div>

            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#164E3A] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0E3326] transition-colors self-start sm:self-auto"
            >
              <MapPin className="h-4 w-4" />
              <span>Inspect GIS Corridors</span>
            </Link>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">
                Total Recommended Sites
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#101828]">214</span>
                <span className="text-xs font-bold text-[#027A48]">↑ +5% MoM</span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">Geotagged safe receiving locations</p>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">
                Available Carrying Capacity
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#164E3A]">512,600</span>
                <span className="text-xs font-medium text-[#667085]">Cap.</span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">Sustained demographic accommodation</p>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">
                Average Transit Distance
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#101828]">14.2</span>
                <span className="text-xs font-medium text-[#667085]">km</span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">Within optimal community radius</p>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
              <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">
                Approved Directives
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#027A48]">38</span>
                <span className="text-xs font-bold text-[#027A48]">In Staging</span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">SDMA ministerial orders executed</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-[#EAECF0] bg-white p-4 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#98A2B3]" />
              <input
                type="text"
                placeholder="Search habitation requiring relocation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#D0D5DD] bg-white py-2 pl-9 pr-3 text-xs text-[#101828] placeholder-[#98A2B3] focus:border-[#164E3A] focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="rounded-xl border border-[#D0D5DD] bg-[#F9FAFB] px-3 py-2 text-xs font-semibold text-[#344054] focus:border-[#164E3A] focus:outline-none cursor-pointer flex-1 sm:flex-none"
              >
                <option value="All">All Districts ({uniqueDistricts.length})</option>
                {uniqueDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Habitations List with Direct Relocation Planning Links */}
          <div className="overflow-x-auto rounded-xl border border-[#EAECF0] bg-white shadow-xs">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="border-b border-[#EAECF0] bg-[#F9FAFB] text-[#475467] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Origin Habitation</th>
                  <th className="py-3 px-4">District / State</th>
                  <th className="py-3 px-4">Displaced Population</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Available Safe Sites</th>
                  <th className="py-3 px-4 text-right">Relocation Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAECF0] text-[#344054]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#667085]">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#164E3A] border-t-transparent" />
                        <span>Loading Relocation Registry...</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#667085]">
                      No red zone habitations match the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#101828]">
                        {s.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[#344054]">{s.district}</span>
                        <span className="text-[11px] text-[#667085] block">{s.state}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-[#101828]">{s.population.toLocaleString()}</span>
                        <span className="text-[11px] text-[#667085] block">{s.households} families</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            s.risk_category === "critical"
                              ? "bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]"
                              : "bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89]"
                          }`}
                        >
                          {s.risk_category === "critical" ? "Critical Zone" : "Red Zone"} ({s.risk_score.toFixed(1)})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-[#164E3A]">
                        3 Candidate Sites
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/relocation/${s.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#164E3A] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#0E3326] transition-colors"
                        >
                          <Compass className="h-3.5 w-3.5" />
                          <span>Evaluate Sites</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
