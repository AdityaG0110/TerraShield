import React from "react";
import Link from "next/link";
import {
  Shield,
  MapPin,
  Compass,
  BarChart3,
  ArrowRight,
  AlertTriangle,
  Layers,
  Activity,
  CheckCircle2,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-cyan-500 selection:text-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800">
          {/* Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Problem Statement Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-4 py-1.5 text-xs text-cyan-300 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-semibold tracking-wide uppercase">
                  SIH26191 — Smart India Hackathon
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                See the Risk <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Before</span> the Disaster.
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                An explainable AI decision-support command platform that identifies hazard-based red zones, evaluates carrying capacity, and automates safe habitation relocation for district administrations across India.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-400 transition-all hover:scale-[1.02] w-full sm:w-auto"
                >
                  <span>Launch Decision Command Center</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/map"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-all w-full sm:w-auto"
                >
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  <span>Explore GIS Risk Map</span>
                </Link>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-950/20 px-5 py-3.5 text-sm font-semibold text-purple-300 hover:bg-purple-900/30 transition-all w-full sm:w-auto"
                >
                  <Users className="h-4 w-4 text-purple-400" />
                  <span>Persona Switcher</span>
                </Link>
              </div>

              {/* Trust Badge / NDMA Alignment */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  NDMA Grounded Weights
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  100% Explainable AI (XAI)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Multi-Factor Carrying Capacity
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Threat Matrix Overview Banner */}
        <section className="border-b border-slate-800 bg-[#0E1524]/60 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white">40</span>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                  Habitations Monitored
                </p>
              </div>
              <div className="p-3">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-red-400">82,400+</span>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                  Population Screened
                </p>
              </div>
              <div className="p-3">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-orange-400">12</span>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                  Active Red Zones
                </p>
              </div>
              <div className="p-3">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">100%</span>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                  Relocation Auditability
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Pillar Modules (PRD 19.1) */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
              End-to-End Decision Architecture
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
              From Hazard Ingestion to Signed Relocation Order
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-800 bg-[#121927] p-7 transition-all hover:border-blue-500/50 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 mb-5 border border-blue-500/30">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                1. Explainable Risk Intelligence
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Replaces guesswork with an auditable 5-factor scoring model (slope 30%, rainfall 25%, elevation 15%, density 15%, incident history 15%). Delivers transparent factor breakdowns and natural-language risk justifications for every habitation.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <Link
                  href="/settlements"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:underline"
                >
                  <span>Explore Habitation Scoring</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-800 bg-[#121927] p-7 transition-all hover:border-cyan-500/50 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 mb-5 border border-cyan-500/30">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                2. Full-Spectrum GIS Risk Map
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive Leaflet geospatial mapping with real-time hazard category color coding (Safe, Watch, Red Zone, Critical), flood-inundation radius buffers, and drill-down drawer telemetry without page reloads.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <Link
                  href="/map"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:underline"
                >
                  <span>Open GIS Command Map</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-800 bg-[#121927] p-7 transition-all hover:border-emerald-500/50 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 mb-5 border border-emerald-500/30">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                3. Carrying-Capacity Relocation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Solves the critical "where do they go?" bottleneck. Evaluates safe destination sites within radius using multi-criteria optimization: carrying capacity (40%), haversine distance (30%), and road/hospital accessibility (30%).
              </p>
              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:underline"
                >
                  <span>View Relocation Queue</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Persona Workflow Section */}
        <section className="py-16 bg-[#0E1424] border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Designed for Official Action
              </h2>
              <p className="text-2xl font-bold text-white mt-1">
                Built Around District & State Administrative Roles
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="rounded-xl border border-slate-800 bg-[#121927] p-5">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block mb-1">
                  Role: DM
                </span>
                <h4 className="font-bold text-white text-sm">District Magistrate</h4>
                <p className="text-slate-400 mt-2">
                  Reviews district red-zone alerts, inspects explainability evidence, and approves relocation orders with legal auditability.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#121927] p-5">
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block mb-1">
                  Role: DMO
                </span>
                <h4 className="font-bold text-white text-sm">Disaster Management Officer</h4>
                <p className="text-slate-400 mt-2">
                  Monitors hazard telemetry continuously, triggers live re-scoring on incoming rainfall, and coordinates field alerts.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#121927] p-5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                  Role: SDMA
                </span>
                <h4 className="font-bold text-white text-sm">State Planning Authority</h4>
                <p className="text-slate-400 mt-2">
                  Analyzes cross-district risk trends, tracks state-wide population at risk, and allocates rehabilitation capital.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#121927] p-5">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
                  Role: NDRF
                </span>
                <h4 className="font-bold text-white text-sm">Relief & Relocation Lead</h4>
                <p className="text-slate-400 mt-2">
                  Audits candidate site capacity, reviews road and water access, and manages phased household evacuation logistics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#080B12] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span className="font-bold text-white font-mono">TerraShield</span>
            <span>— Smart India Hackathon 2026</span>
          </div>
          <p className="text-center sm:text-right">
            Intelligent Relocation & Hazard Decision Support Architecture
          </p>
        </div>
      </footer>
    </div>
  );
}
