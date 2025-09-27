"use client";

import { useEffect } from "react";
import RHFTextField from "@/ui/RHFTextField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Loading from "@/ui/Loading";
import Button from "@/ui/Button";
import useCompleteProfile from "./_/useCompleteProfile";
import { HiArrowNarrowRight } from "react-icons/hi";
import AuthLayout from "../_components/AuthLayout";
import { useStep } from "@/context/StepContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Spinner } from "@/ui/Spinner";

// Animation Variants
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const schema = Yup.object({
  name: Yup.string()
    .min(3, "نام باید حداقل ۳ کاراکتر باشد")
    .required("وارد کردن نام و نام خانوادگی الزامی است"),
  email: Yup.string()
    .email("فرمت ایمیل معتبر نیست")
    .required("وارد کردن ایمیل الزامی است"),
});

function CompleteProfile() {
  const { setCurrentStep } = useStep();
  const router = useRouter();

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const { isPending, completeProfile } = useCompleteProfile();

  const onSubmit = (data) => {
    completeProfile(data);
  };

  if (isPending) return <Loading />;

  return (
    <AuthLayout showDecorative={true} showSteps={true}>
      <motion.div
        className="max-w-md mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div>
          <motion.div
            className="relative flex items-center justify-between mb-10"
            variants={itemVariants}
          >
            <button
              type="button"
              className="p-1 border border-secondary-500 rounded-xl z-10"
              onClick={() => router.push("/auth")}
            >
              <HiArrowNarrowRight className="w-6 h-6 text-secondary-500" />
            </button>

            <h2 className="absolute left-1/2 -translate-x-1/2 font-black text-3xl text-secondary-900 text-center">
              ساپلینو
            </h2>
          </motion.div>

          <motion.p
            className="font-bold text-secondary-800 mb-6 lg:text-lg"
            variants={itemVariants}
          >
            تکمیل اطلاعات
          </motion.p>

          <motion.p className="text-secondary-400 mb-4" variants={itemVariants}>
            لطفا اطلاعات خود را کامل کنید.
          </motion.p>
        </div>

        <motion.form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <RHFTextField
              label="نام و نام خانوادگی"
              name="name"
                id="name" 
              register={register}
              errors={errors}
              isRequired
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <RHFTextField
              label="ایمیل"
              name="email"
                id="email" 
              register={register}
              errors={errors}
              isRequired
              dir="ltr"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            {isPending ? (
              <Loading />
            ) : (
              <Button
                type="submit"
                className="w-full"
                variant="primary"
                disabled={isPending}
              >
                تایید
              </Button>
            )}
          </motion.div>
        </motion.form>
      </motion.div>
    </AuthLayout>
  );
}

export default CompleteProfile;
