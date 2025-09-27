"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { MdChecklistRtl } from "react-icons/md";
import { useInView } from "react-intersection-observer";
import SectionHeader from "@/ui/SectionHeader";
import { BsPatchQuestion } from "react-icons/bs";

// FAQ data
const faqData = [
  {
    question: "چگونه مکمل مناسب خود را انتخاب کنم؟",
    answer:
      "برای انتخاب مکمل مناسب، ابتدا هدف خود از مصرف مکمل (افزایش وزن، کاهش وزن، عضله‌سازی، افزایش انرژی و...) را مشخص کنید. سپس با توجه به سن، جنسیت، سطح فعالیت بدنی و شرایط سلامت خود، محصول مناسب را انتخاب نمایید. در صورت نیاز می‌توانید با متخصصین تغذیه ما مشورت کنید.",
  },
  {
    question: "مکمل‌های شما اورجینال و تضمین شده هستند؟",
    answer:
      "بله، تمام محصولات موجود در ساپلینو مستقیماً از نمایندگی‌های رسمی برندها تهیه شده و دارای هولوگرام اصالت هستند. ما ضمانت بازگشت وجه در صورت عدم رضایت از اصالت محصول را ارائه می‌دهیم.",
  },
  {
    question: "زمان مصرف بهینه مکمل‌ها چه موقع است؟",
    answer:
      "زمان مصرف به نوع مکمل بستگی دارد. پروتئین وی بهتر است بعد از تمرین مصرف شود، کراتین قبل یا بعد از تمرین، و مکمل‌های چربی‌ساز معمولاً قبل از غذا توصیه می‌شوند. راهنمای کامل مصرف روی هر محصول درج شده است.",
  },
  {
    question: "چقدر طول می‌کشد تا اثرات مکمل ظاهر شود؟",
    answer:
      "اثرگذاری مکمل‌ها بسته به نوع محصول و فرد متفاوت است. معمولاً مکمل‌های انرژی‌زا اثر فوری دارند، mientras que مکمل‌های عضله‌ساز و تقویتی2-4 هفته برای نشان دادن اثرات محسوس نیاز دارند.",
  },
  {
    question: "آیا مکمل‌ها عوارض جانبی دارند؟",
    answer:
      "مکمل‌های با کیفیت و اورجینال در صورت مصرف صحیح و طبق دوز توصیه شده، معمولاً عوارض جانبی جدی ندارند. اما مصرف بیش از حد یا استفاده نادرست ممکن است باعث مشکلات گوارشی، سردرد یا بی‌خوابی شود. همیشه قبل از مصرف با پزشک مشورت کنید.",
  },
  {
    question: "روش حمل و نقل و زمان تحویل چگونه است؟",
    answer:
      "ارسال سفارشات در تهران تا 24 ساعت و در سایر شهرها تا 72 ساعت انجام می‌شود. هزینه حمل و نقل برای خریدهای بالای 500 هزار تومان رایگان است. ما از بسته‌بندی محافظتی ویژه برای اطمینان از سلامت محصولات استفاده می‌کنیم.",
  },
  {
    question: "سیاست بازگشت و تعویض محصول چگونه است؟",
    answer:
      "در صورت عدم رضایت از محصول یا مشاهده هرگونه مشکل در بسته‌بندی، تا 7 روز امکان بازگشت و تعویض وجود دارد. محصول باید دست‌نخورده و در بسته‌بندی اصلی باشد. مکمل‌های باز شده به دلایل بهداشتی قابل بازگشت نیستند.",
  },
];

// Optimized animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const chevronVariants = {
  closed: { rotate: 0 },
  open: {
    rotate: 180,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const contentVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.4,
        ease: "easeInOut",
      },
      opacity: {
        duration: 0.3,
        delay: 0.1,
      },
    },
  },
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.3,
        ease: "easeInOut",
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
};

export default function SupplementFAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });

  const toggleItem = useCallback((index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  }, []);

  // Memoize FAQ items to prevent unnecessary re-renders
  const faqItems = useMemo(
    () =>
      faqData.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`rounded-lg border transition-colors duration-200 ${
              isOpen
                ? "border-primary-200 bg-primary-50 shadow-md"
                : "border-secondary-200 bg-secondary-0 hover:border-primary-100"
            }`}
          >
            <motion.button
              onClick={() => toggleItem(index)}
              className="flex items-center justify-between w-full py-4 px-5 text-right"
              aria-expanded={isOpen}
            >
              <span className="text-sm md:text-base font-semibold text-secondary-800">
                {item.question}
              </span>
              <motion.div
                variants={chevronVariants}
                animate={isOpen ? "open" : "closed"}
                className="flex-shrink-0 ml-3"
              >
                <ChevronDownIcon className="w-5 h-5 text-primary-600" />
              </motion.div>
            </motion.button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={contentVariants}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pt-2">
                    <p className="text-sm md:text-base text-secondary-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      }),
    [openIndex, toggleItem]
  );

  return (
    <section ref={ref} dir="rtl" className="md:px-4 mb-10 md:mb-16" id="faq">
      {/* Header */}
      <div className="mb-8 md:mb-10 px-4 lg:px-0">
        <SectionHeader icon={BsPatchQuestion} title="سوالات متداول" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="space-y-4"
        >
          {faqItems}
        </motion.div>

        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mt-10 pt-6 border-t border-secondary-200"
        >
          <p className="text-secondary-600 text-sm">
            پاسخ سوال خود را پیدا نکردید؟{" "}
            <a
              href="/profile/support/create"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              با پشتیبانی تماس بگیرید
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
