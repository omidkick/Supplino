import Loading from "@/ui/Loading";
import TextField from "@/ui/TextField";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.2,
    },
  },
};

const headerVariants = {
  hidden: { y: -8, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.25,
    },
  },
};

const formVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      duration: 0.3,
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const buttonVariants = {
  hidden: { y: 8, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.2,
    },
  },
};

function SendOTPFrom({ phoneNumber, onChange, onSubmit, isLoading }) {
  const handlePhoneChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = numericValue;
    onChange(e);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.h2
        className="font-black text-3xl text-secondary-900 text-center mb-6"
        variants={headerVariants}
      >
        ساپلینو
      </motion.h2>

      <motion.p
        className="font-bold text-secondary-800 mb-8 text-lg"
        variants={itemVariants}
      >
        ورود | ثبت نام
      </motion.p>

      <motion.p className="text-secondary-400 mb-2" variants={itemVariants}>
        سلام !
      </motion.p>

      <motion.form
        className="space-y-8"
        onSubmit={onSubmit}
        variants={formVariants}
      >
        <motion.div variants={itemVariants}>
          <TextField
            label="لطفا شماره موبایل خود را وارد کنید"
            name="phoneNumber"
            id="phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneChange}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="09××××××××"
            dir="ltr"
          />
        </motion.div>

        <motion.div variants={buttonVariants}>
          {isLoading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="btn btn--primary w-full"
              disabled={!phoneNumber || phoneNumber.length < 11 || isLoading}
              id="send-otp-btn"
            >
              ارسال کد تایید
            </button>
          )}
        </motion.div>
      </motion.form>
    </motion.div>
  );
}

export default SendOTPFrom;
