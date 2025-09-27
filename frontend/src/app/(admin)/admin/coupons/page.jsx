"use client";

import Loader from "@/ui/Loader";
import Empty from "@/ui/Empty";
import { useCoupon } from "@/hooks/useCoupons";
import CouponsTable from "./_components/CouponsTable";
import { AddNewCoupon } from "./_components/CouponButtons";

function CouponsPage() {
  const { coupons, isLoadingCoupons } = useCoupon();
  // console.log(coupons);

  if (isLoadingCoupons) return <Loader />;
  return (
    <div>
      {/* Title + Add Coupon Btn*/}
      <div className="flex flex-col md:flex-row items-center justify-between text-secondary-800 gap-y-6 mb-6 md:mb-12 mt-8 md:mt-2">
        <h1 className="font-extrabold text-xl md:text-2xl order-1">
          لیست کد های تخفیف
        </h1>
        <div className="order-2 md:order-3">
          <AddNewCoupon />
        </div>
      </div>

      {/* CouponsTable */}
      {coupons?.length > 0 ? (
        <CouponsTable coupons={coupons} />
      ) : (
        <Empty resourceName="کد تخفیفی" />
      )}
    </div>
  );
}

export default CouponsPage;
