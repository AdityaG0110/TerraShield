"use client";

import React from "react";
import Link from "next/link";

interface AlertItem {
  id: string;
  title: string;
  location: string;
  time: string;
  color: string;
}

interface Props {
  alerts?: AlertItem[];
}

const DEFAULT_ALERTS: AlertItem[] = [
  {
    id: "1",
    title: "Landslide risk increased",
    location: "Chamoli, Uttarakhand",
    time: "2 hours ago",
    color: "bg-[#EF4444]",
  },
  {
    id: "2",
    title: "New Red Zone identified",
    location: "Rudraprayag, Uttarakhand",
    time: "5 hours ago",
    color: "bg-[#F97316]",
  },
  {
    id: "3",
    title: "High-risk habitation detected",
    location: "Tehri, Uttarakhand",
    time: "12 hours ago",
    color: "bg-[#FBBF24]",
  },
  {
    id: "4",
    title: "Relocation capacity update",
    location: "Pithoragarh, Uttarakhand",
    time: "1 day ago",
    color: "bg-[#3B82F6]",
  },
];

export default function RecentAlertsCard({ alerts = DEFAULT_ALERTS }: Props) {
  return (
    <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#101828]">Recent Alerts</h3>
        <Link
          href="/settlements"
          className="text-xs font-semibold text-[#164E3A] hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3.5">
        {alerts.map((a) => (
          <div key={a.id} className="flex items-start justify-between text-xs">
            <div className="flex items-start gap-2.5">
              <span className={`h-2.5 w-2.5 rounded-full ${a.color} shrink-0 mt-1`} />
              <div>
                <p className="font-semibold text-[#101828] leading-tight">
                  {a.title}
                </p>
                <p className="text-[11px] text-[#667085] mt-0.5">
                  {a.location}
                </p>
              </div>
            </div>
            <span className="text-[11px] text-[#98A2B3] shrink-0 font-medium ml-2">
              {a.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
