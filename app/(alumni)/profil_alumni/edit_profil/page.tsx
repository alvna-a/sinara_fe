"use client";
// app/(alumni)/profil_alumni/edit_profil/page.tsx
// Endpoint:
//   PUT  /api/account → update name & email  (via saveAccount hook)
//   POST /api/profile → update phone, kelas, tahun_angkatan, photo (via saveProfile hook)
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Camera, ArrowLeft, Upload, X } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
// NOTE: SidebarAlumni DIHAPUS. app/(alumni)/layout.tsx sudah render
// SidebarAlumni + DashboardHeader + DashboardMain buat semua halaman alumni.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Status badge ───────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; className: string }> = {
  "Belum Magang": {
    label: "Belum Magang",
    className:
      "bg-amber-400 text-white text-xs font-semibold px-3 py-1 rounded-full",
  },
  "Sedang Magang": {
    label: "Sedang Magang",
    className:
      "bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full",
  },
  "Selesai Magang": {
    label: "Selesai Magang",
    className:
      "bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full",
  },
};

// ─── Input Field (dengan opsi readOnly buat NIM) ────────────────────────────
function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  showToggle = false,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  showToggle?: boolean;
  readOnly?: boolean;
}) {
  const [show, setShow] = useState(false);
  const inputType = showToggle ? (show ? "text" : "password") : type;
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border rounded-lg px-3 py-1.5 text-sm outline-none transition-all ${
            readOnly
              ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
              : "border-gray-200 text-gray-800 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          } ${showToggle ? "pr-10" : ""}`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Photo Upload ────────────────────────────────────────────────────────────
function PhotoUpload({
  currentPhoto,
  nama,
  onPhotoChange,
}: {
  currentPhoto: string | null;
  nama: string;
  onPhotoChange: (file: File | null, preview: string | null) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentPhoto);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(currentPhoto);
  }, [currentPhoto]);

  const handleFile = (file: File) => {
    setError(null);
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError("Format tidak didukung. Gunakan JPG, JPEG, atau PNG.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto melebihi batas maksimal 2 MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    onPhotoChange(file, url);
  };
  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onPhotoChange(null, null);
    if (fileRef.current) fileRef.current.value = "";
  };
  const initials = (nama || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative group">
        <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-indigo-100">
          {preview ? (
            <img
              src={preview}
              alt="Foto profil"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{initials}</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Camera size={20} className="text-white" />
        </button>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition shadow"
          >
            <X size={10} />
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold border border-indigo-200 rounded-lg px-3 py-1 hover:bg-indigo-50 transition"
      >
        <Upload size={11} /> Unggah Foto
      </button>
      <p className="text-[10px] text-gray-400 text-center">
        Format: JPG, JPEG, PNG ·{" "}
        <span className="font-semibold text-gray-500">Maks. 2 MB</span>
      </p>
      {error && (
        <div className="flex items-start gap-1 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5 w-full max-w-xs">
          <span className="text-red-500 shrink-0 text-xs">⚠</span>
          <p className="text-[11px] text-red-600 font-medium leading-snug">
            {error}
          </p>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function EditSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4 w-full max-w-2xl mx-auto">
      <div className="h-20 w-20 rounded-full bg-gray-200 self-center" />
      <div className="h-64 bg-white rounded-2xl border border-gray-100" />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EditProfilAlumniPage() {
  const router = useRouter();
  const { profile, loading, isSaving, saveProfile, saveAccount } = useProfile();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [kelas, setKelas] = useState("");
  const [tahunAngkatan, setTahunAngkatan] = useState("");
  const [phone, setPhone] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Password (belum ada endpoint ganti password di backend — lihat catatan di bawah)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Isi form dari data database setelah hook selesai fetch
  useEffect(() => {
    if (profile && !loading) {
      setNama(profile.name ?? "");
      setEmail(profile.email ?? "");
      setKelas(profile.kelas ?? "");
      setTahunAngkatan(
        profile.tahun_angkatan ? String(profile.tahun_angkatan) : "",
      );
      setPhone(profile.phone ?? "");
      if (!photoFile) setPhotoPreview(profile.photo ?? null);
    }
  }, [profile, loading]);

  const handleSaveInfo = async () => {
    if (!nama.trim()) {
      setErrorMessage("Nama lengkap tidak boleh kosong.");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Email tidak boleh kosong.");
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await saveAccount({ name: nama, email });
      await saveProfile({
        phone,
        kelas,
        tahun_angkatan: tahunAngkatan || undefined,
        photoFile,
      });
      setSuccessMessage("Profil berhasil diperbarui!");
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
      // TODO: endpoint ini belum ada di backend — lihat catatan di bawah
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
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Gagal memperbarui password.",
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (loading) {
    return <EditSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto">
      <button
        onClick={() => router.push("/profil_alumni")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition font-medium w-fit"
      >
        <ArrowLeft size={15} /> Kembali ke Profil
      </button>

      {successMessage && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
          <p className="text-xs sm:text-sm font-medium text-emerald-700">
            {successMessage}
          </p>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-emerald-600 hover:text-emerald-700"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          <p className="text-xs sm:text-sm font-medium text-red-700">
            {errorMessage}
          </p>
          <button
            onClick={() => setErrorMessage("")}
            className="text-red-600 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header foto */}
        <div className="flex flex-col items-center gap-2 py-6 px-6 border-b border-gray-100 bg-gradient-to-b from-indigo-50/50 to-white">
          <PhotoUpload
            currentPhoto={photoPreview}
            nama={nama}
            onPhotoChange={(f, p) => {
              setPhotoFile(f);
              setPhotoPreview(p);
            }}
          />
          <p className="text-sm font-bold text-gray-900 mt-0.5">{nama}</p>
          <span
            className={
              statusConfig[profile.status_magang ?? "Belum Magang"].className
            }
          >
            {profile.status_magang ?? "Belum Magang"}
          </span>
        </div>

        <div className="px-6 py-3 flex flex-col gap-0">
          {/* ── Informasi Akun ── */}
          <section className="flex flex-col gap-2.5 pb-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-l-4 border-indigo-500 pl-2.5">
              Informasi Akun
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <InputField
                label="Nama Lengkap"
                value={nama}
                onChange={setNama}
              />
              {/* NIM tetap dikunci — dipakai buat login, gak boleh diubah dari sini */}
              <InputField
                label="NIM Mahasiswa"
                value={profile.nim ?? ""}
                readOnly
              />
              <InputField
                label="Kelas"
                value={kelas}
                onChange={setKelas}
                placeholder="Contoh: IK-3C"
              />
              <InputField
                label="Tahun Angkatan"
                value={tahunAngkatan}
                onChange={setTahunAngkatan}
                type="number"
                placeholder="Contoh: 2022"
              />
              <div className="col-span-2">
                <InputField
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  type="email"
                />
              </div>
              <div className="col-span-2">
                <InputField
                  label="No. HP (Opsional)"
                  value={phone}
                  onChange={setPhone}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>
            <button
              onClick={handleSaveInfo}
              disabled={isSaving}
              className="self-start bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : "Simpan perubahan"}
            </button>
          </section>

          <hr className="border-gray-100" />

          {/* ── Ganti Password ── */}
          <section className="flex flex-col gap-2.5 pt-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-l-4 border-indigo-500 pl-2.5">
              Ganti Password
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <InputField
                label="Password Lama"
                value={oldPassword}
                onChange={setOldPassword}
                placeholder="Masukkan password lama"
                showToggle
              />
              <InputField
                label="Password Baru"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="Masukkan password baru"
                showToggle
              />
              <InputField
                label="Konfirmasi Password Baru"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Ulangi password baru"
                showToggle
              />
            </div>
            {passwordError && (
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                <span className="text-red-500 text-xs">⚠</span>
                <p className="text-xs text-red-600 font-medium">
                  {passwordError}
                </p>
              </div>
            )}
            {passwordSuccess && (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                <span className="text-emerald-500 text-xs">✓</span>
                <p className="text-xs text-emerald-700 font-medium">
                  Password berhasil diperbarui.
                </p>
              </div>
            )}
            <button
              onClick={handleSavePassword}
              disabled={isSavingPassword}
              className="self-start bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              {isSavingPassword ? "Menyimpan..." : "Perbarui password"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}