"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import SettlementTable from "../../components/SettlementTable";
import { SettlementListItem } from "../../lib/types";
import { fetchSettlements } from "../../lib/api";

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState<SettlementListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchSettlements();
      setSettlements(data.results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Habitations & Vulnerability Registry
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Searchable catalog of all monitored habitations across Bahraich, Gonda, and Shravasti with live hazard indices and re-scoring actions
            </p>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-slate-800 bg-[#121927]">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                <span>Loading Habitation Registry...</span>
              </div>
            </div>
          ) : (
            <SettlementTable
              initialSettlements={settlements}
              onRefreshNeeded={loadData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
