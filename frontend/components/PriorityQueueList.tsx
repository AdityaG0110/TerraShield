"use client";

import React from "react";
import Link from "next/link";
import { Compass, AlertCircle, ChevronRight } from "lucide-react";
import { PriorityQueueItem } from "../lib/types";
import RiskCategoryBadge from "./RiskCategoryBadge";

interface Props {
  items: PriorityQueueItem[];
}

export default function PriorityQueueList({ items }: Props) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-[#121927] p-8 text-center">
        <p className="text-xs text-slate-400">
          No pending relocation priorities identified in this jurisdiction.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#121927] overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
            <h3 className="text-sm font-semibold text-white">
              Relocation Priority Action Queue
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated ranking derived from hazard exposure score and vulnerable population
          </p>
        </div>
        <Link
          href="/settlements?risk_category=critical"
          className="text-xs font-semibold text-cyan-400 hover:underline"
        >
          View All Urgent
        </Link>
      </div>

      <div className="divide-y divide-slate-800/60">
        {items.map((item) => {
          const isApproved = item.relocation_status === "Approved";

          return (
            <div
              key={item.settlement_id}
              className="flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                {/* Priority Rank Circle */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                    item.priority_rank <= 3
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : "bg-slate-800 text-slate-300 border border-slate-700"
                  }`}
                >
                  #{item.priority_rank}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/settlements/${item.settlement_id}`}
                      className="text-xs font-semibold text-white hover:text-cyan-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ({item.district})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-mono">
                    <span>Pop: {item.population.toLocaleString()}</span>
                    <span>•</span>
                    <span>Score: <strong className="text-white">{item.risk_score.toFixed(1)}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RiskCategoryBadge category={item.risk_category} size="sm" />

                <span
                  className={`hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded border ${
                    isApproved
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {item.relocation_status}
                </span>

                <Link
                  href={`/relocation/${item.settlement_id}`}
                  className="flex items-center gap-1 rounded-lg bg-blue-600/20 border border-blue-500/40 px-2.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-blue-600/30 transition-colors"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Plan Site</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
