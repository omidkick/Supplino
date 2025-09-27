import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCategories,
  addNewCategory,
  updateCategory,
  removeCategory,
} from "@/services/categoryService";
import toast from "react-hot-toast";

export const useCategories = () => {
  const queryClient = useQueryClient();

  // Fetch
  const {
    data,
    isLoading: isLoadingCategories,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    retry: false,
    refetchOnWindowFocus: true,
  });

  const { categories = [] } = data || {};

  // Add
  const { mutate: addCategory, isPending: isAdding } = useMutation({
    mutationFn: addNewCategory,
    onSuccess: (data) => {
      toast.success(data.message || "دسته‌بندی با موفقیت اضافه شد");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در اضافه کردن دسته‌بندی");
    },
  });

  // Update
  const { mutate: updateCategoryById, isPending: isUpdating } = useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      toast.success(data.message || "دسته‌بندی با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در ویرایش دسته‌بندی");
    },
  });

  // Remove
  const { mutate: removeCategoryById, isPending: isDeleting } = useMutation({
    mutationFn: removeCategory,
    onSuccess: (data) => {
      toast.success(data.message || "دسته‌بندی با موفقیت حذف شد");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در حذف دسته‌بندی");
    },
  });

  return {
    categories,
    isLoadingCategories,
    isError,
    error,
    // Actions
    addCategory,
    updateCategoryById,
    removeCategoryById,
    // Status flags
    isAdding,
    isUpdating,
    isDeleting,
  };
};