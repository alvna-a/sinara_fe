"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Pencil, Trash2, X, GitMerge } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { ApprovedBadge, SortableHeader, SkeletonRows, CompanyPicker } from "./shared";
import { getInitialClass } from "./utils";
import { PER_PAGE } from "./types";
import type { Perusahaan, CompanyOption, SortKeyPerusahaan, SortDir } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Modal Edit Perusahaan ────────────────────────────────────────────────────

export function EditPerusahaanModal({
  perusahaan,
  companyOptions,
  onClose,
  onSaved,
  onMerge,
}: {
  perusahaan: Perusahaan;
  companyOptions: CompanyOption[];
  onClose: () => void;
  onSaved: () => void;
  onMerge: (
    duplicateId: number,
    targetId: number,
    targetName: string,
    duplicateName: string,
  ) => void;
}) {
  const [nama, setNama] = useState(perusahaan.nama);
  const [city, setCity] = useState(perusahaan.city ?? "");
  const [province, setProvince] = useState(perusahaan.province ?? "");
  const [address, setAddress] = useState(perusahaan.address ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [mergeTarget, setMergeTarget] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/admin/companies/${perusahaan.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nama, city, province, address }),
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

  function handleMergeClick() {
    if (!mergeTarget) return;
    const target = companyOptions.find((c) => c.id === mergeTarget);
    if (!target) return;
    onMerge(perusahaan.id, target.id, target.nama, perusahaan.nama);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Edit Perusahaan</h2>
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
            <label className="mb-1 block text-xs font-semibold text-slate-600">Nama Perusahaan</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]/20 focus:border-[#3b5bdb]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Kota</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]/20 focus:border-[#3b5bdb]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Provinsi</label>
            <input
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]/20 focus:border-[#3b5bdb]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Alamat</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]/20 focus:border-[#3b5bdb]"
            />
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

        {/* Manual merge -- buat nutup celah kalau deteksi otomatis di tab
            Duplikat salah pasangin atau kelewatan. */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-slate-700">Gabungkan ke Perusahaan Lain</p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
            Apabila ada kesamaan nama perusahaan, silakan lakukan penggabungan terhadap
            perusahaan tersebut. Cari dan pilih perusahaan tujuan di bawah, lalu semua
            divisi milik <span className="font-semibold text-slate-700">"{perusahaan.nama}"</span>{" "}
            (yang sedang Anda buka ini) akan dipindahkan ke perusahaan yang Anda pilih,
            lalu <span className="font-semibold text-slate-700">"{perusahaan.nama}"</span> akan
            otomatis dihapus.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <CompanyPicker
                options={companyOptions}
                value={mergeTarget}
                onChange={setMergeTarget}
                excludeId={perusahaan.id}
                placeholder="Cari perusahaan tujuan..."
              />
            </div>
            <button
              type="button"
              onClick={handleMergeClick}
              disabled={!mergeTarget}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-900 disabled:opacity-40"
            >
              <GitMerge size={13} />
              Gabungkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab Perusahaan ───────────────────────────────────────────────────────────
// NOTE: paging di-handle full client-side (bukan lewat query param ke
// backend), karena CompanyController::adminIndex() saat ini selalu balikin
// semua row sekaligus (gak ada page/per_page/meta di response).

export default function TabPerusahaan({
  data,
  loading,
  onEdit,
  onDelete,
}: {
  data: Perusahaan[];
  loading: boolean;
  onEdit: (p: Perusahaan) => void;
  onDelete: (id: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKeyPerusahaan>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  function handleSort(key: SortKeyPerusahaan) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "tanggalUpdate" ? "desc" : "asc");
    }
  }

  const sorted = useMemo(() => {
    const filtered = data.filter((p) => p.nama.toLowerCase().includes(query.toLowerCase()));
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "nama") cmp = a.nama.localeCompare(b.nama);
      if (sortKey === "jumlahDivisi") cmp = a.jumlahDivisi - b.jumlahDivisi;
      if (sortKey === "tanggalUpdate") cmp = a.tanggalRaw.getTime() - b.tanggalRaw.getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, query, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const pageData = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                  {query ? "Perusahaan tidak ditemukan." : "Belum ada data perusahaan."}
                </td>
              </tr>
            ) : (
              pageData.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-4 text-slate-500 text-xs font-medium">
                    {String((page - 1) * PER_PAGE + idx + 1).padStart(2, "0")}
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
                      <button onClick={() => onEdit(p)} className="text-slate-400 hover:text-[#3b5bdb] transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => onDelete(p.id)} className="text-slate-400 hover:text-rose-500 transition-colors">
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
      {sorted.length > PER_PAGE && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
