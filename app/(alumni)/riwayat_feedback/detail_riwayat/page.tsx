"use client";

import Link from "next/link";

type StatusType = "Approved" | "Pending" | "Rejected";

interface FeedbackDetail {
  id: string;
  perusahaan: string;
  posisi: string;
  tanggal: string;
  status: StatusType;
  skills: string[];
  pengalaman: string[];
}

// Dummy data — ganti dengan fetch dari API berdasarkan params.id
const dummyDetail: FeedbackDetail = {
  id: "1",
  perusahaan: "Tokopedia",
  posisi: "Product Design Intern",
  tanggal: "12 Okt 2023",
  status: "Approved",
  skills: ["UI/UX Design", "Figma", "Prototyping", "User Research", "Design System"],
  pengalaman: [
    "Magang di Tokopedia sebagai Product Design Intern memberikan banyak pengalaman berharga. Saya dilibatkan langsung dalam pembuatan komponen untuk design system baru dan melakukan user research untuk fitur-fitur yang akan datang. Lingkungan kerja sangat suportif untuk belajar, dan mentor selalu memberikan feedback yang membangun setiap minggunya.",
    "Sangat direkomendasikan bagi mahasiswa yang ingin belajar proses desain di industri tech dengan skala yang besar dan tim yang kolaboratif.",
  ],
};

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  Approved: {
    label: "Approved",
    className: "bg-green-100 text-green-700 border border-green-300",
  },
  Pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  },
  Rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-600 border border-red-300",
  },
};

export default function DetailFeedbackPage({
  params,
}: {
  params: { id: string };
}) {
  // Nanti ganti dengan fetch data berdasarkan params.id
  const data = dummyDetail;
  const status = statusConfig[data.status];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/alumni/riwayat-feedback"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Riwayat
      </Link>

      {/* Card Container */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="bg-gray-100 px-5 py-3.5">
          <h2 className="text-base font-semibold text-gray-700">Detail Feedback</h2>
        </div>

        <div className="p-5 sm:p-6">
          {/* Company Info */}
          <div className="mb-6 flex items-start gap-4 rounded-2xl border border-gray-100 bg-indigo-50/40 p-4">
            {/* Logo */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200 text-lg font-bold text-gray-400 shadow-sm overflow-hidden">
              {data.perusahaan.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{data.perusahaan}</h3>
              <p className="text-sm text-gray-500">
                {data.posisi} • Disubmit pada {data.tanggal}
              </p>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${status.className}`}
              >
                {status.label}
              </span>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-bold text-gray-700">
              Skill yang Dibutuhkan
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-teal-300 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Pengalaman & Ringkasan */}
          <div>
            <h4 className="mb-3 text-sm font-bold text-gray-700">
              Pengalaman &amp; Ringkasan
            </h4>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
              {data.pengalaman.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-gray-700">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}