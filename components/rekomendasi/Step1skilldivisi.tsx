"use client";

// ─── components/rekomendasi/Step1SkillDivisi.tsx
// Step 1: Input Passion/Minat Divisi + Skill yang dimiliki (maks 3 divisi)

import { useState, useRef } from "react";
import { X, Search } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface Step1Data {
  divisions: string[]; // maks 3
  skills: string[];
}

interface Props {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  onNext: () => void;
}

// ── Suggestion data ────────────────────────────────────────────────────────────
const DIVISION_SUGGESTIONS = [
  "Product Design Intern",
  "Frontend Intern",
  "Backend Intern",
  "UIUX Design Intern",
  "Mobile Developer Intern",
  "Data Analyst Intern",
  "DevOps Intern",
  "QA Engineer Intern",
  "Marketing Digital Intern",
  "Business Analyst Intern",
];

const SKILL_SUGGESTIONS = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Vue",
  "Node.js", "Laravel", "PHP", "Python", "SQL", "MySQL", "PostgreSQL",
  "Figma", "Design System", "Adobe XD", "Canva", "UX Research",
  "Wireframing", "Prototyping", "Adobe Photoshop", "Adobe Illustrator",
  "Flutter", "Kotlin", "Swift", "Git", "Docker", "AWS", "Firebase",
  "MongoDB", "REST API", "GraphQL", "Tailwind CSS",
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function Tag({
  label,
  onRemove,
  variant = "selected",
}: {
  label: string;
  onRemove?: () => void;
  variant?: "selected" | "suggestion";
}) {
  if (variant === "suggestion") {
    return (
      <button
        type="button"
        className="px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors"
      >
        {label}
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-indigo-900 transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function Step1SkillDivisi({ data, onChange, onNext }: Props) {
  const [divisionQuery, setDivisionQuery] = useState("");
  const [skillQuery, setSkillQuery]       = useState("");
  const [errors, setErrors]               = useState<{ divisions?: string; skills?: string }>({});
  const divInputRef = useRef<HTMLInputElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);

  // ── Division handlers ──────────────────────────────────────────────────────
  const filteredDivisions = DIVISION_SUGGESTIONS.filter(
    (d) =>
      d.toLowerCase().includes(divisionQuery.toLowerCase()) &&
      !data.divisions.includes(d)
  );

  const addDivision = (div: string) => {
    if (data.divisions.length >= 3) return;
    if (data.divisions.includes(div)) return;
    onChange({ ...data, divisions: [...data.divisions, div] });
    setDivisionQuery("");
    setErrors((e) => ({ ...e, divisions: undefined }));
    divInputRef.current?.focus();
  };

  const removeDivision = (div: string) =>
    onChange({ ...data, divisions: data.divisions.filter((d) => d !== div) });

  const handleDivisionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && divisionQuery.trim()) {
      e.preventDefault();
      addDivision(divisionQuery.trim());
    }
  };

  // ── Skill handlers ─────────────────────────────────────────────────────────
  const filteredSkills = SKILL_SUGGESTIONS.filter(
    (s) =>
      s.toLowerCase().includes(skillQuery.toLowerCase()) &&
      !data.skills.includes(s)
  );

  const addSkill = (skill: string) => {
    if (data.skills.includes(skill)) return;
    onChange({ ...data, skills: [...data.skills, skill] });
    setSkillQuery("");
    setErrors((e) => ({ ...e, skills: undefined }));
    skillInputRef.current?.focus();
  };

  const removeSkill = (skill: string) =>
    onChange({ ...data, skills: data.skills.filter((s) => s !== skill) });

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillQuery.trim()) {
      e.preventDefault();
      addSkill(skillQuery.trim());
    }
  };

  // ── Validation & next ──────────────────────────────────────────────────────
  const handleNext = () => {
    const newErrors: typeof errors = {};
    if (data.divisions.length === 0)
      newErrors.divisions = "Pilih minimal 1 minat divisi.";
    if (data.skills.length === 0)
      newErrors.skills = "Pilih minimal 1 skill yang kamu kuasai.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onNext();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">

      {/* ── Passion / Minat Divisi ──────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
          Passion atau Minat Divisi{" "}
          <span className="text-red-500">*</span>
        </label>

        {/* Input */}
        <div
          className={`flex items-center gap-2 border rounded-xl px-3 py-2 bg-white cursor-text transition-colors
            ${errors.divisions
              ? "border-red-400 ring-1 ring-red-300"
              : "border-gray-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100"
            }`}
          onClick={() => divInputRef.current?.focus()}
        >
          <input
            ref={divInputRef}
            type="text"
            value={divisionQuery}
            onChange={(e) => setDivisionQuery(e.target.value)}
            onKeyDown={handleDivisionKeyDown}
            placeholder={data.divisions.length < 3 ? "Ketik atau pilih divisi…" : "Maksimal 3 divisi"}
            disabled={data.divisions.length >= 3}
            className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent disabled:cursor-not-allowed"
          />
          <span className="text-xs text-gray-400 shrink-0">Cari divisi</span>
        </div>

        {/* Dropdown suggestions */}
        {divisionQuery && filteredDivisions.length > 0 && (
          <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden z-10">
            {filteredDivisions.slice(0, 5).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => addDivision(d)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {/* Selected tags */}
        {data.divisions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            {data.divisions.map((d) => (
              <Tag key={d} label={d} onRemove={() => removeDivision(d)} />
            ))}
          </div>
        )}

        {/* Suggestion pills (when no query) */}
        {!divisionQuery && data.divisions.length < 3 && (
          <div className="flex flex-wrap gap-2 mt-3 p-3 bg-white rounded-xl border border-gray-100">
            {DIVISION_SUGGESTIONS.filter((d) => !data.divisions.includes(d))
              .slice(0, 6)
              .map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => addDivision(d)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors"
                >
                  {d}
                </button>
              ))}
          </div>
        )}

        {errors.divisions && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <span>⚠</span> {errors.divisions}
          </p>
        )}
        <p className="mt-1.5 text-xs text-gray-400">
          Kamu bisa memilih 3 divisi sekaligus dalam satu kali request rekomendasi.
        </p>
      </div>

      {/* ── Skill yang dimiliki ────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
          Skill yang dimiliki{" "}
          <span className="text-red-500">*</span>
        </label>

        {/* Input */}
        <div
          className={`flex items-center gap-2 border rounded-xl px-3 py-2 bg-white cursor-text transition-colors
            ${errors.skills
              ? "border-red-400 ring-1 ring-red-300"
              : "border-gray-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100"
            }`}
          onClick={() => skillInputRef.current?.focus()}
        >
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            ref={skillInputRef}
            type="text"
            value={skillQuery}
            onChange={(e) => setSkillQuery(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="Cari dan pilih skill seperti HTML, SQL, atau Figma"
            className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
          />
        </div>

        {/* Dropdown suggestions */}
        {skillQuery && filteredSkills.length > 0 && (
          <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden z-10">
            {filteredSkills.slice(0, 6).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSkill(s)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Selected + Suggestion Pills */}
        <div className="flex flex-wrap gap-2 mt-3 p-3 bg-white rounded-xl border border-gray-100 min-h-13">
          {/* Selected */}
          {data.skills.map((s) => (
            <Tag key={s} label={s} onRemove={() => removeSkill(s)} />
          ))}
          {/* Suggestions */}
          {!skillQuery &&
            SKILL_SUGGESTIONS.filter((s) => !data.skills.includes(s))
              .slice(0, Math.max(0, 8 - data.skills.length))
              .map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors"
                >
                  {s}
                </button>
              ))}
        </div>

        {errors.skills && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <span>⚠</span> {errors.skills}
          </p>
        )}
        <p className="mt-1.5 text-xs text-gray-400">
          Pilih dan tambahkan beberapa skill yang kamu kuasai supaya sistem bisa
          merekomendasikan tempat magang yang paling relevan.
        </p>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500 max-w-xs">
          <span className="text-red-500 font-semibold">(*)</span> Form wajib diisi
          dan apabila field kosong akan menampilkan border merah dan pesan error di
          bawahnya.
        </p>
        <button
          type="button"
          onClick={handleNext}
          className="px-7 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200"
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}