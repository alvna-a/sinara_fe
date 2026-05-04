"use client";

interface StepIndicatorProps {
  currentStep: number; // 1-4
}

const STEPS = [
  { number: 1, label: "Perusahaan & Divisi" },
  { number: 2, label: "Skill Dibutuhkan" },
  { number: 3, label: "Pengalaman" },
  { number: 4, label: "Review & Submit" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-gray-200 rounded-full mb-5">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-indigo-600 to-cyan-400 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        {/* Step dots */}
        <div className="absolute inset-0 flex items-center justify-between">
          {STEPS.map((step) => {
            const isDone = step.number < currentStep;
            const isActive = step.number === currentStep;
            return (
              <div
                key={step.number}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all -mt-3 ${
                  isDone
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isActive
                    ? "bg-white border-indigo-600 text-indigo-600 shadow-md"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between">
        {STEPS.map((step) => {
          const isDone = step.number < currentStep;
          const isActive = step.number === currentStep;
          return (
            <span
              key={step.number}
              className={`text-xs text-center w-1/4 ${
                isDone
                  ? "text-emerald-600 font-medium"
                  : isActive
                  ? "text-indigo-700 font-semibold"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}