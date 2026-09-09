"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Globe, Eye, EyeOff, Check, ArrowRight, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";

interface DemoAccount {
  id: string;
  initial: string;
  name: string;
  roleTitle: string;
  email: string;
  passwordDisplay: string;
  role: string;
  district: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "ankit",
    initial: "A",
    name: "Ankit Sharma",
    roleTitle: "State Administrator",
    email: "admin@terrashield.gov.in",
    passwordDisplay: "Terra@2025",
    role: "state_authority",
    district: "Uttarakhand & Northeast Command",
  },
  {
    id: "mehta",
    initial: "R",
    name: "R. Mehta",
    roleTitle: "District Officer (Chamoli)",
    email: "officer@chamoli.gov.in",
    passwordDisplay: "Chamoli@123",
    role: "dm",
    district: "Chamoli District",
  },
  {
    id: "singh",
    initial: "P",
    name: "P. Singh",
    roleTitle: "Risk Analyst",
    email: "analyst@ndma.gov.in",
    passwordDisplay: "NDMA@2025",
    role: "dmo",
    district: "National / State SDMA",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedAccountId, setSelectedAccountId] = useState<string>("ankit");
  const [email, setEmail] = useState<string>("admin@terrashield.gov.in");
  const [password, setPassword] = useState<string>("Terra@2025");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectAccount = (acc: DemoAccount) => {
    setSelectedAccountId(acc.id);
    setEmail(acc.email);
    setPassword(acc.passwordDisplay);
  };

  const executeLogin = (acc?: DemoAccount) => {
    setIsSubmitting(true);
    const targetAccount = acc || DEMO_ACCOUNTS.find((a) => a.id === selectedAccountId) || DEMO_ACCOUNTS[0];

    localStorage.setItem(
      "terrashield_user",
      JSON.stringify({
        id: targetAccount.id,
        name: targetAccount.name,
        email: email || targetAccount.email,
        role: targetAccount.role,
        role_label: targetAccount.roleTitle,
        jurisdiction_district: targetAccount.district,
      })
    );
    window.dispatchEvent(new Event("storage"));

    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FFFFFF] font-sans selection:bg-[#164E3A] selection:text-white">
      {/* Left Visual Half (Himalayan Mountains + Atmospheric Green Gradient) */}
      <div className="relative w-full md:w-1/2 min-h-[440px] md:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden text-white">
        {/* Mountain Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/login-mountain-bg.jpg"
            alt="Misty Himalayan mountain range and stupa"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Deep Forest Green Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#164E3A]/88 via-[#0F3527]/84 to-[#071912]/94 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#0B2519]/40" />
        </div>

        {/* Top Branding */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center text-[#4ADE80] backdrop-blur-sm group-hover:scale-105 transition-transform">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>TerraSHIELD</span>
              </div>
              <p className="text-[11px] text-[#A6F4C5] font-medium tracking-wide">
                Safer Communities. Stronger Tomorrow.
              </p>
            </div>
          </Link>
        </div>

        {/* Center Hero Copy */}
        <div className="relative z-10 my-8 md:my-auto max-w-lg space-y-4">
          <span className="inline-block text-[11px] font-bold tracking-widest text-[#4ADE80] uppercase">
            AI | GIS | DISASTER RESILIENCE
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
            Prepared People.<br />
            <span className="text-[#22C55E]">Safer Tomorrow.</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-200/90 leading-relaxed font-normal pt-1">
            Access the TerraSHIELD command centre to monitor disaster risks, plan safe relocations, and protect vulnerable communities across India.
          </p>
        </div>

        {/* Bottom Statistics */}
        <div className="relative z-10 pt-4 border-t border-white/15">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                12,842
              </div>
              <div className="text-[10px] sm:text-xs text-[#A6F4C5] font-medium mt-0.5">
                Habitations Monitored
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                214
              </div>
              <div className="text-[10px] sm:text-xs text-[#A6F4C5] font-medium mt-0.5">
                Safe Relocation Sites
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                94%
              </div>
              <div className="text-[10px] sm:text-xs text-[#A6F4C5] font-medium mt-0.5">
                AI Accuracy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Half (Sign In + Interactive Demo Accounts) */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-[420px] space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight">
              Sign in
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Access your TerraSHIELD dashboard
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeLogin();
            }}
            className="space-y-4"
          >
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#344054] mb-1.5">
                EMAIL / USER ID
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@terrashield.gov.in"
                className="w-full rounded-xl border border-[#D0D5DD] bg-white px-4 py-2.5 text-sm text-[#101828] placeholder-[#98A2B3] focus:border-[#164E3A] focus:outline-hidden focus:ring-2 focus:ring-[#164E3A]/20 transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#344054] mb-1.5">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#D0D5DD] bg-white px-4 py-2.5 pr-10 text-sm text-[#101828] placeholder-[#98A2B3] focus:border-[#164E3A] focus:outline-hidden focus:ring-2 focus:ring-[#164E3A]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#475467] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="text-[11px] text-[#667085] hover:text-[#164E3A] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#164E3A] hover:bg-[#0E3326] text-white font-semibold py-3 text-sm shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Sign in to TerraSHIELD</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EAECF0]" />
            </div>
            <span className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-[#98A2B3]">
              DEMO ACCOUNTS
            </span>
          </div>

          {/* Demo Accounts List */}
          <div className="space-y-2.5">
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = selectedAccountId === acc.id;

              return (
                <div
                  key={acc.id}
                  onClick={() => selectAccount(acc)}
                  className={`group relative flex items-center justify-between p-3 sm:p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#22C55E] bg-[#F0FDF4] shadow-xs"
                      : "border-[#EAECF0] hover:border-[#D0D5DD] bg-white hover:bg-[#F9FAFB]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Circle Avatar */}
                    <div className="h-9 w-9 rounded-full bg-[#0B192C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {acc.initial}
                    </div>

                    {/* Name & Role */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-[#101828]">
                          {acc.name}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center justify-center text-[#16A34A]">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#667085] font-normal">
                        {acc.roleTitle}
                      </p>
                    </div>
                  </div>

                  {/* Credentials & Quick Action */}
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-[11px] text-[#475467] font-mono">
                        {acc.email}
                      </div>
                      <div className="text-[10px] text-[#98A2B3] font-mono">
                        {acc.passwordDisplay}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAccount(acc);
                        executeLogin(acc);
                      }}
                      className="h-7 w-7 rounded-lg border border-[#EAECF0] bg-white flex items-center justify-center text-[#667085] group-hover:text-[#164E3A] group-hover:border-[#164E3A]/40 transition-colors shadow-2xs"
                      title="Quick Login as this persona"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show Login Hint Accordion */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1 text-[11px] text-[#667085] hover:text-[#101828] transition-colors"
            >
              <span>Show login hint</span>
              {showHint ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>

            {showHint && (
              <div className="mt-2.5 p-3 rounded-xl bg-[#F4F6F8] border border-[#EAECF0] text-left text-xs text-[#475467] space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-[#164E3A] font-bold text-[11px]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>SIH 2026 Evaluation Hint</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Click any demo account above to automatically pre-fill credentials. Click the arrow button to instantly sign in and enter the live Command Center dashboard.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
