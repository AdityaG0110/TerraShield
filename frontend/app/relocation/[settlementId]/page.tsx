"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Compass,
  MapPin,
  CheckCircle2,
  Users,
  ShieldAlert,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import RecommendationCard from "../../../components/RecommendationCard";
import RiskCategoryBadge from "../../../components/RiskCategoryBadge";
import RiskMap from "../../../components/RiskMap";
import { RecommendationResponse, SettlementListItem } from "../../../lib/types";
import { fetchRecommendations } from "../../../lib/api";

export default function RelocationPage() {
  const params = useParams();
  const settlementId = params.settlementId as string;

  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [approvalAlert, setApprovalAlert] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchRecommendations(settlementId);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (settlementId) loadData();
  }, [settlementId]);

  const handleStatusChange = (status: string) => {
    setApprovalAlert("Relocation recommendation successfully approved and transitioned into active district staging!");
    loadData();
    setTimeout(() => setApprovalAlert(null), 5000);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
            <span>Computing Carrying Capacity & Optimization Vectors...</span>
          </div>
        </div>
      </div>
    );
  }

  // Create mock map markers representing source settlement and candidates
  const mapMarkers: SettlementListItem[] = [
    {
      id: data.source_settlement_id,
      name: `SOURCE: ${data.source_settlement_name}`,
      district: data.source_district,
      state: "Uttar Pradesh",
      latitude: data.candidates[0]?.candidate_latitude ? data.candidates[0].candidate_latitude - 0.05 : 27.57,
      longitude: data.candidates[0]?.candidate_longitude ? data.candidates[0].candidate_longitude + 0.04 : 81.59,
      population: data.source_population,
      households: Math.round(data.source_population / 5),
      land_area_km2: 1.5,
      risk_category: data.source_risk_category,
      risk_score: data.source_risk_score,
      critical_factors: ["Source Evacuation Zone"],
      created_at: new Date().toISOString(),
    },
    ...data.candidates.map((c, idx) => ({
      id: c.id || `cand-${idx}`,
      name: `SITE #${idx + 1}: ${c.candidate_name}`,
      district: data.source_district,
      state: "Uttar Pradesh",
      latitude: c.candidate_latitude,
      longitude: c.candidate_longitude,
      population: 800,
      households: 160,
      land_area_km2: 3.5,
      risk_category: "safe" as const,
      risk_score: 18.0,
      critical_factors: ["Safe Relocation Candidate"],
      created_at: new Date().toISOString(),
    })),
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between">
            <Link
              href={`/settlements/${data.source_settlement_id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to {data.source_settlement_name} Profile</span>
            </Link>

            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-800/40 px-3 py-1 rounded-full">
              Multi-Criteria Optimization Active
            </span>
          </div>

          {/* Alert */}
          {approvalAlert && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2 shadow-lg animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{approvalAlert}</span>
            </div>
          )}

          {/* Top Banner: Origin Settlement Context */}
          <div className="rounded-xl border border-orange-900/40 bg-gradient-to-r from-orange-950/30 to-[#121927] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
                    Source Habitation Pending Relocation
                  </span>
                </div>
                <h1 className="text-2xl font-black text-white">
                  {data.source_settlement_name}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {data.source_district} District • {data.source_population.toLocaleString()} citizens requiring planned evacuation
                </p>
              </div>

              <div className="flex items-center gap-3">
                <RiskCategoryBadge
                  category={data.source_risk_category}
                  score={data.source_risk_score}
                  showScore
                  size="lg"
                />
              </div>
            </div>
          </div>

          {/* Spatial Map Preview of Candidates */}
          <div className="rounded-xl border border-slate-800 bg-[#121927] p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Spatial Relocation Corridor & Buffer Map
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visualizing source habitation relative to scored safe alternative relocation sites
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Max Search Radius: 35 km
              </span>
            </div>

            <div className="h-80 w-full overflow-hidden rounded-lg">
              <RiskMap
                settlements={mapMarkers}
                height="320px"
                initialCenter={[data.candidates[0]?.candidate_latitude || 27.57, data.candidates[0]?.candidate_longitude || 81.59]}
                initialZoom={10}
                interactiveSideDrawer={false}
              />
            </div>
          </div>

          {/* Candidate Cards Grid (PRD Frame 5: 3 cards per row) */}
          <div className="space-y-3">
            <div>
              <h2 className="text-base font-bold text-white">
                Ranked Destination Candidates
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated and ordered by Capacity Score (0.4), Distance Score (0.3), and Accessibility Score (0.3)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.candidates.map((candidate, idx) => (
                <RecommendationCard
                  key={candidate.id || idx}
                  candidate={candidate}
                  rank={idx + 1}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
