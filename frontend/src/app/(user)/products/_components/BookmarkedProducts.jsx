"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useProductActions } from "@/hooks/useProducts";
import { formatPrice } from "@/utils/formatPrice";
import { toPersianDigits } from "@/utils/numberFormatter";
import Loader from "@/ui/Loader";
import Fallback from "@/ui/Fallback";
import Image from "next/image";
import ProductInteraction from "./ProductInteraction";

function BookmarkedProducts() {
  const { products, isLoadingProducts } = useProductActions();

  // Filter bookmarked products
  const bookmarkedProducts = useMemo(() => {
    return products?.filter(product => product.isBookmarked) || [];
  }, [products]);

  if (isLoadingProducts) {
    return <Loader message="در حال بارگذاری محصولات نشانک‌گذاری شده..." />;
  }

  if (bookmarkedProducts.length === 0) {
    return (
      <Fallback 
        message="محصول نشانک‌گذاری شده‌ای یافت نشد" 
        subMessage="می‌توانید با کلیک روی آیکون نشانک در صفحات محصولات، آنها را ذخیره کنید"
      />
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-secondary-900">
          محصولات نشانک‌گذاری شده
        </h1>
        <p className="text-secondary-500 text-sm sm:text-base mt-1">
          {toPersianDigits(bookmarkedProducts.length)} محصول ذخیره شده
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {bookmarkedProducts.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-secondary-0 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Product Image */}
            <div className="relative aspect-square">
              <Image
                src={product.coverImageUrl || "/images/product-placeholder.png"}
                alt={product.title}
                fill
                className="object-contain p-4"
                onError={(e) => {
                  e.target.src = "/images/product-placeholder.png";
                }}
              />
              
              {/* Discount Badge */}
              {product.discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  ٪{toPersianDigits(product.discount)} تخفیف
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-sm sm:text-base font-bold text-secondary-900 line-clamp-2">
                  {product.title}
                </h3>
                <ProductInteraction 
                  product={product} 
                  showBookmark={true}
                  className="!gap-1"
                  iconSize="w-4 h-4"
                  showCounts={false}
                />
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-lg font-bold text-primary-900">
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
      </div>
    </div>
  );
}

export default BookmarkedProducts;