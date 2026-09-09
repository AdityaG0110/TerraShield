"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  FileSpreadsheet,
  Printer,
  Share2,
  CheckCircle2,
  Calendar,
  Building,
  Shield,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

export default function ReportsPage() {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const reports = [
    {
      id: "rep-1",
      title: "Statewide Multi-Hazard Vulnerability Audit 2026",
      type: "Comprehensive Statutory Report",
      scope: "100 Villages across 7 Northeast States",
      date: "09 Sep 2025",
      format: "PDF (8.4 MB)",
      status: "Verified by SDMA",
    },
    {
      id: "rep-2",
      title: "Immediate Relocation Priority Register (Red Zones)",
      type: "Executive Action Directive",
      scope: "89 High Risk & Critical Habitations",
      date: "08 Sep 2025",
      format: "CSV (1.2 MB)",
      status: "Active Staging",
    },
    {
      id: "rep-3",
      title: "Safe Relocation Carrying Capacity & Buffer Analysis",
      type: "Ecological Threshold Report",
      scope: "214 Recommended Candidate Zones",
      date: "06 Sep 2025",
      format: "PDF (4.8 MB)",
      status: "Published",
    },
    {
      id: "rep-4",
      title: "Doppler Radar Precipitation Anomaly Log",
      type: "IMD Telemetry Record",
      scope: "Himalayan Ridge Basins",
      date: "04 Sep 2025",
      format: "CSV (820 KB)",
      status: "Archived",
    },
  ];

  const handleDownload = (title: string, format: string) => {
    setDownloadNotice(`Generating and downloading "${title}" in ${format} format...`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#101828] flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EFF8FF] text-[#175CD3]">
                  <FileText className="h-4 w-4" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#101828]">
                  State Disaster Reports & Compliance Center
                </h1>
              </div>
              <p className="text-xs text-[#667085] mt-1">
                Official NDMA-format documentation, ministerial evacuation orders, and verifiable risk audit trails
              </p>
            </div>

            <button
              onClick={() => handleDownload("Full Comprehensive Package", "ZIP")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#164E3A] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0E3326] transition-colors self-start sm:self-auto"
            >
              <Download className="h-4 w-4" />
              <span>Export Full Package</span>
            </button>
          </div>

          {/* Toast */}
          {downloadNotice && (
            <div className="rounded-xl border border-[#A6F4C5] bg-[#ECFDF3] p-3 text-xs text-[#027A48] flex items-center gap-2 shadow-xs animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-[#12B76A]" />
              <span>{downloadNotice}</span>
            </div>
          )}

          {/* Reports Catalog */}
          <div className="space-y-4">
            {reports.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-[#175CD3] bg-[#EFF8FF] border border-[#B2DDFF] px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {r.type}
                    </span>
                    <span className="text-xs text-[#027A48] font-semibold bg-[#ECFDF3] border border-[#A6F4C5] px-2 py-0.5 rounded-md">
                      {r.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#101828]">
                    {r.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#667085]">
                    <span>Scope: {r.scope}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="h-3 w-3" />
                      {r.date}
                    </span>
                    <span>•</span>
                    <span className="font-mono">{r.format}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                  <button
                    onClick={() => handleDownload(r.title, "PDF")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D0D5DD] bg-white px-3.5 py-2 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB] transition-colors shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5 text-[#164E3A]" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D0D5DD] bg-white p-2 text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB] transition-colors shadow-xs"
                    title="Print Document"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
