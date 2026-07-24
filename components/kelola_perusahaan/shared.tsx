"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Check, ChevronDown } from "lucide-react";
import type { CompanyOption } from "./types";

export function ApprovedBadge({ count }: { count: number }) {
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

export function SortableHeader({
  label,
  colKey,
  activeKey,
  dir,
  onSort,
}: {
  label: string;
  colKey: string;
  activeKey: string | null;
  dir: "asc" | "desc";
  onSort: () => void;
}) {
  const isActive = activeKey === colKey;
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 tracking-wide">
      <button onClick={onSort} className="inline-flex items-center gap-1 hover:text-slate-800 transition-colors">
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

export function SkeletonRows({ cols }: { cols: number }) {
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

// Combobox searchable -- dipakai di section "Gabungkan Perusahaan" pada
// EditPerusahaanModal (lihat TabPerusahaan.tsx)
export function CompanyPicker({
  options,
  value,
  onChange,
  excludeId,
  placeholder = "Cari nama perusahaan...",
}: {
  options: CompanyOption[];
  value: number | null;
  onChange: (id: number) => void;
  excludeId?: number;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.id === value) ?? null;

  const filtered = options
    .filter((o) => o.id !== excludeId)
    .filter((o) => o.nama.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3.5 py-2.5 text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]/20 focus:border-[#3b5bdb]"
      >
        <span className={selected ? "text-slate-900" : "text-slate-400"}>
          {selected ? selected.nama : placeholder}
        </span>
        <ChevronDown size={14} className="shrink-0 text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full min-w-[380px] rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="relative border-b border-slate-100 p-2.5">
            <Search size={13} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik buat cari..."
              className="w-full rounded-md border-none bg-slate-50 py-2 pl-7 pr-2 text-sm focus:outline-none"
            />
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3.5 py-3 text-xs text-slate-400">Tidak ditemukan.</p>
            ) : (
              filtered.map((o) => {
                const location = [o.city, o.province].filter(Boolean).join(", ");
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => {
                      onChange(o.id);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex w-full items-start justify-between gap-2 px-3.5 py-2.5 text-left text-sm hover:bg-slate-50"
                  >
                    <span>
                      <span className="block font-medium text-slate-800">{o.nama}</span>
                      {location && <span className="block text-xs text-slate-400">{location}</span>}
                    </span>
                    {o.id === value && <Check size={14} className="mt-0.5 shrink-0 text-[#3b5bdb]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
