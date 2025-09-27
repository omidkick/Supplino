

import { addToCart, decrementFromCart, addCouponToCart } from "@/services/cartService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useCartActions() {
  const queryClient = useQueryClient();

  // Add to cart mutation
  const { mutate: addToCartAction, isPending: isAdding } = useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["get-user"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در افزودن به سبد خرید");
    },
  });

  // Remove from cart mutation
  const { mutate: removeFromCartAction, isPending: isRemoving } = useMutation({
    mutationFn: decrementFromCart,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["get-user"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در حذف از سبد خرید");
    },
  });

  // Add coupon to cart mutation
  const { mutate: addCouponToCartAction, isPending: isAddingCoupon } = useMutation({
    mutationFn: addCouponToCart,
    onSuccess: (data) => {
      toast.success(data.message || "کد تخفیف با موفقیت اعمال شد");
      queryClient.invalidateQueries({ queryKey: ["get-user"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در اعمال کد تخفیف");
    },
  });

  return {
    addToCart: addToCartAction,
    removeFromCart: removeFromCartAction,
    addCouponToCart: addCouponToCartAction,
    isAdding,
    isRemoving,
    isAddingCoupon,
  };
}
