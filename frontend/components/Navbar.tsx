"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Bell, ChevronDown } from "lucide-react";
import RoleSelector from "./RoleSelector";

interface Props {
  selectedDistrict?: string;
  onDistrictChange?: (district: string) => void;
  districtsList?: string[];
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export default function Navbar({
  selectedDistrict = "All Districts",
  onDistrictChange,
  districtsList,
  searchQuery,
  onSearchChange,
}: Props) {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "Ankit Sharma",
    role: "State Administrator",
  });

  useEffect(() => {
    // Current date & time formatting matching Figma
    const now = new Date();
    setCurrentDate(now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }));
    setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

    // Check saved user
    const saved = localStorage.getItem("terrashield_user");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.name) setUserProfile({ name: u.name, role: u.role_label || "State Administrator" });
      } catch (e) {}
    }
  }, []);

  const defaultDistricts = [
    "All Districts",
    "Arunachal Pradesh",
    "Assam",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Tripura",
  ];

  const districts = districtsList && districtsList.length > 0
    ? (districtsList.includes("All Districts") ? districtsList : ["All Districts", ...districtsList])
    : defaultDistricts;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#EAECF0] bg-white px-6">
      {/* Search Input Bar (Figma: "Search location, habitation or district...") */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#98A2B3]" />
          <input
            type="text"
            placeholder="Search location, habitation or district..."
            value={searchQuery || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-[#D0D5DD] bg-white py-2 pl-10 pr-4 text-xs text-[#101828] placeholder-[#98A2B3] focus:border-[#164E3A] focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        {/* State / Location Selector */}
        {onDistrictChange && (
          <div className="flex items-center gap-1.5 rounded-xl border border-[#EAECF0] bg-[#F9FAFB] px-3 py-1.5 text-xs text-[#344054]">
            <MapPin className="h-3.5 w-3.5 text-[#E11D48]" />
            <select
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="bg-transparent font-semibold text-[#344054] focus:outline-none cursor-pointer text-xs"
            >
              {districts.map((d) => (
                <option key={d} value={d} className="bg-white text-[#101828]">
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-[#667085]" />
          </div>
        )}

        {/* Notifications Icon with Red Badge */}
        <div className="relative cursor-pointer rounded-full p-2 text-[#667085] hover:bg-[#F2F4F7] transition-colors">
          <Bell className="h-4 w-4 text-[#EAB308]" />
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white">
            3
          </span>
        </div>

        {/* User Avatar & Name */}
        <div className="flex items-center gap-3 border-l border-[#EAECF0] pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#164E3A] text-xs font-bold text-white">
            {userProfile.name.charAt(0)}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-[#101828] leading-tight">
              {userProfile.name}
            </p>
            <p className="text-[11px] text-[#667085] font-medium leading-tight">
              {userProfile.role}
            </p>
          </div>
        </div>

        {/* Date & Time Widget */}
        <div className="text-right hidden md:block text-[11px] text-[#667085] border-l border-[#EAECF0] pl-4">
          <p className="font-semibold text-[#344054] leading-tight">{currentDate || "Tue, 9 Sep 2025"}</p>
          <p className="font-mono text-[#667085] leading-tight">{currentTime || "11:24 AM"}</p>
        </div>

        {/* Quick Persona Switcher */}
        <RoleSelector />
      </div>
    </header>
  );
}
