"use client";

import { useState, useEffect } from "react";
import { apiGet } from "@/services/api";

export interface Step2Data {
  skills: string[];
  tingkatKesesuaian: number;
  alasanKesesuaian: string; // → field 'rating_reason' di BE (required, min 20 char)
}

interface Step2Props {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
  onNext: () => void;
  onBack: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Sangat Tidak Sesuai",
  2: "Tidak Sesuai",
  3: "Cukup Sesuai",
  4: "Sesuai",
  5: "Sangat Sesuai",
};

export default function Step2Skill({ data, onChange, onNext, onBack }: Step2Props) {
  const [errors, setErrors] = useState<{ skills?: string; tingkat?: string; alasan?: string }>({});
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);

  // Fetch semua skill dari BE — GET /api/skills
  useEffect(() => {
      const fetchSkills = async () => {
        setLoadingSkills(true);
        try {
          const token = localStorage.getItem("access_token");
          const json = await apiGet("/skills", token);
          setAllSkills((json.data || []).map((s: { id: number; name: string }) => s.name));
        } catch (err) {
          console.error("Gagal fetch skills:", err);
        } finally {
          setLoadingSkills(false);
        }
      };
      fetchSkills();
  }, []);

  const toggleSkill = (skill: string) => {
    const updated = data.skills.includes(skill)
      ? data.skills.filter((s) => s !== skill)
      : [...data.skills, skill];
    onChange({ ...data, skills: updated });
  };

  const addCustomSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      onChange({ ...data, skills: [...data.skills, trimmed] });
    }
    setNewSkill("");
    setShowSuggestions(false);
  };

  const validate = () => {
    const newErrors: { skills?: string; tingkat?: string; alasan?: string } = {};
    if (data.skills.length === 0) newErrors.skills = "Tambahkan minimal 1 skill";
    if (data.tingkatKesesuaian === 0) newErrors.tingkat = "Tingkat kesesuaian wajib dipilih";
    if (!data.alasanKesesuaian.trim()) newErrors.alasan = "Alasan penilaian wajib diisi";
    else if (data.alasanKesesuaian.trim().length < 20) newErrors.alasan = "Alasan penilaian minimal 20 karakter";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const filtered = allSkills.filter(
    (s) => s.toLowerCase().includes(newSkill.toLowerCase()) && !data.skills.includes(s)
  );

  return (
    <div className="space-y-6">
      {/* Skill yang dibutuhkan */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Skill yang dibutuhkan <span className="text-red-500">*</span>
        </label>
        <div className={`rounded-lg border p-3 min-h-20 ${errors.skills ? "border-red-500" : "border-gray-200"}`}>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className="ml-1 text-indigo-400 hover:text-red-500 transition"
                >
                  ×
                </button>
              </span>
            ))}

            {/* Tombol tambah skill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full hover:bg-gray-200 transition border border-dashed border-gray-300"
              >
                + tambah skill
              </button>

              {showSuggestions && (
                <div className="absolute left-0 top-8 z-10 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                    placeholder="Ketik skill..."
                    autoFocus
                    className="w-full px-2 py-1.5 text-xs text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder-gray-400 mb-2"
                  />
                  <div className="max-h-40 overflow-y-auto space-y-0.5">
                    {loadingSkills && (
                      <div className="px-2 py-1.5 text-xs text-gray-400">Memuat skill...</div>
                    )}
                    {!loadingSkills && filtered.slice(0, 8).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { toggleSkill(s); setShowSuggestions(false); setNewSkill(""); }}
                        className="w-full text-left px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-800 rounded-md transition"
                      >
                        {s}
                      </button>
                    ))}
                    {!loadingSkills && newSkill && !allSkills.some(s => s.toLowerCase() === newSkill.toLowerCase()) && (
                      <button
                        type="button"
                        onClick={addCustomSkill}
                        className="w-full text-left px-2 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-md transition font-medium"
                      >
                        + Tambah &quot;{newSkill}&quot;
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Pilih beberapa skill utama yang benar-benar dipakai selama magang supaya hasil pencarian mahasiswa lebih relevan.
        </p>
        {errors.skills && <p className="mt-1 text-xs text-red-500">{errors.skills}</p>}
      </div>

      {/* Tingkat Kesesuaian */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Tingkat kesesuaian <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange({ ...data, tingkatKesesuaian: star })}
              className="text-2xl transition-transform hover:scale-110"
            >
              <span className={star <= data.tingkatKesesuaian ? "text-amber-400" : "text-gray-200"}>
                ★
              </span>
            </button>
          ))}
          {data.tingkatKesesuaian > 0 && (
            <span className="text-xs text-gray-500 ml-1">{RATING_LABELS[data.tingkatKesesuaian]}</span>
          )}
        </div>
        {errors.tingkat && <p className="mb-2 text-xs text-red-500">{errors.tingkat}</p>}

        {/* Alasan penilaian — wajib, min 20 char, dikirim sebagai 'rating_reason' ke BE */}
        <textarea
          value={data.alasanKesesuaian}
          onChange={(e) => onChange({ ...data, alasanKesesuaian: e.target.value })}
          placeholder="Tuliskan alasan Anda memberikan penilaian ini... (minimal 20 karakter)"
          rows={4}
          className={`w-full px-4 py-3 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none placeholder-gray-400 ${
            errors.alasan ? "border-red-500" : "border-gray-200"
          }`}
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">
            Pilih tingkat kesesuaian skill dengan project / jobdesk yang dikerjakan selama magang.
          </p>
          <span className={`text-xs ${data.alasanKesesuaian.length < 20 ? "text-red-400" : "text-gray-400"}`}>
            {data.alasanKesesuaian.length}/20 min
          </span>
        </div>
        {errors.alasan && <p className="mt-1 text-xs text-red-500">{errors.alasan}</p>}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-gray-500">
          <span className="text-red-500">(*)</span> Form wajib diisi dan apabila field kosong akan menampilkan
          order merah dan pesan error di bawahnya.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-200 transition"
          >
            Kembali
          </button>
          <button
            onClick={() => { if (validate()) onNext(); }}
            className="px-6 py-2.5 bg-linear-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold rounded-full hover:opacity-90 transition shadow-sm"
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}