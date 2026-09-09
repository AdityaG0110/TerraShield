"use client";

import React, { useState } from "react";
import { CheckCircle, Clock, MapPin, Users, Navigation, Activity } from "lucide-react";
import { CandidateSite } from "../lib/types";
import { updateRecommendationStatus } from "../lib/api";

interface Props {
  candidate: CandidateSite;
  rank: number;
  onStatusChange?: (newStatus: string) => void;
}

export default function RecommendationCard({ candidate, rank, onStatusChange }: Props) {
  const [status, setStatus] = useState(candidate.status);
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!candidate.id) return;
    try {
      setLoading(true);
      await updateRecommendationStatus(candidate.id, "approved");
      setStatus("approved");
      if (onStatusChange) onStatusChange("approved");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isTopRanked = rank === 1;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 backdrop-blur-md transition-all ${
        isTopRanked
          ? "border-cyan-500/50 bg-gradient-to-b from-[#16253B] to-[#121927] shadow-lg shadow-cyan-950/20"
          : "border-slate-800 bg-[#121927] hover:border-slate-700"
      }`}
    >
      {isTopRanked && (
        <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-cyan-500 to-blue-600 px-12 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
          Recommended
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between pr-14">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 font-mono text-xs font-bold text-slate-300 border border-slate-700">
              #{rank}
            </span>
            <h4 className="text-sm font-bold text-white leading-tight">
              {candidate.candidate_name}
            </h4>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Navigation className="h-3 w-3 text-cyan-400" />
              {candidate.distance_km} km away
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-emerald-400" />
              {candidate.candidate_latitude.toFixed(3)}°, {candidate.candidate_longitude.toFixed(3)}°
            </span>
          </div>
        </div>
      </div>

      {/* Composite Score Banner */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-900/80 p-3 border border-slate-800/80">
        <span className="text-xs font-medium text-slate-400">
          Suitability Index
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono text-white">
            {candidate.recommendation_score.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400 font-mono">/100</span>
        </div>
      </div>

      {/* Dimensional Breakdown Bars */}
      <div className="mt-4 space-y-2.5 text-xs">
        {/* Capacity (40%) */}
        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Users className="h-3 w-3 text-blue-400" />
              Carrying Capacity (40%)
            </span>
            <span className="font-mono font-semibold">{candidate.capacity_score.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${Math.min(candidate.capacity_score, 100)}%` }}
            />
          </div>
        </div>

        {/* Distance Proximity (30%) */}
        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Navigation className="h-3 w-3 text-cyan-400" />
              Proximity Score (30%)
            </span>
            <span className="font-mono font-semibold">{candidate.distance_score.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{ width: `${Math.min(candidate.distance_score, 100)}%` }}
            />
          </div>
        </div>

        {/* Accessibility (30%) */}
        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Activity className="h-3 w-3 text-emerald-400" />
              Infrastructure & Road Access (30%)
            </span>
            <span className="font-mono font-semibold">{candidate.accessibility_score.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.min(candidate.accessibility_score, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer / Action */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
            status === "approved"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : status === "in_progress"
              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
          }`}
        >
          {status === "approved" ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          <span className="capitalize">{status.replace("_", " ")}</span>
        </span>

        {status !== "approved" ? (
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-500 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Approve Relocation</span>
          </button>
        ) : (
          <span className="text-xs text-emerald-400 font-medium">
            Relocation Order Signed
          </span>
        )}
      </div>
    </div>
  );
}
