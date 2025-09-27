import { updateProfile } from "@/services/authServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export default function useUpdateProfile() {
  const queryClient = useQueryClient();

  const { mutate: editUser, isPending: isUpdating } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success(data.message);

      // Refresh user data cache
      queryClient.invalidateQueries({
        queryKey: ["get-user"],
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  return { editUser, isUpdating };
}
