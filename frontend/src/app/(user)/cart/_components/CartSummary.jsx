import useCreatePayment from "@/hooks/useCreatePayment";
import useCartActions from "@/hooks/useCartActions";
import MiniLoading from "@/ui/MiniLoading";
import {
  toPersianNumbers,
  toPersianNumbersWithComma,
} from "@/utils/toPersianNumbers";
import { useState } from "react";
import toast from "react-hot-toast";

function CartSummary({ payDetail }) {
  const { totalOffAmount, totalPrice, totalGrossPrice, orderItems } = payDetail;
  const { createPayment, isCreating } = useCreatePayment();
  const { addCouponToCart, isAddingCoupon } = useCartActions();
  const [couponCode, setCouponCode] = useState("");

  const createPaymentHandler = () => createPayment();

  const applyCouponHandler = async () => {
    if (!couponCode.trim()) {
      toast.error("لطفاً کد تخفیف را وارد کنید");
      return;
    }
    try {
      await addCouponToCart(couponCode);
      setCouponCode(""); 
    } catch (error) {
      toast.error(error.message || "خطا در اعمال کد تخفیف");
    }
  };

  return (
    <div className="rounded-xl bg-secondary-0 px-4 py-6 shadow-sm border border-secondary-200 text-sm md:text-base">
      <p className="mb-6 font-extrabold text-lg md:text-xl">اطلاعات پرداخت</p>

      {/* Coupon Input and Apply Button */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            id="couponCode"
            name="couponCode"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="کد تخفیف"
            className="border border-secondary-300 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={applyCouponHandler}
            disabled={isAddingCoupon}
            className="btn btn--secondary py-2 px-4 text-sm disabled:opacity-50"
          >
            {isAddingCoupon ? <MiniLoading /> : "اعمال"}
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-secondary-600">
            قیمت کالاها ({toPersianNumbers(orderItems.length)})
          </span>
          <span className="font-medium text-secondary-800">
            {toPersianNumbersWithComma(totalGrossPrice)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-red-700 font-medium">تخفیف</span>
          <span className="text-red-600 font-bold text-lg">
            - {toPersianNumbersWithComma(totalOffAmount)}
          </span>
        </div>
        {/* Separator */}
        <div className="border-t-2 border-secondary-300"></div>
        <div className="flex items-center justify-between font-bold text-base md:text-lg">
          <span>جمع سبد خرید :</span>
          <span>{toPersianNumbersWithComma(totalPrice)}</span>
        </div>
      </div>

      <button
        onClick={createPaymentHandler}
        className="btn btn--primary w-full py-2 md:py-3 text-base !shadow-sm"
        disabled={isCreating}
      >
        {isCreating ? <MiniLoading /> : "ثبت سفارش"}
      </button>
    </div>
  );
}

export default CartSummary;