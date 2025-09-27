"use client";

import Button from "@/ui/Button";
import RHFTextField from "@/ui/RHFTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import Loading from "@/ui/Loading";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import FileInput from "@/ui/FileInput";
import { useState } from "react";

// Create a function that returns the validation schema
const getSchema = (isEditSession = false, hasExistingImage = false) => {
  return yup
    .object({
      title: yup
        .string()
        .min(3, "عنوان باید حداقل ۳ کاراکتر باشد")
        .required("عنوان ضروری است"),
      englishTitle: yup
        .string()
        .min(3, "عنوان انگلیسی باید حداقل ۳ کاراکتر باشد")
        .required("عنوان انگلیسی ضروری است"),
      description: yup
        .string()
        .min(5, "توضیحات باید حداقل ۵ کاراکتر باشد")
        .required("توضیحات ضروری است"),
      categoryImage: yup
        .mixed()
        .test("fileRequired", "تصویر دسته بندی الزامی است", (value) => {
          // For edit, it's optional if we already have an image
          if (isEditSession && hasExistingImage) return true;
          return value instanceof File;
        }),
    })
    .required();
};

function AddCategoryForm({ categoryToEdit = {}, onCloseModal }) {
  const { _id: editId, imageUrl: prevImageUrl } = categoryToEdit;
  const isEditSession = Boolean(editId);
  const hasExistingImage = Boolean(prevImageUrl);

  const { title, englishTitle, description } = categoryToEdit;

  let editValues = {};

  // If editing, set default values
  if (isEditSession) {
    editValues = {
      title,
      englishTitle,
      description,
    };
  }

  const { addCategory, updateCategoryById, isAdding, isUpdating } =
    useCategories();
  const router = useRouter();
  const [categoryImageUrl, setCategoryImageUrl] = useState(
    prevImageUrl || null
  );
  const [showPreview, setShowPreview] = useState(true);

  // Get the schema based on whether we're editing and if there's an existing image
  const schema = getSchema(isEditSession, hasExistingImage);

  // RHF (React Hook Form)
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: editValues,
  });

  // Handle Form Submit
  const onSubmit = (data) => {
    const formData = new FormData();

    // Add all form fields
    for (const key in data) {
      if (key !== "categoryImage") {
        formData.append(key, data[key]);
      }
    }

    // Add category image
    if (data.categoryImage instanceof File) {
      formData.append("categoryImage", data.categoryImage);
    }

    // Always set type to "product"
    formData.append("type", "product");

    if (isEditSession) {
      updateCategoryById(
        { id: editId, data: formData },
        {
          onSuccess: () => {
            router.refresh("/admin/categories");
            if (onCloseModal) onCloseModal();
          },
        }
      );
    } else {
      addCategory(formData, {
        onSuccess: () => {
          router.push("/admin/categories");
        },
      });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
      <RHFTextField
        label="عنوان"
        name="title"
        register={register}
        isRequired
        errors={errors}
      />

      {/* English Title */}
      <RHFTextField
        label="عنوان انگلیسی"
        name="englishTitle"
        register={register}
        isRequired
        errors={errors}
      />

      {/* Description */}
      <div className="md:col-span-2">
        <RHFTextField
          label="توضیحات"
          name="description"
          register={register}
          isRequired
          errors={errors}
        />
      </div>

      {/* Category Image Input */}
      <div className="md:col-span-2">
        <Controller
          name="categoryImage"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FileInput
              label="تصویر دسته بندی"
              name="categoryImage"
              isRequired={!isEditSession}
              errors={errors}
              onChange={(file) => {
                onChange(file);
                setCategoryImageUrl(file ? URL.createObjectURL(file) : null);
              }}
              showPreview={showPreview}
              setShowPreview={setShowPreview}
              coverImageUrl={categoryImageUrl}
            />
          )}
        />
      </div>

      {/* Submit Button || Loading */}
      <div className="md:col-span-2 lg:w-1/2 lg:mx-auto">
        {isAdding || isUpdating ? (
          <Loading />
        ) : (
          <Button variant="primary" type="submit" className="w-full mt-2">
            {isEditSession ? "ویرایش" : "افزودن"} دسته بندی
          </Button>
        )}
      </div>
    </form>
  );
}

export default AddCategoryForm;
