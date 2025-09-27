import {
  addCommentApi,
  getAllCommentApi,
  getAllProductCommentsApi,
  deleteCommentApi,
  likeCommentApi,
  updateCommentStatusApi,
  editCommentTextApi,
  getOneCommentApi,
} from "@/services/commentService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { comment } from "postcss";
import toast from "react-hot-toast";

// 🔹 Add Comment
export function useAddComment(productId) {
  const queryClient = useQueryClient();

  const { mutate: addComment, isPending: isAdding } = useMutation({
    mutationFn: addCommentApi,
    onSuccess: (data) => {
      toast.success(data.message || "Comment added!");
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { addComment, isAdding };
}

// 🔹 Delete Comment
export function useDeleteComment(productId) {
  const queryClient = useQueryClient();

  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: (data) => {
      toast.success(data.message || "Comment deleted!");
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { deleteComment, isDeleting };
}

// 🔹 Like Comment
export function useLikeComment(productId) {
  const queryClient = useQueryClient();

  const { mutate: likeComment, isPending: isLiking } = useMutation({
    mutationFn: likeCommentApi,
    onSuccess: (data) => {
      toast.success(data.message || "Comment liked!");
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { likeComment, isLiking };
}

// 🔹 Edit Comment Text
export function useEditComment(productId) {
  const queryClient = useQueryClient();

  const { mutate: editComment, isPending: isEditing } = useMutation({
    mutationFn: editCommentTextApi,
    onSuccess: (data) => {
      toast.success(data.message || "Comment updated!");
      queryClient.invalidateQueries({ queryKey: ["comments", productId] });
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { editComment, isEditing };
}

export function useUpdateCommentStatus() {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: updateCommentStatusApi,
    onSuccess: async (data) => {
      toast.success(data.message || "Comment status updated!");
      // Use refetch instead of invalidate to force immediate update
      await queryClient.refetchQueries({ queryKey: ["admin-comments"] });
      await queryClient.refetchQueries({ queryKey: ["comments"] });
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  return { updateStatus, isUpdatingStatus };
}

// 🔹 Get All Comments (Admin only)
export function useAllComments() {
  const { data, isLoading: isLoadingComments } = useQuery({
    queryKey: ["comments"],
    queryFn: getAllCommentApi,
    retry: false,
    refetchOnWindowFocus: true,
  });

  const { comments, commentsCount } = data || {};
  return { comments, isLoadingComments, commentsCount };
}

// 🔹 Get All Comments for a Product
export function useProductComments(productId) {
  return useQuery({
    queryKey: ["comments", productId],
    queryFn: () => getAllProductCommentsApi(productId),
    enabled: !!productId,
    retry: false,
    refetchOnWindowFocus: true,
  });
}

// 🔹 Get One Comment
export function useOneComment(id) {
  const { data, isLoading: isLoadingOneComment } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => getOneCommentApi(id),
    enabled: !!id,
    retry: false,
  });
  const { comment } = data || {};
  return { comment, isLoadingOneComment };
}
