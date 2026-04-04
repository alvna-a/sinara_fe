"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Building2,
  Users,
  User,
  ArrowLeft,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Review Feedback", href: "/admin/review-feedback", icon: ClipboardCheck },
  { label: "Kelola Perusahaan", href: "/admin/perusahaan", icon: Building2 },
  { label: "Data Mahasiswa", href: "/admin/mahasiswa", icon: Users },
  { label: "Profil", href: "/admin/profil", icon: User },
];

export default function SidebarAdmin() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-60 bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-40">
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