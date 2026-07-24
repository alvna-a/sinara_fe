"use client";

import { ReactNode } from "react";
import { useSidebar } from "@/components/layout/sidebar_context";
import MiniFooter from "@/components/layout/mini_footer";

export default function DashboardMain({ children }: { children: ReactNode }) {
  const { desktopOpen } = useSidebar();

  return (
    <main
      className={`flex-1 px-4 sm:px-6 lg:px-8 pt-16 flex flex-col min-h-screen transition-all duration-200 ${
        desktopOpen ? "md:ml-60" : "md:ml-0"
      }`}
    >
      {/* pb-10 dipindah ke sini (bukan di <main>), biar cuma konten yang
          dapet jarak napas bawah — MiniFooter tetap nempel pas di ujung. */}
      <div className="flex-1 pb-10">{children}</div>
      <MiniFooter />
    </main>
  );
}