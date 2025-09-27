"use client";

import React, { useState } from "react";
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
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import OrderStatusTracker from "@/ui/OrderStatusTracker";
import BackButton from "@/ui/BackButton";
import { useUserPayment } from "@/hooks/useUserPayment";
import Modal from "@/ui/Modal";
import Button from "@/ui/Button";

// Order status options
const ORDER_STATUS_OPTIONS = [
  { value: 1, label: "در حال پردازش" },
  { value: 2, label: "تحویل به پست" },
  { value: 3, label: "تحویل شده" },
];

function PaymentDetails() {
  const { id } = useParams();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const { userPayment, isLoadingUserPayment, userPaymentError } =
    useUserPayment(id);

  const { mutateUpdateOrderStatus, isUpdatingOrderStatus } =
    usePaymentActions(id);

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
    _id,
  } = userPayment;

  const statusInfo = paymentStatus[status] || {
    label: "نامشخص",
    className: "badge badge--secondary",
  };

  const orderStatusNumber =
    orderStatus && [1, 2, 3].includes(orderStatus) ? orderStatus : 1;

  const currentStatusLabel =
    ORDER_STATUS_OPTIONS.find((opt) => opt.value === orderStatus)?.label ||
    "نامشخص";

  const handleStatusUpdate = () => {
    if (selectedStatus) {
      mutateUpdateOrderStatus({
        id: _id,
        data: { orderStatus: parseInt(selectedStatus) },
      });
      setIsStatusModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-100">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-x-2 mb-2">
                <BackButton arrowClassName="md:w-6 md:h-6" />
                <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">
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

        {/* Order Status Tracker with Action Button */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 p-2 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-secondary-900">
                  وضعیت سفارش
                </h2>
                <p className="text-secondary-600 text-sm">
                  وضعیت فعلی: {currentStatusLabel}
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsStatusModalOpen(true)}
              disabled={isUpdatingOrderStatus}
              className="flex items-center gap-2 shadow-sm"
            >
              <PencilSquareIcon className="w-4 h-4" />
              تغییر وضعیت
            </Button>
          </div>

          <OrderStatusTracker
            currentStatus={orderStatusNumber}
            paymentId={invoiceNumber}
          />
        </div>

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
                  {toPersianNumbersWithComma(amount)} تومان
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
                            )}{" "}
                            تومان
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
                      )}{" "}
                      تومان
                    </span>
                  </div>

                  {cart.payDetail.totalOffAmount > 0 && (
                    <div className="flex items-center justify-between text-sm md:text-base">
                      <span className="text-red-600">تخفیف:</span>
                      <span className="text-red-600">
                        -
                        {toPersianNumbersWithComma(
                          cart.payDetail.totalOffAmount
                        )}{" "}
                        تومان
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-primary-200">
                    <span className="text-secondary-900">مبلغ نهایی:</span>
                    <span className="text-primary-700">
                      {toPersianNumbersWithComma(cart.payDetail.totalPrice)}{" "}
                      تومان
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Status Update Modal */}
        <Modal
          open={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          title="تغییر وضعیت سفارش"
        >
          <div className="space-y-4">
            <p className="text-secondary-700">
              وضعیت فعلی:{" "}
              <span className="font-semibold">{currentStatusLabel}</span>
            </p>

            <div className="space-y-3">
              <label
                htmlFor="orderStatusSelect"
                className="block text-sm font-medium text-secondary-700"
              >
                انتخاب وضعیت جدید:
              </label>
              <select
                id="orderStatusSelect"
                name="orderStatus"
                value={selectedStatus || orderStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-3 border border-secondary-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                disabled={isUpdatingOrderStatus}
                aria-describedby="orderStatusHelp"
              >
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <p id="orderStatusHelp" className="text-xs text-secondary-500">
                وضعیت جدید سفارش را انتخاب کنید
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setIsStatusModalOpen(false)}
                disabled={isUpdatingOrderStatus}
              >
                انصراف
              </Button>
              <Button
                variant="primary"
                onClick={handleStatusUpdate}
                disabled={isUpdatingOrderStatus || !selectedStatus}
                loading={isUpdatingOrderStatus}
              >
                بروزرسانی وضعیت
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default PaymentDetails;
