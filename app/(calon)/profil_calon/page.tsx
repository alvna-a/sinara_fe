"use client";

import { useState } from "react";
import { Pencil, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import SidebarCalon from "@/components/layout/sidebar_calon";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserProfile {
  nim: string;
  nama: string;
  program_studi: string;
  semester: number;
  kelas: string;
  tahun_angkatan: number;
  email: string;
  phone: string;
  photo: string | null;
  status_magang: "Belum Magang" | "Sedang Magang" | "Selesai Magang";
  kelengkapan_profil: number; // 0–100
}

// ─── Mock data (replace with your API fetch) ──────────────────────────────────
const mockProfile: UserProfile = {
  nim: "3.34.22.1.01",
  nama: "Arjuna Wiguna",
  program_studi: "D3 - Teknik Informatika",
  semester: 4,
  kelas: "IK - 3B",
  tahun_angkatan: 2022,
  email: "arjuna.33422101@mhs.polines.ac.id",
  phone: "08987654321",
  photo: null,
  status_magang: "Belum Magang",
  kelengkapan_profil: 80,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusConfig: Record<
  UserProfile["status_magang"],
  { label: string; className: string }
> = {
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
};

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
        Status kelengkapan profil anda
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
      <span className="text-sm text-gray-800 font-medium">{value}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfilCalonPage() {
  const [profile] = useState<UserProfile>(mockProfile);

  const status = statusConfig[profile.status_magang];

  return (
    <div className="flex min-h-screen bg-[#EEF0F8]">
      {/* Sidebar */}
      <SidebarCalon />

      {/* Main Content */}
      <main className="ml-60 flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-900">Profil Mahasiswa</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Halo, {profile.nama.split(" ")[0]}</span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white border-2 border-indigo-100">
              {profile.nama
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 px-8 py-7 flex flex-col gap-5 w-full">
          {/* ── Profile Card ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between gap-4">
              {/* Left: avatar + info */}
              <div className="flex items-center gap-5">
                <Avatar photo={profile.photo} nama={profile.nama} />
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                    {profile.nama}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
                    {profile.program_studi} &nbsp;||&nbsp; Semester{" "}
                    {profile.semester}
                  </p>
                  <span className={status.className}>{status.label}</span>
                </div>
              </div>

              {/* Right: Edit button */}
              <Link
                href="/profil_calon/edit_profil"
                className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-sm shrink-0"
              >
                <Pencil size={15} />
                Edit Profile
              </Link>
            </div>
          </div>

          {/* ── Completion Bar ── */}
          <ProfileCompletionBar value={profile.kelengkapan_profil} />

          {/* ── Detail Info Card ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
              <InfoRow label="NIM Mahasiswa" value={profile.nim} />
              <InfoRow label="Email" value={profile.email} />
              <InfoRow label="Kelas" value={profile.kelas} />
              <InfoRow label="No Hp" value={profile.phone} />
              <InfoRow
                label="Tahun Angkatan"
                value={String(profile.tahun_angkatan)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}