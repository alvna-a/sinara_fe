"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/layout/sidebar_context";
import SidebarAdmin from "@/components/layout/sidebar_admin";
import DashboardHeader from "@/components/layout/header";
import DashboardMain from "@/components/layout/dashboard_main";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) { router.replace("/login"); return; }
    const parsed = JSON.parse(user);
    if (parsed.role !== "admin") router.replace("/dashboard_calon");
  }, [router]);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#F3F5FB] flex">
        <SidebarAdmin />
        <DashboardHeader role="admin" />
        <DashboardMain>{children}</DashboardMain>
      </div>
    </SidebarProvider>
  );
}