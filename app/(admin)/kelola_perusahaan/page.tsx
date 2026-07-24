"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useNotification } from "@/components/ui/notification";
import { formatTanggal, getDivisiColorClass } from "@/components/kelola_perusahaan/utils";
import type {
  Perusahaan,
  Divisi,
  DuplicateCandidate,
  ActiveTab,
} from "@/components/kelola_perusahaan/types";
import TabPerusahaan, { EditPerusahaanModal } from "@/components/kelola_perusahaan/TabPerusahaan";
import TabDivisi, { EditDivisiModal } from "@/components/kelola_perusahaan/TabDivisi";
import TabDuplikat from "@/components/kelola_perusahaan/TabDuplikat";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function KelolaPerusahaanPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("perusahaan");
  const [perusahaanData, setPerusahaanData] = useState<Perusahaan[]>([]);
  const [divisiData, setDivisiData] = useState<Divisi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingPerusahaan, setEditingPerusahaan] = useState<Perusahaan | null>(null);
  const [editingDivisi, setEditingDivisi] = useState<Divisi | null>(null);

  const { notify, confirm } = useNotification();
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([]);
  const [duplicatesLoading, setDuplicatesLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      // NOTE: backend belum support pagination di endpoint ini (selalu
      // balikin semua row), jadi kita gak kirim page/per_page -- paging
      // dikerjakan di masing-masing tab secara client-side.
      const res = await fetch(`${API_URL}/api/admin/companies`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();
      const raw: any[] = json.data ?? [];

      const mappedPerusahaan: Perusahaan[] = raw.map((c) => {
        const approvedCount = (c.divisions ?? []).reduce(
          (sum: number, div: any) =>
            sum + (div.feedbacks ?? []).filter((f: any) => f.status === "approved").length,
          0,
        );
        const updateDate = new Date(c.updated_at ?? c.created_at);
        return {
          id: c.id,
          nama: c.name,
          city: c.city ?? null,
          province: c.province ?? null,
          address: c.address ?? null,
          jumlahDivisi: (c.divisions ?? []).length,
          totalFeedback: approvedCount,
          tanggalUpdate: formatTanggal(c.updated_at ?? c.created_at),
          tanggalRaw: isNaN(updateDate.getTime()) ? new Date(0) : updateDate,
        };
      });

      const mappedDivisi: Divisi[] = raw.flatMap((c) =>
        (c.divisions ?? []).map((div: any) => {
          const approvedCount = (div.feedbacks ?? []).filter((f: any) => f.status === "approved").length;
          const updateDate = new Date(div.updated_at ?? div.created_at ?? c.updated_at);
          return {
            id: div.id,
            namaDivisi: div.name,
            companyId: c.id,
            perusahaan: c.name,
            initialPerusahaan: c.name.charAt(0).toUpperCase(),
            colorClass: getDivisiColorClass(c.name),
            totalFeedback: approvedCount,
            tanggalUpdate: formatTanggal(div.updated_at ?? div.created_at ?? c.updated_at),
            tanggalRaw: isNaN(updateDate.getTime()) ? new Date(0) : updateDate,
          };
        }),
      );

      setPerusahaanData(mappedPerusahaan);
      setDivisiData(mappedDivisi);
    } catch {
      setError("Gagal memuat data. Coba refresh halaman.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDuplicates = useCallback(async () => {
    setDuplicatesLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/admin/companies/duplicates`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setDuplicates(json.data ?? []);
    } catch {
      setDuplicates([]);
    } finally {
      setDuplicatesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchDuplicates();
  }, [fetchData, fetchDuplicates]);

  const handleDeletePerusahaan = async (id: number) => {
    const confirmed = await confirm({
      title: "Hapus Perusahaan",
      description: "Hapus perusahaan ini? Semua divisi terkait juga akan dihapus.",
      confirmLabel: "Ya, hapus",
      cancelLabel: "Batal",
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/admin/companies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      notify("Perusahaan berhasil dihapus.", { variant: "success" });
      fetchData();
    } catch {
      notify("Gagal menghapus perusahaan. Coba lagi.", { variant: "error" });
    }
  };

  const handleDeleteDivisi = async (id: number) => {
    const confirmed = await confirm({
      title: "Hapus Divisi",
      description: "Hapus divisi ini? Semua feedback & data terkait divisi ini juga akan dihapus.",
      confirmLabel: "Ya, hapus",
      cancelLabel: "Batal",
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/admin/divisions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      notify("Divisi berhasil dihapus.", { variant: "success" });
      fetchData();
    } catch {
      notify("Gagal menghapus divisi. Coba lagi.", { variant: "error" });
    }
  };

  // Dipakai oleh tab Duplikat DAN oleh section "Gabungkan Perusahaan" di
  // dalam EditPerusahaanModal -- satu handler, dua pemicu.
  const handleMergeDuplicate = async (
    duplicateId: number,
    targetId: number,
    targetName: string,
    duplicateName: string,
  ) => {
    const confirmed = await confirm({
      title: "Gabungkan Perusahaan",
      description: `Gabungkan "${duplicateName}" ke "${targetName}"? Semua divisi dari "${duplicateName}" akan dipindah ke "${targetName}", lalu "${duplicateName}" akan otomatis dihapus.`,
      confirmLabel: "Gabungkan",
      cancelLabel: "Batal",
    });
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/admin/companies/merge`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ duplicate_company_id: duplicateId, target_company_id: targetId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Gagal menggabungkan.");
      notify("Perusahaan berhasil digabung.", { variant: "success" });
      fetchData();
      fetchDuplicates();
    } catch (e: any) {
      notify(e.message ?? "Gagal menggabungkan perusahaan. Coba lagi.", { variant: "error" });
    }
  };

  // dropdown company di EditDivisiModal & EditPerusahaanModal
  const companyOptions = useMemo(
    () => perusahaanData.map((p) => ({ id: p.id, nama: p.nama, city: p.city, province: p.province })),
    [perusahaanData],
  );

  return (
    <>
      {editingPerusahaan && (
        <EditPerusahaanModal
          perusahaan={editingPerusahaan}
          companyOptions={companyOptions}
          onClose={() => setEditingPerusahaan(null)}
          onSaved={fetchData}
          onMerge={handleMergeDuplicate}
        />
      )}

      {editingDivisi && (
        <EditDivisiModal
          divisi={editingDivisi}
          companyOptions={companyOptions}
          onClose={() => setEditingDivisi(null)}
          onSaved={fetchData}
        />
      )}

      <div className="mx-auto w-full max-w-[1280px] py-6">
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm px-6 pt-5 pb-6">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-6 border-b border-slate-200">
            {([
              { key: "perusahaan", label: "Perusahaan" },
              { key: "divisi", label: "Divisi" },
              { key: "duplikat", label: `Duplikat${duplicates.length ? ` (${duplicates.length})` : ""}` },
            ] as { key: ActiveTab; label: string }[]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? "border-[#3b5bdb] text-[#3b5bdb]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "perusahaan" ? (
            <TabPerusahaan
              data={perusahaanData}
              loading={loading}
              onEdit={setEditingPerusahaan}
              onDelete={handleDeletePerusahaan}
            />
          ) : activeTab === "divisi" ? (
            <TabDivisi
              data={divisiData}
              loading={loading}
              onEdit={setEditingDivisi}
              onDelete={handleDeleteDivisi}
            />
          ) : (
            <TabDuplikat candidates={duplicates} loading={duplicatesLoading} onMerge={handleMergeDuplicate} />
          )}
        </div>
      </div>
    </>
  );
}
