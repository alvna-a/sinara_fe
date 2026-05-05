"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, LayoutDashboard, Star, UserCheck, MessageSquare } from "lucide-react";
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

// ─── Ilustrasi SVG karakter ───────────────────────────────────────────────────

function IllustrationCharacter() {
  return (
    <svg
      width="130"
      height="140"
      viewBox="0 0 130 140"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Panel biru tempat bersandar */}
      <rect x="18" y="95" width="94" height="38" rx="9" fill="#4338CA" />
      <path d="M28 109h74M28 119h46" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

      {/* Tangan kiri & kanan */}
      <path d="M32 96 Q22 88 25 75" stroke="#C9956A" strokeWidth="7.5" strokeLinecap="round" fill="none" />
      <path d="M98 96 Q108 88 105 75" stroke="#C9956A" strokeWidth="7.5" strokeLinecap="round" fill="none" />

      {/* Badan jas */}
      <path d="M42 93 Q45 68 65 66 Q85 68 88 93Z" fill="#6366F1" />
      {/* Kemeja putih tengah */}
      <path d="M60 66 L65 83 L70 66" fill="white" />

      {/* Leher */}
      <rect x="60" y="57" width="10" height="11" rx="5" fill="#C9956A" />

      {/* Kepala */}
      <ellipse cx="65" cy="46" rx="19" ry="20" fill="#C9956A" />

      {/* Rambut atas */}
      <path
        d="M46 43 Q47 24 65 23 Q83 24 84 43 Q80 35 73 34 Q65 33 57 34 Q50 35 46 43Z"
        fill="#2C1810"
      />
      {/* Sisi rambut kiri */}
      <path d="M46 43 Q44 51 47 56" stroke="#2C1810" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      {/* Sisi rambut kanan */}
      <path d="M84 43 Q86 51 83 56" stroke="#2C1810" strokeWidth="5.5" strokeLinecap="round" fill="none" />

      {/* Mata */}
      <ellipse cx="57" cy="47" rx="2.5" ry="3" fill="#1E1009" />
      <ellipse cx="73" cy="47" rx="2.5" ry="3" fill="#1E1009" />
      {/* Kilap mata */}
      <circle cx="58.2" cy="45.8" r="0.9" fill="white" />
      <circle cx="74.2" cy="45.8" r="0.9" fill="white" />

      {/* Alis */}
      <path d="M54 43 Q57 41.5 60 43" stroke="#2C1810" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M70 43 Q73 41.5 76 43" stroke="#2C1810" strokeWidth="1.6" strokeLinecap="round" fill="none" />

      {/* Mulut senyum */}
      <path d="M61 55 Q65 58.5 69 55" stroke="#A0614A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardAlumniPage() {
  return (
    <div className="min-h-screen bg-[#F3F5FB]">
      <SidebarAlumni />
      <DashboardNavbar pageTitle="Dashboard Utama" userName={USER_NAME} userRole="alumni" />

      {/* Offset sidebar (w-60) dan navbar (h-16) */}
      <main className="md:ml-60 pt-16 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-5xl mx-auto space-y-5 py-6">

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

              {/* Kanan: progress */}
              <div className="sm:w-56 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">
                    Status kelengkapan profil
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
              </div>
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">

            {/* Kiri: konten */}
            <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 shrink-0">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <path d="M14 5v18M5 14h18" stroke="#6366F1" strokeWidth="2.6" strokeLinecap="round" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Bagikan Pengalaman Magangmu
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-xs">
                Bantu mahasiswa lain dengan memberikan ulasan magangmu di perusahaan sebelumnya.
              </p>

              <Link
                href="/input_feedback"
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-indigo-200"
              >
                Tambah Pengalaman Magang Sekarang
                <ArrowRight size={17} />
              </Link>
            </div>

            {/* Kanan: ilustrasi karakter — hidden di mobile */}
            <div className="hidden sm:flex items-end shrink-0">
              <IllustrationCharacter />
            </div>
          </div>

          {/* ── Footer ──────────────────────────────────────────────────────── */}
          <MiniFooter />

        </div>
      </main>
    </div>
  );
}