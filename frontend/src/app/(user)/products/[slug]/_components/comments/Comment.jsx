"use client";

import { useState, useEffect, useRef } from "react";
import {
  useProductComments,
  useAddComment,
  useLikeComment,
  useDeleteComment,
} from "@/hooks/useComment";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";
import { toPersianDigits } from "@/utils/numberFormatter";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import {
  HeartIcon as HeartOutline,
  HeartIcon as HeartSolid,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";
import {
  PaperAirplaneIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

// UI Components
import Avatar from "@/ui/Avatar";
import Button from "@/ui/Button";
import TextArea from "@/ui/TextArea";
import Loader from "@/ui/Loader";
import Modal from "@/ui/Modal";

// Custom user hook
import { useGetUser } from "@/hooks/useAuth";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

function Comment({ productId }) {
  const { data, isLoading: isLoadingUser } = useGetUser();
  const { user } = data || {};
  const commentTextareaRef = useRef(null);
  const replyTextareaRef = useRef(null);
  const {
    data: comments,
    isLoading,
    isError,
    refetch,
  } = useProductComments(productId);
  const { addComment, isAdding } = useAddComment(productId);
  const { likeComment } = useLikeComment(productId);
  const { deleteComment, isDeleting } = useDeleteComment(productId);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [isDeletingAnswer, setIsDeletingAnswer] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error("لطفا متن نظر را وارد کنید");
      return;
    }

    addComment(
      {
        text: newComment,
        productId,
      },
      {
        onSuccess: () => {
          setNewComment("");
          setIsModalOpen(false);
          refetch();
        },
      }
    );
  };

  const handleReply = (commentId) => {
    if (!replyContent.trim()) {
      toast.error("لطفا متن پاسخ را وارد کنید");
      return;
    }

    addComment(
      {
        text: replyContent,
        productId,
        parentId: commentId,
      },
      {
        onSuccess: () => {
          setReplyingTo(null);
          setReplyContent("");
          refetch();
        },
      }
    );
  };

  const handleLike = (commentId, isLiked) => {
    likeComment(
      {
        id: commentId,
        isLiked,
      },
      {
        onSuccess: () => refetch(),
      }
    );
  };

  const handleDelete = (commentId, isAnswer = false) => {
    setDeleteCommentId(commentId);
    setIsDeletingAnswer(isAnswer);
  };

  const confirmDelete = () => {
    deleteComment(deleteCommentId, {
      onSuccess: () => {
        setDeleteCommentId(null);
        setIsDeletingAnswer(false);
        refetch();
      },
      onError: () => {
        setDeleteCommentId(null);
        setIsDeletingAnswer(false);
      },
    });
  };

  useEffect(() => {
    if (isModalOpen && commentTextareaRef.current) {
      commentTextareaRef.current.focus();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (replyingTo && replyTextareaRef.current) {
      replyTextareaRef.current.focus();
    }
  }, [replyingTo]);

  const handleCommentKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const handleReplyKeyPress = (e, commentId) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleReply(commentId);
    }
  };

  if (isLoading)
    return <Loader className="my-8" message="در حال بارگذاری نظرات..." />;
  if (isError)
    return (
      <div className="text-red-500 text-center py-8">خطا در بارگذاری نظرات</div>
    );

  return (
    <div className="mt-12">
      <div className="border-b border-secondary-200 pb-4 mb-6 flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-extrabold text-secondary-900">
          نظرات کاربران
          {comments?.length > 0 && (
            <span className="text-sm md:text-base font-normal text-secondary-500 mr-2">
              ({toPersianDigits(comments.length)} نظر)
            </span>
          )}
        </h3>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="sm"
          className="flex items-center gap-1 shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="hidden md:block">افزودن نظر</span>
        </Button>
      </div>

      {/* Comment Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="ثبت نظر جدید"
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Avatar src={user?.avatarUrl} alt={user?.name} size="lg" />
          </div>
          <div className="flex-1 space-y-4">
            <TextArea
              ref={commentTextareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleCommentKeyPress}
              placeholder="نظر خود را درباره این محصول بنویسید... (Ctrl+Enter برای ارسال)"
              rows={5}
              className="w-full bg-secondary-0 text-secondary-800 border-secondary-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
              id="modal-comment"
              name="modal-comment"
            />
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="shadow-sm text-sm"
              >
                انصراف
              </Button>
              <Button
                onClick={handleAddComment}
                loading={isAdding}
                disabled={isAdding}
                variant="primary"
                className="flex items-center justify-center gap-x-2 shadow-sm text-sm"
              >
                <PaperAirplaneIcon className="w-4 h-4 mr-1" />
                ارسال نظر
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={!!deleteCommentId}
        onClose={() => {
          setDeleteCommentId(null);
          setIsDeletingAnswer(false);
        }}
        resourceName={isDeletingAnswer ? "پاسخ" : "نظر"}
        disabled={isDeleting}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      {/* Comments list */}
      <div className="space-y-0">
        {comments?.length === 0 ? (
          <div className="text-center py-12 text-secondary-500 bg-secondary-50 rounded-xl mb-8">
            هنوز نظری برای این محصول ثبت نشده است
          </div>
        ) : (
          <AnimatePresence>
            {comments?.map((comment, commentIndex) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {/* Main comment */}
                <div className="flex gap-4 py-6 relative">
                  {/* Avatar */}
                  <div className="flex-shrink-0 relative z-10">
                    <Avatar
                      src={comment.user.avatarUrl}
                      alt={comment.user.name}
                      size="md"
                      width={42}
                    />
                  </div>

                  {/* Comment content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-secondary-900 text-sm">
                          {user?._id === comment.user._id
                            ? "شما"
                            : comment.user.name}
                        </span>
                        <span className="text-secondary-400 text-xs">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: faIR,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Comment text */}
                    <p className="text-secondary-700 text-sm leading-relaxed mb-3">
                      {comment.content.text}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                      <motion.button
                        onClick={() => handleLike(comment._id, comment.isLiked)}
                        className="flex items-center gap-1 text-sm text-secondary-500 hover:text-red-500 transition-colors"
                        whileTap={{ scale: 1.1 }}
                      >
                        <motion.div
                          animate={{ scale: comment.isLiked ? [1, 1.2, 1] : 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {comment.isLiked ? (
                            <HeartSolid className="w-4 h-4 text-red-500 fill-current" />
                          ) : (
                            <HeartOutline className="w-4 h-4" />
                          )}
                        </motion.div>
                        {comment.likes?.length > 0 && (
                          <span className="text-xs">
                            {toPersianDigits(comment.likes.length)}
                          </span>
                        )}
                      </motion.button>

                      <motion.button
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment._id ? null : comment._id
                          )
                        }
                        className="flex items-center gap-1 text-sm text-secondary-500 hover:text-primary-600 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        <ArrowUturnRightIcon className="w-4 h-4" />
                        <span className="text-xs">پاسخ</span>
                      </motion.button>

                      {user?._id === comment.user._id && (
                        <motion.button
                          onClick={() => handleDelete(comment._id, false)}
                          className="flex items-center gap-1 text-sm text-secondary-400 hover:text-red-600 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          title="حذف نظر"
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span className="text-xs">حذف</span>
                        </motion.button>
                      )}
                    </div>

                    {/* Reply form */}
                    <AnimatePresence>
                      {replyingTo === comment._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4"
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0">
                              <Avatar
                                src={user?.avatarUrl}
                                alt={user?.name}
                                size="sm"
                                width={36}
                              />
                            </div>
                            <div className="flex-1">
                              <TextArea
                                ref={replyTextareaRef}
                                value={replyContent}
                                onChange={(e) =>
                                  setReplyContent(e.target.value)
                                }
                                onKeyDown={(e) =>
                                  handleReplyKeyPress(e, comment._id)
                                }
                                placeholder="پاسخ خود را بنویسید... (Ctrl+Enter برای ارسال)"
                                rows={2}
                                className="w-full text-sm text-secondary-800 border-secondary-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-200"
                                id={`reply-${comment._id}`}
                                name={`reply-${comment._id}`}
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <Button
                                  onClick={() => setReplyingTo(null)}
                                  variant="ghost"
                                  size="xs"
                                >
                                  انصراف
                                </Button>
                                <Button
                                  onClick={() => handleReply(comment._id)}
                                  loading={isAdding}
                                  disabled={isAdding}
                                  variant="primary"
                                  size="xs"
                                  className="flex items-center gap-1"
                                >
                                  <PaperAirplaneIcon className="w-3 h-3" />
                                  ارسال
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Vertical line for replies */}
                  {comment.answers?.length > 0 && (
                    <div
                      className="absolute right-5 top-16 w-0.5 bg-secondary-200"
                      style={{
                        height: `${comment.answers.length * 120 + 20}px`,
                        zIndex: 1,
                      }}
                    />
                  )}
                </div>

                {/* Replies */}
                {comment.answers?.length > 0 && (
                  <div className="relative">
                    <AnimatePresence>
                      {comment.answers.map((answer, answerIndex) => (
                        <motion.div
                          key={answer._id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-4 py-4 relative"
                          style={{ marginRight: "48px" }}
                        >
                          {/* Horizontal connector line */}
                          <div className="absolute right-[-27px] top-8 w-6 h-0.5 bg-secondary-200 z-1" />

                          {/* Avatar */}
                          <div className="flex-shrink-0 relative z-10">
                            <Avatar
                              src={answer.user.avatarUrl}
                              alt={answer.user.name}
                              size="sm"
                              width={36}
                            />
                          </div>

                          {/* Reply content */}
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-secondary-900 text-sm">
                                  {user?._id === answer.user._id
                                    ? "شما"
                                    : answer.user.name}
                                </span>
                                <span className="text-secondary-500 text-xs">
                                  {formatDistanceToNow(
                                    new Date(answer.createdAt),
                                    {
                                      addSuffix: true,
                                      locale: faIR,
                                    }
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Reply text */}
                            <p className="text-secondary-700 text-sm leading-relaxed mb-3">
                              {answer.content.text}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-6">
                              <motion.button
                                onClick={() =>
                                  handleLike(answer._id, answer.isLiked)
                                }
                                className="flex items-center gap-1 text-sm text-secondary-500 hover:text-red-500 transition-colors"
                                whileTap={{ scale: 1.1 }}
                              >
                                <motion.div
                                  animate={{
                                    scale: answer.isLiked ? [1, 1.2, 1] : 1,
                                  }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {answer.isLiked ? (
                                    <HeartSolid className="w-4 h-4 text-red-500 fill-current" />
                                  ) : (
                                    <HeartOutline className="w-4 h-4" />
                                  )}
                                </motion.div>
                                {answer.likes?.length > 0 && (
                                  <span className="text-xs">
                                    {toPersianDigits(answer.likes.length)}
                                  </span>
                                )}
                              </motion.button>

                              <button className="flex items-center gap-1 text-sm text-secondary-500 hover:text-primary-600 transition-colors">
                                <span className="text-xs">پاسخ</span>
                              </button>

                              {user?._id === answer.user._id && (
                                <motion.button
                                  onClick={() => handleDelete(answer._id, true)}
                                  className="flex items-center gap-1 text-sm text-secondary-400 hover:text-red-600 transition-colors"
                                  whileHover={{ scale: 1.02 }}
                                  title="حذف پاسخ"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                  <span className="text-xs">حذف</span>
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Separator line between comments */}
                {commentIndex < comments.length - 1 && (
                  <div className="border-b border-secondary-100 mx-0" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default Comment;
