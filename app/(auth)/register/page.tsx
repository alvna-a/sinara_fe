"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiPost } from "@/services/api";

type Role = "calon" | "alumni";
type Step = 1 | 2;

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role>("calon");

  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [kelas, setKelas] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { label: "Isi data diri dan identitas akun" },
    { label: "Lengkapi profil akademik mahasiswa" },
    { label: "Mulai jelajahi SINARA" },
  ];

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiPost("/register", {
        name,
        nim,
        email,
        password,
        role,
        phone,
        kelas,
        angkatan,
      });

      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("user", JSON.stringify(res.user));
        router.push(role === "calon" ? "/calon/dashboard" : "/alumni/dashboard");
      } else {
        setError(res.message || "Registrasi gagal. Silakan coba lagi.");
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push(role === "calon" ? "/calon/dashboard" : "/alumni/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">

        {/* Left Panel */}
        <div className="bg-indigo-600 text-white px-8 py-10 md:w-2/5 flex flex-col justify-between gap-8">
          <div>
            <h1 className="text-2xl font-bold leading-snug mb-3">
              Mulai perjalanan karier magangmu di sini.
            </h1>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Buat akun untuk mendapatkan rekomendasi divisi magang yang paling sesuai dengan skill dan minat yang kamu miliki.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {steps.map((s, i) => {
              const stepNum = (i + 1) as Step;
              const isDone = step > stepNum;
              const isCurrent = step === stepNum;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                    isCurrent
                      ? "bg-white/20 border-white/60"
                      : isDone
                      ? "bg-white/10 border-white/20"
                      : "bg-white/5 border-white/10 opacity-50"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isDone
                        ? "bg-green-400 text-white"
                        : isCurrent
                        ? "bg-white text-indigo-600"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    {isDone ? "✓" : stepNum}
                  </div>
                  <p className="text-white text-sm">{s.label}</p>
                </div>
              );
            })}
          </div>

          <p className="text-indigo-300 text-xs">
            © 2026 SINARA · Politeknik Negeri Semarang
          </p>
        </div>

        {/* Right Panel */}
        <div className="flex-1 px-8 py-10 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">

            <div className="flex items-center gap-2 mb-4">
              {step === 2 && (
                <button
                  type="button"
                  aria-label="Kembali ke Step 1"
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-indigo-100 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-indigo-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              )}
              <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Step {step} dari 2
              </span>
            </div>

            {step === 1 ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Daftar Sekarang</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Lengkapi formulir di bawah ini untuk membuat akun baru di SINARA.
                </p>

                <div className="flex gap-2 mb-2 p-1 bg-gray-100 rounded-xl">
                  {([["calon", "Akan Magang"], ["alumni", "Sudah Magang"]] as [Role, string][]).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setRole(val)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        role === val
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mb-5">
                  {role === "calon"
                    ? "Mencari rekomendasi divisi magang terbaik."
                    : "Melihat riwayat penempatan magang kamu."}
                </p>

                <form onSubmit={handleStep1} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap sesuai KTM"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">NIM</label>
                      <input
                        type="text"
                        placeholder="Masukkan NIM"
                        value={nim}
                        onChange={(e) => setNim(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">Email Universitas</label>
                      <input
                        type="email"
                        placeholder="nama@student.ac.id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <input
                        type="password"
                        placeholder="Buat kata sandi"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
                      <input
                        type="password"
                        placeholder="Ulangi kata sandi"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 mt-2"
                  >
                    Daftar Akun →
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-500">Sudah memiliki akun?</p>
                  <Link href="/login" className="text-sm font-medium text-indigo-600 hover:underline">
                    Masuk sekarang
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Lengkapi Data Diri</h2>
                <p className="text-gray-500 text-sm mb-5">
                  Tambahkan informasi akademik untuk membantu kami memberikan detail yang lebih baik.
                </p>

                <div className="flex gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-6">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5 font-bold">i</div>
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    Data ini bersifat optional namun sangat disarankan untuk diisi agar kami dapat menyesuaikan data yang lebih personal.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleStep2} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Nomor Telephone</label>
                    <input
                      type="tel"
                      placeholder="Contoh : 08987654321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">Kelas</label>
                      <input
                        type="text"
                        placeholder="Contoh : IK-3C"
                        value={kelas}
                        onChange={(e) => setKelas(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">Tahun Angkatan</label>
                      <select
                        value={angkatan}
                        onChange={(e) => setAngkatan(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none bg-white"
                      >
                        <option value="">Pilih Tahun Angkatan</option>
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {loading ? "Menyimpan..." : "Lanjut →"}
                  </button>
                </form>

                <button
                  onClick={handleSkip}
                  className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-4 transition"
                >
                  Lewati Langkah ini
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}