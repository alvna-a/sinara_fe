"use client";

import { useState, useRef } from "react";
import { Pencil, Eye, EyeOff, Camera, ArrowLeft, Upload, X } from "lucide-react";
import SidebarCalon from "@/components/layout/sidebar_calon";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserProfile {
  nim: string;
  nama: string;
  program_studi: string;
  semester: number;
  kelas: string;
  tahun_angkatan: number;
  email: string;
  phone: string;
  photo: string | null;
  status_magang: "Belum Magang" | "Sedang Magang" | "Selesai Magang";
  kelengkapan_profil: number;
}

const mockProfile: UserProfile = {
  nim: "3.34.22.1.01",
  nama: "Arjuna Wiguna",
  program_studi: "D3 - Teknik Informatika",
  semester: 4,
  kelas: "IK - 3B",
  tahun_angkatan: 2022,
  email: "arjuna.33422101@mhs.polines.ac.id",
  phone: "08987654321",
  photo: null,
  status_magang: "Belum Magang",
  kelengkapan_profil: 80,
};

const statusConfig: Record<
  UserProfile["status_magang"],
  { label: string; className: string }
> = {
  "Belum Magang": {
    label: "Belum Magang",
    className: "bg-amber-400 text-white text-xs font-semibold px-3 py-1 rounded-full",
  },
  "Sedang Magang": {
    label: "Sedang Magang",
    className: "bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full",
  },
  "Selesai Magang": {
    label: "Selesai Magang",
    className: "bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full",
  },
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ photo, nama, size = "md" }: { photo: string | null; nama: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "w-20 h-20" : size === "sm" ? "w-9 h-9" : "w-16 h-16";
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-xs" : "text-xl";
  const ring = size === "sm" ? "ring-2 ring-indigo-100" : "ring-4 ring-indigo-100";
  const initials = nama.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  if (photo) return <img src={photo} alt={nama} className={`${dim} rounded-full object-cover ${ring}`} />;
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center ${ring}`}>
      <span className={`text-white font-bold ${text}`}>{initials}</span>
    </div>
  );
}

// ─── Completion Bar ───────────────────────────────────────────────────────────
function ProfileCompletionBar({ value }: { value: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-3.5 flex items-center gap-4">
      <span className="text-sm font-medium text-gray-600 shrink-0">Status kelengkapan profil anda</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700" style={{ width: `${value}%` }} />
      </div>
      <span className="text-indigo-600 font-bold text-sm w-10 text-right shrink-0">{value}%</span>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-gray-800 font-medium break-all">{value}</span>
    </div>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({
  label, value, onChange, type = "text", placeholder, showToggle = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; showToggle?: boolean;
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
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all ${showToggle ? "pr-10" : ""}`}
        />
        {showToggle && (
          <button type="button" onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Photo Upload ─────────────────────────────────────────────────────────────
function PhotoUpload({ currentPhoto, nama, onPhotoChange }: {
  currentPhoto: string | null; nama: string;
  onPhotoChange: (file: File | null, preview: string | null) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentPhoto);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError("Format tidak didukung. Gunakan JPG, JPEG, atau PNG."); return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto melebihi batas maksimal 2 MB."); return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    onPhotoChange(file, url);
  };

  const handleRemove = () => {
    setPreview(null); setError(null);
    onPhotoChange(null, null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const initials = nama.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative group">
        <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-indigo-100">
          {preview
            ? <img src={preview} alt="Foto profil" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{initials}</span>
              </div>
          }
        </div>
        <button type="button" onClick={() => fileRef.current?.click()}
          className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Camera size={20} className="text-white" />
        </button>
        {preview && (
          <button type="button" onClick={handleRemove}
            className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition shadow">
            <X size={10} />
          </button>
        )}
      </div>

      <button type="button" onClick={() => fileRef.current?.click()}
        className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold border border-indigo-200 rounded-lg px-3 py-1 hover:bg-indigo-50 transition">
        <Upload size={11} /> Unggah Foto
      </button>
      <p className="text-[10px] text-gray-400 text-center">
        Format: JPG, JPEG, PNG · <span className="font-semibold text-gray-500">Maks. 2 MB</span>
      </p>
      {error && (
        <div className="flex items-start gap-1 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5 w-full max-w-xs">
          <span className="text-red-500 shrink-0 text-xs">⚠</span>
          <p className="text-[11px] text-red-600 font-medium leading-snug">{error}</p>
        </div>
      )}
      <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

// ─── Edit Profile View ────────────────────────────────────────────────────────
function EditProfileView({ profile, onBack, onSave }: {
  profile: UserProfile;
  onBack: () => void;
  onSave: (updated: Partial<UserProfile> & { photoFile?: File | null }) => void;
}) {
  const [nama, setNama] = useState(profile.nama);
  const [nim, setNim] = useState(profile.nim);
  const [kelas, setKelas] = useState(profile.kelas);
  const [tahunAngkatan, setTahunAngkatan] = useState(String(profile.tahun_angkatan));
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile.photo);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveInfo = () => {
    onSave({ nama, nim, kelas, tahun_angkatan: Number(tahunAngkatan), email, phone, photo: photoPreview, photoFile });
  };

  const handleSavePassword = () => {
    setPasswordError(null); setPasswordSuccess(false);
    if (!oldPassword || !newPassword || !confirmPassword) { setPasswordError("Semua field password harus diisi."); return; }
    if (newPassword.length < 8) { setPasswordError("Password baru minimal 8 karakter."); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Konfirmasi password tidak cocok."); return; }
    setPasswordSuccess(true);
    setOldPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition font-medium w-fit">
        <ArrowLeft size={15} /> Kembali ke Profil
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header foto */}
        <div className="flex flex-col items-center gap-2 py-6 px-6 border-b border-gray-100 bg-gradient-to-b from-indigo-50/50 to-white">
          <PhotoUpload
            currentPhoto={profile.photo}
            nama={profile.nama}
            onPhotoChange={(f, p) => { setPhotoFile(f); setPhotoPreview(p); }}
          />
          <p className="text-sm font-bold text-gray-900 mt-0.5">{nama}</p>
          <span className={statusConfig[profile.status_magang].className}>{profile.status_magang}</span>
        </div>

        <div className="px-6 py-3 flex flex-col gap-0">
          {/* ── Informasi Akun ── */}
          <section className="flex flex-col gap-2.5 pb-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-l-4 border-indigo-500 pl-2.5">
              Informasi Akun
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <InputField label="Nama Lengkap" value={nama} onChange={setNama} />
              <InputField label="NIM Mahasiswa" value={nim} onChange={setNim} />
              <InputField label="Kelas" value={kelas} onChange={setKelas} />
              <InputField label="Tahun Angkatan" value={tahunAngkatan} onChange={setTahunAngkatan} type="number" />
              <div className="col-span-2">
                <InputField label="Email" value={email} onChange={setEmail} type="email" />
              </div>
              <div className="col-span-2">
                <InputField label="No. HP (Opsional)" value={phone} onChange={setPhone} placeholder="08xxxxxxxxxx" />
              </div>
            </div>
            <button onClick={handleSaveInfo}
              className="self-start bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm">
              Simpan perubahan
            </button>
          </section>

          <hr className="border-gray-100" />

          {/* ── Ganti Password ── */}
          <section className="flex flex-col gap-2.5 pt-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-l-4 border-indigo-500 pl-2.5">
              Ganti Password
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <InputField label="Password Lama" value={oldPassword} onChange={setOldPassword} placeholder="Masukkan password lama" showToggle />
              <InputField label="Password Baru" value={newPassword} onChange={setNewPassword} placeholder="Masukkan password baru" showToggle />
              <InputField label="Konfirmasi Password Baru" value={confirmPassword} onChange={setConfirmPassword} placeholder="Ulangi password baru" showToggle />
            </div>

            {passwordError && (
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                <span className="text-red-500 text-xs">⚠</span>
                <p className="text-xs text-red-600 font-medium">{passwordError}</p>
              </div>
            )}
            {passwordSuccess && (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                <span className="text-emerald-500 text-xs">✓</span>
                <p className="text-xs text-emerald-700 font-medium">Password berhasil diperbarui.</p>
              </div>
            )}

            <button onClick={handleSavePassword}
              className="self-start bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm">
              Perbarui password
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfilCalonPage() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);

  const status = statusConfig[profile.status_magang];

  const handleSave = (updated: Partial<UserProfile> & { photoFile?: File | null }) => {
    const { photoFile, ...rest } = updated;
    setProfile((prev) => ({ ...prev, ...rest }));
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen bg-[#EEF0F8]">
      <SidebarCalon />

      <main className="ml-60 flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-lg font-bold text-gray-900">Profil Mahasiswa</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Halo, <span className="font-semibold text-indigo-600">{profile.nama.split(" ")[0]}</span>
            </span>
            <Avatar photo={profile.photo} nama={profile.nama} size="sm" />
          </div>
        </header>

        {/* Body */}
       <div className="flex-1 px-6 py-6 flex flex-col gap-4 max-w-5xl w-full mx-auto">
          {isEditing ? (
            <EditProfileView profile={profile} onBack={() => setIsEditing(false)} onSave={handleSave} />
          ) : (
            <>
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar photo={profile.photo} nama={profile.nama} size="md" />
                    <div className="flex flex-col gap-1.5">
                      <h2 className="text-xl font-extrabold text-gray-900 leading-tight">{profile.nama}</h2>
                      <p className="text-sm text-gray-500">{profile.program_studi} &nbsp;|&nbsp; Semester {profile.semester}</p>
                      <span className={status.className}>{status.label}</span>
                    </div>
                  </div>
                  <button onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200 shadow-sm shrink-0">
                    <Pencil size={14} /> Edit Profile
                  </button>
                </div>
              </div>

              {/* Completion Bar */}
              <ProfileCompletionBar value={profile.kelengkapan_profil} />

              {/* Detail Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <InfoRow label="NIM Mahasiswa" value={profile.nim} />
                  <InfoRow label="Email" value={profile.email} />
                  <InfoRow label="Kelas" value={profile.kelas} />
                  <InfoRow label="No Hp" value={profile.phone} />
                  <InfoRow label="Tahun Angkatan" value={String(profile.tahun_angkatan)} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="py-3 text-center text-xs text-gray-400 border-t border-gray-100 bg-white">
          © 2026 Sinara. POLINES, TA 2026.
        </footer>
      </main>
    </div>
  );
}