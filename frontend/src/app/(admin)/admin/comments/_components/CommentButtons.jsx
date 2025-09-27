"use client";

import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import ButtonIcon from "@/ui/ButtonIcon";
import ConfirmDelete from "@/ui/ConfirmDelete";
import Modal from "@/ui/Modal";
import truncateText from "@/utils/trancateText";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteComment } from "@/hooks/useComment";
import UpdateCommentForm from "./UpdateCommentForm";
import Button from "@/ui/Button";

// ===== Delete Comment =====
export function DeleteComment({ comment: { _id: id, content } }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { deleteComment, isDeleting } = useDeleteComment();

  const previewText = truncateText(content?.text || "نظر", 25);

  return (
    <>
      <ButtonIcon variant="red" onClick={() => setOpen(true)}>
        <TrashIcon />
      </ButtonIcon>

      <Modal
        title={`حذف ${previewText}`}
        open={open}
        onClose={() => setOpen(false)}
      >
        <ConfirmDelete
          resourceName={previewText}
          onClose={() => setOpen(false)}
          onConfirm={(e) => {
            e.preventDefault();
            deleteComment(
              id,
              {
                onSuccess: () => {
                  setOpen(false);
                  router.refresh();
                },
              }
            );
          }}
          disabled={isDeleting}
        />
      </Modal>
    </>
  );
}

// ===== Update Comment =====
export function ChangeStatusComment({ comment }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ButtonIcon variant="edit" onClick={() => setOpen(true)}>
        <PencilSquareIcon />
      </ButtonIcon>

      <Modal title="ویرایش نظر" open={open} onClose={() => setOpen(false)}>
        <UpdateCommentForm comment={comment} onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export function ChangeStatusComment2({ comment }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)} className="flex items-center gap-x-2">
        <PencilSquareIcon className="w-6 h-6"/>
        <span>تغییر وضعیت نظر</span>
      </Button>

      <Modal title="ویرایش نظر" open={open} onClose={() => setOpen(false)}>
        <UpdateCommentForm comment={comment} onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}
