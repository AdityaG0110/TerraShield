"use client";

import React from "react";
import Link from "next/link";
import { PriorityQueueItem } from "../lib/types";

interface Props {
  items: PriorityQueueItem[];
}

export default function TopRiskHabitationsTable({ items }: Props) {
  const topFive = items.slice(0, 5);

  const getPriorityBadge = (score: number, rank: number) => {
    if (score >= 75 || rank <= 2) {
      return (
        <span className="inline-block rounded-md bg-[#EF4444] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
          Immediate
        </span>
      );
    }
    if (score >= 60 || rank <= 4) {
      return (
        <span className="inline-block rounded-md bg-[#F97316] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
          Short Term
        </span>
      );
    }
    return (
      <span className="inline-block rounded-md bg-[#FBBF24] px-2.5 py-0.5 text-[10px] font-bold text-[#78350F] uppercase tracking-wider">
        Medium Term
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#101828]">
          Top 5 High-Risk Habitations
        </h3>
        <Link
          href="/settlements"
          className="text-xs font-semibold text-[#164E3A] hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#F2F4F7] text-[11px] font-semibold text-[#667085]">
              <th className="pb-2.5 font-medium">#</th>
              <th className="pb-2.5 font-medium">Habitation</th>
              <th className="pb-2.5 font-medium">District</th>
              <th className="pb-2.5 font-medium">Population</th>
              <th className="pb-2.5 font-medium">Risk Score</th>
              <th className="pb-2.5 font-medium text-right">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F4F7]">
            {topFive.map((item, idx) => {
              // Convert 0-100 score to 0.00-1.00 format if desired or show decimal
              const scoreDecimal = (item.risk_score / 100).toFixed(2);

              return (
                <tr key={item.settlement_id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3 text-[#667085] font-mono">{idx + 1}</td>
                  <td className="py-3 font-semibold text-[#101828]">
                    <Link
                      href={`/settlements/${item.settlement_id}`}
                      className="hover:text-[#164E3A] hover:underline"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="py-3 text-[#475467]">{item.district}</td>
                  <td className="py-3 text-[#475467] font-mono">
                    {item.population.toLocaleString()}
                  </td>
                  <td className="py-3 font-mono font-bold text-[#101828]">
                    {scoreDecimal}
                  </td>
                  <td className="py-3 text-right">
                    {getPriorityBadge(item.risk_score, idx + 1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
