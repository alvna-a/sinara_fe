"use client";

import { useState } from "react";
import {
  Step1Perusahaan, Step1Data,
  Step2Skill, Step2Data,
  Step3Pengalaman, Step3Data,
  Step4Review,
  FeedbackSuccess,
  StepIndicator,
} from "@/components/feedback";

const INITIAL_STEP1: Step1Data = {
  namaPerusahaan: "",
  divisi: "",
  lokasi: "",
  durasi: "",
};

const DURASI_MAP: Record<string, string> = {
  "<3": "<3",
  "3-5": "3-5",
  ">5": ">5",
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

export default function InputFeedbackPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [step1Data, setStep1Data] = useState<Step1Data>(INITIAL_STEP1);
  const [step2Data, setStep2Data] = useState<Step2Data>(INITIAL_STEP2);
  const [step3Data, setStep3Data] = useState<Step3Data>(INITIAL_STEP3);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      // Payload sesuai FeedbackController@store di BE:
      // company_name, division_name, location, duration (<3|3-5|>5),
      // skills_used (array), suitability (1-5), rating_reason (min 20),
      // experience (min 20), jobdesk (array)
      const payload = {
        company_name:  step1Data.namaPerusahaan,
        division_name: step1Data.divisi,
        location:      step1Data.lokasi,
        duration:      DURASI_MAP[step1Data.durasi], // convert display → BE value
        skills_used:   step2Data.skills,
        suitability:   step2Data.tingkatKesesuaian,
        rating_reason: step2Data.alasanKesesuaian,
        experience:    step3Data.ringkasan,
        jobdesk:       step3Data.jobdesk,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        // Tampilkan pesan error validasi dari BE jika ada
        const firstError = errData.errors
          ? Object.values(errData.errors as Record<string, string[]>)[0][0]
          : errData.message || "Gagal mengirim feedback";
        throw new Error(firstError);
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mengirim feedback. Silahkan coba lagi.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-[#EEF2FF] min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
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
                  Isi data perusahaan, divisi, dan skill yang benar-benar digunakan selama magang. Informasi ini
                  akan membantu sistem memberikan rekomendasi yang lebih relevan bagi mahasiswa lain.
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
      </div>
    </main>
  );
}