"use client";
// app/(alumni)/profil_alumni/page.tsx
// Terhubung ke: GET /api/me + GET /api/profile (via useProfile hook)
//               POST /api/profile (save)
import { useState, useRef } from "react";
import { Camera, Pencil, Save, X } from "lucide-react";
import { useProfile } from "../../../hooks/useProfile";

interface EditableFields {
  phone: string;
  program_studi: string;
}

export default function ProfilAlumniPage() {
  const { profile, loading, isSaving, saveProfile } = useProfile();

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<EditableFields>({
    phone: "",
    program_studi: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setEditData({ phone: profile.phone, program_studi: profile.program_studi });
    setPhotoFile(null);
    setPhotoPreview(null);
    setSaveError(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setSaveError(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaveError(null);
    try {
      await saveProfile({ ...editData, photoFile });
      setEditing(false);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Gagal menyimpan.");
    }
  };

  const avatarSrc = photoPreview ?? profile.photo;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-indigo-400 text-sm animate-pulse">Memuat profil...</div>
      </div>
    );
  }

  return (
    <>
        <div className="max-w-3xl mx-auto space-y-5 py-6">

          {/* Card Profil */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Data Pribadi</h2>
              {!editing ? (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-2 rounded-xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition"
                >
                  <Pencil size={14} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 transition"
                  >
                    <X size={14} /> Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50"
                  >
                    <Save size={14} />
                    {isSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              )}
            </div>

            {saveError && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
                {saveError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-indigo-100 overflow-hidden flex items-center justify-center">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt="foto profil" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-indigo-400">
                        {profile.name?.charAt(0) ?? "?"}
                      </span>
                    )}
                  </div>
                  {editing && (
                    <>
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow hover:bg-indigo-700 transition"
                      >
                        <Camera size={13} />
                      </button>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpg,image/jpeg,image/png"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Kelengkapan Profil</p>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${profile.kelengkapan_profil}%` }}
                    />
                  </div>
                  <p className="text-xs font-bold text-indigo-600 mt-1">
                    {profile.kelengkapan_profil}%
                  </p>
                </div>
              </div>

              {/* Fields */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {/* Read-only */}
                {[
                  { label: "Nama Lengkap", value: profile.name },
                  { label: "NIM", value: profile.nim },
                  { label: "Email", value: profile.email },
                  { label: "Role", value: "Alumni Magang" },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{f.label}</p>
                    <p className="font-medium text-gray-800">{f.value || <span className="text-gray-400 italic">-</span>}</p>
                  </div>
                ))}

                {/* Editable: No HP */}
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">No. HP</p>
                  {editing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="08xxxxxxxxxx"
                      className="rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">
                      {profile.phone || <span className="text-gray-400 italic">Belum diisi</span>}
                    </p>
                  )}
                </div>

                {/* Editable: Program Studi */}
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Program Studi</p>
                  {editing ? (
                    <select
                      value={editData.program_studi}
                      onChange={(e) => setEditData((p) => ({ ...p, program_studi: e.target.value }))}
                      className="rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                      <option value="">Pilih...</option>
                      {["D3 Teknik Informatika", "D4 Teknik Informatika", "D3 Sistem Informasi"].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium text-gray-800">
                      {profile.program_studi || <span className="text-gray-400 italic">Belum diisi</span>}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info box feedback */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-sm text-indigo-700">
            <p className="font-semibold mb-1">Bagikan Pengalamanmu 🎓</p>
            <p className="text-indigo-600 leading-relaxed">
              Sebagai alumni, pengalaman magang kamu sangat berharga untuk adik-adik yang sedang
              mencari tempat magang. Yuk bagikan melalui menu{" "}
              <strong>Input Feedback</strong>!
            </p>
          </div>

        </div>
    </>
  );
}