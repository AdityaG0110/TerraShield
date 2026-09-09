import React from "react";
import { AlertCircle, Waves, Mountain, Wind, Flame } from "lucide-react";
import { HistoricalIncident } from "../lib/types";

interface Props {
  incidents: HistoricalIncident[];
}

export default function IncidentTimeline({ incidents }: Props) {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-[#121927] p-6 text-center">
        <p className="text-xs text-slate-400">
          No historical disaster incidents recorded for this habitation in the SDMA registry.
        </p>
      </div>
    );
  }

  const getHazardIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "flood":
        return <Waves className="h-4 w-4 text-blue-400" />;
      case "landslide":
        return <Mountain className="h-4 w-4 text-amber-400" />;
      case "cyclone":
        return <Wind className="h-4 w-4 text-cyan-400" />;
      default:
        return <Flame className="h-4 w-4 text-red-400" />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#121927] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Historical Incident Log
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Documented extreme hazard events cross-referenced with SDMA records
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
          {incidents.length} Events Logged
        </span>
      </div>

      <div className="relative border-l border-slate-800 ml-3 space-y-6 pt-2 pb-2">
        {incidents.map((inc) => {
          const dateStr = typeof inc.incident_date === "string" ? inc.incident_date : String(inc.incident_date);
          const severityPct = Math.round(inc.severity * 100);

          return (
            <div key={inc.id} className="relative pl-6">
              {/* Dot marker */}
              <div className="absolute -left-2.5 top-1 flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 bg-slate-900">
                {getHazardIcon(inc.hazard_type)}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white capitalize font-mono">
                    {inc.hazard_type} Event
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {dateStr}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Severity:</span>
                  <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        severityPct > 70 ? "bg-red-500" : severityPct > 40 ? "bg-orange-500" : "bg-yellow-500"
                      }`}
                      style={{ width: `${severityPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-200">
                    {severityPct}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
