"use client";

// Imports
import Button from "@/ui/Button";
import ButtonIcon from "@/ui/ButtonIcon";
import FileInput from "@/ui/FileInput";
import RHFTextField from "@/ui/RHFTextField";
import RHFTextarea from "@/ui/RHFTextarea";
import RHFSelect from "@/ui/RHFSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import Loading from "@/ui/Loading";
import { useRouter } from "next/navigation";
import { imageUrlToFile } from "@/utils/fileFormatter";
import { TagsInput } from "react-tag-input-component";
import { useProductActions } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import MultipleImageInput from "./MultipleImageInput";

// Front-End Validation Schema
const schema = yup
  .object({
    title: yup
      .string()
      .min(3, "حداقل ۳ کاراکتر را وارد کنید")
      .required("عنوان محصول ضروری است"),
    description: yup
      .string()
      .min(10, "حداقل ۱۰ کاراکتر را وارد کنید")
      .required("توضیحات محصول ضروری است"),
    slug: yup.string().required("اسلاگ ضروری است"),
    brand: yup.string().required("برند محصول ضروری است"),
    price: yup
      .number()
      .positive("قیمت باید مثبت باشد")
      .required("قیمت محصول ضروری است")
      .typeError("یک عدد معتبر وارد کنید"),
    offPrice: yup
      .number()
      .positive("قیمت تخفیف باید مثبت باشد")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .typeError("یک عدد معتبر وارد کنید"),
    discount: yup
      .number()
      .min(0, "تخفیف نمی‌تواند منفی باشد")
      .max(100, "تخفیف نمی‌تواند بیشتر از ۱۰۰ درصد باشد")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .typeError("یک عدد معتبر وارد کنید"),
    countInStock: yup
      .number()
      .min(0, "موجودی نمی‌تواند منفی باشد")
      .integer("موجودی باید عدد صحیح باشد")
      .required("موجودی انبار ضروری است")
      .typeError("یک عدد معتبر وارد کنید"),
    category: yup.string().required("دسته بندی ضروری است"),
    // imageLink: yup.string().url("لینک تصویر معتبر نیست").nullable(),
    coverImage: yup
      .mixed()
      .required("تصویر اصلی محصول الزامی است")
      .test(
        "fileRequired",
        "تصویر اصلی محصول الزامی است",
        (value) => value instanceof File
      ),
  })
  .required();

