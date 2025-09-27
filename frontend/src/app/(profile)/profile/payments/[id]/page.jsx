"use client";

import React from "react";
import { useParams } from "next/navigation";
import { usePaymentActions } from "@/hooks/usePayments";
import { toPersianDigits } from "@/utils/numberFormatter";
import { toPersianNumbersWithComma } from "@/utils/toPersianNumbers";
import { toLocalDateShort } from "@/utils/dateFormatter";
import { paymentStatus } from "@/utils/paymentStatus";
import Fallback from "@/ui/Fallback";
import Empty from "@/ui/Empty";
import {
  CreditCardIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import BackButton from "@/ui/BackButton";
import { useUserPayment } from "@/hooks/useUserPayment";
import OrderStatusTracker from "@/ui/OrderStatusTracker";

function PaymentDetails() {
  const { id } = useParams();

  // const { userPayment, isLoadingUserPayment, userPaymentError } =
  //   usePaymentActions(id);

  const { userPayment, isLoadingUserPayment, userPaymentError } =
    useUserPayment(id);

  // Loading state
  if (isLoadingUserPayment) {
    return (
      <div className="min-h-screen bg-secondary-100 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <Fallback />
          </div>
        </div>
      </div>
    );
  }

  // Error or empty state
  if (userPaymentError || !userPayment) {
    return (
      <div className="min-h-screen bg-secondary-100 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <Empty resourceName="جزئیات پرداخت" />
        </div>
      </div>
    );
  }

  const {
    invoiceNumber,
    amount,
    description,
    status,
    isPaid,
    paymentMethod,
    paymentDate,
    createdAt,
    orderStatus,
    cart,
    user,
  } = userPayment;

  const statusInfo = paymentStatus[status] || {
    label: "نامشخص",
    className: "badge badge--secondary",
  };

  const orderStatusNumber =
    orderStatus && [1, 2, 3].includes(orderStatus) ? orderStatus : 1;

  return (
    <div className="min-h-screen bg-secondary-100 ">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-secondary-0 rounded-2xl shadow-lg p-4 md:p-6 border border-secondary-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-x-2 mb-2">
                <BackButton arrowClassName="md:w-6 md:h-6" />
                <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 ">
                  جزئیات پرداخت
                </h1>
              </div>
              <p className="text-secondary-600 text-sm md:text-base">
                مشاهده کامل اطلاعات سفارش و وضعیت پرداخت
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="badge badge--primary text-sm">
                شماره فاکتور: {toPersianDigits(invoiceNumber)}
              </div>
              <div className={statusInfo.className}>{statusInfo.label}</div>
            </div>
          </div>
        </div>

        {/* Order Status Tracker */}
        <OrderStatusTracker
          currentStatus={orderStatusNumber}
          paymentId={invoiceNumber}
        />

        {/* Payment Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Details Card */}
          <div className="bg-secondary-0 rounded-2xl shadow-lg p-4 md:p-6 border border-secondary-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary-100 p-2 rounded-lg">
                <CreditCardIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-secondary-900">
                اطلاعات پرداخت
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-b-0">
                <span className="text-secondary-600 text-sm md:text-base">
                  مبلغ پرداختی:
                </span>
                <span className="font-bold text-secondary-900">
                  {toPersianNumbersWithComma(amount)} 
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-b-0">
                <span className="text-secondary-600 text-sm md:text-base">
                  روش پرداخت:
                </span>
                <span className="font-medium text-secondary-800">
                  {paymentMethod === "ZARINPAL" ? "زرین‌پال" : paymentMethod}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-b-0">
                <span className="text-secondary-600 text-sm md:text-base">
                  وضعیت پرداخت:
                </span>
                <div className="flex items-center gap-2">
                  {isPaid ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircleIcon className="w-4 h-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm md:text-base font-medium ${
                      isPaid ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {isPaid ? "پرداخت شده" : "پرداخت نشده"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-secondary-600 text-sm md:text-base">
                  تاریخ پرداخت:
                </span>
                <span className="font-medium text-secondary-800">
                  {toLocalDateShort(createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information Card */}
          <div className="bg-secondary-0 rounded-2xl shadow-lg p-4 md:p-6 border border-secondary-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary-100 p-2 rounded-lg">
                <UserIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-secondary-900">
                اطلاعات مشتری
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary-100 flex-shrink-0">
                  {user?.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-100">
                      <UserIcon className="w-6 h-6 text-primary-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">
                    {user?.name || "نام کاربر"}
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {user?.phoneNumber && toPersianDigits(user.phoneNumber)}
                  </p>
                </div>
              </div>

              {user?.email && (
                <div className="flex items-center justify-between py-3 border-t border-secondary-100">
                  <span className="text-secondary-600 text-sm md:text-base">
                    ایمیل:
                  </span>
                  <span className="font-medium text-secondary-800 text-sm md:text-base">
                    {user.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Description */}
        {description && (
          <div className="bg-secondary-0 rounded-2xl shadow-lg p-4 md:p-6 border border-secondary-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-100 p-2 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-secondary-900">
                توضیحات سفارش
              </h2>
            </div>
            <p className="text-secondary-700 leading-relaxed">{description}</p>
          </div>
        )}

        {/* Products List */}
        {cart?.productDetails && cart.productDetails.length > 0 && (
          <div className="bg-secondary-0 rounded-2xl shadow-lg p-4 md:p-6 border border-secondary-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary-100 p-2 rounded-lg">
                <ShoppingCartIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-secondary-900">
                محصولات سفارش
              </h2>
            </div>

            <div className="space-y-4">
              {cart.productDetails.map((product, index) => {
                // Find the corresponding product in productDetail array to get price info
                const productWithPrice = cart.productDetail?.find(
                  (p) => p._id === product._id
                );

                return (
                  <div
                    key={product._id || index}
                    className="flex items-center gap-4 p-4 bg-secondary-50 rounded-xl border border-secondary-100"
                  >
                    <div className="w-16 h-16 bg-secondary-200 rounded-lg overflow-hidden flex-shrink-0">
                      {product.coverImageUrl ? (
                        <Image
                          src={product.coverImageUrl}
                          alt={product.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCartIcon className="w-6 h-6 text-secondary-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-secondary-900 mb-2">
                        {product.title}
                      </h3>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-secondary-600">
                            تعداد:{" "}
                            {toPersianDigits(productWithPrice?.quantity || 1)}
                          </span>
                          {productWithPrice?.discount &&
                            productWithPrice.discount > 0 && (
                              <div className="badge badge--error text-xs">
                                {toPersianDigits(productWithPrice.discount)}%
                                تخفیف
                              </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                          {productWithPrice?.price !==
                            productWithPrice?.offPrice && (
                            <span className="text-secondary-400 text-sm line-through">
                              {toPersianNumbersWithComma(
                                productWithPrice?.price
                              )}
                            </span>
                          )}
                          <span className="font-bold text-secondary-900">
                            {toPersianNumbersWithComma(
                              productWithPrice?.offPrice ||
                                productWithPrice?.price
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment Summary */}
            {cart?.payDetail && (
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="bg-primary-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm md:text-base">
                    <span className="text-secondary-700">قیمت کل:</span>
                    <span className="text-secondary-800">
                      {toPersianNumbersWithComma(
                        cart.payDetail.totalGrossPrice
                      )}
                    </span>
                  </div>

                  {cart.payDetail.totalOffAmount > 0 && (
                    <div className="flex items-center justify-between text-sm md:text-base">
                      <span className="text-red-600">تخفیف:</span>
                      <span className="text-red-600">
                        -
                        {toPersianNumbersWithComma(
                          cart.payDetail.totalOffAmount
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-primary-200">
                    <span className="text-secondary-900">مبلغ نهایی:</span>
                    <span className="text-primary-700">
                      {toPersianNumbersWithComma(cart.payDetail.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentDetails;
