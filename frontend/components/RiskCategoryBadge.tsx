import React from "react";
import { RiskCategory } from "../lib/types";

interface Props {
  category: RiskCategory | string;
  score?: number;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function RiskCategoryBadge({ category, score, showScore = false, size = "md" }: Props) {
  const normCat = (category || "safe").toLowerCase();

  let colorClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  let dotColor = "bg-emerald-400";
  let label = "Safe";

  if (normCat === "critical") {
    colorClasses = "bg-red-500/15 text-red-400 border-red-500/40 shadow-sm shadow-red-500/20";
    dotColor = "bg-red-500 animate-ping";
    label = "Critical Red Zone";
  } else if (normCat === "red_zone" || normCat === "red") {
    colorClasses = "bg-orange-500/10 text-orange-400 border-orange-500/30";
    dotColor = "bg-orange-400";
    label = "Red Zone";
  } else if (normCat === "watch") {
    colorClasses = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    dotColor = "bg-amber-400";
    label = "Watch";
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm font-medium",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium tracking-wide backdrop-blur-sm ${colorClasses} ${sizeClasses}`}
    >
      <span className="relative flex h-2 w-2">
        {normCat === "critical" && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`}></span>
      </span>
      <span>{label}</span>
      {showScore && score !== undefined && (
        <span className="opacity-80 font-mono text-[11px]">({score.toFixed(1)})</span>
      )}
    </span>
  );
}
