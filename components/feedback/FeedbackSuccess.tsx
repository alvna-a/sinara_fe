"use client";

import { useRouter } from "next/navigation";

export default function FeedbackSuccess() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center text-center py-6 space-y-6">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Title & Description */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Feedback Berhasil Dikirim!</h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-md">
          Terima kasih telah membagikan pengalaman magang kamu.
          <br />
          Kontribusi kamu sangat berarti bagi mahasiswa lain dalam menemukan tempat
          magang yang tepat.
        </p>
      </div>

      {/* Info box */}
      <div className="w-full max-w-md bg-gray-100 rounded-xl px-5 py-4 flex items-start gap-3 text-left">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          Feedback kamu saat ini berstatus{" "}
          <strong className="font-semibold text-gray-900">Pending Review</strong>.{" "}
          Tim kami akan meninjau ulasan kamu dalam waktu 1x24 jam sebelum ditampilkan ke publik.
        </p>
      </div>

      {/* Actions */}
      <div className="w-full max-w-md space-y-3">
        <button
          onClick={() => router.push("/dashboard_alumni")}
          className="w-full py-3 bg-linear-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold rounded-full hover:opacity-90 transition shadow-sm flex items-center justify-center gap-2"
        >
          Kembali ke Dashboard
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={() => router.push("/riwayat_feedback")}
          className="w-full py-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 transition"
        >
          Lihat Riwayat Feedback
        </button>
      </div>
    </div>
  );
}