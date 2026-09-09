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
      setTimeout(() => setRecomputeMsg(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setRecomputing(false);
    }
  };

  if (loading || !settlement) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] text-[#101828] flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-3 text-xs text-[#667085] font-mono">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#164E3A] border-t-transparent" />
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
    <div className="min-h-screen bg-[#F4F6F8] text-[#101828] flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Breadcrumb & Top Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Link
              href="/settlements"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#164E3A] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Settlements Registry</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleRecompute}
                disabled={recomputing}
                className="flex items-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-3.5 py-2 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB] transition-all disabled:opacity-50 shadow-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${recomputing ? "animate-spin text-[#164E3A]" : ""}`} />
                <span>{recomputing ? "Re-scoring..." : "Recompute Risk Index"}</span>
              </button>

              <Link
                href={`/relocation/${settlement.id}`}
                className="flex items-center gap-2 rounded-xl bg-[#164E3A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0E3326] transition-all"
              >
                <Compass className="h-4 w-4" />
                <span>Evaluate Relocation Sites</span>
              </Link>
            </div>
          </div>

          {/* Toast Notification */}
          {recomputeMsg && (
            <div className="rounded-xl border border-[#A6F4C5] bg-[#ECFDF3] p-3 text-xs text-[#027A48] flex items-center gap-2 shadow-xs animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-[#12B76A]" />
              <span>{recomputeMsg}</span>
            </div>
          )}

          {/* Top Profile Header Card */}
          <div className="rounded-xl border border-[#EAECF0] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
                    {settlement.name}
                  </h1>
                  <RiskCategoryBadge category={riskCategory} score={riskScore} showScore size="lg" />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#667085]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#E11D48]" />
                    <strong className="text-[#344054]">{settlement.district}</strong>, {settlement.state}
                  </span>
                  <span>•</span>
                  <span className="font-mono">
                    {settlement.latitude.toFixed(4)}°N, {settlement.longitude.toFixed(4)}°E
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Users className="h-3.5 w-3.5 text-[#164E3A]" />
                    {settlement.population.toLocaleString()} Residents ({settlement.households} Households)
                  </span>
                  <span>•</span>
                  <span>Area: {settlement.land_area_km2} km²</span>
                </div>
              </div>

              {/* Big Risk Index Gauge Banner */}
              <div className="flex items-center gap-4 rounded-xl border border-[#EAECF0] bg-[#F9FAFB] px-5 py-4 shrink-0">
                <div className="text-center">
                  <span className="text-[10px] uppercase tracking-wider text-[#667085] font-semibold block">
                    Composite Risk Score
                  </span>
                  <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="text-3xl font-black font-mono text-[#101828]">
                      {riskScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-[#667085] font-mono">/ 100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Natural-Language XAI Narrative */}
            {settlement.explanation && (
              <div className="mt-5 rounded-xl border border-[#D1FADF] bg-[#F6FEF9] p-4 text-xs flex items-start gap-3">
                <FileText className="h-4 w-4 text-[#164E3A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#164E3A] block mb-0.5">
                    Official NDMA-Auditable Risk Justification:
                  </span>
                  <p className="leading-relaxed text-[#344054]">
                    {settlement.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Raw Hazard Parameters Grid */}
          {latestHazard && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
              <div className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between text-[#667085] text-xs">
                  <span className="font-medium">Precipitation</span>
                  <CloudRain className="h-4 w-4 text-[#0284C7]" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-[#101828]">
                    {latestHazard.rainfall_mm}
                  </span>
                  <span className="text-xs text-[#667085] font-mono">mm</span>
                </div>
                <p className="text-[10px] text-[#667085] mt-1">
                  Baseline threshold: 400mm
                </p>
              </div>

              <div className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between text-[#667085] text-xs">
                  <span className="font-medium">Slope Gradient</span>
                  <Mountain className="h-4 w-4 text-[#D97706]" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-[#101828]">
                    {latestHazard.slope_degrees}°
                  </span>
                  <span className="text-xs text-[#667085] font-mono">gradient</span>
                </div>
                <p className="text-[10px] text-[#667085] mt-1">
                  Landslide trigger &gt; 25°
                </p>
              </div>

              <div className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between text-[#667085] text-xs">
                  <span className="font-medium">Elevation</span>
                  <Layers className="h-4 w-4 text-[#164E3A]" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-[#101828]">
                    {latestHazard.elevation_m}
                  </span>
                  <span className="text-xs text-[#667085] font-mono">meters</span>
                </div>
                <p className="text-[10px] text-[#667085] mt-1">
                  Inundation vulnerable &lt; 20m
                </p>
              </div>

              <div className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between text-[#667085] text-xs">
                  <span className="font-medium">Habitation Density</span>
                  <Users className="h-4 w-4 text-[#7C3AED]" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold font-mono text-[#101828]">
                    {latestHazard.population_density.toFixed(0)}
                  </span>
                  <span className="text-xs text-[#667085] font-mono">/km²</span>
                </div>
                <p className="text-[10px] text-[#667085] mt-1">
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
