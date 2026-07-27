"use client";

// ─── components/rekomendasi/Step3Review.tsx
// Step 3: Preview detail sebelum generate rekomendasi

import { Loader2 } from "lucide-react";
import type { Step1Data } from "./Step1skilldivisi";
import type { Step2Data } from "./Step2detailmagang";

const DURASI_LABEL: Record<string, string> = {
  "<3": "< 3 Bulan",
  "3-5": "3 – 5 Bulan",
  ">5": "> 5 Bulan",
};

interface Props {
  step1: Step1Data;
  step2: Step2Data;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] py-3 border-b border-gray-50 last:border-none gap-4">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value}</span>
    </div>
  );
}

export function Step3Review({ step1, step2, onSubmit, onBack, isLoading }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Preview Card */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Preview detail sebelum submit
        </h3>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <ReviewRow
            label="Passion / Minat Divisi"
            value={step1.divisions.join(", ") || "—"}
          />
          <ReviewRow
            label="Skill yang dimiliki"
            value={step1.skills.join(", ") || "—"}
          />
          <ReviewRow
            label="Lokasi"
            value={step2.locations.join(", ") || "—"}
          />
          <ReviewRow
            label="Durasi"
            value={DURASI_LABEL[step2.durasi] || "—"}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500 max-w-xs">
          <span className="text-red-500 font-semibold">(*)</span> Form wajib diisi
          dan tidak bisa dikosongkan.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-7 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200 disabled:opacity-70"
          >
            {isLoading && <Loader2 size={15} className="animate-spin" />}
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}