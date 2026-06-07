"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Users,
    UserCheck,
    UserSearch,
    MessageSquare,
    Lightbulb,
    Star,
    Building2,
    ChevronDown,
} from "lucide-react";
import SidebarAdmin from "@/components/layout/sidebar_admin";
import DashboardNavbar from "@/components/layout/dashboard_navbar";

const stats = [
    { label: "Total Mahasiswa", value: 156, icon: Users },
    { label: "Mhs1 (Pemberi Feedback)", value: 98, icon: UserCheck },
    { label: "Mhs2 (Pencari Magang)", value: 120, icon: UserSearch },
    { label: "Total Feedback", value: 342, icon: MessageSquare },
];

const sampleStudents = [
    {
        name: "Budi Santoso",
        email: "budi.santoso@student.ui.ac.id",
        role: "Alumni Magang (Mhs1)",
        roleType: "mhs1",
        cohort: "Angkatan 2021",
        program: "Sistem Informasi",
        status: "Aktif",
        feedbackCount: 12,
        maxFeedback: 12,
        top: true,
    },
    {
        name: "Siti Aminah",
        email: "siti.aminah@student.itb.ac.id",
        role: "Pencari Magang (Mhs2)",
        roleType: "mhs2",
        cohort: "Angkatan 2023",
        program: "Informatika",
        status: "Pasif",
        feedbackCount: 0,
        maxFeedback: 12,
    },
    {
        name: "Arjuna Wijaya",
        email: "arjuna.w@student.ugm.ac.id",
        role: "Alumni Magang (Mhs1)",
        roleType: "mhs1",
        cohort: "Angkatan 2022",
        program: "Ilmu Komputer",
        status: "Aktif",
        feedbackCount: 3,
        maxFeedback: 12,
    },
    {
        name: "Dian Pelangi",
        email: "dian.pelangi@student.ub.ac.id",
        role: "Pencari Magang (Mhs2)",
        roleType: "mhs2",
        cohort: "Angkatan 2022",
        program: "Sistem Informasi",
        status: "Aktif",
        feedbackCount: 1,
        maxFeedback: 12,
    },
    {
        name: "Reza Rahadian",
        email: "reza.rahadian@student.unpad.ac.id",
        role: "Alumni Magang (Mhs1)",
        roleType: "mhs1",
        cohort: "Angkatan 2021",
        program: "Informatika",
        status: "Pasif",
        feedbackCount: 0,
        maxFeedback: 12,
    },
];

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

export default function DataMahasiswaPage() {
    const [userName, setUserName] = useState("Admin");

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
                        <span className="font-semibold">Insight Aktivitas:</span> 60% mahasiswa terdaftar belum pernah mengisi feedback. Kontributor terbanyak sejauh ini berasal dari angkatan 2022.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    {stats.map((s) => (
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
                                placeholder="Cari nama atau email mahasiswa..."
                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]/20 focus:border-[#3b5bdb]"
                            />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            {["Semua Role", "Semua Angkatan", "Semua Prodi", "Urutkan: Terbanyak Feedback"].map((label) => (
                                <button
                                    key={label}
                                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    {label}
                                    <ChevronDown size={13} className="text-slate-400" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/60">
                                {["MAHASISWA", "ROLE USER", "DEMOGRAFI", "STATUS AKTIVITAS", "KONTRIBUSI FEEDBACK"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-slate-500">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sampleStudents.map((s) => (
                                <tr key={s.email} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-semibold text-slate-900">{s.name}</span>
                                                {s.top && (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-100">
                                                        ⭐ TOP CONTRIBUTOR
                                                    </span>
                                                )}
                                            </div>
                                            <span className="mt-0.5 block text-xs text-slate-400">{s.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                s.roleType === "mhs1"
                                                    ? "bg-[#eef1ff] text-[#3b5bdb]"
                                                    : "bg-[#e8f5e9] text-[#2e7d32]"
                                            }`}
                                        >
                                            {s.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-700">{s.cohort}</div>
                                        <div className="mt-0.5 text-xs text-slate-500">{s.program}</div>
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
                                        <FeedbackBar count={s.feedbackCount} max={s.maxFeedback} />
                                        <div className="mt-1.5 text-xs font-semibold text-slate-700">
                                            {s.feedbackCount > 0 ? `${s.feedbackCount} Feedback` : "Belum ada kontribusi"}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
