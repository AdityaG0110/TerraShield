"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, RefreshCw, ArrowUpDown, ChevronRight, Compass, MapPin } from "lucide-react";
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
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.district.toLowerCase().includes(search.toLowerCase()) ||
      s.state.toLowerCase().includes(search.toLowerCase());
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

  const uniqueDistricts = React.useMemo(() => {
    const set = new Set<string>();
    settlements.forEach((s) => {
      if (s.district) set.add(s.district);
    });
    return Array.from(set).sort();
  }, [settlements]);

  return (
    <div className="w-full space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-[#EAECF0] bg-white p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#98A2B3]" />
          <input
            type="text"
            placeholder="Search habitation, district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#D0D5DD] bg-white py-2 pl-9 pr-3 text-xs text-[#101828] placeholder-[#98A2B3] focus:border-[#164E3A] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* District filter */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="rounded-xl border border-[#D0D5DD] bg-[#F9FAFB] px-3 py-2 text-xs font-semibold text-[#344054] focus:border-[#164E3A] focus:outline-none cursor-pointer flex-1 sm:flex-none"
          >
            <option value="All">All Districts</option>
            {uniqueDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Risk category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-[#D0D5DD] bg-[#F9FAFB] px-3 py-2 text-xs font-semibold text-[#344054] focus:border-[#164E3A] focus:outline-none cursor-pointer flex-1 sm:flex-none"
          >
            <option value="All">All Categories</option>
            <option value="critical">Critical Red Zone</option>
            <option value="red_zone">Red Zone</option>
            <option value="watch">Watch</option>
            <option value="safe">Safe</option>
          </select>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto rounded-xl border border-[#EAECF0] bg-white shadow-xs">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="border-b border-[#EAECF0] bg-[#F9FAFB] text-[#475467] uppercase tracking-wider font-semibold">
            <tr>
              <th
                onClick={() => {
                  if (sortField === "name") setSortAsc(!sortAsc);
                  else {
                    setSortField("name");
                    setSortAsc(true);
                  }
                }}
                className="py-3 px-4 cursor-pointer hover:text-[#101828] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  Habitation / Settlement
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-4">District</th>
              <th
                onClick={() => {
                  if (sortField === "population") setSortAsc(!sortAsc);
                  else {
                    setSortField("population");
                    setSortAsc(false);
                  }
                }}
                className="py-3 px-4 cursor-pointer hover:text-[#101828] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  Population
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => {
                  if (sortField === "risk_score") setSortAsc(!sortAsc);
                  else {
                    setSortField("risk_score");
                    setSortAsc(false);
                  }
                }}
                className="py-3 px-4 cursor-pointer hover:text-[#101828] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  Risk Score
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-4">Hazard Category</th>
              <th className="py-3 px-4 hidden md:table-cell">Primary Risk Driver</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAECF0] text-[#344054]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[#667085]">
                  No habitations match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-[#F9FAFB] transition-colors group"
                >
                  <td className="py-3 px-4">
                    <Link
                      href={`/settlements/${s.id}`}
                      className="font-bold text-[#101828] group-hover:text-[#164E3A] transition-colors block"
                    >
                      {s.name}
                    </Link>
                    <span className="text-[11px] font-mono text-[#667085] block">
                      {s.latitude.toFixed(4)}°N, {s.longitude.toFixed(4)}°E
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[#344054] font-medium">{s.district}</span>
                    <span className="text-[11px] text-[#667085] block">{s.state}</span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="text-[#101828] font-bold">
                      {s.population.toLocaleString()}
                    </span>
                    <span className="text-[#667085] text-[11px] block">
                      {s.households} households
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#101828]">
                        {s.risk_score.toFixed(1)}
                      </span>
                      <span className="text-[#667085] text-[10px]">/100</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <RiskCategoryBadge category={s.risk_category} />
                  </td>

                  <td className="py-3 px-4 hidden md:table-cell text-[#667085]">
                    {s.critical_factors && s.critical_factors.length > 0 ? (
                      <span className="text-[11px] bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318] px-2 py-0.5 rounded-md font-medium">
                        {s.critical_factors.join(", ")}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#667085]">Within NDMA Limits</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Recompute button */}
                      <button
                        title="Recompute Risk Score"
                        onClick={(e) => handleRecompute(s.id, e)}
                        disabled={recomputingId === s.id}
                        className="rounded-lg p-1.5 text-[#667085] hover:bg-[#F2F4F7] hover:text-[#101828] transition-colors"
                      >
                        <RefreshCw
                          className={`h-3.5 w-3.5 ${
                            recomputingId === s.id ? "animate-spin text-[#164E3A]" : ""
                          }`}
                        />
                      </button>

                      {/* Relocation link for red/critical */}
                      {(s.risk_category === "red_zone" || s.risk_category === "critical") && (
                        <Link
                          href={`/relocation/${s.id}`}
                          title="View Relocation Recommendations"
                          className="flex items-center gap-1 rounded-lg bg-[#FEF3F2] border border-[#FECDCA] px-2 py-1 text-[11px] font-semibold text-[#B42318] hover:bg-[#FEE4E2] transition-colors"
                        >
                          <Compass className="h-3 w-3" />
                          <span className="hidden sm:inline">Relocate</span>
                        </Link>
                      )}

                      {/* Detail link */}
                      <Link
                        href={`/settlements/${s.id}`}
                        className="rounded-lg p-1.5 text-[#667085] hover:bg-[#F2F4F7] hover:text-[#164E3A] transition-colors"
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
