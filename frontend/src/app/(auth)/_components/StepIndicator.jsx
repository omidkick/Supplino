"use client";

import { useIsDesktop } from "@/hooks/useIsDesktop";
import { toPersianDigits } from "@/utils/numberFormatter";

const STEPS = [
  { id: 1, label: "احراز هویت", key: "auth" },
  { id: 2, label: "تکمیل اطلاعات", key: "profile" },
  { id: 3, label: "ثبت سفارش", key: "order" },
];

function StepIndicator({ currentStep }) {
  const isDesktop = useIsDesktop();

  return (
    <div
      className={`w-full max-w-sm mx-auto ${isDesktop ? "mb-12" : "mb-20 "}`}
    >
      <div className="relative flex items-center justify-between">
        {/* Background connecting lines */}
        <div className="absolute top-4 left-0 right-0 flex items-center justify-between mx-4">
          {STEPS.slice(0, -1).map((step, index) => (
            <div
              key={`line-${step.id}`}
              className={`h-0.5 flex-1 transition-all duration-300 ${
                step.id < currentStep ? "bg-primary-900" : "bg-secondary-300"
              }`}
              style={{
                marginLeft: index === 0 ? "1rem" : "3rem",
                marginRight: "3rem",
              }}
            />
          ))}
        </div>

        {/* Step circles and labels */}
        {STEPS.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center text-center relative z-10"
          >
            {/* Step Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step.id <= currentStep
                  ? "bg-primary-900 text-white"
                  : "bg-secondary-300 text-secondary-500"
              }`}
            >
              {toPersianDigits(step.id)}
            </div>
            <span
              className={`mt-2 text-xs font-medium whitespace-nowrap ${
                step.id <= currentStep
                  ? "text-primary-900 !font-bold"
                  : "text-secondary-800"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepIndicator;
