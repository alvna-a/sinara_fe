"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  Building2,
  Users,
  User,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard_admin", icon: LayoutDashboard },
  { label: "Review Feedback", href: "/review_feedback", icon: ClipboardCheck },
  { label: "Kelola Perusahaan", href: "/kelola_perusahaan", icon: Building2 },
  { label: "Data Mahasiswa", href: "/data_mahasiswa", icon: Users },
  { label: "Profil", href: "/profil_admin",  icon: User },
];

export default function SidebarAdmin() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Mobile: hamburger button */}
      <button
        aria-label="Toggle menu"
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-sm border border-gray-100"
        onClick={() => setOpen((s) => !s)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop sidebar */}
    <aside className="hidden md:flex h-screen w-60 bg-white border-r border-gray-100 flex-col fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="px-5 h-16 flex items-center border-b border-gray-100">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl text-blue-600">
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
                  }`}>
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200">
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-white h-full shadow-lg">
            <div className="px-5 h-16 flex items-center border-b border-gray-100">
              <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg text-blue-600">
                <img src="/logo.png" alt="Sinara" className="h-7 w-7 object-contain" />
                <span>Sinara</span>
              </Link>
            </div>
            <nav className="px-3 py-4 flex flex-col gap-1 overflow-y-auto">
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
                      }`}>
                    <Icon size={18} className={isActive ? "text-blue-600" : "text-gray-400"} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="px-3 py-4 border-t border-gray-100 mt-auto">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
              >
                <ArrowLeft size={18} />
                Kembali ke Beranda
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}