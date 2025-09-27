import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllCoupons,
  getOneCoupon,
  addNewCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/services/couponService";
import toast from "react-hot-toast";

export const useCoupon = (couponId = null) => {
  const queryClient = useQueryClient();

  // 🔁 Fetch all coupons
  const { data, isLoading: isLoadingCoupons } = useQuery({
    queryKey: ["get-coupons"],
    queryFn: getAllCoupons,
    retry: false,
    refetchOnWindowFocus: true,
  });

  const { coupons } = data || {};

  // 🔍 Fetch single coupon by ID
  const {
    data: singleCoupon,
    isLoading: isLoadingSingleCoupon,
    error: singleCouponError,
  } = useQuery({
    queryKey: ["get-single-coupon", couponId],
    queryFn: () => getOneCoupon(couponId),
    enabled: !!couponId,
  });

  const { coupon } = singleCoupon || {};

  // ➕ Add new coupon
  const {
    mutate: mutateAddCoupon,
    isPending: isAddingCoupon,
    error: addCouponError,
  } = useMutation({
    mutationFn: addNewCoupon,
    onSuccess: (data) => {
      toast.success(data.message || "کد تخفیف با موفقیت ایجاد شد");
      queryClient.invalidateQueries({ queryKey: ["get-coupons"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در ایجاد کد تخفیف");
    },
  });

  // ✏️ Update coupon
  const {
    mutate: mutateUpdateCoupon,
    isPending: isUpdatingCoupon,
    error: updateCouponError,
  } = useMutation({
    mutationFn: ({ id, data }) => updateCoupon({ id, data }),
    onSuccess: (data) => {
      toast.success(data.message || "کد تخفیف با موفقیت به روز شد");
      queryClient.invalidateQueries({ queryKey: ["get-coupons"] });

      // Invalidate specific coupon query if couponId is provided
      if (couponId) {
        queryClient.invalidateQueries({
          queryKey: ["get-single-coupon", couponId],
        });
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در بروزرسانی کد تخفیف");
    },
  });

  // 🗑️ Delete coupon
  const {
    mutate: mutateDeleteCoupon,
    isPending: isDeletingCoupon,
    error: deleteCouponError,
  } = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: (data) => {
      toast.success(data.message || "کد تخفیف با موفقیت حذف شد");
      queryClient.invalidateQueries({ queryKey: ["get-coupons"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در حذف کد تخفیف");
    },
  });

  return {
    // All coupons
    coupons,
    isLoadingCoupons,

    // Single coupon
    coupon,
    isLoadingSingleCoupon,
    singleCouponError,

    // Add coupon
    mutateAddCoupon,
    isAddingCoupon,
    addCouponError,

    // Update coupon
    mutateUpdateCoupon,
    isUpdatingCoupon,
    updateCouponError,

    // Delete coupon
    mutateDeleteCoupon,
    isDeletingCoupon,
    deleteCouponError,
  };
};
