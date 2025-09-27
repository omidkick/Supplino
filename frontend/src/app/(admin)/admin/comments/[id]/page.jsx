"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { toPersianDigits } from "@/utils/numberFormatter";
import { toLocalDateShort } from "@/utils/dateFormatter";
import Fallback from "@/ui/Fallback";
import Empty from "@/ui/Empty";
import {
  ChatBubbleLeftIcon,
  UserIcon,
  ShoppingBagIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ClockIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import BackButton from "@/ui/BackButton";
import { useOneComment } from "@/hooks/useComment"; // Assuming the hook is exported from useComment.js
import Modal from "@/ui/Modal";
import {
  ChangeStatusComment2,
  DeleteComment,
} from "../_components/CommentButtons";
import UpdateCommentForm from "../_components/UpdateCommentForm";

// Comment status options (inspired from UpdateCommentForm and statusStyle)
const COMMENT_STATUS_OPTIONS = [
  { value: 0, label: "رد شده" },
  { value: 1, label: "در انتظار تایید" },
  { value: 2, label: "تایید شده" },
];

const statusStyles = {
  0: { label: "رد شده", className: "badge badge--danger" },
  1: { label: "در انتظار تایید", className: "badge badge--yellow" },
  2: { label: "تایید شده", className: "badge badge--success" },
};

function CommentDetails() {
  const { id } = useParams();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { comment, isLoadingOneComment } = useOneComment(id);

  // Loading state
  if (isLoadingOneComment) {
    return (
      <div className="min-h-screen bg-secondary-100 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <Fallback />
          </div>
        </div>
      </div>
    );
  }

  // Error or empty state
  if (!comment) {
    return (
      <div className="min-h-screen bg-secondary-100 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <Empty resourceName="جزئیات نظر" />
        </div>
      </div>
    );
  }

  const {
    _id,
    content,
    user,
    product,
    status,
    openToComment,
    likes,
    dislikes,
    createdAt,
    updatedAt,
    answers,
  } = comment;

  const statusInfo = statusStyles[status] || {
    label: "نامشخص",
    className: "badge badge--secondary",
  };

  const currentStatusLabel =
    COMMENT_STATUS_OPTIONS.find((opt) => opt.value === status)?.label ||
    "نامشخص";

  return (
    <div className="min-h-screen bg-secondary-100">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-x-2 mb-2">
                <BackButton arrowClassName="md:w-6 md:h-6" />
                <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">
                  جزئیات نظر
                </h1>
              </div>
              <p className="text-secondary-600 text-sm md:text-base">
                مشاهده کامل اطلاعات نظر و پاسخ‌ها
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="badge badge--primary text-sm">
                شناسه نظر: {toPersianDigits(_id)}
              </div>
              <div className={statusInfo.className}>{statusInfo.label}</div>
            </div>
          </div>
        </div>

        {/* Comment Status with Action Button */}
        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 p-2 rounded-lg">
                <ChatBubbleLeftIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-secondary-900">
                  وضعیت نظر
                </h2>
                <p className="text-secondary-600 text-sm">
                  وضعیت فعلی: {currentStatusLabel}
                </p>
              </div>
            </div>
            <ChangeStatusComment2 comment={comment} />
          </div>

          {/* Simple status display, inspired by OrderStatusTracker but simplified */}
          <div className="bg-secondary-0 rounded-2xl p-4 border border-secondary-200">
            <div className="flex items-center justify-between">
              <span className="text-secondary-700">باز برای پاسخ: </span>
              <span className="font-bold">{openToComment ? "بله" : "خیر"}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-secondary-700">لایک‌ها: </span>
              <span className="font-bold">{toPersianDigits(likes.length)}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-secondary-700">دیسلایک‌ها: </span>
              <span className="font-bold">
                {toPersianDigits(dislikes.length)}
              </span>
            </div>
          </div>
        </div>

        {/* Comment Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
          {/* Main Comment Details Card */}
          <div className="bg-secondary-0 rounded-2xl shadow-lg p-4 md:p-6 border border-secondary-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary-100 p-2 rounded-lg">
                <ChatBubbleLeftIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-secondary-900">
                محتوای نظر اصلی
              </h2>
            </div>
            <p className="text-secondary-800 mb-4">{content.text}</p>
            <div className="space-y-2 text-sm text-secondary-600">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                ایجاد شده: {toLocalDateShort(createdAt)}
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                بروزرسانی: {toLocalDateShort(updatedAt)}
              </div>
              <div className="flex items-center gap-2">
                <HandThumbUpIcon className="w-4 h-4" />
                لایک‌ها: {toPersianDigits(likes.length)}
              </div>
              <div className="flex items-center gap-2">
                <HandThumbDownIcon className="w-4 h-4" />
                دیسلایک‌ها: {toPersianDigits(dislikes.length)}
              </div>
            </div>
          </div>

          {/* User and Product Details Card */}
          <div className="bg-secondary-0 rounded-2xl shadow-lg p-4 md:p-6 border border-secondary-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary-100 p-2 rounded-lg">
                <UserIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-secondary-900">
                اطلاعات کاربر و محصول
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {user.avatarUrl && (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <div>
                  <span className="font-bold text-secondary-900">
                    کاربر: {user.name}
                  </span>
                  <p className="text-sm text-secondary-600">
                    شناسه: {user._id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBagIcon className="w-5 h-5 text-primary-600" />
                <span className="font-bold text-secondary-900">
                  محصول: {product.title}
                </span>
                <a
                  href={`/products/${product.slug}`}
                  className="text-primary-600 hover:underline text-sm"
                >
                  مشاهده محصول
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary-100 p-2 rounded-lg">
              <ChatBubbleLeftIcon className="w-6 h-6 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-secondary-900">
              پاسخ‌ها ({toPersianDigits(answers.length)})
            </h2>
          </div>
          <div className="space-y-4">
            {answers.length === 0 ? (
              <p className="text-center text-secondary-600">
                هیچ پاسخی وجود ندارد
              </p>
            ) : (
              answers.map((answer) => (
                <div
                  key={answer._id}
                  className="bg-secondary-0 rounded-xl p-4 border border-secondary-200 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {answer.user.avatarUrl && (
                          <Image
                            src={answer.user.avatarUrl}
                            alt={answer.user.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        )}
                        <span className="font-bold text-secondary-900">
                          {answer.user.name}
                        </span>
                        <span className="text-sm text-secondary-600">
                          {toLocalDateShort(answer.createdAt)}
                        </span>
                      </div>
                      <p className="text-secondary-800">
                        {answer.content.text}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-secondary-600">
                        <div className="flex items-center gap-1">
                          <HandThumbUpIcon className="w-4 h-4" />
                          {toPersianDigits(answer.likes.length)}
                        </div>
                        <div className="flex items-center gap-1">
                          <HandThumbDownIcon className="w-4 h-4" />
                          {toPersianDigits(answer.dislikes.length)}
                        </div>
                      </div>
                    </div>
                    <DeleteComment comment={answer} />{" "}
                    {/* Use DeleteComment for answers */}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status Update Modal (using ChangeStatusComment for simplicity) */}
        <Modal
          open={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          title="تغییر وضعیت نظر"
        >
          <UpdateCommentForm
            comment={comment}
            onClose={() => setIsStatusModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  );
}

export default CommentDetails;
