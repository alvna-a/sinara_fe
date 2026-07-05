"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Search,
  BookOpen,
  User,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard",          href: "/dashboard_calon",     icon: LayoutDashboard },
  { label: "Cari Rekomendasi",   href: "/cari_rekomendasi",    icon: Search },
  { label: "Riwayat Rekomendasi",href: "/riwayat_rekomendasi", icon: BookOpen },
  { label: "Profil",             href: "/profil_calon",        icon: User },
];

export default function SidebarCalon() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // drawer mobile
  const [desktopOpen, setDesktopOpen] = useState(true); // sidebar desktop

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop: tombol untuk membuka lagi sidebar saat sedang disembunyikan */}
      {!desktopOpen && (
        <button
          aria-label="Buka sidebar"
          className="hidden md:flex fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
          onClick={() => setDesktopOpen(true)}
        >
          <Menu size={20} />
        </button>
      )}

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`h-screen w-60 bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-40 transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          ${desktopOpen ? "md:translate-x-0" : "md:-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="px-5 h-16 flex items-center justify-between border-b border-gray-100">
          <Link
            href="/dashboard_calon"
            className="flex items-center gap-2 font-bold text-xl text-blue-600"
          >
            <img src="/logo.png" alt="Sinara" className="h-8 w-8 object-contain" />
            <span>Sinara</span>
          </Link>
          <button
            aria-label="Sembunyikan sidebar"
            className="hidden md:flex p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
            onClick={() => setDesktopOpen(false)}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {sidebarLinks.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
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
    </>
  );
}
