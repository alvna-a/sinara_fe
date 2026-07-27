"use client";
// app/(calon)/profil_calon/page.tsx
// Data dari: GET /api/me + GET /api/profile via useProfile hook
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
// NOTE: SidebarCalon & MiniFooter DIHAPUS dari sini.
// app/(calon)/layout.tsx sudah render SidebarCalon + DashboardHeader + DashboardMain,
// dan DashboardMain sendiri sudah render MiniFooter di bawahnya — kalau dipanggil
// lagi di sini, footernya jadi dobel.
// ─── Sub-components ────────────────────────────────────────────────────────────
function Avatar({ photo, nama }: { photo: string | null; nama: string }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={nama}
        className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100"
      />
    );
  }
  const initials = nama
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center ring-4 ring-blue-100">
      <span className="text-white text-2xl font-bold">{initials}</span>
    </div>
  );
}
function ProfileCompletionBar({ value }: { value: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex items-center gap-5">
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Tingkat kelengkapan profil
      </span>
      <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-blue-600 font-bold text-base w-12 text-right">
        {value}%
      </span>
    </div>
  );
}
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-gray-800 font-medium break-all">
        {value || <span className="text-gray-400 italic">Belum diisi</span>}
      </span>
    </div>
  );
}
function ProfileSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4 sm:gap-5 w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-7 w-56 bg-gray-200 rounded" />
            <div className="h-4 w-36 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
        <div className="h-3 w-full bg-gray-200 rounded-full" />
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
const statusMagangConfig = {
  "Belum Magang": {
    label: "Belum Magang",
    className:
      "bg-amber-400 text-white text-xs font-semibold px-4 py-1.5 rounded-full",
  },
  "Sedang Magang": {
    label: "Sedang Magang",
    className:
      "bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full",
  },
  "Selesai Magang": {
    label: "Selesai Magang",
    className:
      "bg-emerald-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full",
  },
} as const;
// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function ProfilCalonPage() {
  const { profile, loading, error } = useProfile();
  const statusKey =
    (profile?.status_magang as keyof typeof statusMagangConfig) ??
    "Belum Magang";
  const status =
    statusMagangConfig[statusKey] ?? statusMagangConfig["Belum Magang"];
  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full">
      {/* Error global */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}
      {loading ? (
        <ProfileSkeleton />
      ) : (
        <>
          {/* Card: Avatar + nama + tombol Edit */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
              {/* Kiri: avatar + info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 min-w-0">
                <div className="flex-shrink-0">
                  <Avatar photo={profile.photo} nama={profile.name || "?"} />
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                    {profile.name || "-"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    {profile.program_studi || "Program Studi"}
                    {profile.kelas ? ` • ${profile.kelas}` : ""}
                  </p>
                  <span className={status.className}>{status.label}</span>
                </div>
              </div>
              {/* Kanan: tombol Edit */}
              <Link
                href="/profil_calon/edit_profil"
                className="flex items-center justify-center sm:justify-start gap-2 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-sm whitespace-nowrap self-start"
              >
                <Pencil size={15} />
                Edit Profil
              </Link>
            </div>
          </div>
          {/* Completion bar */}
          <ProfileCompletionBar value={profile.kelengkapan_profil} />
          {/* Card: Grid info detail */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-x-12 gap-y-4 sm:gap-y-6">
              <InfoRow label="NIM" value={profile.nim ?? "-"} />
              <InfoRow label="Email" value={profile.email || "-"} />
              <InfoRow label="Kelas" value={profile.kelas ?? "-"} />
              <InfoRow label="No. HP" value={profile.phone || "-"} />
              <InfoRow
                label="Tahun Angkatan"
                value={
                  profile.tahun_angkatan ? String(profile.tahun_angkatan) : "-"
                }
              />
              <InfoRow
                label="Program Studi"
                value={profile.program_studi || "-"}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}