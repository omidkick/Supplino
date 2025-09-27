"use client";

import { useUserProfileByAdmin } from "@/hooks/useAuth";
import { useParams } from "next/navigation";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArchiveBoxIcon,
  HeartIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid";
import { toPersianNumbersWithComma } from "@/utils/toPersianNumbers";
import truncateText from "@/utils/trancateText";
import { toPersianDigits } from "@/utils/numberFormatter";
import { formatDate } from "@/utils/dateFormatter";
import Loader from "@/ui/Loader";
import BackButton from "@/ui/BackButton";

function StatusBadge({ status, isPaid }) {
  const getStatusColor = () => {
    if (isPaid && status === "COMPLETED")
      return "bg-green-100 text-green-800 border-green-200";
    if (status === "PENDING")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getStatusText = () => {
    if (status === "COMPLETED") return "تکمیل شده";
    if (status === "UNCOMPLETED") return "در انتظار پرداخت";
    return status;
  };

  return (
    <span
      className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}
    >
      {status === "COMPLETED" ? (
        <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
      ) : (
        <XCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
      )}
      {getStatusText()}
    </span>
  );
}

function InfoCard({ title, children, icon: Icon }) {
  return (
    <div className="bg-secondary-0 rounded-xl shadow-sm border border-secondary-100 p-4 sm:p-6 ">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-primary-100 rounded-lg ml-2 sm:ml-3">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-secondary-900">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color = "primary" }) {
  const colorClasses = {
    primary:
      "bg-secondary-50 border-primary-800 dark:border-secondary-200 text-primary-800",
    secondary:
      "bg-secondary-50 border-black dark:border-secondary-200 text-secondary-800",
    green:
      "bg-secondary-50 border-green-800 dark:border-secondary-200 text-green-800 dark:text-green-500",
    blue: "bg-secondary-50 border-purple-800 dark:border-secondary-200 text-purple-800 dark:text-purple-500",
  };

  return (
    <div className={`rounded-lg border p-3 sm:p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium opacity-80">{label}</p>
          <p className="text-lg sm:text-2xl font-bold">
            {toPersianDigits(value)}
          </p>
        </div>
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 opacity-60" />
      </div>
    </div>
  );
}

function page() {
  const { id } = useParams();
  const { data, isLoading } = useUserProfileByAdmin(id);
  const { user, payments } = data || {};

  // Loader
  if (isLoading) {
    return <Loader message="در حال بارگذاری پروفایل کاربر..." />;
  }

  const totalPayments = payments?.length || 0;
  const completedPayments =
    payments?.filter((p) => p.status === "COMPLETED").length || 0;
  const totalSpent =
    payments?.filter((p) => p.isPaid).reduce((sum, p) => sum + p.amount, 0) ||
    0;

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-x-2 mb-2 sm:mb-3">
                <BackButton arrowClassName="w-6 md:w-7 h-6 md:h-7" />
                <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-secondary-900 ">
                  پروفایل کاربر
                </h1>
              </div>
              <p className="text-sm sm:text-base text-secondary-400">
                نمای کلی جزئیات حساب کاربری و فعالیت‌ها
              </p>
            </div>
            <div className="flex-shrink-0">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.isActive
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {user.isActive ? (
                  <CheckCircleIcon className="w-4 h-4 ml-1" />
                ) : (
                  <XCircleIcon className="w-4 h-4 ml-1" />
                )}
                {user.isActive ? "فعال" : "غیرفعال"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            label="تعداد محصولات"
            value={user.Products?.length || 0}
            icon={ArchiveBoxIcon}
            color="primary"
          />
          <StatCard
            label="محصولات پسندیده"
            value={user.likedProducts?.length || 0}
            icon={HeartIcon}
            color="secondary"
          />
          <StatCard
            label="کل پرداخت‌ها"
            value={totalPayments}
            icon={CreditCardIcon}
            color="blue"
          />
          <StatCard
            label="سفارشات تکمیل شده"
            value={completedPayments}
            icon={CheckCircleIcon}
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* User Information */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <InfoCard title="اطلاعات شخصی" icon={UserIcon}>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center p-3 bg-secondary-50 rounded-lg">
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-500 ml-2 sm:ml-3 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-secondary-400">
                      نام کامل
                    </p>
                    <p className="font-medium text-secondary-900 text-sm sm:text-base truncate">
                      {user.name || "وارد نشده"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-secondary-50 rounded-lg">
                  <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-500 ml-2 sm:ml-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-secondary-400">
                      ایمیل
                    </p>
                    <p className="font-medium text-secondary-900 truncate text-sm sm:text-base">
                      {user.email || "وارد نشده"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-secondary-50 rounded-lg">
                  <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-500 ml-2 sm:ml-3 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-secondary-400">
                      شماره تلفن
                    </p>
                    <div className="flex items-center">
                      <p className="font-medium text-secondary-900 text-sm sm:text-base">
                        {toPersianDigits(user.phoneNumber || "وارد نشده")}
                      </p>
                      {user.isVerifiedPhoneNumber && (
                        <IoShieldCheckmarkSharp className="w-4 md:w-5 h-4 md:h-5 text-green-500 mr-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-secondary-50 rounded-lg">
                  <CalendarDaysIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-500 ml-2 sm:ml-3 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-secondary-400">
                      عضو از تاریخ
                    </p>
                    <p className="font-medium text-secondary-900 text-sm sm:text-base">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="جزئیات حساب" icon={ShoppingBagIcon}>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                  <span className="text-secondary-400 text-sm">نقش</span>
                  <span className="font-medium text-white bg-primary-700 px-2 py-1 rounded-full text-xs">
                    {user.role === "ADMIN"
                      ? "مدیر"
                      : user.role === "USER"
                      ? "کاربر"
                      : user.role}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                  <span className="text-secondary-400 text-sm">
                    اقلام سبد خرید
                  </span>
                  <span className="font-medium text-secondary-900 text-sm">
                    {toPersianDigits(user.cart?.products?.length || 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                  <span className="text-secondary-400 text-sm">
                    کل مبلغ خرید
                  </span>
                  <span className="font-medium text-secondary-900 text-xs sm:text-sm">
                    {toPersianNumbersWithComma(totalSpent)}
                  </span>
                </div>
              </div>
            </InfoCard>

            {user.biography && (
              <InfoCard title="بیوگرافی" icon={UserIcon}>
                <div className="p-3 bg-secondary-50 rounded-lg">
                  <p className="text-secondary-700 whitespace-pre-wrap text-sm">
                    {user.biography}
                  </p>
                </div>
              </InfoCard>
            )}
          </div>

          {/* Payment History */}
          <div className="lg:col-span-2">
            <InfoCard title="تاریخچه پرداخت‌ها" icon={CreditCardIcon}>
              {!payments || payments.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <CreditCardIcon className="w-10 h-10 sm:w-12 sm:h-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-400 text-sm sm:text-base">
                    تاریخچه پرداختی یافت نشد
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {payments.map((payment, index) => (
                    <div
                      key={payment._id || index}
                      className="border border-secondary-200 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                        <div className="flex items-center">
                          <div className="p-2 bg-primary-100 rounded-lg ml-2 sm:ml-3 flex-shrink-0">
                            <CreditCardIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-secondary-900 text-sm sm:text-base">
                              {toPersianNumbersWithComma(payment.amount)}
                            </p>
                            <p className="text-xs sm:text-sm text-secondary-400 truncate">
                              فاکتور:{" "}
                              {window.innerWidth < 640
                                ? truncateText(
                                    toPersianDigits(payment.invoiceNumber),
                                    15
                                  )
                                : toPersianDigits(payment.invoiceNumber)}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <StatusBadge
                            status={payment.status}
                            isPaid={payment.isPaid}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <p className="text-secondary-400 mb-1">روش پرداخت</p>
                          <p className="font-medium text-secondary-900">
                            {payment.paymentMethod === "ZARINPAL"
                              ? "زرین‌پال"
                              : payment.paymentMethod === "CARD"
                              ? "کارت"
                              : payment.paymentMethod === "CASH"
                              ? "نقدی"
                              : payment.paymentMethod}
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary-400 mb-1">تاریخ</p>
                          <p className="font-medium text-secondary-900">
                            {formatDate(payment.createdAt)}
                          </p>
                        </div>
                        {payment.cart?.productDetail && (
                          <div className="sm:col-span-2">
                            <p className="text-secondary-400  mb-2">
                              محصولات (
                              {toPersianDigits(
                                payment.cart.productDetail.length
                              )}
                              )
                            </p>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {payment.cart.productDetail.map((p, i) => (
                                <span
                                  key={i}
                                  className="badge badge--primary text-xs font-bold"
                                >
                                  {p.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
