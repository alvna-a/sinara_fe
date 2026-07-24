"use client";

import { useEffect, useMemo, useState } from "react";
import { GitMerge, Eye, ArrowUp, ArrowDown, X } from "lucide-react";
import type { DuplicateCandidate, SortDir } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Modal Detail Perusahaan (dipakai tombol "Lihat") ─────────────────────────

type DivisionDetail = {
  id: number;
  name: string;
  description?: string;
};

type CompanyDetail = {
  id: number;
  name: string;
  kota: string | null;
  avg_rating: number;
  total_mahasiswa: number;
  total_review?: number;
  total_divisi?: number;
  divisions: DivisionDetail[];
};

function CompanyDetailModal({ companyId, onClose }: { companyId: number; onClose: () => void }) {
  const [data, setData] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        // endpoint ini publik (gak perlu role admin)
        const res = await fetch(`${API_URL}/api/companies/${companyId}`, {
          headers: { Accept: "application/json" },
        });
        const json = await res.json();
        if (active) setData(json.data ?? null);
      } catch {
        if (active) setData(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [companyId]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 px-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Detail Perusahaan</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-2/3 rounded bg-slate-100" />
            <div className="h-4 w-1/2 rounded bg-slate-100" />
            <div className="h-20 rounded bg-slate-100" />
          </div>
        ) : !data ? (
          <p className="text-sm text-slate-400">Gagal memuat detail perusahaan.</p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-lg font-bold text-slate-900">{data.name}</p>
              <p className="text-sm text-slate-500">{data.kota || "Lokasi tidak diketahui"}</p>
            </div>

            <div className="flex gap-4 text-xs text-slate-500">
              <span>{data.total_divisi ?? data.divisions?.length ?? 0} divisi</span>
              <span>{data.total_review ?? 0} feedback</span>
              <span>Rating {data.avg_rating ?? 0}</span>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-slate-600">Divisi</p>
              <div className="space-y-1.5">
                {(data.divisions ?? []).map((d) => (
                  <div key={d.id} className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
                    <p className="font-medium text-slate-800">{d.name}</p>
                    {d.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{d.description}</p>
                    )}
                  </div>
                ))}
                {(!data.divisions || data.divisions.length === 0) && (
                  <p className="text-xs text-slate-400">Belum ada divisi.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Card duplikat ─────────────────────────────────────────────────────────────

function DuplicateCard({
  candidate,
  onMerge,
  onView,
}: {
  candidate: DuplicateCandidate;
  onMerge: (duplicateId: number, targetId: number, targetName: string, duplicateName: string) => void;
  onView: (companyId: number) => void;
}) {
  const { company_a, company_b } = candidate;

  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[company_a, company_b].map((side, i) => {
          const other = i === 0 ? company_b : company_a;
          return (
            <div key={side.id} className="rounded-lg border border-slate-100 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{side.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {[side.city, side.province].filter(Boolean).join(", ") || "Lokasi tidak diketahui"}
                  </p>
                  <p className="text-xs text-slate-500">{side.divisions_count} divisi</p>
                </div>
                <button
                  onClick={() => onView(side.id)}
                  title="Lihat detail"
                  className="shrink-0 text-slate-400 hover:text-[#3b5bdb] transition-colors"
                >
                  <Eye size={16} />
                </button>
              </div>
              <button
                onClick={() => onMerge(other.id, side.id, side.name, other.name)}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#3b5bdb] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3349b8]"
              >
                <GitMerge size={13} />
                Gabungkan ke sini
              </button>
            </div>
          );
        })}

        {/* penanda visual bahwa dua sisi ini "nyambung" -- cuma keliatan pas
            side-by-side (sm ke atas) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm sm:flex">
          <GitMerge size={14} />
        </div>
      </div>
    </div>
  );
}

// ─── Tab Duplikat ───────────────────────────────────────────────────────────────

export default function TabDuplikat({
  candidates,
  loading,
  onMerge,
}: {
  candidates: DuplicateCandidate[];
  loading: boolean;
  onMerge: (duplicateId: number, targetId: number, targetName: string, duplicateName: string) => void;
}) {
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [viewingId, setViewingId] = useState<number | null>(null);

  const sorted = useMemo(() => {
    return [...candidates].sort((a, b) => {
      const cmp = a.company_a.name.localeCompare(b.company_a.name);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [candidates, sortDir]);

  return (
    <div className="mt-5 space-y-4">
      {viewingId !== null && (
        <CompanyDetailModal companyId={viewingId} onClose={() => setViewingId(null)} />
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Deteksi nama kemiripan perusahaan ini hanya sebagai penanda. Cek terlebih
          dahulu sebelum menggabungkan perusahaan.
        </p>
        <button
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200"
        >
          {sortDir === "asc" ? <ArrowDown size={13} /> : <ArrowUp size={13} />}
          {sortDir === "asc" ? "A-Z" : "Z-A"}
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-xl border border-slate-100 px-4 py-10 text-center text-sm text-slate-400">
          Tidak ada kandidat duplikat terdeteksi saat ini.
        </div>
      ) : (
        sorted.map((c) => (
          <DuplicateCard
            key={`${c.company_a.id}-${c.company_b.id}`}
            candidate={c}
            onMerge={onMerge}
            onView={setViewingId}
          />
        ))
      )}
    </div>
  );
}
