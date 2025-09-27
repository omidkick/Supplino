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
import { useProductActions } from "@/hooks/useProducts";

// Create Product
export function AddNewProduct({ classNames }) {
  return (
    <Link
      href="/admin/products/add"
      className={`justify-self-end flex gap-x-4 py-3 items-center rounded-lg bg-primary-900 px-4 text-sm font-medium text-white 
      transition-colors hover:bg-primary-700 ${classNames}`}
    >
      <span className="hidden md:block">افزودن محصول</span>{" "}
      <PlusIcon className="w-5" />
    </Link>
  );
}

// Delete Product
export function DeleteProduct({ product: { _id: id, title } }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutateRemoveProduct, isRemovingProduct } = useProductActions();
  return (
    <>
      <ButtonIcon variant="red" onClick={() => setOpen(true)}>
        <TrashIcon />
      </ButtonIcon>

      <Modal
        title={`حذف ${truncateText(title, 25)}`}
        open={open}
        onClose={() => setOpen(false)}
      >
        <ConfirmDelete
          resourceName={truncateText(title, 25)}
          onClose={() => setOpen(false)}
          onConfirm={(e) => {
            e.preventDefault();
            mutateRemoveProduct(id, {
              onSuccess: () => {
                setOpen(false);
                router.refresh("/admin/products");
              },
            });
          }}
          disabled={isRemovingProduct}
        />
      </Modal>
    </>
  );
}

// Edit Product
export function EditProduct({ id }) {
  return (
    <Link href={`/admin/products/${id}/edit`}>
      <ButtonIcon variant="edit">
        <PencilSquareIcon />
      </ButtonIcon>
    </Link>
  );
}
