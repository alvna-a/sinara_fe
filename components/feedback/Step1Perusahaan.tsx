"use client";

import { useState, useEffect, useRef } from "react";

export interface Step1Data {
  namaPerusahaan: string;
  divisi: string;
  lokasi: string;
  durasi: string; // display value: "< 3 Bulan" | "3 - 5 Bulan" | "> 5 Bulan"
}

interface DivisionOption {
  id: number;
  name: string;
  company?: { name: string };
}

interface Step1Props {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  onNext: () => void;
}

// Mapping display label → value yang dikirim ke BE (sesuai enum BE: '<3','3-5','>5')
export const DURASI_MAP: Record<string, string> = {
  "< 3 Bulan": "<3",
  "3 - 5 Bulan": "3-5",
  "> 5 Bulan": ">5",
};

const DURASI_OPTIONS = Object.keys(DURASI_MAP);

export default function Step1Perusahaan({ data, onChange, onNext }: Step1Props) {
  const [errors, setErrors] = useState<Partial<Step1Data>>({});
  const [divisiOptions, setDivisiOptions] = useState<DivisionOption[]>([]);
  const [showDivisiDropdown, setShowDivisiDropdown] = useState(false);
  const [loadingDivisi, setLoadingDivisi] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchDivisions = async (search: string) => {
    setLoadingDivisi(true);
    try {
      const token = localStorage.getItem("access_token");
      const params = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/divisions${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      setDivisiOptions(json.data || []);
    } catch (err) {
      console.error("Gagal fetch divisions:", err);
      setDivisiOptions([]);
    } finally {
      setLoadingDivisi(false);
    }
  };

  // Fetch divisions on mount untuk suggestions awal
  useEffect(() => {
    fetchDivisions("");
  }, []);

  // Debounce input divisi
  const handleDivisiInput = (val: string) => {
    onChange({ ...data, divisi: val });
    setShowDivisiDropdown(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchDivisions(val), 300);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDivisiDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const validate = () => {
    const newErrors: Partial<Step1Data> = {};
    if (!data.namaPerusahaan.trim()) newErrors.namaPerusahaan = "Nama perusahaan wajib diisi";
    if (!data.divisi.trim()) newErrors.divisi = "Divisi / posisi magang wajib diisi";
    if (!data.lokasi.trim()) newErrors.lokasi = "Lokasi tempat magang wajib diisi";
    if (!data.durasi) newErrors.durasi = "Durasi magang wajib dipilih";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-6">
      {/* Nama Perusahaan */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Nama perusahaan <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.namaPerusahaan}
          onChange={(e) => onChange({ ...data, namaPerusahaan: e.target.value })}
          placeholder="Contoh: Tokopedia"
          className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
            errors.namaPerusahaan ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.namaPerusahaan && (
          <p className="mt-1 text-xs text-red-500">{errors.namaPerusahaan}</p>
        )}
      </div>

      {/* Divisi — dengan autocomplete dari BE */}
      <div ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Divisi / posisi magang <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.divisi}
            onChange={(e) => handleDivisiInput(e.target.value)}
            onFocus={() => setShowDivisiDropdown(true)}
            placeholder="Contoh: Product Design Intern"
            className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition pr-24 ${
              errors.divisi ? "border-red-500" : "border-gray-200"
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
            Cari divisi
          </span>

          {showDivisiDropdown && (divisiOptions.length > 0 || loadingDivisi) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-52 overflow-y-auto">
              {loadingDivisi ? (
                <div className="px-4 py-3 text-xs text-gray-400">Mencari...</div>
              ) : (
                divisiOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onChange({ ...data, divisi: opt.name });
                      setShowDivisiDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                  >
                    <span className="font-medium">{opt.name}</span>
                    {opt.company && (
                      <span className="text-xs text-gray-400 ml-2">— {opt.company.name}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        {errors.divisi && (
          <p className="mt-1 text-xs text-red-500">{errors.divisi}</p>
        )}
      </div>

      {/* Lokasi */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Lokasi tempat magang <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.lokasi}
          onChange={(e) => onChange({ ...data, lokasi: e.target.value })}
          placeholder="Contoh: Jakarta Selatan"
          className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
            errors.lokasi ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.lokasi && (
          <p className="mt-1 text-xs text-red-500">{errors.lokasi}</p>
        )}
      </div>

      {/* Durasi */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Durasi magang <span className="text-red-500">*</span>
        </label>
        <div className={`rounded-lg border overflow-hidden ${errors.durasi ? "border-red-500" : "border-gray-200"}`}>
          {DURASI_OPTIONS.map((opt, idx) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange({ ...data, durasi: opt })}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition ${
                idx !== 0 ? "border-t border-gray-100" : ""
              } ${
                data.durasi === opt
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{opt}</span>
              {data.durasi === opt && (
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                  Dipilih
                </span>
              )}
            </button>
          ))}
        </div>
        {errors.durasi && (
          <p className="mt-1 text-xs text-red-500">{errors.durasi}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-gray-500">
          <span className="text-red-500">(*)</span> Form wajib diisi dan apabila field kosong akan menampilkan
          order merah dan pesan error di bawahnya.
        </p>
        <button
          onClick={() => { if (validate()) onNext(); }}
          className="px-6 py-2.5 bg-linear-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold rounded-full hover:opacity-90 transition shadow-sm"
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}