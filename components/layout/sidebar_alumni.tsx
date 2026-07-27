"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, History, User, ArrowLeft, Menu, X } from "lucide-react";
import { useSidebar } from "@/components/layout/sidebar_context";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard_alumni", icon: LayoutDashboard },
  { label: "Input Feedback", href: "/input_feedback", icon: ClipboardList },
  { label: "Riwayat Feedback", href: "/riwayat_feedback", icon: History },
  { label: "Profil", href: "/profil_alumni", icon: User },
];

export default function SidebarAlumni() {
  const pathname = usePathname();
  const { desktopOpen, setDesktopOpen, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      <button
        aria-label="Toggle menu"
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-sm border border-gray-100"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {!desktopOpen && (
        <button
          aria-label="Buka sidebar"
          className="hidden md:flex fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-sm border border-gray-100"
          onClick={() => setDesktopOpen(true)}
        >
          <Menu size={20} />
        </button>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`h-screen w-60 bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-40 transition-transform duration-200
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${desktopOpen ? "md:translate-x-0" : "md:-translate-x-full"}`}
      >
        <div className="px-5 h-16 flex items-center justify-between border-b border-gray-100">
          <Link href="/dashboard_alumni" className="flex items-center gap-2 font-bold text-xl text-blue-600">
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

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {sidebarLinks.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <Icon size={18} className={isActive ? "text-blue-600" : "text-gray-400"} />
                {label}
              </Link>
            );
          })}
        </nav>

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