"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";
import { toPersianDigits } from "@/utils/numberFormatter";
import Image from "next/image";

export default function BestSellingSlider({ products }) {
  const sliderRef = useRef();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);

  // Animation Setup
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  // Auto-scroll using animation frame
  useAnimationFrame((t, delta) => {
    if (!isHovered && sliderRef.current && products.length > 3) {
      const scrollWidth = sliderRef.current.scrollWidth / 2;
      let currentX = x.get();
      currentX += (delta / 1000) * 30;

      if (Math.abs(currentX) >= scrollWidth) {
        currentX = 0;
      }
      x.set(currentX);
    }
  });

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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="overflow-hidden bg-secondary-100 rounded-3xl lg:mx-12 mb-8 lg:mb-14"
      dir="rtl"
    >
      <div className="overflow-hidden">
        <motion.div
          ref={sliderRef}
          className="flex flex-nowrap p-4"
          style={{ x }}
        >
          {[...products, ...products].map((product, idx) => (
            <motion.div
              key={`${product._id}-${idx}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex-shrink-0 w-[220px] sm:w-[250px] border border-secondary-300 rounded-xl p-3 mr-4 bg-secondary-0 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProductClick(product.slug)}
            >
              {/* Product Image */}
              <div className="relative aspect-square mb-3">
                <Image
                  src={
                    product.coverImageUrl || "/images/product-placeholder.png"
                  }
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 220px, (max-width: 1024px) 250px, 250px"
                  priority={true}
                  className="object-contain"
                />

                {/* Sale Count Badge */}
                <div className="absolute top-2 left-2 bg-primary-700 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {toPersianDigits(product.saleCount)} فروش
                </div>

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    ٪{toPersianDigits(product.discount)}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
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

                  {/* Stock Status */}
                  {product.isInStock ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      موجود
                    </span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      ناموجود
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