function AddProductForm({ productToEdit = {} }) {
  const { _id: editId } = productToEdit;
  const isEditSession = Boolean(editId);

  const {
    title,
    description,
    slug,
    brand,
    price,
    offPrice,
    discount,
    countInStock,
    category,
    // imageLink,
    coverImage,
    coverImageUrl: prevCoverImageUrl,
    thumbnailUrls = [],
    tags = [],
  } = productToEdit;

  // if we are not editing
  let editValues = {};

  // define previous values in form
  if (isEditSession) {
    editValues = {
      title,
      description,
      slug,
      brand,
      price,
      offPrice: offPrice || "",
      discount: discount || "",
      countInStock,
      category: category?._id || category,
      // imageLink: imageLink || "",
      coverImage,
    };
  }

  const { categories, isLoadingCategories } = useCategories();
  // console.log(categories);
  const [coverImageUrl, setCoverImageUrl] = useState(prevCoverImageUrl || null);
  const [showPreview, setShowPreview] = useState(true);
  const [thumbnails, setThumbnails] = useState([]);
  const [productTags, setProductTags] = useState(tags || []);

  const {
    mutateAddProduct,
    isAddingProduct,
    mutateUpdateProduct,
    isUpdatingProduct,
  } = useProductActions(editId);

  const router = useRouter();

  // RHF
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: editValues,
  });

  // Watch price and offPrice to calculate discount automatically
  const watchedPrice = watch("price");
  const watchedOffPrice = watch("offPrice");

  useEffect(() => {
    if (watchedPrice && watchedOffPrice && watchedPrice > watchedOffPrice) {
      const discountPercentage = Math.round(
        ((watchedPrice - watchedOffPrice) / watchedPrice) * 100
      );
      setValue("discount", discountPercentage);
    }
  }, [watchedPrice, watchedOffPrice, setValue]);

  useEffect(() => {
    if (prevCoverImageUrl) {
      //convert prev link to file
      async function fetchCoverImage() {
        try {
          const file = await imageUrlToFile(prevCoverImageUrl);
          setValue("coverImage", file);
          setCoverImageUrl(URL.createObjectURL(file));
        } catch (error) {
          console.error("Error fetching cover image:", error);
        }
      }
      fetchCoverImage();
    }

    // ✅ Fix thumbnail fetching with proper validation
    // Fix thumbnail initialization
    if (thumbnailUrls?.length > 0) {
      async function fetchThumbnails() {
        const thumbnailPromises = thumbnailUrls.map(async (urlObj) => {
          try {
            // Handle both string URLs and thumbnail objects
            const url =
              typeof urlObj === "string" ? urlObj : urlObj?.url || urlObj?.path;
            if (!url) return null;

            const file = await imageUrlToFile(url);
            return {
              file,
              preview: URL.createObjectURL(file),
              // Preserve original data if available
              ...(typeof urlObj === "object" ? urlObj : {}),
            };
          } catch (error) {
            console.error("Error loading thumbnail:", error);
            return null;
          }
        });

        const loadedThumbnails = (await Promise.all(thumbnailPromises)).filter(
          Boolean
        );
        setThumbnails(loadedThumbnails);
      }
      fetchThumbnails();
    }

    // ✅ Set category in edit mode
    if (isEditSession && category) {
      setValue("category", category._id || category);
    }
  }, [
    editId,
    prevCoverImageUrl,
    thumbnailUrls,
    setValue,
    category,
    isEditSession,
  ]);

  // Handle Submit Form ( Create A New Product || Update A Product)
  const onSubmit = (data) => {
    const formData = new FormData();

    // Add all form fields
    for (const key in data) {
      if (key !== "coverImage" && key !== "thumbnails") {
        formData.append(key, data[key]);
      }
    }

    // Add cover image
    if (data.coverImage instanceof File) {
      formData.append("coverImage", data.coverImage);
    }

    // Add thumbnails
    thumbnails.forEach((thumbnail) => {
      if (thumbnail instanceof File) {
        formData.append("thumbnails", thumbnail);
      }
    });

    // Add tags
    productTags.forEach((tag) => formData.append("tags[]", tag));

    if (isEditSession) {
      mutateUpdateProduct(
        {
          id: editId,
          data: formData,
        },
        {
          onSuccess: () => {
            reset();
            router.push("/admin/products");
          },
        }
      );
    } else {
      mutateAddProduct(formData, {
        onSuccess: () => {
          router.push("/admin/products");
        },
      });
    }
  };

  return (
    <div className="bg-secondary-0 rounded-xl shadow-lg">
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-2xl font-bold text-secondary-800">
          {isEditSession ? "ویرایش محصول" : "افزودن محصول جدید"}
        </h2>
        <p className="text-secondary-600 mt-1">
          {isEditSession
            ? "اطلاعات محصول را ویرایش کنید"
            : "مشخصات محصول جدید را وارد کنید"}
        </p>
      </div>

      <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <RHFTextField
            label="نام محصول"
            name="title"
            register={register}
            isRequired
            errors={errors}
          />

          {/* Brand */}
          <RHFTextField
            label="برند"
            name="brand"
            register={register}
            isRequired
            errors={errors}
          />

          {/* Slug */}
          <RHFTextField
            label="اسلاگ"
            name="slug"
            register={register}
            isRequired
            errors={errors}
          />

          {/* Count In Stock */}
          <RHFTextField
            label="موجودی انبار"
            name="countInStock"
            type="number"
            register={register}
            isRequired
            errors={errors}
          />

          {/* Price */}
          <RHFTextField
            label="قیمت (تومان)"
            name="price"
            type="number"
            register={register}
            isRequired
            errors={errors}
          />

          {/* Off Price */}
          <RHFTextField
            label="قیمت با تخفیف (تومان)"
            name="offPrice"
            type="number"
            register={register}
            errors={errors}
          />

          {/* Discount */}
          <RHFTextField
            label="درصد تخفیف"
            name="discount"
            type="number"
            register={register}
            errors={errors}
          />

          {/* Category Select */}
          <div className="md:col-span-2">
            <RHFSelect
              label="دسته بندی"
              name="category"
              errors={errors}
              isRequired
              register={register}
              options={categories}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <RHFTextarea
              label="توضیحات محصول"
              name="description"
              register={register}
              isRequired
              errors={errors}
              rows={4}
            />
          </div>

          {/* Tags */}
          <div className="md:col-span-2 mb-3">
            <label className="mb-2 block text-secondary-700 font-medium">
              برچسب‌ها{" "}
              <span className="text-secondary-400 font-normal">(اختیاری)</span>
            </label>
            <div
              className={`
      bg-secondary-0 
      border-2 border-secondary-200 
      rounded-lg p-3 
      focus-within:border-primary-500 dark:focus-within:border-primary-400 
      transition-colors
    `}
            >
              <TagsInput
                id="product-tags"
                value={productTags}
                onChange={setProductTags}
                name="tags"
                placeHolder="برچسب جدید اضافه کنید..."
                separators={["Enter", ","]}
                beforeAddValidate={(tag) => tag.length > 0}
                classNames={{
                  input: `
          rtl text-right bg-transparent outline-none 
          flex-1 w-full
          text-secondary-500 
          placeholder-secondary-400 
        `,
                  tag: `
          bg-primary-700 dark:bg-primary-700 
          text-secondary-900 
          px-3 py-1 rounded-full 
          text-sm mx-1 my-1 font-medium
          transition-colors duration-200
        `,
                  tagInput: `
          bg-transparent
        `,
                  selected: `
          rtl flex flex-wrap gap-1
        `,
                }}
              />
            </div>
            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
              Enter یا کاما برای اضافه کردن برچسب استفاده کنید
            </p>
          </div>

          {/* Cover Image Input */}
          <Controller
            name="coverImage"
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <FileInput
                label="تصویر اصلی محصول"
                name="coverImage"
                isRequired
                errors={errors}
                onChange={(file) => {
                  onChange(file);
                  setCoverImageUrl(file ? URL.createObjectURL(file) : null);
                }}
                showPreview={showPreview}
                setShowPreview={setShowPreview}
                coverImageUrl={coverImageUrl}
              />
            )}
          />

          {/* Thumbnails images Input*/}
          <div className="md:col-span-2">
            <Controller
              name="thumbnails"
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <MultipleImageInput
                  value={thumbnails}
                  onChange={(newThumbnails) => {
                    setThumbnails(newThumbnails);
                    onChange(newThumbnails);
                  }}
                  errors={errors}
                  name="thumbnails"
                  label="تصاویر اضافی محصول"
                />
              )}
            />
          </div>
        </div>

        {/* Submit button || Loading */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          {isAddingProduct || isUpdatingProduct ? (
            <div className="w-full max-w-md">
              <Loading />
            </div>
          ) : (
            <>
              <Button
                variant="primary"
                type="submit"
                className="w-full sm:w-auto max-w-md bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {isEditSession ? "ذخیره تغییرات" : "افزودن محصول"}
              </Button>

              {isEditSession && (
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => router.push("/admin/products")}
                  className="w-full sm:w-auto max-w-md bg-secondary-100 hover:bg-secondary-200 text-secondary-800 font-bold py-3 px-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
                >
                  انصراف
                </Button>
              )}
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddProductForm;
