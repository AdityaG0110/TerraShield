"use client";

import React, { useState, useEffect } from "react";
import { Shield, User, ChevronDown, Check, AlertCircle } from "lucide-react";
import { UserProfile } from "../lib/types";

interface RoleOption {
  role: string;
  name: string;
  email: string;
  title: string;
  district: string;
  badgeColor: string;
}

const PRESET_ROLES: RoleOption[] = [
  {
    role: "dm",
    name: "Rajeshwar Verma, IAS",
    email: "dm@bahraich.gov.in",
    title: "District Magistrate (Bahraich)",
    district: "Bahraich",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    role: "dmo",
    name: "Dr. Ananya Sharma",
    email: "dmo@gonda.gov.in",
    title: "Disaster Management Officer (Gonda)",
    district: "Gonda",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    role: "state_authority",
    name: "Vikramaditya Rao",
    email: "state@disaster.up.gov.in",
    title: "State Planning Authority (UP SDMA)",
    district: "Uttar Pradesh",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    role: "relief_team",
    name: "Commander S. K. Nair",
    email: "relief@ndrf.gov.in",
    title: "NDRF Relief & Relocation Lead",
    district: "Field Operations",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
];

interface Props {
  onRoleChange?: (role: RoleOption) => void;
}

export default function RoleSelector({ onRoleChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<RoleOption>(PRESET_ROLES[0]);

  useEffect(() => {
    const saved = localStorage.getItem("terrashield_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = PRESET_ROLES.find((r) => r.email === parsed.email);
        if (match) {
          setCurrentRole(match);
          if (onRoleChange) onRoleChange(match);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSelect = (role: RoleOption) => {
    setCurrentRole(role);
    localStorage.setItem(
      "terrashield_user",
      JSON.stringify({
        name: role.name,
        email: role.email,
        role: role.role,
        role_label: role.title,
        jurisdiction_district: role.district,
      })
    );
    setIsOpen(false);
    if (onRoleChange) onRoleChange(role);
    // Trigger custom storage event for sync across components
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-lg border border-slate-700/80 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800 focus:outline-none"
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
        <div className="flex flex-col text-left">
          <span className="font-semibold text-white truncate max-w-[140px] md:max-w-[200px]">
            {currentRole.name}
          </span>
          <span className="text-[10px] text-slate-400 truncate max-w-[140px] md:max-w-[200px]">
            {currentRole.title}
          </span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-lg">
            <div className="px-3 py-2 border-b border-slate-800">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Switch Role / Persona (Mocked)
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Simulate different decision-maker permissions for SIH evaluation
              </p>
            </div>
            <div className="mt-1 space-y-1">
              {PRESET_ROLES.map((r) => {
                const isSelected = r.email === currentRole.email;
                return (
                  <button
                    key={r.email}
                    onClick={() => handleSelect(r)}
                    className={`w-full flex items-start gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-blue-600/20 text-white border border-blue-500/30"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="mt-0.5">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-100">{r.name}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{r.title}</p>
                      <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded border ${r.badgeColor}`}>
                        {r.district}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
