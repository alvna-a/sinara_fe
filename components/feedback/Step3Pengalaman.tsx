"use client";

import { useState, useEffect } from "react";

export interface Step3Data {
  ringkasan: string;  // → field 'experience' di BE (required, min 20 char)
  jobdesk: string[];  // → field 'jobdesk' di BE (required, array min 1)
}

interface Step3Props {
  data: Step3Data;
  onChange: (data: Step3Data) => void;
  onNext: () => void;
  onBack: () => void;
}

// Jobdesk suggestions diambil dari nama-nama divisi yang ada di seeder BE
// Ini adalah fallback statis; idealnya bisa juga fetch dari /api/divisions
const JOBDESK_STATIC = [
  "UI Design", "UX Design", "Wireframing", "User Flow", "Form Design",
  "Feature Design", "Dashboard Design", "Prototyping", "User Research",
  "Usability Testing", "Frontend Development", "Backend Development",
  "API Integration", "Mobile Development", "Database Management",
  "Content Writing", "Social Media Management", "SEO", "Copywriting",
  "Data Analysis", "Data Visualization", "Machine Learning",
  "Quality Assurance", "Manual Testing", "API Testing",
  "DevOps", "Cloud Deployment", "CI/CD Pipeline",
  "Network Configuration", "IT Support", "Documentation",
  "Project Management", "Business Analysis", "Market Research",
];

export default function Step3Pengalaman({ data, onChange, onNext, onBack }: Step3Props) {
  const [errors, setErrors] = useState<{ ringkasan?: string; jobdesk?: string }>({});
  const [jobdeskSuggestions, setJobdeskSuggestions] = useState<string[]>(JOBDESK_STATIC);
  const [newJobdesk, setNewJobdesk] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Opsional: ambil nama divisi dari BE sebagai saran jobdesk
  useEffect(() => {
    const fetchDivisionNames = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/divisions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const divisionNames: string[] = json.data.map((d: { name: string }) => d.name);
          // Gabungkan dengan suggestions statis, hindari duplikat
          const combined = Array.from(new Set([...divisionNames, ...JOBDESK_STATIC]));
          setJobdeskSuggestions(combined);
        }
      } catch {
        // Kalau gagal, pakai fallback statis
      }
    };
    fetchDivisionNames();
  }, []);

  const toggleJobdesk = (item: string) => {
    const updated = data.jobdesk.includes(item)
      ? data.jobdesk.filter((j) => j !== item)
      : [...data.jobdesk, item];
    onChange({ ...data, jobdesk: updated });
  };

  const addCustomJobdesk = () => {
    const trimmed = newJobdesk.trim();
    if (trimmed && !data.jobdesk.includes(trimmed)) {
      onChange({ ...data, jobdesk: [...data.jobdesk, trimmed] });
    }
    setNewJobdesk("");
    setShowSuggestions(false);
  };

  const validate = () => {
    const newErrors: { ringkasan?: string; jobdesk?: string } = {};
    if (!data.ringkasan.trim()) {
      newErrors.ringkasan = "Ringkasan pengalaman wajib diisi sebelum lanjut ke tahap berikutnya.";
    } else if (data.ringkasan.trim().length < 20) {
      newErrors.ringkasan = "Ringkasan pengalaman minimal 20 karakter.";
    }
    if (data.jobdesk.length === 0) newErrors.jobdesk = "Tambahkan minimal 1 jobdesk / project";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const filtered = jobdeskSuggestions.filter(
    (j) => j.toLowerCase().includes(newJobdesk.toLowerCase()) && !data.jobdesk.includes(j)
  );

  return (
    <div className="space-y-6">
      {/* Ringkasan Pekerjaan */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Ringkasan Pekerjaan & Kesan Pesan Magang <span className="text-red-500">*</span>
        </label>
        <div className={`rounded-lg border overflow-hidden ${errors.ringkasan ? "border-red-500" : "border-gray-200"}`}>
          {/* Mini toolbar */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50">
            <button
              type="button"
              onClick={() => onChange({ ...data, ringkasan: data.ringkasan + "**teks bold**" })}
              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-200 rounded transition"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...data, ringkasan: data.ringkasan + "\n• " })}
              className="px-2 h-7 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-200 rounded transition"
            >
              + List
            </button>
          </div>
          <textarea
            value={data.ringkasan}
            onChange={(e) => onChange({ ...data, ringkasan: e.target.value })}
            placeholder="Contoh: Selama magang, saya membantu pembuatan konten, mengelola media sosial, dan menyusun caption menggunakan tools seperti Canva dan Google Docs. Saya bekerja secara kolaboratif dengan tim melalui diskusi dan evaluasi rutin."
            rows={6}
            className="w-full px-4 py-3 text-sm text-gray-900 focus:outline-none resize-none placeholder-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className={`text-xs ${data.ringkasan.trim().length < 20 ? "text-red-400" : "text-gray-400"}`}>
            {data.ringkasan.trim().length}/20 min karakter
          </span>
        </div>
        {errors.ringkasan && (
          <p className="mt-1 text-xs text-red-500">{errors.ringkasan}</p>
        )}
      </div>

      {/* Jobdesk / Project */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Jobdesk / project <span className="text-red-500">*</span>
        </label>
        <div className={`rounded-lg border p-3 min-h-17.5 ${errors.jobdesk ? "border-red-500" : "border-gray-200"}`}>
          <div className="flex flex-wrap gap-2">
            {data.jobdesk.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200"
              >
                {item}
                <button
                  type="button"
                  onClick={() => toggleJobdesk(item)}
                  className="ml-1 text-indigo-400 hover:text-red-500 transition"
                >
                  ×
                </button>
              </span>
            ))}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full hover:bg-gray-200 transition border border-dashed border-gray-300"
              >
                + tambah project
              </button>
              {showSuggestions && (
                <div className="absolute left-0 top-8 z-10 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                  <input
                    type="text"
                    value={newJobdesk}
                    onChange={(e) => setNewJobdesk(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomJobdesk()}
                    placeholder="Ketik jobdesk..."
                    autoFocus
                    className="w-full px-2 py-1.5 text-xs text-gray-900 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder-gray-400 mb-2"
                  />
                  <div className="max-h-40 overflow-y-auto space-y-0.5">
                    {filtered.slice(0, 8).map((j) => (
                      <button
                        key={j}
                        type="button"
                        onClick={() => { toggleJobdesk(j); setShowSuggestions(false); setNewJobdesk(""); }}
                        className="w-full text-left px-2 py-1.5 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition"
                      >
                        {j}
                      </button>
                    ))}
                    {newJobdesk && !jobdeskSuggestions.some(j => j.toLowerCase() === newJobdesk.toLowerCase()) && (
                      <button
                        type="button"
                        onClick={addCustomJobdesk}
                        className="w-full text-left px-2 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-md transition font-medium"
                      >
                        + Tambah &quot;{newJobdesk}&quot;
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Pilih beberapa project yang benar-benar dilakukan selama periode magang.
        </p>
        {errors.jobdesk && <p className="mt-1 text-xs text-red-500">{errors.jobdesk}</p>}
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