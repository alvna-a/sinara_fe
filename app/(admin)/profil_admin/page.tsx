"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import Link from "next/link";

// NOTE: SidebarAdmin & header custom ("Halo, {nama}") DIHAPUS dari sini.
// app/(admin)/layout.tsx sudah render SidebarAdmin + DashboardHeader + DashboardMain,
// dan DashboardHeader sendiri sudah nampilin nama user + dropdown di kanan atas.
// Kalau dirender lagi di sini, sidebar/header dobel + padding numpuk.

// ─── Types ────────────────────────────────────────────────────────────────
interface AdminProfile {
  id_admin: string;
  nama: string;
  jabatan: string;
  unit: string;
  email: string;
  phone: string;
  photo: string | null;
  akses: string;
  status_kerja: "Aktif" | "Cuti" | "Nonaktif";
  kelengkapan_profil: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const defaultProfile: AdminProfile = {
  id_admin: "-",
  nama: "Admin",
  jabatan: "Administrator",
  unit: "Administrasi",
  email: "-",
  phone: "-",
  photo: null,
  akses: "Admin",
  status_kerja: "Aktif",
  kelengkapan_profil: 0,
};

// ─── Hitung kelengkapan profil ─────────────────────────────────────────────
// ✅ FIX (v2): percobaan pertama sempat masukin user.jabatan & user.unit ke
// rumus ini — TERNYATA keduanya bukan field asli sama sekali. Tabel `users`
// di database cuma punya kolom name/nim/email/password/role, gak ada
// jabatan/unit/status_kerja. Teks "Administrator" / "Administrasi" yang
// muncul di layar itu hardcoded fallback di fetchProfileFromAPI() di bawah
// (`user.jabatan ?? "Administrator"`), BUKAN data dari server — dan halaman
// Edit Profil Admin juga gak punya input buat itu. Jadi ngitung field yang
// gak pernah bisa "diisi" secara nyata cuma bikin skor makin gak akurat.
// Sekarang cuma ngitung 4 field yang beneran ada di database DAN beneran
// bisa diisi lewat form edit: nama, email, no. HP, foto.
function hitungKelengkapan(
  user: Record<string, unknown>,
  profile: Record<string, unknown>,
): number {
  const fields = [user?.name, user?.email, profile?.phone, profile?.photo];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

// ─── Fetch profil dari API ───────────────────────────────────────────────────
async function fetchProfileFromAPI(): Promise<AdminProfile> {
  const token = localStorage.getItem("access_token");
  if (!token) return defaultProfile;
  try {
    const [resMe, resProfile] = await Promise.all([
      fetch(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    if (!resMe.ok) {
      localStorage.removeItem("access_token");
      return defaultProfile;
    }
    const user = await resMe.json();
    const profileJson = resProfile.ok ? await resProfile.json() : { data: {} };
    const profileData = profileJson?.data?.profile ?? profileJson?.data ?? {};
    const photoUrl = profileData?.photo
      ? `${API_URL}/storage/${profileData.photo}`
      : null;
    return {
      id_admin: `ADM-${String(user.id).padStart(3, "0")}`,
      nama: user.name ?? defaultProfile.nama,
      jabatan: user.jabatan ?? "Administrator",
      unit: user.unit ?? "Administrasi",
      email: user.email ?? defaultProfile.email,
      phone: profileData?.phone ?? "-",
      photo: photoUrl,
      akses: user.role === "admin" ? "Admin" : (user.role ?? "Admin"),
      status_kerja: user.status_kerja ?? "Aktif",
      kelengkapan_profil: hitungKelengkapan(user, profileData),
    };
  } catch (err) {
    console.error("Gagal fetch profil:", err);
    return defaultProfile;
  }
}

// ─── Status config ───────────────────────────────────────────────────────────
const statusConfig = {
  Aktif: {
    label: "Aktif",
    className:
      "bg-emerald-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full",
  },
  Cuti: {
    label: "Cuti",
    className:
      "bg-amber-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full",
  },
  Nonaktif: {
    label: "Nonaktif",
    className:
      "bg-gray-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full",
  },
} as const;

// ─── Sub-components ──────────────────────────────────────────────────────────
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
        Tingkat kelengkapan profil admin
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

function ProfileSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4 sm:gap-5 w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gray-200" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
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

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfilAdminPage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchProfileFromAPI()
      .then(setProfile)
      .catch(() => {
        setError("Gagal memuat profil. Coba refresh halaman.");
        setProfile(defaultProfile);
      })
      .finally(() => setLoading(false));
  }, []);

  // Listen for profile updates from other pages (edit form)
  useEffect(() => {
    function onProfileUpdated() {
      setLoading(true);
      fetchProfileFromAPI()
        .then(setProfile)
        .catch(() => setProfile(defaultProfile))
        .finally(() => setLoading(false));
    }
    if (typeof window !== "undefined") {
      window.addEventListener("sinaraProfileUpdated", onProfileUpdated);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("sinaraProfileUpdated", onProfileUpdated);
      }
    };
  }, []);

  const status = profile
    ? statusConfig[profile.status_kerja]
    : statusConfig["Aktif"];

  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}
      {loading ? (
        <ProfileSkeleton />
      ) : profile ? (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 min-w-0">
                <div className="flex-shrink-0">
                  <Avatar photo={profile.photo} nama={profile.nama} />
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight truncate">
                    {profile.nama}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    {profile.jabatan} • {profile.unit}
                  </p>
                  <span className={status.className}>{status.label}</span>
                </div>
              </div>
              <Link
                href="/profil_admin/edit_profil"
                className="flex items-center justify-center sm:justify-start gap-2 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-sm whitespace-nowrap"
              >
                <Pencil size={15} />
                Edit Profil
              </Link>
            </div>
          </div>
          <ProfileCompletionBar value={profile.kelengkapan_profil} />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-x-12 gap-y-4 sm:gap-y-6">
              <InfoRow label="ID Admin" value={profile.id_admin} />
              <InfoRow label="Email" value={profile.email} />
              <InfoRow label="Jabatan" value={profile.jabatan} />
              <InfoRow label="No. HP" value={profile.phone} />
              <InfoRow label="Unit" value={profile.unit} />
              <InfoRow label="Tipe Akses" value={profile.akses} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}