import React from "react";
import Link from "next/link";
import {
  Shield,
  MapPin,
  Compass,
  ArrowRight,
  AlertTriangle,
  Layers,
  Activity,
  CheckCircle2,
  Users,
  Leaf,
  Scale,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#101828] selection:bg-[#164E3A] selection:text-white flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#EAECF0] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Problem Statement Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#A6F4C5] bg-[#ECFDF3] px-4 py-1.5 text-xs text-[#027A48] shadow-xs">
                <Leaf className="h-3.5 w-3.5" />
                <span className="font-bold tracking-wide uppercase">
                  SIH26191 — Smart India Hackathon
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#101828] leading-tight">
                See the Risk <span className="text-[#164E3A]">Before</span> the Disaster.
              </h1>

              {/* Sub-headline */}
              <p className="text-sm sm:text-base md:text-lg text-[#475467] leading-relaxed font-normal">
                An explainable AI decision-support platform that identifies hazard-based red zones, evaluates carrying capacity, and automates safe habitation relocation for state and district disaster management authorities.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#164E3A] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#0E3326] transition-all hover:scale-[1.02] w-full sm:w-auto"
                >
                  <span>Launch Decision Command Center</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/map"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-6 py-3.5 text-xs sm:text-sm font-semibold text-[#344054] hover:bg-[#F9FAFB] transition-all w-full sm:w-auto shadow-xs"
                >
                  <MapPin className="h-4 w-4 text-[#164E3A]" />
                  <span>Explore GIS Hazard Map</span>
                </Link>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#D0D5DD] bg-[#F9FAFB] px-5 py-3.5 text-xs sm:text-sm font-semibold text-[#344054] hover:bg-[#F2F4F7] transition-all w-full sm:w-auto shadow-xs"
                >
                  <Users className="h-4 w-4 text-[#7C3AED]" />
                  <span>Persona Switcher</span>
                </Link>
              </div>

              {/* Trust Badge / NDMA Alignment */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#667085] font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#12B76A]" />
                  NDMA Grounded Weights
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#12B76A]" />
                  100% Explainable AI (XAI)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#12B76A]" />
                  Multi-Factor Carrying Capacity
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Threat Matrix Overview Banner */}
        <section className="border-b border-[#EAECF0] bg-[#F9FAFB] py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3">
                <span className="text-2xl sm:text-3xl font-black text-[#101828]">100</span>
                <p className="text-xs text-[#667085] mt-1 font-semibold uppercase tracking-wider">
                  Habitations Monitored
                </p>
              </div>
              <div className="p-3">
                <span className="text-2xl sm:text-3xl font-black text-[#B42318]">56,139</span>
                <p className="text-xs text-[#667085] mt-1 font-semibold uppercase tracking-wider">
                  Population Screened
                </p>
              </div>
              <div className="p-3">
                <span className="text-2xl sm:text-3xl font-black text-[#B54708]">89</span>
                <p className="text-xs text-[#667085] mt-1 font-semibold uppercase tracking-wider">
                  Active Red Zones
                </p>
              </div>
              <div className="p-3">
                <span className="text-2xl sm:text-3xl font-black text-[#164E3A]">512,600</span>
                <p className="text-xs text-[#667085] mt-1 font-semibold uppercase tracking-wider">
                  Safe Carrying Capacity
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Pillar Modules */}
        <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#164E3A]">
              End-to-End Decision Architecture
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#101828] mt-2">
              From Hazard Ingestion to Signed Relocation Order
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-[#EAECF0] bg-white p-6 sm:p-7 shadow-xs hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF8FF] text-[#175CD3] mb-5 border border-[#B2DDFF]">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#101828] mb-2">
                1. Explainable Risk Intelligence
              </h3>
              <p className="text-xs text-[#475467] leading-relaxed">
                Replaces guesswork with an auditable 5-factor scoring formula aligned with NDMA guidelines (slope, rainfall, elevation, density, and disaster history). Delivers transparent factor breakdowns and natural-language risk justifications for every habitation.
              </p>
              <div className="mt-5 pt-4 border-t border-[#EAECF0]">
                <Link
                  href="/settlements"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164E3A] hover:underline"
                >
                  <span>Explore Habitations Registry</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-[#EAECF0] bg-white p-6 sm:p-7 shadow-xs hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF3] text-[#164E3A] mb-5 border border-[#A6F4C5]">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#101828] mb-2">
                2. Full-Spectrum GIS Hazard Map
              </h3>
              <p className="text-xs text-[#475467] leading-relaxed">
                Interactive Leaflet geospatial mapping with high-contrast CartoDB tiles, color-coded hazard category markers (Safe, Watch, Red Zone, Critical), flood-inundation radius buffers, and drill-down drawer telemetry.
              </p>
              <div className="mt-5 pt-4 border-t border-[#EAECF0]">
                <Link
                  href="/map"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164E3A] hover:underline"
                >
                  <span>Open GIS Command Map</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-[#EAECF0] bg-white p-6 sm:p-7 shadow-xs hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFFAEB] text-[#B54708] mb-5 border border-[#FEDF89]">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#101828] mb-2">
                3. Carrying-Capacity Relocation
              </h3>
              <p className="text-xs text-[#475467] leading-relaxed">
                Solves the critical "where do they go?" dilemma. Evaluates safe destination candidate sites within radial corridors using multi-criteria optimization: carrying capacity (40%), haversine distance (30%), and road/health accessibility (30%).
              </p>
              <div className="mt-5 pt-4 border-t border-[#EAECF0]">
                <Link
                  href="/relocation"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164E3A] hover:underline"
                >
                  <span>View Relocation Sites</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAECF0] bg-white py-8 text-xs text-[#667085]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#164E3A] text-white">
              <Leaf className="h-3.5 w-3.5" />
            </div>
            <span className="font-extrabold text-[#101828]">TerraSHIELD</span>
            <span>— Smart India Hackathon 2026 (SIH26191)</span>
          </div>
          <p className="text-center sm:text-right font-medium">
            Intelligent Identification of Red Zones & Carrying Capacity Support
          </p>
        </div>
      </footer>
    </div>
  );
}
