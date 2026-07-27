"use client";

// ─── components/rekomendasi/Step2DetailMagang.tsx
// Step 2: Lokasi tempat magang (maks 3) + Durasi magang

import { useState, useRef } from "react";
import { Check } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface Step2Data {
  locations: string[]; // maks 3
  durasi: string;      // "<3" | "3-5" | ">5"
}

interface Props {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
  onNext: () => void;
  onBack: () => void;
}

// ── Constant data ──────────────────────────────────────────────────────────────
const LOCATION_SUGGESTIONS = [
  "Jakarta Selatan",
  "Jakarta Pusat",
  "Jakarta Timur",
  "Jakarta Barat",
  "Jakarta Utara",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Semarang",
  "Bali",
  "Medan",
  "Malang",
  "Bekasi",
  "Tangerang",
  "Depok",
  "Bogor",
  "Remote / WFH",
];

const DURASI_OPTIONS = [
  { value: "<3",  label: "< 3 Bulan" },
  { value: "3-5", label: "3 – 5 Bulan" },
  { value: ">5",  label: "> 5 Bulan" },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export function Step2DetailMagang({ data, onChange, onNext, onBack }: Props) {
  const [locationQuery, setLocationQuery] = useState("");
  const [errors, setErrors] = useState<{ locations?: string; durasi?: string }>({});
  const locInputRef = useRef<HTMLInputElement>(null);

  // ── Location handlers ──────────────────────────────────────────────────────
  const filteredLocations = LOCATION_SUGGESTIONS.filter(
    (l) =>
      l.toLowerCase().includes(locationQuery.toLowerCase()) &&
      !data.locations.includes(l)
  );

  const addLocation = (loc: string) => {
    if (data.locations.length >= 3) return;
    if (data.locations.includes(loc)) return;
    onChange({ ...data, locations: [...data.locations, loc] });
    setLocationQuery("");
    setErrors((e) => ({ ...e, locations: undefined }));
    locInputRef.current?.focus();
  };

  const removeLocation = (loc: string) =>
    onChange({ ...data, locations: data.locations.filter((l) => l !== loc) });

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && locationQuery.trim()) {
      e.preventDefault();
      addLocation(locationQuery.trim());
    }
  };

  // ── Durasi handler ─────────────────────────────────────────────────────────
  const selectDurasi = (val: string) => {
    onChange({ ...data, durasi: val });
    setErrors((e) => ({ ...e, durasi: undefined }));
  };

  // ── Validation & next ──────────────────────────────────────────────────────
  const handleNext = () => {
    const newErrors: typeof errors = {};
    if (data.locations.length === 0)
      newErrors.locations = "Pilih minimal 1 lokasi.";
    if (!data.durasi)
      newErrors.durasi = "Pilih durasi magang.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onNext();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">

      {/* ── Lokasi Tempat Magang ───────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
          Lokasi tempat magang{" "}
          <span className="text-red-500">*</span>
        </label>

        {/* Input */}
        <div
          className={`flex items-center gap-2 border rounded-xl px-3 py-2 bg-white cursor-text transition-colors
            ${errors.locations
              ? "border-red-400 ring-1 ring-red-300"
              : "border-gray-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100"
            }`}
          onClick={() => locInputRef.current?.focus()}
        >
          <input
            ref={locInputRef}
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyDown={handleLocationKeyDown}
            placeholder={
              data.locations.length < 3
                ? "Ketik atau pilih lokasi…"
                : "Pilih lokasi sesuai kebutuhan."
            }
            disabled={data.locations.length >= 3}
            className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent disabled:cursor-not-allowed"
          />
          <span className="text-xs text-gray-400 shrink-0">Cari lokasi</span>
        </div>

        {/* Dropdown suggestions */}
        {locationQuery && filteredLocations.length > 0 && (
          <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden z-10">
            {filteredLocations.slice(0, 5).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => addLocation(l)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Selected location tags + suggestion pills */}
        <div className="flex flex-wrap gap-2 mt-3 p-3 bg-white rounded-xl border border-gray-100 min-h-13">
          {/* Selected */}
          {data.locations.map((loc) => (
            <span
              key={loc}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200"
            >
              {loc}
              <button
                type="button"
                onClick={() => removeLocation(loc)}
                className="hover:text-indigo-900 transition-colors"
              >
                ×
              </button>
            </span>
          ))}

          {/* Suggestion pills */}
          {!locationQuery &&
            data.locations.length < 3 &&
            LOCATION_SUGGESTIONS.filter((l) => !data.locations.includes(l))
              .slice(0, Math.max(0, 6 - data.locations.length))
              .map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => addLocation(l)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors"
                >
                  {l}
                </button>
              ))}
        </div>

        {errors.locations && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <span>⚠</span> {errors.locations}
          </p>
        )}
        <p className="mt-1.5 text-xs text-gray-400">
          Kamu bisa memilih 3 lokasi sekaligus dalam satu kali request rekomendasi.
        </p>
      </div>

      {/* ── Durasi Magang ──────────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Durasi magang{" "}
          <span className="text-red-500">*</span>
        </label>

        <div
          className={`rounded-xl border overflow-hidden transition-colors
            ${errors.durasi ? "border-red-400 ring-1 ring-red-300" : "border-gray-200"}`}
        >
          {DURASI_OPTIONS.map((opt, idx) => {
            const isSelected = data.durasi === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => selectDurasi(opt.value)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium transition-colors
                  ${idx !== 0 ? "border-t border-gray-100" : ""}
                  ${isSelected
                    ? "bg-indigo-50 text-indigo-700"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="text-xs font-semibold text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded-full">
                    Dipilih
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {errors.durasi && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <span>⚠</span> {errors.durasi}
          </p>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500 max-w-xs">
          <span className="text-red-500 font-semibold">(*)</span> Form wajib diisi
          dan tidak bisa dikosongkan.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-sm font-semibold rounded-xl transition-all"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-7 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200"
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}