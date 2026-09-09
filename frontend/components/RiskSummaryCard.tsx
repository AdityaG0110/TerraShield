import React from "react";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendType?: "up-good" | "up-bad" | "down-bad" | "down-good";
  iconBg?: string;
  iconColor?: string;
}

export default function RiskSummaryCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = "up-good",
  iconBg = "bg-[#ECFDF3]",
  iconColor = "text-[#164E3A]",
}: Props) {
  const isPositive = trendType.includes("good");
  const trendColor = isPositive ? "text-[#16B364]" : "text-[#F04438]";

  return (
    <div className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-xs hover:border-[#D0D5DD] transition-all">
      <div className="flex items-center justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
        {trend && (
          <span className={`text-[11px] font-semibold ${trendColor} flex items-center gap-0.5`}>
            {trend}
          </span>
        )}
      </div>

      <div className="mt-3">
        <span className="text-2xl font-bold tracking-tight text-[#101828] font-sans">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        <p className="text-xs text-[#667085] font-medium mt-0.5">
          {title}
        </p>
      </div>
    </div>
  );
}
