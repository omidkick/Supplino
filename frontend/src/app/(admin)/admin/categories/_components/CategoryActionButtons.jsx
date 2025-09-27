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
import AddCategoryForm from "../add/components/AddCategoryForm";
import { useCategories } from "@/hooks/useCategories";

// Create Category
export function AddNewCategory({ classNames }) {
  return (
    <Link
      href="/admin/categories/add"
      className={`justify-self-end flex gap-x-4 py-3 items-center rounded-lg bg-primary-900 px-4 text-sm font-medium text-white 
      transition-colors hover:bg-primary-700 ${classNames}`}
    >
      <span className="hidden md:block">افزودن دسته بندی</span>{" "}
      <PlusIcon className="w-5" />
    </Link>
  );
}

// Delete Category
export function DeleteCategory({ category: { _id: id, title } }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { removeCategoryById, isDeleting } = useCategories();
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
            removeCategoryById(id, {
              onSuccess: () => {
                setOpen(false);
                router.refresh("/admin/categories");
              },
            });
          }}
          disabled={isDeleting}
        />
      </Modal>
    </>
  );
}


// Edit Category
export function EditCategory({ category }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ButtonIcon variant="edit" onClick={() => setOpen(true)}>
        <PencilSquareIcon />
      </ButtonIcon>

      <Modal
        title={
          <span>
            ویرایش دسته‌بندی:{" "}
            <span className="font-bold text-primary-900">{category.title}</span>
          </span>
        }
        open={open}
        onClose={() => setOpen(false)}
      >
        <AddCategoryForm
          categoryToEdit={category}
          onCloseModal={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
