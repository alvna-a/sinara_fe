"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Division {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
  full_name: string;
  logo_url: string | null;
  industri: string;
  kota: string;
  total_mahasiswa: number;
  avg_rating: number;
  divisions: Division[];
}

interface ApiMeta {
  current_page: number;
  last_page: number;
  total: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const LOWONGAN_OPTIONS = ["Semua Lowongan", "Product", "Engineering", "Data", "Design", "Marketing", "Finance"];
const LOKASI_OPTIONS   = ["Lokasi", "Jakarta Selatan", "Jakarta Barat", "Jakarta Pusat", "Bandung", "Semarang"];
const DURASI_OPTIONS   = ["Durasi Magang", "1 Bulan", "2 Bulan", "3 Bulan", "4 Bulan", "6 Bulan"];
const RATING_OPTIONS   = ["Rating Perusahaan", "5 Bintang", "4+ Bintang", "3+ Bintang"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-4 h-4 ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function FilterSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer">
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <svg className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

function CompanyLogo({ company, size = "md" }: { company: Company; size?: "md" | "lg" }) {
  const dim = size === "lg" ? "w-20 h-20 text-base" : "w-14 h-14 text-sm";
  if (company.logo_url) {
    return <img src={company.logo_url} alt={company.name} className={`${dim} rounded-xl object-contain bg-gray-50 border border-gray-100 flex-shrink-0`} />;
  }
  return (
    <div className={`${dim} rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0`}>
      {company.name.slice(0, 5)}
    </div>
  );
}

function GridCard({ company }: { company: Company }) {
  return (
    <Link href={`/perusahaan/${company.id}`}>
      <div className="bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-3 h-full cursor-pointer">
        <div className="flex items-start justify-between">
          <CompanyLogo company={company} />
          <StarRating rating={company.avg_rating} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm leading-tight">{company.full_name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{company.industri}</p>
        </div>
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
            {company.kota}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {company.total_mahasiswa} mahasiswa telah magang
          </span>
        </div>
        <div className="mt-auto pt-3 border-t border-gray-100">
          <span className="text-xs font-semibold text-indigo-600 w-full text-center block py-1.5 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition">
            Lihat detail
          </span>
        </div>
      </div>
    </Link>
  );
}

function ListCard({ company }: { company: Company }) {
  return (
    <Link href={`/perusahaan/${company.id}`}>
      <div className="bg-white rounded-2xl border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200 p-5 flex items-center gap-5 cursor-pointer">
        <CompanyLogo company={company} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm">{company.full_name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{company.industri}</p>
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              {company.kota}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {company.total_mahasiswa} mahasiswa telah magang
            </span>
            <StarRating rating={company.avg_rating} />
          </div>
        </div>
        <span className="text-sm font-semibold text-indigo-600 hover:underline flex-shrink-0">Lihat lebih</span>
      </div>
    </Link>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-48 animate-pulse">
          <div className="flex gap-3 mb-3">
            <div className="w-14 h-14 bg-gray-100 rounded-xl" />
            <div className="flex-1"><div className="h-3 bg-gray-100 rounded mb-2 w-3/4" /><div className="h-3 bg-gray-100 rounded w-1/2" /></div>
          </div>
          <div className="h-3 bg-gray-100 rounded mb-2 w-full" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PerusahaanPage() {
  const [search, setSearch]     = useState("");
  const [lowongan, setLowongan] = useState("Semua Lowongan");
  const [lokasi, setLokasi]     = useState("Lokasi");
  const [durasi, setDurasi]     = useState("Durasi Magang");
  const [rating, setRating]     = useState("Rating Perusahaan");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage]         = useState(1);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [meta, setMeta]           = useState<ApiMeta>({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => { setPage(1); }, [search, lowongan, lokasi, durasi, rating]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ page: String(page) });
    if (search)                        params.set("search", search);
    if (lokasi !== "Lokasi")           params.set("kota", lokasi);
    if (lowongan !== "Semua Lowongan") params.set("divisi", lowongan);
    if (durasi !== "Durasi Magang")    params.set("durasi", durasi);
    if (rating === "5 Bintang")        params.set("min_rating", "5");
    if (rating === "4+ Bintang")       params.set("min_rating", "4");
    if (rating === "3+ Bintang")       params.set("min_rating", "3");

    fetch(`${API_BASE}/companies?${params}`, { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then((json) => {
        setCompanies(json.data ?? []);
        setMeta(json.meta ?? { current_page: 1, last_page: 1, total: 0 });
      })
      .catch((err) => { if (err.name !== "AbortError") setError("Gagal memuat data. Coba lagi."); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [search, lowongan, lokasi, durasi, rating, page]);

  return (
    <div className="min-h-screen bg-[#F0F2FA]">
      <div className="bg-[#E8EAF6] px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">Perusahaan</h1>
          <p className="text-gray-500 text-sm max-w-lg leading-relaxed">
            Temukan perusahaan yang dapat menjadi tujuan magang. Halaman ini menampilkan informasi
            alamat, rating, jumlah mahasiswa yang pernah magang, dan lihat detail perusahaan yang menarik untukmu.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-8">
        {/* Filter box */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="relative mb-3">
            <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Cari perusahaan..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400" />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition">
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

        {/* Toggle & count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">{loading ? "Memuat..." : `${meta.total} perusahaan ditemukan`}</p>
          <div className="flex gap-2">
            <button onClick={() => setViewMode("list")} className={`w-9 h-9 rounded-full flex items-center justify-center transition ${viewMode === "list" ? "bg-indigo-600 text-white" : "bg-white text-gray-400 border border-gray-200"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <button onClick={() => setViewMode("grid")} className={`w-9 h-9 rounded-full flex items-center justify-center transition ${viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-white text-gray-400 border border-gray-200"}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z" /></svg>
            </button>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

        {loading ? <SkeletonGrid /> : companies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">Perusahaan tidak ditemukan.</p>
            <button onClick={() => { setSearch(""); setLowongan("Semua Lowongan"); setLokasi("Lokasi"); setDurasi("Durasi Magang"); setRating("Rating Perusahaan"); }}
              className="mt-3 text-indigo-600 text-sm hover:underline">Reset filter</button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((c) => <GridCard key={c.id} company={c} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {companies.map((c) => <ListCard key={c.id} company={c} />)}
          </div>
        )}

        {/* Pagination */}
        {!loading && meta.last_page > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed">← Sebelumnya</button>
            <span className="text-sm text-gray-500">Halaman {meta.current_page} dari {meta.last_page}</span>
            <button onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page}
              className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed">Selanjutnya →</button>
          </div>
        )}
      </div>
    </div>
  );
}