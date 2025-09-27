import React from "react";
import { toPersianDigits } from "@/utils/numberFormatter";
import {
  CheckCircleIcon,
  TruckIcon,
  HomeIcon,
  CubeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

const statusSteps = [
  {
    key: 1,
    label: "در حال پردازش",
    icon: CubeIcon,
    description: "سفارش شما در حال آماده‌سازی و بسته‌بندی است",
  },
  {
    key: 2,
    label: "تحویل به پست",
    icon: TruckIcon,
    description: "سفارش شما به اداره پست تحویل داده شد",
  },
  {
    key: 3,
    label: "تحویل شده",
    icon: HomeIcon,
    description: "سفارش با موفقیت به دست شما رسید",
  },
];

export default function OrderStatusTracker({ currentStatus, paymentId }) {
  const currentIndex = statusSteps.findIndex(
    (step) => step.key === currentStatus
  );

  return (
    <div className="bg-secondary-0 border border-secondary-100 rounded-2xl shadow-lg mb-6 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-4 md:px-6 py-4 border-b border-secondary-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="font-bold text-xl md:text-2xl text-secondary-900">
            پیگیری سفارش
          </h3>
        </div>
      </div>

      {/* Status Steps Section */}
      <div className="p-4 md:p-6">
        {/* Desktop Progress Line */}
        <div className="hidden md:block relative mb-8">
          <div className="absolute top-6 right-8 left-8 h-0.5 bg-secondary-200 rounded-full">
            <div
              className="absolute top-0 right-0 h-full bg-primary-300 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`,
              }}
            />
          </div>

          <div className="flex justify-between relative">
            {statusSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center text-center flex-1"
                >
                  {/* Step Circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-primary-700 text-white border-primary-500 shadow-lg shadow-primary-200"
                        : "bg-secondary-0 text-secondary-400 border-secondary-300"
                    } ${isCurrent ? "ring-4 ring-primary-100 scale-105" : ""}`}
                  >
                    {isCompleted && index < currentIndex ? (
                      <CheckCircleSolid className="w-5 h-5" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>

                  {/* Step Label */}
                  <h4
                    className={`font-semibold mb-2 text-sm ${
                      isCompleted ? "text-secondary-900" : "text-secondary-500"
                    }`}
                  >
                    {step.label}
                  </h4>

                  {/* Step Status */}
                  <div className="min-h-[32px] flex items-center justify-center">
                    {isCompleted ? (
                      <div className="badge badge--success text-xs flex items-center justify-center">
                        <CheckCircleSolid className="w-3 h-3 ml-1" />
                        تکمیل شده
                      </div>
                    ) : (
                      <div className="flex items-center badge badge--secondary text-xs">
                        <ClockIcon className="w-3 h-3 ml-1" />
                        در انتظار
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Layout */}
        <div className="md:hidden space-y-4">
          {statusSteps.map((step, index) => {
            const IconComponent = step.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const isLast = index === statusSteps.length - 1;

            return (
              <div key={step.key} className="relative">
                <div className="flex items-start gap-4">
                  {/* Step Circle */}
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? "bg-primary-700 text-white border-primary-500 shadow-md shadow-primary-200"
                          : "bg-secondary-0 text-secondary-400 border-secondary-300"
                      } ${isCurrent ? "ring-3 ring-primary-100" : ""}`}
                    >
                      {isCompleted && index < currentIndex ? (
                        <CheckCircleSolid className="w-4 h-4" />
                      ) : (
                        <IconComponent className="w-4 h-4" />
                      )}
                    </div>

                    {/* Vertical Line */}
                    {!isLast && (
                      <div
                        className={`absolute top-10 right-4 w-0.5 h-8 ${
                          isCompleted ? "bg-primary-300" : "bg-secondary-200"
                        }`}
                      />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`font-semibold text-sm ${
                          isCompleted
                            ? "text-secondary-900"
                            : "text-secondary-500"
                        }`}
                      >
                        {step.label}
                      </h4>

                      {isCompleted ? (
                        <div className="badge badge--success text-xs flex items-center justify-center">
                          <CheckCircleSolid className="w-3 h-3 ml-1" />
                          تکمیل شده
                        </div>
                      ) : (
                        <div className="flex items-center badge badge--secondary text-xs">
                          <ClockIcon className="w-3 h-3 ml-1" />
                          در انتظار
                        </div>
                      )}
                    </div>

                    <p
                      className={`text-xs leading-relaxed ${
                        isCompleted
                          ? "text-secondary-600"
                          : "text-secondary-400"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Status Summary */}
        <div className="mt-6 p-4 bg-gradient-to-l from-primary-50 to-primary-100 rounded-xl border border-primary-200">
          <div className="flex items-start sm:items-center gap-3">
            <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
              {React.createElement(statusSteps[currentIndex]?.icon, {
                className: "w-5 h-5 text-primary-700",
              })}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-primary-900 text-sm mb-1">
                    وضعیت فعلی: {statusSteps[currentIndex]?.label}
                  </h4>
                  <p className="text-primary-700 text-xs leading-relaxed">
                    {statusSteps[currentIndex]?.description}
                  </p>
                </div>

                <div className="badge badge--primary text-xs flex-shrink-0">
                  مرحله {toPersianDigits(currentIndex + 1)} از{" "}
                  {toPersianDigits(statusSteps.length)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
