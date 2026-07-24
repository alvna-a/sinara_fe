"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function DetailRiwayatPage() {
  const params = useParams();
  const feedbackId = params.id as string;

  return (
    <>
        <div className="max-w-3xl mx-auto space-y-5 py-6">
          {/* Back Button */}
          <Link
            href="/riwayat_feedback"
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft size={16} />
            Kembali ke Riwayat
          </Link>

          {/* Detail Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Detail Feedback #{feedbackId}
            </h1>

            {/* Placeholder Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-600 mb-2">Perusahaan</h2>
                <p className="text-lg font-semibold text-gray-900">Tokopedia</p>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-600 mb-2">Posisi</h2>
                <p className="text-lg font-semibold text-gray-900">Product Design Intern</p>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-600 mb-2">Status</h2>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 border border-green-300 rounded-full text-sm font-semibold">
                  Approved
                </span>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-600 mb-2">Feedback</h2>
                <p className="text-gray-700 leading-relaxed">
                  [Isi feedback akan ditampilkan di sini]
                </p>
              </div>
            </div>
          </div>

        </div>
    </>
  );
}