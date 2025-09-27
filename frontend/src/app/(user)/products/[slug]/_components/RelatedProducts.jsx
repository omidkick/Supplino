"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

// Swiper components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, Mousewheel } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Utils
import { toPersianDigits } from "@/utils/numberFormatter";
import { formatPrice } from "@/utils/formatPrice";
import truncateText from "@/utils/trancateText";

// Function to find related products based on tags, category, and brand
const findRelatedProducts = (currentProduct, allProducts, limit = 12) => {
  if (!currentProduct || !allProducts || allProducts.length === 0) {
    return [];
  }

  const currentProductId = currentProduct._id;
  const currentProductTags = currentProduct.tags || [];
  const currentProductCategory = currentProduct.category?.title;
  const currentProductBrand = currentProduct.brand;

  // Filter out current product and calculate relevance scores
  const relatedProducts = allProducts
    .filter((product) => product._id !== currentProductId)
    .map((product) => {
      let relevanceScore = 0;
      const matchDetails = {
        commonTags: [],
        sameCategory: false,
        sameBrand: false,
      };

      // Check for common tags (highest priority)
      if (currentProductTags.length > 0 && product.tags) {
        const commonTags = product.tags.filter((tag) =>
          currentProductTags.includes(tag)
        );
        matchDetails.commonTags = commonTags;
        relevanceScore += commonTags.length * 3; // Tags have highest weight
      }

      // Check for same category (medium priority)
      if (
        currentProductCategory &&
        product.category?.title === currentProductCategory
      ) {
        matchDetails.sameCategory = true;
        relevanceScore += 2; // Category has medium weight
      }

      // Check for same brand (medium priority)
      if (currentProductBrand && product.brand === currentProductBrand) {
        matchDetails.sameBrand = true;
        relevanceScore += 2; // Brand has medium weight
      }

      return {
        ...product,
        relevanceScore,
        matchDetails,
      };
    })
    .filter((product) => product.relevanceScore > 0) // Only products with some relevance
    .sort((a, b) => {
      // Primary sort: relevance score (descending)
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      // Secondary sort: rating (descending)
      if (b.rating !== a.rating) {
        return (b.rating || 0) - (a.rating || 0);
      }
      // Tertiary sort: stock availability (in stock first)
      return (b.countInStock > 0 ? 1 : 0) - (a.countInStock > 0 ? 1 : 0);
    })
    .slice(0, limit);

  return relatedProducts;
};

// Product Card Component
const ProductCard = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary-0 rounded-xl shadow-lg overflow-hidden group cursor-pointer h-full"
    >
      <Link href={`/products/${product.slug}`} className="block h-full">
        {/* Image Container - Made smaller */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.coverImageUrl}
            alt={product.title}
            className="w-full h-full object-contain p-1 md:p-2 scale-75"
          />

          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              ٪{toPersianDigits(product.discount)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-2 md:p-4 space-y-3 flex-1">
          {/* Title */}
          <div>
            <h3 className="md:hidden font-semibold text-secondary-900 text-sm leading-tight line-clamp-2">
              {truncateText(product.title, 17)}
            </h3>
            <h3 className="hidden md:block font-semibold text-secondary-900 text-sm leading-tight line-clamp-2">
              {truncateText(product.title, 30)}
            </h3>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-primary-900 md:text-lg">
                {formatPrice(product.offPrice)}
              </span>
              {product.discount > 0 ? (
                <span className="text-sm text-secondary-500 line-through">
                  {formatPrice(product.price)}
                </span>
              ) : (
                <span className="text-sm text-secondary-500 line-through">
                  --
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="text-xs">
            {product.countInStock > 0 ? (
              <span className="text-green-600 font-medium">موجود</span>
            ) : (
              <span className="text-red-500 font-medium">ناموجود</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Main Related Products Component
export default function RelatedProducts({ currentProduct, allProducts }) {
  // Get related products using memoization for performance
  const relatedProducts = useMemo(() => {
    return findRelatedProducts(currentProduct, allProducts, 12);
  }, [currentProduct, allProducts]);

  // Don't render if no related products
  if (!relatedProducts.length) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8 sm:mt-12 mb-4"
    >
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-2">
            محصولات مرتبط
          </h2>
        </div>

        {/* Products Grid/Slider */}
        <div className="relative">
          {/* Desktop Slider */}
          <div className="hidden md:block">
            <Swiper
              modules={[Navigation, Keyboard, Mousewheel]}
              spaceBetween={16}
              slidesPerView={4}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              keyboard={{
                enabled: true,
                onlyInViewport: true,
              }}
              mousewheel={{
                forceToAxis: true,
                sensitivity: 1,
                releaseOnEdges: true,
              }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 12,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 16,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 16,
                },
              }}
              className="relative"
            >
              {relatedProducts.map((product) => (
                <SwiperSlide key={product._id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}

              {/* Custom Navigation Buttons */}
              <div className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 -left-4 z-10 w-10 h-10 !bg-primary-900 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-primary-800 transition-all border border-gray-200">
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </div>
              <div className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 -right-4 z-10 w-10 h-10 !bg-primary-900 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-primary-800 transition-all border border-gray-200">
                <ChevronRightIcon className="w-5 h-5 text-white" />
              </div>
            </Swiper>
          </div>

          {/* Mobile/Tablet Grid */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {relatedProducts.slice(0, 6).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Show More Button for Mobile */}
            {relatedProducts.length > 6 && (
              <div className="mt-6 text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-primary-900 text-white px-6 py-3 rounded-xl hover:bg-primary-800 transition-colors"
                >
                  <span>مشاهده همه محصولات مرتبط</span>
                  <ChevronLeftIcon className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
