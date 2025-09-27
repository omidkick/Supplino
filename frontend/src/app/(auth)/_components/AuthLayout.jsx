"use client";

import AuthBackground from "../auth/_components/AuthBackground";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import StepIndicator from "./StepIndicator";
import { useStep } from "@/context/StepContext";

function AuthLayout({ children, showDecorative = true, showSteps = true }) {
  const isDesktop = useIsDesktop();
  const { currentStep } = useStep();

  return (
    <div className="min-h-screen relative ">
      {/* Background component - only shows on desktop */}
      {isDesktop && <AuthBackground />}

      {/* Main content */}
      <div className="relative z-10 min-h-screen px-4 md:p-0">
        {isDesktop ? (
          // Desktop layout
          <div className="flex min-h-screen">
            {/* Right side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-md">
                <div className="bg-secondary-0 rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-secondary-200/20">
                  {/* Mobile Step Indicator - Hidden on desktop */}
                  {showSteps && !isDesktop && (
                    <StepIndicator currentStep={currentStep} />
                  )}
                  {children}
                </div>
              </div>
            </div>

            {/* Left side - Decorative content */}
            {showDecorative && (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  {/* Desktop Step Indicator */}
                  {showSteps && <StepIndicator currentStep={currentStep} />}

                  {/* Supplements Illustration */}
                  <div className="w-48 h-48 mx-auto mb-10">
                    <img
                      src="/images/supp-1.png"
                      alt="Supplement Illustration"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <h1 className="text-2xl font-black text-secondary-0 mb-4 drop-shadow-lg">
                    خرید مکمل‌های ورزشی و سلامتی از ساپلینو
                  </h1>
                  <p className="text-secondary-0 leading-relaxed drop-shadow-md">
                    در ساپلینو، بهترین مکمل‌های بدنسازی، ویتامین‌ها و محصولات
                    سلامت را با تضمین کیفیت، مشاوره رایگان و ارسال سریع دریافت
                    کنید. سلامت شما سرمایه شماست!
                  </p>

                  {/* CTA Button */}
                  <button
                    type="button"
                    className="mt-8 px-8 py-3 bg-gradient-to-r from-secondary-200 to-secondary-300 text-secondary-900 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-secondary-100 hover:to-secondary-200"
                  >
                    ← شروع خرید مکمل‌ها
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Mobile layout
          <div className="flex justify-center items-center min-h-screen p-4">
            <div className="w-full max-w-sm">
              {/* Mobile Step Indicator */}
              {showSteps && <StepIndicator currentStep={currentStep} />}
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthLayout;
