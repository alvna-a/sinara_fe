"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CompanyGridCard, Company } from "@/components/recommendation/CompanyGridCard";
import { useProfile } from "@/hooks/useProfile";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const LOWONGAN_OPTIONS = ["Semua Lowongan", "Product", "Engineering", "Data", "Design", "Marketing", "Finance"];
const LOKASI_OPTIONS   = ["Lokasi", "Jakarta Selatan", "Jakarta Barat", "Jakarta Pusat", "Bandung", "Semarang"];
const DURASI_OPTIONS   = ["Durasi Magang", "1 Bulan", "2 Bulan", "3 Bulan", "4 Bulan", "6 Bulan"];
const RATING_OPTIONS   = ["Rating Perusahaan", "5 Bintang", "4+ Bintang", "3+ Bintang"];

function FilterSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
      >
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <svg className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

export default function CalonDashboard() {
  const router = useRouter();
  const { profile, loading: profileLoading } = useProfile();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [lowongan, setLowongan] = useState("Semua Lowongan");
  const [lokasi, setLokasi] = useState("Lokasi");
  const [durasi, setDurasi] = useState("Durasi Magang");
  const [rating, setRating] = useState("Rating Perusahaan");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  function fetchCompanies() {
    setLoadingCompanies(true);
    setError(null);

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("per_page", "30");
    if (query)                         params.set("search", query);
    if (lokasi !== "Lokasi")           params.set("kota", lokasi);
    if (lowongan !== "Semua Lowongan") params.set("divisi", lowongan);
    if (durasi !== "Durasi Magang")    params.set("durasi", durasi);
    if (rating === "5 Bintang")        params.set("min_rating", "5");
    if (rating === "4+ Bintang")       params.set("min_rating", "4");
    if (rating === "3+ Bintang")       params.set("min_rating", "3");

    fetch(`${API_BASE}/companies?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((json) => {
        setCompanies(json.data ?? []);
        setMeta({
          current_page: json.meta?.current_page ?? json.current_page ?? page,
          last_page:
            json.meta?.last_page ??
            json.last_page ??
            (json.total ? Math.max(1, Math.ceil(json.total / 30)) : 1),
          total: json.meta?.total ?? json.total ?? (json.data?.length ?? 0),
        });
      })
      .catch(() => setError("Gagal memuat data perusahaan."))
      .finally(() => setLoadingCompanies(false));
  }

  useEffect(() => {
    fetchCompanies();
  }, [lowongan, lokasi, durasi, rating, page]);

  useEffect(() => {
    // Reset to first page when filters change
    setPage(1);
  }, [lowongan, lokasi, durasi, rating]);

  function handleSearchSubmit() {
    setPage(1);
  }

  const firstName = profile?.name?.split(" ")[0] ?? "";
  const kelengkapan = profile?.kelengkapan_profil ?? 0;

  return (
    <>
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

          <div
            onClick={() => router.push("/profil_calon")}
            className="cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 font-medium group-hover:text-indigo-600 transition-colors">
                Status kelengkapan profil
              </span>
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
          <button
            onClick={() => router.push("/cari_rekomendasi")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2 px-4 mt-auto transition text-sm sm:text-base"
          >
            Mulai rekomendasi AI
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4 mb-6">
        <div className="relative mb-3">
          <svg className="w-4 h-4 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit();
            }}
            placeholder="Cari perusahaan..."
            className="w-full pl-9 sm:pl-10 pr-12 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
          />
          <button
            onClick={handleSearchSubmit}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FilterSelect options={LOWONGAN_OPTIONS} value={lowongan} onChange={setLowongan} />
          <FilterSelect options={LOKASI_OPTIONS}   value={lokasi}   onChange={setLokasi} />
          <FilterSelect options={DURASI_OPTIONS}   value={durasi}   onChange={setDurasi} />
          <FilterSelect options={RATING_OPTIONS}   value={rating}   onChange={setRating} />
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

        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="w-8 h-8 rounded-full border border-gray-200 text-gray-600 disabled:opacity-50"
          >
            {"<"}
          </button>

          {(() => {
            const pages: number[] = [];
            const start = Math.max(1, page - 2);
            const end = Math.min(meta.last_page, page + 2);
            for (let n = start; n <= end; n++) pages.push(n);
            return pages.map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-full border ${n === page ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600"}`}
              >
                {n}
              </button>
            ));
          })()}

          <button
            onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
            disabled={page >= meta.last_page}
            className="w-8 h-8 rounded-full border border-gray-200 text-gray-600 disabled:opacity-50"
          >
            {">"}
          </button>
        </div>
      </div>

      {/* Bantuan Section */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Butuh Bantuan ?</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col gap-2">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Panduan SINARA</h3>
            <p className="text-sm text-gray-500">Pelajari cara memaksimalkan fitur Rekomendasi untuk mendapatkan saran posisi dan tempat magang yang paling tepat.</p>
            <button
              onClick={() => router.push("/panduan")}
              className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg py-2 px-4 w-full sm:w-auto transition text-sm sm:text-base"
            >
              Baca Panduan
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col gap-2">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">FAQ & Pusat Dukungan</h3>
            <p className="text-sm text-gray-500">Punya kendala teknis atau pertanyaan umum? Temukan jawabannya di pusat bantuan kami.</p>
            <button
              onClick={() => router.push("/faqs")}
              className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg py-2 px-4 w-full sm:w-auto transition text-sm sm:text-base"
            >
              Baca FAQ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}