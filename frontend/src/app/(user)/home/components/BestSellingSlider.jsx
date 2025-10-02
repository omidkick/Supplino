"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";
import { toPersianDigits } from "@/utils/numberFormatter";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function BestSellingSlider({ products }) {
  const router = useRouter();

  const handleProductClick = (productSlug) => {
    router.push(`/products/${productSlug}`);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-secondary-500 bg-secondary-100 rounded-3xl lg:mx-12">
        هیچ محصول پرفروشی یافت نشد.
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden bg-secondary-100 rounded-3xl lg:mx-12 mb-8 lg:mb-14"
      dir="rtl"
    >
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={16}
        slidesPerView={1.2}
        dir="rtl"
        breakpoints={{
          280: {
            slidesPerView: 1.1,
            spaceBetween: 5,
          },
          320: {
            slidesPerView: 1.2,
            spaceBetween: 10,
          },
          375: {
            slidesPerView: 1.6,
            spaceBetween: 10,
          },
          425: {
            slidesPerView: 1.7,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 1.8,
            spaceBetween: 10,
          },
          560: {
            slidesPerView: 2,
            spaceBetween: 14,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 18,
          },
          900: {
            slidesPerView: 3,
            spaceBetween: 18,
          },
          1024: {
            slidesPerView: 3.6,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={products.length > 3}
        navigation={{
          nextEl: ".best-selling-swiper-button-next",
          prevEl: ".best-selling-swiper-button-prev",
        }}
        className="best-selling-swiper !px-4 !py-4"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div
              className="w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px] border border-secondary-300 rounded-xl p-3 bg-secondary-0 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 mx-auto"
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
              <div className="space-y-2">
                <h3 className="font-bold text-secondary-800 text-sm line-clamp-2 h-10 leading-5">
                  {product.title}
                </h3>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-primary-900 text-sm">
                      {formatPrice(product.finalPrice || product.price)}
                    </div>
                    {product.hasDiscount && (
                      <div className="text-xs text-secondary-500 line-through">
                        {formatPrice(product.price)}
                      </div>
                    )}
                  </div>

                  {/* Stock Status */}
                  {product.isInStock ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
                      موجود
                    </span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full whitespace-nowrap">
                      ناموجود
                    </span>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons for Better Mobile UX */}
      <div className="flex justify-center gap-4 mt-4 md:hidden">
        <button className="best-selling-swiper-button-prev bg-primary-600 text-white rounded-full p-2 shadow-lg">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <button className="best-selling-swiper-button-next bg-primary-600 text-white rounded-full p-2 shadow-lg">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
