"use client";

interface FilterDurasiProps {
  /** value backend: "" | "<3" | "3-5" | ">5" */
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

// Satu-satunya sumber kebenaran untuk opsi durasi. Label yang ditampilkan
// beda dengan value yang dikirim ke BE, tapi mapping-nya hidup di sini saja
// jadi gak ada lagi kejadian FE kirim "> 5 Bulan" mentah-mentah ke backend.
// Enum backend hanya 3: <3, 3-5, >5 (lihat validasi di FeedbackController).
const DURASI_OPTIONS: { label: string; value: string }[] = [
  { label: "Durasi Magang", value: "" },
  { label: "< 3 Bulan", value: "<3" },
  { label: "3 - 5 Bulan", value: "3-5" },
  { label: "> 5 Bulan", value: ">5" },
];

export default function FilterDurasi({ value, onChange, className = "" }: FilterDurasiProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
      >
        {DURASI_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
