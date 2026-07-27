"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/layout/sidebar_context";
import SidebarAlumni from "@/components/layout/sidebar_alumni";
import DashboardHeader from "@/components/layout/header";
import DashboardMain from "@/components/layout/dashboard_main";
import { ROLE_REDIRECT } from "@/app/constants/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function AlumniLayout({ children }: { children: React.ReactNode }) {
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

    // Render cepat dari cache dulu (biar gak nge-flash blank), tapi jangan
    // percaya 100% — kalau admin baru aja switch role mahasiswa ini,
    // cache di browser bisa aja udah basi.
    const cachedUser = JSON.parse(cached);
    if (cachedUser.role !== "alumni") {
      router.replace(ROLE_REDIRECT[cachedUser.role] ?? "/login");
      return;
    }
    setReady(true);

    // ✅ FIX: validasi ulang ke server. Sebelumnya guard di sini CUMA baca
    // localStorage snapshot dari saat login, jadi kalau admin update role
    // mahasiswa lewat PUT /admin/data-mahasiswa/{id}/role, user yang lagi
    // login gak bakal ke-detect sampai dia logout & login ulang. Dengan
    // fetch /me di sini, begitu dia pindah halaman (mount ulang layout ini),
    // role paling baru dari DB langsung dipakai buat redirect + localStorage
    // disinkronkan, tanpa perlu logout manual.
    fetch(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((freshUser) => {
        if (cancelled || !freshUser) return; // network hiccup — biarin, jangan paksa logout
        localStorage.setItem("user", JSON.stringify(freshUser));
        if (freshUser.role !== "alumni") {
          router.replace(ROLE_REDIRECT[freshUser.role] ?? "/login");
        }
      })
      .catch(() => {
        // offline-tolerant: kalau /me gagal (mis. lagi gak ada koneksi),
        // tetap biarkan render dari cache daripada nge-block user total.
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#F3F5FB] flex">
        <SidebarAlumni />
        <DashboardHeader role="alumni" />
        <DashboardMain>{children}</DashboardMain>
      </div>
    </SidebarProvider>
  );
}