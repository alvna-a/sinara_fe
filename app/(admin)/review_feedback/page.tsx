"use client";

import { useState, useEffect } from "react";
import { Eye, Trash2 } from "lucide-react";
import SidebarAdmin from "@/components/layout/sidebar_admin";
import DashboardNavbar from "@/components/layout/dashboard_navbar";

type StatusType = "Menunggu Verifikasi" | "Terverifikasi" | "Ditolak";

interface Company {
  id: number;
  nama: string;
  divisi: string;
  lokasi: string;
  status: StatusType;
  iconType: "building" | "edu";
}

const dummyData: Company[] = [
  {
    id: 1,
    nama: "PT Telekomunikasi Selular (Telkomsel)",
    divisi: "UI/UX",
    lokasi: "Jakarta Selatan",
    status: "Terverifikasi",
    iconType: "building",
  },
  {
    id: 2,
    nama: "PT Shopee International Indonesia",
    divisi: "E-Commerce / Technology",
    lokasi: "Jakarta Pusat",
    status: "Terverifikasi",
    iconType: "building",
  },
  {
    id: 3,
    nama: "PT Algo Studio Nusantara",
    divisi: "Software House / IT Agency",
    lokasi: "Malang, Jawa Timur",
    status: "Menunggu Verifikasi",
    iconType: "building",
  },
  {
    id: 4,
    nama: "Tokopedia (PT GoTo)",
    divisi: "E-Commerce / Tech",
    lokasi: "Jakarta Selatan",
    status: "Terverifikasi",
    iconType: "building",
  },
  {
    id: 5,
    nama: "PT Bank Central Asia Tbk (BCA)",
    divisi: "Banking / Financial Tech",
    lokasi: "Jakarta Pusat",
    status: "Terverifikasi",
    iconType: "building",
  },
  {
    id: 6,
    nama: "KodingNext Indonesia",
    divisi: "EdTech / Education",
    lokasi: "Jakarta Utara",
    status: "Menunggu Verifikasi",
    iconType: "edu",
  },
  {
    id: 7,
    nama: "PT Telekomunikasi Selular (Telkomsel)",
    divisi: "Telecommunication / Tech",
    lokasi: "Jakarta Selatan",
    status: "Ditolak",
    iconType: "building",
  },
  {
    id: 8,
    nama: "PT Shopee International Indonesia",
    divisi: "E-Commerce / Technology",
    lokasi: "Jakarta Pusat",
    status: "Ditolak",
    iconType: "building",
  },
];

type TabType = "Semua Data" | "Menunggu Verifikasi" | "Sudah Terverifikasi" | "Ditolak";

const tabs: TabType[] = ["Semua Data", "Menunggu Verifikasi", "Sudah Terverifikasi", "Ditolak"];

function CompanyIcon({ type }: { type: "building" | "edu" }) {
  if (type === "edu") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    </div>
  );
}

function StatusBadge({ status }: { status: StatusType }) {
  if (status === "Terverifikasi") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
        Terverifikasi
      </span>
    );
  }
  if (status === "Menunggu Verifikasi") {
    return (
      <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-500">
        Menunggu Verifikasi
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-500">
      Ditolak
    </span>
  );
}

export default function ReviewFeedbackPage() {
  const [userName, setUserName] = useState("Admin");
  const [activeTab, setActiveTab] = useState<TabType>("Semua Data");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sinara-user-data");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUserName(parsed?.nama || parsed?.name || "Admin");
      }
    } catch {
      // ignore
    }
  }, []);

  const menungguCount = dummyData.filter((d) => d.status === "Menunggu Verifikasi").length;

  const filteredData = dummyData.filter((item) => {
    if (activeTab === "Semua Data") return true;
    if (activeTab === "Menunggu Verifikasi") return item.status === "Menunggu Verifikasi";
    if (activeTab === "Sudah Terverifikasi") return item.status === "Terverifikasi";
    if (activeTab === "Ditolak") return item.status === "Ditolak";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#eef0f8] font-sans">
      <SidebarAdmin />
      <DashboardNavbar pageTitle="Review Feedback" userName={userName} userRole="admin" />

      <main className="md:ml-60 pt-16 px-4 sm:px-8 py-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Review Feedback</h1>
            <p className="mt-1 text-sm text-slate-500">
              Kelola data perusahaan magang yang sudah tersimpan dan pantau status verifikasi setiap
              pengajuan dengan lebih rigkas.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                      isActive
                        ? "border-slate-300 bg-white text-slate-800 shadow-sm"
                        : "border-transparent bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {tab}
                    {tab === "Menunggu Verifikasi" && (
                      <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white leading-none">
                        {menungguCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 pl-2 pr-4 text-left text-xs font-semibold text-slate-500">
                    No
                  </th>
                  <th className="pb-3 pr-4 text-left text-xs font-semibold text-slate-500">
                    Nama Perusahaan
                  </th>
                  <th className="pb-3 pr-4 text-left text-xs font-semibold text-slate-500">
                    Divisi
                  </th>
                  <th className="pb-3 pr-4 text-left text-xs font-semibold text-slate-500">
                    Lokasi
                  </th>
                  <th className="pb-3 pr-4 text-left text-xs font-semibold text-slate-500">
                    Status
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 pl-2 pr-4 text-slate-500">{index + 1}</td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <CompanyIcon type={item.iconType} />
                        <span className="font-semibold text-slate-800">{item.nama}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{item.divisi}</td>
                    <td className="py-4 pr-4 text-slate-600">{item.lokasi}</td>
                    <td className="py-4 pr-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                          title="Lihat detail"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
