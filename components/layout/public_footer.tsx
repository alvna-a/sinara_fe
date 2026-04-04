import Link from "next/link";

const footerLinks = [
  { label: "Beranda", href: "/" },
  { label: "Panduan Sistem", href: "/panduan" },
  { label: "Fitur", href: "/#fitur" },
  { label: "Contact", href: "/#contact" },
  { label: "FAQs", href: "/#faqs" },
];

export default function PublicFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto w-full flex justify-center">
      <div className="w-full max-w-5xl px-[24px] md:px-[90px] py-12 flex flex-col items-center text-center gap-6">

        {/* Logo only (no text) */}
        <Link href="/">
          <img src="/logo.png" alt="Sinara" className="h-12 w-12 object-contain mx-auto" />
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
          Sistem rekomendasi divisi magang berbasis analisis kesesuaian skill menggunakan
          pendekatan pemrosesan teks untuk membantu mahasiswa memilih posisi yang paling relevan.
        </p>

        {/* Nav Links - horizontal */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-100" />

        {/* Copyright */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="text-base">©</span>
          <span>2026 Sinara. POLINES, TA 2026.</span>
        </div>
      </div>
    </footer>
  );
}