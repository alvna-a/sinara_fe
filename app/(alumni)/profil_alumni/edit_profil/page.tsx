"use client";
// app/(alumni)/profil_alumni/edit_profil/page.tsx
// Endpoint (sama seperti sebelumnya, TIDAK berubah):
//   PUT  /api/account → update name & email  (via saveAccount hook)
//   POST /api/profile → update phone, kelas, tahun_angkatan, photo (via saveProfile hook)
// Desain disamakan dengan app/(calon)/profil_calon/edit_profil/page.tsx.

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Save, Camera, X, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

// NOTE: SidebarAlumni DIHAPUS. app/(alumni)/layout.tsx sudah render
// SidebarAlumni + DashboardHeader + DashboardMain buat semua halaman alumni.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Types ──────────────────────────────────────────────────────────────────────
interface EditableFields {
  name: string;
  email: string;
  phone: string;
  kelas: string;
  tahun_angkatan: string;
}

// ─── Avatar ─────────────────────────────────────────────────────────────────────
function Avatar({ photo, nama }: { photo: string | null; nama: string }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={nama}
        className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-100"
      />
    );
  }
  const initials = (nama || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center ring-4 ring-indigo-100">
      <span className="text-white text-3xl font-bold">{initials}</span>
    </div>
  );
}

// ─── Input biasa (termasuk read-only) ───────────────────────────────────────────
function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  readOnly = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  const baseClass =
    "px-3 sm:px-4 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all w-full bg-white";
  const readOnlyClass =
    "px-3 sm:px-4 py-2 border border-gray-100 rounded-xl text-xs sm:text-sm bg-gray-50 text-gray-400 w-full cursor-not-allowed";
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs sm:text-sm font-semibold text-gray-700">
        {label}{" "}
        {required && !readOnly && <span className="text-red-500">*</span>}
      </label>
      {readOnly ? (
        <input type={type} value={value} readOnly className={readOnlyClass} />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
    </div>
  );
}

// ─── Input password dengan toggle ───────────────────────────────────────────────
function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs sm:text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="px-3 sm:px-4 py-2 pr-10 border border-gray-200 rounded-xl text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all w-full bg-white"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

// ─── Loading skeleton ────────────────────────────────────────────────────────────
function EditSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4 sm:gap-5 w-full">
      <div className="h-40 bg-white rounded-2xl border border-gray-100" />
      <div className="h-72 bg-white rounded-2xl border border-gray-100" />
      <div className="h-56 bg-white rounded-2xl border border-gray-100" />
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function EditProfilAlumniPage() {
  const router = useRouter();
  const { profile, loading, isSaving, saveProfile, saveAccount } = useProfile();

  const [formData, setFormData] = useState<EditableFields>({
    name: "",
    email: "",
    phone: "",
    kelas: "",
    tahun_angkatan: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // Isi form dari data database setelah hook selesai fetch
  useEffect(() => {
    if (profile && !loading) {
      setFormData({
        name: profile.name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        kelas: profile.kelas ?? "",
        tahun_angkatan: profile.tahun_angkatan
          ? String(profile.tahun_angkatan)
          : "",
      });
      if (!photoFile) {
        setPhotoPreview(profile.photo ?? null);
      }
    }
  }, [profile, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setErrorMessage("Format tidak didukung. Gunakan JPG, JPEG, atau PNG.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    if (errorMessage) setErrorMessage("");
  };

  // Simpan perubahan profil → PUT /api/account (nama, email) + POST /api/profile (sisanya)
  const handleSave = async () => {
    if (!formData.name.trim()) {
      setErrorMessage("Nama lengkap tidak boleh kosong.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email tidak boleh kosong.");
      return;
    }
    setErrorMessage("");
    try {
      await saveAccount({
        name: formData.name,
        email: formData.email,
      });
      await saveProfile({
        phone: formData.phone,
        kelas: formData.kelas,
        tahun_angkatan: formData.tahun_angkatan || undefined,
        photoFile: photoFile,
      });
      setSuccessMessage("Profil berhasil diperbarui!");
      setTimeout(() => router.push("/profil_alumni"), 1200);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan.",
      );
    }
  };

  const handleSavePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Semua field password harus diisi.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok.");
      return;
    }
    setIsSavingPassword(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: oldPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.message ?? "Gagal memperbarui password.");
      }
      setPasswordSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Gagal memperbarui password.",
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <EditSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full max-w-7xl mx-auto">
      {/* Sub-header: back + judul */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
        <Link
          href="/profil_alumni"
          className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 bg-white border border-gray-100 shadow-sm"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Edit Profil
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Perbarui informasi profil dan data kontak Anda
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 sm:p-4 flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium text-emerald-700">
            {successMessage}
          </p>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-emerald-600 hover:text-emerald-700 flex-shrink-0 ml-3"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 sm:p-4 flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium text-red-700">
            {errorMessage}
          </p>
          <button
            onClick={() => setErrorMessage("")}
            className="text-red-600 hover:text-red-700 flex-shrink-0 ml-3"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ── Card Foto Profil ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
          Foto Profil
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <Avatar photo={photoPreview} nama={profile.name || "A"} />
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors w-fit">
              <Camera size={18} className="text-indigo-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">
                Ubah Foto
              </span>
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500">
              Format: JPG, JPEG, PNG. Ukuran maksimal: 5MB
            </p>
          </div>
        </div>
      </div>

      {/* ── Card Informasi Pribadi ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
          Informasi Pribadi
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <InputField
            label="Nama Lengkap"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          {/* NIM tetap dikunci — dipakai buat login, gak boleh diubah dari sini */}
          <InputField
            label="NIM"
            name="nim"
            value={profile.nim ?? ""}
            readOnly
          />
          <InputField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            type="email"
            required
          />
          <InputField
            label="Kelas"
            name="kelas"
            value={formData.kelas}
            onChange={handleInputChange}
            placeholder="Contoh: IK-3C"
          />
          <InputField
            label="Tahun Angkatan"
            name="tahun_angkatan"
            value={formData.tahun_angkatan}
            onChange={handleInputChange}
            type="number"
            placeholder="Contoh: 2022"
          />
          <InputField
            label="No. HP"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            type="tel"
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
          <button
            onClick={() => router.push("/profil_alumni")}
            disabled={isSaving}
            className="px-4 sm:px-6 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 order-2 sm:order-1"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 order-1 sm:order-2"
          >
            <Save size={16} />
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      {/* ── Card Ganti Password ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
          Ganti Password
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          <PasswordField
            label="Password Lama"
            value={oldPassword}
            onChange={setOldPassword}
            placeholder="Masukkan password lama"
            show={showOld}
            onToggle={() => setShowOld((s) => !s)}
          />
          <PasswordField
            label="Password Baru"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Masukkan password baru"
            show={showNew}
            onToggle={() => setShowNew((s) => !s)}
          />
          <PasswordField
            label="Konfirmasi Password Baru"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Ulangi password baru"
            show={showConfirm}
            onToggle={() => setShowConfirm((s) => !s)}
          />
        </div>
        {passwordError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            <p className="text-xs sm:text-sm font-medium text-red-700">
              {passwordError}
            </p>
          </div>
        )}
        {passwordSuccess && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
            <p className="text-xs sm:text-sm font-medium text-emerald-700">
              ✓ Password berhasil diperbarui!
            </p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
          <button
            onClick={handleSavePassword}
            disabled={isSavingPassword}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            <Save size={16} />
            {isSavingPassword ? "Menyimpan..." : "Perbarui Password"}
          </button>
        </div>
      </div>
    </div>
  );
}