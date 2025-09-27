"use client";

import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

function CategorySlider({ categories }) {
  const router = useRouter();

  const handleCategoryClick = (englishTitle) => {
    router.push(`/products?category=${englishTitle}`);
  };

  // SVG Blob Background Component
  const BlobBackground = () => (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full transition-all duration-300 group-hover:scale-125"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="blob-gradient" x1="0" x2="1" y1="1" y2="0">
          <stop stopColor="rgba(67.939, 55, 248, 0.7)" offset="0%"></stop>
          <stop stopColor="rgba(31, 224.917, 251, 0.7)" offset="100%"></stop>
        </linearGradient>
      </defs>
      <path
        fill="url(#blob-gradient)"
        d="M23.9,-12C30.4,-2.6,34.7,9.9,30.3,18.9C25.9,27.9,13,33.4,1,32.9C-11,32.3,-22.1,25.7,-27.1,16.4C-32.1,7,-31,-5.1,-25.5,-14C-20,-22.9,-10,-28.5,-0.6,-28.1C8.7,-27.8,17.5,-21.4,23.9,-12Z"
        width="100%"
        height="100%"
        transform="translate(50 50)"
        strokeWidth="0"
      ></path>
    </svg>
  );

  return (
    <section className="my-12 md:my-16 px-4 md:px-8">
      <div className="container mx-auto relative group/slider-container">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".category-swiper-button-next",
            prevEl: ".category-swiper-button-prev",
          }}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 28,
            },
            1280: {
              slidesPerView: 6,
              spaceBetween: 32,
            },
          }}
          className="relative"
        >
          {categories.map((category) => (
            <SwiperSlide key={category._id}>
              <button
                onClick={() => handleCategoryClick(category.englishTitle)}
                className="flex flex-col items-center w-full group relative px-2 py-4"
              >
                {/* Container for background and image */}
                <div className="relative w-40 h-40 mb-3 flex items-center justify-center">
                  {/* SVG Blob Background */}
                  <div className="absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    <BlobBackground />
                  </div>

                  {/* Image Container */}
                  <div className="w-[120px] h-[120px] rounded-full group-hover:border-primary-100 flex items-center justify-center relative z-20 ">
                    {category.image ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.title}
                        width={88}
                        height={88}
                        priority={true}
                        className="w-full h-full object-contain rotate-12 transition-all duration-300 z-20"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-secondary-600 font-bold text-lg">
                          {category.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-sm md:text-base font-medium text-secondary-700 group-hover:text-primary-900 transition-colors text-center">
                  {category.title}
                </span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation buttons */}
        <button
          className="category-swiper-button-next absolute top-1/2 -left-4 md:-left-6 z-10 -translate-y-1/2 bg-primary-200 rounded-full p-3 shadow-card hover:shadow-card-md transition-all duration-300 cursor-pointer opacity-0 group-hover/slider-container:opacity-100 hover:bg-primary-50 border border-secondary-200 group/btn"
          onClick={(e) => e.stopPropagation()}
        >
          <HiChevronLeft className="w-5 h-5 text-primary-900 group-hover/btn:text-primary-800 transition-colors" />
        </button>
        <button
          className="category-swiper-button-prev absolute top-1/2 -right-4 md:-right-6 z-10 -translate-y-1/2 bg-primary-200 rounded-full p-3 shadow-card hover:shadow-card-md transition-all duration-300 cursor-pointer opacity-0 group-hover/slider-container:opacity-100 hover:bg-primary-50 border border-secondary-200 group/btn"
          onClick={(e) => e.stopPropagation()}
        >
          <HiChevronRight className="w-5 h-5 text-primary-900 group-hover/btn:text-primary-800 transition-colors" />
        </button>
      </div>
    </section>
  );
}

export default CategorySlider;
