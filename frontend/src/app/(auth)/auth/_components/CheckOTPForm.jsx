import { useRef } from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import Loading from "@/ui/Loading";
import { toPersianDigits } from "@/utils/numberFormatter";
import { motion } from "framer-motion";
import CustomOTPInput from "./CustomOTPInput";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { y: 8, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "tween", duration: 0.2 },
  },
};

const headerVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "tween", duration: 0.25 },
  },
};

const titleVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "tween", duration: 0.3 },
  },
};

const otpContainerVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "tween", duration: 0.25 },
  },
};

const actionVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "tween", duration: 0.2 },
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
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6 && !isCheckingOtp) {
      onSubmit(e);
    }
  };

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
          type="button"
          aria-label="بازگشت"
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
          <button onClick={onBack} type="button" aria-label="ویرایش شماره موبایل">
            <CiEdit className="w-5 md:w-6 h-5 md:h-6 text-primary-900" />
          </button>
        </motion.p>
      )}

      {/* OTP form */}
      <motion.form
        ref={formRef}
        className="space-y-4"
        onSubmit={handleSubmit}
        variants={containerVariants}
        name="otp-verification"
      >
        <motion.p className="font-bold text-secondary-800 mb-4 !mt-10" variants={itemVariants}>
          کد تایید را وارد کنید
        </motion.p>

        <motion.div variants={otpContainerVariants}>
          <CustomOTPInput
            value={otp}
            onChange={setOtp}
            inputName="otp-code" 
          />
        </motion.div>

        <motion.div
          className="!my-8 text-secondary-500 text-center text-sm"
          variants={actionVariants}
        >
          {time > 0 ? (
            <p>ارسال مجدد کد تا {toPersianDigits(time)} ثانیه دیگر</p>
          ) : (
            <button 
              onClick={onResendOtp} 
              type="button"
              className="text-primary-900 hover:text-primary-700 font-medium transition-colors"
            >
              ارسال مجدد کد؟
            </button>
          )}
        </motion.div>

        <motion.div variants={actionVariants}>
          {isCheckingOtp ? (
            <Loading />
          ) : (
            <button 
              type="submit" 
              className="btn btn--primary w-full py-3 text-lg font-bold"
              disabled={otp.length !== 6 || isCheckingOtp}
              id="otp-submit-btn" 
            >
              {otp.length === 6 ? 'تایید' : 'کد ۶ رقمی را وارد کنید'}
            </button>
          )}
        </motion.div>
      </motion.form>
    </motion.div>
  );
}

export default CheckOTPForm;