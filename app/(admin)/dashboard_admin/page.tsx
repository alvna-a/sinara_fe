"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Building2, MessageSquare, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Types ────────────────────────────────────────────────────────────
interface Stats {
  feedbackBaru: number;
  feedbackDisetujui: number;
  perusahaanTerdaftar: number;
  divisiAktif: number;
}

interface ActivityItem {
  id: string;
  icon: ReactNode;
  title: string;
  time: string;
  // Dipakai buat sorting -- "time" di atas cuma versi format buat ditampilin.
  timestamp: number;
  href: string;
}

// ─── Helper: format waktu relatif ──────────────────────────────────────
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return "-";
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari yang lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Skeleton Card ──────────────────────────────────────────────────────
function SkeletonSummaryCard() {
  return (
    <div className="animate-pulse rounded-[28px] border border-slate-200 bg-slate-50 p-6">
      <div className="h-3 w-28 bg-slate-200 rounded mb-4" />
      <div className="h-8 w-16 bg-slate-200 rounded" />
    </div>
  );
}

function SkeletonActivityItem() {
  return (
    <div className="animate-pulse flex gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div className="h-12 w-12 rounded-3xl bg-slate-200 flex-shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 w-3/4 bg-slate-200 rounded" />
        <div className="h-3 w-1/3 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────
export default function DashboardAdminPage() {
  const [userName, setUserName] = useState("Admin");
  const [stats, setStats] = useState<Stats | null>(null);
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [showAllModal, setShowAllModal] = useState(false);

  // ── Baca nama admin dari localStorage ──────────────────────────
  useEffect(() => {
    function readName() {
      try {
        const raw = localStorage.getItem("sinara-user-data");
        if (raw) {
          const parsed = JSON.parse(raw);
          setUserName(parsed?.nama ?? parsed?.name ?? "Admin");
          return;
        }
        const userRaw = localStorage.getItem("user");
        if (userRaw) {
          const parsed = JSON.parse(userRaw);
          setUserName(parsed?.name ?? "Admin");
        }
      } catch {}
    }
    readName();
    window.addEventListener("sinaraProfileUpdated", readName);
    return () => window.removeEventListener("sinaraProfileUpdated", readName);
  }, []);

  // ── Tutup modal pakai tombol Escape, biar konsisten sama pola X ──
  useEffect(() => {
    if (!showAllModal) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShowAllModal(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showAllModal]);

  // ── Fetch stats ringkasan + activity log (data asli dari API, bukan dummy) ──
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    Promise.all([
      fetch(`${API_URL}/api/admin/feedbacks`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      }).then((r) => (r.ok ? r.json() : { data: [] })),
      fetch(`${API_URL}/api/admin/companies`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      }).then((r) => (r.ok ? r.json() : { data: [] })),
    ])
      .then(([feedbackJson, companiesJson]) => {
        const feedbacks: any[] = feedbackJson.data ?? [];
        const companies: any[] = companiesJson.data ?? [];

        const feedbackBaru = feedbacks.filter((f) => f.status === "pending").length;
        const feedbackDisetujui = feedbacks.filter((f) => f.status === "approved").length;
        const perusahaanCount = companies.length;
        const divisiCount = companies.reduce(
          (sum: number, c: any) => sum + (c.divisions?.length ?? 0),
          0,
        );

        setStats({
          feedbackBaru,
          feedbackDisetujui,
          perusahaanTerdaftar: perusahaanCount,
          divisiAktif: divisiCount,
        });

        // ── Bangun activity log GABUNGAN feedback + company ──────────
        // (sebelumnya either/or -- kalau ada feedback, activity company
        // diabaikan total. Sekarang digabung & di-sort beneran by waktu.)
        const iconMap: Record<string, ReactNode> = {
          approved: <CalendarDays size={18} className="text-sky-600" />,
          pending: <MessageSquare size={18} className="text-violet-600" />,
          rejected: (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-xs font-bold">
              !
            </span>
          ),
        };
        const labelMap: Record<string, string> = {
          approved: "Menyetujui ulasan feedback",
          pending: "Feedback baru masuk",
          rejected: "Menolak feedback ulasan",
        };

        const feedbackActivities: ActivityItem[] = feedbacks.map((f: any, idx: number) => {
          const rawDate = f.updated_at ?? f.created_at;
          return {
            id: `feedback-${f.id ?? idx}`,
            icon: iconMap[f.status] ?? <MessageSquare size={18} className="text-slate-400" />,
            title: `${labelMap[f.status] ?? "Aktivitas feedback"} untuk ${f.company_name ?? "perusahaan"}`,
            time: timeAgo(rawDate),
            timestamp: new Date(rawDate).getTime() || 0,
            href: "/review_feedback",
          };
        });

        const companyActivities: ActivityItem[] = companies.map((c: any, idx: number) => ({
          id: `company-${c.id ?? idx}`,
          icon: <Building2 size={18} className="text-blue-600" />,
          title: `Perusahaan ${c.name} terdaftar di sistem`,
          time: timeAgo(c.created_at),
          timestamp: new Date(c.created_at).getTime() || 0,
          href: "/kelola_perusahaan",
        }));

        const merged = [...feedbackActivities, ...companyActivities].sort(
          (a, b) => b.timestamp - a.timestamp,
        );

        setAllActivities(merged);
      })
      .catch(() => {
        setStats({ feedbackBaru: 0, feedbackDisetujui: 0, perusahaanTerdaftar: 0, divisiAktif: 0 });
        setAllActivities([]);
      })
      .finally(() => {
        setLoadingStats(false);
        setLoadingActivities(false);
      });
  }, []);

  const recentActivities = allActivities.slice(0, 5);

  const summaryCards = stats
    ? [
        { label: "Feedback baru masuk", value: String(stats.feedbackBaru), accent: "text-orange-500", bg: "bg-orange-50" },
        { label: "Feedback disetujui", value: String(stats.feedbackDisetujui), accent: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Perusahaan terdaftar", value: String(stats.perusahaanTerdaftar), accent: "text-violet-600", bg: "bg-violet-50" },
        { label: "Divisi aktif di sistem", value: String(stats.divisiAktif), accent: "text-cyan-600", bg: "bg-cyan-50" },
      ]
    : [];

  return (
    <>
      <div className="mx-auto w-full max-w-[1280px] px-0 sm:px-2 lg:px-4 pb-12">
        <div className="space-y-6">
          {/* ── Welcome Banner ──────────────────────────────────────── */}
          <div className="rounded-[32px] bg-[#f8fbff] p-6 shadow-sm shadow-slate-200/50 sm:p-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-4xl font-bold text-slate-950 leading-snug flex flex-wrap items-center gap-2">
                Selamat Datang, Admin
                <span className="text-2xl" aria-hidden="true">👋</span>
              </h1>
              <p className="mt-2 max-w-xl text-base text-slate-500">
                Review feedback tetap jadi prioritas utama karena data yang disetujui akan masuk ke data guna rekomendasi mahasiswa.
              </p>
            </div>
          </div>

          {/* ── Summary + Aktivitas ─────────────────────────────────── */}
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            {/* Summary Cards */}
            <div className="space-y-6 rounded-[32px] bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8">
              <div className="space-y-4">
                <p className="text-xl font-semibold text-slate-600">Ringkasan</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {loadingStats
                    ? [...Array(4)].map((_, i) => <SkeletonSummaryCard key={i} />)
                    : summaryCards.map(({ label, value, accent, bg }) => (
                        <div key={label} className={`rounded-[28px] border border-slate-200 ${bg} p-6`}>
                          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
                          <p className={`mt-4 text-4xl font-semibold ${accent}`}>{value}</p>
                        </div>
                      ))}
                </div>
              </div>
            </div>

            {/* Aktivitas */}
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xl font-semibold text-slate-950">Aktivitas Terkini</p>
                  <p className="mt-1 text-base text-slate-500">Update terbaru dari sistem dan tugas admin.</p>
                </div>

                {/* "Lihat Semua" sekarang buka modal popup, bukan pindah halaman */}
                <button
                  type="button"
                  onClick={() => setShowAllModal(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Lihat Semua
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {loadingActivities ? (
                  [...Array(4)].map((_, i) => <SkeletonActivityItem key={i} />)
                ) : recentActivities.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">Belum ada aktivitas terkini.</p>
                ) : (
                  recentActivities.map((item) => (
                    <ActivityItemCard key={item.id} icon={item.icon} title={item.title} time={item.time} href={item.href} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal "Lihat Semua Aktivitas" ────────────────────────────── */}
      {showAllModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setShowAllModal(false)}
        >
          <div
            className="w-full max-w-lg max-h-[80vh] rounded-[28px] bg-white shadow-xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <p className="text-lg font-semibold text-slate-950">Semua Aktivitas</p>
                <p className="text-sm text-slate-500">{allActivities.length} aktivitas tercatat</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                aria-label="Tutup"
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 space-y-3">
              {allActivities.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">Belum ada aktivitas terkini.</p>
              ) : (
                allActivities.map((item) => (
                  <ActivityItemCard key={item.id} icon={item.icon} title={item.title} time={item.time} href={item.href} compact />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Seluruh card dibungkus <Link>, klik di mana aja di baris ini langsung
// nyambung ke href-nya (feedback -> /review_feedback, company -> /kelola_perusahaan).
function ActivityItemCard({
  icon,
  title,
  time,
  href,
  compact = false,
}: {
  icon: ReactNode;
  title: string;
  time: string;
  href: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-slate-50 transition hover:bg-slate-100 hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between ${
        compact ? "p-3 sm:p-4" : "p-4 sm:p-5"
      }`}
    >
      <div className="flex items-start gap-4 sm:items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-slate-700 shadow-sm flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{time}</p>
        </div>
      </div>
      <div className="hidden sm:block">
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Baru
        </span>
      </div>
    </Link>
  );
}