"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  TruckIcon,
  HeartIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion"; // Added for animations

export default function AboutPage() {
  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" },
  };

  return (
    <div className="min-h-screen mb-10">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16 md:py-24 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            درباره ما
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            فروشگاه آنلاین مکمل‌های ورزشی و سلامت با مجوزهای رسمی و محصولات
            اورجینال
          </motion.p>
        </div>
      </motion.section>

      {/* Founder Section */}
      <motion.section
        className="py-16 bg-secondary-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-black text-secondary-900 mb-6">
                امید جباری
              </h2>
              <p className="text-secondary-700 text-lg leading-relaxed mb-6">
                بنیانگذار و مدیر مجموعه، با بیش از ۱۰ سال تجربه در زمینه
                مکمل‌های ورزشی و سلامت. ما با هدف ارائه محصولات باکیفیت و
                اورجینال به ورزشکاران و علاقه‌مندان به سلامت تأسیس شدیم.
              </p>
              <p className="text-secondary-700 text-lg leading-relaxed">
                تمام محصولات ما دارای مجوزهای لازم از وزارت بهداشت و سازمان غذا
                و دارو هستند و با تضمین اصالت کالا به دست شما می‌رسند.
              </p>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <motion.div
                className="relative w-64 h-64 md:w-80 md:h-80 bg-primary-100 rounded-full overflow-hidden shadow-card"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-primary-200 flex items-center justify-center">
                  <UsersIcon className="w-32 h-32 text-primary-700" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        className="py-16 bg-secondary-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-center text-secondary-900 mb-16">
            ارزش‌های ما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CheckBadgeIcon,
                title: "کیفیت برتر",
                description:
                  "ارائه محصولات با بالاترین استانداردهای کیفیت از برندهای معتبر جهانی",
              },
              {
                icon: ShieldCheckIcon,
                title: "اصالت کالا",
                description:
                  "تضمین اصالت تمام محصولات با ارائه گارانتی بازگشت وجه در صورت عدم رضایت",
              },
              {
                icon: TruckIcon,
                title: "ارسال سریع",
                description:
                  "ارسال به تمام نقاط ایران در کوتاه‌ترین زمان ممکن با بسته‌بندی مناسب",
              },
              {
                icon: HeartIcon,
                title: "پشتیبانی عالی",
                description:
                  "پشتیبانی تخصصی قبل و بعد از خرید برای راهنمایی و پاسخ به سوالات شما",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-secondary-0 p-8 rounded-xl shadow-card-md text-center hover:shadow-card transition-shadow duration-300"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary-900" />
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-secondary-700">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Licenses Section */}
      <motion.section
        className="py-16 bg-secondary-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-center text-secondary-900 mb-16">
            مجوزها و گواهی‌ها
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-6">
                مجوزهای رسمی
              </h3>
              <ul className="space-y-4">
                {[
                  "مجوز وزارت بهداشت، درمان و آموزش پزشکی",
                  "مجوز سازمان غذا و دارو",
                  "گواهی اصالت کالا از برندهای معتبر",
                  "نمایندگی رسمی برندهای بین‌المللی",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-primary-100 p-2 rounded-lg ml-4 flex-shrink-0">
                      <CheckBadgeIcon className="w-6 h-6 text-primary-900" />
                    </div>
                    <span className="text-secondary-700 text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div
              className="bg-primary-50 p-8 rounded-xl shadow-card-md"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-secondary-900 mb-6">
                تضمین کیفیت
              </h3>
              <p className="text-secondary-700 text-lg mb-6">
                تمام محصولات ما قبل از عرضه، از نظر کیفیت، اصالت و سلامت به طور
                کامل بررسی می‌شوند. ما تنها محصولاتی را ارائه می‌دهیم که خود با
                اطمینان کامل مصرف می‌کنیم.
              </p>
              <div className="bg-primary-100 p-4 rounded-lg">
                <p className="text-primary-900 font-medium">
                  "سلامت و رضایت شما اولویت اصلی ماست"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-16 bg-gradient-to-r from-primary-900 to-primary-700 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "۱۰+", label: "سال تجربه" },
              { value: "۵۰۰+", label: "محصول اورجینال" },
              { value: "۱۰,۰۰۰+", label: "مشتری راضی" },
              { value: "۱۰۰%", label: "رضایت مشتری" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-black mb-2">
                  {stat.value}
                </div>
                <div className="text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 bg-secondary-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-secondary-900 mb-6">
            به خانواده ما بپیوندید
          </h2>
          <p className="text-secondary-700 text-lg mb-10 max-w-2xl mx-auto">
            اکنون به جمع هزاران مشتری راضی ما بپیوندید و از محصولات باکیفیت و
            اورجینال ما بهره‌مند شوید.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="btn btn--primary flex items-center justify-center hover:scale-105 transition-transform duration-300"
            >
              <BuildingStorefrontIcon className="w-5 h-5 ml-2" />
              مشاهده محصولات
            </Link>
            <Link
              href="/profile/support/create"
              className="btn bg-secondary-200 text-secondary-800 hover:bg-secondary-300 hover:scale-105 transition-transform duration-300 flex items-center justify-center"
            >
              تماس با ما
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}