"use client";

interface FilterRatingProps {
  /** value backend (min_rating): "" | "5" | "4" | "3" */
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

const RATING_OPTIONS: { label: string; value: string }[] = [
  { label: "Rating Perusahaan", value: "" },
  { label: "5 Bintang", value: "5" },
  { label: "4+ Bintang", value: "4" },
  { label: "3+ Bintang", value: "3" },
];

export default function FilterRating({ value, onChange, className = "" }: FilterRatingProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
      >
        {RATING_OPTIONS.map((opt) => (
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
