"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { useMemo } from "react";

function FeatureSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Memoize features data to prevent recreating on every render
  const features = useMemo(
    () => [
      {
        icon: "/images/featureIcons/icon2.png",
        title: "پشتیبانی ۲۴ ساعته",
        hoverAnimation: { scale: 1.1, rotate: 5 },
      },
      {
        icon: "/images/featureIcons/icon1.png",
        title: "خدمات امن و مطمئن",
        hoverAnimation: { scale: 1.1, y: -5 },
      },
      {
        icon: "/images/featureIcons/icon3.png",
        title: "پرداخت امن و سریع",
        hoverAnimation: { scale: 1.1, rotate: -5 },
      },
      {
        icon: "/images/featureIcons/icon4.png",
        title: "تحویل سریع کالا",
        hoverAnimation: { scale: 1.1, x: 3 },
      },
    ],
    []
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  // Responsive image sizes
  const imageSizes = "(max-width: 640px) 50px, (max-width: 1024px) 60px, 64px";

  return (
    <section className="max-w-screen-xl mx-auto md:px-4 mb-12 lg:mb-16" dir="rtl">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              y: -6,
              transition: { duration: 0.2 },
            }}
            className="group flex flex-col items-center text-center p-4 cursor-pointer"
          >
            <div className="mb-3">
              <motion.div
                whileHover={feature.hoverAnimation}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative w-14 h-14 mx-auto"
              >
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  fill
                  sizes={imageSizes}
                  className="object-contain w-10 h-10"
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </motion.div>
            </div>

            <h3 className="text-base font-medium text-secondary-800 transition-colors duration-300 group-hover:text-primary-900">
              {feature.title}
            </h3>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default FeatureSection;
