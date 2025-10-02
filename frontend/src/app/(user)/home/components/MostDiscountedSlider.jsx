"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";
import { toPersianDigits } from "@/utils/numberFormatter";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";

export default function MostDiscountedSlider({ products }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  const handleProductClick = useCallback(
    (productSlug) => {
      router.push(`/products/${productSlug}`);
    },
    [router]
  );

  // Optimized countdown timer - fixed interval and cleanup
  useEffect(() => {
    let animationFrameId;
    let lastUpdateTime = Date.now();

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - lastUpdateTime;

      // Only update every ~1000ms (1 second) for better performance
      if (elapsed >= 1000) {
        setTimeLeft((prev) => {
          const { hours, minutes, seconds } = prev;

          if (seconds > 0) {
            return { ...prev, seconds: seconds - 1 };
          } else if (minutes > 0) {
            return { ...prev, minutes: minutes - 1, seconds: 59 };
          } else if (hours > 0) {
            return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
          } else {
            // Reset timer when it reaches zero
            return { hours: 23, minutes: 59, seconds: 59 };
          }
        });
        lastUpdateTime = now;
      }

      animationFrameId = requestAnimationFrame(updateTimer);
    };

    animationFrameId = requestAnimationFrame(updateTimer);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-secondary-500 bg-secondary-100 rounded-3xl lg:mx-12">
        هیچ محصول تخفیف‌دار یافت نشد.
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden bg-secondary-200 p-4 rounded-3xl mb-12 lg:mb-20 mx-2"
      dir="rtl"
    >
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <div className="md:w-1/4 lg:w-1/5 w-full text-center md:text-right flex flex-col items-center justify-center">
          {/* Title */}
          <div className="mb-4">
            <h2 className="text-2xl lg:text-3xl font-black text-secondary-900">
              <span className="inline md:block md:mb-2 lg:mb-3">پیشنهاد</span>{" "}
              <span className="inline md:flex items-center gap-x-[4px]">
                <span className="">شگفت</span> <span className="">انگیز</span>
              </span>
            </h2>
          </div>

          {/* Countdown Timer */}
          <div className="mb-2 md:mb-4 p-2">
            <div className="flex justify-center md:justify-start gap-2">
              <div className="flex flex-col items-center">
                <span className="bg-white text-primary-800 font-bold rounded-md px-2 py-1 text-sm">
                  {toPersianDigits(
                    timeLeft.seconds.toString().padStart(2, "0")
                  )}
                </span>
              </div>
              <span className="text-primary-800 font-bold pt-1">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-white text-primary-800 font-bold rounded-md px-2 py-1 text-sm">
                  {toPersianDigits(
                    timeLeft.minutes.toString().padStart(2, "0")
                  )}
                </span>
              </div>
              <span className="text-primary-800 font-bold pt-1">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-white text-primary-800 font-bold rounded-md px-2 py-1 text-sm">
                  {toPersianDigits(timeLeft.hours.toString().padStart(2, "0"))}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center w-16 lg:w-24 h-16 lg:h-24 mx-auto">
            <img
              src="/images/discount.webp"
              alt="discount"
              className="w-full h-full"
              loading="lazy"
            />
          </div>

          <Link
            href="/products?sort=discount"
            className="text-primary-800 text-sm font-medium mt-4 flex items-center gap-x-2"
          >
            مشاهده همه
            <HiChevronLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Slider with Swiper */}
        <div className="md:w-3/4 lg:w-4/5 w-full relative">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={16}
            slidesPerView={1.2}
            dir="rtl"
            breakpoints={{
              320: { slidesPerView: 1.2, spaceBetween: 12 },
              375: { slidesPerView: 1.3, spaceBetween: 12 },
              425: { slidesPerView: 1.4, spaceBetween: 14 },
              480: { slidesPerView: 1.6, spaceBetween: 14 },
              560: { slidesPerView: 1.8, spaceBetween: 16 },
              640: { slidesPerView: 2.2, spaceBetween: 16 },
              768: { slidesPerView: 2.5, spaceBetween: 18 },
              900: { slidesPerView: 3, spaceBetween: 18 },
              1024: { slidesPerView: 3.2, spaceBetween: 20 },
              1200: { slidesPerView: 3.5, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 20 },
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={products.length > 3}
            navigation={true}
            className="most-discounted-swiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <div
                  className="w-full border border-secondary-300 rounded-xl p-3 bg-secondary-0 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => handleProductClick(product.slug)}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square mb-3">
                    <Image
                      src={product.coverImageUrl}
                      alt={product.title}
                      fill
                      sizes="(max-width: 380px) 140px, (max-width: 640px) 160px, (max-width: 1024px) 200px, 220px"
                      className="object-contain"
                      loading="lazy"
                    />

                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ٪{toPersianDigits(product.discount)}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="text-start">
                    <h3 className="font-bold text-secondary-800 text-sm line-clamp-2 h-10">
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-bold text-primary-900">
                          {formatPrice(product.finalPrice || product.price)}
                        </div>
                        {product.hasDiscount && (
                          <div className="text-xs text-secondary-500 line-through">
                            {formatPrice(product.price)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
