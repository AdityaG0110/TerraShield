"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, UserCheck, ArrowRight, ShieldAlert, Check } from "lucide-react";
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
    id: "dm",
    name: "Rajeshwar Verma, IAS",
    email: "dm@bahraich.gov.in",
    role: "dm",
    title: "District Magistrate",
    district: "Bahraich District",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    description: "Highest administrative officer responsible for executive sign-off on red-zone relocation orders and emergency relief fund disbursal.",
    capabilities: ["Sign Relocation Orders", "Review Priority Queue", "Export Legal Audit Trails"],
  },
  {
    id: "dmo",
    name: "Dr. Ananya Sharma",
    email: "dmo@gonda.gov.in",
    role: "dmo",
    title: "Disaster Management Officer",
    district: "Gonda District",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    description: "Operational field commander monitoring continuous weather sensors, river gauges, and hazard-zone thresholds.",
    capabilities: ["Live Hazard Recompute", "Monitor GIS Sensor Layers", "Inspect Habitation Profiles"],
  },
  {
    id: "state_authority",
    name: "Vikramaditya Rao",
    email: "state@disaster.up.gov.in",
    role: "state_authority",
    title: "State Planning Authority",
    district: "Uttar Pradesh State",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    description: "State-level disaster commissioner overseeing cross-district resource allocation, seasonal flood risk trends, and rehabilitation policy.",
    capabilities: ["Cross-District Analytics", "State Vulnerability Index", "Seasonal Trend Reports"],
  },
  {
    id: "relief_team",
    name: "Commander S. K. Nair",
    email: "relief@ndrf.gov.in",
    role: "relief_team",
    title: "Relief & Relocation Lead",
    district: "Field Rescue Operations",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    description: "Ground operations lead evaluating candidate relocation sites for road connectivity, hospital access, and safe carrying capacity.",
    capabilities: ["Evaluate Candidate Sites", "Audit Carrying Capacity", "Plan Household Staging"],
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
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 sm:py-16 w-full flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/20 px-3.5 py-1 text-xs text-blue-400 mb-3">
            <UserCheck className="h-3.5 w-3.5" />
            <span>Role-Based Decision Simulation (Mock Auth)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Select Your Administrative Persona
          </h1>
          <p className="text-xs text-slate-400 mt-2">
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
                className={`relative cursor-pointer rounded-2xl border p-6 transition-all backdrop-blur-md ${
                  isSelected
                    ? "border-cyan-500/60 bg-gradient-to-b from-[#18263E] to-[#121927] shadow-xl shadow-cyan-950/30 ring-1 ring-cyan-500/40"
                    : "border-slate-800 bg-[#121927] hover:border-slate-700 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${r.badgeColor}`}>
                      {r.district}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">
                      {r.name}
                    </h3>
                    <p className="text-xs font-semibold text-cyan-400">
                      {r.title}
                    </p>
                  </div>

                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-500 text-slate-950"
                        : "border-slate-700 bg-slate-800"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                  {r.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1.5">
                    Authorized Decision Powers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {r.capabilities.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogin(r);
                    }}
                    disabled={loggingIn}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-400"
                        : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    }`}
                  >
                    <span>{loggingIn && isSelected ? "Authenticating..." : `Sign In as ${r.title}`}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-white underline font-mono"
          >
            Skip to Dashboard as Default User &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
