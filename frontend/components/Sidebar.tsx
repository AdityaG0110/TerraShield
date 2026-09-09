"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Building2,
  Compass,
  BarChart3,
  Home,
  AlertOctagon,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "GIS Risk Map", href: "/map", icon: MapPin },
    { label: "Settlements", href: "/settlements", icon: Building2 },
    { label: "Relocation Engine", href: "/relocation/all", icon: Compass },
    { label: "Analytics & Trends", href: "/analytics", icon: BarChart3 },
    { label: "Public Overview", href: "/", icon: Home },
  ];

  return (
    <aside className="w-16 md:w-64 shrink-0 border-r border-slate-800 bg-[#0E1424] flex flex-col justify-between py-5 select-none transition-all">
      <div className="space-y-6 px-3">
        <div className="px-3 hidden md:block">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Decision Command
          </p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href) ||
                  (item.label === "Relocation Engine" && pathname.startsWith("/relocation"));

            return (
              <Link
                key={item.label}
                href={item.href === "/relocation/all" ? "/settlements" : item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600/20 text-cyan-300 border border-blue-500/30 shadow-md shadow-blue-500/10"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-3 space-y-3">
        {/* Emergency Alert Hotline widget */}
        <div className="hidden md:block rounded-xl border border-red-900/30 bg-red-950/20 p-3">
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold">
            <AlertOctagon className="h-4 w-4 animate-pulse text-red-400" />
            <span>SDMA Emergency Hotline</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Bahraich Flood Control: 1077 / 05252-232145
          </p>
        </div>

        <Link
          href="/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800/60 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="hidden md:inline">Switch / Logout</span>
        </Link>
      </div>
    </aside>
  );
}
