"use client";

import { motion } from "framer-motion";
import Button from "@/ui/Button";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();

  const handleShopNow = () => {
    router.push("/products");
  };

  const handleSeeOffers = () => {
    router.push("/products?sort=discount");
  };

  // Only 2 simple animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      dir="rtl"
      className="py-2 px-4 text-center md:text-right mb-8 lg:mb-16"
    >
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Text Content - Animation 1: Fade In Up */}
        <div className="flex-1">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-secondary-800 !leading-relaxed">
              <span className="text-primary-900">مکمل‌های ورزشی</span> با کیفیت{" "}
              <br />و <span className="text-secondary-700">قیمت مناسب</span>
            </h1>

            <p className="text-secondary-400 font-semibold xl:text-lg mt-6">
              در <strong className="text-primary-800 font-bold">ساپلینو</strong>{" "}
              بهترین مکمل‌های ورزشی اورجینال با تضمین کیفیت و قیمت رقابتی را
              پیدا کنید. سلامت و تناسب اندام شما اولویت ماست!
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <Button
                variant="primary"
                className="px-5 py-3 text-base sm:px-6 sm:py-3 md:px-7 md:py-3.5 lg:px-8 lg:py-4 lg:text-lg hover:bg-primary-800 transition-all duration-300 shadow-lg hover:scale-105"
                onClick={handleShopNow}
              >
                شروع خرید
              </Button>
              <Button
                variant="outline"
                className="px-5 py-3 text-base sm:px-6 sm:py-3 md:px-7 md:py-3.5 lg:px-8 lg:py-4 lg:text-lg transition-all duration-300 shadow-lg hover:scale-105"
                onClick={handleSeeOffers}
              >
                پیشنهادهای ویژه
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Image Content - Animation 2: Scale In */}
        <div className="flex-1 h-full flex justify-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            transition={{ delay: 0.2 }}
            className="relative w-full max-w-lg mx-auto"
          >
            <img
              src="/images/whey-2.webp"
              alt="مکمل‌های ورزشی ساپلینو"
              className="w-full max-w-md mx-auto "
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
