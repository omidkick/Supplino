import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllPayments,
  createPayment,
  getOnePayment,
  updateOrderStatus,
  getUserPaymentDetail,
} from "@/services/paymentService";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export const usePaymentActions = (paymentId = null) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // Get query string from URL parameters
  const queryString = searchParams.toString();

  // 🔁 Fetch all payments 
  const { data, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["get-payments", queryString],
    queryFn: () => getAllPayments(queryString),
    retry: false,
    refetchOnWindowFocus: true,
  });

  const { payments, pagination } = data || {};
    const { totalCount: totalPaymentsCount } = pagination || {};

  // 🔍 Fetch single payment by ID (admin)
  const {
    data: singlePayment,
    isLoading: isLoadingSinglePayment,
    error: singlePaymentError,
  } = useQuery({
    queryKey: ["get-single-payment", paymentId],
    queryFn: () => getOnePayment(paymentId),
    enabled: !!paymentId,
  });

  const { payment } = singlePayment || {};

  // ➕ Create payment
  const {
    mutate: mutateCreatePayment,
    isPending: isCreatingPayment,
    error: createPaymentError,
  } = useMutation({
    mutationFn: createPayment,
    onSuccess: (data) => {
      toast.success(data.message || "پرداخت با موفقیت ایجاد شد");
      queryClient.invalidateQueries({ queryKey: ["get-payments"] });
      queryClient.invalidateQueries({ queryKey: ["get-user"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در ایجاد پرداخت");
    },
  });

  // ✏️ Update order status (admin)
  const {
    mutate: mutateUpdateOrderStatus,
    isPending: isUpdatingOrderStatus,
    error: updateOrderStatusError,
  } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data) => {
      toast.success(data.message || "وضعیت سفارش با موفقیت به روز شد");
      queryClient.invalidateQueries({ queryKey: ["get-payments"] });

      // Invalidate specific payment queries if paymentId is provided
      if (paymentId) {
        queryClient.invalidateQueries({
          queryKey: ["get-single-payment", paymentId],
        });
        queryClient.invalidateQueries({
          queryKey: ["get-user-payment", paymentId],
        });
      }
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "خطا در بروزرسانی وضعیت سفارش"
      );
    },
  });

  return {
    // All payments
    payments,
    isLoadingPayments,
    pagination,
    totalPaymentsCount,

    // Single payment (admin)
    payment,
    isLoadingSinglePayment,
    singlePaymentError,

    // Create payment
    mutateCreatePayment,
    isCreatingPayment,
    createPaymentError,

    // Update order status
    mutateUpdateOrderStatus,
    isUpdatingOrderStatus,
    updateOrderStatusError,
  };
};
