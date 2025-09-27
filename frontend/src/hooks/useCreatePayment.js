import { createPayment } from "@/services/paymentService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function useCreatePayment() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createPaymentMutate, isPending: isCreating } = useMutation({
    mutationFn: createPayment,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["get-user"] });
      
      // ✅ Redirect to success page after successful payment
      if (data.paymentId) {
        // Store payment data in session storage for the success page
        sessionStorage.setItem('lastSuccessfulPayment', JSON.stringify({
          _id: data.paymentId,
          invoiceNumber: data.invoiceNumber,
          amount: data.amount,
          timestamp: new Date().toISOString()
        }));
        
        // Redirect to success page
        router.push(`/payment-success/${data.paymentId}`);
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  return {
    createPayment: createPaymentMutate,
    isCreating,
  };
}