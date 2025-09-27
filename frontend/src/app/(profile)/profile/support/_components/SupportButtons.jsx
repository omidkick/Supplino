"use client";

import Modal from "@/ui/Modal";
import truncateText from "@/utils/trancateText";
import {
  PlusIcon,
  ArrowUturnLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { useSupportActions } from "@/hooks/useSupports";
import toast from "react-hot-toast";
import Button from "@/ui/Button";
import RHFTextarea from "@/ui/RHFTextarea";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ConfirmDelete from "@/ui/ConfirmDelete";

// Create Coupon
function AddNewTicket({ classNames }) {
  return (
    <Link
      href="/profile/support/create"
      className={`justify-self-end flex gap-x-4 py-3 items-center rounded-lg bg-primary-900 px-4 text-sm font-medium text-white 
      transition-colors hover:bg-primary-700 ${classNames}`}
    >
      <span className="hidden md:block">افزودن تیکت </span>{" "}
      <PlusIcon className="w-5" />
    </Link>
  );
}

// Validation schema for reply form
const replySchema = yup.object({
  message: yup
    .string()
    .min(5, "پیام پاسخ باید حداقل ۵ کاراکتر باشد")
    .required("لطفاً پیام پاسخ را وارد کنید"),
});

// Reply to Ticket Button
function ReplyToTicket({ ticket, classNames = "" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutateAddReply, isAddingReply } = useSupportActions();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(replySchema),
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset(); // Reset form when closing modal
  };

  const handleSubmitReply = (data) => {
    mutateAddReply(
      { id: ticket._id, message: data.message },
      {
        onSuccess: (response) => {
          handleCloseModal();
        },
        onError: (error) => {},
      }
    );
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-700 
          bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors ${classNames}`}
        title="پاسخ به تیکت"
        disabled={isAddingReply}
      >
        <ArrowUturnLeftIcon className="w-4 h-4" />
        <span className="hidden sm:inline">پاسخ</span>
      </button>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={`پاسخ به تیکت: ${truncateText(ticket.title, 30)}`}
      >
        <form onSubmit={handleSubmit(handleSubmitReply)} className="space-y-4">
          <RHFTextarea
            label="پیام پاسخ"
            name="message"
            register={register}
            errors={errors}
            isRequired
            rows={6}
            placeholder="پاسخ خود را وارد کنید..."
            disabled={isAddingReply}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              disabled={isAddingReply}
              className="min-w-[100px]"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!isValid || isAddingReply}
              loading={isAddingReply}
              className="min-w-[100px]"
            >
              ارسال پاسخ
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

// NEW: Delete Ticket Button using ConfirmDelete
function DeleteTicket({ ticket, classNames = "" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutateDeleteTicket, isDeletingTicket } = useSupportActions();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteTicket = () => {
    mutateDeleteTicket(ticket._id, {
      onSuccess: () => {
        handleCloseModal();
        toast.success("تیکت با موفقیت حذف شد");
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "خطا در حذف تیکت");
      },
    });
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 
          bg-red-50 rounded-lg hover:bg-red-100 transition-colors ${classNames}`}
        title="حذف تیکت"
        disabled={isDeletingTicket}
      >
        <TrashIcon className="w-4 h-4" />
        <span className="hidden sm:inline">حذف</span>
      </button>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="حذف تیکت"
        size="sm"
      >
        <ConfirmDelete
          resourceName={ticket.title}
          onClose={handleCloseModal}
          disabled={isDeletingTicket}
          onConfirm={handleDeleteTicket}
        />
      </Modal>
    </>
  );
}
export { AddNewTicket, ReplyToTicket, DeleteTicket };