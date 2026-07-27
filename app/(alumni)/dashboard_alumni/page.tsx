"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  LayoutDashboard,
  Star,
  UserCheck,
  MessageSquare,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { apiGet } from "@/services/api";

// ─── Types ──────────────────────────────────────────────────────────────────
interface FeedbackItem {
  id: number;
  company_name: string;
  division_name: string;
  status: "pending" | "approved" | "rejected";
  created_at: string; // sudah diformat BE, contoh: "24 Jul 2026"
}

// ─── Helper: icon + label aktivitas berdasarkan status feedback ────────────
function activityIconFor(status: FeedbackItem["status"]) {
  if (status === "approved") return { icon: <Star size={17} />, color: "text-indigo-600 bg-indigo-50" };
  if (status === "pending") return { icon: <Clock3 size={17} />, color: "text-amber-600 bg-amber-50" };
  return { icon: <UserCheck size={17} />, color: "text-gray-500 bg-gray-100" };
}

function activityLabelFor(fb: FeedbackItem) {
  if (fb.status === "approved") {
    return `Ulasan untuk ${fb.company_name} telah disetujui`;
  }
  if (fb.status === "rejected") {
    return `Ulasan untuk ${fb.company_name} ditolak admin`;
  }
  return `Mengirim ulasan untuk ${fb.company_name}`;
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function DashboardAlumniPage() {
  const { profile, loading: profileLoading } = useProfile();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoadingFeedbacks(false);
      return;
    }
    apiGet("/feedbacks/my", token)
      .then((json) => setFeedbacks(json.data ?? []))
      .catch(() => setFeedbacks([]))
      .finally(() => setLoadingFeedbacks(false));
  }, []);

  const firstName = profile.name ? profile.name.split(" ")[0] : "";
  const profileCompleteness = profile.kelengkapan_profil ?? 0;

  const perusahaanDiulas = new Set(feedbacks.map((f) => f.company_name)).size;
  const totalFeedback = feedbacks.length;

  const recentActivities = [...feedbacks]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const stats = [
    {
      id: "perusahaan",
      icon: <LayoutDashboard size={20} />,
      label: "Perusahaan Diulas",
      value: perusahaanDiulas,
      iconBg: "bg-indigo-50 text-indigo-600",
    },
    {
      id: "feedback",
      icon: <MessageSquare size={20} />,
      label: "Total Feedback Diberikan",
      value: totalFeedback,
      iconBg: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-5 py-6">
        {/* ── 1. Welcome Banner ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            {/* Kiri: greeting */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-[1.75rem] font-bold text-gray-900 leading-snug flex items-center gap-2 flex-wrap">
                Selamat Datang, {profileLoading ? "..." : firstName || "Alumni"}
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
                  {profileLoading ? "..." : `${profileCompleteness}%`}
                </span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-indigo-500 to-indigo-400 transition-all duration-700"
                  style={{ width: `${profileLoading ? 0 : profileCompleteness}%` }}
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

            {loadingFeedbacks ? (
              <ul className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <li key={i} className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 w-3/4 bg-gray-100 rounded" />
                      <div className="h-3 w-1/3 bg-gray-100 rounded" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : recentActivities.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                Belum ada aktivitas terkini. Yuk mulai bagikan pengalaman magangmu!
              </p>
            ) : (
              <ul className="space-y-4">
                {recentActivities.map((fb) => {
                  const { icon, color } = activityIconFor(fb.status);
                  return (
                    <li key={fb.id} className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${color}`}>
                        {icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 leading-snug">
                          {activityLabelFor(fb)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{fb.created_at}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Stat cards — 1/3 */}
          <div className="flex flex-col gap-5">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 flex-1"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium leading-snug">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {loadingFeedbacks ? "…" : stat.value}
                  </p>
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
      </div>
    </>
  );
}