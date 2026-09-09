"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  AlertTriangle,
  Map as MapIcon,
  Users,
  MapPin,
  Trees,
  ChevronDown,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RiskSummaryCard from "../../components/RiskSummaryCard";
import RiskMap from "../../components/RiskMap";
import RiskDistributionDonut from "../../components/RiskDistributionDonut";
import RecentAlertsCard from "../../components/RecentAlertsCard";
import TopRiskHabitationsTable from "../../components/TopRiskHabitationsTable";
import LatestActivityCard from "../../components/LatestActivityCard";
import { DashboardData, SettlementListItem } from "../../lib/types";
import { fetchDashboard, fetchSettlements } from "../../lib/api";

export default function DashboardPage() {
  const [district, setDistrict] = useState("All Districts");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [settlements, setSettlements] = useState<SettlementListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hazardFilter, setHazardFilter] = useState("All Hazards");

  const loadData = async (dist?: string) => {
    try {
      setLoading(true);
      const [dash, setts] = await Promise.all([
        fetchDashboard(dist),
        fetchSettlements({ district: dist }),
      ]);
      setDashboardData(dash);
      setSettlements(setts.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(district);
  }, [district]);

  // Filter settlements based on search query if present
  const displayedSettlements = settlements.filter((s) =>
    searchQuery ? s.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  const totalHabitations = dashboardData?.total_settlements || 100;
  const highRiskCount = (dashboardData?.critical_zones || 8) + (dashboardData?.red_zones || 81);
  const peopleAtRisk = dashboardData?.population_at_risk || 56139;

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#101828] flex">
      {/* Figma Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Figma Header / Navbar */}
        <Navbar
          selectedDistrict={district}
          onDistrictChange={setDistrict}
          districtsList={dashboardData ? dashboardData.district_summaries.map((d) => d.district) : undefined}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome & Motivational Quote Header matching Figma */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#101828]">
                Welcome back, Ankit
              </h1>
              <p className="text-xs text-[#667085] mt-0.5">
                Monitor risks, analyze insights and take action for safer communities.
              </p>
            </div>

            <p className="text-xs italic text-[#667085] font-serif">
              &ldquo;Preparedness Today. A Safer Tomorrow.&rdquo;
            </p>
          </div>

          {/* Row of 6 KPI Cards matching Figma */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <RiskSummaryCard
              title="Habitations Assessed"
              value={totalHabitations}
              icon={Home}
              trend="↑ +6%"
              trendType="up-good"
              iconBg="bg-[#ECFDF3]"
              iconColor="text-[#164E3A]"
            />
            <RiskSummaryCard
              title="High Risk Habitations"
              value={highRiskCount}
              icon={AlertTriangle}
              trend="↓ +12%"
              trendType="down-bad"
              iconBg="bg-[#FEF3F2]"
              iconColor="text-[#EF4444]"
            />
            <RiskSummaryCard
              title="Red Zone Area"
              value="4,320 km²"
              icon={MapIcon}
              trend="↓ +8%"
              trendType="down-bad"
              iconBg="bg-[#EFF8FF]"
              iconColor="text-[#3B82F6]"
            />
            <RiskSummaryCard
              title="People at Risk"
              value={peopleAtRisk}
              icon={Users}
              trend="↑ +14%"
              trendType="up-good"
              iconBg="bg-[#F9F5FF]"
              iconColor="text-[#7C3AED]"
            />
            <RiskSummaryCard
              title="Recommended Sites"
              value={275}
              icon={MapPin}
              trend="↑ +5%"
              trendType="up-good"
              iconBg="bg-[#FEF2F2]"
              iconColor="text-[#E11D48]"
            />
            <RiskSummaryCard
              title="Available Capacity"
              value="512,600"
              icon={Trees}
              trend="↑ +11%"
              trendType="up-good"
              iconBg="bg-[#F0FDF4]"
              iconColor="text-[#16A34A]"
            />
          </div>

          {/* Middle Row: Risk Map (8 cols) + Risk Distribution & Alerts (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Box: Risk Map */}
            <div className="lg:col-span-8 rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#101828]">Risk Map</h3>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Multi-hazard view with vulnerable habitations and relocation sites
                  </p>
                </div>

                {/* Hazard Filter dropdown matching Figma */}
                <div className="flex items-center gap-1.5 rounded-lg border border-[#D0D5DD] bg-white px-2.5 py-1 text-xs text-[#344054]">
                  <select
                    value={hazardFilter}
                    onChange={(e) => setHazardFilter(e.target.value)}
                    className="bg-transparent font-medium focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="All Hazards">All Hazards</option>
                    <option value="Landslide">Landslide Only</option>
                    <option value="Flood">Flood Only</option>
                    <option value="Cyclone">Cyclone Only</option>
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-[#667085]" />
                </div>
              </div>

              {/* Map Canvas */}
              <div className="h-[430px] w-full overflow-hidden rounded-xl">
                <RiskMap
                  settlements={displayedSettlements}
                  height="430px"
                  interactiveSideDrawer={true}
                />
              </div>
            </div>

            {/* Right Box: Risk Distribution Donut & Recent Alerts */}
            <div className="lg:col-span-4 space-y-6">
              <RiskDistributionDonut
                totalCount={totalHabitations}
                distribution={dashboardData?.risk_category_distribution ? {
                  critical: dashboardData.risk_category_distribution.critical || 8,
                  red_zone: dashboardData.risk_category_distribution.red_zone || 81,
                  watch: dashboardData.risk_category_distribution.watch || 11,
                  safe: dashboardData.risk_category_distribution.safe || 0,
                } : undefined}
              />

              <RecentAlertsCard />
            </div>
          </div>

          {/* Bottom Row: Top 5 High-Risk Habitations & Latest Activity matching Figma */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopRiskHabitationsTable
              items={dashboardData?.relocation_priority_queue || []}
            />

            <LatestActivityCard />
          </div>
        </main>
      </div>
    </div>
  );
}
