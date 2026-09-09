"use client";

import React from "react";
import Link from "next/link";

interface ActivityItem {
  id: string;
  time: string;
  activity: string;
  user: string;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    time: "10:42 AM",
    activity: "Updated hazard layer [Landslide]",
    user: "R. Mehta",
  },
  {
    id: "2",
    time: "09:28 AM",
    activity: "New relocation site added [Uttarkashi]",
    user: "S. Rawat",
  },
  {
    id: "3",
    time: "08:15 AM",
    activity: "AI risk model re-run completed",
    user: "System",
  },
  {
    id: "4",
    time: "Yesterday",
    activity: "Vulnerable habitation data updated",
    user: "P. Singh",
  },
  {
    id: "5",
    time: "Yesterday",
    activity: "District report generated [Chamoli]",
    user: "A. Verma",
  },
];

export default function LatestActivityCard() {
  return (
    <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#101828]">Latest Activity</h3>
        <Link
          href="/analytics"
          className="text-xs font-semibold text-[#164E3A] hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#F2F4F7] text-[11px] font-semibold text-[#667085]">
              <th className="pb-2.5 font-medium">Time</th>
              <th className="pb-2.5 font-medium">Activity</th>
              <th className="pb-2.5 font-medium text-right">User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F4F7]">
            {DEFAULT_ACTIVITIES.map((item) => (
              <tr key={item.id} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="py-3 text-[#667085] font-mono text-[11px] whitespace-nowrap">
                  {item.time}
                </td>
                <td className="py-3 font-medium text-[#101828]">
                  {item.activity}
                </td>
                <td className="py-3 text-right text-[#475467] font-medium whitespace-nowrap">
                  {item.user}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
