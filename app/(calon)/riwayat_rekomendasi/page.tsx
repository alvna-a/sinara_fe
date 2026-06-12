"use client";
// ─── app/(calon)/riwayat_rekomendasi/page.tsx
// Menampilkan hasil rekomendasi terakhir milik user dari GET /api/recommendations/my
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SidebarCalon from "@/components/layout/sidebar_calon";
import DashboardNavbar from "@/components/layout/dashboard_navbar";
import MiniFooter from "@/components/layout/mini_footer";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Division {
  id: number;
  name: string;
  company: {
    id: number;
    name: string;
    city?: string;
    province?: string;
  };
}

interface RecommendationItem {
  id: number;
  user_id: number;
  division_id: number;
  similarity_score: number;   // 0.0 – 1.0, hasil cosine similarity
  suitability_avg: number;    // rata-rata rating alumni (1–5)
  experience_summary: string | null;
  matched_skills: string[] | null;
  division: Division;
  created_at: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/** Konversi skor 0–1 ke label + warna */
function matchLabel(score: number): { label: string; color: string } {
  if (score >= 0.75) return { label: "Sangat Cocok", color: "emerald" };
  if (score >= 0.5) return { label: "Cocok", color: "indigo" };
  if (score >= 0.3) return { label: "Cukup Cocok", color: "amber" };
  return { label: "Kurang Cocok", color: "gray" };
}

/** Format skor 0–1 ke persentase */
function pct(score: number) {
  return `${Math.round(score * 100)}%`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const { label, color } = matchLabel(score);
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colorMap[color]}`}
    >
      {label}
    </span>
  );
}

function RecommendationCard({
  item,
  rank,
}: {
  item: RecommendationItem;
  rank: number;
}) {
  const location = [item.division.company.city, item.division.company.province]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Rank badge */}
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
            #{rank}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
              {item.division.name}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5 truncate">
              {item.division.company.name}
            </p>
          </div>
        </div>
        <ScoreBadge score={item.similarity_score} />
      </div>

      {/* Score bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500">Skor Kemiripan</span>
          <span className="text-xs font-bold text-indigo-600">
            {pct(item.similarity_score)}
          </span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-700"
            style={{ width: pct(item.similarity_score) }}
          />
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500">
        {/* Rating alumni */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={item.suitability_avg} />
          <span className="text-xs text-gray-400">
            ({item.suitability_avg.toFixed(1)} / 5 dari alumni)
          </span>
        </div>
        {/* Lokasi */}
        {location && (
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{location}</span>
          </div>
        )}
      </div>

      {/* Matched skills */}
      {item.matched_skills && item.matched_skills.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">
            Skill yang cocok:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {item.matched_skills.map((skill) => (
              <span
                key={skill}
                className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience summary */}
      {item.experience_summary && (
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-1">
            Ringkasan pengalaman alumni:
          </p>
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
            {item.experience_summary}
          </p>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onCari }: { onCari: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">
        Belum Ada Rekomendasi
      </h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
        Kamu belum pernah melakukan pencarian rekomendasi. Mulai sekarang dan
        temukan tempat magang yang paling sesuai dengan skillmu!
      </p>
      <button
        onClick={onCari}
        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200"
      >
        Cari Rekomendasi Sekarang
      </button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function RiwayatRekomendasiPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/recommendations/my`, {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message ?? `Error ${res.status}`);
        }

        const json = await res.json();
        // BE return: { message: "...", data: [...] }
        setRecommendations(json.data ?? []);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Gagal memuat rekomendasi."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // ── Render helpers ─────────────────────────────────────────────────────────
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full w-full mb-4" />
              <div className="flex gap-2">
                <div className="h-6 bg-gray-100 rounded-full w-16" />
                <div className="h-6 bg-gray-100 rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-sm font-semibold text-red-700 mb-1">
            Gagal memuat data
          </p>
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-sm font-semibold text-red-600 border border-red-300 rounded-xl hover:bg-red-100 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    if (recommendations.length === 0) {
      return <EmptyState onCari={() => router.push("/cari_rekomendasi")} />;
    }

    return (
      <div className="flex flex-col gap-4">
        {recommendations.map((item, idx) => (
          <RecommendationCard key={item.id} item={item} rank={idx + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      <SidebarCalon />
      <DashboardNavbar
        pageTitle="Riwayat Rekomendasi"
        userName=""
        userRole="calon"
      />
      <main className="md:ml-60 pt-16 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-3xl mx-auto space-y-5 py-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Hasil Rekomendasi Magang
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {isLoading
                  ? "Memuat..."
                  : recommendations.length > 0
                  ? `${recommendations.length} rekomendasi ditemukan, diurutkan berdasarkan kemiripan tertinggi`
                  : "Belum ada rekomendasi"}
              </p>
            </div>
            <button
              onClick={() => router.push("/cari_rekomendasi")}
              className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200"
            >
              + Cari Baru
            </button>
          </div>

          {/* Content */}
          {renderContent()}

          <MiniFooter />
        </div>
      </main>
    </div>
  );
}