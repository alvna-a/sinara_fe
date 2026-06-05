"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { ArrowRight, CalendarDays, Building2, Users, MessageSquare } from "lucide-react";
import SidebarAdmin from "@/components/layout/sidebar_admin";
import DashboardNavbar from "@/components/layout/dashboard_navbar";

const summaryCards = [
  { label: "Feedback baru masuk", value: "12", accent: "text-orange-500", bg: "bg-orange-50" },
  { label: "Feedback disetujui", value: "48", accent: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Perusahaan terdaftar", value: "156", accent: "text-violet-600", bg: "bg-violet-50" },
  { label: "Divisi aktif di sistem", value: "342", accent: "text-cyan-600", bg: "bg-cyan-50" },
];

const activityItems = [
  {
    icon: <CalendarDays size={18} className="text-sky-600" />,
    title: "Menyetujui ulasan feedback dari alumni untuk PT GoTo Gojek Tokopedia",
    time: "2 jam yang lalu",
  },
  {
    icon: <Building2 size={18} className="text-blue-600" />,
    title: "Memverifikasi tempat magang baru untuk perusahaan Traveloka",
    time: "5 jam yang lalu",
  },
  {
    icon: <Users size={18} className="text-emerald-600" />,
    title: "Menyetujui dan mempublikasikan 12 data feedback ulasan alumni",
    time: "1 hari yang lalu",
  },
  {
    icon: <MessageSquare size={18} className="text-violet-600" />,
    title: "Memperbarui status akun mahasiswa menjadi Alumni terdaftar",
    time: "2 hari yang lalu",
  },
  {
    icon: <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">!</span>,
    title: "Menolak feedback ulasan yang tidak relevan dari sistem",
    time: "3 hari yang lalu",
  },
];

export default function DashboardAdminPage() {
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sinara-user-data");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUserName(parsed?.nama || parsed?.name || "Admin");
      }
    } catch (e) {
      // ignore
    }

    function onProfileUpdated() {
      try {
        const raw = localStorage.getItem("sinara-user-data");
        if (raw) {
          const parsed = JSON.parse(raw);
          setUserName(parsed?.nama || parsed?.name || "Admin");
        }
      } catch (e) {}
    }
    window.addEventListener("sinaraProfileUpdated", onProfileUpdated);
    return () => window.removeEventListener("sinaraProfileUpdated", onProfileUpdated);
  }, []);
  return (
    <div className="min-h-screen bg-[#F3F5FB]">
      <SidebarAdmin />
      <DashboardNavbar pageTitle="Dashboard Utama" userName={userName} userRole="admin" />

      <main className="md:ml-60 pt-16 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mx-auto w-full max-w-[1280px] px-0 sm:px-2 lg:px-4 pb-12">
          <div className="space-y-6">
            <div className="rounded-[32px] bg-[#f8fbff] p-6 shadow-sm shadow-slate-200/50 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h1 className="text-2xl sm:text-[1.75rem] font-bold text-slate-950 leading-snug flex flex-wrap items-center gap-2">
                    Selamat Datang, Admin
                    <span className="text-2xl" aria-hidden="true">👋</span>
                  </h1>
                  <p className="mt-2 max-w-xl text-sm text-slate-500">
                    Review feedback tetap jadi prioritas utama karena data yang disetujui akan masuk ke data guna rekomendasi mahasiswa.
                  </p>
                </div>
                <div className="flex items-center gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-slate-100 text-slate-700">
                    <span className="text-lg font-semibold">A</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Halo, Admin</p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">Super Admin</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="space-y-6 rounded-[32px] bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8">
                <div className="space-y-4">
                  <p className="text-base font-semibold text-slate-600">Ringkasan</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {summaryCards.map(({ label, value, accent, bg }) => (
                      <div key={label} className={`rounded-[28px] border border-slate-200 ${bg} p-6`}>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
                        <p className={`mt-4 text-4xl font-semibold ${accent}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-950">Aktivitas Terkini</p>
                    <p className="mt-1 text-sm text-slate-500">Update terbaru dari sistem dan tugas admin.</p>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                    Lihat Semua
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {activityItems.map(({ icon, title, time }) => (
                    <ActivityItem key={title} icon={icon} title={title} time={time} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ActivityItem({ icon, title, time }: { icon: ReactNode; title: string; time: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-4 sm:items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-slate-700 shadow-sm">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{time}</p>
        </div>
      </div>
      <div className="hidden sm:block">
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Baru</span>
      </div>
    </div>
  );
}
