"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/layout/sidebar_context";
import SidebarCalon from "@/components/layout/sidebar_calon";
import DashboardHeader from "@/components/layout/header";
import DashboardMain from "@/components/layout/dashboard_main";

export default function CalonLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) { router.replace("/login"); return; }
    const parsed = JSON.parse(user);
    if (parsed.role !== "calon") router.replace("/dashboard_alumni");
  }, [router]);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#F3F5FB] flex">
        <SidebarCalon />
        <DashboardHeader role="calon" />
        <DashboardMain>{children}</DashboardMain>
      </div>
    </SidebarProvider>
  );
}