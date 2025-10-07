"use client";

import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { toPersianDigits } from "@/utils/numberFormatter";
import CoverImage from "./CoverImage";
import ProductInteraction from "./ProductInteraction";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";
import useCartActions from "@/hooks/useCartActions";
import { useGetUser } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import AddToCart from "./AddToCart";

import { useProductActions } from "@/hooks/useProducts";

const ProductCard = ({ product: serverProduct }) => {
  const { product: clientProduct } = useProductActions(serverProduct?._id);
  const product = clientProduct || serverProduct;

  // Calculate discount percentage
  const discountPercentage = product.discount || 0;
  const hasDiscount = discountPercentage > 0;
  const isOutOfStock = product.countInStock === 0;
  const router = useRouter();
  const { addToCart, isAdding } = useCartActions();
  const { data } = useGetUser();
  const { user, cart } = data || {};
  const [isHovered, setIsHovered] = useState(false);

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    // Cap rating at 5 to prevent generating more than 5 stars
    const cappedRating = Math.min(rating, 5);
    const fullStars = Math.floor(cappedRating);
    const hasHalfStar = cappedRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="w-4 h-4 text-gray-300" />
          <StarIconSolid
            className="w-4 h-4 text-yellow-400 absolute top-0 left-0"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(cappedRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  // Handel redirect to product's details
  const handleCardClick = () => {
    router.push(`/products/${product.slug}`);
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on Saplino`,
        url: `${window.location.origin}/products/${product.slug}`,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `${window.location.origin}/products/${product.slug}`
      );
      toast.success("لینک محصول کپی شد");
    }
  };

  return (
    <div
      className="group relative rounded-xl overflow-hidden cursor-pointer bg-secondary-0 transition-all duration-300"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mobile and Desktop Layout */}
      <div className="flex flex-row md:flex-col">
        {/* Image Container */}
        <div className="relative w-1/3 md:w-full aspect-square md:aspect-square overflow-hidden flex-shrink-0">
          {/* Cover Image */}
          <CoverImage {...product} className="p-2 md:p-4" />

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3 badge badge--primary text-xs md:text-sm">
              {toPersianDigits(discountPercentage)}%
            </div>
          )}

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-secondary-0/60 dark:bg-secondary-0/70 flex items-center justify-center">
              <span className="bg-red-500 text-white px-2 py-1 md:px-3 md:py-1.5 rounded text-xs md:text-sm font-medium">
                ناموجود
              </span>
            </div>
          )}

          {/* Desktop Hover Actions */}
          <div className="absolute top-2 right-2 hidden md:flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className="flex flex-col gap-2">
              <ProductInteraction
                product={product}
                showBookmark={true}
                showShare={true}
                onShare={handleShare}
                className="flex-col !gap-2"
                iconSize="w-5 h-5"
                showCounts={true}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 md:p-4 md:py-3 flex flex-col">
          {/* Title */}
          <h3 className="font-bold md:font-bold text-secondary-500 mb-2 line-clamp-2 leading-tight text-sm md:text-base xl:text-lg">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-1 md:gap-2 mb-2">
            <span className="font-bold text-secondary-900 text-sm md:text-base">
              {formatPrice(product.offPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs md:text-sm text-secondary-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-2 md:mb-3">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating)}
              </div>
              <span className="text-xs md:text-sm text-secondary-500">
                ({toPersianDigits(product.numReviews)})
              </span>
            </div>
            {/* Mobile Product Interactions */}
            <div className="md:hidden">
              <ProductInteraction
                product={product}
                showBookmark={true}
                className="justify-end"
                iconSize="w-4 h-4"
              />
            </div>
          </div>

          {/* Stock Status */}
          {!isOutOfStock ? (
            <p className="text-xs text-success mb-2 md:mb-3">
              {product.countInStock > 10 ? (
                "موجود در انبار"
              ) : (
                <span className="text-red-500">{`تنها ${toPersianDigits(
                  product.countInStock
                )} عدد`}</span>
              )}
            </p>
          ) : (
            <p className="text-xs text-red-500 mb-2 md:mb-3">اتمام موجودی</p>
          )}

          {/* Add to Cart Button */}
          <div className="mt-auto">
            <AddToCart
              product={product}
              showQuantityControls={false}
              disabled={isOutOfStock}
              className="!mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
