"use client";

import { useState, useMemo } from "react";
import { Search, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import SidebarAdmin from "@/components/layout/sidebar_admin";
import DashboardNavbar from "@/components/layout/dashboard_navbar";

// ─── Types ───────────────────────────────────────────────────────────────────

type Perusahaan = {
  id: number;
  nama: string;
  jumlahDivisi: number;
  totalFeedback: number;
  tanggalUpdate: string;
  tanggalRaw: Date;
};

type Divisi = {
  id: number;
  namaDivisi: string;
  perusahaan: string;
  initialPerusahaan: string;
  colorClass: string;
  totalFeedback: number;
  tanggalUpdate: string;
  tanggalRaw: Date;
};

type SortKeyPerusahaan = "nama" | "jumlahDivisi" | "tanggalUpdate" | null;
type SortKeyDivisi = "namaDivisi" | "perusahaan" | "tanggalUpdate" | null;
type SortDir = "asc" | "desc";

// ─── Sample Data ──────────────────────────────────────────────────────────────

const samplePerusahaan: Perusahaan[] = [
  { id: 1, nama: "Tokopedia",                 jumlahDivisi: 4, totalFeedback: 45,  tanggalUpdate: "12 Mar 2024", tanggalRaw: new Date("2024-03-12") },
  { id: 2, nama: "PT Telekomunikasi Selular", jumlahDivisi: 6, totalFeedback: 120, tanggalUpdate: "08 Mar 2024", tanggalRaw: new Date("2024-03-08") },
  { id: 3, nama: "PT Algo Studio Nusantara",  jumlahDivisi: 2, totalFeedback: 14,  tanggalUpdate: "20 Feb 2024", tanggalRaw: new Date("2024-02-20") },
  { id: 4, nama: "Gojek",                     jumlahDivisi: 5, totalFeedback: 89,  tanggalUpdate: "15 Feb 2024", tanggalRaw: new Date("2024-02-15") },
  { id: 5, nama: "Shopee",                    jumlahDivisi: 3, totalFeedback: 56,  tanggalUpdate: "10 Feb 2024", tanggalRaw: new Date("2024-02-10") },
];

const sampleDivisi: Divisi[] = [
  { id: 1, namaDivisi: "UI/UX Design Intern",  perusahaan: "Tokopedia",                initialPerusahaan: "T", colorClass: "bg-blue-100 text-blue-600",    totalFeedback: 15, tanggalUpdate: "12 Mar 2024", tanggalRaw: new Date("2024-03-12") },
  { id: 2, namaDivisi: "Frontend Developer",   perusahaan: "Gojek",                    initialPerusahaan: "G", colorClass: "bg-green-100 text-green-600",   totalFeedback: 24, tanggalUpdate: "08 Mar 2024", tanggalRaw: new Date("2024-03-08") },
  { id: 3, namaDivisi: "Network Engineer",     perusahaan: "PT Telekomunikasi Selular", initialPerusahaan: "P", colorClass: "bg-red-100 text-red-500",       totalFeedback: 12, tanggalUpdate: "20 Feb 2024", tanggalRaw: new Date("2024-02-20") },
  { id: 4, namaDivisi: "Backend Developer",    perusahaan: "Shopee",                   initialPerusahaan: "S", colorClass: "bg-orange-100 text-orange-500", totalFeedback: 18, tanggalUpdate: "15 Feb 2024", tanggalRaw: new Date("2024-02-15") },
  { id: 5, namaDivisi: "Data Analyst Intern",  perusahaan: "Tokopedia",                initialPerusahaan: "T", colorClass: "bg-blue-100 text-blue-600",    totalFeedback: 9,  tanggalUpdate: "10 Feb 2024", tanggalRaw: new Date("2024-02-10") },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitialClass(nama: string): string {
  const map: Record<string, string> = {
    T: "bg-blue-100 text-blue-600",
    P: "bg-red-100 text-red-500",
    A: "bg-teal-100 text-teal-600",
    G: "bg-green-100 text-green-600",
    S: "bg-orange-100 text-orange-500",
  };
  return map[nama.charAt(0).toUpperCase()] ?? "bg-slate-100 text-slate-600";
}

function ApprovedBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-100">
      <span className="inline-flex w-3.5 h-3.5 rounded-full border-2 border-emerald-500 items-center justify-center">
        <svg viewBox="0 0 10 10" className="w-2 h-2" fill="none">
          <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {count} Approved
    </span>
  );
}

// ─── SortableHeader: klik toggle asc/desc, tampilkan icon sesuai state ────────

type SortableHeaderProps = {
  label: string;
  colKey: string;
  activeKey: string | null;
  dir: SortDir;
  onSort: () => void;
};

function SortableHeader({ label, colKey, activeKey, dir, onSort }: SortableHeaderProps) {
  const isActive = activeKey === colKey;
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wide">
      <button
        onClick={onSort}
        className="inline-flex items-center gap-1 hover:text-slate-800 transition-colors"
      >
        {label}
        {isActive ? (
          dir === "asc" ? (
            <ArrowUp size={12} className="text-[#3b5bdb]" />
          ) : (
            <ArrowDown size={12} className="text-[#3b5bdb]" />
          )
        ) : (
          <ArrowUpDown size={12} className="text-slate-400" />
        )}
      </button>
    </th>
  );
}

// ─── Tab: Perusahaan ─────────────────────────────────────────────────────────

