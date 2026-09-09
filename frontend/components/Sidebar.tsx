"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  CircleDot,
  Home,
  MapPin,
  Scale,
  Sparkles,
  Bell,
  FileText,
  Truck,
  Database,
  Settings,
  Shield,
  Leaf,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { label: "Hazard Map", href: "/map", icon: Map },
    { label: "Red Zones", href: "/settlements?risk_category=critical", icon: CircleDot, iconColor: "text-red-500" },
    { label: "Vulnerable Habitations", href: "/settlements", icon: Home, iconColor: "text-orange-500" },
    { label: "Relocation Sites", href: "/settlements", icon: MapPin, iconColor: "text-red-400" },
    { label: "Carrying Capacity", href: "/dashboard", icon: Scale, iconColor: "text-amber-500" },
    { label: "AI Insights", href: "/analytics", icon: Sparkles, iconColor: "text-purple-500" },
    { label: "Alerts", href: "/dashboard", icon: Bell, iconColor: "text-amber-500", badge: 3 },
    { label: "Reports", href: "/analytics", icon: FileText, iconColor: "text-blue-500" },
    { label: "Field Operations", href: "/settlements", icon: Truck, iconColor: "text-emerald-500" },
    { label: "Data Sources", href: "/analytics", icon: Database, iconColor: "text-indigo-500" },
    { label: "Settings", href: "/login", icon: Settings, iconColor: "text-slate-400" },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-[#EAECF0] flex flex-col justify-between select-none min-h-screen">
      <div>
        {/* Brand Logo & Tagline */}
        <div className="p-5 border-b border-[#F2F4F7]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#164E3A] text-white shadow-sm">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-base font-extrabold tracking-tight text-[#164E3A] font-sans">
                  Terra<span className="text-[#0E3326]">SHIELD</span>
                </span>
              </div>
              <p className="text-[11px] text-[#667085] font-medium -mt-0.5">
                Safer Communities.
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) && item.href !== "/dashboard";

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#164E3A] text-white shadow-sm"
                    : "text-[#344054] hover:bg-[#F9FAFB] hover:text-[#101828]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? "text-white" : item.iconColor || "text-[#667085]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Navy Banner matching Figma */}
      <div className="p-3">
        <div className="rounded-xl bg-[#0B192C] p-4 text-white shadow-sm">
          <p className="text-xs font-bold leading-tight">Prepared People</p>
          <p className="text-xs font-bold text-slate-200 leading-tight">Safer Tomorrow</p>
          <p className="text-[10px] text-slate-400 font-mono mt-1.5">TerraSHIELD v2.1</p>
        </div>
      </div>
    </aside>
  );
}
