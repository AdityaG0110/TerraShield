import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TerraShield — AI Hazard Risk Intelligence & Relocation Decision Support",
  description: "Intelligent Identification of Hazard-Based Red Zones, Carrying Capacity Assessment, and Immediate Relocation Needs for Vulnerable Habitations (SIH 2026)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0B0F19] text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
