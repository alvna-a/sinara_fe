"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, LayoutDashboard, Star, UserCheck, MessageSquare, ChevronRight, Plus } from "lucide-react";
import SidebarAlumni from "@/components/layout/sidebar_alumni";
import DashboardNavbar from "@/components/layout/dashboard_navbar";
import MiniFooter from "@/components/layout/mini_footer";

// ─── Data dummy (ganti dengan fetch API nanti) ────────────────────────────────

const USER_NAME = "Arjuna";
const PROFILE_COMPLETENESS = 80;

const ACTIVITIES = [
  {
    id: 1,
    icon: <Star size={17} />,
    label: "Memberikan ulasan untuk PT GoTo Gojek Tokopedia",
    time: "2 jam yang lalu",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    id: 2,
    icon: <UserCheck size={17} />,
    label: "Menambahkan pengalaman magang di Traveloka",
    time: "3 hari yang lalu",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    id: 3,
    icon: <Clock3 size={17} />,
    label: "Memperbarui status kelengkapan profil",
    time: "1 minggu yang lalu",
    color: "text-gray-500 bg-gray-100",
  },
];

const STATS = [
  {
    id: "perusahaan",
    icon: <LayoutDashboard size={20} />,
    label: "Perusahaan Diulas",
    value: 1,
    iconBg: "bg-indigo-50 text-indigo-600",
  },
  {
    id: "feedback",
    icon: <MessageSquare size={20} />,
    label: "Total Feedback Diberikan",
    value: 1,
    iconBg: "bg-indigo-50 text-indigo-600",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardAlumniPage() {
  return (
    <div className="min-h-screen bg-[#F3F5FB]">
      <SidebarAlumni />
      <DashboardNavbar pageTitle="Dashboard Utama" userName={USER_NAME} userRole="alumni" />

      {/* Offset sidebar (w-60) dan navbar (h-16) */}
      <main className="md:ml-60 pt-16 px-4 sm:px-6 lg:px-10 pb-10">
        <div className="max-w-6xl mx-auto space-y-5 py-6">

          {/* ── 1. Welcome Banner ─────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              {/* Kiri: greeting */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-[1.75rem] font-bold text-gray-900 leading-snug flex items-center gap-2 flex-wrap">
                  Selamat Datang, {USER_NAME}
                  <span className="text-2xl" aria-hidden="true">👋</span>
                </h1>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-sm">
                  Pantau perkembangan profilmu dan bagikan pengalaman selama kamu magang.
                </p>
              </div>

              {/* Kanan: progress — klik untuk ke halaman Profil */}
              <Link
                href="/profil_alumni"
                className="sm:w-56 shrink-0 group rounded-xl -m-2 p-2 transition-colors hover:bg-indigo-50/60 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 group-hover:text-indigo-600 transition-colors inline-flex items-center gap-1">
                    Status kelengkapan profil
                    <ChevronRight
                      size={13}
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </span>
                  <span className="text-xs font-bold text-indigo-600">
                    {PROFILE_COMPLETENESS}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-indigo-500 to-indigo-400 transition-all duration-700"
                    style={{ width: `${PROFILE_COMPLETENESS}%` }}
                  />
                </div>
              </Link>
            </div>
          </div>

          {/* ── 2. Aktivitas + Stat cards ─────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Aktivitas — 2/3 */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <BookOpen size={17} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Aktivitas Terbaru</p>
                  <p className="text-xs text-gray-400">Pembaruan aktivitas akun dan feedback.</p>
                </div>
              </div>

              <ul className="space-y-4">
                {ACTIVITIES.map((act) => (
                  <li key={act.id} className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${act.color}`}
                    >
                      {act.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 leading-snug">
                        {act.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stat cards — 1/3 */}
            <div className="flex flex-col gap-5">
              {STATS.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 flex-1"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg}`}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium leading-snug">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 3. CTA Banner ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-10">
            <div className="grid gap-8 items-center lg:grid-cols-[1.3fr_1fr]">

              {/* Kiri: konten */}
              <div className="flex flex-col items-center text-center md:items-start md:text-left gap-5">
                <div className="max-w-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
                    Bagikan pengalaman magang
                  </p>
                  <h2 className="mt-3 text-3xl sm:text-[2.5rem] font-bold tracking-[-0.03em] text-gray-900 leading-tight">
                    Bagikan 
                     <br />
                    <span className="text-indigo-600">Pengalaman Magangmu</span>
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-gray-500 leading-7">
                    Bantu mahasiswa lain memilih magang yang tepat dengan ulasan tentang perusahaan, tugas, dan lingkungan kerja.
                  </p>
                </div>

                <Link
                  href="/input_feedback"
                  className="inline-flex items-center justify-center gap-4 rounded-full bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-2xl shadow-indigo-200/30 transition duration-200 hover:bg-indigo-700 active:scale-[0.98]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white">
                    <Plus size={18} />
                  </span>
                  <span>Tambah Pengalaman Magang</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white">
                    <ArrowRight size={18} />
                  </span>
                </Link>
              </div>

              {/* Kanan: ilustrasi — hidden di mobile */}
              <div className="hidden sm:flex justify-end">
                <div className="w-full max-w-[440px]">
                  <img
                    src="/alumni/card.png"
                    alt="Ilustrasi bagikan pengalaman magang"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer ──────────────────────────────────────────────────────── */}
          <MiniFooter />

        </div>
      </main>
    </div>
  );
}
