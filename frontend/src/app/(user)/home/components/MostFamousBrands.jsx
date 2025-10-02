"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import SectionHeader from "@/ui/SectionHeader";
import { RiStarFill } from "react-icons/ri";

// Import Swiper styles
import "swiper/css";

// Brand data 
const brands = [
  {
    id: 1,
    name: "Optimum Nutrition",
    image: "/images/brands/optimum-nutrition.png",
    param: "Optimum Nutrition",
  },
  {
    id: 2,
    name: "MuscleTech",
    image: "/images/brands/muscletech.png",
    param: "Muscletech",
  },
  {
    id: 3,
    name: "Dymatize",
    image: "/images/brands/dymatize.png",
    param: "Dymatize",
  },
  { id: 4, name: "BSN", image: "/images/brands/bsn.webp", param: "bsn" },
  {
    id: 5,
    name: "Cellucor",
    image: "/images/brands/Cellucor.png",
    param: "cellucor",
  },
  {
    id: 6,
    name: "MyProtein",
    image: "/images/brands/MyProtein.png",
    param: "myProtein",
  },
  {
    id: 7,
    name: "Nutrex",
    image: "/images/brands/nutrex.png",
    param: "Nutrex",
  },
];

function MostFamousBrands() {
  const router = useRouter();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleBrandClick = (brandParam) => {
    router.push(`/products?brand=${brandParam}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
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

  return (
    <div className="max-w-screen-xl mx-auto my-8 md:px-4 mb-12 lg:mb-16">
      {/* Header */}
       <div className="mb-4 md:mb-6 px-4 lg:px-0">
        <SectionHeader icon={RiStarFill} title="محبوب ترین برندها" />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="p-4"
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          dir="rtl"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            400: {
              slidesPerView: 2.2,
            },
            500: {
              slidesPerView: 2.5,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 35,
            },
            1280: {
              slidesPerView: 6,
              spaceBetween: 40,
            },
          }}
          className="famous-brands-swiper !p-4 "
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand.id}>
              <motion.div
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                className="flex justify-center items-center p-3 bg-white rounded-xl border border-secondary-300 cursor-pointer h-28 md:h-32"
                onClick={() => handleBrandClick(brand.param)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 140px"
                    className="object-contain p-2"
                  />
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  );
}

export default MostFamousBrands;
