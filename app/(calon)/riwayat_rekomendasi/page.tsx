"use client";

import { useState } from "react";
import SidebarCalon from "@/components/layout/sidebar_calon";

// ─── Types ───────────────────────────────────────────────────────────────────

type TabType = "riwayat" | "wishlist";
type WishlistFilter = "semua" | "perusahaan" | "divisi";

interface RiwayatItem {
  id: number;
  title: string;
  date: string;
  tags: { label: string; type: "match" | "total" }[];
}

interface WishlistItem {
  id: number;
  type: "Perusahaan" | "Divisi";
  rating: number;
  name: string;
  company: string;
  location: string;
  internCount: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const riwayatData: RiwayatItem[] = [
  {
    id: 1,
    title: "Rekomendasi Magang — Profil Tech & Data",
    date: "24 Oktober 2024 • 14:30 WIB",
    tags: [
      { label: "3 Divisi Sangat Cocok", type: "match" },
      { label: "8 Total Divisi Ditemukan", type: "total" },
    ],
  },
  {
    id: 2,
    title: "Rekomendasi Magang — Profil Software Engineering",
    date: "12 Oktober 2024 • 09:15 WIB",
    tags: [
      { label: "2 Divisi Sangat Cocok", type: "match" },
      { label: "5 Total Divisi Ditemukan", type: "total" },
    ],
  },
  {
    id: 3,
    title: "Rekomendasi Magang — Eksplorasi Awal",
    date: "01 September 2024 • 19:40 WIB",
    tags: [{ label: "12 Total Divisi Ditemukan", type: "total" }],
  },
];

const wishlistData: WishlistItem[] = [
  {
    id: 1,
    type: "Perusahaan",
    rating: 4,
    name: "PT Espay Debit Indonesia Koe",
    company: "Fintech & Infrastruktur Pembayaran",
    location: "CBD Kuningan, Jakarta Selatan",
    internCount: 143,
  },
  {
    id: 2,
    type: "Divisi",
    rating: 5,
    name: "Product Management Intern",
    company: "PT Sinar Digital Terdepan",
    location: "AXA Tower, Jakarta Selatan",
    internCount: 118,
  },
  {
    id: 3,
    type: "Divisi",
    rating: 5,
    name: "Product Management Intern",
    company: "PT Sinar Digital Terdepan",
    location: "AXA Tower, Jakarta Selatan",
    internCount: 118,
  },
  {
    id: 4,
    type: "Perusahaan",
    rating: 4,
    name: "PT Espay Debit Indonesia Koe",
    company: "Fintech & Infrastruktur Pembayaran",
    location: "CBD Kuningan, Jakarta Selatan",
    internCount: 143,
  },
  {
    id: 5,
    type: "Divisi",
    rating: 5,
    name: "Product Management Intern",
    company: "PT Sinar Digital Terdepan",
    location: "AXA Tower, Jakarta Selatan",
    internCount: 118,
  },
  {
    id: 6,
    type: "Divisi",
    rating: 5,
    name: "Product Management Intern",
    company: "PT Sinar Digital Terdepan",
    location: "AXA Tower, Jakarta Selatan",
    internCount: 118,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function WishlistCard({ item }: { item: WishlistItem }) {
  const isPerusahaan = item.type === "Perusahaan";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full border ${
            isPerusahaan
              ? "border-indigo-200 text-indigo-700 bg-indigo-50"
              : "border-purple-200 text-purple-700 bg-purple-50"
          }`}
        >
          {item.type}
        </span>
        <StarRating rating={item.rating} />
      </div>

      {/* Info */}
      <div>
        <h3 className="font-bold text-gray-900 text-base leading-tight">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{item.company}</p>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{item.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{item.internCount} mahasiswa telah magang</span>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full mt-1 border border-indigo-300 text-indigo-700 font-semibold text-sm py-2 rounded-xl hover:bg-indigo-50 transition-colors duration-150">
        Lihat detail
      </button>
    </div>
  );
}

function RiwayatCard({ item }: { item: RiwayatItem }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
          </svg>
        </div>

        {/* Text */}
        <div>
          <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{item.date}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  tag.type === "match"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                {tag.type === "match" && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 align-middle" />
                )}
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button className="ml-6 flex-shrink-0 border border-gray-200 text-gray-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors duration-150 whitespace-nowrap">
        Lihat Detail Rekomendasi
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RiwayatPencarian() {
  const [activeTab, setActiveTab] = useState<TabType>("riwayat");
  const [wishlistFilter, setWishlistFilter] = useState<WishlistFilter>("semua");

  const filteredWishlist = wishlistData.filter((item) => {
    if (wishlistFilter === "semua") return true;
    if (wishlistFilter === "perusahaan") return item.type === "Perusahaan";
    if (wishlistFilter === "divisi") return item.type === "Divisi";
    return true;
  });

  const riwayatCount = riwayatData.length;
  const wishlistCount = wishlistData.length;

  return (
    <div className="flex min-h-screen bg-[#EEF0F8]">
      {/* Sidebar */}
      <SidebarCalon />

      {/* Main Content — offset by sidebar width (w-60 = 240px) */}
      <div className="flex-1 flex flex-col min-h-screen ml-60">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-900">Riwayat Rekomendasi</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Halo, Arjuna</span>
            <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border-2 border-indigo-100">
              <img
                src="https://i.pravatar.cc/40?img=12"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-8 py-7">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-7">
            <button
              onClick={() => setActiveTab("riwayat")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === "riwayat"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
              }`}
            >
              Riwayat
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === "riwayat" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {riwayatCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === "wishlist"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
              }`}
            >
              Wishlist
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === "wishlist" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {wishlistCount}
              </span>
            </button>
          </div>

          {/* ── RIWAYAT TAB ─────────────────────────────────────────────── */}
          {activeTab === "riwayat" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Riwayat Hasil Rekomendasi</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Daftar hasil rekomendasi divisi magang yang pernah di-generate oleh AI untuk profilmu.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {riwayatData.map((item) => (
                  <RiwayatCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* ── WISHLIST TAB ─────────────────────────────────────────────── */}
          {activeTab === "wishlist" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Wishlist Tersimpan</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Daftar perusahaan dan divisi magang favoritmu
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex gap-2 mb-6">
                {(["semua", "perusahaan", "divisi"] as WishlistFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setWishlistFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200 ${
                      wishlistFilter === filter
                        ? "bg-white text-indigo-700 border-2 border-indigo-500 shadow-sm"
                        : "bg-transparent text-gray-500 border border-transparent hover:text-gray-700"
                    }`}
                  >
                    {filter === "semua" ? "Semua Data" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWishlist.map((item) => (
                  <WishlistCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-400">
          © 2026 Sinara. POLINES, TA 2026.
        </footer>
      </div>
    </div>
  );
}