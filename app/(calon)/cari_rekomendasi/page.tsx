"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SidebarCalon from "@/components/layout/sidebar_calon";
import DashboardNavbar from "@/components/layout/dashboard_navbar";
import MiniFooter from "@/components/layout/mini_footer";
import { Step1SkillDivisi } from "@/components/rekomendasi/Step1skilldivisi";
import { Step2DetailMagang } from "@/components/rekomendasi/Step2detailmagang";
import { Step3Review } from "@/components/rekomendasi/Step3review";
import { StepIndicatorRekom } from "@/components/rekomendasi/Stepindicatorrekom";
import type { Step1Data } from "@/components/rekomendasi/Step1skilldivisi";
import type { Step2Data } from "@/components/rekomendasi/Step2detailmagang";

const USER_NAME = "Arjuna";
const INITIAL_STEP1: Step1Data = { divisions: [], skills: [] };
const INITIAL_STEP2: Step2Data = { locations: [], durasi: "" };
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export default function CariRekomendasiPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Data>(INITIAL_STEP1);
  const [step2Data, setStep2Data] = useState<Step2Data>(INITIAL_STEP2);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${API_BASE}/skills/user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const skills: string[] = (json?.data ?? []).map((s: any) => s.name).filter(Boolean);
        if (skills.length > 0) setStep1Data((prev) => ({ ...prev, skills }));
      })
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Step A: sync skill user ke DB
      const skillRes = await fetch(`${API_BASE}/skills/user`, {
        method: "POST",
        headers,
        body: JSON.stringify({ skills: step1Data.skills }),
      });
      if (!skillRes.ok) {
        const err = await skillRes.json().catch(() => ({}));
        throw new Error(err?.message ?? `Gagal menyimpan skill (${skillRes.status})`);
      }

      // Step B: generate rekomendasi
      const rekomRes = await fetch(`${API_BASE}/recommendations`, {
        method: "POST",
        headers,
        body: JSON.stringify({ passion_division: step1Data.divisions[0] ?? "" }),
      });
      if (!rekomRes.ok) {
        const err = await rekomRes.json().catch(() => ({}));
        throw new Error(err?.message ?? `Gagal generate rekomendasi (${rekomRes.status})`);
      }

      const json = await rekomRes.json();
      // BE sekarang return session_id — langsung redirect ke halaman hasil sesi itu
      const sessionKey = json.session_key;
      router.push(`/riwayat_rekomendasi/${sessionKey}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal generate rekomendasi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      <SidebarCalon />
      <DashboardNavbar pageTitle="Cari Rekomendasi Magang" userName={USER_NAME} userRole="calon" />
      <main className="md:ml-60 pt-16 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-3xl mx-auto space-y-5 py-6">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center mb-6">
              <p className="text-indigo-600 text-sm font-semibold mb-1">Step {currentStep} dari 3</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Rekomendasi Tempat Magang</h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                Isi data divisi dan skill yang benar-benar kamu miliki dan kuasai. Informasi ini akan
                membantu sistem memberikan rekomendasi yang lebih akurat.
              </p>
            </div>
            <StepIndicatorRekom currentStep={currentStep} />
            {currentStep === 1 && (
              <Step1SkillDivisi data={step1Data} onChange={setStep1Data} onNext={() => setCurrentStep(2)} />
            )}
            {currentStep === 2 && (
              <Step2DetailMagang
                data={step2Data}
                onChange={setStep2Data}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <Step3Review
                step1={step1Data}
                step2={step2Data}
                onSubmit={handleGenerate}
                onBack={() => setCurrentStep(2)}
                isLoading={isLoading}
              />
            )}
          </div>
          <MiniFooter />
        </div>
      </main>
    </div>
  );
}