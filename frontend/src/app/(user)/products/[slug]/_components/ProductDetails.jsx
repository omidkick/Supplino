"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";


// UI Components
import BackButton from "@/ui/BackButton";


// Icons
import {
  CheckCircleIcon,
  StarIcon,
  ShareIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

// Utils and Services
import { toPersianDigits } from "@/utils/numberFormatter";
import { formatPrice } from "@/utils/formatPrice";

// Components
import AddToCart from "../../_components/AddToCart";
import ImageSlider from "./ImageSlider";
import Fallback from "@/ui/Fallback";
import { useProductActions } from "@/hooks/useProducts";
import RelatedProducts from "./RelatedProducts";
import Loader from "@/ui/Loader";
import ProductInteraction from "../../_components/ProductInteraction";
import Comment from "./comments/Comment";

export default function ProductDetails({ product }) {
  const {
    products,
    isLoadingProducts,
    product: singleProduct,
    isLoadingSingleProduct,
  } = useProductActions(product?._id);

  const [selectedImage, setSelectedImage] = useState(0);

  // Create product images array from backend data
  const productImages = useMemo(() => {
    if (!product) return [];

    const images = [];

    // Add cover image as first image
    if (product.coverImageUrl) {
      images.push({
        url: product.coverImageUrl,
        alt: product.title,
        type: "cover",
      });
    }

    // Add thumbnail images
    if (product.thumbnailUrls && product.thumbnailUrls.length > 0) {
      const sortedThumbnails = product.thumbnailUrls
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((thumb) => ({
          url: thumb.url,
          alt: thumb.alt || `${product.title} - تصویر اضافی`,
          type: "thumbnail",
        }));

      images.push(...sortedThumbnails);
    }

    // Fallback: if no images available, use a placeholder
    if (images.length === 0) {
      images.push({
        url: "/images/product-placeholder.png",
        alt: product.title || "محصول",
        type: "placeholder",
      });
    }

    return images;
  }, [product]);

  // Use the server-fetched product initially, then the client-fetched one
  const currentProduct = singleProduct || product;

  if (isLoadingProducts || isLoadingSingleProduct) {
    return <Loader message="در حال بارگزاری محصول ..." />;
  }

  if (!currentProduct) {
    return (
      <Fallback message="محصول یافت نشد" subMessage="لطفاً دوباره تلاش کنید" />
    );
  }

  const { category } = currentProduct || {};

  return (
    <div className="min-h-screen my-20">
      <div className="">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-x-3 sm:gap-x-4 mb-4 sm:mb-6 lg:mb-10 py-3"
        >
          <BackButton arrowClassName="w-6 h-6" />
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-900 leading-tight">
            {product.title}
          </h1>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Images Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4"
          >
            <div className="bg-secondary-0 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
              {/* Desktop Image Gallery */}
              <div className="hidden md:block">
                <div className="relative aspect-square">
                  <img
                    src={productImages[selectedImage]?.url}
                    alt={productImages[selectedImage]?.alt || product.title}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      e.target.src = "/images/product-placeholder.png";
                    }}
                  />

                  {product.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ٪{toPersianDigits(product.discount)} تخفیف
                    </div>
                  )}

                  {/* Like Badge */}
                  {product.isLiked && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <SolidHeartIcon className="w-3 h-3" />
                      مورد علاقه
                    </div>
                  )}
                </div>

                {/* Thumbnail Navigation */}
                {productImages.length > 1 && (
                  <div className="p-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {productImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-all duration-200 ${
                            selectedImage === index
                              ? "border-primary-500 shadow-lg"
                              : "border-secondary-200 hover:border-primary-300"
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-contain rounded-lg p-1"
                            onError={(e) => {
                              e.target.src = "/images/product-placeholder.png";
                            }}
                          />
                          {/* Cover image indicator */}
                          {image.type === "cover" && (
                            <div className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs px-1 rounded-full">
                              اصلی
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Image Slider */}
              <div className="md:hidden">
                <ImageSlider
                  images={productImages.map((img) => img.url)}
                  title={product.title}
                />
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="bg-secondary-0 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Title and Actions */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
                    {product.title}
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-secondary-600">
                    <span>
                      برند:{" "}
                      <span className="font-bold text-primary-700">
                        {product.brand}
                      </span>
                    </span>
                    {product.category && (
                      <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs w-fit">
                        {product.category.title}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <ProductInteraction
                    product={singleProduct}
                    showBookmark={true}
                    className="!gap-1 sm:!gap-2"
                    iconSize="w-4 h-4 sm:w-5 sm:h-5"
                    showCounts={false}
                  />
                  <button className="p-1.5 sm:p-2 rounded-full hover:bg-secondary-100 transition-colors">
                    <ShareIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-400" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ${
                        i < (product.rating || 0)
                          ? "text-yellow-400"
                          : "text-secondary-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-secondary-600 text-xs sm:text-sm">
                  {toPersianDigits(product.rating || 0)} از ۵
                </span>
                <span className="text-secondary-400 text-xs sm:text-sm">
                  ({toPersianDigits(product.comments.length || 0)} نظر)
                </span>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-primary-50 to-secondary-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900">
                    {formatPrice(
                      product.finalPrice || product.offPrice || product.price
                    )}
                  </div>
                  {product.hasDiscount && product.discount > 0 && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-sm sm:text-base lg:text-lg text-secondary-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="badge badge--secondary !text-secondary-400 text-xs sm:text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center justify-between">
                {product.isInStock && product.countInStock > 0 ? (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-green-600">
                    <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">
                      موجود در انبار
                    </span>
                    <span className="text-xs sm:text-sm text-secondary-500">
                      ({toPersianDigits(product.countInStock)} عدد)
                    </span>
                  </div>
                ) : (
                  <div className="text-red-500 font-medium text-sm sm:text-base">
                    ناموجود
                  </div>
                )}
              </div>

              {/* Add to Cart Component */}
              <AddToCart
                product={product}
                className="pt-2 sm:pt-4 md:col-span-2 lg:w-1/2 lg:mx-auto"
                buttonClassName=""
                quantitySelectorClassName=""
                linkClassName=""
              />
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4"
        >
          <div className="bg-secondary-0 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <TruckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 text-sm sm:text-base">
                ارسال سریع
              </h3>
              <p className="text-xs sm:text-sm text-secondary-600">
                ارسال رایگان بالای ۵۰۰ هزار تومان
              </p>
            </div>
          </div>

          <div className="bg-secondary-0 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 text-sm sm:text-base">
                ضمانت اصالت
              </h3>
              <p className="text-xs sm:text-sm text-secondary-600">
                تضمین ۱۰۰٪ اصالت محصولات
              </p>
            </div>
          </div>

          <div className="bg-secondary-0 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CreditCardIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 text-sm sm:text-base">
                پرداخت امن
              </h3>
              <p className="text-xs sm:text-sm text-secondary-600">
                پرداخت امن و مطمئن
              </p>
            </div>
          </div>
        </motion.div>

        {/* Description Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 sm:mt-8 bg-secondary-0 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <InformationCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
            <h3 className="text-lg sm:text-xl font-bold text-secondary-900">
              توضیحات محصول
            </h3>
          </div>
          <p className="text-secondary-700 leading-relaxed sm:leading-loose text-sm sm:text-base">
            {product.description}
          </p>
        </motion.div>

        <RelatedProducts currentProduct={product} allProducts={products} />

        <Comment productId={product?._id} />
      </div>
    </div>
  );
}
