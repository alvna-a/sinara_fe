"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Pencil, Trash2, X } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { ApprovedBadge, SortableHeader, SkeletonRows } from "./shared";
import { PER_PAGE } from "./types";
import type { Divisi, CompanyOption, SortKeyDivisi, SortDir } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Modal Edit Divisi ────────────────────────────────────────────────────────

export function EditDivisiModal({
  divisi,
  companyOptions,
  onClose,
  onSaved,
}: {
  divisi: Divisi;
  companyOptions: CompanyOption[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nama, setNama] = useState(divisi.namaDivisi);
  const [companyId, setCompanyId] = useState(divisi.companyId);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/admin/divisions/${divisi.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nama, company_id: companyId }),
      });
      if (!res.ok) throw new Error();
      onSaved();
      onClose();
    } catch {
      setErr("Gagal menyimpan perubahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Edit Divisi</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {err && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Nama Divisi</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]/20 focus:border-[#3b5bdb]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Perusahaan</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]/20 focus:border-[#3b5bdb]"
            >
              {companyOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-400">
              Ganti ini kalau divisi ini kepasang di perusahaan yang salah.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#3b5bdb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3349b8] disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Tab Divisi ───────────────────────────────────────────────────────────────

export default function TabDivisi({
  data,
  loading,
  onEdit,
  onDelete,
}: {
  data: Divisi[];
  loading: boolean;
  onEdit: (d: Divisi) => void;
  onDelete: (id: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKeyDivisi>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  function handleSort(key: SortKeyDivisi) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "tanggalUpdate" ? "desc" : "asc");
    }
  }

  const filtered = useMemo(() => {
    const filteredItems = data.filter(
      (d) =>
        d.namaDivisi.toLowerCase().includes(query.toLowerCase()) ||
        d.perusahaan.toLowerCase().includes(query.toLowerCase()),
    );
    if (!sortKey) return filteredItems;
    return [...filteredItems].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "namaDivisi") cmp = a.namaDivisi.localeCompare(b.namaDivisi);
      if (sortKey === "perusahaan") cmp = a.perusahaan.localeCompare(b.perusahaan);
      if (sortKey === "tanggalUpdate") cmp = a.tanggalRaw.getTime() - b.tanggalRaw.getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, query, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  return (
    <div className="mt-5">
      <div className="relative mb-5 w-full max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
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
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                  {query ? "Divisi tidak ditemukan." : "Belum ada data divisi."}
                </td>
              </tr>
            ) : (
              pageData.map((d, idx) => (
                <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-4 text-slate-500 text-xs font-medium">
                    {String((page - 1) * PER_PAGE + idx + 1).padStart(2, "0")}
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
                      <button onClick={() => onEdit(d)} className="text-slate-400 hover:text-[#3b5bdb] transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => onDelete(d.id)} className="text-slate-400 hover:text-rose-500 transition-colors">
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
      {filtered.length > PER_PAGE && (
        <div className="mt-4">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
