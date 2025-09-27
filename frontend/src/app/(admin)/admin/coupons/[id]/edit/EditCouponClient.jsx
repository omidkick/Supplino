"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/ui/Breadcrumbs";
import Loading from "@/ui/Loading";
import { getOneCoupon } from "@/services/couponService";
import AddCouponForm from "../../add/components/AddCouponForm";

function EditCouponClient({ id }) {
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCoupon() {
      try {
        setLoading(true);
        const data = await getOneCoupon(id);
        setCoupon(data.coupon);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching coupon:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCoupon();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  if (!coupon) return <div>کد تخفیف یافت نشد</div>;

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: "پنل ادمین",
            href: "/admin",
          },
          {
            label: "کدهای تخفیف",
            href: "/admin/coupons",
          },
          {
            label: "ویرایش کد تخفیف",
            href: `/admin/coupons/${id}/edit`,
            active: true,
          },
        ]}
      />
      <AddCouponForm couponToEdit={coupon} />
    </div>
  );
}

export default EditCouponClient;