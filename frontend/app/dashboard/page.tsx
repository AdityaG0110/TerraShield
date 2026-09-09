"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  AlertTriangle,
  Flame,
  RefreshCw,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Compass,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RiskSummaryCard from "../../components/RiskSummaryCard";
import RiskMap from "../../components/RiskMap";
import PriorityQueueList from "../../components/PriorityQueueList";
import { DashboardData, SettlementListItem } from "../../lib/types";
import { fetchDashboard, fetchSettlements, recomputeAllRisks } from "../../lib/api";

export default function DashboardPage() {
  const [district, setDistrict] = useState("All Districts");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [settlements, setSettlements] = useState<SettlementListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [recomputing, setRecomputing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async (dist?: string) => {
    try {
      setLoading(true);
      const [dash, setts] = await Promise.all([
        fetchDashboard(dist),
        fetchSettlements({ district: dist }),
      ]);
      setDashboardData(dash);
      setSettlements(setts.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(district);
  }, [district]);

  const handleRecomputeAll = async () => {
    try {
      setRecomputing(true);
      const res = await recomputeAllRisks();
      setToastMessage(res.message || "All habitations re-scored with latest telemetry");
      await loadData(district);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setRecomputing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
      <Navbar selectedDistrict={district} onDistrictChange={setDistrict} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header & Recompute Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Executive Command Dashboard
                </h1>
                <span className="rounded bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-xs font-mono font-semibold text-cyan-300">
                  {district}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Real-time geospatial risk surveillance, population vulnerability, and relocation decision pipeline
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRecomputeAll}
                disabled={recomputing}
                className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/30 px-4 py-2 text-xs font-bold text-cyan-300 shadow-md hover:bg-cyan-900/40 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${recomputing ? "animate-spin" : ""}`} />
                <span>{recomputing ? "Recomputing Telemetry..." : "Re-Score All Habitations"}</span>
              </button>
            </div>
          </div>

          {/* Toast Alert */}
          {toastMessage && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2 shadow-lg animate-in fade-in">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Top Row: 4 KPI Cards (PRD Frame 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <RiskSummaryCard
              title="Population at Risk"
              value={dashboardData ? dashboardData.population_at_risk : "--"}
              subtitle="Citizens in Red & Critical Red Zones"
              icon={Users}
              variant="danger"
              trend="+14% vs normal"
            />
            <RiskSummaryCard
              title="Habitations Monitored"
              value={dashboardData ? dashboardData.total_settlements : "--"}
              subtitle="Geotagged settlements in jurisdiction"
              icon={Building2}
              variant="default"
            />
            <RiskSummaryCard
              title="Red Zone Settlements"
              value={dashboardData ? dashboardData.red_zones : "--"}
              subtitle="High hazard index (50–74.9 pts)"
              icon={AlertTriangle}
              variant="warning"
            />
            <RiskSummaryCard
              title="Critical Red Zones"
              value={dashboardData ? dashboardData.critical_zones : "--"}
              subtitle="Immediate relocation mandatory (75+ pts)"
              icon={Flame}
              variant="danger"
            />
          </div>

          {/* Middle Row: GIS Map Preview & Priority Queue (PRD Frame 2: 8 cols + 4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* GIS Map Preview (8 cols) */}
            <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-[#121927] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    GIS Risk Heatmap & Inundation Buffer Preview
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live geospatial clustering across {district}. Click pins for instant telemetry.
                  </p>
                </div>
                <Link
                  href="/map"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:text-white transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Full GIS Map</span>
                </Link>
              </div>

              <div className="flex-1 min-h-[420px]">
                <RiskMap
                  settlements={settlements}
                  height="420px"
                  initialCenter={[27.50, 81.80]}
                  initialZoom={9}
                  interactiveSideDrawer={true}
                />
              </div>
            </div>

            {/* Relocation Priority Queue (4 cols) */}
            <div className="lg:col-span-4 flex flex-col">
              <PriorityQueueList
                items={dashboardData ? dashboardData.relocation_priority_queue : []}
              />
            </div>
          </div>

          {/* Bottom Row: District Vulnerability Comparison Cards */}
          {dashboardData && dashboardData.district_summaries.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-[#121927] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Cross-District Vulnerability Breakdown
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    District-level hazard exposure aggregates and population requiring evacuation support
                  </p>
                </div>
                <Link
                  href="/analytics"
                  className="text-xs font-semibold text-cyan-400 hover:underline"
                >
                  View Full Analytics & Trends &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {dashboardData.district_summaries.map((ds) => (
                  <div
                    key={ds.district}
                    onClick={() => setDistrict(ds.district)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      district === ds.district
                        ? "border-cyan-500 bg-cyan-950/20"
                        : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{ds.district}</span>
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        Avg: {ds.average_risk_score}/100
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded bg-slate-800/60">
                        <span className="text-[10px] text-slate-400 block">Critical</span>
                        <span className="text-red-400 font-bold font-mono text-sm">
                          {ds.critical_zones}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-slate-800/60">
                        <span className="text-[10px] text-slate-400 block">Red Zones</span>
                        <span className="text-orange-400 font-bold font-mono text-sm">
                          {ds.red_zones}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-slate-800/60">
                        <span className="text-[10px] text-slate-400 block">At Risk Pop.</span>
                        <span className="text-white font-bold font-mono text-sm">
                          {ds.population_at_risk.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
