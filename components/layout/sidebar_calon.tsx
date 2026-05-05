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
  { label: "Dashboard",           href: "/dashboard_calon",       icon: LayoutDashboard },
  { label: "Cari Rekomendasi",    href: "/cari_rekomendasi",      icon: Search },
  { label: "Riwayat Rekomendasi", href: "/riwayat_rekomendasi",   icon: BookOpen },
  { label: "Profil",              href: "/profil_calon",          icon: User },
];

export default function SidebarCalon() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} className="text-gray-600" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        min-h-screen w-60 bg-white border-r border-gray-100 flex-col fixed left-0 top-0 z-50
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:flex md:fixed md:z-40
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={closeMobileMenu}
          className="md:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="px-5 h-16 flex items-center border-b border-gray-100">
          <Link href="/dashboard_calon" className="flex items-center gap-2 font-bold text-xl text-blue-600" onClick={closeMobileMenu}>
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
                onClick={closeMobileMenu}
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
            onClick={closeMobileMenu}
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