"use client";
// app/(calon)/profil_calon/page.tsx
// Terhubung ke: GET /api/me + GET /api/profile (via useProfile hook)
//               POST /api/profile (save)
//               GET /api/skills/user + POST /api/skills/user
import { useState, useRef } from "react";
import { Camera, Pencil, Save, X } from "lucide-react";
import SidebarCalon from "@/components/layout/sidebar_calon";
import DashboardNavbar from "@/components/layout/dashboard_navbar";
import MiniFooter from "@/components/layout/mini_footer";
import { useProfile } from "../../../hooks/useProfile";
import { useUserSkills } from "../../../hooks/useUserSkills";

// ── Types ──────────────────────────────────────────────────────────────────────
interface EditableFields {
  phone: string;
  program_studi: string;
  semester: string;
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function InfoRow({
  label,
  value,
  editing,
  name,
  onChange,
  placeholder,
  type = "text",
  options,
}: {
  label: string;
  value: string;
  editing: boolean;
  name: keyof EditableFields;
  onChange: (name: keyof EditableFields, val: string) => void;
  placeholder?: string;
  type?: string;
  options?: string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      {editing ? (
        options ? (
          <select
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            className="rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Pilih...</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            className="rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        )
      ) : (
        <p className="text-sm font-medium text-gray-800">
          {value || <span className="text-gray-400 italic">Belum diisi</span>}
        </p>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ProfilCalonPage() {
  const { profile, loading, isSaving, saveProfile } = useProfile();
  const { skills, allSkills, saveSkills, loadingSkills } = useUserSkills();

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<EditableFields>({
    phone: "",
    program_studi: "",
    semester: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [editingSkills, setEditingSkills] = useState(false);
  const [draftSkills, setDraftSkills] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setEditData({
      phone: profile.phone,
      program_studi: profile.program_studi,
      semester: profile.semester,
    });
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

  const handleFieldChange = (name: keyof EditableFields, val: string) => {
    setEditData((prev) => ({ ...prev, [name]: val }));
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
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Gagal menyimpan.");
    }
  };

  // Skills
  const startEditSkills = () => {
    setDraftSkills([...skills]);
    setSkillInput("");
    setEditingSkills(true);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || draftSkills.includes(trimmed)) return;
    setDraftSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (s: string) => {
    setDraftSkills((prev) => prev.filter((x) => x !== s));
  };

  const saveSkillsHandler = async () => {
    await saveSkills(draftSkills);
    setEditingSkills(false);
  };

  const avatarSrc = photoPreview ?? profile.photo;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center">
        <div className="text-indigo-400 text-sm animate-pulse">Memuat profil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      <SidebarCalon />
      <DashboardNavbar pageTitle="Profil Saya" userName={profile.name} userRole="calon" />
      <main className="md:ml-60 pt-16 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-3xl mx-auto space-y-5 py-6">

          {/* ── Card Profil ─────────────────────────────────────────────── */}
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
                    className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
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
                      <img
                        src={avatarSrc}
                        alt="foto profil"
                        className="w-full h-full object-cover"
                      />
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
                {/* Progress kelengkapan */}
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
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Lengkap</p>
                  <p className="text-sm font-medium text-gray-800">{profile.name}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">NIM</p>
                  <p className="text-sm font-medium text-gray-800">{profile.nim}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-gray-800">{profile.email}</p>
                </div>
                <InfoRow
                  label="No. HP"
                  value={editData.phone || profile.phone}
                  editing={editing}
                  name="phone"
                  onChange={handleFieldChange}
                  placeholder="08xxxxxxxxxx"
                  type="tel"
                />
                <InfoRow
                  label="Program Studi"
                  value={editData.program_studi || profile.program_studi}
                  editing={editing}
                  name="program_studi"
                  onChange={handleFieldChange}
                  placeholder="D3 Teknik Informatika"
                  options={["D3 Teknik Informatika", "D4 Teknik Informatika", "D3 Sistem Informasi"]}
                />
                <InfoRow
                  label="Semester"
                  value={editData.semester || profile.semester}
                  editing={editing}
                  name="semester"
                  onChange={handleFieldChange}
                  options={["1", "2", "3", "4", "5", "6"]}
                />
              </div>
            </div>
          </div>

          {/* ── Card Skill ──────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Skill Saya</h2>
              {!editingSkills ? (
                <button
                  onClick={startEditSkills}
                  className="flex items-center gap-2 rounded-xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition"
                >
                  <Pencil size={14} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingSkills(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 transition"
                  >
                    <X size={14} /> Batal
                  </button>
                  <button
                    onClick={saveSkillsHandler}
                    disabled={loadingSkills}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50"
                  >
                    <Save size={14} />
                    {loadingSkills ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              )}
            </div>

            {loadingSkills && !editingSkills ? (
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-7 w-20 rounded-full bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : editingSkills ? (
              <div className="space-y-3">
                {/* Input tambah skill */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    list="skill-options"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Ketik skill lalu Enter..."
                    className="flex-1 rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <datalist id="skill-options">
                    {allSkills.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
                  >
                    Tambah
                  </button>
                </div>
                {/* Draft skills */}
                <div className="flex flex-wrap gap-2">
                  {draftSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      {s}
                      <button
                        onClick={() => removeSkill(s)}
                        className="hover:text-red-500 transition"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {draftSkills.length === 0 && (
                    <p className="text-sm text-gray-400 italic">Belum ada skill ditambahkan.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    Belum ada skill. Klik Edit untuk menambahkan.
                  </p>
                )}
              </div>
            )}
          </div>

          <MiniFooter />
        </div>
      </main>
    </div>
  );
}