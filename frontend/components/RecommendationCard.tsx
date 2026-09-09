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
      className={`relative overflow-hidden rounded-xl border p-5 transition-all shadow-xs ${
        isTopRanked
          ? "border-[#164E3A] bg-white ring-2 ring-[#164E3A]/10 shadow-md"
          : "border-[#EAECF0] bg-white hover:border-[#D0D5DD]"
      }`}
    >
      {isTopRanked && (
        <div className="absolute -right-12 top-6 rotate-45 bg-[#164E3A] px-12 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
          Recommended
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between pr-14">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-bold ${
                isTopRanked
                  ? "bg-[#164E3A] text-white"
                  : "bg-[#F9FAFB] text-[#344054] border border-[#EAECF0]"
              }`}
            >
              #{rank}
            </span>
            <h4 className="text-sm font-bold text-[#101828] leading-tight">
              {candidate.candidate_name}
            </h4>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#667085]">
            <span className="flex items-center gap-1 font-mono">
              <Navigation className="h-3 w-3 text-[#164E3A]" />
              {candidate.distance_km} km away
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <MapPin className="h-3 w-3 text-[#E11D48]" />
              {candidate.candidate_latitude.toFixed(3)}°, {candidate.candidate_longitude.toFixed(3)}°
            </span>
          </div>
        </div>
      </div>

      {/* Composite Score Banner */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-[#F9FAFB] p-3 border border-[#EAECF0]">
        <span className="text-xs font-medium text-[#667085]">
          Suitability Index
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold font-mono text-[#101828]">
            {candidate.recommendation_score.toFixed(1)}
          </span>
          <span className="text-xs text-[#667085] font-mono">/ 100</span>
        </div>
      </div>

      {/* Dimensional Breakdown Bars */}
      <div className="mt-4 space-y-2.5 text-xs">
        {/* Capacity (40%) */}
        <div>
          <div className="flex justify-between text-[#344054] mb-1">
            <span className="flex items-center gap-1.5 text-[11px] text-[#667085]">
              <Users className="h-3 w-3 text-[#2563EB]" />
              Carrying Capacity (40%)
            </span>
            <span className="font-mono font-bold text-[#101828]">{candidate.capacity_score.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#EAECF0] overflow-hidden">
            <div
              className="h-full bg-[#2563EB] rounded-full"
              style={{ width: `${Math.min(candidate.capacity_score, 100)}%` }}
            />
          </div>
        </div>

        {/* Distance Proximity (30%) */}
        <div>
          <div className="flex justify-between text-[#344054] mb-1">
            <span className="flex items-center gap-1.5 text-[11px] text-[#667085]">
              <Navigation className="h-3 w-3 text-[#0891B2]" />
              Proximity Score (30%)
            </span>
            <span className="font-mono font-bold text-[#101828]">{candidate.distance_score.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#EAECF0] overflow-hidden">
            <div
              className="h-full bg-[#0891B2] rounded-full"
              style={{ width: `${Math.min(candidate.distance_score, 100)}%` }}
            />
          </div>
        </div>

        {/* Accessibility (30%) */}
        <div>
          <div className="flex justify-between text-[#344054] mb-1">
            <span className="flex items-center gap-1.5 text-[11px] text-[#667085]">
              <Activity className="h-3 w-3 text-[#164E3A]" />
              Infrastructure & Road Access (30%)
            </span>
            <span className="font-mono font-bold text-[#101828]">{candidate.accessibility_score.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#EAECF0] overflow-hidden">
            <div
              className="h-full bg-[#164E3A] rounded-full"
              style={{ width: `${Math.min(candidate.accessibility_score, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer / Action */}
      <div className="mt-5 pt-3.5 border-t border-[#EAECF0] flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
            status === "approved"
              ? "bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5]"
              : status === "in_progress"
              ? "bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF]"
              : "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]"
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
            className="flex items-center gap-1.5 rounded-xl bg-[#164E3A] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#0E3326] transition-colors disabled:opacity-50"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Approve Relocation</span>
          </button>
        ) : (
          <span className="text-xs text-[#027A48] font-semibold">
            Order Approved
          </span>
        )}
      </div>
    </div>
  );
}
