"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import SidebarAdmin from "@/components/layout/sidebar_admin";
import DashboardNavbar from "@/components/layout/dashboard_navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitialClass(nama: string): string {
  const map: Record<string, string> = {
    T: "bg-blue-100 text-blue-600",
    P: "bg-red-100 text-red-500",
    A: "bg-teal-100 text-teal-600",
    G: "bg-green-100 text-green-600",
    S: "bg-orange-100 text-orange-500",
    B: "bg-purple-100 text-purple-600",
    M: "bg-pink-100 text-pink-600",
    D: "bg-yellow-100 text-yellow-600",
  };
  return map[nama.charAt(0).toUpperCase()] ?? "bg-slate-100 text-slate-600";
}

function formatTanggal(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
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

// ─── SortableHeader ───────────────────────────────────────────────────────────

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

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-slate-100">
          {[...Array(cols)].map((__, j) => (
            <td key={j} className="px-4 py-4">
              <div className="h-4 bg-slate-100 rounded w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Tab: Perusahaan ─────────────────────────────────────────────────────────

function TabPerusahaan({
  data,
  loading,
  onDelete,
}: {
  data: Perusahaan[];
  loading: boolean;
  onDelete: (id: number) => void;
}) {
  const [query, setQuery]     = useState("");
  const [sortKey, setSortKey] = useState<SortKeyPerusahaan>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(key: SortKeyPerusahaan) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "tanggalUpdate" ? "desc" : "asc");
    }
  }

  const sorted = useMemo(() => {
    const filtered = data.filter((p) =>
      p.nama.toLowerCase().includes(query.toLowerCase())
    );
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "nama")          cmp = a.nama.localeCompare(b.nama);
      if (sortKey === "jumlahDivisi")  cmp = a.jumlahDivisi - b.jumlahDivisi;
      if (sortKey === "tanggalUpdate") cmp = a.tanggalRaw.getTime() - b.tanggalRaw.getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, query, sortKey, sortDir]);

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
              <SortableHeader label="Perusahaan" colKey="nama" activeKey={sortKey} dir={sortDir} onSort={() => handleSort("nama")} />
              <SortableHeader label="Jumlah Divisi" colKey="jumlahDivisi" activeKey={sortKey} dir={sortDir} onSort={() => handleSort("jumlahDivisi")} />
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Total Feedback (Approved)</th>
              <SortableHeader label="Tanggal Update" colKey="tanggalUpdate" activeKey={sortKey} dir={sortDir} onSort={() => handleSort("tanggalUpdate")} />
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <SkeletonRows cols={6} />
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                  {query ? "Perusahaan tidak ditemukan." : "Belum ada data perusahaan."}
                </td>
              </tr>
            ) : (
              sorted.map((p, idx) => (
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
                      <button
                        onClick={() => onDelete(p.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Divisi ─────────────────────────────────────────────────────────────

function TabDivisi({
  data,
  loading,
}: {
  data: Divisi[];
  loading: boolean;
}) {
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
    const filtered = data.filter(
      (d) =>
        d.namaDivisi.toLowerCase().includes(query.toLowerCase()) ||
        d.perusahaan.toLowerCase().includes(query.toLowerCase())
    );
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "namaDivisi")    cmp = a.namaDivisi.localeCompare(b.namaDivisi);
      if (sortKey === "perusahaan")    cmp = a.perusahaan.localeCompare(b.perusahaan);
      if (sortKey === "tanggalUpdate") cmp = a.tanggalRaw.getTime() - b.tanggalRaw.getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, query, sortKey, sortDir]);

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
              <SortableHeader label="Nama Divisi" colKey="namaDivisi" activeKey={sortKey} dir={sortDir} onSort={() => handleSort("namaDivisi")} />
              <SortableHeader label="Perusahaan" colKey="perusahaan" activeKey={sortKey} dir={sortDir} onSort={() => handleSort("perusahaan")} />
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Total Feedback (Approved)</th>
              <SortableHeader label="Tanggal Update" colKey="tanggalUpdate" activeKey={sortKey} dir={sortDir} onSort={() => handleSort("tanggalUpdate")} />
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <SkeletonRows cols={6} />
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                  {query ? "Divisi tidak ditemukan." : "Belum ada data divisi."}
                </td>
              </tr>
            ) : (
              sorted.map((d, idx) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type ActiveTab = "perusahaan" | "divisi";

// mapping warna initial berdasarkan huruf pertama nama perusahaan
function getDivisiColorClass(namaPerusahaan: string): string {
  const map: Record<string, string> = {
    T: "bg-blue-100 text-blue-600",
    P: "bg-red-100 text-red-500",
    A: "bg-teal-100 text-teal-600",
    G: "bg-green-100 text-green-600",
    S: "bg-orange-100 text-orange-500",
    B: "bg-purple-100 text-purple-600",
    M: "bg-pink-100 text-pink-600",
    D: "bg-yellow-100 text-yellow-600",
  };
  return map[namaPerusahaan.charAt(0).toUpperCase()] ?? "bg-slate-100 text-slate-600";
}

export default function KelolaPerusahaanPage() {
  const [activeTab, setActiveTab]         = useState<ActiveTab>("perusahaan");
  const [perusahaanData, setPerusahaanData] = useState<Perusahaan[]>([]);
  const [divisiData, setDivisiData]         = useState<Divisi[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/admin/companies`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();
      const raw: any[] = json.data ?? [];

      // ── Map ke format Perusahaan ──────────────────────────────────────────
      const mappedPerusahaan: Perusahaan[] = raw.map((c) => {
        const approvedCount = (c.divisions ?? []).reduce(
          (sum: number, div: any) =>
            sum + (div.feedbacks ?? []).filter((f: any) => f.status === "approved").length,
          0
        );
        const updateDate = new Date(c.updated_at ?? c.created_at);
        return {
          id: c.id,
          nama: c.name,
          jumlahDivisi: (c.divisions ?? []).length,
          totalFeedback: approvedCount,
          tanggalUpdate: formatTanggal(c.updated_at ?? c.created_at),
          tanggalRaw: isNaN(updateDate.getTime()) ? new Date(0) : updateDate,
        };
      });

      // ── Map ke format Divisi (flatten semua divisions) ────────────────────
      const mappedDivisi: Divisi[] = raw.flatMap((c) =>
        (c.divisions ?? []).map((div: any) => {
          const approvedCount = (div.feedbacks ?? []).filter(
            (f: any) => f.status === "approved"
          ).length;
          const updateDate = new Date(div.updated_at ?? div.created_at ?? c.updated_at);
          return {
            id: div.id,
            namaDivisi: div.name,
            perusahaan: c.name,
            initialPerusahaan: c.name.charAt(0).toUpperCase(),
            colorClass: getDivisiColorClass(c.name),
            totalFeedback: approvedCount,
            tanggalUpdate: formatTanggal(div.updated_at ?? div.created_at ?? c.updated_at),
            tanggalRaw: isNaN(updateDate.getTime()) ? new Date(0) : updateDate,
          };
        })
      );

      setPerusahaanData(mappedPerusahaan);
      setDivisiData(mappedDivisi);
    } catch (err) {
      setError("Gagal memuat data. Coba refresh halaman.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeletePerusahaan = async (id: number) => {
    if (!confirm("Hapus perusahaan ini? Semua divisi terkait juga akan dihapus.")) return;
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/admin/companies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      fetchData(); // refresh setelah hapus
    } catch {
      alert("Gagal menghapus perusahaan. Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#eef0f8] font-sans">
      <SidebarAdmin />
      <DashboardNavbar pageTitle="Kelola Perusahaan" userName="Admin" userRole="admin" />

      <main className="md:ml-60 pt-16 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mx-auto w-full max-w-[1280px] py-6">
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm px-6 pt-5 pb-6">

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

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
            {activeTab === "perusahaan" ? (
              <TabPerusahaan
                data={perusahaanData}
                loading={loading}
                onDelete={handleDeletePerusahaan}
              />
            ) : (
              <TabDivisi data={divisiData} loading={loading} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}