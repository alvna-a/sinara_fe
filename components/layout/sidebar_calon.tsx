"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  BookOpen,
  User,
  ArrowLeft,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/mahasiswa2/dashboard", icon: LayoutDashboard },
  { label: "Cari Rekomendasi", href: "/mahasiswa2/rekomendasi", icon: Search },
  { label: "Riwayat Rekomendasi", href: "/mahasiswa2/riwayat-rekomendasi", icon: BookOpen },
  { label: "Profil", href: "/mahasiswa2/profil", icon: User },
];

export default function SidebarMahasiswa2() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-60 bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-gray-100">
        <Link href="/mahasiswa2/dashboard" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <img src="/logo.png" alt="Sinara" className="h-8 w-8 object-contain" />
          <span>Sinara</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {sidebarLinks.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                ${isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
            >
              <Icon size={18} className={isActive ? "text-blue-600" : "text-gray-400"} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Back to Public */}
      <div className="px-3 py-4 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
        >
          <ArrowLeft size={18} />
          Kembali ke Beranda
        </Link>
      </div>
    </aside>
  );
}