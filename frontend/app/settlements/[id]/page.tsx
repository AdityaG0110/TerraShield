"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Compass,
  MapPin,
  Users,
  Home,
  Mountain,
  CloudRain,
  Activity,
  Layers,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import RiskCategoryBadge from "../../../components/RiskCategoryBadge";
import RiskBreakdownChart from "../../../components/RiskBreakdownChart";
import IncidentTimeline from "../../../components/IncidentTimeline";
import { SettlementDetail } from "../../../lib/types";
import { fetchSettlementDetail, recomputeSettlementRisk } from "../../../lib/api";

export default function SettlementProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [settlement, setSettlement] = useState<SettlementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [recomputing, setRecomputing] = useState(false);
  const [recomputeMsg, setRecomputeMsg] = useState<string | null>(null);

  const loadDetail = async () => {
    try {
      setLoading(true);
      const data = await fetchSettlementDetail(id);
      setSettlement(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadDetail();
  }, [id]);

  const handleRecompute = async () => {
    try {
      setRecomputing(true);
      const res = await recomputeSettlementRisk(id);
      setRecomputeMsg(res.message);
      await loadDetail();
      setTimeout(() => setRecomputeMsg(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setRecomputing(false);
    }
  };

  if (loading || !settlement) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
            <span>Loading Habitation Profile & Telemetry Breakdown...</span>
          </div>
        </div>
      </div>
    );
  }

  const latestRisk = settlement.latest_risk;
  const latestHazard = settlement.latest_hazard;
  const riskScore = latestRisk ? latestRisk.risk_score : 0.0;
  const riskCategory = latestRisk ? latestRisk.risk_category : "safe";
  const factorBreakdown = latestRisk ? latestRisk.factor_breakdown : [];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/settlements"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Settlements Registry</span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRecompute}
                disabled={recomputing}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:text-white transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${recomputing ? "animate-spin text-cyan-400" : ""}`} />
                <span>{recomputing ? "Re-scoring..." : "Recompute Risk Index"}</span>
              </button>

              <Link
                href={`/relocation/${settlement.id}`}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-orange-600/20 hover:from-orange-500 hover:to-amber-500 transition-all"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Generate Relocation Recommendations</span>
              </Link>
            </div>
          </div>

          {/* Toast Notification */}
          {recomputeMsg && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2 shadow-lg animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{recomputeMsg}</span>
            </div>
          )}

          {/* Top Profile Header Card */}
          <div className="rounded-xl border border-slate-800 bg-[#121927] p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {settlement.name}
                  </h1>
                  <RiskCategoryBadge category={riskCategory} score={riskScore} showScore size="lg" />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                    {settlement.district}, {settlement.state}
                  </span>
                  <span>•</span>
                  <span>
                    Coordinates: {settlement.latitude.toFixed(4)}°N, {settlement.longitude.toFixed(4)}°E
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-blue-400" />
                    {settlement.population.toLocaleString()} Residents ({settlement.households} Households)
                  </span>
                  <span>•</span>
                  <span>Area: {settlement.land_area_km2} km²</span>
                </div>
              </div>

              {/* Big Risk Index Gauge Banner */}
              <div className="flex items-center gap-5 rounded-xl border border-slate-700/80 bg-slate-900/90 px-6 py-4">
                <div className="text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Composite Risk Score
                  </span>
                  <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="text-3xl font-black font-mono text-white">
                      {riskScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Natural-Language XAI Narrative (PRD Section 11 & 19.4) */}
            {settlement.explanation && (
              <div className="mt-5 rounded-lg border border-blue-900/40 bg-blue-950/20 p-4 text-xs text-blue-200 flex items-start gap-3">
                <FileText className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-cyan-300 block mb-0.5">
                    Official NDMA-Auditable Risk Justification:
                  </span>
                  <p className="leading-relaxed text-slate-300 font-sans">
                    {settlement.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Raw Hazard Parameters Grid */}
          {latestHazard && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800 bg-[#121927] p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Precipitation</span>
                  <CloudRain className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-white">
                    {latestHazard.rainfall_mm}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">mm</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Baseline threshold: 400mm
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#121927] p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Slope Gradient</span>
                  <Mountain className="h-4 w-4 text-amber-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-white">
                    {latestHazard.slope_degrees}°
                  </span>
                  <span className="text-xs text-slate-400 font-mono">gradient</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Landslide trigger &gt; 25°
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#121927] p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Elevation</span>
                  <Layers className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-white">
                    {latestHazard.elevation_m}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">meters</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Inundation vulnerable &lt; 20m
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#121927] p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Habitation Density</span>
                  <Users className="h-4 w-4 text-purple-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-white">
                    {latestHazard.population_density.toFixed(0)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/km²</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  High human exposure &gt; 1500
                </p>
              </div>
            </div>
          )}

          {/* Two-Column Grid: Factor Breakdown Chart & Incident Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <RiskBreakdownChart
                factors={factorBreakdown}
                totalScore={riskScore}
              />
            </div>

            <div className="lg:col-span-5">
              <IncidentTimeline
                incidents={settlement.historical_incidents}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
