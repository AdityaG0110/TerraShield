"use client";

import React, { useState, useEffect } from "react";
import { Download, FileSpreadsheet, FileText, CheckCircle2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import TrendChart from "../../components/TrendChart";
import { DashboardData, SettlementListItem } from "../../lib/types";
import { fetchDashboard, fetchSettlements } from "../../lib/api";

export default function AnalyticsPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [settlements, setSettlements] = useState<SettlementListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [dash, setts] = await Promise.all([
          fetchDashboard(),
          fetchSettlements(),
        ]);
        setDashboardData(dash);
        setSettlements(setts.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleExportCSV = () => {
    if (!settlements.length) return;
    const headers = [
      "ID",
      "Name",
      "District",
      "State",
      "Latitude",
      "Longitude",
      "Population",
      "Households",
      "RiskScore",
      "RiskCategory",
    ];
    const rows = settlements.map((s) => [
      s.id,
      `"${s.name}"`,
      s.district,
      s.state,
      s.latitude,
      s.longitude,
      s.population,
      s.households,
      s.risk_score,
      s.risk_category,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `TerraShield_Habitations_Export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportNotice("Settlement vulnerability dataset downloaded as CSV.");
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header & Export Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Disaster Analytics & State Planning Trends
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Predictive hazard indicators, seasonal flood timelines, and cross-district exposure metrics for budget allocation
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500 hover:text-white transition-colors"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
                <span>Export CSV Data</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Print / Save PDF Report</span>
              </button>
            </div>
          </div>

          {exportNotice && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2 shadow-lg animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{exportNotice}</span>
            </div>
          )}

          {/* 2x2 Trend Charts */}
          {dashboardData && (
            <TrendChart districtStats={dashboardData.district_summaries} />
          )}

          {/* State-Level Hazard Category Distribution Breakdown */}
          {dashboardData && (
            <div className="rounded-xl border border-slate-800 bg-[#121927] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    State Risk Categorization Distribution
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Aggregated count of habitations classified across standard disaster categories
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Total: {dashboardData.total_settlements} Monitored
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="rounded-xl border border-red-900/30 bg-red-950/20 p-4">
                  <span className="text-xs uppercase font-bold text-red-400 tracking-wider">
                    Critical Red Zone
                  </span>
                  <div className="mt-2 text-3xl font-black font-mono text-white">
                    {dashboardData.critical_zones}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Risk score 75–100
                  </p>
                </div>

                <div className="rounded-xl border border-orange-900/30 bg-orange-950/20 p-4">
                  <span className="text-xs uppercase font-bold text-orange-400 tracking-wider">
                    Red Zone
                  </span>
                  <div className="mt-2 text-3xl font-black font-mono text-white">
                    {dashboardData.red_zones}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Risk score 50–74.9
                  </p>
                </div>

                <div className="rounded-xl border border-amber-900/30 bg-amber-950/20 p-4">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    Watch
                  </span>
                  <div className="mt-2 text-3xl font-black font-mono text-white">
                    {dashboardData.watch_zones}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Risk score 25–49.9
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/20 p-4">
                  <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                    Safe
                  </span>
                  <div className="mt-2 text-3xl font-black font-mono text-white">
                    {dashboardData.safe_zones}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Risk score 0–24.9
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
