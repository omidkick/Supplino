import { completeProfileApi } from "@/services/authServices";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function useCompleteProfile() {
  const router = useRouter();

  const { isPending, mutateAsync: completeProfile } = useMutation({
    mutationFn: completeProfileApi,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push("/home");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  return { isPending, completeProfile };
}
