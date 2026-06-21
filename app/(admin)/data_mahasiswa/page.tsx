"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    Search,
    Users,
    UserCheck,
    UserSearch,
    MessageSquare,
    Lightbulb,
    ChevronDown,
    Check,
    MoreVertical,
    RotateCcw,
    Loader2,
} from "lucide-react";
import SidebarAdmin from "@/components/layout/sidebar_admin";
import DashboardNavbar from "@/components/layout/dashboard_navbar";

const API_BASE_URL = "http://localhost:8000/api";

// Opsi filter
const ROLE_OPTIONS = [
    { label: "Semua Role", value: "all" },
    { label: "Calon Mahasiswa Magang (Mhs2)", value: "mhs2" },
    { label: "Mahasiswa Sudah Magang (Mhs1)", value: "mhs1" },
];

const PRODI_OPTIONS = [
    { label: "Semua Prodi", value: "all" },
    { label: "D3-Teknik Informatika", value: "D3-Teknik Informatika" },
    { label: "D4-Teknologi Rekayasa Komputer", value: "D4-Teknologi Rekayasa Komputer" },
];

const ANGKATAN_OPTIONS = [
    { label: "Semua Angkatan", value: "all" },
    ...["2020", "2021", "2022", "2023", "2024", "2025", "2026"].map((y) => ({
        label: `Angkatan ${y}`,
        value: y,
    })),
];

const SORT_OPTIONS = [
    { label: "Urutkan: Terbanyak Feedback", value: "desc" },
    { label: "Urutkan: Tersedikit Feedback", value: "asc" },
    { label: "Urutkan: Nama A-Z", value: "name" },
];

// Tipe data mahasiswa sesuai response DataMahasiswaController@index
type Student = {
    id: number;
    name: string;
    email: string;
    nim: string | null;
    is_alumni: boolean;
    role_source: "manual" | "otomatis";
    role_type: "mhs1" | "mhs2";
    role_label: string;
    program_studi: string | null;
    semester: string | null;
    angkatan: string | null;
    cohort_label: string;
    status: "Aktif" | "Pasif";
    feedback_count: number;
    max_feedback: number;
};

type Stats = {
    total_mahasiswa: number;
    total_mhs1: number;
    total_mhs2: number;
    total_feedback: number;
};

function getToken(): string | null {
    try {
        const raw = localStorage.getItem("sinara-user-data");
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.token || parsed?.access_token || null;
    } catch {
        return null;
    }
}

