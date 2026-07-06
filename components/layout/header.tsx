"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, User, LogOut } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useSidebar } from "@/components/layout/sidebar_context";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Role = "admin" | "calon" | "alumni";

// ─── Judul halaman otomatis berdasarkan pathname, per role ───────────────────

const pageTitlesByRole: Record<Role, { match: string; title: string }[]> = {
  admin: [
    { match: "/dashboard_admin", title: "Dashboard Utama" },
    { match: "/review_feedback", title: "Review Feedback" },
    { match: "/kelola_perusahaan", title: "Kelola Perusahaan" },
    { match: "/data_mahasiswa", title: "Data Mahasiswa" },
    { match: "/profil_admin/edit_profil", title: "Edit Profil Admin" },
    { match: "/profil_admin", title: "Profil Admin" },
  ],
  calon: [
    { match: "/dashboard_calon", title: "Dashboard" },
    { match: "/cari_rekomendasi", title: "Cari Rekomendasi" },
    { match: "/riwayat_rekomendasi", title: "Riwayat Rekomendasi" },
    { match: "/profil_calon/edit_profil", title: "Edit Profil" },
    { match: "/profil_calon", title: "Profil Saya" },
  ],
  alumni: [
    { match: "/dashboard_alumni", title: "Dashboard" },
    { match: "/riwayat_feedback", title: "Riwayat Feedback" },
    { match: "/input_feedback", title: "Input Feedback" },
    { match: "/profil_alumni/edit_profil", title: "Edit Profil" },
    { match: "/profil_alumni", title: "Profil Saya" },
  ],
};

const profileHrefByRole: Record<Role, string> = {
  admin: "/profil_admin",
  calon: "/profil_calon",
  alumni: "/profil_alumni",
};

function getPageTitle(role: Role, pathname: string): string {
  const found = pageTitlesByRole[role].find((p) => pathname.startsWith(p.match));
  return found?.title ?? "Dashboard";
}

// ─── Fetch profil admin (endpoint beda dari calon/alumni) ────────────────────

interface AdminHeaderProfile {
  nama: string;
  photo: string | null;
}

const defaultAdminProfile: AdminHeaderProfile = { nama: "Admin", photo: null };

async function fetchAdminHeaderProfile(): Promise<AdminHeaderProfile> {
  const token = localStorage.getItem("access_token");
  if (!token) return defaultAdminProfile;
  try {
    const [resMe, resProfile] = await Promise.all([
      fetch(`${API_URL}/api/me`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/api/profile`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    if (!resMe.ok) return defaultAdminProfile;
    const user = await resMe.json();
    const profileJson = resProfile.ok ? await resProfile.json() : { data: {} };
    const profileData = profileJson?.data?.profile ?? profileJson?.data ?? {};
    const photoUrl = profileData?.photo ? `${API_URL}/storage/${profileData.photo}` : null;
    return {
      nama: user.name ?? defaultAdminProfile.nama,
      photo: photoUrl,
    };
  } catch (err) {
    console.error("Gagal fetch profil admin:", err);
    return defaultAdminProfile;
  }
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ photo, nama }: { photo: string | null | undefined; nama: string }) {
  if (photo) {
    return <img src={photo} alt={nama} className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100" />;
  }
  const initials = (nama || "?").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white border-2 border-indigo-100 flex-shrink-0">
      {initials}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header({ role }: { role: Role }) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(role, pathname);
  const { desktopOpen } = useSidebar();

  // Sumber profil calon/alumni (hook, sama untuk keduanya)
  const { profile: hookProfile, loading: hookLoading } = useProfile();

  // Sumber profil admin (fetch manual, endpoint beda)
  const [adminProfile, setAdminProfile] = useState<AdminHeaderProfile>(defaultAdminProfile);

  useEffect(() => {
    if (role !== "admin") return;
    fetchAdminHeaderProfile().then(setAdminProfile);

    function onProfileUpdated() {
      fetchAdminHeaderProfile().then(setAdminProfile);
    }
    window.addEventListener("sinaraProfileUpdated", onProfileUpdated);
    return () => window.removeEventListener("sinaraProfileUpdated", onProfileUpdated);
  }, [role]);

  const displayName = role === "admin" ? adminProfile.nama : hookProfile?.name ?? "";
  const displayPhoto = role === "admin" ? adminProfile.photo : hookProfile?.photo;
  const isReady = role === "admin" ? true : !hookLoading && !!hookProfile?.name;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-30 flex items-center justify-between px-4 sm:px-6 md:px-8 transition-all duration-300
        ${desktopOpen ? "md:left-60" : "md:left-0"}`}
    >
      <h1
        className={`text-base sm:text-lg font-bold text-gray-900 truncate pl-12 transition-all duration-300
          ${desktopOpen ? "md:pl-0" : "md:pl-12"}`}
      >
        {pageTitle}
      </h1>

      {isReady && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="flex items-center gap-2 sm:gap-3 rounded-full pl-1 pr-2 py-1 hover:bg-gray-50 transition-colors"
          >
            <Avatar photo={displayPhoto} nama={displayName} />
            <span className="hidden sm:block text-sm font-medium text-gray-700 truncate max-w-[140px]">
              {displayName}
            </span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-40">
              <Link
                href={profileHrefByRole[role]}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                <User size={16} />
                Lihat Profil
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Keluar
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
