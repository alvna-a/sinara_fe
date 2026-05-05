"use client";

import Link from "next/link";
import SidebarAlumni from "@/components/layout/sidebar_alumni";
import DashboardNavbar from "@/components/layout/dashboard_navbar";
import MiniFooter from "@/components/layout/mini_footer";

type StatusType = "Approved" | "Pending" | "Rejected";

interface FeedbackItem {
  id: string;
  perusahaan: string;
  posisi: string;
  tanggal: string;
  status: StatusType;
  logo: string;
}

const dummyData: FeedbackItem[] = [
  {
    id: "1",
    perusahaan: "Tokopedia",
    posisi: "Product Design Intern",
    tanggal: "12 Okt 2023",
    status: "Approved",
    logo: "/logos/tokopedia.png",
  },
  {
    id: "2",
    perusahaan: "Traveloka",
    posisi: "UX Researcher Intern",
    tanggal: "05 Okt 2023",
    status: "Pending",
    logo: "/logos/traveloka.png",
  },
  {
    id: "3",
    perusahaan: "Ruangguru",
    posisi: "UI Designer Intern",
    tanggal: "28 Sep 2023",
    status: "Rejected",
    logo: "/logos/ruangguru.png",
  },
];

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

export default function RiwayatFeedbackPage() {
  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      <SidebarAlumni />
      <DashboardNavbar pageTitle="Riwayat Feedback" userName="Arjuna" userRole="alumni" />

      <main className="md:ml-60 pt-16 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-5xl mx-auto space-y-5 py-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Riwayat Feedback Saya
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Kelola dan pantau status feedback pengalaman magang yang sudah kamu
                submit.
              </p>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
              {dummyData.map((item) => {
                const status = statusConfig[item.status];
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Left: Logo + Info */}
                    <div className="flex items-center gap-3">
                      {/* Logo placeholder */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-semibold text-gray-400 overflow-hidden">
                        {/* Jika logo tersedia, ganti dengan <img> */}
                        {item.perusahaan.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.perusahaan}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.posisi} • {item.tanggal}
                        </p>
                      </div>
                    </div>

                    {/* Right: Status + Actions */}
                    <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                      <Link
                        href={`/riwayat_feedback/detail_riwayat/${item.id}`}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        Lihat Detail
                      </Link>
                      <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50">
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <MiniFooter />
        </div>
      </main>
    </div>
  );
}