function FeedbackBar({ count, max }: { count: number; max: number }) {
    const totalDots = 10;
    const filled = Math.round((count / max) * totalDots);
    const color = count >= 10 ? "#3b5bdb" : "#2f9e44";

    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-[3px]">
                {Array.from({ length: totalDots }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: 14,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: i < filled ? color : "#e2e8f0",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

type FilterOption = { label: string; value: string };

function FilterDropdown({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === value);
    const isActive = value !== "all" && value !== "desc";

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    isActive
                        ? "border-[#3b5bdb]/30 bg-[#eef1ff] text-[#3b5bdb] font-medium"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
            >
                {selected?.label ?? label}
                <ChevronDown
                    size={13}
                    className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute left-0 top-full z-20 mt-1.5 w-60 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-sm transition-colors ${
                                opt.value === value
                                    ? "bg-[#eef1ff] text-[#3b5bdb] font-medium"
                                    : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            {opt.label}
                            {opt.value === value && <Check size={14} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Dropdown titik tiga per baris untuk fitur switch role (admin override manual)
function RoleSwitchMenu({
    student,
    onSwitch,
    onReset,
    isUpdating,
}: {
    student: Student;
    onSwitch: (id: number, status: "belum_magang" | "sudah_magang") => void;
    onReset: (id: number) => void;
    isUpdating: boolean;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                disabled={isUpdating}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
            >
                {isUpdating ? (
                    <Loader2 size={15} className="animate-spin" />
                ) : (
                    <MoreVertical size={15} />
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full z-20 mt-1.5 w-56 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg">
                    <button
                        type="button"
                        onClick={() => {
                            onSwitch(student.id, "sudah_magang");
                            setOpen(false);
                        }}
                        disabled={student.role_type === "mhs1" && student.role_source === "manual"}
                        className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Tandai Sudah Magang
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onSwitch(student.id, "belum_magang");
                            setOpen(false);
                        }}
                        disabled={student.role_type === "mhs2" && student.role_source === "manual"}
                        className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Tandai Belum Magang
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                        type="button"
                        onClick={() => {
                            onReset(student.id);
                            setOpen(false);
                        }}
                        disabled={student.role_source === "otomatis"}
                        className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <RotateCcw size={13} />
                        Reset ke Otomatis
                    </button>
                </div>
            )}
        </div>
    );
}

export default function DataMahasiswaPage() {
    const [userName, setUserName] = useState("Admin");

    const [students, setStudents] = useState<Student[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [prodiFilter, setProdiFilter] = useState("all");
    const [angkatanFilter, setAngkatanFilter] = useState("all");
    const [sortBy, setSortBy] = useState("desc");

    useEffect(() => {
        try {
            const raw = localStorage.getItem("sinara-user-data");
            if (raw) {
                const parsed = JSON.parse(raw);
                setUserName(parsed?.nama || parsed?.name || "Admin");
            }
        } catch (e) {
            // ignore
        }
    }, []);

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = getToken();
            const params = new URLSearchParams({
                search: searchQuery.trim(),
                role: roleFilter,
                program_studi: prodiFilter,
                angkatan: angkatanFilter,
                sort: sortBy,
            });

            const res = await fetch(`${API_BASE_URL}/admin/data-mahasiswa?${params.toString()}`, {
                headers: {
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!res.ok) {
                throw new Error(
                    res.status === 401 || res.status === 403
                        ? "Sesi habis atau akses ditolak. Silakan login ulang sebagai admin."
                        : "Gagal mengambil data mahasiswa dari server."
                );
            }

            const json = await res.json();
            setStudents(json.data ?? []);
            setStats(json.stats ?? null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga.");
            setStudents([]);
            setStats(null);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, roleFilter, prodiFilter, angkatanFilter, sortBy]);

    // Debounce fetch supaya tidak request tiap ketikan/klik filter beruntun
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchStudents();
        }, 300);
        return () => clearTimeout(timeout);
    }, [fetchStudents]);

    async function handleSwitchRole(id: number, status: "belum_magang" | "sudah_magang") {
        setUpdatingId(id);
        try {
            const token = getToken();
            const res = await fetch(`${API_BASE_URL}/admin/data-mahasiswa/${id}/switch-role`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ status }),
            });

            if (!res.ok) {
                throw new Error("Gagal mengubah status magang mahasiswa.");
            }

            await fetchStudents();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal mengubah status magang.");
        } finally {
            setUpdatingId(null);
        }
    }

    async function handleResetRole(id: number) {
        setUpdatingId(id);
        try {
            const token = getToken();
            const res = await fetch(`${API_BASE_URL}/admin/data-mahasiswa/${id}/reset-role`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!res.ok) {
                throw new Error("Gagal reset status magang mahasiswa.");
            }

            await fetchStudents();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Gagal reset status magang.");
        } finally {
            setUpdatingId(null);
        }
    }

    const activeFilterCount = [roleFilter, prodiFilter, angkatanFilter].filter(
        (v) => v !== "all"
    ).length;

    function resetFilters() {
        setRoleFilter("all");
        setProdiFilter("all");
        setAngkatanFilter("all");
        setSortBy("desc");
        setSearchQuery("");
    }

    const statCards = [
        { label: "Total Mahasiswa", value: stats?.total_mahasiswa ?? 0, icon: Users },
        { label: "Mhs1 (Pemberi Feedback)", value: stats?.total_mhs1 ?? 0, icon: UserCheck },
        { label: "Mhs2 (Pencari Magang)", value: stats?.total_mhs2 ?? 0, icon: UserSearch },
        { label: "Total Feedback", value: stats?.total_feedback ?? 0, icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-[#eef0f8] font-sans">
            <SidebarAdmin />
            <DashboardNavbar pageTitle="Data Mahasiswa" userName={userName} userRole="admin" />

            <main className="md:ml-60 pt-16 px-8 py-6 space-y-5">
                <div className="flex items-start gap-3 bg-white rounded-2xl px-5 py-4 border border-slate-100 shadow-sm">
                    <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                        <Lightbulb size={15} className="text-amber-500" />
                    </div>
                    <p className="text-sm text-slate-700">
                        <span className="font-semibold">Insight Aktivitas:</span> Status magang dihitung otomatis dari program studi dan semester. Gunakan menu titik tiga di setiap baris untuk mengubah status secara manual bila diperlukan.
                    </p>
                </div>

                {error && (
                    <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    {statCards.map((s) => (
                        <div key={s.label} className="bg-white rounded-2xl px-5 py-5 border border-slate-100 shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-xs text-slate-500 leading-snug">{s.label}</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">{s.value}</p>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <s.icon size={18} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
                        <div className="relative flex items-center w-full max-w-[420px]">
                            <Search size={14} className="absolute left-3 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama atau email mahasiswa..."
                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]/20 focus:border-[#3b5bdb]"
                            />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <FilterDropdown
                                label="Semua Role"
                                options={ROLE_OPTIONS}
                                value={roleFilter}
                                onChange={setRoleFilter}
                            />
                            <FilterDropdown
                                label="Semua Angkatan"
                                options={ANGKATAN_OPTIONS}
                                value={angkatanFilter}
                                onChange={setAngkatanFilter}
                            />
                            <FilterDropdown
                                label="Semua Prodi"
                                options={PRODI_OPTIONS}
                                value={prodiFilter}
                                onChange={setProdiFilter}
                            />
                            <FilterDropdown
                                label="Urutkan: Terbanyak Feedback"
                                options={SORT_OPTIONS}
                                value={sortBy}
                                onChange={setSortBy}
                            />

                            {activeFilterCount > 0 && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    Reset filter
                                </button>
                            )}
                        </div>
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/60">
                                {["MAHASISWA", "ROLE USER", "DEMOGRAFI", "STATUS AKTIVITAS", "KONTRIBUSI FEEDBACK", ""].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-slate-500">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 size={15} className="animate-spin" />
                                            Memuat data mahasiswa...
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!isLoading && students.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-semibold text-slate-900">{s.name}</span>
                                                {s.feedback_count >= s.max_feedback && s.max_feedback > 0 && (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-100">
                                                        ⭐ TOP CONTRIBUTOR
                                                    </span>
                                                )}
                                            </div>
                                            <span className="mt-0.5 block text-xs text-slate-400">{s.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span
                                                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                    s.role_type === "mhs1"
                                                        ? "bg-[#eef1ff] text-[#3b5bdb]"
                                                        : "bg-[#e8f5e9] text-[#2e7d32]"
                                                }`}
                                            >
                                                {s.role_label}
                                            </span>
                                            {s.role_source === "manual" && (
                                                <span className="text-[10px] font-medium text-slate-400">
                                                    Diatur manual oleh admin
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-700">{s.cohort_label}</div>
                                        <div className="mt-0.5 text-xs text-slate-500">
                                            {s.program_studi ?? "-"}
                                            {s.semester ? ` · Semester ${s.semester}` : ""}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                s.status === "Aktif"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-slate-100 text-slate-500"
                                            }`}
                                        >
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <FeedbackBar count={s.feedback_count} max={s.max_feedback} />
                                        <div className="mt-1.5 text-xs font-semibold text-slate-700">
                                            {s.feedback_count > 0 ? `${s.feedback_count} Feedback` : "Belum ada kontribusi"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <RoleSwitchMenu
                                            student={s}
                                            onSwitch={handleSwitchRole}
                                            onReset={handleResetRole}
                                            isUpdating={updatingId === s.id}
                                        />
                                    </td>
                                </tr>
                            ))}

                            {!isLoading && students.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                                        Tidak ada mahasiswa yang cocok dengan filter yang dipilih.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
