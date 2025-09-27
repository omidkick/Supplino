"use client";

// Imports
import { motion } from "framer-motion";
import Button from "@/ui/Button";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

const headingVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.2,
    },
  },
};

const paragraphVariants = {
  hidden: {
    opacity: 0,
    y: 25,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.4,
    },
  },
};

const buttonContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const buttonVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

const imageContainerVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotateY: -15,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3,
    },
  },
};

const imageVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.5,
    },
  },
};

const HeroSection = () => {
  const isDesktop = useIsDesktop();
  const router = useRouter();

  const handleShopNow = () => {
    router.push("/products");
  };

  const handleSeeOffers = () => {
    router.push("/products?sort=discount");
  };

  const { ref: textRef, inView: textInView } = useInView({
    triggerOnce: true,
    threshold: isDesktop ? 0.4 : 0.2,
    rootMargin: "50px",
  });

  const { ref: imageRef, inView: imageInView } = useInView({
    triggerOnce: true,
    threshold: isDesktop ? 0.3 : 0.1,
    rootMargin: "30px",
  });

  const TextContent = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={textInView ? "visible" : "hidden"}
    >
      <motion.h1
        className="text-3xl lg:text-4xl xl:text-5xl font-black text-secondary-800 !leading-relaxed"
        variants={headingVariants}
      >
        <span className="text-primary-900">مکمل‌های ورزشی</span> با کیفیت <br />
        و <span className="text-secondary-700">قیمت مناسب</span>
      </motion.h1>

      <motion.p
        className="text-secondary-400 font-semibold xl:text-lg mt-6"
        variants={paragraphVariants}
      >
        در <strong className="text-primary-800 font-bold">ساپلینو</strong>{" "}
        بهترین مکمل‌های ورزشی اورجینال با تضمین کیفیت و قیمت رقابتی را پیدا
        کنید. سلامت و تناسب اندام شما اولویت ماست!
      </motion.p>

      <motion.div
        className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start"
        variants={buttonContainerVariants}
      >
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            variant="primary"
            className="px-5 py-3 text-base sm:px-6 sm:py-3 md:px-7 md:py-3.5 lg:px-8 lg:py-4 lg:text-lg hover:bg-primary-800 transition-colors duration-300 shadow-lg"
            onClick={handleShopNow}
          >
            شروع خرید
          </Button>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            variant="outline"
            className="px-5 py-3 text-base sm:px-6 sm:py-3 md:px-7 md:py-3.5 lg:px-8 lg:py-4 lg:text-lg transition-colors duration-300 shadow-lg"
            onClick={handleSeeOffers}
          >
            پیشنهادهای ویژه
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  const ImageContent = (
    <motion.div
      className="relative w-full max-w-lg mx-auto"
      variants={imageContainerVariants}
      initial="hidden"
      animate={imageInView ? "visible" : "hidden"}
    >
      {/* Main Image */}
      <motion.div className="relative z-10" variants={imageVariants}>
        <motion.img
          src="/images/whey-2.webp"
          alt="مکمل‌های ورزشی ساپلینو"
          className="w-full max-w-md mx-auto rounded-2xl"
          style={{
            filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15))",
          }}
        />
      </motion.div>
    </motion.div>
  );

  return (
    <section
      dir="rtl"
      className="py-2 px-4 text-center md:text-right mb-8 lg:mb-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        <div ref={textRef} className="flex-1">
          {TextContent}
        </div>

        <div ref={imageRef} className="flex-1 h-full flex justify-center">
          {ImageContent}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
