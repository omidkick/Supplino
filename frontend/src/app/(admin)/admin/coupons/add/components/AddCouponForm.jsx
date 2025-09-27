"use client";

import Button from "@/ui/Button";
import RHFTextField from "@/ui/RHFTextField";
import RHFDatePicker from "@/ui/RHFDatePicker";
import RHFSelect from "@/ui/RHFSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import Loading from "@/ui/Loading";
import { useRouter } from "next/navigation";
import { useCoupon } from "@/hooks/useCoupons";
import { useEffect, useState } from "react";
import { useProductActions } from "@/hooks/useProducts";
import {
  TagIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { toPersianNumbers } from "@/utils/toPersianNumbers";
import ProductSelector from "./ProductSelector";

// Front-End Validation Schema
const schema = yup
  .object({
    code: yup
      .string()
      .min(3, "حداقل ۳ کاراکتر را وارد کنید")
      .max(20, "حداکثر ۲۰ کاراکتر مجاز است")
      .matches(/^[a-zA-Z0-9]+$/, "فقط حروف انگلیسی و اعداد مجاز است")
      .required("کد تخفیف ضروری است"),
    type: yup.string().required("نوع تخفیف ضروری است"),
    amount: yup
      .number()
      .positive("مبلغ باید مثبت باشد")
      .when("type", {
        is: "percentage",
        then: (schema) =>
          schema.max(100, "درصد تخفیف نمی‌تواند بیش از ۱۰۰ باشد"),
        otherwise: (schema) =>
          schema.min(1000, "حداقل مبلغ تخفیف ۱۰۰۰ تومان است"),
      })
      .required("مبلغ تخفیف ضروری است")
      .typeError("یک عدد معتبر وارد کنید"),
    usageLimit: yup
      .number()
      .min(1, "ظرفیت استفاده نمی‌تواند کمتر از ۱ باشد")
      .max(10000, "حداکثر ظرفیت ۱۰۰۰۰ مجاز است")
      .integer("ظرفیت باید عدد صحیح باشد")
      .required("ظرفیت استفاده ضروری است")
      .typeError("یک عدد معتبر وارد کنید"),
    expireDate: yup
      .date()
      .min(new Date(), "تاریخ انقضا باید در آینده باشد")
      .required("تاریخ انقضا ضروری است"),
    productIds: yup.array().of(yup.string()).nullable(),
  })
  .required();

function AddCouponForm({ couponToEdit = {} }) {
  const { _id: editId } = couponToEdit;
  const isEditSession = Boolean(editId);

  const {
    code,
    type,
    amount,
    usageLimit,
    expireDate,
    productIds = [],
  } = couponToEdit;

  // Define previous values in form
  let editValues = {};
  if (isEditSession) {
    editValues = {
      code,
      type,
      amount,
      usageLimit,
      expireDate: expireDate ? new Date(expireDate) : "",
      productIds: Array.isArray(productIds)
        ? productIds.map((p) => p._id || p)
        : [],
    };
  }

  const { products, isLoadingProducts } = useProductActions();
  const {
    mutateAddCoupon,
    isAddingCoupon,
    mutateUpdateCoupon,
    isUpdatingCoupon,
  } = useCoupon(editId);

  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState(
    editValues.productIds || []
  );

  // RHF
  const {
    register,
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: editValues,
  });

  // Watch form type to show appropriate label
  const watchedType = useWatch({
    control,
    name: "type",
    defaultValue: type || "",
  });

  // Update productIds in form when selectedProducts changes
  useEffect(() => {
    setValue("productIds", selectedProducts);
  }, [selectedProducts, setValue]);

  // Handle Submit Form (Create A New Coupon || Update A Coupon)
  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      expireDate: data.expireDate.toISOString(),
      productIds: selectedProducts,
    };

    if (isEditSession) {
      mutateUpdateCoupon(
        {
          id: editId,
          data: formattedData,
        },
        {
          onSuccess: () => {
            reset();
            router.push("/admin/coupons");
          },
        }
      );
    } else {
      mutateAddCoupon(formattedData, {
        onSuccess: () => {
          router.push("/admin/coupons");
        },
      });
    }
  };

  const getAmountLabel = () => {
    switch (watchedType) {
      case "percentage":
        return "درصد تخفیف (۱ تا ۱۰۰)";
      case "fixed":
        return "مبلغ تخفیف (تومان)";
      default:
        return "مبلغ تخفیف";
    }
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className=" py-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900 flex items-center gap-2 sm:gap-3">
            <CurrencyDollarIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex-shrink-0" />
            <span className="truncate">
              {isEditSession ? "ویرایش کد تخفیف" : "افزودن کد تخفیف جدید"}
            </span>
          </h2>
          <p className="text-secondary-500 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
            {isEditSession
              ? "اطلاعات کد تخفیف را ویرایش کنید"
              : "مشخصات کد تخفیف جدید را وارد کنید"}
          </p>
        </div>

        <form
          className="py-4 sm:py-6 lg:py-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-6 sm:space-y-8">
            {/* Basic Information */}
            <div className="">
              <h3 className="text-base sm:text-lg font-semibold text-secondary-800 mb-3 sm:mb-4 flex items-center gap-2">
                <TagIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                اطلاعات پایه
              </h3>

              <div className="bg-secondary-50 rounded-lg sm:rounded-xl p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Code */}
                <RHFTextField
                  label="کد تخفیف"
                  name="code"
                  register={register}
                  isRequired
                  errors={errors}
                  placeholder="مثال: SUMMER2024"
                />

                {/* Type */}
                <RHFSelect
                  label="نوع تخفیف"
                  name="type"
                  register={register}
                  errors={errors}
                  isRequired
                  options={[
                    { _id: "percentage", title: "درصدی" },
                    { _id: "fixed", title: "مبلغ ثابت" },
                  ]}
                />

                {/* Amount */}
                <RHFTextField
                  label={getAmountLabel()}
                  name="amount"
                  type="number"
                  register={register}
                  isRequired
                  errors={errors}
                  placeholder={
                    watchedType === "percentage" ? "مثال: 20" : "مثال: 50000"
                  }
                />

                {/* Usage Limit */}
                <RHFTextField
                  label="ظرفیت استفاده"
                  name="usageLimit"
                  type="number"
                  register={register}
                  isRequired
                  errors={errors}
                  placeholder="مثال: 100"
                />
              </div>
            </div>

            {/* Date Selection */}
            <div className="">
              <h3 className="text-base sm:text-lg font-semibold text-secondary-800 mb-3 sm:mb-4 flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                تاریخ انقضا
              </h3>

              <div className="max-w-full sm:max-w-md bg-secondary-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <RHFDatePicker
                  label="تاریخ انقضا کد تخفیف"
                  name="expireDate"
                  control={control}
                  errors={errors}
                  isRequired
                  minDate={new Date()}
                  placeholder="تاریخ انقضا را انتخاب کنید"
                />
              </div>
            </div>

            {/* Product Selection */}
            <div className="">
              <h3 className="text-base sm:text-lg font-semibold text-secondary-800 mb-3 sm:mb-4 flex items-center gap-2">
                <TagIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                انتخاب محصولات
              </h3>
              <div className="bg-secondary-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <ProductSelector
                  control={control}
                  errors={errors}
                  products={products}
                  isLoadingProducts={isLoadingProducts}
                  selectedProducts={selectedProducts}
                  onProductsChange={setSelectedProducts}
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 ">
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              {isAddingCoupon || isUpdatingCoupon ? (
                <div className="w-full max-w-md">
                  <Loading />
                </div>
              ) : (
                <>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!isValid}
                    className={`w-full sm:w-auto sm:min-w-[200px] font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 transform hover:-transecondary-y-1 text-sm sm:text-base ${
                      isValid
                        ? "bg-primary-900 hover:bg-primary-800 text-white hover:shadow-xl"
                        : "bg-secondary-300 text-secondary-500 cursor-not-allowed"
                    }`}
                  >
                    {isEditSession ? "ذخیره تغییرات" : "افزودن کد تخفیف"}
                  </Button>

                  {isEditSession && (
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => router.push("/admin/coupons")}
                      className="w-full sm:w-auto sm:min-w-[200px]  text-sm sm:text-base"
                    >
                      انصراف
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Form Status Indicator */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-xs sm:text-sm font-medium">
                لطفاً خطاهای فرم را برطرف کنید
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddCouponForm;
