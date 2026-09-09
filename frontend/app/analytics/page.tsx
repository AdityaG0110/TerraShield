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
    <div className="min-h-screen bg-[#F4F6F8] text-[#101828] flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header & Export Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#101828]">
                Disaster Analytics & State Planning Trends
              </h1>
              <p className="text-xs text-[#667085] mt-1">
                Predictive hazard indicators, seasonal flood timelines, and cross-district exposure metrics for budget allocation
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 rounded-xl border border-[#D0D5DD] bg-white px-3.5 py-2 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB] transition-colors shadow-xs"
              >
                <FileSpreadsheet className="h-4 w-4 text-[#164E3A]" />
                <span>Export CSV Data</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 rounded-xl bg-[#164E3A] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0E3326] transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Print / Save PDF Report</span>
              </button>
            </div>
          </div>

          {exportNotice && (
            <div className="rounded-xl border border-[#A6F4C5] bg-[#ECFDF3] p-3 text-xs text-[#027A48] flex items-center gap-2 shadow-xs animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-[#12B76A]" />
              <span>{exportNotice}</span>
            </div>
          )}

          {/* 2x2 Trend Charts */}
          {dashboardData && (
            <TrendChart districtStats={dashboardData.district_summaries} />
          )}

          {/* State-Level Hazard Category Distribution Breakdown */}
          {dashboardData && (
            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#101828]">
                    State Risk Categorization Distribution
                  </h3>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Aggregated count of habitations classified across standard disaster categories
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-[#344054] bg-[#F9FAFB] border border-[#EAECF0] px-2.5 py-1 rounded-md self-start sm:self-auto">
                  Total: {dashboardData.total_settlements} Monitored
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 text-center">
                <div className="rounded-xl border border-[#FECDCA] bg-[#FEF3F2] p-4">
                  <span className="text-xs uppercase font-bold text-[#B42318] tracking-wider">
                    Critical Red Zone
                  </span>
                  <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-[#912018]">
                    {dashboardData.critical_zones}
                  </div>
                  <p className="text-[11px] text-[#B42318]/80 mt-1">
                    Risk score 75–100
                  </p>
                </div>

                <div className="rounded-xl border border-[#FEDF89] bg-[#FFFAEB] p-4">
                  <span className="text-xs uppercase font-bold text-[#B54708] tracking-wider">
                    Red Zone
                  </span>
                  <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-[#B54708]">
                    {dashboardData.red_zones}
                  </div>
                  <p className="text-[11px] text-[#B54708]/80 mt-1">
                    Risk score 50–74.9
                  </p>
                </div>

                <div className="rounded-xl border border-[#B2DDFF] bg-[#EFF8FF] p-4">
                  <span className="text-xs uppercase font-bold text-[#175CD3] tracking-wider">
                    Watch
                  </span>
                  <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-[#175CD3]">
                    {dashboardData.watch_zones}
                  </div>
                  <p className="text-[11px] text-[#175CD3]/80 mt-1">
                    Risk score 25–49.9
                  </p>
                </div>

                <div className="rounded-xl border border-[#A6F4C5] bg-[#ECFDF3] p-4">
                  <span className="text-xs uppercase font-bold text-[#027A48] tracking-wider">
                    Safe
                  </span>
                  <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-[#027A48]">
                    {dashboardData.safe_zones}
                  </div>
                  <p className="text-[11px] text-[#027A48]/80 mt-1">
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
