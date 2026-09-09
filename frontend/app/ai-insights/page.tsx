"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  BrainCircuit,
  FileText,
  AlertTriangle,
  Compass,
  ArrowRight,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function AIInsightsPage() {
  const [simulatedRainfall, setSimulatedRainfall] = useState(25); // percentage spike

  const factorWeights = [
    { name: "Rainfall Intensity & Runoff", weight: 35, color: "bg-[#0284C7]", desc: "30-day cumulative precip. relative to cloudburst threshold (400mm)" },
    { name: "Terrain Slope Gradient", weight: 30, color: "bg-[#D97706]", desc: "Digital Elevation Model slope degree (> 25° landslide threshold)" },
    { name: "Historical Disaster Incidents", weight: 15, color: "bg-[#DC2626]", desc: "Past 10 years frequency & severity weighted by time-decay" },
    { name: "Habitation Population Density", weight: 10, color: "bg-[#7C3AED]", desc: "Human exposure per square kilometer of high-hazard terrain" },
    { name: "Inundation Elevation Hazard", weight: 10, color: "bg-[#164E3A]", desc: "Topographic low-lying river valley flood accumulation index" },
  ];

  const recentXAINarratives = [
    {
      village: "Joshimath",
      district: "Chamoli, Uttarakhand",
      score: 92.4,
      category: "Critical Red Zone",
      narrative: "Critical hazard classification driven by extreme slope gradient (38.5°) coupled with severe active subsidence telemetry (14.2 cm displacement). Historic flash flood recurrence in adjacent Dhauliganga gorge elevates human exposure index.",
      recommendation: "Immediate prioritized relocation of 5,428 residents to Tapovan Safe Buffer Cluster #2.",
    },
    {
      village: "Raini",
      district: "Chamoli, Uttarakhand",
      score: 88.0,
      category: "Critical Red Zone",
      narrative: "High cumulative rainfall saturation (480 mm/week) exceeding glacial lake outburst flood (GLOF) threshold. Upstream moraine instability indicates impending debris-flow risk along Rishi Ganga corridor.",
      recommendation: "Execute stage-1 relocation directive to Joshimath Ridge Plateau.",
    },
    {
      village: "Resubelpara",
      district: "North Garo Hills, Meghalaya",
      score: 80.8,
      category: "Critical Red Zone",
      narrative: "Steep hill slopes (48°) experiencing intense tropical rainfall saturation. High population density (412/km²) situated directly on unstratified alluvial scree zones.",
      recommendation: "Transition 2,840 residents to Mendipathar Safe Receiving Zone.",
    },
    {
      village: "Koti",
      district: "Rudraprayag, Uttarakhand",
      score: 78.5,
      category: "Critical Red Zone",
      narrative: "Toe erosion along Mandakini riverbank combined with structural fissures observed across 42 dwellings. Soil shear strength lowered by 34% following August rainfall peak.",
      recommendation: "Relocate vulnerable riverside wards to Ukhimath Higher Terrace.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#101828] flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F9F5FF] text-[#7C3AED]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#101828]">
                  Explainable AI (XAI) & Hazard Intelligence
                </h1>
              </div>
              <p className="text-xs text-[#667085] mt-1">
                Auditable machine-learning risk justifications, NDMA sensitivity weighting, and predictive scenario modeling
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-[#7C3AED] bg-[#F9F5FF] border border-[#E9D7FE] px-3 py-1.5 rounded-xl shadow-xs">
              <BrainCircuit className="h-4 w-4" />
              <span>Transparent AI Inference Engine</span>
            </div>
          </div>

          {/* NDMA Weighting Model Sensitivity */}
          <div className="rounded-xl border border-[#EAECF0] bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAECF0] pb-4">
              <div>
                <h2 className="text-base font-bold text-[#101828]">
                  NDMA Multi-Hazard Sensitivity Weighting Matrix
                </h2>
                <p className="text-xs text-[#667085] mt-0.5">
                  Pre-configured, mathematically auditable factor weights governing composite vulnerability scores
                </p>
              </div>
              <span className="text-xs font-bold text-[#164E3A] bg-[#ECFDF3] border border-[#A6F4C5] px-3 py-1 rounded-full self-start sm:self-auto">
                Total Weight: 100%
              </span>
            </div>

            {/* Factor Bars */}
            <div className="space-y-4">
              {factorWeights.map((f) => (
                <div key={f.name} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <span className="font-bold text-[#101828] flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${f.color}`} />
                      {f.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#667085] hidden md:inline">{f.desc}</span>
                      <span className="font-mono font-bold text-[#101828] bg-[#F9FAFB] border border-[#EAECF0] px-2 py-0.5 rounded">
                        {f.weight}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-[#EAECF0] h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${f.color} rounded-full`} style={{ width: `${f.weight}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Predictive Scenario Slider */}
          <div className="rounded-xl border border-[#EAECF0] bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#101828] flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-[#164E3A]" />
                  Predictive Monsoon Stress Simulator
                </h2>
                <p className="text-xs text-[#667085] mt-0.5">
                  Simulate precipitation anomalies and observe real-time red-zone transitions
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#164E3A] bg-[#ECFDF3] border border-[#A6F4C5] px-3 py-1 rounded-md self-start sm:self-auto">
                Simulation Delta: +{simulatedRainfall}% Monsoon Surge
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={100}
                value={simulatedRainfall}
                onChange={(e) => setSimulatedRainfall(Number(e.target.value))}
                className="w-full accent-[#164E3A] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#667085] font-mono">
                <span>Baseline (+0%)</span>
                <span>Normal Monsoon (+25%)</span>
                <span>Heavy Flood Watch (+50%)</span>
                <span>Extreme Cloudburst (+100%)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-3 rounded-lg bg-[#FEF3F2] border border-[#FECDCA]">
                <span className="text-[11px] font-bold text-[#B42318] block">Projected Red Zones</span>
                <span className="text-2xl font-black text-[#912018] mt-1 block">
                  {Math.round(89 + simulatedRainfall * 0.45)} Habitations
                </span>
                <span className="text-[10px] text-[#B42318]">+{Math.round(simulatedRainfall * 0.45)} newly vulnerable</span>
              </div>

              <div className="p-3 rounded-lg bg-[#FFFAEB] border border-[#FEDF89]">
                <span className="text-[11px] font-bold text-[#B54708] block">At-Risk Citizens</span>
                <span className="text-2xl font-black text-[#B54708] mt-1 block">
                  {(56139 + simulatedRainfall * 380).toLocaleString()}
                </span>
                <span className="text-[10px] text-[#B54708]">Direct evacuation queue</span>
              </div>

              <div className="p-3 rounded-lg bg-[#ECFDF3] border border-[#A6F4C5]">
                <span className="text-[11px] font-bold text-[#027A48] block">Safe Zone Buffer Status</span>
                <span className="text-2xl font-black text-[#027A48] mt-1 block">
                  {Math.max(10, 82 - Math.round(simulatedRainfall * 0.35))}% Free
                </span>
                <span className="text-[10px] text-[#027A48]">Adequate receiving headroom</span>
              </div>
            </div>
          </div>

          {/* AI Explainability Cards */}
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#101828]">
                Auditable XAI Risk Justifications (Live Model Output)
              </h2>
              <p className="text-xs text-[#667085] mt-0.5">
                Automated NDMA-compliant reasoning generated for district disaster management authorities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentXAINarratives.map((item) => (
                <div
                  key={item.village}
                  className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-[#101828]">{item.village}</h3>
                        <p className="text-xs text-[#667085]">{item.district}</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]">
                        {item.score} / 100
                      </span>
                    </div>

                    <div className="mt-3.5 p-3 rounded-lg bg-[#F9FAFB] border border-[#EAECF0]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#164E3A] block mb-1">
                        Causal Factor Breakdown
                      </span>
                      <p className="text-xs text-[#344054] leading-relaxed">
                        {item.narrative}
                      </p>
                    </div>

                    <div className="mt-3 p-3 rounded-lg bg-[#ECFDF3] border border-[#A6F4C5]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#027A48] block mb-1">
                        AI Recommended Directive
                      </span>
                      <p className="text-xs text-[#027A48] font-medium leading-relaxed">
                        {item.recommendation}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EAECF0] flex items-center justify-between">
                    <span className="text-[11px] text-[#667085] font-mono">Algorithm: Random Forest + NDMA MCDA</span>
                    <Link
                      href="/settlements"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#164E3A] hover:text-[#0E3326]"
                    >
                      <span>Habitation File</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