function TabPerusahaan() {
  const [query, setQuery]     = useState("");
  const [sortKey, setSortKey] = useState<SortKeyPerusahaan>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(key: SortKeyPerusahaan) {
    if (sortKey === key) {
      // toggle direction jika kolom sama
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      // default direction per kolom:
      // nama → asc (A-Z), jumlahDivisi → asc (terkecil), tanggalUpdate → desc (terbaru)
      setSortDir(key === "tanggalUpdate" ? "desc" : "asc");
    }
  }

  const sorted = useMemo(() => {
    const data = samplePerusahaan.filter((p) =>
      p.nama.toLowerCase().includes(query.toLowerCase())
    );
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "nama")         cmp = a.nama.localeCompare(b.nama);
      if (sortKey === "jumlahDivisi") cmp = a.jumlahDivisi - b.jumlahDivisi;
      if (sortKey === "tanggalUpdate") cmp = a.tanggalRaw.getTime() - b.tanggalRaw.getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [query, sortKey, sortDir]);

  return (
    <div className="mt-5">
      <div className="relative mb-5 w-full max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama perusahaan..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]/20 focus:border-[#3b5bdb]"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 w-12">No</th>
              <SortableHeader
                label="Perusahaan"
                colKey="nama"
                activeKey={sortKey}
                dir={sortDir}
                onSort={() => handleSort("nama")}
              />
              <SortableHeader
                label="Jumlah Divisi"
                colKey="jumlahDivisi"
                activeKey={sortKey}
                dir={sortDir}
                onSort={() => handleSort("jumlahDivisi")}
              />
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Total Feedback (Approved)
              </th>
              <SortableHeader
                label="Tanggal Update"
                colKey="tanggalUpdate"
                activeKey={sortKey}
                dir={sortDir}
                onSort={() => handleSort("tanggalUpdate")}
              />
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((p, idx) => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-4 text-slate-500 text-xs font-medium">
                  {String(idx + 1).padStart(2, "0")}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${getInitialClass(p.nama)}`}>
                      {p.nama.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-900">{p.nama}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-700">{p.jumlahDivisi} Divisi</td>
                <td className="px-4 py-4">
                  <ApprovedBadge count={p.totalFeedback} />
                </td>
                <td className="px-4 py-4 text-slate-600">{p.tanggalUpdate}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <button className="text-slate-400 hover:text-[#3b5bdb] transition-colors">
                      <Pencil size={16} />
                    </button>
                    <button className="text-slate-400 hover:text-rose-500 transition-colors">
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
  );
}

// ─── Tab: Divisi ─────────────────────────────────────────────────────────────

function TabDivisi() {
  const [query, setQuery]     = useState("");
  const [sortKey, setSortKey] = useState<SortKeyDivisi>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(key: SortKeyDivisi) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "tanggalUpdate" ? "desc" : "asc");
    }
  }

  const sorted = useMemo(() => {
    const data = sampleDivisi.filter(
      (d) =>
        d.namaDivisi.toLowerCase().includes(query.toLowerCase()) ||
        d.perusahaan.toLowerCase().includes(query.toLowerCase())
    );
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "namaDivisi")   cmp = a.namaDivisi.localeCompare(b.namaDivisi);
      if (sortKey === "perusahaan")   cmp = a.perusahaan.localeCompare(b.perusahaan);
      if (sortKey === "tanggalUpdate") cmp = a.tanggalRaw.getTime() - b.tanggalRaw.getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [query, sortKey, sortDir]);

  return (
    <div className="mt-5">
      <div className="relative mb-5 w-full max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama divisi atau perusahaan..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]/20 focus:border-[#3b5bdb]"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 w-12">No</th>
              <SortableHeader
                label="Nama Divisi"
                colKey="namaDivisi"
                activeKey={sortKey}
                dir={sortDir}
                onSort={() => handleSort("namaDivisi")}
              />
              <SortableHeader
                label="Perusahaan"
                colKey="perusahaan"
                activeKey={sortKey}
                dir={sortDir}
                onSort={() => handleSort("perusahaan")}
              />
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                Total Feedback (Approved)
              </th>
              <SortableHeader
                label="Tanggal Update"
                colKey="tanggalUpdate"
                activeKey={sortKey}
                dir={sortDir}
                onSort={() => handleSort("tanggalUpdate")}
              />
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((d, idx) => (
              <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-4 text-slate-500 text-xs font-medium">
                  {String(idx + 1).padStart(2, "0")}
                </td>
                <td className="px-4 py-4">
                  <span className="font-semibold text-slate-900">{d.namaDivisi}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${d.colorClass}`}>
                      {d.initialPerusahaan}
                    </div>
                    <span className="text-slate-700">{d.perusahaan}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <ApprovedBadge count={d.totalFeedback} />
                </td>
                <td className="px-4 py-4 text-slate-600">{d.tanggalUpdate}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <button className="text-slate-400 hover:text-[#3b5bdb] transition-colors">
                      <Pencil size={16} />
                    </button>
                    <button className="text-slate-400 hover:text-rose-500 transition-colors">
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
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type ActiveTab = "perusahaan" | "divisi";

export default function KelolaPerusahaanPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("perusahaan");

  return (
    <div className="min-h-screen bg-[#eef0f8] font-sans">
      <SidebarAdmin />
      <DashboardNavbar pageTitle="Kelola Perusahaan" userName="Admin" userRole="admin" />

      <main className="md:ml-60 pt-16 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mx-auto w-full max-w-[1280px] py-6">
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm px-6 pt-5 pb-6">

            {/* Tabs */}
            <div className="flex gap-6 border-b border-slate-200">
              {(["perusahaan", "divisi"] as ActiveTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-[#3b5bdb] text-[#3b5bdb]"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "perusahaan" ? <TabPerusahaan /> : <TabDivisi />}
          </div>
        </div>
      </main>
    </div>
  );
}
