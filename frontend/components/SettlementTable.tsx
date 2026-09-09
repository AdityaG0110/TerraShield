"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, RefreshCw, ArrowUpDown, ChevronRight, Compass } from "lucide-react";
import { SettlementListItem } from "../lib/types";
import RiskCategoryBadge from "./RiskCategoryBadge";
import { recomputeSettlementRisk } from "../lib/api";

interface Props {
  initialSettlements: SettlementListItem[];
  onRefreshNeeded?: () => void;
}

export default function SettlementTable({ initialSettlements, onRefreshNeeded }: Props) {
  const [settlements, setSettlements] = useState<SettlementListItem[]>(initialSettlements);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortField, setSortField] = useState<"risk_score" | "population" | "name">("risk_score");
  const [sortAsc, setSortAsc] = useState(false);
  const [recomputingId, setRecomputingId] = useState<string | null>(null);

  // Filter settlements
  const filtered = settlements.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = districtFilter === "All" || s.district === districtFilter;
    const matchesCategory = categoryFilter === "All" || s.risk_category === categoryFilter;
    return matchesSearch && matchesDistrict && matchesCategory;
  });

  // Sort settlements
  filtered.sort((a, b) => {
    let comp = 0;
    if (sortField === "risk_score") comp = a.risk_score - b.risk_score;
    else if (sortField === "population") comp = a.population - b.population;
    else comp = a.name.localeCompare(b.name);
    return sortAsc ? comp : -comp;
  });

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
      if (onRefreshNeeded) onRefreshNeeded();
    } catch (err) {
      console.error(err);
    } finally {
      setRecomputingId(null);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#121927] p-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search habitation name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* District filter */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Districts</option>
            <option value="Bahraich">Bahraich</option>
            <option value="Gonda">Gonda</option>
            <option value="Shravasti">Shravasti</option>
          </select>

          {/* Risk category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="critical">Critical Red Zone</option>
            <option value="red_zone">Red Zone</option>
            <option value="watch">Watch</option>
            <option value="safe">Safe</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#121927]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold">
            <tr>
              <th
                onClick={() => {
                  if (sortField === "name") setSortAsc(!sortAsc);
                  else { setSortField("name"); setSortAsc(true); }
                }}
                className="py-3.5 px-4 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1.5">
                  Habitation / Settlement
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">District</th>
              <th
                onClick={() => {
                  if (sortField === "population") setSortAsc(!sortAsc);
                  else { setSortField("population"); setSortAsc(false); }
                }}
                className="py-3.5 px-4 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1.5">
                  Population
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => {
                  if (sortField === "risk_score") setSortAsc(!sortAsc);
                  else { setSortField("risk_score"); setSortAsc(false); }
                }}
                className="py-3.5 px-4 cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1.5">
                  Risk Score
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Hazard Category</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Primary Risk Driver</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No habitations match the selected search criteria.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <Link
                      href={`/settlements/${s.id}`}
                      className="font-medium text-white group-hover:text-cyan-400 transition-colors block"
                    >
                      {s.name}
                    </Link>
                    <span className="text-[11px] font-mono text-slate-400 block">
                      {s.latitude.toFixed(4)}°N, {s.longitude.toFixed(4)}°E
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-slate-300 font-medium">{s.district}</span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="text-white font-semibold">{s.population.toLocaleString()}</span>
                    <span className="text-slate-400 text-[11px] block">{s.households} households</span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {s.risk_score.toFixed(1)}
                      </span>
                      <span className="text-slate-400 text-[10px]">/100</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <RiskCategoryBadge category={s.risk_category} />
                  </td>

                  <td className="py-3 px-4 hidden md:table-cell text-slate-400">
                    {s.critical_factors && s.critical_factors.length > 0 ? (
                      <span className="text-[11px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-amber-300">
                        {s.critical_factors.join(", ")}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Within Thresholds</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Recompute button */}
                      <button
                        title="Recompute Risk Score with Latest Sensor Data"
                        onClick={(e) => handleRecompute(s.id, e)}
                        disabled={recomputingId === s.id}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <RefreshCw
                          className={`h-3.5 w-3.5 ${recomputingId === s.id ? "animate-spin text-cyan-400" : ""}`}
                        />
                      </button>

                      {/* Relocation link for red/critical */}
                      {(s.risk_category === "red_zone" || s.risk_category === "critical") && (
                        <Link
                          href={`/relocation/${s.id}`}
                          title="View Relocation Recommendations"
                          className="flex items-center gap-1 rounded bg-orange-600/20 border border-orange-500/30 px-2 py-1 text-[11px] font-semibold text-orange-300 hover:bg-orange-600/30 transition-colors"
                        >
                          <Compass className="h-3 w-3" />
                          <span>Relocate</span>
                        </Link>
                      )}

                      {/* Detail link */}
                      <Link
                        href={`/settlements/${s.id}`}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
