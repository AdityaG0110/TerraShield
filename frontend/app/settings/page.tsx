"use client";

import React, { useState } from "react";
import {
  Settings,
  Shield,
  Bell,
  Sliders,
  User,
  CheckCircle2,
  Lock,
  Save,
  Sun,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function SettingsPage() {
  const [adminName, setAdminName] = useState("Ankit Sharma");
  const [adminEmail, setAdminEmail] = useState("ankit.sharma@sdma.gov.in");
  const [jurisdiction, setJurisdiction] = useState("Statewide (Uttarakhand & Northeast)");
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoRecompute, setAutoRecompute] = useState(true);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice("Settings and NDMA configuration successfully updated.");
    setTimeout(() => setSavedNotice(null), 4000);
  };

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
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F2F4F7] text-[#344054]">
                  <Settings className="h-4 w-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#101828]">
                  System & Administration Settings
                </h1>
              </div>
              <p className="text-xs text-[#667085] mt-1">
                Configure NDMA model parameters, alert dispatch thresholds, and administrator jurisdiction
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-[#164E3A] bg-[#ECFDF3] border border-[#A6F4C5] px-3 py-1.5 rounded-xl shadow-xs">
              <Sun className="h-4 w-4" />
              <span>Executive Light Theme Active</span>
            </div>
          </div>

          {/* Toast */}
          {savedNotice && (
            <div className="rounded-xl border border-[#A6F4C5] bg-[#ECFDF3] p-3 text-xs text-[#027A48] flex items-center gap-2 shadow-xs animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-[#12B76A]" />
              <span>{savedNotice}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
            {/* Administrator Profile Card */}
            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#EAECF0] pb-3">
                <User className="h-4 w-4 text-[#164E3A]" />
                <h2 className="text-sm font-bold text-[#101828]">
                  State Administrator Profile
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#344054]">Full Name</label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full rounded-xl border border-[#D0D5DD] bg-white py-2 px-3 text-[#101828] focus:border-[#164E3A] focus:outline-none shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#344054]">Official Email</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#D0D5DD] bg-white py-2 px-3 text-[#101828] focus:border-[#164E3A] focus:outline-none shadow-xs"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-[#344054]">Assigned Jurisdiction</label>
                  <input
                    type="text"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full rounded-xl border border-[#D0D5DD] bg-white py-2 px-3 text-[#101828] focus:border-[#164E3A] focus:outline-none shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* NDMA Hazard Classification Thresholds */}
            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#EAECF0] pb-3">
                <Sliders className="h-4 w-4 text-[#164E3A]" />
                <h2 className="text-sm font-bold text-[#101828]">
                  NDMA Hazard Classification Thresholds
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-[#FEF3F2] border border-[#FECDCA]">
                  <span className="font-bold text-[#B42318] block">Critical Red Zone</span>
                  <p className="text-[11px] text-[#B42318]/80 mt-0.5">Composite Score ≥ 75.0</p>
                  <span className="text-[10px] text-[#B42318] font-mono mt-2 block">Mandatory Relocation Staging</span>
                </div>

                <div className="p-3 rounded-lg bg-[#FFFAEB] border border-[#FEDF89]">
                  <span className="font-bold text-[#B54708] block">High Risk Red Zone</span>
                  <p className="text-[11px] text-[#B54708]/80 mt-0.5">Composite Score 50.0 – 74.9</p>
                  <span className="text-[10px] text-[#B54708] font-mono mt-2 block">Active Evacuation Advisory</span>
                </div>

                <div className="p-3 rounded-lg bg-[#EFF8FF] border border-[#B2DDFF]">
                  <span className="font-bold text-[#175CD3] block">Watch / Warning Zone</span>
                  <p className="text-[11px] text-[#175CD3]/80 mt-0.5">Composite Score 25.0 – 49.9</p>
                  <span className="text-[10px] text-[#175CD3] font-mono mt-2 block">Continuous Sensor Audit</span>
                </div>
              </div>
            </div>

            {/* Notification & Automation Preferences */}
            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#EAECF0] pb-3">
                <Bell className="h-4 w-4 text-[#164E3A]" />
                <h2 className="text-sm font-bold text-[#101828]">
                  Notification Channels & Automated Triggers
                </h2>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-[#F9FAFB]">
                  <div>
                    <span className="font-bold text-[#101828] block">Common Alerting Protocol (CAP) SMS Broadcast</span>
                    <span className="text-[#667085] text-[11px]">Send cellular broadcasts to all registered mobile devices in red zones</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="accent-[#164E3A] h-4 w-4"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-[#F9FAFB]">
                  <div>
                    <span className="font-bold text-[#101828] block">Daily SDMA Executive Briefing Email</span>
                    <span className="text-[#667085] text-[11px]">Dispatch automated summary report every morning at 08:00 AM IST</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="accent-[#164E3A] h-4 w-4"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-[#F9FAFB]">
                  <div>
                    <span className="font-bold text-[#101828] block">Automated AI Risk Score Re-computation</span>
                    <span className="text-[#667085] text-[11px]">Recompute composite scores immediately whenever Doppler rainfall exceeds 100mm</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoRecompute}
                    onChange={(e) => setAutoRecompute(e.target.checked)}
                    className="accent-[#164E3A] h-4 w-4"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#164E3A] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0E3326] transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save System Settings</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
