"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/layout/sidebar_context";
import SidebarCalon from "@/components/layout/sidebar_calon";
import DashboardHeader from "@/components/layout/header";
import DashboardMain from "@/components/layout/dashboard_main";
import { ROLE_REDIRECT } from "@/app/constants/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function CalonLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const token = localStorage.getItem("access_token");
    const cached = localStorage.getItem("user");
    if (!token || !cached) {
      router.replace("/login");
      return;
    }

    const cachedUser = JSON.parse(cached);
    if (cachedUser.role !== "calon") {
      router.replace(ROLE_REDIRECT[cachedUser.role] ?? "/login");
      return;
    }
    setReady(true);

    // ✅ FIX: sama seperti AlumniLayout — revalidasi role ke GET /me biar
    // kalau admin switch role user ini (calon → alumni), gak perlu logout
    // manual dulu buat lihat perubahannya. Lihat komentar lengkap di
    // app/(alumni)/layout.tsx.
    fetch(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((freshUser) => {
        if (cancelled || !freshUser) return;
        localStorage.setItem("user", JSON.stringify(freshUser));
        if (freshUser.role !== "calon") {
          router.replace(ROLE_REDIRECT[freshUser.role] ?? "/login");
        }
      })
      .catch(() => {
        // offline-tolerant — biarkan render dari cache
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) return null;

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