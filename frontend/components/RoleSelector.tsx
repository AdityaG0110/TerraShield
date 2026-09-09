"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ChevronDown, Check, LogOut, Shield } from "lucide-react";
import { useAuth, DEMO_USERS, AuthUser } from "./AuthContext";

interface Props {
  onRoleChange?: (user: AuthUser) => void;
}

export default function RoleSelector({ onRoleChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, switchDemoUser, logout } = useAuth();
  const router = useRouter();

  const handleSelect = (demoUser: AuthUser) => {
    switchDemoUser(demoUser.id);
    setIsOpen(false);
    if (onRoleChange) onRoleChange(demoUser);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/login");
  };

  const demoAccountsList = Object.values(DEMO_USERS);

  return (
    <div className="relative">
      {/* Top-Right Profile Card Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-lg border border-slate-700/80 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800 focus:outline-hidden cursor-pointer"
        title="Active Officer Profile - Click to switch demo account"
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
        <div className="flex flex-col text-left">
          <span className="font-semibold text-white truncate max-w-[140px] md:max-w-[200px]">
            {user.name}
          </span>
          <span className="text-[10px] text-slate-400 truncate max-w-[140px] md:max-w-[200px]">
            {user.role_label}
          </span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1 shrink-0" />
      </button>

      {/* Profile & Switcher Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-lg">
            <div className="px-3 py-2 border-b border-slate-800">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span>Switch Demo Persona</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Select an official role to test decision support & jurisdiction views
              </p>
            </div>

            {/* List of 3 Official Demo Personas */}
            <div className="mt-1 space-y-1">
              {demoAccountsList.map((acc) => {
                const isSelected = acc.id === user.id || acc.email.toLowerCase() === user.email.toLowerCase();

                return (
                  <button
                    key={acc.id}
                    onClick={() => handleSelect(acc)}
                    className={`w-full flex items-start gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600/20 text-white border border-emerald-500/40"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-emerald-400 font-bold text-xs shrink-0">
                      {acc.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-100">{acc.name}</span>
                        {isSelected && <Check className="h-4 w-4 text-emerald-400 stroke-[2.5]" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{acc.role_label}</p>
                      <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800/80 text-slate-300">
                        {acc.district}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sign Out Action */}
            <div className="mt-2 pt-2 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out to Login Page</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
