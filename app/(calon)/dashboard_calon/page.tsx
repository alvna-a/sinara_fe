
"use client";
import SidebarMahasiswa2 from "@/components/layout/sidebar_calon";
import { CompanyGridCard, Company } from "@/components/recommendation/CompanyGridCard";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export default function CalonDashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/companies?page=1`)
      .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then((json) => setCompanies(json.data ?? []))
      .catch(() => setError("Gagal memuat data perusahaan."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F2FA] flex">
      <SidebarMahasiswa2 />
      <main className="flex-1 ml-60 px-8 py-8">
        {/* Header Welcome */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              Selamat Datang, <span className="text-indigo-700">Arjuna</span> <span>👋</span>
            </h2>
            <p className="text-gray-500 text-sm mb-4 max-w-xl">Masukkan skill yang kamu miliki, dan lihat divisi mana yang paling relevan untukmu. Biarkan sistem membantu menemukan posisi yang paling cocok berdasarkan skill yang kamu miliki.</p>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 font-medium">Status kelengkapan profil</span>
                <span className="text-xs text-indigo-700 font-semibold">80%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
          <div className="w-full md:w-80 bg-indigo-50 rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-indigo-100">
            <div>
              <h3 className="text-lg font-bold text-indigo-700 mb-2">Cari Rekomendasi Sekarang</h3>
              <p className="text-sm text-indigo-700 mb-4">Kami akan membantu untuk menyaring lowongan berdasarkan skill, minat divisi, dan profilmu tanpa perlu cek satu per satu.</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2 mt-auto transition">Mulai rekomendasi AI</button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-col gap-3">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Cari perusahaan..." className="w-full pl-10 pr-12 py-2.5 text-sm text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400" disabled />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition" disabled>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select className="appearance-none w-full text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8" disabled><option>Semua Lowongan</option></select>
            <select className="appearance-none w-full text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8" disabled><option>Lokasi</option></select>
            <select className="appearance-none w-full text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8" disabled><option>Durasi Magang</option></select>
            <select className="appearance-none w-full text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8" disabled><option>Rating Perusahaan</option></select>
          </div>
        </div>

        {/* Grid Card Perusahaan */}
        <div className="mb-8">
          {loading ? (
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
            <button className="w-8 h-8 rounded-full border border-gray-200 text-gray-400" disabled>{'<'}</button>
            {[1,2,3,4,5].map((n) => (
              <button key={n} className={`w-8 h-8 rounded-full border ${n===1?"bg-indigo-600 text-white border-indigo-600":"border-gray-200 text-gray-600"}`} disabled>{n}</button>
            ))}
            <button className="w-8 h-8 rounded-full border border-gray-200 text-gray-400" disabled>{'>'}</button>
          </div>
        </div>

        {/* Bantuan Section */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Butuh Bantuan ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-2">
              <h3 className="font-semibold text-gray-900">Panduan SINARA</h3>
              <p className="text-sm text-gray-500">Pelajari cara memaksimalkan fitur Rekomendasi untuk mendapatkan saran posisi dan tempat magang yang paling tepat.</p>
              <button className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg py-2 px-4 w-max transition">Baca Panduan</button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-2">
              <h3 className="font-semibold text-gray-900">FAQ & Pusat Dukungan</h3>
              <p className="text-sm text-gray-500">Punya kendala teknis atau pertanyaan umum? Temukan jawabannya di pusat bantuan kami.</p>
              <button className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg py-2 px-4 w-max transition">Baca Panduan</button>
            </div>
          </div>
        </div>

        
      </main>
    </div>
  );
}