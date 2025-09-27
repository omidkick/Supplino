"use client";

// Imports
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import RHFTextField from "@/ui/RHFTextField";
import Button from "@/ui/Button";
import Loading from "@/ui/Loading";
import { Spinner } from "@/ui/Spinner";
import { useGetUser } from "@/hooks/useAuth";
import useUpdateProfile from "../useUpdateProfile";
import useUploadAvatar from "../useUploadAvatar";
import RHFTextarea from "@/ui/RHFTextarea";
import Modal from "@/ui/Modal";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { toPersianDigits } from "@/utils/numberFormatter";
import { imageUrlToFile } from "@/utils/fileFormatter";
import { compressImage, checkFileSize } from "@/utils/imageCompression";
import Avatar from "@/ui/Avatar";

// Updated schema - removed phoneNumber validation since it's not editable
const schema = yup.object({
  name: yup.string().required("نام ضروری است"),
  email: yup.string().email("ایمیل نامعتبر است").required("ایمیل ضروری است"),
  biography: yup.string().required("بیوگرافی ضروری است"),
});

function PersonalInfo() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  
  const { data, error, isLoading } = useGetUser();
  const { user } = data || {};
  const router = useRouter();

  // custom hooks
  const { editUser, isUpdating } = useUpdateProfile();
  const { uploadAvatar, isUploading } = useUploadAvatar();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  // prefill the form and avatar
  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatarUrl || null);
      reset({
        name: user.name || "",
        email: user.email || "",
        biography: user.biography || "",
      });
    }
  }, [user, reset]);

  // Handle avatar selection with compression
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("لطفاً یک فایل تصویری انتخاب کنید");
      return;
    }

    // Check file size (before compression)
    if (!checkFileSize(file, 10)) {
      // 10MB limit before compression
      toast.error("حجم فایل نباید بیش از 10 مگابایت باشد");
      return;
    }

    setIsCompressing(true);
    try {
      // Compress the image
      const compressedFile = await compressImage(file, 800, 800, 0.8);

      setAvatarFile(compressedFile);
      setAvatarUrl(URL.createObjectURL(compressedFile));

      toast.success("تصویر با موفقیت فشرده شد");
    } catch (error) {
      console.error("Error compressing image:", error);
      toast.error("خطا در فشرده‌سازی تصویر");
    } finally {
      setIsCompressing(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Handle avatar upload first if there's a new avatar
      if (avatarFile && avatarFile instanceof File) {
        await uploadAvatar(avatarFile);
      } else if (
        avatarUrl &&
        avatarUrl !== user.avatarUrl &&
        !avatarUrl.startsWith("blob:")
      ) {
        const fileFromUrl = await imageUrlToFile(avatarUrl);
        const compressedFile = await compressImage(fileFromUrl, 800, 800, 0.8);
        await uploadAvatar(compressedFile);
      }

      // Update user profile
      editUser(data, {
        onSuccess: () => {
          setIsEditModalOpen(false);
          router.push("/profile/me");
        },
      });
    } catch (err) {
      toast.error(err?.message || "خطا در ذخیره تغییرات");
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);

    // Reset form and avatar to original values when closing
    if (user) {
      setAvatarUrl(user.avatarUrl || null);
      setAvatarFile(null);
      reset({
        name: user.name || "",
        email: user.email || "",
        biography: user.biography || "",
      });
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-500">خطا در دریافت اطلاعات کاربر</p>;

  const isProcessing = isUpdating || isUploading || isCompressing;

  return (
    <div className="bg-secondary-0 p-4 rounded-xl w-full max-w-4xl mx-auto">
      {/* User Info */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-3">
          <h2 className="text-xl font-bold text-primary-700">اطلاعات شخصی</h2>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-x-2 text-green-600 hover:text-green-700 hover:underline px-2 py-1 rounded-md transition-colors"
          >
            <span className="text-sm">ویرایش اطلاعات</span>
            <PencilSquareIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar Section */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar src={user?.avatarUrl} width={120} className="ring-4 ring-secondary-200"  priority={true} />
            <p className="text-lg font-bold text-secondary-700">{user?.name}</p>
          </div>
        </div>

        {/* Current User Info  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-sm font-medium text-secondary-600">
              نام و نام خانوادگی
            </span>
            <div className="p-3 bg-secondary-100 rounded-lg">
              <p className="text-secondary-800">{user?.name || "---"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-secondary-600">
              ایمیل
            </span>
            <div className="p-3 bg-secondary-100 rounded-lg">
              <p className="text-secondary-800">{user?.email || "---"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-secondary-600">
              شماره تماس
            </span>
            <div className="p-3 bg-secondary-100 rounded-lg">
              <p className="text-secondary-800">
                {toPersianDigits(user?.phoneNumber) || "---"}
              </p>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-secondary-600">
              بیوگرافی
            </span>
            <div className="p-3 bg-secondary-100 rounded-lg">
              <p className="text-secondary-800">{user?.biography || "---"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={handleCloseModal}
        title="ویرایش اطلاعات شخصی"
        description="اطلاعات خود را ویرایش کنید"
      >
        <form
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-3 mb-4">
            <label 
              htmlFor="avatarInput"
              className="relative cursor-pointer group"
            >
              <Avatar src={avatarUrl} width={90} priority={false} />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                {isCompressing ? (
                  <div className="text-white text-xs text-center px-2">
                    در حال فشرده‌سازی...
                  </div>
                ) : (
                  <span className="text-white text-xs">ویرایش</span>
                )}
              </div>
            </label>

            <p className="text-sm text-secondary-600 text-center">
              روی تصویر کلیک کنید تا آن را تغییر دهید
            </p>

            {/* Hidden file input with proper association */}
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isCompressing}
              aria-label="انتخاب فایل آواتار"
            />
          </div>

          <RHFTextField
            label="نام و نام خانوادگی"
            name="name"
            register={register}
            errors={errors}
            isRequired
          />

          <RHFTextField
            label="ایمیل"
            name="email"
            type="email"
            register={register}
            errors={errors}
            isRequired
          />

          {/* Phone Number - Disabled field */}
          <RHFTextField
            label="شماره تماس"
            name="phoneNumber"
            register={register}
            errors={errors}
            disabled={true}
            value={user?.phoneNumber || ""}
            className="opacity-60"
          />

          <RHFTextarea
            label="بیوگرافی"
            name="biography"
            register={register}
            errors={errors}
            isRequired
          />

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={handleCloseModal}
              className="flex-1"
              disabled={isProcessing}
            >
              انصراف
            </Button>

            <Button
              variant="primary"
              type="submit"
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? <Spinner className="w-4 h-4 mr-2" /> : null}
              ذخیره تغییرات
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default PersonalInfo;