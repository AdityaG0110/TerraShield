"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ShieldAlert,
  MapPin,
  Users,
  Compass,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RiskCategoryBadge from "../../components/RiskCategoryBadge";
import { SettlementListItem } from "../../lib/types";
import { fetchSettlements, recomputeSettlementRisk } from "../../lib/api";

export default function RedZonesPage() {
  const [settlements, setSettlements] = useState<SettlementListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "critical" | "red_zone">("all");
  const [recomputingId, setRecomputingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchSettlements();
      // Filter habitations categorized as critical or red_zone
      const redZones = data.results.filter(
        (s) => s.risk_category === "critical" || s.risk_category === "red_zone"
      );
      setSettlements(redZones);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecompute = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setRecomputingId(id);
      const res = await recomputeSettlementRisk(id);
      if (res?.assessment) {
        setSettlements((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  risk_score: res.assessment.risk_score,
                  risk_category: res.assessment.risk_category,
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRecomputingId(null);
    }
  };

  // Filtered list
  const filtered = settlements.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.district.toLowerCase().includes(search.toLowerCase()) ||
      s.state.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || s.risk_category === filterType;
    return matchesSearch && matchesType;
  });

  // Sort by highest risk score first
  filtered.sort((a, b) => b.risk_score - a.risk_score);

  const criticalCount = settlements.filter((s) => s.risk_category === "critical").length;
  const redZoneCount = settlements.filter((s) => s.risk_category === "red_zone").length;
  const totalPopulationAtRisk = settlements.reduce((sum, s) => sum + s.population, 0);

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#101828] flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FEE4E2] text-[#D92D20]">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#101828]">
                  Red Zones Priority Command Center
                </h1>
              </div>
              <p className="text-xs text-[#667085] mt-1">
                Active monitoring and rapid relocation prioritization for habitations with critical hazard exposure
              </p>
            </div>

            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#164E3A] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0E3326] transition-colors self-start sm:self-auto"
            >
              <Compass className="h-4 w-4" />
              <span>View On Hazard Map</span>
            </Link>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#FECDCA] bg-[#FEF3F2] p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#B42318] uppercase tracking-wider">
                  Critical Red Zones
                </span>
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#D92D20] animate-ping" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#912018]">
                  {criticalCount}
                </span>
                <span className="text-xs font-medium text-[#B42318]">Habitations</span>
              </div>
              <p className="text-[11px] text-[#B42318]/80 mt-1">Score ≥ 75.0 (Immediate Evacuation Trigger)</p>
            </div>

            <div className="rounded-xl border border-[#FEDF89] bg-[#FFFAEB] p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#B54708] uppercase tracking-wider">
                  High Risk Red Zones
                </span>
                <ShieldAlert className="h-4 w-4 text-[#F79009]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#B54708]">
                  {redZoneCount}
                </span>
                <span className="text-xs font-medium text-[#B54708]">Habitations</span>
              </div>
              <p className="text-[11px] text-[#B54708]/80 mt-1">Score 50.0–74.9 (Short-Term Relocation Plan)</p>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#344054] uppercase tracking-wider">
                  Total Population Exposed
                </span>
                <Users className="h-4 w-4 text-[#164E3A]" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#101828]">
                  {totalPopulationAtRisk.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-[#667085]">Citizens</span>
              </div>
              <p className="text-[11px] text-[#667085] mt-1">Across 7 Northeastern Himalayan states</p>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-[#EAECF0] bg-white p-4 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#98A2B3]" />
              <input
                type="text"
                placeholder="Search red zone habitation, district..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#D0D5DD] bg-white py-2 pl-9 pr-3 text-xs text-[#101828] placeholder-[#98A2B3] focus:border-[#164E3A] focus:outline-none transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setFilterType("all")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filterType === "all"
                    ? "bg-[#164E3A] text-white shadow-xs"
                    : "bg-[#F9FAFB] text-[#344054] hover:bg-[#F2F4F7] border border-[#EAECF0]"
                }`}
              >
                All Red Zones ({settlements.length})
              </button>
              <button
                onClick={() => setFilterType("critical")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filterType === "critical"
                    ? "bg-[#D92D20] text-white shadow-xs"
                    : "bg-[#FEF3F2] text-[#B42318] hover:bg-[#FEE4E2] border border-[#FECDCA]"
                }`}
              >
                Critical Only ({criticalCount})
              </button>
              <button
                onClick={() => setFilterType("red_zone")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filterType === "red_zone"
                    ? "bg-[#F79009] text-white shadow-xs"
                    : "bg-[#FFFAEB] text-[#B54708] hover:bg-[#FEF0C7] border border-[#FEDF89]"
                }`}
              >
                High Risk ({redZoneCount})
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-[#EAECF0] bg-white">
              <div className="flex items-center gap-3 text-xs text-[#667085] font-mono">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#164E3A] border-t-transparent" />
                <span>Loading Red Zone Records...</span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-[#EAECF0] bg-white p-12 text-center text-xs text-[#667085]">
              No red zone habitations match the current filter criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-[#101828]">
                          {s.name}
                        </h3>
                        <p className="text-xs text-[#667085] flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-[#E11D48]" />
                          <span>{s.district}, {s.state}</span>
                        </p>
                      </div>
                      <RiskCategoryBadge category={s.risk_category} />
                    </div>

                    {/* Risk Score Meter */}
                    <div className="mt-4 rounded-lg bg-[#F9FAFB] border border-[#EAECF0] p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#667085] font-medium">NDMA Risk Index</span>
                        <span className="font-bold font-mono text-sm text-[#101828]">
                          {s.risk_score.toFixed(1)} <span className="text-[10px] text-[#667085] font-normal">/ 100</span>
                        </span>
                      </div>
                      <div className="w-full bg-[#EAECF0] h-2 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            s.risk_category === "critical"
                              ? "bg-[#D92D20]"
                              : "bg-[#F79009]"
                          }`}
                          style={{ width: `${Math.min(s.risk_score, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Demographics */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-[#F9FAFB] border border-[#EAECF0]">
                        <span className="text-[10px] text-[#667085] block">Population</span>
                        <span className="font-semibold text-[#101828] font-mono">
                          {s.population.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#F9FAFB] border border-[#EAECF0]">
                        <span className="text-[10px] text-[#667085] block">Households</span>
                        <span className="font-semibold text-[#101828] font-mono">
                          {s.households.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-[#EAECF0] flex items-center gap-2">
                    <Link
                      href={`/relocation/${s.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#164E3A] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0E3326] transition-colors shadow-xs"
                    >
                      <Compass className="h-3.5 w-3.5" />
                      <span>Relocation Sites</span>
                    </Link>

                    <Link
                      href={`/settlements/${s.id}`}
                      className="flex items-center justify-center p-2 rounded-lg border border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F9FAFB] transition-colors"
                      title="View Settlement Telemetry"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={(e) => handleRecompute(s.id, e)}
                      disabled={recomputingId === s.id}
                      className="flex items-center justify-center p-2 rounded-lg border border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F9FAFB] transition-colors disabled:opacity-50"
                      title="Recompute Risk Index"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          recomputingId === s.id ? "animate-spin text-[#164E3A]" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
