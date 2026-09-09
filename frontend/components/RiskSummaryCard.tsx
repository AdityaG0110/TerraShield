import React from "react";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "warning" | "danger" | "success" | "info";
  trend?: string;
}

export default function RiskSummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  trend,
}: Props) {
  const variantStyles = {
    default: "border-slate-800 bg-[#121927]/90 text-slate-100 hover:border-slate-700",
    danger: "border-red-900/40 bg-red-950/20 text-red-100 hover:border-red-700/60 shadow-lg shadow-red-950/20",
    warning: "border-orange-900/40 bg-orange-950/20 text-orange-100 hover:border-orange-700/60 shadow-lg shadow-orange-950/20",
    success: "border-emerald-900/40 bg-emerald-950/20 text-emerald-100 hover:border-emerald-700/60",
    info: "border-blue-900/40 bg-blue-950/20 text-blue-100 hover:border-blue-700/60",
  }[variant];

  const iconColors = {
    default: "text-slate-400 bg-slate-800/80",
    danger: "text-red-400 bg-red-900/40",
    warning: "text-orange-400 bg-orange-900/40",
    success: "text-emerald-400 bg-emerald-900/40",
    info: "text-blue-400 bg-blue-900/40",
  }[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 ${variantStyles}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`rounded-lg p-2.5 ${iconColors}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-white font-mono">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {trend && (
          <span className="text-xs font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
