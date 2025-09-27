"use client";

import Button from "@/ui/Button";
import RHFTextField from "@/ui/RHFTextField";
import RHFTextarea from "@/ui/RHFTextarea";
import RHFSelect from "@/ui/RHFSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Loading from "@/ui/Loading";
import { useRouter } from "next/navigation";
import {
  ChatBubbleLeftRightIcon,
  TagIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useSupportActions } from "@/hooks/useSupports";

// Front-End Validation Schema
const schema = yup
  .object({
    title: yup
      .string()
      .min(5, "حداقل ۵ کاراکتر را وارد کنید")
      .max(100, "حداکثر ۱۰۰ کاراکتر مجاز است")
      .required("عنوان تیکت ضروری است"),
    category: yup.string().required("دسته‌بندی تیکت ضروری است"),
    priority: yup.string().required("اولویت تیکت ضروری است"),
    description: yup
      .string()
      .min(10, "حداقل ۱۰ کاراکتر را وارد کنید")
      .required("شرح تیکت ضروری است"),
  })
  .required();

function AddTicketForm() {
  const router = useRouter();

  // Use the support actions hook
  const { mutateCreateTicket, isCreatingTicket, createTicketError } =
    useSupportActions();

  // RHF
  const {
    register,
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  // Handle Submit Form (Create A New Ticket)
  const onSubmit = (data) => {
    // Call the mutation from the hook
    mutateCreateTicket(data, {
      onSuccess: () => {
        reset();
        router.push("/profile/support");
      },
    });
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="py-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900 flex items-center gap-2 sm:gap-3">
            <ChatBubbleLeftRightIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex-shrink-0" />
            <span className="truncate">افزودن تیکت جدید</span>
          </h2>
          <p className="text-secondary-500 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
            مشخصات تیکت جدید را وارد کنید
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
                {/* Title */}
                <RHFTextField
                  label="عنوان تیکت"
                  name="title"
                  register={register}
                  isRequired
                  errors={errors}
                  placeholder="موضوع درخواست خود را بنویسید"
                />

                {/* Category */}
                <RHFSelect
                  label="دسته‌بندی"
                  name="category"
                  register={register}
                  errors={errors}
                  isRequired
                  options={[
                    { _id: "technical", title: "فنی" },
                    { _id: "billing", title: "مالی" },
                    { _id: "general", title: "عمومی" },
                    { _id: "feature_request", title: "درخواست ویژگی" },
                    { _id: "bug", title: "گزارش خطا" },
                  ]}
                />

                {/* Priority */}
                <RHFSelect
                  label="اولویت"
                  name="priority"
                  register={register}
                  errors={errors}
                  isRequired
                  options={[
                    { _id: "low", title: "کم" },
                    { _id: "medium", title: "متوسط" },
                    { _id: "high", title: "بالا" },
                    { _id: "urgent", title: "فوری" },
                  ]}
                />
              </div>
            </div>

            {/* Description */}
            <div className="">
              <h3 className="text-base sm:text-lg font-semibold text-secondary-800 mb-3 sm:mb-4 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                شرح تیکت
              </h3>

              <div className="bg-secondary-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <RHFTextarea
                  label="شرح کامل درخواست"
                  name="description"
                  register={register}
                  isRequired
                  errors={errors}
                  rows={6}
                  placeholder="شرح کامل درخواست خود را به همراه جزئیات بنویسید"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 ">
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              {isCreatingTicket ? (
                <div className="w-full max-w-md">
                  <Loading />
                </div>
              ) : (
                <>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!isValid || isCreatingTicket}
                    className={`w-full sm:w-auto sm:min-w-[200px] font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 transform hover:-transecondary-y-1 text-sm sm:text-base ${
                      isValid && !isCreatingTicket
                        ? "bg-primary-900 hover:bg-primary-800 text-white hover:shadow-xl"
                        : "bg-secondary-300 text-secondary-500 cursor-not-allowed"
                    }`}
                  >
                    ارسال تیکت
                  </Button>

                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => router.push("/profile/support")}
                    className="w-full sm:w-auto sm:min-w-[200px] text-sm sm:text-base"
                    disabled={isCreatingTicket}
                  >
                    انصراف
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Error Message */}
          {createTicketError && (
            <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-xs sm:text-sm font-medium">
                {createTicketError.message || "خطا در ایجاد تیکت"}
              </p>
            </div>
          )}

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

export default AddTicketForm;
