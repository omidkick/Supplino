import { useEffect, useRef } from "react";
import OTPInput from "react-otp-input";
import { HiArrowNarrowRight } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import Loading from "@/ui/Loading";
import { toPersianDigits } from "@/utils/numberFormatter";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 15, duration: 0.4 },
  },
};

const headerVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.5 },
  },
};

const titleVariants = {
  hidden: { y: 15, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.6 },
  },
};

const otpContainerVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 15, duration: 0.6 },
  },
};

const actionVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 110, damping: 14, duration: 0.5 },
  },
};

function CheckOTPForm({
  otpResponse,
  onSubmit,
  otp,
  setOtp,
  onBack,
  time,
  onResendOtp,
  isCheckingOtp,
}) {
  const firstInputRef = useRef(null);
  const formRef = useRef(null);

  // Focus first input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.querySelector("input.otp-input");
      if (el) el.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto-submit when OTP length reaches 6
  useEffect(() => {
    if (otp.length === 6) {
      formRef.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }, [otp]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div
        className="relative flex items-center justify-start mb-6"
        variants={headerVariants}
      >
        <button
          onClick={onBack}
          className="p-1 border border-secondary-500 rounded-xl z-10"
        >
          <HiArrowNarrowRight className="w-6 h-6 text-secondary-500" />
        </button>

        <motion.h2
          className="absolute left-1/2 -translate-x-1/2 font-black text-3xl text-secondary-900 text-center"
          variants={titleVariants}
        >
          ساپلینو
        </motion.h2>
      </motion.div>

      {/* Edit phone number */}
      {otpResponse && (
        <motion.p
          className="text-secondary-500 flex items-center gap-2 text-xs md:text-sm my-8"
          variants={itemVariants}
        >
          {otpResponse?.message}
          <button onClick={onBack}>
            <CiEdit className="w-5 md:w-6 h-5 md:h-6 text-primary-900" />
          </button>
        </motion.p>
      )}

      {/* OTP form */}
      <motion.form
        ref={formRef}
        className="space-y-4"
        onSubmit={onSubmit}
        variants={containerVariants}
        name="otp-verification"
      >
        <motion.p className="font-bold" variants={itemVariants}>
          کد تایید را وارد کنید
        </motion.p>

        <motion.div variants={otpContainerVariants}>
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            shouldAutoFocus={false}
            renderSeparator={<span></span>}
            renderInput={(props, index) => (
              <input
                type="tel"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                ref={index === 0 ? firstInputRef : null}
                {...props}
                style={{
                  width: "14vw",
                  height: "4rem",
                  maxWidth: "3rem",
                  minWidth: "2.5rem",
                  padding: "0.5rem 0.2rem",
                  border: "1px solid rgb(var(--color-secondary-200))",
                  borderRadius: "1rem",
                  textAlign: "center",
                  background: "rgb(var(--color-secondary-0))",
                  color: "rgb(var(--color-secondary-700))",
                  fontWeight: "800",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                }}
                className="otp-input"
              />
            )}
            containerStyle="flex flex-row-reverse gap-x-2 justify-center"
          />
        </motion.div>

        <motion.div
          className="!my-8 text-secondary-500 text-center"
          variants={actionVariants}
        >
          {time > 0 ? (
            <p>ارسال مجدد کد تا {toPersianDigits(time)} ثانیه دیگر</p>
          ) : (
            <button onClick={onResendOtp}>ارسال مجدد کد؟</button>
          )}
        </motion.div>

        <motion.div variants={actionVariants}>
          {isCheckingOtp ? (
            <Loading />
          ) : (
            <button type="submit" className="btn btn--primary w-full">
              تایید
            </button>
          )}
        </motion.div>
      </motion.form>
    </motion.div>
  );
}

export default CheckOTPForm;
