import Loading from "@/ui/Loading";
import TextField from "@/ui/TextField";
import { motion } from "framer-motion";

// Animation variants optimized for mobile
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    y: 15,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
      duration: 0.5,
    },
  },
};

const headerVariants = {
  hidden: {
    y: -10,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.6,
    },
  },
};

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 15,
      duration: 0.7,
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const buttonVariants = {
  hidden: {
    y: 10,
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.6,
    },
  },
};

function SendOTPFrom({ phoneNumber, onChange, onSubmit, isLoading }) {
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
        className="space-y-10"
        onSubmit={onSubmit}
        variants={formVariants}
      >
        <motion.div variants={itemVariants}>
          <TextField
            label="لطفا شماره موبایل خود را وارد کنید"
            name="phoneNumber"
            id="phoneNumber"
            value={phoneNumber}
            onChange={onChange}
          />
        </motion.div>

        <motion.div variants={buttonVariants}>
          {isLoading ? (
            <Loading />
          ) : (
            <button type="submit" className="btn btn--primary w-full">
              ارسال کد تایید
            </button>
          )}
        </motion.div>
      </motion.form>
    </motion.div>
  );
}

export default SendOTPFrom;
