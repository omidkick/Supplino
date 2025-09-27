"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import Button from "@/ui/Button";
import { useRouter } from "next/navigation";
import SectionHeader from "@/ui/SectionHeader";
import { GiFruitBowl } from "react-icons/gi";

function NutritionPlanSection() {
  const isDesktop = useIsDesktop();
  const router = useRouter();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleSeePlans = () => {
    router.push("/home");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      x: isDesktop ? 60 : 0,
      y: isDesktop ? 0 : 40,
      scale: 0.9,
      rotate: isDesktop ? 5 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 2.2,
      },
    },
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      x: isDesktop ? -60 : 0,
      y: isDesktop ? 0 : 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 18,
        duration: 1,
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const textItemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      x: isDesktop ? -20 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  return (
    <div className="md:px-4">
      {/* Header */}
      <SectionHeader icon={GiFruitBowl} title="برنامه غذایی" />

      {/* Main Content */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-6 px-4 md:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 mb-8 lg:mb-12 gap-y-16 w-full"
      >
        {/* Left Section (Image) */}
        <motion.div
          className="flex-1 flex justify-center "
          variants={imageVariants}
        >
          <motion.img
            src="/images/bodybuilder2.png"
            alt="Nutrition Plan Illustration"
            className="w-full max-w-lg sm:max-w-sm md:max-w-xl lg:max-w-3xl "
          />
        </motion.div>

        {/* Right Section (Info) */}
        <motion.div
          className="flex-1 space-y-6 text-right"
          variants={contentVariants}
        >
          {/* Heading */}
          <motion.h2
            className="text-xl sm:text-2xl font-black text-secondary-900 mb-2 inline-block"
            variants={textItemVariants}
          >
            شکم در باشگاه ساخته نمی‌شود، در آشپزخانه ساخته می‌شود.{" "}
          </motion.h2>

          {/* Intro Paragraph */}
          <motion.p
            className="text-sm lg:text-base text-secondary-400 font-medium leading-relaxed"
            variants={textItemVariants}
          >
            با برنامه‌های تغذیه‌ای علمی و شخصی‌سازی شده، به
            <motion.span className="text-primary-700 font-semibold">
              {" "}
              بهترین نتایج{" "}
            </motion.span>
            در کوتاه‌ترین زمان دست پیدا کنید. برنامه‌هایی برای تمام اهداف از
            چربی‌سوزی تا عضله‌سازی.
          </motion.p>

          {/* Benefits List */}
          <motion.div variants={textItemVariants}>
            <motion.ul className="space-y-3 text-secondary-500 text-sm mb-6">
              {[
                "برنامه‌های غذایی شخصی‌سازی شده بر اساس متابولیسم بدن شما",
                "تنوع غذایی با در نظر گیری ذائقه و شرایط شما",
                "مشاوره با متخصصین تغذیه مجرب",
                "پشتیبانی مستمر و تنظیم برنامه بر اساس پیشرفت",
                "محاسبه دقیق کالری و درشت‌مغذی‌ها",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={
                    inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
                  }
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <span className="text-primary-700 font-bold">•</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Call to Action Button */}
          <motion.div
            variants={textItemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              className="px-6 py-3 text-base font-medium"
              onClick={handleSeePlans}
            >
              دریافت برنامه غذایی اختصاصی
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NutritionPlanSection;
