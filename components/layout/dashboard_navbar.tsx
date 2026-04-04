"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, User, LogOut, Settings } from "lucide-react";

interface DashboardNavbarProps {
  pageTitle: string;
  userName?: string;
  userRole?: "mahasiswa1" | "mahasiswa2" | "admin";
}

const profileHref: Record<string, string> = {
  mahasiswa1: "/mahasiswa1/profil",
  mahasiswa2: "/mahasiswa2/profil",
  admin: "/admin/profil",
};

export default function DashboardNavbar({
  pageTitle,
  userName = "Pengguna",
  userRole = "mahasiswa2",
}: DashboardNavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-30">
      {/* Page Title */}
      <h1 className="text-base font-semibold text-gray-800">{pageTitle}</h1>

      {/* Profile Shortcut */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">{userName}</span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
            <Link
              href={profileHref[userRole]}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setOpen(false)}
            >
              <User size={15} />
              Profil Saya
            </Link>
            <Link
              href={profileHref[userRole]}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setOpen(false)}
            >
              <Settings size={15} />
              Pengaturan
            </Link>
            <hr className="my-1 border-gray-100" />
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full"
              onClick={() => {
                setOpen(false);
                // TODO: handle logout
              }}
            >
              <LogOut size={15} />
              Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}