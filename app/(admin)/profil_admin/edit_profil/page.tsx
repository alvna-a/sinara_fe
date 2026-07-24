"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Camera, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// NOTE: SidebarAdmin DIHAPUS. app/(admin)/layout.tsx sudah render
// SidebarAdmin + DashboardHeader + DashboardMain buat semua halaman admin.

// ─── Types ──────────────────────────────────────────────────────────────────
interface FormData {
  nama: string;
  email: string;
  phone: string;
  photo: string | null;
  photoFile: File | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function Avatar({ photo, nama }: { photo: string | null; nama: string }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={nama}
        className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100"
      />
    );
  }
  const initials = nama
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center ring-4 ring-blue-100">
      <span className="text-white text-3xl font-bold">{initials}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EditProfilAdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    email: "",
    phone: "",
    photo: null,
    photoFile: null,
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ─── Fetch data awal dari API ─────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      fetch(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(async ([resMe, resProfile]) => {
        if (!resMe.ok) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }
        const user = await resMe.json();
        const profileJson = resProfile.ok
          ? await resProfile.json()
          : { data: {} };
        const profileData =
          profileJson?.data?.profile ?? profileJson?.data ?? {};

        setFormData({
          nama: user.name ?? "",
          email: user.email ?? "",
          phone: profileData?.phone ?? "",
          photo: profileData?.photo
            ? `${API_URL}/storage/${profileData.photo}`
            : null,
          photoFile: null,
        });
      })
      .catch((err) => {
        console.error("Gagal load profil:", err);
        setErrorMessage("Gagal memuat data profil.");
      })
      .finally(() => setLoading(false));
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Ukuran file terlalu besar. Maksimal 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        photo: event.target?.result as string,
        photoFile: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    // Validasi
    if (!formData.nama.trim()) {
      setErrorMessage("Nama lengkap tidak boleh kosong");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email tidak boleh kosong");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("No. HP tidak boleh kosong");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    try {
      // 1. Update nama & email → PUT /api/account
      const resAccount = await fetch(`${API_URL}/api/account`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.nama,
          email: formData.email,
        }),
      });
      if (!resAccount.ok) {
        const errJson = await resAccount.json().catch(() => ({}));
        throw new Error(errJson?.message ?? "Gagal memperbarui nama/email");
      }

      // 2. Update phone & foto → POST /api/profile (FormData)
      const body = new FormData();
      body.append("phone", formData.phone);
      if (formData.photoFile) {
        body.append("photo", formData.photoFile);
      }
      const resProfile = await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      if (!resProfile.ok) {
        const errJson = await resProfile.json().catch(() => ({}));
        throw new Error(errJson?.message ?? "Gagal memperbarui profil");
      }

      // 3. Kasih tahu halaman profil untuk re-fetch
      window.dispatchEvent(new Event("sinaraProfileUpdated"));
      setSuccessMessage("Profil berhasil diperbarui!");
      setTimeout(() => {
        router.push("/profil_admin");
      }, 1200);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan";
      setErrorMessage(msg);
      console.error("Error saving profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="animate-pulse flex flex-col gap-4 w-full max-w-2xl">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-40 bg-white rounded-2xl border border-gray-100" />
        <div className="h-64 bg-white rounded-2xl border border-gray-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full max-w-7xl mx-auto">
      {/* Sub-header: back + judul (fungsional, bukan duplikat top navbar) */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
        <Link
          href="/profil_admin"
          className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 bg-white border border-gray-100 shadow-sm"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Edit Profil Admin
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Perbarui informasi profil dan data kontak Anda
          </p>
        </div>
      </div>

      {/* Success */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 sm:p-4 flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium text-emerald-700">
            {successMessage}
          </p>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-emerald-600 hover:text-emerald-700 flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Error */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 sm:p-4 flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium text-red-700">
            {errorMessage}
          </p>
          <button
            onClick={() => setErrorMessage("")}
            className="text-red-600 hover:text-red-700 flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Foto */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
          Foto Profil
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <Avatar photo={formData.photo} nama={formData.nama || "A"} />
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors w-fit">
              <Camera size={18} className="text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">
                Ubah Foto
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500">
              Format: JPG, PNG. Ukuran maksimal: 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
          Informasi Pribadi
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Nama */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">
              Nama Lengkap *
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              className="px-3 sm:px-4 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="px-3 sm:px-4 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Masukkan email"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">
              No. HP *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="px-3 sm:px-4 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Masukkan nomor HP"
            />
          </div>
        </div>
      </div>

      {/* Tombol aksi */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          onClick={() => router.push("/profil_admin")}
          disabled={isSaving}
          className="px-4 sm:px-6 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 order-2 sm:order-1"
        >
          Batal
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 order-1 sm:order-2"
        >
          <Save size={16} />
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}