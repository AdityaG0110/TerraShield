"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  LogIn,
  Users,
  ShieldCheck,
  RefreshCw,
  Layers,
  Activity,
  Compass,
  FileText,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import HeroMapCard from "../components/HeroMapCard";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#101828] font-sans selection:bg-[#164E3A] selection:text-white flex flex-col relative overflow-x-hidden">
      {/* 1. Header / Navigation Bar (Exact Replica from Image 2) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EAECF0] px-4 sm:px-8 lg:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-[#164E3A] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5 fill-white/20 stroke-white stroke-[2]" />
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-tight text-[#101828] leading-tight">
                TerraSHIELD
              </div>
              <p className="text-[10px] text-[#475467] font-medium tracking-wide">
                Safer Communities. Stronger Tomorrow.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#475467]">
            <Link
              href="#home"
              className="text-[#164E3A] font-bold relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#164E3A]"
            >
              Home
            </Link>
            <Link href="#about" className="hover:text-[#164E3A] transition-colors py-1">
              About
            </Link>
            <Link href="#features" className="hover:text-[#164E3A] transition-colors py-1">
              Features
            </Link>
            <Link href="#impact" className="hover:text-[#164E3A] transition-colors py-1">
              Impact
            </Link>
            <Link href="#resources" className="hover:text-[#164E3A] transition-colors py-1">
              Resources
            </Link>
            <Link href="#contact" className="hover:text-[#164E3A] transition-colors py-1">
              Contact
            </Link>
          </nav>

          {/* Right Action Button -> Login */}
          <div className="hidden md:flex items-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[#164E3A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0E3326] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#344054] hover:bg-[#F4F6F8] transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#EAECF0] space-y-2 pb-2">
            <Link
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-[#164E3A] bg-[#ECFDF3]"
            >
              Home
            </Link>
            <Link
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#475467] hover:bg-[#F9FAFB]"
            >
              About
            </Link>
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#475467] hover:bg-[#F9FAFB]"
            >
              Features
            </Link>
            <Link
              href="#impact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#475467] hover:bg-[#F9FAFB]"
            >
              Impact
            </Link>
            <Link
              href="#resources"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#475467] hover:bg-[#F9FAFB]"
            >
              Resources
            </Link>
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#475467] hover:bg-[#F9FAFB]"
            >
              Contact
            </Link>
            <div className="pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#164E3A] py-2.5 text-xs font-bold text-white shadow-xs"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign in to TerraSHIELD</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section (Exact Replica from Image 2) */}
      <section id="home" className="relative pt-8 sm:pt-14 pb-16 lg:pb-24 overflow-hidden border-b border-[#EAECF0]">
        {/* Subtle Watercolor Mountain Wash in Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40 z-0 flex items-end">
          <div className="relative w-full h-[360px]">
            <Image
              src="/hero-mountain-wash.jpg"
              alt="Misty mountain watercolor background"
              fill
              className="object-cover object-bottom"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              {/* Category Pill Tag */}
              <div>
                <span className="inline-block text-[11px] font-bold tracking-widest text-[#15803D] uppercase">
                  AI | GIS | DISASTER RESILIENCE
                </span>
              </div>

              {/* Massive Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-[#101828]">
                Prepared People.<br />
                <span className="text-[#15803D]">Safer Tomorrow.</span>
              </h1>

              {/* Subtitle Description */}
              <p className="text-sm sm:text-base text-[#475467] font-normal leading-relaxed max-w-xl">
                TerraSHIELD is an AI-driven, GIS-enabled decision-support platform to identify disaster-prone Red Zones, assess safer relocation sites and carrying capacity, and prioritize vulnerable habitations for a resilient India.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#164E3A] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#0E3326] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="#features"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#D0D5DD] bg-white px-6 py-3.5 text-xs sm:text-sm font-semibold text-[#344054] hover:bg-[#F9FAFB] transition-all shadow-2xs"
                >
                  <span>Learn More</span>
                </Link>
              </div>

              {/* 3 Core Value Props Row */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#344054] font-semibold">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <span>Safer Communities</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>Data-Driven Decisions</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#ECFDF3] text-[#16A34A] flex items-center justify-center">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </div>
                  <span>Resilient Future</span>
                </div>
              </div>
            </div>

            {/* Right Interactive GIS Map Card */}
            <div className="lg:col-span-6">
              <HeroMapCard />
            </div>
          </div>

          {/* Bottom Hero Indicator & Tagline */}
          <div className="pt-14 sm:pt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#EAECF0]/60 mt-8">
            <div className="hidden sm:block w-32" />

            {/* Center Scroll to Explore */}
            <a
              href="#about"
              className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#164E3A] transition-colors group cursor-pointer"
            >
              <div className="w-5 h-8 rounded-full border-2 border-gray-300 flex items-start justify-center p-1 group-hover:border-[#164E3A] transition-colors">
                <div className="w-1 h-2 rounded-full bg-gray-400 group-hover:bg-[#164E3A] animate-bounce transition-colors" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#98A2B3] group-hover:text-[#164E3A] transition-colors">
                SCROLL TO EXPLORE
              </span>
            </a>

            {/* Bottom Right Tagline */}
            <div className="text-xs text-[#98A2B3] font-medium tracking-wide text-center sm:text-right">
              Disaster-Resilient India • A Safer Tomorrow
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Section */}
      <section id="about" className="py-16 sm:py-20 bg-[#F9FAFB] border-b border-[#EAECF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#164E3A]">
              Problem Statement (SIH26191)
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
              Predicting High-Risk Red Zones & Computing Carrying Capacity
            </h2>
            <p className="text-sm sm:text-base text-[#475467] leading-relaxed">
              India's Himalayan and sub-Himalayan regions face recurring landslides, flash floods, and cloudbursts. TerraSHIELD delivers a transparent, auditable decision matrix that empowers State & District Disaster Management Authorities to take proactive protective actions before tragedy strikes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#EAECF0] shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-[#ECFDF3] text-[#164E3A] flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-[#101828] mb-2">
                100% Explainable AI (XAI)
              </h3>
              <p className="text-xs text-[#475467] leading-relaxed">
                Zero black-box decisions. Every risk score is calculated via the 5-factor NDMA matrix: slope gradient, rainfall volume, elevation, demographic density, and historical hazard occurrence.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#EAECF0] shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-[#EFF8FF] text-[#175CD3] flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-[#101828] mb-2">
                Multi-Criteria Relocation (MCDA)
              </h3>
              <p className="text-xs text-[#475467] leading-relaxed">
                Automates candidate site selection based on carrying capacity (40%), haversine distance (30%), and road/hospital accessibility (30%) to prevent secondary overcrowding.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#EAECF0] shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-[#FFFAEB] text-[#B54708] flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-[#101828] mb-2">
                Statutory Administrative Audit
              </h3>
              <p className="text-xs text-[#475467] leading-relaxed">
                Generates instant NDMA-compliant relocation orders, evacuation priority queues, and field inspection checklists exportable in CSV and PDF formats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-16 sm:py-20 bg-white border-b border-[#EAECF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#164E3A]">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
              Enterprise Geospatial & Decision Support Infrastructure
            </h2>
            <p className="text-sm sm:text-base text-[#475467]">
              Engineered specifically for disaster management operations in Uttarakhand and the 7 Northeast states.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-[#EAECF0] p-6 hover:shadow-md transition-all bg-[#F9FAFB]">
              <div className="h-11 w-11 rounded-xl bg-[#ECFDF3] text-[#164E3A] flex items-center justify-center mb-4">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#101828] mb-1.5">
                Dynamic Hazard Modeling
              </h3>
              <p className="text-xs text-[#475467] leading-relaxed">
                Automated continuous evaluation of IMD rainfall radar, SRTM digital elevation slope calculations, and real-time precipitation spikes.
              </p>
            </div>

            <div className="rounded-2xl border border-[#EAECF0] p-6 hover:shadow-md transition-all bg-[#F9FAFB]">
              <div className="h-11 w-11 rounded-xl bg-[#EFF8FF] text-[#175CD3] flex items-center justify-center mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#101828] mb-1.5">
                Interactive Cartography
              </h3>
              <p className="text-xs text-[#475467] leading-relaxed">
                CartoDB high-contrast GIS tiles with multi-hazard layers, habitation drill-down drawers, and customizable buffer perimeters.
              </p>
            </div>

            <div className="rounded-2xl border border-[#EAECF0] p-6 hover:shadow-md transition-all bg-[#F9FAFB]">
              <div className="h-11 w-11 rounded-xl bg-[#FFFAEB] text-[#B54708] flex items-center justify-center mb-4">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#101828] mb-1.5">
                Carrying Capacity Optimizer
              </h3>
              <p className="text-xs text-[#475467] leading-relaxed">
                Calculates available land, water reserves, and demographic thresholds before proposing relocation candidate zones.
              </p>
            </div>

            <div className="rounded-2xl border border-[#EAECF0] p-6 hover:shadow-md transition-all bg-[#F9FAFB]">
              <div className="h-11 w-11 rounded-xl bg-[#FDF2FA] text-[#C11574] flex items-center justify-center mb-4">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#101828] mb-1.5">
                Common Alerting (CAP)
              </h3>
              <p className="text-xs text-[#475467] leading-relaxed">
                Integration-ready alert dispatch module for broadcasting SMS bulletins and field team assignments across jurisdictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Impact Metrics Section */}
      <section id="impact" className="py-16 sm:py-20 bg-[#F4F6F8] border-b border-[#EAECF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#164E3A]">
              Demonstrated Impact
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#101828] tracking-tight mt-1">
              Active Monitoring Across High-Risk Sectors
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAECF0] text-center shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-[#101828]">100</div>
              <div className="text-xs font-bold text-[#475467] uppercase tracking-wider mt-2">
                Habitations Monitored
              </div>
              <div className="text-[11px] text-[#98A2B3] mt-1">Across 7 Himalayan States</div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAECF0] text-center shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-[#B42318]">56,139</div>
              <div className="text-xs font-bold text-[#475467] uppercase tracking-wider mt-2">
                Population at Risk
              </div>
              <div className="text-[11px] text-[#98A2B3] mt-1">Screened & Geotagged</div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAECF0] text-center shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-[#B54708]">89</div>
              <div className="text-xs font-bold text-[#475467] uppercase tracking-wider mt-2">
                Active Red Zones
              </div>
              <div className="text-[11px] text-[#98A2B3] mt-1">8 Critical + 81 High Risk</div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAECF0] text-center shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-[#164E3A]">275</div>
              <div className="text-xs font-bold text-[#475467] uppercase tracking-wider mt-2">
                Relocation Solutions
              </div>
              <div className="text-[11px] text-[#98A2B3] mt-1">Capacity-Verified Sites</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Resources Section */}
      <section id="resources" className="py-16 sm:py-20 bg-white border-b border-[#EAECF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#164E3A]">
              Documentation & Standards
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
              Resources & Technical Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-[#EAECF0] bg-[#F9FAFB]">
              <h3 className="text-sm font-bold text-[#101828] mb-2">
                NDMA Guidelines Integration
              </h3>
              <p className="text-xs text-[#475467] leading-relaxed mb-4">
                Alignment with National Disaster Management Authority frameworks for Landslide & Flood Hazard Zonation (LHZ).
              </p>
              <Link href="/login" className="text-xs font-bold text-[#164E3A] hover:underline inline-flex items-center gap-1">
                <span>View Guidelines</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl border border-[#EAECF0] bg-[#F9FAFB]">
              <h3 className="text-sm font-bold text-[#101828] mb-2">
                Open REST & GIS Telemetry APIs
              </h3>
              <p className="text-xs text-[#475467] leading-relaxed mb-4">
                FastAPI endpoints providing GeoJSON hazard feeds, batch CSV import interfaces, and analytical risk scoring.
              </p>
              <Link href="/login" className="text-xs font-bold text-[#164E3A] hover:underline inline-flex items-center gap-1">
                <span>Explore API Docs</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl border border-[#EAECF0] bg-[#F9FAFB]">
              <h3 className="text-sm font-bold text-[#101828] mb-2">
                Audit Trail & Statutory Reports
              </h3>
              <p className="text-xs text-[#475467] leading-relaxed mb-4">
                Automated generation of official District Collectorate memos and emergency evacuation executive summaries.
              </p>
              <Link href="/login" className="text-xs font-bold text-[#164E3A] hover:underline inline-flex items-center gap-1">
                <span>Access Reports</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-[#F9FAFB] border-b border-[#EAECF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#164E3A]">
              Get in Touch
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
              State & District Command Center Support
            </h2>
            <p className="text-xs sm:text-sm text-[#475467]">
              Ready to deploy TerraSHIELD for your State Disaster Management Authority or District EOC?
            </p>
          </div>

          <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-[#EAECF0] shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#344054] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Officer Name"
                  className="w-full rounded-xl border border-[#D0D5DD] px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#164E3A]/20 focus:border-[#164E3A] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#344054] mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  placeholder="officer@sdma.gov.in"
                  className="w-full rounded-xl border border-[#D0D5DD] px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#164E3A]/20 focus:border-[#164E3A] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#344054] mb-1">
                State / District Jurisdiction
              </label>
              <input
                type="text"
                placeholder="e.g. Uttarakhand / Chamoli District"
                className="w-full rounded-xl border border-[#D0D5DD] px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#164E3A]/20 focus:border-[#164E3A] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#344054] mb-1">
                Message / Deployment Request
              </label>
              <textarea
                rows={3}
                placeholder="Describe your early warning or relocation decision support needs..."
                className="w-full rounded-xl border border-[#D0D5DD] px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#164E3A]/20 focus:border-[#164E3A] focus:outline-hidden"
              />
            </div>

            <Link
              href="/login"
              className="w-full rounded-xl bg-[#164E3A] hover:bg-[#0E3326] text-white font-semibold py-3 text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <span>Submit & Open Command Center</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-white py-10 text-xs text-[#667085]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#164E3A] flex items-center justify-center text-white">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold text-[#101828]">TerraSHIELD</span>
              <span className="text-[#475467] ml-2">Smart India Hackathon 2026 (SIH26191)</span>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="font-medium text-[#344054]">
              Intelligent Identification of Red Zones & Carrying Capacity Support
            </p>
            <p className="text-[11px] text-[#98A2B3]">
              Designed for National and State Disaster Management Authorities (NDMA / SDMA).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
