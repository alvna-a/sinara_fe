"use client";

import { ArrowRight, BookOpen, Clock3, LayoutDashboard, Star, UserCheck } from "lucide-react";
import SidebarMahasiswa1 from "@/components/layout/sidebar_alumni";
import DashboardNavbar from "@/components/layout/dashboard_navbar";
import MiniFooter from "@/components/layout/mini_footer";

export default function DashboardAlumniPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SidebarMahasiswa1 />
      <DashboardNavbar pageTitle="Dashboard Utama" userName="Arjuna" userRole="mahasiswa2" />

      <main className="ml-60 pt-16 px-8 pb-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
            <div className="rounded-[28px] bg-white p-8 shadow-sm border border-gray-200">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Dashboard Utama</p>
                    <h1 className="mt-2 text-3xl font-semibold text-slate-900">Selamat Datang, Arjuna <span className="text-2xl">👋</span></h1>
                    <p className="mt-3 text-sm text-slate-500 max-w-2xl">
                      Pantau perkembangan profilmu dan bagikan pengalaman selama kamu magang.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-5 py-4 w-full sm:w-auto">
                    <p className="text-sm text-slate-500">Status kelengkapan profil</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-slate-900">80%</span>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full w-4/5 rounded-full bg-linear-to-r from-sky-500 to-cyan-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
                  <div className="rounded-3xl bg-slate-50 p-6 border border-slate-200">
                    <div className="flex items-center gap-3 text-sky-600 mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Aktivitas Terbaru</p>
                        <p className="text-xs text-slate-500">Pembaharuan aktivitas akun dan feedback.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                          <Star size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Memberikan ulasan untuk PT GoTo Gojek Tokopedia</p>
                          <p className="text-xs text-slate-500 mt-1">2 jam yang lalu</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                          <UserCheck size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Menambahkan pengalaman magang di Traveloka</p>
                          <p className="text-xs text-slate-500 mt-1">3 hari yang lalu</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
                          <Clock3 size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Memperbarui status kelengkapan profil</p>
                          <p className="text-xs text-slate-500 mt-1">1 minggu yang lalu</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                        <LayoutDashboard size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Perusahaan Dulas</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">1</p>
                      </div>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                        <Star size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Total Feedback Diberikan</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">1</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-linear-to-br from-slate-900 via-sky-900 to-cyan-600 text-white p-8 shadow-lg overflow-hidden relative">
              <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute left-4 top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <div>
                  <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                    Bagikan Pengalaman Magangmu
                  </div>
                  <h2 className="mt-6 text-2xl font-semibold">Bantu mahasiswa lain dengan memberikan ulasan magangmu di perusahaan sebelumnya.</h2>
                  <p className="mt-4 max-w-lg text-sm text-slate-200/90">Bantu mahasiswa lain dengan memberikan ulasan magangmu di perusahaan sebelumnya.</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/20 hover:bg-slate-100 transition">
                  Tambah Pengalaman Magang Sekarang
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </section>

          <MiniFooter />
        </div>
      </main>
    </div>
  );
}
