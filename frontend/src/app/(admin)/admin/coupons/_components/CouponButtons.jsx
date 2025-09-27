"use client";

import ButtonIcon from "@/ui/ButtonIcon";
import ConfirmDelete from "@/ui/ConfirmDelete";
import Modal from "@/ui/Modal";
import truncateText from "@/utils/trancateText";
import {
  PencilIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCoupon } from "@/hooks/useCoupons";

// Create Coupon
export function AddNewCoupon({ classNames }) {
  return (
    <Link
      href="/admin/coupons/add"
      className={`justify-self-end flex gap-x-4 py-3 items-center rounded-lg bg-primary-900 px-4 text-sm font-medium text-white 
      transition-colors hover:bg-primary-700 ${classNames}`}
    >
      <span className="hidden md:block">افزودن کد تخفیف</span>{" "}
      <PlusIcon className="w-5" />
    </Link>
  );
}

// Delete Coupon
export function DeleteCoupon({ coupon: { _id: id, code } }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutateDeleteCoupon, isDeletingCoupon } = useCoupon();

  return (
    <>
      <ButtonIcon variant="red" onClick={() => setOpen(true)}>
        <TrashIcon />
      </ButtonIcon>

      <Modal
        title={`حذف ${truncateText(code, 25)}`}
        open={open}
        onClose={() => setOpen(false)}
      >
        <ConfirmDelete
          resourceName={truncateText(code, 25)}
          onClose={() => setOpen(false)}
          onConfirm={(e) => {
            e.preventDefault();
            mutateDeleteCoupon(id, {
              onSuccess: () => {
                setOpen(false);
                router.refresh("/admin/coupons");
              },
            });
          }}
          disabled={isDeletingCoupon}
        />
      </Modal>
    </>
  );
}

// Edit Coupon
export function EditCoupon({ id }) {
  return (
    <Link href={`/admin/coupons/${id}/edit`}>
      <ButtonIcon variant="edit">
        <PencilSquareIcon />
      </ButtonIcon>
    </Link>
  );
}