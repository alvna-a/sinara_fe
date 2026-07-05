"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ROLE_REDIRECT } from "@/app/constants/auth";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Perusahaan", href: "/perusahaan" },
  { label: "Panduan", href: "/panduan" },
];

export default function PublicNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<{
    name: string;
    role: string;
  } | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const raw = localStorage.getItem("user");

    if (token && raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Sinara"
            className="h-8 w-8 object-contain"
          />
          <span className="font-semibold text-xl text-indigo-600">
            Sinara
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-indigo-600 font-semibold"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => router.push(ROLE_REDIRECT[user.role])}
                className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center hover:bg-indigo-200 transition"
                title={user.name}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>

              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-red-500"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-indigo-600"
              >
                Masuk
              </Link>

              <Link
                href="/register"
                className="px-5 py-2 rounded-full text-white text-sm font-medium hover:opacity-90 transition"
                style={{
                  background:
                    "linear-gradient(135deg,#6366f1 0%,#38bdf8 100%)",
                }}
              >
                Daftar Sekarang
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {mobileMenuOpen ? (
            <X size={26} />
          ) : (
            <Menu size={26} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="flex flex-col">

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-5 py-4 transition ${
                  pathname === link.href
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t mt-2 pt-2 pb-4 px-5">

              {user ? (
                <>
                  <button
                    onClick={() => {
                      router.push(ROLE_REDIRECT[user.role]);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-3 text-gray-700 hover:text-indigo-600"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-3 text-red-500"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-gray-700 hover:text-indigo-600"
                  >
                    Masuk
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block mt-2 text-center rounded-xl py-3 text-white font-medium"
                    style={{
                      background:
                        "linear-gradient(135deg,#6366f1 0%,#38bdf8 100%)",
                    }}
                  >
                    Daftar Sekarang
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}