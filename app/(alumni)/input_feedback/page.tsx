"use client";

import { useState } from "react";
import SidebarAlumni from "@/components/layout/sidebar_alumni";
import DashboardNavbar from "@/components/layout/dashboard_navbar";
import MiniFooter from "@/components/layout/mini_footer";
import { apiPost } from "@/services/api";
import {
  Step1Perusahaan, Step1Data,
  Step2Skill, Step2Data,
  Step3Pengalaman, Step3Data,
  Step4Review,
  FeedbackSuccess,
  StepIndicator,
} from "@/components/feedback";

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_STEP1: Step1Data = {
  namaPerusahaan: "",
  divisi: "",
  lokasi: "",
  durasi: "",
};

const INITIAL_STEP2: Step2Data = {
  skills: [],
  tingkatKesesuaian: 0,
  alasanKesesuaian: "",
};

const INITIAL_STEP3: Step3Data = {
  ringkasan: "",
  jobdesk: [],
};

// Mapping durasi display → value BE
const DURASI_MAP: Record<string, string> = {
  "<3": "<3",
  "3-5": "3-5",
  ">5": ">5",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InputFeedbackPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [step1Data, setStep1Data] = useState<Step1Data>(INITIAL_STEP1);
  const [step2Data, setStep2Data] = useState<Step2Data>(INITIAL_STEP2);
  const [step3Data, setStep3Data] = useState<Step3Data>(INITIAL_STEP3);

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const payload = {
        company_name:  step1Data.namaPerusahaan,
        division_name: step1Data.divisi,
        location:      step1Data.lokasi,
        duration:      DURASI_MAP[step1Data.durasi],
        skills_used:   step2Data.skills,
        suitability:   step2Data.tingkatKesesuaian,
        rating_reason: step2Data.alasanKesesuaian,
        experience:    step3Data.ringkasan,
        jobdesk:       step3Data.jobdesk,
      };

      // Ganti fetch manual → apiPost dari services/api
      // apiPost sudah handle: Accept header, content-type check, throw error object dari Laravel
      await apiPost("/feedbacks", payload, token);

      setIsSuccess(true);
    } catch (err: unknown) {
      // err bisa berupa object Laravel { message, errors: {...} }
      // atau Error biasa dari handleResponse di api.js
      if (err && typeof err === "object" && "errors" in err) {
        // Validation error dari Laravel — ambil pesan pertama
        const laravelErrors = (err as Record<string, Record<string, string[]>>).errors;
        const firstMsg = Object.values(laravelErrors)[0]?.[0] ?? "Validasi gagal.";
        alert(firstMsg);
        setCurrentStep(1); // balik ke step 1 agar user bisa perbaiki
      } else if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Gagal mengirim feedback. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      <SidebarAlumni />
      <DashboardNavbar pageTitle="Input Feedback" userName="Arjuna" userRole="alumni" />

      <main className="md:ml-60 pt-16 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-3xl mx-auto space-y-5 py-6">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {isSuccess ? (
              <FeedbackSuccess />
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <p className="text-indigo-600 text-sm font-semibold mb-1">
                    Step {currentStep} dari 4
                  </p>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                    Input Pengalaman Magang
                  </h1>
                  <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
                    Isi data perusahaan, divisi, dan skill yang benar-benar digunakan
                    selama magang. Informasi ini akan membantu sistem memberikan
                    rekomendasi yang lebih relevan bagi mahasiswa lain.
                  </p>
                </div>

                {/* Step Indicator */}
                <StepIndicator currentStep={currentStep} />

                {/* Step Content */}
                {currentStep === 1 && (
                  <Step1Perusahaan
                    data={step1Data}
                    onChange={setStep1Data}
                    onNext={() => setCurrentStep(2)}
                  />
                )}
                {currentStep === 2 && (
                  <Step2Skill
                    data={step2Data}
                    onChange={setStep2Data}
                    onNext={() => setCurrentStep(3)}
                    onBack={() => setCurrentStep(1)}
                  />
                )}
                {currentStep === 3 && (
                  <Step3Pengalaman
                    data={step3Data}
                    onChange={setStep3Data}
                    onNext={() => setCurrentStep(4)}
                    onBack={() => setCurrentStep(2)}
                  />
                )}
                {currentStep === 4 && (
                  <Step4Review
                    step1={step1Data}
                    step2={step2Data}
                    step3={step3Data}
                    onSubmit={handleSubmit}
                    onBack={() => setCurrentStep(3)}
                    isLoading={isLoading}
                  />
                )}
              </>
            )}
          </div>

          <MiniFooter />
        </div>
      </main>
    </div>
  );
}