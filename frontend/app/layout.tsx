import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "../components/SidebarContext";
import { AuthProvider } from "../components/AuthContext";

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
    <html lang="en">
      <body className="min-h-screen bg-[#F4F6F8] text-[#101828] font-sans antialiased selection:bg-[#164E3A] selection:text-white">
        <AuthProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

