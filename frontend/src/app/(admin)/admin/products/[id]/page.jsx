"use client";

import { useProductActions } from "@/hooks/useProducts";
import Loader from "@/ui/Loader";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiEdit,
  FiTrash2,
  FiEye,
  FiPackage,
  FiTag,
  FiCalendar,
  FiDollarSign,
  FiStar,
  FiHeart,
  FiBarChart,
  FiImage,
  FiInfo,
  FiSettings,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { formatPrice } from "@/utils/formatPrice";
import { formatDate } from "@/utils/dateFormatter";
import { useState } from "react";
import { toPersianNumbers } from "@/utils/toPersianNumbers";
import Empty from "@/ui/Empty";
import Button from "@/ui/Button";
import ConfirmDelete from "@/ui/ConfirmDelete";
import Modal from "@/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";

function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const {
    product,
    isLoadingSingleProduct,
    mutateRemoveProduct,
    isRemovingProduct,
  } = useProductActions(id);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Loader
  if (isLoadingSingleProduct) {
    return <Loader message="در حال بارگزاری محصول ..." />;
  }

  if (!product) return <Empty resourceName="محصولی" />;

  const discountPercentage = product.discount || 0;
  const isInStock = product.countInStock > 0;
  const hasDiscount = discountPercentage > 0;
  const finalPrice = hasDiscount ? product.offPrice : product.price;

  const tabs = [
    { id: "overview", label: "نمای کلی", icon: FiInfo },
    { id: "analytics", label: "آمار و تحلیل", icon: FiBarChart },
    { id: "settings", label: "تنظیمات", icon: FiSettings },
  ];

  const handleEdit = () => {
    router.push(`/admin/products/${id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    mutateRemoveProduct(id);
    setShowDeleteModal(false);
  };

  // Animation variants
  const tabContentVariants = {
    hidden: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-secondary-200"
      >
        <div className="py-4 md:py-6 ">
          {/* Breadcrumb and Actions */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/admin/products")}
                className="flex items-center gap-2 text-secondary-400 hover:text-primary-600 transition-colors group"
              >
                <FiArrowRight className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm md:text-base">بازگشت به لیست</span>
              </button>
              <span className="text-secondary-400">/</span>
              <span className="text-secondary-800 font-medium text-sm md:text-base">
                جزئیات محصول
              </span>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <Button
                onClick={handleEdit}
                variant="primary"
                className="flex items-center gap-2 text-sm md:text-base px-3 md:px-4 py-2"
              >
                <FiEdit className="w-4 h-4" />
                <span className="hidden sm:inline">ویرایش</span>
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                className="flex items-center gap-2 text-sm md:text-base px-3 md:px-4 py-2"
              >
                <FiTrash2 className="w-4 h-4" />
                <span className="hidden sm:inline">حذف</span>
              </Button>
            </div>
          </div>

          {/* Product Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {/* Product Image */}
            <motion.div variants={cardVariants} className="lg:col-span-1">
              <div className="bg-secondary-50 rounded-2xl border border-secondary-200 p-4 md:p-6 aspect-square flex items-center justify-center relative overflow-hidden">
                {product.coverImageUrl ? (
                  <img
                    src={product.coverImageUrl}
                    alt={product.title}
                    className="w-full h-full object-fill rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-secondary-400">
                    <FiImage className="w-12 h-12 md:w-16 md:h-16" />
                  </div>
                )}

                {hasDiscount && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute top-3 right-3 badge badge--error text-xs font-bold"
                  >
                    {toPersianNumbers(discountPercentage)}%
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              variants={cardVariants}
              className="lg:col-span-2 space-y-4"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-secondary-800 leading-tight">
                    {product.title}
                  </h1>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium self-start ${
                      isInStock
                        ? "bg-success/10 text-success"
                        : "bg-error/10 text-error"
                    }`}
                  >
                    {isInStock ? "موجود" : "ناموجود"}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                  <span className="text-xs md:text-sm bg-primary-100 text-primary-800 px-2 md:px-3 py-1 rounded-lg">
                    {product.category?.title || "بدون دسته‌بندی"}
                  </span>
                  <span className="text-xs md:text-sm bg-secondary-100 text-secondary-700 px-2 md:px-3 py-1 rounded-lg">
                    برند: {product.brand}
                  </span>
                  <span className="text-xs md:text-sm bg-secondary-100 text-secondary-700 px-2 md:px-3 py-1 rounded-lg">
                    کد: {product.slug}
                  </span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                <motion.div
                  variants={cardVariants}
                  className="bg-secondary-50 rounded-xl p-3 md:p-4 border border-secondary-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FiDollarSign className="w-3 h-3 md:w-4 md:h-4 text-success" />
                    <span className="text-xs text-secondary-400">
                      قیمت فعلی
                    </span>
                  </div>
                  <div className="font-bold text-secondary-800 text-sm md:text-base">
                    {formatPrice(finalPrice)}
                  </div>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  className="bg-secondary-50 rounded-xl p-3 md:p-4 border border-secondary-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FiPackage className="w-3 h-3 md:w-4 md:h-4 text-primary-600" />
                    <span className="text-xs text-secondary-400">موجودی</span>
                  </div>
                  <div className="font-bold text-secondary-800 text-sm md:text-base">
                    {toPersianNumbers(product.countInStock)} عدد
                  </div>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  className="bg-secondary-50 rounded-xl p-3 md:p-4 border border-secondary-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FiStar className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                    <span className="text-xs text-secondary-400">امتیاز</span>
                  </div>
                  <div className="font-bold text-secondary-800 text-sm md:text-base">
                    {toPersianNumbers(product.rating || 0)} از ۵
                  </div>
                </motion.div>

                <motion.div
                  variants={cardVariants}
                  className="bg-secondary-50 rounded-xl p-3 md:p-4 border border-secondary-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FiHeart className="w-3 h-3 md:w-4 md:h-4 text-error" />
                    <span className="text-xs text-secondary-400">
                      علاقه‌مندان
                    </span>
                  </div>
                  <div className="font-bold text-secondary-800 text-sm md:text-base">
                    {toPersianNumbers(product.likesCount || 0)} نفر
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className=" py-4 md:py-8 ">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-secondary-0 border border-secondary-200 rounded-xl mb-8"
        >
          {/* Mobile Tab Selector */}
          <div className="block md:hidden border-b border-secondary-200 p-4">
            <label htmlFor="tab-selector" className="sr-only">
              انتخاب برگه
            </label>
            <select
              id="tab-selector"
              name="tab-selector"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-3 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-800 font-medium"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex border-b border-secondary-200 overflow-x-auto">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 font-medium transition-all whitespace-nowrap min-w-0 ${
                  activeTab === tab.id
                    ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50"
                    : "text-secondary-400 hover:text-secondary-800 hover:bg-secondary-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm md:text-base">{tab.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="p-4 md:p-6">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6 md:space-y-8"
                >
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-secondary-800 mb-4 flex items-center gap-2">
                      <FiInfo className="w-4 md:w-5 h-4 md:h-5" />
                      اطلاعات پایه
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-4">
                        <motion.div
                          variants={cardVariants}
                          className="bg-secondary-50 rounded-xl p-4 border border-secondary-200"
                        >
                          <div className="text-sm font-medium text-secondary-400 mb-2">
                            عنوان محصول
                          </div>
                          <p className="text-secondary-800 font-medium">
                            {product.title}
                          </p>
                        </motion.div>

                        <motion.div
                          variants={cardVariants}
                          className="bg-secondary-50 rounded-xl p-4 border border-secondary-200"
                        >
                          <div className="text-sm font-medium text-secondary-400 mb-2">
                            برند
                          </div>
                          <p className="text-secondary-800">{product.brand}</p>
                        </motion.div>

                        <motion.div
                          variants={cardVariants}
                          className="bg-secondary-50 rounded-xl p-4 border border-secondary-200"
                        >
                          <div className="text-sm font-medium text-secondary-400 mb-2">
                            دسته‌بندی
                          </div>
                          <p className="text-secondary-800">
                            {product.category?.title || "تعریف نشده"}
                          </p>
                        </motion.div>
                      </div>

                      <div className="space-y-4">
                        <motion.div
                          variants={cardVariants}
                          className="bg-secondary-50 rounded-xl p-4 border border-secondary-200"
                        >
                          <div className="text-sm font-medium text-secondary-400 mb-2">
                            قیمت اصلی
                          </div>
                          <p className="text-secondary-800 font-bold">
                            {formatPrice(product.price)}
                          </p>
                        </motion.div>

                        {hasDiscount && (
                          <motion.div
                            variants={cardVariants}
                            className="bg-secondary-50 rounded-xl p-4 border border-secondary-200"
                          >
                            <div className="text-sm font-medium text-secondary-400 mb-2">
                              قیمت با تخفیف
                            </div>
                            <p className="text-success font-bold">
                              {formatPrice(product.offPrice)}
                            </p>
                          </motion.div>
                        )}

                        <motion.div
                          variants={cardVariants}
                          className="bg-secondary-50 rounded-xl p-4 border border-secondary-200"
                        >
                          <div className="text-sm font-medium text-secondary-400 mb-2">
                            درصد تخفیف
                          </div>
                          <p className="text-secondary-800">
                            {toPersianNumbers(discountPercentage)}%
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {product.description && (
                    <motion.div variants={cardVariants}>
                      <h3 className="text-base md:text-lg font-bold text-secondary-800 mb-4">
                        توضیحات
                      </h3>
                      <div className="bg-secondary-50 rounded-xl p-4 md:p-6 border border-secondary-200">
                        <p className="text-secondary-700 leading-relaxed text-sm md:text-base">
                          {product.description}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <motion.div variants={cardVariants}>
                      <h3 className="text-base md:text-lg font-bold text-secondary-800 mb-4 flex items-center gap-2">
                        <FiTag className="w-4 md:w-5 h-4 md:h-5" />
                        برچسب‌ها
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-primary-100 text-primary-800 px-3 py-2 rounded-lg text-sm font-medium"
                          >
                            #{tag}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* System Information */}
                  <motion.div variants={cardVariants}>
                    <h3 className="text-base md:text-lg font-bold text-secondary-800 mb-4 flex items-center gap-2">
                      <FiCalendar className="w-4 md:w-5 h-4 md:h-5" />
                      اطلاعات سیستم
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-200">
                        <div className="text-sm font-medium text-secondary-400 mb-2">
                          تاریخ ایجاد
                        </div>
                        <p className="text-secondary-800 text-sm md:text-base">
                          {formatDate(product.createdAt)}
                        </p>
                      </div>

                      <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-200">
                        <div className="text-sm font-medium text-secondary-400 mb-2">
                          آخرین بروزرسانی
                        </div>
                        <p className="text-secondary-800 text-sm md:text-base">
                          {formatDate(product.updatedAt)}
                        </p>
                      </div>

                      <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-200">
                        <div className="text-sm font-medium text-secondary-400 mb-2">
                          شناسه محصول
                        </div>
                        <p className="text-secondary-800 font-mono text-xs md:text-sm break-all">
                          {product._id}
                        </p>
                      </div>

                      <div className="bg-secondary-50 rounded-xl p-4 border border-secondary-200">
                        <div className="text-sm font-medium text-secondary-400 mb-2">
                          نسخه
                        </div>
                        <p className="text-secondary-800 text-sm md:text-base">
                          {toPersianNumbers(product.__v || 0)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6 md:space-y-8"
                >
                  <h3 className="text-base md:text-lg font-bold text-secondary-800 mb-4 flex items-center gap-2">
                    <FiTrendingUp className="w-4 md:w-5 h-4 md:h-5" />
                    آمار عملکرد
                  </h3>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                  >
                    <motion.div
                      variants={cardVariants}
                      className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 md:p-6 border border-primary-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <FiStar className="w-6 h-6 md:w-8 md:h-8 text-primary-600" />
                        <span className="text-xl md:text-2xl font-bold text-primary-800">
                          {toPersianNumbers(product.rating || 0)}
                        </span>
                      </div>
                      <h4 className="font-bold text-primary-800 mb-1 text-sm md:text-base">
                        امتیاز میانگین
                      </h4>
                      <p className="text-xs md:text-sm text-primary-700">
                        از {toPersianNumbers(product.numReviews || 0)} نظر
                      </p>
                    </motion.div>

                    <motion.div
                      variants={cardVariants}
                      className="bg-gradient-to-br from-success/10 to-success/20 rounded-xl p-4 md:p-6 border border-success/30"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <FiHeart className="w-6 h-6 md:w-8 md:h-8 text-success" />
                        <span className="text-xl md:text-2xl font-bold text-success">
                          {toPersianNumbers(product.likesCount || 0)}
                        </span>
                      </div>
                      <h4 className="font-bold text-success mb-1 text-sm md:text-base">
                        علاقه‌مندان
                      </h4>
                      <p className="text-xs md:text-sm text-success/80">
                        کاربران علاقه‌مند
                      </p>
                    </motion.div>

                    <motion.div
                      variants={cardVariants}
                      className="bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl p-4 md:p-6 border border-secondary-300 md:col-span-2 lg:col-span-1"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <FiUsers className="w-6 h-6 md:w-8 md:h-8 text-secondary-700" />
                        <span className="text-xl md:text-2xl font-bold text-secondary-800">
                          {toPersianNumbers(product.comments?.length || 0)}
                        </span>
                      </div>
                      <h4 className="font-bold text-secondary-800 mb-1 text-sm md:text-base">
                        تعداد نظرات
                      </h4>
                      <p className="text-xs md:text-sm text-secondary-400">
                        نظرات ثبت شده
                      </p>
                    </motion.div>
                  </motion.div>

                  {/* Stock Analysis */}
                  <motion.div
                    variants={cardVariants}
                    className="bg-secondary-50 rounded-xl p-4 md:p-6 border border-secondary-200"
                  >
                    <h4 className="font-bold text-secondary-800 mb-4 text-sm md:text-base">
                      تحلیل موجودی
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs md:text-sm text-secondary-400 mb-2">
                          وضعیت موجودی
                        </div>
                        <div
                          className={`inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium text-sm ${
                            isInStock
                              ? "bg-success/10 text-success"
                              : "bg-error/10 text-error"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isInStock ? "bg-success" : "bg-error"
                            }`}
                          ></div>
                          {isInStock ? "موجود" : "ناموجود"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs md:text-sm text-secondary-400 mb-2">
                          تعداد باقیمانده
                        </div>
                        <div className="text-base md:text-lg font-bold text-secondary-800">
                          {toPersianNumbers(product.countInStock)} عدد
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h3 className="text-base md:text-lg font-bold text-secondary-800 mb-4 flex items-center gap-2">
                    <FiSettings className="w-4 md:w-5 h-4 md:h-5" />
                    تنظیمات محصول
                  </h3>

                  <motion.div
                    variants={cardVariants}
                    className="bg-secondary-50 rounded-xl p-4 md:p-6 border border-secondary-200"
                  >
                    <p className="text-secondary-400 text-center py-8 text-sm md:text-base">
                      بخش تنظیمات در حال توسعه است...
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="تأیید حذف محصول"
      >
        <ConfirmDelete
          resourceName={product?.title}
          onClose={() => setShowDeleteModal(false)}
          disabled={isRemovingProduct}
          onConfirm={confirmDelete}
        />
      </Modal>
    </div>
  );
}

export default ProductDetailsPage;
