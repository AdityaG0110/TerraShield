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
  Leaf,
  X,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { label: "Hazard Map", href: "/map", icon: Map },
    { label: "Red Zones", href: "/red-zones", icon: CircleDot, iconColor: "text-red-500" },
    { label: "Vulnerable Habitations", href: "/settlements", icon: Home, iconColor: "text-orange-500" },
    { label: "Relocation Sites", href: "/relocation", icon: MapPin, iconColor: "text-rose-500" },
    { label: "Carrying Capacity", href: "/carrying-capacity", icon: Scale, iconColor: "text-amber-500" },
    { label: "AI Insights", href: "/ai-insights", icon: Sparkles, iconColor: "text-purple-500" },
    { label: "Alerts", href: "/alerts", icon: Bell, iconColor: "text-amber-500", badge: 3 },
    { label: "Reports", href: "/reports", icon: FileText, iconColor: "text-blue-500" },
    { label: "Field Operations", href: "/field-operations", icon: Truck, iconColor: "text-emerald-500" },
    { label: "Data Sources", href: "/data-sources", icon: Database, iconColor: "text-indigo-500" },
    { label: "Settings", href: "/settings", icon: Settings, iconColor: "text-slate-400" },
  ];

  const renderNavContent = (isMobileDrawer: boolean = false) => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Logo & Tagline */}
        <div className="p-4 sm:p-5 border-b border-[#F2F4F7] flex items-center justify-between">
          <Link href="/dashboard" onClick={() => isMobileDrawer && close()} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#164E3A] text-white shadow-sm shrink-0">
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

          {isMobileDrawer && (
            <button
              onClick={close}
              className="p-1.5 rounded-lg text-[#667085] hover:bg-[#F2F4F7] md:hidden"
              aria-label="Close Sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => isMobileDrawer && close()}
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
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-white border-r border-[#EAECF0] flex-col justify-between select-none min-h-screen">
        {renderNavContent(false)}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={close}
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <div className="relative z-50 w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
            {renderNavContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
