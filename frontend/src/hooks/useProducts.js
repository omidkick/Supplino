import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllProducts,
  addProduct,
  removeProduct,
  updateProduct,
  getOneProductById,
  likeProduct,
  toggleBookmark, // Make sure this is imported
} from "@/services/productService";
import toast from "react-hot-toast";

export const useProductActions = (productId = null) => {
  const queryClient = useQueryClient();

  // 🔁 Fetch all products
  const { data, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["get-products"],
    queryFn: getAllProducts,
    retry: false,
    refetchOnWindowFocus: true,
  });

  const { products, totalCount } = data || {};

  // 🔍 Fetch single product by ID
  const {
    data: singleProduct,
    isLoading: isLoadingSingleProduct,
    error: singleProductError,
  } = useQuery({
    queryKey: ["get-single-product", productId],
    queryFn: () => getOneProductById(productId),
    enabled: !!productId,
  });

  const { product } = singleProduct || {};

  // ➕ Add product
  const {
    mutate: mutateAddProduct,
    isPending: isAddingProduct,
    error: addProductError,
  } = useMutation({
    mutationFn: addProduct,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["get-products"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  // ❌ Remove product
  const {
    mutate: mutateRemoveProduct,
    isPending: isRemovingProduct,
    error: removeProductError,
  } = useMutation({
    mutationFn: removeProduct,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["get-products"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  // ✏️ Update product
  const {
    mutate: mutateUpdateProduct,
    isPending: isUpdatingProduct,
    error: updateProductError,
  } = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["get-products"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  // ❤️ Like product
  const { mutate: mutateLikeProduct } = useMutation({
    mutationFn: likeProduct,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["get-products"]);
      if (productId) {
        queryClient.invalidateQueries(["get-single-product", productId]);
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در بروزرسانی علاقمندی");
    },
  });

  // 🔖 Bookmark product
  const { mutate: mutateToggleBookmark } = useMutation({
    mutationFn: toggleBookmark,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["get-products"]);
      if (productId) {
        queryClient.invalidateQueries(["get-single-product", productId]);
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "خطا در بروزرسانی نشانک");
    },
  });

  return {
    // All products
    products,
    totalCount,
    isLoadingProducts,

    // Single product
    product,
    isLoadingSingleProduct,
    singleProductError,

    // Add
    mutateAddProduct,
    isAddingProduct,
    addProductError,

    // Remove
    mutateRemoveProduct,
    isRemovingProduct,
    removeProductError,

    // Update
    mutateUpdateProduct,
    isUpdatingProduct,
    updateProductError,

    // Like & Bookmark
    mutateLikeProduct,
    mutateToggleBookmark,
  };
};