import { useQuery } from "@tanstack/react-query";
import { getUserPaymentDetail } from "@/services/paymentService";

export const useUserPayment = (paymentId) => {
  // 🔍 Fetch user payment detail by ID (user-specific)
  const {
    data: userPaymentDetail,
    isLoading: isLoadingUserPayment,
    error: userPaymentError,
  } = useQuery({
    queryKey: ["get-user-payment", paymentId],
    queryFn: () => getUserPaymentDetail(paymentId),
    enabled: !!paymentId,
  });

  const { payment: userPayment } = userPaymentDetail || {};

  return {
    userPayment,
    isLoadingUserPayment,
    userPaymentError,
  };
};
