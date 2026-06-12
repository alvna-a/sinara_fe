"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROLE_REDIRECT } from "@/app/constants/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Perusahaan", href: "/perusahaan" },
  { label: "Panduan", href: "/panduan" },
];

export default function PublicNavbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const raw = localStorage.getItem("user");
    if (token && raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };
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
          {user ? (
            <>
              <button
                onClick={() => router.push(ROLE_REDIRECT[user.role])}
                className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center hover:bg-indigo-200 transition"
                title={`Dashboard ${user.name}`}
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-red-500 transition"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}