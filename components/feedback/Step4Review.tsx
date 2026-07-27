"use client";

import { Step1Data, DURASI_MAP } from "./Step1Perusahaan";
import { Step2Data } from "./Step2Skill";
import { Step3Data } from "./Step3Pengalaman";

interface Step4Props {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: "Sangat Tidak Sesuai",
  2: "Tidak Sesuai",
  3: "Cukup Sesuai",
  4: "Sesuai",
  5: "Sangat Sesuai",
};

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <tr className="border-b border-gray-100 last:border-0">
    <td className="py-3 pr-4 text-sm text-gray-500 font-medium whitespace-nowrap align-top w-44">{label}</td>
    <td className="py-3 text-sm text-gray-800">{value}</td>
  </tr>
);

export default function Step4Review({ step1, step2, step3, onSubmit, onBack, isLoading }: Step4Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Preview review sebelum submit</h3>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <tbody>
              <ReviewRow label="Perusahaan" value={step1.namaPerusahaan} />
              <ReviewRow label="Divisi" value={step1.divisi} />
              <ReviewRow label="Lokasi" value={step1.lokasi} />
              <ReviewRow
                label="Durasi"
                value={`${step1.durasi} (dikirim: ${DURASI_MAP[step1.durasi] ?? step1.durasi})`}
              />
              <ReviewRow label="Skill utama" value={step2.skills.join(", ")} />
              <ReviewRow
                label="Tingkat kesesuaian"
                value={step2.tingkatKesesuaian > 0 ? `${step2.tingkatKesesuaian} — ${RATING_LABELS[step2.tingkatKesesuaian]}` : "-"}
              />
              <ReviewRow label="Alasan penilaian" value={step2.alasanKesesuaian} />
              <ReviewRow label="Pengalaman" value={step3.ringkasan} />
              <ReviewRow label="Jobdesk" value={step3.jobdesk.join(", ")} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-gray-500">
          <span className="text-red-500">(*)</span> Form wajib diisi dan tidak bisa dikosongkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="px-5 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-200 transition disabled:opacity-50"
          >
            Kembali
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 bg-linear-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold rounded-full hover:opacity-90 transition shadow-sm disabled:opacity-60 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Mengirim...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}