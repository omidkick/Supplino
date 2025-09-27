import { uploadAvatarApi } from "@/services/authServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export default function useUploadAvatar() {
  const queryClient = useQueryClient();

  const { mutateAsync: uploadAvatar, isPending: isUploading } = useMutation({
    mutationFn: (file) => {
      // Add validation before sending
      if (!file) {
        throw new Error("No file provided");
      }

      if (!(file instanceof File)) {
        throw new Error("Invalid file type");
      }

      return uploadAvatarApi(file);
    },
    onSuccess: (data) => {
      toast.success(data.message || "آواتار با موفقیت آپلود شد");

      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (err) => {
      console.error("Upload error:", err);
      toast.error(err?.response?.data?.message || "خطا در آپلود آواتار");
    },
  });

  return { uploadAvatar, isUploading };
}

