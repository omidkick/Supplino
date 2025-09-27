"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Loading from "@/ui/Loading";
import {
  toPersianNumbers,
  toPersianNumbersWithComma,
} from "@/utils/toPersianNumbers";
import {
  CheckBadgeIcon,
  DocumentTextIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { HiShoppingBag } from "react-icons/hi2";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkPaymentData = () => {
      const storedPayment = sessionStorage.getItem("lastSuccessfulPayment");

      if (storedPayment) {
        try {
          const payment = JSON.parse(storedPayment);
          if (payment._id === params.id && isMounted) {
            setPaymentData(payment);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Error parsing payment data:", e);
        }
      }

      // If data not found immediately, wait a bit and check again
      setTimeout(() => {
        if (isMounted) {
          const retryPayment = sessionStorage.getItem("lastSuccessfulPayment");
          if (retryPayment) {
            try {
              const payment = JSON.parse(retryPayment);
              if (payment._id === params.id && isMounted) {
                setPaymentData(payment);
                setLoading(false);
                return;
              }
            } catch (e) {
              console.error("Error parsing payment data:", e);
            }
          }

          if (isMounted) {
            setError("دسترسی به این صفحه مجاز نیست");
            setLoading(false);
          }
        }
      }, 500);
    };

    checkPaymentData();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-secondary-900 mb-2">{error}</h2>
          <p className="text-secondary-600 mb-6">
            لطفاً از طریق تاریخچه پرداخت‌ها به اطلاعات سفارش خود دسترسی پیدا
            کنید.
          </p>
          <Link href="/profile/payments" className="btn btn--primary">
            مشاهده تاریخچه پرداخت‌ها
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-2xl mx-auto py-3 ">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckBadgeIcon className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            پرداخت با موفقیت انجام شد!
          </h1>
          <p className="text-secondary-600">
            سفارش شما ثبت شد و در حال پردازش است.
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-secondary-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <DocumentTextIcon className="w-5 h-5 ml-2" />
            اطلاعات سفارش
          </h2>

          <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-y-2 justify-between">
              <span className="text-secondary-600">شماره سفارش:</span>
              <span className="font-medium">
                {toPersianNumbers(paymentData.invoiceNumber)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-secondary-600">مبلغ پرداختی:</span>
              <span className="font-bold text-green-700">
                {toPersianNumbersWithComma(paymentData.amount)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-secondary-600">تاریخ پرداخت:</span>
              <span className="font-medium">
                {new Date(paymentData.timestamp).toLocaleDateString("fa-IR")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-secondary-600">وضعیت سفارش:</span>
              <span className="badge badge--success">در حال پردازش</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/profile/payments/${paymentData._id}`}
            className="btn btn--primary flex-1 flex items-center justify-center shadow-md"
          >
            <FaMoneyCheckDollar className="w-5 h-5 ml-2" />
            مشاهده جزئیات کامل
          </Link>

          <Link
            href="/products"
            className="btn btn--secondary flex-1 flex items-center justify-center"
          >
            <HiShoppingBag className="w-5 h-5 ml-2" />
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}
