"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Perusahaan", href: "/perusahaan" },
  { label: "Panduan", href: "/panduan" },
];

export default function PublicNavbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Sinara" className="h-7 w-7 object-contain" />
          <span className="font-semibold text-lg text-indigo-600">
            Sinara
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-indigo-600 font-medium"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-indigo-600 transition"
          >
            Masuk
          </Link>

          <Link
            href="/register"
            className="text-sm font-medium text-white px-5 py-2 rounded-full transition hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)",
            }}
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </nav>
  );
}