"use client";
import SidebarCalon from "@/components/layout/sidebar_calon";
import { CompanyGridCard, Company } from "@/components/recommendation/CompanyGridCard";
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export default function CalonDashboard() {
  const { profile, loading: profileLoading } = useProfile();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FIX #13: filter dropdown disembunyikan default di mobile, dibuka lewat tombol toggle
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoadingCompanies(true);
    setError(null);
    fetch(`${API_BASE}/companies?page=1`)
      .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then((json) => setCompanies(json.data ?? []))
      .catch(() => setError("Gagal memuat data perusahaan."))
      .finally(() => setLoadingCompanies(false));
  }, []);

  const firstName = profile?.name?.split(" ")[0] ?? "";
  const kelengkapan = profile?.kelengkapan_profil ?? 0;

  return (
    <div className="min-h-screen bg-[#F0F2FA] flex">
      <SidebarCalon />
      <main className="flex-1 md:ml-60 px-4 sm:px-6 lg:px-8 pt-16 md:pt-4 sm:py-6 lg:py-8">

        {/* Header Welcome */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="flex-1 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex flex-wrap items-center gap-2">
              {profileLoading ? (
                <span className="h-7 w-48 bg-gray-200 rounded animate-pulse inline-block" />
              ) : (
                <>
                  Selamat Datang,{" "}
                  <span className="text-indigo-700">{firstName}</span>{" "}
                  <span>👋</span>
                </>
              )}
            </h2>
            <p className="text-gray-500 text-sm mb-4 max-w-xl">
              Masukkan skill yang kamu miliki, dan lihat divisi mana yang paling relevan untukmu. Biarkan sistem membantu menemukan posisi yang paling cocok berdasarkan skill yang kamu miliki.
            </p>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 font-medium">Status kelengkapan profil</span>
                {profileLoading ? (
                  <span className="h-4 w-8 bg-gray-200 rounded animate-pulse inline-block" />
                ) : (
                  <span className="text-xs text-indigo-700 font-semibold">{kelengkapan}%</span>
                )}
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${kelengkapan}%` }}
                />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 bg-indigo-50 rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-sm border border-indigo-100">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-indigo-700 mb-2">Cari Rekomendasi Sekarang</h3>
              <p className="text-sm text-indigo-700 mb-4">Kami akan membantu untuk menyaring lowongan berdasarkan skill, minat divisi, dan profilmu tanpa perlu cek satu per satu.</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2 px-4 mt-auto transition text-sm sm:text-base">
              Mulai rekomendasi AI
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4 mb-6 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <svg className="w-4 h-4 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari perusahaan..."
                className="w-full pl-9 sm:pl-10 pr-12 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
                disabled
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition" disabled>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Tombol toggle filter, cuma tampil di mobile (< sm) */}
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              aria-label={showFilters ? "Sembunyikan filter" : "Tampilkan filter"}
              className="sm:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M9 12h6M11 16h2" />
              </svg>
            </button>
          </div>

          {/* Filter dropdown: default hidden di mobile, selalu tampil di sm ke atas */}
          <div className={`${showFilters ? "grid" : "hidden"} sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3`}>
            <select className="appearance-none w-full text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8" disabled><option>Semua Lowongan</option></select>
            <select className="appearance-none w-full text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8" disabled><option>Lokasi</option></select>
            <select className="appearance-none w-full text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8" disabled><option>Durasi Magang</option></select>
            <select className="appearance-none w-full text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8" disabled><option>Rating Perusahaan</option></select>
          </div>
        </div>

        {/* Grid Card Perusahaan */}
        <div className="mb-8">
          {loadingCompanies ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-48 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
          ) : companies.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">Perusahaan tidak ditemukan.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.slice(0, 6).map((company) => (
                <CompanyGridCard key={company.id} company={company} />
              ))}
            </div>
          )}

          {/* Pagination dummy */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button className="w-8 h-8 rounded-full border border-gray-200 text-gray-400" disabled>{"<"}</button>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`w-8 h-8 rounded-full border ${n === 1 ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600"}`}
                disabled
              >
                {n}
              </button>
            ))}
            <button className="w-8 h-8 rounded-full border border-gray-200 text-gray-400" disabled>{">"}</button>
          </div>
        </div>

        {/* Bantuan Section */}
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Butuh Bantuan ?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col gap-2">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Panduan SINARA</h3>
              <p className="text-sm text-gray-500">Pelajari cara memaksimalkan fitur Rekomendasi untuk mendapatkan saran posisi dan tempat magang yang paling tepat.</p>
              <button className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg py-2 px-4 w-full sm:w-auto transition text-sm sm:text-base">Baca Panduan</button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col gap-2">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">FAQ & Pusat Dukungan</h3>
              <p className="text-sm text-gray-500">Punya kendala teknis atau pertanyaan umum? Temukan jawabannya di pusat bantuan kami.</p>
              <button className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg py-2 px-4 w-full sm:w-auto transition text-sm sm:text-base">Baca Panduan</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
