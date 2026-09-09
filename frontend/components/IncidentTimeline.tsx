import React from "react";
import { AlertCircle, Waves, Mountain, Wind, Flame } from "lucide-react";
import { HistoricalIncident } from "../lib/types";

interface Props {
  incidents: HistoricalIncident[];
}

export default function IncidentTimeline({ incidents }: Props) {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="rounded-xl border border-[#EAECF0] bg-white p-6 text-center shadow-xs">
        <p className="text-xs text-[#667085]">
          No historical disaster incidents recorded for this habitation in the SDMA registry.
        </p>
      </div>
    );
  }

  const getHazardIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "flood":
        return <Waves className="h-4 w-4 text-[#0284C7]" />;
      case "landslide":
        return <Mountain className="h-4 w-4 text-[#D97706]" />;
      case "cyclone":
        return <Wind className="h-4 w-4 text-[#0891B2]" />;
      default:
        return <Flame className="h-4 w-4 text-[#DC2626]" />;
    }
  };

  return (
    <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#101828]">
            Historical Incident Log
          </h3>
          <p className="text-xs text-[#667085] mt-0.5">
            Documented extreme hazard events cross-referenced with SDMA records
          </p>
        </div>
        <span className="text-xs font-semibold text-[#344054] bg-[#F9FAFB] border border-[#EAECF0] px-2.5 py-1 rounded-md">
          {incidents.length} Events Logged
        </span>
      </div>

      <div className="relative border-l border-[#EAECF0] ml-3 space-y-5 pt-2 pb-2">
        {incidents.map((inc) => {
          const dateStr = typeof inc.incident_date === "string" ? inc.incident_date : String(inc.incident_date);
          const severityPct = Math.round(inc.severity * 100);

          return (
            <div key={inc.id} className="relative pl-6">
              {/* Dot marker */}
              <div className="absolute -left-2.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-[#EAECF0] bg-white shadow-xs">
                {getHazardIcon(inc.hazard_type)}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-[#F9FAFB] border border-[#EAECF0] p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#101828] capitalize">
                    {inc.hazard_type} Event
                  </span>
                  <span className="text-[11px] font-mono text-[#667085]">
                    {dateStr}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#667085]">Severity:</span>
                  <div className="w-20 bg-[#EAECF0] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        severityPct > 70 ? "bg-[#DC2626]" : severityPct > 40 ? "bg-[#F97316]" : "bg-[#F59E0B]"
                      }`}
                      style={{ width: `${severityPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#101828]">
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

