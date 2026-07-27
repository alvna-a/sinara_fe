"use client";

// ─── components/rekomendasi/StepIndicatorRekom.tsx

import { Check } from "lucide-react";

const STEPS = [
  { label: "Input Skill & Divisi" },
  { label: "Detail Magang" },
  { label: "Cari Rekomendasi" },
];

interface Props {
  currentStep: number; // 1-based
}

export function StepIndicatorRekom({ currentStep }: Props) {
  return (
    <div className="w-full mb-8">
      {/* Progress bar track */}
      <div className="relative flex items-center justify-between mb-3 px-1">
        {STEPS.map((_, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;

          return (
            <div key={stepNum} className="flex items-center flex-1 last:flex-none">
              {/* Circle */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-all duration-300
                  ${isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isActive
                      ? "bg-white border-indigo-600 text-indigo-600"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
              >
                {isCompleted
                  ? <Check size={16} strokeWidth={2.5} />
                  : <span className="text-sm font-bold">{stepNum}</span>
                }
              </div>

              {/* Connector line (not after last step) */}
              {idx < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-1">
                  <div
                    className={`h-full transition-all duration-500
                      ${currentStep > stepNum ? "bg-indigo-600" : "bg-gray-200"}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Labels — width-independent from the circle row so long text has room to breathe */}
      <div className="flex justify-between">
        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isDone = currentStep > stepNum;
          const isFirst = idx === 0;
          const isLast = idx === STEPS.length - 1;

          return (
            <div
              key={stepNum}
              className={`w-24 text-[11px] font-medium leading-tight
                ${isFirst ? "text-left" : isLast ? "text-right" : "text-center"}
                ${isActive ? "text-indigo-600" : isDone ? "text-gray-500" : "text-gray-400"}`}
            >
              {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}