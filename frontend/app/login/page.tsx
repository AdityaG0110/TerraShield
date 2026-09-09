"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, UserCheck, ArrowRight, Check } from "lucide-react";
import Navbar from "../../components/Navbar";

interface RoleCard {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  district: string;
  description: string;
  badgeColor: string;
  capabilities: string[];
}

const ROLES: RoleCard[] = [
  {
    id: "state_admin",
    name: "Ankit Sharma",
    email: "ankit.sharma@sdma.gov.in",
    role: "state_authority",
    title: "State Administrator",
    district: "Uttarakhand & Northeast Command",
    badgeColor: "bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5]",
    description: "Executive administrative lead responsible for statewide multi-hazard surveillance, resource allocation, and evacuation sign-offs.",
    capabilities: ["Sign Relocation Directives", "Review Command Center", "Export Statutory Audits"],
  },
  {
    id: "dm",
    name: "Rajeshwar Verma, IAS",
    email: "dm@chamoli.gov.in",
    role: "dm",
    title: "District Magistrate",
    district: "Chamoli District",
    badgeColor: "bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF]",
    description: "District magistrate executing ground evacuation directives and rehabilitation staging for high-risk habitations.",
    capabilities: ["Execute Red Zone Orders", "Oversee QRT Field Units", "Manage Transit Camps"],
  },
  {
    id: "dmo",
    name: "Dr. Ananya Sharma",
    email: "dmo@rudraprayag.gov.in",
    role: "dmo",
    title: "Disaster Management Officer",
    district: "Rudraprayag District",
    badgeColor: "bg-[#F9F5FF] text-[#7C3AED] border-[#E9D7FE]",
    description: "Operational field commander monitoring continuous weather sensors, slope displacement gauges, and river levels.",
    capabilities: ["Live Hazard Recompute", "Monitor GIS Sensor Feeds", "Inspect Habitation Profiles"],
  },
  {
    id: "relief_team",
    name: "Commander S. K. Nair",
    email: "relief@ndrf.gov.in",
    role: "relief_team",
    title: "Relief & Relocation Lead",
    district: "Northeast Regional Command",
    badgeColor: "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]",
    description: "Tactical response officer coordinating safe-zone reception camps, road transport logistics, and humanitarian shelter supplies.",
    capabilities: ["Direct Evacuation Convoys", "Verify Safe Zone Headroom", "Manage Supply Corridors"],
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleCard>(ROLES[0]);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = (role: RoleCard) => {
    setLoggingIn(true);
    localStorage.setItem(
      "terrashield_user",
      JSON.stringify({
        id: role.id,
        name: role.name,
        email: role.email,
        role: role.role,
        role_label: role.title,
        jurisdiction_district: role.district,
      })
    );
    window.dispatchEvent(new Event("storage"));
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#101828] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 sm:py-14 w-full flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#A6F4C5] bg-[#ECFDF3] px-3.5 py-1 text-xs font-semibold text-[#027A48] mb-3 shadow-xs">
            <UserCheck className="h-3.5 w-3.5" />
            <span>Role-Based Command Simulation (Mock Auth)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight">
            Select Your Administrative Persona
          </h1>
          <p className="text-xs text-[#667085] mt-2">
            Select any official role below to test the complete decision support flow, tailored permissions, and jurisdiction views.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ROLES.map((r) => {
            const isSelected = selectedRole.id === r.id;

            return (
              <div
                key={r.id}
                onClick={() => setSelectedRole(r)}
                className={`relative cursor-pointer rounded-2xl border p-5 sm:p-6 transition-all bg-white shadow-xs ${
                  isSelected
                    ? "border-[#164E3A] ring-2 ring-[#164E3A]/20 shadow-md"
                    : "border-[#EAECF0] hover:border-[#D0D5DD]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${r.badgeColor}`}>
                      {r.district}
                    </span>
                    <h3 className="text-base font-bold text-[#101828] mt-2">
                      {r.name}
                    </h3>
                    <p className="text-xs text-[#667085] font-medium">
                      {r.title} • <span className="font-mono">{r.email}</span>
                    </p>
                  </div>

                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                      isSelected
                        ? "border-[#164E3A] bg-[#164E3A] text-white"
                        : "border-[#D0D5DD] bg-white text-transparent"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </div>
                </div>

                <p className="text-xs text-[#344054] mt-3.5 leading-relaxed">
                  {r.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[#EAECF0]">
                  <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block mb-2">
                    Key Authority & Permissions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {r.capabilities.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] bg-[#F9FAFB] border border-[#EAECF0] text-[#344054] px-2 py-0.5 rounded font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => handleLogin(selectedRole)}
            disabled={loggingIn}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#164E3A] px-8 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-[#0E3326] transition-all disabled:opacity-50"
          >
            <span>Enter Command Platform as {selectedRole.name.split(",")[0]}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
