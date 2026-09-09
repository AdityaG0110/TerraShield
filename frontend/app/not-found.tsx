import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F8] p-4 text-center">
      <h2 className="text-2xl font-bold text-[#101828]">Page Not Found</h2>
      <p className="text-sm text-[#667085] mt-2">Could not find requested habitation or resource.</p>
      <Link
        href="/dashboard"
        className="mt-4 rounded-xl bg-[#164E3A] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#123F2F]"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
