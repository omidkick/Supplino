import { logout } from "@/services/authServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { isPending: isLoggingOut, mutate: logoutFn } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      toast.success("👋 به امید دیدار مجدد");

      // Clear user data immediately (faster UI update)
      queryClient.setQueryData(["get-user"], null);

      // Also clear users if needed
      queryClient.removeQueries({ queryKey: ["get-users"] });

      // router.push("/home");
      document.location.href = "/home";
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { isLoggingOut, logoutFn };
}
